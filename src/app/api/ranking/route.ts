import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// Definimos la interfaz para el tipo de usuario
interface User {
  "Usuario de Github": string;
  "Nombre completo": string;
  "Grupo": string;
  "Correo del tutor/a": string;
  "Ciudad": string;
  "Grado": string;
  Asistencia?: Record<string, boolean>;
}

export async function GET() {
  try {
    // Cargar usuarios desde `users.json`
    const usersPath = path.join(process.cwd(), "public/data/users.json");
    const usersData = await fs.readFile(usersPath, "utf-8");
    const users: User[] = JSON.parse(usersData);  // Aseguramos el tipo de `users`

    console.log("here");

    // Procesar puntuación de cada usuario
    const enrichedUsers = await Promise.all(
      users.map(async (user) => {
        const githubUser = user["Usuario de Github"];

        // Cargar datos de actividad desde JSONs
        const [commits, prs, branches, tasks] = await Promise.all([
          fs.readFile(path.join(process.cwd(), `public/data/commits_${githubUser}.json`), "utf-8")
            .then(JSON.parse)
            .catch(() => { console.error(`No se pudo leer commits de ${githubUser}`); return [] }),
          fs.readFile(path.join(process.cwd(), `public/data/prs_${githubUser}.json`), "utf-8")
            .then(JSON.parse)
            .catch(() => { console.error(`No se pudo leer PRs de ${githubUser}`); return [] }),
          fs.readFile(path.join(process.cwd(), `public/data/branches_${githubUser}.json`), "utf-8")
            .then(JSON.parse)
            .catch(() => { console.error(`No se pudo leer branches de ${githubUser}`); return [] }),
          fs.readFile(path.join(process.cwd(), `public/data/tasks_${githubUser}.json`), "utf-8")
            .then(JSON.parse)
            .catch(() => { console.error(`No se pudo leer tasks de ${githubUser}`); return [] }),
        ]);

        // Calcular puntuación total
        const taskScore = tasks && Array.isArray(tasks) ? tasks.reduce((acc, task) => {
          const bodyHTML = task.bodyHTML || "";  // Aseguramos que bodyHTML siempre sea una cadena
          return acc + (bodyHTML ? 3 : 1) + Math.floor((bodyHTML.split(/\s+/).length || 0) / 20) + (bodyHTML.match(/<img/g) || []).length;
        }, 0) : 0;        
        const commitScore = commits.length * 5;
        const branchScore = branches.length * 20;
        const prScore = prs.length * 20;

        // Calcular asistencia
        const attendanceScore = Object.values(user.Asistencia || {}).filter(value => value).length * 10;

        // Puntuación total
        const totalScore = (taskScore + commitScore + branchScore + prScore + attendanceScore) / 20;

        return {
          githubUser,
          fullName: user["Nombre completo"],
          group: user["Grupo"],
          tutor: user["Correo del tutor/a"],
          city: user["Ciudad"],
          grade: user["Grado"],
          totalScore,
        };
      })
    );

    // Ordenar por puntuación
    enrichedUsers.sort((a, b) => b.totalScore - a.totalScore);

    // Guardar ranking en un JSON (si fuera necesario)
    // const rankingPath = path.join(process.cwd(), "public/data/ranking.json");
    // await fs.writeFile(rankingPath, JSON.stringify(enrichedUsers, null, 2), "utf-8");

    return NextResponse.json(enrichedUsers);
  } catch (error) {
    console.error("Error generando ranking:", error);
    return NextResponse.json({ error: "Error al calcular ranking" }, { status: 500 });
  }
}
