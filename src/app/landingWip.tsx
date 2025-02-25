'use client';

import dynamic from 'next/dynamic';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const DynamicVectorImage = dynamic(() => import('@/components/DynamicVectorImage'), { ssr: false });
const SatisfactionCharts = dynamic(() => import('@/components/SatisfactionCharts'), { ssr: false });
const FeedbackComments = dynamic(() => import('@/components/FeedbackComments'), { ssr: false });

export default function Home() {

    return (
        <div>
            {/* Sección 1: Imagen Vectorial Dinámica */}
            <section className="flex justify-center items-center h-screen bg-gray-100">
                <DynamicVectorImage />
            </section>

            {/* Sección 2: Carrusel de Puntuaciones */}
            <section className="py-12 bg-white text-center">
                <h2 className="text-3xl font-bold mb-6">¿Cómo funcionan las puntuaciones?</h2>
                <Carousel autoPlay infiniteLoop showThumbs={false}>
                    <div><p className="text-lg">Las puntuaciones reflejan tu esfuerzo y logros en las prácticas.</p></div>
                    <div><p className="text-lg">Cada tarea tiene una cantidad de puntos asignada según su dificultad.</p></div>
                    <div><p className="text-lg">Los puntos se acumulan y determinan tu progreso en el itinerario.</p></div>
                </Carousel>
            </section>

            {/* Sección 3: Gráficos de Encuesta de Satisfacción */}
            <section className="py-12 bg-gray-100 text-center">
                <h2 className="text-3xl font-bold mb-6">Resultados de la Encuesta de Satisfacción</h2>
                <SatisfactionCharts />
            </section>

            {/* Sección 4: Comentarios de la Encuesta */}
            <section className="py-12 bg-white text-center">
                <h2 className="text-3xl font-bold mb-6">Comentarios de los Alumnos</h2>
                <FeedbackComments />
            </section>
        </div>
    );
}
