import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { parse } from "date-fns";
import { ranking } from '@/lib/ranking';

interface TeamData {
    name: string;
    type: string;
    score: number;
    members: number;
    startDate: Date;
    endDate: Date;
    memberNames: string[];
}

export async function GET(req, { params }) {
    try {
        const { field } = await params;
        if (!['group', 'tutor', 'tutorCodeArts', 'city', 'grade'].includes(field)) {
            return NextResponse.json({ error: 'Campo no válido' }, { status: 400 });
        }

        console.log(`Agrupando por ${field}`);

        // Cargar datos desde `/api/ranking`
        const rankingData = await ranking();

        // Cargar datos de los equipos desde `teams.json`
        const teamsPath = path.join(process.cwd(), 'public/data/teams.json');
        const teamsData = await fs.readFile(teamsPath, 'utf-8');
        const teamsInfo = JSON.parse(teamsData);

        // Inicializar estructura de agrupación
        const groupedData: Record<string, TeamData> = {};
        teamsInfo.forEach(team => {
            teamsInfo[team.name.toLowerCase()] = team;
        });

        rankingData.forEach(user => {
            const key = user[field] || 'unknown';
            const userStartDate = parse(user.startDate, "dd/MM/yyyy", new Date());
            const userEndDate = parse(user.endDate, "dd/MM/yyyy", new Date());

            if (!groupedData[key]) {
                groupedData[key] = {
                    name: key,
                    type: teamsInfo[key]?.type || 'unknown',
                    score: 0,
                    members: 0,
                    startDate: userStartDate,
                    endDate: userEndDate,
                    memberNames: []
                };
            }

            groupedData[key].score += user.totalScore;
            groupedData[key].members += 1;
            groupedData[key].startDate = (userStartDate.getTime() < groupedData[key].startDate.getTime() ? userStartDate : groupedData[key].startDate) ?? userStartDate;
            groupedData[key].endDate = (userEndDate.getTime() > groupedData[key].endDate.getTime() ? userEndDate : groupedData[key].endDate) ?? userEndDate;
            groupedData[key].memberNames.push(user["githubUser"]);
        });

        // console.log(groupedData);

        // Convertir a array y calcular media
        const result = Object.values(groupedData).map(group => ({
            ...group,
            media: group.members > 0 ? group.score / group.members : 0,
            startDate: group.startDate,
            endDate: group.endDate
        }));

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error al procesar los datos:', error);
        return NextResponse.json({ error: 'Error al procesar los datos' }, { status: 500 });
    }
}
