// src/pages/AdminDashboard.tsx
import React, { useState, useEffect, useMemo } from 'react';
import api from '../utils/axiosInstance';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, UploadCloud } from "lucide-react";
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
import { useQueryClient } from '@tanstack/react-query';

import { Product } from "@/types/product";

// Función para procesar la imagen: redimensionar y convertir a WebP
const processImage = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          return reject(new Error('No se pudo obtener el contexto del canvas.'));
        }

        // Dibuja la imagen en el canvas. Esto redimensionará a 600x600,
        // estirando o comprimiendo si las proporciones no son las mismas.
        ctx.drawImage(img, 0, 0, 600, 600);

        // Convierte el canvas a un Blob de tipo image/webp
        canvas.toBlob((blob) => {
          if (blob) {
            // Crea un nuevo objeto File a partir del Blob, manteniendo el nombre original
            // pero cambiando la extensión a .webp
            const newFileName = file.name.split('.').slice(0, -1).join('.') + '.webp';
            const processedFile = new File([blob], newFileName, { type: 'image/webp' });
            resolve(processedFile);
          } else {
            reject(new Error('Error al convertir la imagen a WebP.'));
          }
        }, 'image/webp', 0.8); // 0.8 es la calidad (80%)
      };
      img.onerror = (error) => {
        reject(new Error('Error al cargar la imagen para procesamiento.'));
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = (error) => {
      reject(new Error('Error al leer el archivo de imagen.'));
    };
    reader.readAsDataURL(file);
  });
};


const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    featured: false,
    active: true,
    images: [] as File[],
    existingImageUrls: [] as string[],
  });

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
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

  const handleFilesAddition = (filesToAdd: FileList | File[]) => {
    const newFiles = Array.from(filesToAdd);

    setProductForm((prevData) => {
      const existingNewFiles = prevData.images;

      const combinedFiles = [...existingNewFiles];
      newFiles.forEach(newFile => {
        const isDuplicate = combinedFiles.some(
          existingFile => existingFile.name === newFile.name && existingFile.size === newFile.size
        );
        if (!isDuplicate) {
          combinedFiles.push(newFile);
        }
      });

      return {
        ...prevData,
        images: combinedFiles,
      };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFilesAddition(e.target.files);
      e.target.value = '';
    }
  };

  const handleRemoveExistingImage = (urlToRemove: string) => {
    setProductForm((prevData) => ({
      ...prevData,
      existingImageUrls: prevData.existingImageUrls.filter(url => url !== urlToRemove),
    }));
  };

  const handleRemoveNewImage = (indexToRemove: number) => {
    setProductForm((prevData) => {
      const newImages = prevData.images.filter((_, index) => index !== indexToRemove);
      return {
        ...prevData,
        images: newImages,
      };
    });
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

    // --- MODIFICACIÓN CLAVE AQUÍ: Procesar imágenes antes de enviarlas ---
    const processedImagePromises = productForm.images.map(file => processImage(file));
    try {
      const processedImages = await Promise.all(processedImagePromises);
      processedImages.forEach(file => {
        formData.append('images', file);
      });
    } catch (imageProcessingError: any) {
      console.error('Error al procesar imágenes:', imageProcessingError.message);
      toast({
        title: "Error de Imagen",
        description: `No se pudieron procesar todas las imágenes: ${imageProcessingError.message}`,
        variant: "destructive",
      });
      setLoading(false);
      return; // Detener la ejecución si hay un error en el procesamiento de imágenes
    }
    // --- FIN DE LA MODIFICACIÓN DE IMAGENES ---

    formData.append('existingImages', JSON.stringify(productForm.existingImageUrls));

    try {
      if (editingProduct) {
        await api.put(`/api/products/${editingProduct.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast({ title: "Producto Actualizado", description: "El producto ha sido actualizado exitosamente." });
      } else {
        await api.post('/api/products', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast({ title: "Producto Creado", description: "El nuevo producto ha sido añadido exitosamente." });
      }
      setIsDialogOpen(false);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['products'] });
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
      await api.delete(`/api/products/${id}`);
      toast({ title: "Producto Eliminado", description: "El producto ha sido eliminado exitosamente." });
      queryClient.invalidateQueries({ queryKey: ['products'] });
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
      images: [],
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
    const fileInput = document.getElementById('images') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

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
            <div className="overflow-y-auto max-h-[60vh] border rounded-md">
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
            {/* Subida de Nuevas Imágenes con Drag and Drop */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="images" className="text-right">Nuevas Imágenes</Label>
              <div className="col-span-3">
                <label
                  htmlFor="images"
                  className={`flex flex-col items-center justify-center w-full p-4 border-2 rounded-md cursor-pointer transition-colors
                    ${isDragOver
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                      : 'border-dashed border-gray-300 bg-gray-100 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600'
                    }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDragOver(true);
                    e.dataTransfer.dropEffect = 'copy';
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDragOver(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDragOver(false);

                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      handleFilesAddition(e.dataTransfer.files);
                    }
                  }}
                >
                  <UploadCloud className="w-8 h-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground text-center">
                    Haz clic para subir o arrastra y suelta imágenes
                  </p>
                  <Input
                    id="images"
                    name="images"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
              </div>
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
                        onClick={() => handleRemoveNewImage(index)}
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