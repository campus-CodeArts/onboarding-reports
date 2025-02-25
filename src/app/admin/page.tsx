"use client";
import { useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSync = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/sync');
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error al sincronizar usuarios');
      }
      setMessage(data.message || 'Hecho');
    } catch (error) {
      console.error(error);
      setMessage('Error al sincronizar usuarios');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Panel de administración</h1>
      <ul>
        <li>
          <button onClick={handleSync} className="hover:underline flex items-center">
            {loading ? (
              <svg className="animate-spin h-5 w-5 mr-2 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
            ) : null}
            <span>Refrescar usuarios con hoja TODOS</span>
          </button>
        </li>
      </ul>
      {message && <p className="mt-4 text-gray-700">{message}</p>}
    </div>
  );
}
