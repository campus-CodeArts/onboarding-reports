"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import UserSummary from "@/components/UserSummary";
import UserActivityGraph from "@/components/UserActivityGraph";
import CommitsTable from "@/components/CommitsTable";
import PRsTable from "@/components/PRsTable";
import BranchesTable from "@/components/BranchesTable";
import RadarUser from "@/components/RadarUser";
import TasksDetails from "@/components/TasksDetails";
import AttendanceCalendar from "@/components/AttendanceCalendar";

// Definir tipos de datos para los commits, PRs, branches, tasks, etc.
interface Commit {
  id: string;
  message: string;
  date: string;
  // Agregar más campos si es necesario
}

interface PR {
  id: string;
  title: string;
  status: string;
  // Agregar más campos si es necesario
}

interface Branch {
  name: string;
  commitsCount: number;
  // Agregar más campos si es necesario
}

interface Task {
  id: string;
  bodyHTML: string;
  status: string;
  // Agregar más campos si es necesario
}

interface User {
  "Usuario de Github": string; // El nombre del usuario en Github, debe ser obligatorio
  Asistencia?: Record<string, boolean>; // Opcional: Asistencia del usuario, donde la clave es una fecha o identificador y el valor es un booleano
  Type?: string; // Tipo de usuario (puede ser devs, o cualquier otro tipo)
  "Nombre completo"?: string; // Nombre completo del usuario (opcional)
  "Correo del tutor/a"?: string; // Correo del tutor/a del usuario (opcional)
  "Ciudad"?: string; // Ciudad del usuario (opcional)
  "Grupo"?: string; // Grupo del usuario (opcional)
  "Grado"?: string; // Grado del usuario (opcional)
}



export default function UserReport() {
  const params = useParams();
  const user = params.user;

  const [commits, setCommits] = useState<Commit[]>([]);
  const [prs, setPRs] = useState<PR[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userType, setUserType] = useState<string | null>(null);
  const [userAttendance, setUserAttendance] = useState<Record<string, boolean>>({});
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos de actividades (commits, prs, branches, tasks)
  useEffect(() => {
    if (user) {
      Promise.all([
        fetch(`/data/commits_${user}.json`).then(res => res.json()).then(setCommits),
        fetch(`/data/prs_${user}.json`).then(res => res.json()).then(setPRs),
        fetch(`/data/branches_${user}.json`).then(res => res.json()).then(setBranches),
        fetch(`/data/tasks_${user}.json`).then(res => res.json()).then(setTasks)
      ])
        .catch((error: Error) => {
          setError(error.message || "Error al cargar los datos de actividad");
          setLoading(false);
        });
    }
  }, [user]);
  

  // Cargar datos del usuario
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const usersRes = await fetch('/data/users.json');
        const users: User[] = await usersRes.json();

        const userData = users.find(u => u["Usuario de Github"] === user);
        if (userData) {
          setUserData(userData);
          setUserAttendance(userData.Asistencia || {});
          setUserType(userData.Type || 'devs');
        } else {
          setError("Usuario no encontrado");
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error desconocido");
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchUserData();
  }, [user]);

  if (loading) return <p className="text-center text-gray-500">Cargando usuario...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4 user-summary">
      <div id="user-profile">
        <h1 className="text-2xl font-bold">Actividad de {user}</h1>
        <UserSummary
          tasks={tasks}
          commits={commits}
          prs={prs}
          branches={branches}
          userAttendance={userAttendance}
        />
        <AttendanceCalendar userData={userData} />
        <UserActivityGraph user={user} />
        {userType && <RadarUser user={user} userType={userType} />}
        <CommitsTable commits={commits} />
        <PRsTable prs={prs} />
        <BranchesTable branches={branches} />
        <TasksDetails tasks={tasks} allExpanded={true} />
      </div>
    </div>
  );
}
