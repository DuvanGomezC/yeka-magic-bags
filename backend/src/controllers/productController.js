// backend/src/controllers/productController.js
const supabase = require('../config/supabase');
const { v4: uuidv4 } = require('uuid'); // Para generar IDs únicos para imágenes

// Obtener todos los productos con paginación, búsqueda y filtrado
const getProducts = async (req, res) => {
  // === CORRECCIÓN CLAVE: Eliminar el valor por defecto 'true' para 'active' ===
  // Si 'active' no se envía desde el frontend (cuando se selecciona 'all'),
  // 'active' será 'undefined' aquí, lo que permite que el filtro no se aplique.
  const { page = 1, limit = 8, category, search, active } = req.query;
  const startIndex = (parseInt(page) - 1) * parseInt(limit);
  const endIndex = startIndex + parseInt(limit) - 1;

  try {
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' }) // Solicitar un recuento exacto de filas
      .order('created_at', { ascending: false });

    // Filtrar por estado 'active'
    // Esta lógica es correcta si 'active' es 'true', 'false', o undefined.
    // Si 'active' es undefined (para "Todos"), no se aplica ningún filtro de estado.
    if (active === 'true') {
      query = query.eq('active', true);
    } else if (active === 'false') {
      query = query.eq('active', false);
    }

    // Filtrar por categoría
    if (category && category !== 'todos') {
      query = query.eq('category', category);
    }

    // Búsqueda por nombre o descripción (utilizando `ilike` para búsqueda insensible a mayúsculas/minúsculas)
    if (search) {
      const searchTerm = `%${search.toLowerCase()}%`;
      query = query.or(`name.ilike.${searchTerm},description.ilike.${searchTerm}`);
    }

    // Aplicar paginación
    query = query.range(startIndex, endIndex);

    const { data, error, count } = await query;

    if (error) throw error;

    res.status(200).json({
      products: data,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / parseInt(limit)),
      totalProducts: count,
    });
  } catch (error) {
    console.error('Error al obtener productos:', error.message);
    res.status(500).json({ error: 'Error interno del servidor al obtener productos.' });
  }
};

// Obtener categorías únicas
const getCategories = async (req, res) => {
  try {
    // Solo obtener categorías únicas de productos activos
    const { data, error } = await supabase
      .from('products')
      .select('category')
      .eq('active', true)
      .not('category', 'is', null); // Excluir categorías nulas

    if (error) throw error;

    // Extraer categorías únicas
    const uniqueCategories = [...new Set(data.map(item => item.category))];

    res.status(200).json({ categories: uniqueCategories });
  } catch (error) {
    console.error('Error al obtener categorías:', error.message);
    res.status(500).json({ error: 'Error interno del servidor al obtener categorías.' });
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
  const { name, description, price, category, featured, active, existingImages } = req.body;
  // Convertir featured y active a booleanos correctamente
  const newProduct = { 
    name, 
    description, 
    price, 
    category, 
    featured: featured === 'true', 
    active: active === 'true' 
  };
  const imageUrls = JSON.parse(existingImages || '[]');

  try {
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(async (file) => {
        const fileExtension = file.originalname.split('.').pop();
        const path = `${uuidv4()}.${fileExtension}`; // Genera un ID único para la imagen
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(path, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
          });

        if (error) throw new Error(`Error al subir imagen ${file.originalname}: ${error.message}`);
        // Construye la URL pública directamente
        const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/product-images/${path}`;
        return publicUrl;
      });

      const newImageUrls = await Promise.all(uploadPromises);
      newProduct.images = [...imageUrls, ...newImageUrls];
    } else {
      newProduct.images = imageUrls;
    }

    const { data, error } = await supabase
      .from('products')
      .insert([newProduct])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error al crear producto:', error.message);
    res.status(500).json({ error: 'Error interno del servidor al crear el producto.' });
  }
};

// Actualizar un producto existente
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, featured, active, existingImages } = req.body;
  const updatedProduct = { 
    name, 
    description, 
    price, 
    category, 
    featured: featured === 'true', 
    active: active === 'true' 
  };
  const existingImageUrls = JSON.parse(existingImages || '[]');

  try {
    // Primero, obtener el producto actual para comparar imágenes
    const { data: currentProduct, error: fetchError } = await supabase
      .from('products')
      .select('images')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    const oldImageUrls = currentProduct?.images || [];
    const imagesToDelete = oldImageUrls.filter(url => !existingImageUrls.includes(url));

    // Eliminar imágenes de Supabase Storage que ya no están en existingImages
    if (imagesToDelete.length > 0) {
      const pathsToDelete = imagesToDelete.map(url => {
        const urlParts = url.split('/');
        const bucketIndex = urlParts.indexOf('product-images');
        if (bucketIndex > -1 && urlParts.length > bucketIndex + 1) {
            return urlParts.slice(bucketIndex + 1).join('/');
        }
        return null;
      }).filter(path => path !== null); // Filtrar nulos

      if (pathsToDelete.length > 0) {
        const { error: deleteStorageError } = await supabase.storage
          .from('product-images')
          .remove(pathsToDelete);

        if (deleteStorageError) {
          console.warn('Advertencia: No se pudieron eliminar todas las imágenes del storage:', deleteStorageError.message);
        }
      }
    }

    // Subir nuevas imágenes y añadirlas a las existentes
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(async (file) => {
        const fileExtension = file.originalname.split('.').pop();
        const path = `${uuidv4()}.${fileExtension}`;
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(path, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
          });

        if (error) throw new Error(`Error al subir imagen ${file.originalname}: ${error.message}`);
        const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/product-images/${path}`;
        return publicUrl;
      });

      const newImageUrls = await Promise.all(uploadPromises);
      updatedProduct.images = [...existingImageUrls, ...newImageUrls];
    } else {
      updatedProduct.images = existingImageUrls;
    }

    const { data, error } = await supabase
      .from('products')
      .update(updatedProduct)
      .eq('id', id)
      .select();

    if (error) throw error;
    res.status(200).json(data[0]);
  } catch (error) {
    console.error('Error al actualizar producto:', error.message);
    res.status(500).json({ error: 'Error interno del servidor al actualizar el producto.' });
  }
};

// Eliminar un producto
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    // Primero, obtener las URLs de las imágenes asociadas al producto
    const { data: product, error: fetchProductError } = await supabase
      .from('products')
      .select('images')
      .eq('id', id)
      .single();

    if (fetchProductError) throw fetchProductError;

    // Eliminar las imágenes del storage de Supabase
    if (product && product.images && product.images.length > 0) {
        const pathsToDelete = product.images.map(url => {
            // Extraer el path del archivo de la URL pública
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

// Exportar las funciones
module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
};