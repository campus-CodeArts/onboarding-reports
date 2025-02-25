'use client';
import { useEffect, useState } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';

export default function RadarUser({ user, userType }) {
  const [radarData, setRadarData] = useState([]);
  // const [additionalTasks, setAdditionalTasks] = useState([]);
  const [unmatchedTasks, setUnmatchedTasks] = useState([]);

  useEffect(() => {
    if (!user || !userType) return;

    const fetchJson = async (filename) => {
      try {
        const res = await fetch(`/data/${filename}`);
        return res.ok ? await res.json() : [];
      } catch {
        return [];
      }
    };

    const matchTask = (taskTitle, userTasks) => {
      // Limpiar y dividir el título en palabras clave importantes
      const cleanTitle = taskTitle
        .replace(/^\d+(\.\d+)?\s*-?\s*/, '') // Elimina "1.1 - " o "2.3 -"
        .replace(/\s*\(.*?\)/g, '') // Elimina "(Actualización con conocimientos nuevos)"
        .replace(/^(Instalar|Configuración de|Conectar|Desarrollar)\s+/i, '') // Filtra palabras genéricas
        .replace(/\b(el|la|los|las|de|del|en|con|para|por|un|una|unos|unas|local|locales|entono|entonos|entorno|entoenos|flujos|clave)\b/gi, '') // Elimina artículos y preposiciones
        .trim()
        .toLowerCase();
    
      const keywords = cleanTitle.split(/\s+/); // Dividir el título en palabras clave
    
      return userTasks.find(userTask => {
        const userCleanTitle = userTask.title
        .replace(/^\d+(\.\d+)?\s*-?\s*/, '') // Elimina "1.1 - " o "2.3 -"
        .replace(/\s*\(.*?\)/g, '') // Elimina "(Actualización con conocimientos nuevos)"
        .replace(/^(Instalar|Configuración de|Conectar)\s+/i, '') // Filtra palabras genéricas
        .trim()
        .toLowerCase();
        return keywords.every(keyword => userCleanTitle.includes(keyword)); // Todas las palabras deben estar en el título
      });
    };
     

    const computeRadarData = (categorizedTasks, userTasks, additional) => {
      const formattedData = Object.values(categorizedTasks)
        .map(({ name, completed, total }) => ({
          category: name,
          progress: total > 0 ? (completed / total) * 100 : 0,
        }))
        .filter(data => !isNaN(data.progress) && data.progress > 0);
      
      const maxProgress = Math.max(...formattedData.map(d => d.progress), 1);
      const additionalProgress = (additional.length / maxProgress) * 100;

      if (additional.length > 0) {
        formattedData.push({
          category: 'Contenido adicional',
          progress: additionalProgress,
        });
      }

      return formattedData;
    };

    const loadData = async () => {
      const backlogs = await Promise.all(
        Array.from({ length: 6 }, (_, i) => fetchJson(`backlogs/${userType}/${i + 1}_backlog.json`))
      );
      
      const allTasks = await fetchJson(`tasks_${user}.json`);
      const backlogTasks = backlogs.flat();

      const categorizedTasks = backlogTasks.reduce((acc, task) => {
        if (!acc[task.category]) acc[task.category] = { name: task.category, completed: 0, total: 0 };
        acc[task.category].total += task.estimate || 1;
        if (matchTask(task.title, allTasks)) {
          acc[task.category].completed += task.estimate || 1;
        }
        return acc;
      }, {});

      // Detectar tareas adicionales
      const unmatched = allTasks.filter(t => !matchTask(t.title, backlogTasks));
      setUnmatchedTasks(unmatched);
      // setAdditionalTasks(unmatched);

      const formattedData = computeRadarData(categorizedTasks, allTasks, unmatched);
      console.log("📌 Datos procesados para RadarChart:", formattedData);
      console.log("📌 Tareas sin matchear:", unmatched);
      setRadarData(formattedData.length > 1 ? formattedData : []);
    };

    loadData();
  }, [user, userType]);

  return (
    <div className='mt-6 p-4 border rounded-lg shadow-lg bg-white'>
      <h2 className='text-xl font-semibold mb-4'>Progreso de {user}</h2>
      {radarData.length > 1 ? (
        <ResponsiveContainer width='100%' height={300}>
          <RadarChart outerRadius={90} data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey='category' />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Tooltip />
            <Radar name='Progreso' dataKey='progress' stroke='#8884d8' fill='#8884d8' fillOpacity={0.6} />
          </RadarChart>
        </ResponsiveContainer>
      ) : (
        <p className='text-center text-gray-500'>No hay suficientes datos para mostrar el gráfico.</p>
      )}
      {unmatchedTasks.length > 0 && (
        <div className='mt-4'>
          <h3 className='text-lg font-medium'>Tareas que se han computado como adicionales</h3>
          <ul className='list-disc pl-5'>
            {unmatchedTasks.map(task => (
              <li key={task.title}>{task.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
