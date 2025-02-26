"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSession } from 'next-auth/react';

const defaultRole = process.env.DEFAULT_ROLE;
const ROLE_PROTECT_ENABLED = process.env.ROLE_PROTECT === "enabled" ? true: false;

export default function UserBrowser() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const router = useRouter();
  const [userRole, setUserRole] = useState(defaultRole);

  useEffect(() => {
    fetch("/data/users.json")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setFilteredUsers(data);
      })
      .catch((error) => console.error("Error fetching users:", error));
      if (session?.role) {
          setUserRole(session.role || defaultRole);
      }
  }, [session]);

  useEffect(() => {
    setFilteredUsers(
      users.filter((user) =>
        (user["Nombre completo"].toLowerCase().includes(search.toLowerCase()) ||
          user["Usuario de Github"].toLowerCase().includes(search.toLowerCase())) &&
        (filters.length === 0 || filters.every((filter) => Object.values(user).includes(filter)))
      )
    );
  }, [search, users, filters]);

  const toggleFilter = (filter) => {
    setFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  const generateReports = async () => {
    setLoadingReports(true);
    setDownloadUrl("");

    try {
      const res = await fetch("/api/generate-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filters }),
      });

      const data = await res.json();
      if (data.downloadUrl) setDownloadUrl(data.downloadUrl);
    } catch (error) {
      console.error("Error generando informes:", error);
    }

    setLoadingReports(false);
  };

  return (
    <div className="p-4">
      <Input
        placeholder="Buscar por nombre o usuario de GitHub..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Badge key={filter} onClick={() => toggleFilter(filter)} className="cursor-pointer">
            {filter} ✕
          </Badge>
        ))}
        {filters.length > 0 && (
          <Button onClick={() => setFilters([])} variant="outline">Borrar filtros</Button>
        )}
      </div>

      {(!ROLE_PROTECT_ENABLED || userRole === 'admin') && (
      <Button onClick={generateReports} disabled={loadingReports} className="mb-4">
        {loadingReports ? "Generando..." : "Generar Informes"}
      </Button>)}

      {downloadUrl && (
        <p>
          <a href={downloadUrl} className="text-blue-500 hover:underline" download>
            Descargar informes ZIP
          </a>
        </p>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Usuario GitHub</TableCell>
            <TableCell>Grupo</TableCell>
            <TableCell>Ciudad</TableCell>
            <TableCell>Grado</TableCell>
            <TableCell>Preferencia</TableCell>
            <TableCell>Correo Tutor</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user["Usuario de Github"]}>
              <TableCell>{user["Nombre completo"]}</TableCell>
              <TableCell onClick={() => router.push(`/user/${user["Usuario de Github"]}`)} className="cursor-pointer hover:bg-gray-100">{user["Usuario de Github"]}</TableCell>
              <TableCell>
                <Badge onClick={() => toggleFilter(user["Grupo"])} className="cursor-pointer">{user["Grupo"]}</Badge>
              </TableCell>
              <TableCell>
                <Badge onClick={() => toggleFilter(user["Ciudad"])} className="cursor-pointer">{user["Ciudad"]}</Badge>
              </TableCell>
              <TableCell>
                <Badge onClick={() => toggleFilter(user["Grado"])} className="cursor-pointer">{user["Grado"]}</Badge>
              </TableCell>
              <TableCell>
                <Badge onClick={() => toggleFilter(user["Preferencia"])} className="cursor-pointer">{user["Preferencia"]}</Badge>
              </TableCell>
              <TableCell>
                <Badge onClick={() => toggleFilter(user["Correo del tutor/a"])} className="cursor-pointer">{user["Correo del tutor/a"]}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
