// src/pages/AdminDashboard.tsx
import React, { useState, useEffect, useMemo } from 'react';
// *** CAMBIO AQUI: Importa tu instancia configurada de axios ***
import api from '../utils/axiosInstance'; // Asegúrate de que la ruta relativa sea correcta (desde pages a utils)
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from '../context/AuthContext';

// ¡Importa la interfaz Product desde tu archivo de tipos global!
import { Product } from "@/types/product";

const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Estado para el formulario de nuevo/edición de producto
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '', // Usamos string para el input y convertimos a number al enviar
    category: '',
    featured: false,
    active: true,
    images: [] as File[], // Para las nuevas imágenes a subir (objetos File)
    existingImageUrls: [] as string[], // Para URLs de imágenes ya existentes en la DB
  });

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Nuevo estado para el término de búsqueda
  const [searchQuery, setSearchQuery] = useState('');

  // *** CAMBIO AQUI: ELIMINAR API_BASE_URL, ya no es necesario ***
  // La URL base del backend ya está configurada en `axiosInstance.ts`

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // *** CAMBIO CLAVE AQUÍ: Usar 'api' y la ruta relativa ***
      const response = await api.get('/api/products');
      setProducts(response.data);
    } catch (error: any) {
      console.error('Error al cargar productos:', error.response?.data || error.message);
      toast({
        title: "Error",
        description: "No se pudieron cargar los productos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setProductForm((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setProductForm((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Al seleccionar nuevos archivos, reemplazamos la lista actual de 'images'
      setProductForm((prevData) => ({
        ...prevData,
        images: Array.from(e.target.files),
      }));
    }
  };

  const handleRemoveExistingImage = (urlToRemove: string) => {
    setProductForm((prevData) => ({
      ...prevData,
      existingImageUrls: prevData.existingImageUrls.filter(url => url !== urlToRemove),
    }));
  };

  // --- NUEVA FUNCIÓN: Eliminar una imagen recién seleccionada de la previsualización ---
  const handleRemoveNewImage = (indexToRemove: number) => {
    setProductForm((prevData) => {
      const newImages = prevData.images.filter((_, index) => index !== indexToRemove);
      return {
        ...prevData,
        images: newImages,
      };
    });
    // Opcional: Si solo hay una imagen restante en el input de archivo y se elimina,
    // es buena práctica resetear el input para que el usuario pueda volver a seleccionarla.
    // Esto es un poco más complejo, pero si el input `multiple` se reinicia completamente en `resetForm`,
    // generalmente es suficiente.
  };


  const handleCreateOrUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', productForm.name);
    formData.append('description', productForm.description);
    formData.append('price', productForm.price.toString());
    formData.append('category', productForm.category);
    formData.append('featured', productForm.featured.toString());
    formData.append('active', productForm.active.toString());

    productForm.images.forEach(file => {
      formData.append('images', file);
    });

    formData.append('existingImages', JSON.stringify(productForm.existingImageUrls));

    try {
      if (editingProduct) {
        // *** CAMBIO CLAVE AQUÍ: Usar 'api' y la ruta relativa ***
        await api.put(`/api/products/${editingProduct.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast({ title: "Producto Actualizado", description: "El producto ha sido actualizado exitosamente." });
      } else {
        // *** CAMBIO CLAVE AQUÍ: Usar 'api' y la ruta relativa ***
        await api.post('/api/products', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast({ title: "Producto Creado", description: "El nuevo producto ha sido añadido exitosamente." });
      }
      setIsDialogOpen(false);
      resetForm();
      fetchProducts();
    } catch (error: any) {
      console.error('Error al guardar producto:', error.response?.data || error.message);
      toast({
        title: "Error",
        description: error.response?.data?.error || "Hubo un error al guardar el producto.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto? Esta acción es irreversible.')) {
      return;
    }
    setLoading(true);
    try {
      // *** CAMBIO CLAVE AQUÍ: Usar 'api' y la ruta relativa ***
      await api.delete(`/api/products/${id}`);
      toast({ title: "Producto Eliminado", description: "El producto ha sido eliminado exitosamente." });
      fetchProducts();
    } catch (error: any) {
      console.error('Error al eliminar producto:', error.response?.data || error.message);
      toast({
        title: "Error",
        description: error.response?.data?.error || "Hubo un error al eliminar el producto.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openAddProductDialog = () => {
    setEditingProduct(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditProductDialog = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category,
      featured: product.featured,
      active: product.active,
      images: [], // Asegurarse de que no haya nuevas imágenes cargadas previamente
      existingImageUrls: product.images || [],
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: '',
      category: '',
      featured: false,
      active: true,
      images: [],
      existingImageUrls: [],
    });
    // Importante: Resetear el input de tipo file para que el usuario pueda volver a seleccionar los mismos archivos si lo desea
    const fileInput = document.getElementById('images') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Lógica de filtrado de productos
  const filteredProducts = useMemo(() => {
    if (!searchQuery) {
      return products;
    }
    const query = searchQuery.toLowerCase();
    return products.filter((product, index) => {
      const productNumber = (index + 1).toString();
      const productName = product.name.toLowerCase();
      const productPrice = product.price.toString();

      return (
        productName.includes(query) ||
        productPrice.includes(query) ||
        productNumber.includes(query)
      );
    });
  }, [products, searchQuery]);


  return (
    <div className="container mx-auto p-4 bg-gray-50 dark:bg-gray-800 min-h-[calc(100vh-80px)]">
      <Card className="mb-6">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <CardTitle className="text-3xl font-bold mb-4 md:mb-0">Panel de Administración de Productos</CardTitle>
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <Button onClick={openAddProductDialog} className="w-full md:w-auto">Agregar Nuevo Producto</Button>
            <Button onClick={logout} variant="destructive" className="w-full md:w-auto">Cerrar Sesión</Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Campo de búsqueda */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar productos por nombre, precio o número..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 w-full"
            />
          </div>

          {loading ? (
            <p className="text-center text-lg">Cargando productos...</p>
          ) : (
            // Contenedor con scroll para la tabla
            <div className="overflow-y-auto max-h-[60vh] border rounded-md"> {/* Añadido scroll y altura máxima */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">No.</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Destacado</TableHead>
                    <TableHead>Activo</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">No hay productos para mostrar con esta búsqueda.</TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product, index) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{index + 1}.</TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>{product.featured ? 'Sí' : 'No'}</TableCell>
                        <TableCell>{product.active ? 'Sí' : 'No'}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="mr-2"
                            onClick={() => openEditProductDialog(product)}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
                            disabled={loading}
                          >
                            Eliminar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogo para Agregar/Editar Producto (sin cambios relevantes aquí) */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}</DialogTitle>
            <DialogDescription className="sr-only">
              {editingProduct ? 'Formulario para editar un producto existente.' : 'Formulario para añadir un nuevo producto.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateOrUpdateProduct} className="grid gap-4 px-0 pb-0">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Nombre</Label>
              <Input id="name" name="name" value={productForm.name} onChange={handleInputChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                value={productForm.description}
                onChange={handleInputChange as React.ChangeEventHandler<HTMLTextAreaElement>}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">Precio</Label>
              <Input id="price" name="price" type="number" step="0.01" value={productForm.price} onChange={handleInputChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Categoría</Label>
              <Input id="category" name="category" value={productForm.category} onChange={handleInputChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="featured" className="text-right">Destacado</Label>
              <Checkbox id="featured" name="featured" checked={productForm.featured} onCheckedChange={(checked) => handleCheckboxChange('featured', !!checked)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="active" className="text-right">Activo</Label>
              <Checkbox id="active" name="active" checked={productForm.active} onCheckedChange={(checked) => handleCheckboxChange('active', !!checked)} className="col-span-3" />
            </div>
            {/* Gestión de Imágenes Existentes */}
            {productForm.existingImageUrls.length > 0 && (
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right">Imágenes Existentes</Label>
                <div className="col-span-3 flex flex-wrap gap-2">
                  {productForm.existingImageUrls.map((url, index) => (
                    <div key={url} className="relative group w-24 h-24">
                      <img src={url} alt={`Producto imagen ${index}`} className="w-full h-full object-cover rounded" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-0 right-0 p-1 h-auto rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveExistingImage(url)}
                      >
                        X
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Subida de Nuevas Imágenes */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="images" className="text-right">Nuevas Imágenes</Label>
              <Input id="images" name="images" type="file" multiple onChange={handleFileChange} className="col-span-3" />
            </div>
            {/* Previsualización de las nuevas imágenes seleccionadas */}
            {productForm.images.length > 0 && (
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right">Previsualización</Label>
                <div className="col-span-3 flex flex-wrap gap-2">
                  {productForm.images.map((file, index) => (
                    <div key={file.name + index} className="relative group w-24 h-24">
                      <img src={URL.createObjectURL(file)} alt={`Previsualización ${index}`} className="w-full h-full object-cover rounded" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-0 right-0 p-1 h-auto rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveNewImage(index)} // <-- Llamada a la nueva función
                      >
                        X
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </form>
          <DialogFooter className="mt-4 flex justify-end gap-2 p-0">
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={loading} onClick={handleCreateOrUpdateProduct}>
              {loading ? 'Guardando...' : (editingProduct ? 'Actualizar Producto' : 'Crear Producto')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;