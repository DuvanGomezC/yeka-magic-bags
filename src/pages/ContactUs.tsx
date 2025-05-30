// src/pages/ContactUs.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios'; // ¡Importa axios!
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

// Define el esquema de validación con Zod
const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
  email: z.string().email({ message: 'Por favor, introduce un correo electrónico válido.' }),
  subject: z.string().min(5, { message: 'El asunto debe tener al menos 5 caracteres.' }),
  message: z.string().min(10, { message: 'El mensaje debe tener al menos 10 caracteres.' }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const ContactUs: React.FC = () => {
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }, // isSubmitting para deshabilitar el botón mientras se envía
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      // *** CAMBIO CLAVE AQUÍ PARA PRUEBAS LOCALES ***
      // Apunta directamente a la URL de tu backend para desarrollo local
      const response = await axios.post('/api/contact', data);
      // CUANDO ESTÉS LISTO PARA DESPLEGAR EN VERCEL, CAMBIA LA LÍNEA ANTERIOR A:
      // const response = await axios.post('/api/contact', data);


      if (response.status === 200) { // Comprueba el estado HTTP
        toast({
          title: 'Mensaje enviado!',
          description: 'Gracias por contactarnos. Te responderemos pronto.',
          variant: 'default',
        });
        reset(); // Resetea el formulario solo si el envío fue exitoso
      } else {
        // Axios lanza un error para estados 4xx/5xx, así que esta rama solo se alcanzaría con otros códigos de estado
        console.error('Error al enviar el formulario al backend:', response.data);
        toast({
          title: 'Error al enviar el mensaje.',
          description: 'Hubo un problema. Por favor, inténtalo de nuevo más tarde.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      // Manejo de errores de Axios (ej. red, o respuesta de error del servidor)
      console.error('Error de red o del servidor al enviar el formulario:', error);
      toast({
        title: 'Error de conexión o del servidor.',
        description: 'No se pudo conectar con el servidor o hubo un problema. Verifica que tu backend esté corriendo y la URL sea correcta.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-10">Contáctanos</h1>

      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Envíanos un mensaje</CardTitle>
          <CardDescription>Estamos aquí para responder tus preguntas y comentarios.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="name">Nombre Completo</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="subject">Asunto</Label>
              <Input id="subject" {...register('subject')} />
              {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
            </div>
            <div>
              <Label htmlFor="message">Tu Mensaje</Label>
              <Textarea id="message" {...register('message')} rows={5} />
              {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
            </Button>
          </form>

          <div className="mt-8 text-center text-gray-600">
            <p>También puedes encontrarnos en:</p>
            <p className="mt-2">
              <strong className="block">Teléfono:</strong> +57 (315) 694-2777
              <strong className="block">Email:</strong> info@yekamagicbags.com
              <strong className="block">Dirección:</strong> Calle Ficticia 123, Ciudad Mágica, País Imaginario
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactUs;