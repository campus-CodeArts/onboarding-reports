'use client';

import { useEffect, useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from "next/navigation";

const defaultRole = process.env.DEFAULT_ROLE;
const ROLE_PROTECT_ENABLED = process.env.ROLE_PROTECT === "enabled" ? true: false;

export default function SessionHeader() {
    const { data: session } = useSession();
    const [userRole, setUserRole] = useState(defaultRole);
    const pathname = usePathname();

    useEffect(() => {
        if (session?.role) {
            console.log(session.role)
            setUserRole(session.role);
        }
    }, [session]);

    if (pathname.endsWith('report')) {
        return (<></>);
    }

    return (
        <header className="flex justify-between items-center p-4 bg-gray-900 text-white">
                <nav className="flex space-x-4 justify-between items-center">
                        <Link href="/">
                            <span className="hover:underline">Inicio</span>
                        </Link>
                {(!ROLE_PROTECT_ENABLED || userRole !== 'anonymous') && (
                    <Link href="/users">
                        <span className="hover:underline">Users</span>
                    </Link>
                )}
                {(!ROLE_PROTECT_ENABLED || userRole !== 'anonymous') && (
                    <Link href="/ranking/teams">
                        <span className="hover:underline">Teams</span>
                    </Link>
                )}
                {(!ROLE_PROTECT_ENABLED || userRole !== 'anonymous') && (
                    <Link href="/ranking">
                        <span className="hover:underline">Ranking</span>
                    </Link>
                )}
                {userRole === 'admin' && (
                    <Link href="/admin">
                        <span className="hover:underline">Admin</span>
                    </Link>
                )}
                </nav>
            <div className="flex items-center space-x-4">
                {session?.user ? (
                    <>
                        <Image src={session.user.image || '/default-avatar.png'} alt="User avatar" width={40} height={40} className="rounded-full" />
                        <button onClick={() => signOut()} className="bg-red-500 px-4 py-2 rounded">Salir</button>
                    </>
                ) : (
                    <button onClick={() => signIn()} className="bg-blue-500 px-4 py-2 rounded">Iniciar sesión</button>
                )}
            </div>
        </header>
    );
}