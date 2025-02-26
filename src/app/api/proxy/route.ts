import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/authOptions';

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    const isLocal = req.headers.get('host') === 'localhost:3000';

    if (!isLocal && (!session || session.role === 'anonymous')) {
      return Response.json({ error: "No autenticado o sin token" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if (!url) {
        return NextResponse.json({ error: "Falta la URL" }, { status: 400 });
    }

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error al obtener la imagen: ${response.status}`);

        const contentType = response.headers.get("content-type");
        if (!contentType) throw new Error("No se pudo determinar el tipo de contenido");

        const buffer = await response.arrayBuffer();

        return new NextResponse(Buffer.from(buffer), {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=86400", // Cache 1 día
            },
        });
    } catch (error) {
        console.error("Error en el proxy:", error);
        return NextResponse.json({ error: "No se pudo obtener la imagen" }, { status: 500 });
    }
}
