
/*import UsersTable from "@/components/UsersTable";*/
import UsersBrowser from "@/components/UsersBrowser";

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Dashboard de Actividad</h1>
      <p className="mt-2">Selecciona un usuario para ver su actividad:</p>
      <UsersBrowser></UsersBrowser>
    </div>
  );
}
