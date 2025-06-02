// backend/src/controllers/productController.js
const { supabase } = require('../config/supabase'); // Asegúrate de que esta ruta sea correcta
const { v4: uuidv4 } = require('uuid'); // Para generar IDs únicos para imágenes

// Obtener todos los productos con paginación, filtro y búsqueda
const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Página actual, por defecto 1
    const limit = parseInt(req.query.limit) || 8; // Productos por página, por defecto 8 (coincide con tu frontend)
    const category = req.query.category; // Categoría para filtrar
    const search = req.query.search; // Término de búsqueda

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit - 1; // Supabase usa rangos inclusivos

    // Iniciar la consulta de Supabase. El 'count: 'exact'' es crucial para obtener el total de resultados.
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' }) // Solicitamos el conteo exacto de filas
      .eq('active', true); // Siempre filtramos por productos activos

    // Aplicar filtro de categoría si se proporciona y no es 'todos'
    if (category && category !== 'todos') {
      query = query.eq('category', category);
    }

    // Aplicar búsqueda si se proporciona un término
    if (search) {
      // Supabase usa `ilike` para búsquedas de texto insensibles a mayúsculas/minúsculas.
      // Puedes combinar múltiples campos con `or`
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Aplicar ordenación (manteniendo tu orden original por 'created_at')
    query = query.order('created_at', { ascending: false });

    // Aplicar paginación (rango)
    const { data: products, count: totalProducts, error } = await query
      .range(startIndex, endIndex); // Rango de filas a obtener

    if (error) {
      console.error('Error al obtener productos desde Supabase:', error.message);
      return res.status(500).json({ error: 'Error al obtener productos desde Supabase.', details: error.message });
    }

    // Devolvemos los productos de la página actual y el total de productos que coinciden con los filtros
    res.status(200).json({ products, totalProducts });

  } catch (error) {
    console.error('Error en el controlador getProducts:', error.message);
    res.status(500).json({ error: 'Error interno del servidor al obtener productos.', details: error.message });
  }
};

// Obtener un producto por ID
const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code === 'PGRST116') {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error('Error al obtener producto por ID:', error.message);
    res.status(500).json({ error: 'Error interno del servidor al obtener el producto.' });
  }
};

// Crear un nuevo producto
const createProduct = async (req, res) => {
  const { name, description, price, category, featured, active } = req.body;
  const files = req.files; // Multer pone los archivos aquí cuando se usa upload.array()

  try {
    const imageUrls = [];

    // 1. Subir cada nueva imagen a Supabase Storage
    if (files && files.length > 0) {
      for (const file of files) {
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `${uuidv4()}.${fileExtension}`; // Nombre único
        const filePath = `product-images/${fileName}`; // Ruta dentro del bucket

        const { data, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file.buffer, {
            contentType: file.mimetype,
            upsert: false, // No sobrescribir si ya existe
          });

        if (uploadError) {
          console.error('Error al subir imagen a Supabase:', uploadError.message);
          throw new Error('Error al subir una de las imágenes.'); // Detener si falla la subida
        }

        // Obtener la URL pública de la imagen
        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        imageUrls.push(publicUrlData.publicUrl);
      }
    }

    // 2. Insertar el producto en la base de datos con todas las URLs de imágenes
    const { data, error: dbError } = await supabase
      .from('products')
      .insert({
        name,
        description,
        price: parseFloat(price),
        category,
        featured: featured === 'true', // Convertir string a boolean
        active: active === 'true',     // Convertir string a boolean
        images: imageUrls, // Guardar el array de URLs
      })
      .select()
      .single();

    if (dbError) throw dbError;

    res.status(201).json(data);
  } catch (error) {
    console.error('Error al crear producto:', error.message);
    res.status(500).json({ error: error.message || 'Error interno del servidor al crear el producto.' });
  }
};

// Actualizar un producto existente
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, featured, active, existingImages } = req.body;
  const newFiles = req.files; // Nuevas imágenes subidas
  let currentImageUrls = [];

  try {
    // 1. Recuperar las URLs de imágenes existentes que se mantuvieron (enviadas desde el frontend)
    // El frontend envía existingImages como un JSON string, hay que parsearlo
    if (existingImages) {
        try {
            currentImageUrls = JSON.parse(existingImages);
            if (!Array.isArray(currentImageUrls)) {
                currentImageUrls = []; // Asegurarse de que sea un array
            }
        } catch (e) {
            console.warn("Error al parsear existingImages:", e.message);
            currentImageUrls = [];
        }
    }

    // 2. Obtener las URLs de imágenes actuales del producto en la base de datos
    const { data: oldProduct, error: fetchOldProductError } = await supabase
        .from('products')
        .select('images')
        .eq('id', id)
        .single();

    if (fetchOldProductError) throw fetchOldProductError;

    const oldImageUrlsInDB = oldProduct.images || [];

    // 3. Identificar imágenes a eliminar del Storage
    const urlsToDelete = oldImageUrlsInDB.filter(url => !currentImageUrls.includes(url));

    if (urlsToDelete.length > 0) {
        const pathsToDelete = urlsToDelete.map(url => {
            const urlParts = url.split('/');
            const bucketIndex = urlParts.indexOf('product-images');
            // Supabase public URLs format: [baseURL]/storage/v1/object/public/bucketName/path/to/file.jpg
            // Need to extract "path/to/file.jpg"
            if (bucketIndex > -1 && urlParts.length > bucketIndex + 1) {
                // Adjust to correctly get the path after 'product-images'
                return urlParts.slice(bucketIndex + 1).join('/');
            }
            return null;
        }).filter(path => path !== null); // Filtrar nulos

        if (pathsToDelete.length > 0) {
            const { error: deleteStorageError } = await supabase.storage
                .from('product-images')
                .remove(pathsToDelete);

            if (deleteStorageError) {
                console.warn('Advertencia: No se pudieron eliminar imágenes antiguas del storage:', deleteStorageError.message);
                // Continuamos a pesar del error de eliminación de storage
            }
        }
    }

    // 4. Subir nuevas imágenes y añadirlas a currentImageUrls
    if (newFiles && newFiles.length > 0) {
      for (const file of newFiles) {
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `${uuidv4()}.${fileExtension}`;
        const filePath = `product-images/${fileName}`;

        const { data, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
          });

        if (uploadError) {
          console.error('Error al subir nueva imagen a Supabase:', uploadError.message);
          throw new Error('Error al subir una de las nuevas imágenes.');
        }

        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        currentImageUrls.push(publicUrlData.publicUrl);
      }
    }

    // 5. Actualizar el producto en la base de datos con la lista combinada de URLs
    const { data, error: dbError } = await supabase
      .from('products')
      .update({
        name,
        description,
        price: parseFloat(price),
        category,
        featured: featured === 'true',
        active: active === 'true',
        images: currentImageUrls, // Lista final de URLs de imágenes
      })
      .eq('id', id)
      .select()
      .single();

    if (dbError) throw dbError;

    res.status(200).json(data);
  } catch (error) {
    console.error('Error al actualizar producto:', error.message);
    res.status(500).json({ error: error.message || 'Error interno del servidor al actualizar el producto.' });
  }
};

// Eliminar un producto
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    // Primero, obtener las URLs de las imágenes del producto para eliminarlas del storage
    const { data: productToDelete, error: fetchError } = await supabase
      .from('products')
      .select('images')
      .eq('id', id)
      .single();

    if (fetchError && fetchError.code === 'PGRST116') {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }
    if (fetchError) throw fetchError;

    const imageUrls = productToDelete.images || [];

    // Eliminar imágenes del Supabase Storage
    if (imageUrls.length > 0) {
        const pathsToDelete = imageUrls.map(url => {
            const urlParts = url.split('/');
            const bucketIndex = urlParts.indexOf('product-images');
            if (bucketIndex > -1 && urlParts.length > bucketIndex + 1) {
                return urlParts.slice(bucketIndex + 1).join('/');
            }
            return null; // En caso de que la URL no tenga el formato esperado
        }).filter(path => path !== null); // Filtrar nulos

        if (pathsToDelete.length > 0) {
            const { error: deleteStorageError } = await supabase.storage
                .from('product-images')
                .remove(pathsToDelete);

            if (deleteStorageError) {
                console.warn('Advertencia: No se pudieron eliminar todas las imágenes del storage:', deleteStorageError.message);
                // No detenemos la operación aquí, ya que el producto debe eliminarse de todos modos
            }
        }
    }

    // Luego, eliminar el producto de la base de datos
    const { error: deleteProductError } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (deleteProductError) throw deleteProductError;
    res.status(204).send(); // No Content
  } catch (error) {
    console.error('Error al eliminar producto:', error.message);
    res.status(500).json({ error: 'Error interno del servidor al eliminar el producto.' });
  }
};

// Nueva función para obtener todas las categorías únicas
const getProductCategories = async (req, res) => {
  try {
    // Obtenemos todas las categorías únicas de los productos activos
    const { data, error } = await supabase
      .from('products')
      .select('category', { distinct: true }) // Selecciona solo la columna 'category' y obtiene valores únicos
      .eq('active', true); // Solo categorías de productos activos

    if (error) throw error;

    // Extraer los valores de categoría de los objetos y filtrarlos si son nulos/vacíos
    const categories = data.map(item => item.category).filter(Boolean); // .filter(Boolean) remueve nulos o vacíos

    res.status(200).json(categories);
  } catch (error) {
    console.error('Error al obtener categorías de productos:', error.message);
    res.status(500).json({ error: 'Error interno del servidor al obtener categorías.', details: error.message });
  }
};


module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductCategories, // ¡Exporta la nueva función!
};