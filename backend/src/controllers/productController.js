// backend/src/controllers/productController.js
const supabase = require('../config/supabase');
const { v4: uuidv4 } = require('uuid');

// Obtener todos los productos con paginación, búsqueda y filtrado
const getProducts = async (req, res) => {
  const { page = 1, limit = 8, category, search, active = 'true' } = req.query; // 'active' por defecto a true
  const startIndex = (parseInt(page) - 1) * parseInt(limit);
  const endIndex = startIndex + parseInt(limit) - 1;

  try {
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' }) // Solicitar un recuento exacto de filas
      .order('created_at', { ascending: false });

    // Filtrar por estado 'active'
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
  const files = req.files;

  try {
    const imageUrls = [];

    if (files && files.length > 0) {
      for (const file of files) {
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `${uuidv4()}.${fileExtension}`;
        const filePath = `product-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
          });

        if (uploadError) {
          console.error('Error al subir imagen a Supabase:', uploadError.message);
          throw new Error('Error al subir una de las imágenes.');
        }

        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        imageUrls.push(publicUrlData.publicUrl);
      }
    }

    const { data, error: dbError } = await supabase
      .from('products')
      .insert({
        name,
        description,
        price: parseFloat(price),
        category,
        featured: featured === 'true',
        active: active === 'true',
        images: imageUrls,
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
  const newFiles = req.files;
  let currentImageUrls = [];

  try {
    if (existingImages) {
      try {
        currentImageUrls = JSON.parse(existingImages);
        if (!Array.isArray(currentImageUrls)) {
          currentImageUrls = [];
        }
      } catch (e) {
        console.warn("Error al parsear existingImages:", e.message);
        currentImageUrls = [];
      }
    }

    const { data: oldProduct, error: fetchOldProductError } = await supabase
      .from('products')
      .select('images')
      .eq('id', id)
      .single();

    if (fetchOldProductError) throw fetchOldProductError;

    const oldImageUrlsInDB = oldProduct.images || [];

    const urlsToDelete = oldImageUrlsInDB.filter(url => !currentImageUrls.includes(url));

    if (urlsToDelete.length > 0) {
      const pathsToDelete = urlsToDelete.map(url => {
        const urlParts = url.split('/');
        const bucketIndex = urlParts.indexOf('product-images');
        if (bucketIndex > -1 && urlParts.length > bucketIndex + 1) {
          return urlParts.slice(bucketIndex + 1).join('/');
        }
        return null;
      }).filter(path => path !== null);

      if (pathsToDelete.length > 0) {
        const { error: deleteStorageError } = await supabase.storage
          .from('product-images')
          .remove(pathsToDelete);

        if (deleteStorageError) {
          console.warn('Advertencia: No se pudieron eliminar imágenes antiguas del storage:', deleteStorageError.message);
        }
      }
    }

    if (newFiles && newFiles.length > 0) {
      for (const file of newFiles) {
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `${uuidv4()}.${fileExtension}`;
        const filePath = `product-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
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

    const { data, error: dbError } = await supabase
      .from('products')
      .update({
        name,
        description,
        price: parseFloat(price),
        category,
        featured: featured === 'true',
        active: active === 'true',
        images: currentImageUrls,
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

    if (imageUrls.length > 0) {
      const pathsToDelete = imageUrls.map(url => {
        const urlParts = url.split('/');
        const bucketIndex = urlParts.indexOf('product-images');
        if (bucketIndex > -1 && urlParts.length > bucketIndex + 1) {
          return urlParts.slice(bucketIndex + 1).join('/');
        }
        return null;
      }).filter(path => path !== null);

      if (pathsToDelete.length > 0) {
        const { error: deleteStorageError } = await supabase.storage
          .from('product-images')
          .remove(pathsToDelete);

        if (deleteStorageError) {
          console.warn('Advertencia: No se pudieron eliminar todas las imágenes del storage:', deleteStorageError.message);
        }
      }
    }

    const { error: deleteProductError } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (deleteProductError) throw deleteProductError;
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar producto:', error.message);
    res.status(500).json({ error: 'Error interno del servidor al eliminar el producto.' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};