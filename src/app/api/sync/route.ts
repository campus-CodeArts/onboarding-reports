
import fs from 'fs';
import path from 'path';
import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/authOptions';



export async function GET() {
  const session = await getServerSession(authOptions);

  console.log(`Session: ${session.role}`)

  /*if (!session || session.role !== 'admin') {
    return Response.json({ error: "No autenticado o sin token" }, { status: 401 });
  }*/

  try {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: session.accessToken });

    const sheets = google.sheets({ version: "v4", auth });

    const sheetId = process.env.GOOGLE_USERS_SHEET_ID;
    const range = process.env.GOOGLE_USERS_SHEET_RANGE;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range,
    });

    const [headers, ...rows] = response.data.values || [];
    const formattedData = rows.map(row => {
      const obj = { 'Asistencia': {} };
      headers.forEach((header, index) => {
        if(header.indexOf('Notas') == -1){
          if(header.indexOf('Daily Asistencia ') == 0){
            obj['Asistencia'][header.replace('Daily Asistencia ', '')] = row[index] == 'Sí' ? true : false;
          } else {
            obj[header] = row[index] || '';
          }
        }
      });
      return obj;
    }).filter((row) => row['Correo del tutor/a'] !== 'EL TUTOR, eliminado');
    formattedData.splice(0, 1);

    const filePath = path.join(process.cwd(), 'public/data/users.json');
    fs.writeFileSync(filePath, JSON.stringify(formattedData, null, 2));

    return Response.json({ message: 'Data synced successfully' });
  } catch (error) {
    return Response.json({ error: `Error al obtener datos: ${error}` }, { status: 500 });
  }
}