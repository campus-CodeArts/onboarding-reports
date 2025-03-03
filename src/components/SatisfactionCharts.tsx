'use client';

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF'];

export default function SatisfactionCharts() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [cities, setCities] = useState([]);
    const [cycles, setCycles] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedCycle, setSelectedCycle] = useState('');

    useEffect(() => {
        fetch('/data/satisfaction.json')
            .then((res) => res.json())
            .then((json) => {
                setData(json);
                setFilteredData(json);
                
                const uniqueCities = [...new Set(json.map(entry => entry["Ciudad del Centro de Estudios"]))];
                const uniqueCycles = [...new Set(json.map(entry => entry["¿A que Ciclo Perteneces?"]))];
                
                setCities(uniqueCities);
                setCycles(uniqueCycles);
            })
            .catch((error) => console.error('Error al cargar datos:', error));
    }, []);

    useEffect(() => {
        let filtered = data;
        if (selectedCity) {
            filtered = filtered.filter(entry => entry["Ciudad del Centro de Estudios"] === selectedCity);
        }
        if (selectedCycle) {
            filtered = filtered.filter(entry => entry["¿A que Ciclo Perteneces?"] === selectedCycle);
        }
        setFilteredData(filtered);
    }, [selectedCity, selectedCycle, data]);

    const questions = [
        "1. ¿Cómo valorarías la rapidez con la que se resuelven tus dudas durante las prácticas?",
        "2. ¿Sientes que tienes trabajo suficiente durante el día para aprender y desarrollarte profesionalmente?",
        " 3. ¿Cómo valorarías el trato recibido por la empresa durante las prácticas?",
        "4. ¿Cómo te han parecido las prácticas en general?",
        "5. ¿Cómo valoras a tu tutor de prácticas?"
    ];
    
    const transformedData = questions.map(question => {
        const responseCounts = filteredData.reduce((acc, entry) => {
            const answer = entry[question];
            if (answer) {
                acc[answer] = (acc[answer] || 0) + 1;
            }
            return acc;
        }, {});
        
        return {
            question,
            data: Object.entries(responseCounts).map(([name, value]) => ({ name, value }))
        };
    });

    return (
        <div>
            <div className="mb-6 flex space-x-4 items-center">
                <select className="border p-2" value={selectedCity} onChange={e => setSelectedCity(e.target.value)}>
                    <option value="">Todas las ciudades</option>
                    {cities.map(city => <option key={city} value={city}>{city}</option>)}
                </select>
                <select className="border p-2" value={selectedCycle} onChange={e => setSelectedCycle(e.target.value)}>
                    <option value="">Todos los ciclos</option>
                    {cycles.map(cycle => <option key={cycle} value={cycle}>{cycle}</option>)}
                </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {transformedData.map((item, index) => (
                    <div key={index} className="text-center">
                        <h3 className="text-lg font-semibold mb-2">{item.question}</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={item.data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                                    {item.data.map((entry, i) => (
                                        <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                ))}
            </div>
        </div>
    );
}
