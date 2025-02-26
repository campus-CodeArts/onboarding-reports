"use client";
import html2pdf from "html2pdf.js";

export default function ExportToPDF({ user }) {

  const handleExportPDF = () => {
    const element = document.getElementById("user-profile");
    if (!element) return;

    const options = {
      margin: 10,
      filename: `${user}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, logging: false, dpi: 192 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().from(element).set(options).save();
  };

  return (
    <button
      onClick={handleExportPDF}
      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Exportar a PDF
    </button>
  );
}
