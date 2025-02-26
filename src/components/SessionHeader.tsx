'use client';

import { useEffect, useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

const defaultRole = process.env.DEFAULT_ROLE;
const ROLE_PROTECT_ENABLED = process.env.ROLE_PROTECT === "enabled" ? true: false;

export default function SessionHeader() {
    const { data: session } = useSession();
    const [userRole, setUserRole] = useState(defaultRole);

    useEffect(() => {
        console.log(session)
        if (session?.role) {
            setUserRole(session.role || defaultRole);
        }
    }, [session]);

    return (
        <header className="flex justify-between items-center p-4 bg-gray-900 text-white">
                {ROLE_PROTECT_ENABLED && userRole === 'anonymous' && (
                    <nav className="flex space-x-4 justify-between items-center">
                        <Link href="/">
                            <span className="hover:underline">Inicio</span>
                        </Link>
                    </nav>
                )}
                {(!ROLE_PROTECT_ENABLED || userRole === 'student') && (
                    <nav className="flex space-x-4 justify-between items-center">
                        <Link href="/">
                            <span className="hover:underline">Inicio</span>
                        </Link>
                        <Link href="/users">
                            <span className="hover:underline">Users</span>
                        </Link>
                        <Link href="/ranking/teams">
                            <span className="hover:underline">Teams</span>
                        </Link>
                        <Link href="/ranking">
                            <span className="hover:underline">Ranking</span>
                        </Link>
                    </nav>
                )}
                {ROLE_PROTECT_ENABLED && userRole === 'admin' && (
                    <nav className="flex space-x-4 justify-between items-center">
                        <Link href="/">
                            <span className="hover:underline">Inicio</span>
                        </Link>
                        <Link href="/users">
                            <span className="hover:underline">Users</span>
                        </Link>
                        <Link href="/ranking/teams">
                            <span className="hover:underline">Teams</span>
                        </Link>
                        <Link href="/ranking">
                            <span className="hover:underline">Ranking</span>
                        </Link>
                        <Link href="/admin">
                            <span className="hover:underline">Admin</span>
                        </Link>
                    </nav>
                )}
            <div className="flex items-center space-x-4">
                {ROLE_PROTECT_ENABLED ? (session?.user ? (
                    <>
                        <Image src={session.user.image || '/default-avatar.png'} alt="User avatar" width={40} height={40} className="rounded-full" />
                        <button onClick={() => signOut()} className="bg-red-500 px-4 py-2 rounded">Salir</button>
                    </>
                ) : (
                    <button onClick={() => signIn()} className="bg-blue-500 px-4 py-2 rounded">Iniciar sesión</button>
                )): ''}
            </div>
        </header>
    );
}