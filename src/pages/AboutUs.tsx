// src/pages/AboutUs.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const AboutUs: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-10">Sobre Nosotros</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Nuestra Historia</CardTitle>
          <CardDescription>Desde nuestros inicios hasta hoy.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg">
            Yeka Magic Bags nació de la pasión por crear accesorios únicos y significativos que no solo complementen tu estilo, sino que también cuenten una historia. Fundada en [Año de Fundación], hemos crecido de ser un pequeño taller a una marca reconocida por su calidad, innovación y diseño artesanal.
          </p>
          <p className="mt-4 text-lg">
            Creemos que cada bolso es más que un simple accesorio; es una extensión de la personalidad de quien lo lleva, un compañero en la vida cotidiana y un elemento de magia en el día a día. Nos esforzamos por fusionar la tradición con la modernidad, utilizando materiales de alta calidad y técnicas de confección que aseguran durabilidad y belleza.
          </p>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Nuestra Misión</CardTitle>
          <CardDescription>Lo que nos impulsa cada día.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg">
            Nuestra misión es empoderar a nuestros clientes a través de accesorios excepcionales que reflejen su individualidad y confianza. Nos dedicamos a ofrecer productos que combinan funcionalidad, estética y un toque de magia, promoviendo la sostenibilidad y el comercio justo en cada paso de nuestro proceso creativo.
          </p>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Nuestra Visión</CardTitle>
          <CardDescription>Hacia dónde nos dirigimos.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg">
            Ser la marca líder en bolsos y accesorios mágicos, reconocida globalmente por nuestra originalidad, compromiso con la calidad y nuestra capacidad de inspirar alegría y autoexpresión en cada persona que elige un Yeka Magic Bag. Aspiramos a construir una comunidad vibrante de amantes de la moda conscientes y apasionados por el arte hecho a mano.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutUs;