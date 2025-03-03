'use client';

import { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';

const ratingMap = {
    "Rápida y eficiente": 5,
    "A veces tarda más de lo esperado": 3,
    "Lenta, necesito más apoyo": 1,
    "Sí, siempre tengo tareas y retos que me mantienen activo": 5,
    "A veces tengo momentos sin actividad": 3,
    "No, en muchas ocasiones me falta trabajo": 1,
    "Muy bueno, siempre atentos y dispuestos a ayudar": 5,
    "Correcto, pero mejorable en algunos aspectos": 3,
    "Deficiente, no me he sentido bien atendido": 1,
    "Muy positivas, estoy aprendiendo como sería la forma de trabajar.": 5,
    "Útiles.": 3,
    "No han cumplido mis expectativas.": 1,
    "Muy bueno, siempre atento y resolutivo": 5,
    "Correcto, aunque podría mejorar en algunos aspectos": 3,
    "Deficiente, he sentido falta de apoyo": 1
};

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

export default function FeedbackComments() {
    const [feedback, setFeedback] = useState([]);

    useEffect(() => {
        fetch('/data/satisfaction.json')
            .then((res) => res.json())
            .then((json) => {
                const extractedFeedback = json.map(entry => ({
                    comment: entry["6. ¿Qué mejorarías en las prácticas para que sean más útiles para tu aprendizaje?"],
                    ratings: {
                        rapidez: ratingMap[entry["1. ¿Cómo valorarías la rapidez con la que se resuelven tus dudas durante las prácticas?"]] || 0,
                        trabajo: ratingMap[entry["2. ¿Sientes que tienes trabajo suficiente durante el día para aprender y desarrollarte profesionalmente?"]] || 0,
                        trato: ratingMap[entry[" 3. ¿Cómo valorarías el trato recibido por la empresa durante las prácticas?"]] || 0,
                        practicas: ratingMap[entry["4. ¿Cómo te han parecido las prácticas en general?"]] || 0,
                        tutor: ratingMap[entry["5. ¿Cómo valoras a tu tutor de prácticas?"]] || 0,
                    }
                })).filter(f => f.comment && f.comment.trim() !== "");
                
                setFeedback(shuffleArray(extractedFeedback));
            })
            .catch((error) => console.error('Error al cargar datos:', error));
    }, []);

    return (
        <div>
            <h2 className="text-center text-2xl font-bold mt-6">Valoración General</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {feedback.length > 0 && Object.keys(feedback[0].ratings).map((key, index) => (
                    <div key={index} className="p-4 border rounded shadow bg-white text-center">
                        <h3 className="text-lg font-semibold mb-2">{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
                        <p className="text-2xl">{(feedback.reduce((acc, f) => acc + f.ratings[key], 0) / feedback.length).toFixed(1)} ⭐</p>
                    </div>
                ))}
            </div>
            <h2 className="text-center text-2xl font-bold mb-4">Usuario anónimo</h2>
            <Carousel autoPlay infiniteLoop={true} showThumbs={false} showStatus={false} showIndicators={true}>
                {feedback.map((item, index) => (
                    <div key={index} className="p-4 border rounded shadow bg-gray-100 text-center">
                        <p className="italic">&quot;{item.comment}&quot;</p>
                        <div className="mt-4">
                            <p>Rapidez: {'⭐'.repeat(item.ratings.rapidez)}</p>
                            <p>Trabajo: {'⭐'.repeat(item.ratings.trabajo)}</p>
                            <p>Trato: {'⭐'.repeat(item.ratings.trato)}</p>
                            <p>Prácticas: {'⭐'.repeat(item.ratings.practicas)}</p>
                            <p>Tutor: {'⭐'.repeat(item.ratings.tutor)}</p>
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
}
