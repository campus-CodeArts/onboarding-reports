import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import archiver from "archiver";
import puppeteer from "puppeteer";

interface User {
  [key: string]: string | number | boolean | null;
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { filters } = await req.json();

    // Leer lista de usuarios desde el JSON con tipado
    const users: User[] = JSON.parse(await fs.promises.readFile("public/data/users.json", "utf8"));


    // Aplicar filtros
    const filteredUsers = users.filter((user: User) =>
      filters.every((filter: string) =>
        Object.values(user)
          .map(value => String(value)) // Convertimos todo a string
          .includes(String(filter))
      )
    );

    if (filteredUsers.length === 0) {
      return NextResponse.json({ error: "No se encontraron usuarios con esos filtros." }, { status: 400 });
    }

    // Crear directorio temporal
    const outputDir = path.join(process.cwd(), "public/reports");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "");
    const zipFileName = `informes_${timestamp}.zip`;
    const zipPath = path.join(outputDir, zipFileName);

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const baseUrl = process.env.PUBLIC_URL || "http://localhost:3000";

    for (const user of filteredUsers) {
      try {
        const url = `${baseUrl}/user/${user["Usuario de Github"]}/report`;
        const tutor = String(user["Correo del tutor/a"]).replace(/[<>]/g, ""); // Limpia caracteres no deseados

        const tutorDir = path.join(outputDir, tutor);
        if (!fs.existsSync(tutorDir)) fs.mkdirSync(tutorDir, { recursive: true });

        const pdfPath = path.join(tutorDir, `${user["Usuario de Github"]}.pdf`);

        await page.goto(url, { waitUntil: "networkidle2" });

        // Esperar a que la página haya cargado completamente
        await page.waitForSelector(".user-summary", { timeout: 30000 });
        await page.waitForSelector(".user-activity", { timeout: 30000 });
        await page.waitForFunction(() => document.fonts.status === "loaded");
        await page.waitForSelector("style, link[rel='stylesheet']", { timeout: 30000 });
        await page.waitForFunction(() =>
          Array.from(document.images).every(img => img.complete && img.naturalHeight !== 0)
        , { timeout: 120000 });

        await page.pdf({ path: pdfPath, format: "A4", printBackground: true });
      } catch (e) {
        console.log(`Error con ${user["Usuario de Github"]}:`, e);
      }
    }

    await browser.close();

    // Crear el ZIP con timestamp
    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    archive.pipe(output);
    filteredUsers.forEach((user: User) => {
      const tutor = String(user["Correo del tutor/a"]).replace(/[<>]/g, ""); // Limpia caracteres no deseados
      const filePath = path.join(outputDir, `${tutor}/${user["Usuario de Github"]}.pdf`);
      archive.file(filePath, { name: `${tutor}/${user["Usuario de Github"]}.pdf` });
    });

    await archive.finalize();

    return NextResponse.json({ downloadUrl: `/reports/${zipFileName}` });
  } catch (error) {
    console.error("Error generando informes:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
