"use client";
import { format, parse } from "date-fns";
import { es } from "date-fns/locale";

export default function AttendanceCalendar({userData}) {
  // Asegurarnos de que las fechas de inicio y fin existan
  const fechaInicio = userData['Fecha de inicio']
    ? parse(userData['Fecha de inicio'], "dd/MM/yyyy", new Date())
    : new Date();
  const fechaFin = userData['Fecha de Fin']
    ? parse(userData['Fecha de Fin'], "dd/MM/yyyy", new Date())
    : new Date();

  const today = new Date();

  // Si 'Asistencia' no está disponible, devolvemos un mensaje
  if (!userData.Asistencia) {
    return <p>No se encontraron datos de asistencia.</p>;
  }

  // Ordenar fechas correctamente y filtrar solo aquellas dentro del rango de fechas
  const sortedDates = Object.keys(userData.Asistencia)
    .map((date) => parse(date, "dd/MM/yyyy", new Date()))
    .sort((a, b) => a.getTime() - b.getTime()) // Ordenar por fecha
    .filter((date) => 
      date.getTime() <= today.getTime() &&
      date.getTime() >= fechaInicio.getTime() &&
      date.getTime() <= fechaFin.getTime()
    );

  return (
    <div className="mt-6 p-4 border rounded-lg shadow-lg bg-white">
      <h2 className="text-xl font-semibold mb-4">Asistencia</h2>
      <div className="grid grid-cols-7 gap-2 text-center">
        {sortedDates.map((date) => {
          const formattedDate = format(date, "dd/MM/yyyy", { locale: es });
          const isPresent = userData.Asistencia[formattedDate]; // Verificar si está presente en esa fecha

          return (
            <div
              key={formattedDate}
              className={`p-2 text-sm font-medium rounded-lg ${
                isPresent ? "bg-green-500 text-white" : "bg-red-500 text-white"
              }`}
            >
              {format(date, "dd/MM", { locale: es })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
