"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function RankingPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [scoreFilter, setScoreFilter] = useState(200);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const res = await fetch("/api/ranking", {
          next: { revalidate: 3600 }, // Regenera cada 1 hora
        });
        if (!res.ok) throw new Error("Error al cargar el ranking");
        const data = await res.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, []);

  // Filtrar usuarios según el slider de puntuación
  useEffect(() => {
    setFilteredUsers(users.filter(user => user.totalScore <= scoreFilter));
  }, [scoreFilter, users]);

  if (loading) return <p className="text-center text-gray-500">Cargando ranking...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  // Función para determinar el color de la fila según la puntuación
  const getRowColor = (score) => {
    if (score > 10) return "bg-yellow-400"; // 10+
    if (score >= 8) return "bg-green-400"; // 8-10
    if (score >= 5) return "bg-orange-300"; // 5-8
    return "bg-red-400"; // <5
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ranking de Usuarios</h1>

      {/* Slider para filtrar por puntuación */}
      <div className="mb-4">
        <label className="block text-lg font-semibold">
          Filtrar por puntuación: {scoreFilter}
        </label>
        <input
          type="range"
          min="0"
          max="200"
          step="0.1"
          value={scoreFilter}
          onChange={(e) => setScoreFilter(parseFloat(e.target.value))}
          className="w-full mt-2"
        />
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">#</th>
            <th className="border p-2">Usuario</th>
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Grupo</th>
            <th className="border p-2">Ciudad</th>
            <th className="border p-2">Grado</th>
            <th className="border p-2">Tutor</th>
            <th className="border p-2">Puntuación</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr key={user.githubUser}>
              <td className="border p-2 text-center">{index + 1}</td>
              <td className="border p-2 text-center">
                <Link href={`/user/${user.githubUser}`} className="text-blue-500 hover:underline">
                  {user.githubUser}
                </Link>
              </td>
              <td className="border p-2">{user.fullName}</td>
              <td className="border p-2 text-center">{user.group}</td>
              <td className="border p-2 text-center">{user.city}</td>
              <td className="border p-2 text-center">{user.grade}</td>
              <td className="border p-2 text-center">{user.tutor}</td>
              <td className={`${getRowColor(user.totalScore)} border p-2 text-center font-bold`}>{user.totalScore}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
