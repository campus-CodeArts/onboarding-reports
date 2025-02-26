"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import UserSummary from "@/components/UserSummary";
import UserActivityGraph from "@/components/UserActivityGraph";
import CommitsGraph from "@/components/CommitsGraph";
import CommitsTable from "@/components/CommitsTable";
import PRsTable from "@/components/PRsTable";
import BranchesTable from "@/components/BranchesTable";
import RadarUser from "@/components/RadarUser";
import TasksDetails from "@/components/TasksDetails";
import AttendanceCalendar from "@/components/AttendanceCalendar";
import ExportToPDF from "@/components/ExportToPDF";

// Definir los tipos de datos que se espera para cada conjunto de datos
interface Commit {
  id: string;
  message: string;
  date: string;
  // Agrega más propiedades según la estructura de tu JSON
}

interface PR {
  id: string;
  title: string;
  status: string;
  date: string;
  // Agrega más propiedades según la estructura de tu JSON
}

interface Branch {
  name: string;
  commitsCount: number;
  // Agrega más propiedades según la estructura de tu JSON
}

interface Task {
  id: string;
  bodyHTML: string;
  status: string;
  // Agrega más propiedades según la estructura de tu JSON
}

interface User {
  "Usuario de Github": string;
  fullName: string;
  group: string;
  city: string;
  grade: string;
  tutor: string;
  Asistencia?: Record<string, boolean>;
  Type?: string;
  // Agrega más propiedades según la estructura de tu JSON
}


export default function UserPage() {
  const params = useParams();
  const user = params.user;

  const [commits, setCommits] = useState<Commit[]>([]);
  const [prs, setPRs] = useState<PR[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userType, setUserType] = useState<string | null>(null);
  const [userAttendance, setUserAttendance] = useState<Record<string, boolean>>({});
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      // Realizar las peticiones a los archivos de datos JSON de forma segura
      const fetchData = async () => {
        try {
          const [commitsRes, prsRes, branchesRes, tasksRes] = await Promise.all([
            fetch(`/data/commits_${user}.json`),
            fetch(`/data/prs_${user}.json`),
            fetch(`/data/branches_${user}.json`),
            fetch(`/data/tasks_${user}.json`),
          ]);

          if (!commitsRes.ok || !prsRes.ok || !branchesRes.ok || !tasksRes.ok) {
            throw new Error("Error al cargar algunos de los archivos de datos.");
          }

          const [commitsData, prsData, branchesData, tasksData] = await Promise.all([
            commitsRes.json(),
            prsRes.json(),
            branchesRes.json(),
            tasksRes.json(),
          ]);

          setCommits(commitsData);
          setPRs(prsData);
          setBranches(branchesData);
          setTasks(tasksData);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Error desconocido");
        }
      };
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const usersRes = await fetch('/data/users.json');
        if (!usersRes.ok) throw new Error("Error al cargar los datos de los usuarios");

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
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (loading) return <p className="text-center text-gray-500">Cargando usuario...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <div id="user-profile">
        <h1 className="text-2xl font-bold">Actividad de {user}</h1>
        <UserSummary tasks={tasks} commits={commits} prs={prs} branches={branches} userAttendance={userAttendance} />
        <AttendanceCalendar userData={userData} />
        <UserActivityGraph user={user} />
        {userType && <RadarUser user={user} userType={userType} />}
        <CommitsGraph commits={commits} />
        <CommitsTable commits={commits} />
        <PRsTable prs={prs} />
        <BranchesTable branches={branches} />
        <TasksDetails tasks={tasks} allExpanded={true} />
      </div>
      <ExportToPDF user={user} />
    </div>
  );
}
