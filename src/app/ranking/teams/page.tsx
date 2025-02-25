'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface Team {
    name: string;
    type: string;
    score: number;
    members: number;
    memberNames: string[];
    media: number;
}

interface TooltipProps {
    active?: boolean;
    payload?: { payload: Team; value: number }[];
}

export default function RankingTeams() {
    const [teamsSortedByScore, setTeamsSortedByScore] = useState<Team[]>([]);
    const [teamsSortedByMean, setTeamsSortedByMean] = useState<Team[]>([]);
    const [field, setField] = useState<string>('group');

    useEffect(() => {
        fetch(`/api/teams/${field}`)
            .then(res => res.json())
            .then((data: Team[]) => {
                setTeamsSortedByScore([...data].sort((a, b) => b.score - a.score));
                setTeamsSortedByMean([...data].sort((a, b) => b.media - a.media));
            })
            .catch(error => console.error('Error al cargar los datos de los equipos:', error));
    }, [field]);

    const CustomTooltip = ({ active, payload }: TooltipProps) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-2 border rounded shadow">
                    <p className="font-bold">{payload[0].payload.name}</p>
                    <p>Puntuación: {payload[0].value}</p>
                    <p>Miembros: {payload[0].payload.members}</p>
                    <p>Miembros: {payload[0].payload.memberNames.join(', ')}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Ranking de Equipos</h1>
            <label className="block mb-4">
                <span className="text-lg font-medium">Agrupar por:</span>
                <select
                    className="ml-2 p-2 border rounded"
                    value={field}
                    onChange={(e) => setField(e.target.value)}
                >
                    <option value="group">Grupo</option>
                    <option value="tutor">Tutor</option>
                    <option value="tutorCodeArts">Tutor CodeArts</option>
                    <option value="city">Ciudad</option>
                    <option value="grade">Grado</option>
                </select>
            </label>
            <h2 className="text-xl font-bold mt-6">Puntuación Total</h2>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={teamsSortedByScore}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="score" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
            <h2 className="text-xl font-bold mt-6">Media de Puntuación</h2>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={teamsSortedByMean}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="media" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}