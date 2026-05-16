import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import * as XLSX from "xlsx";

/**
 * GET /api/admin/export
 *
 * Generates an Excel file with all registrations (admin-only).
 */
export async function GET() {
  try {
    const isAuthorized = await verifyAdmin();
    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const submissions = await db.submission.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Prepare data for Excel
    const rows = submissions.map((s, i) => ({
      "#": i + 1,
      Nom: s.name,
      Profession: s.profession,
      Email: s.email,
      Téléphone: s.phone,
      Message: s.message,
      "Date d'inscription": new Date(s.createdAt).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);

    // Set column widths
    ws["!cols"] = [
      { wch: 5 },  // #
      { wch: 25 }, // Nom
      { wch: 25 }, // Profession
      { wch: 30 }, // Email
      { wch: 18 }, // Téléphone
      { wch: 40 }, // Message
      { wch: 22 }, // Date
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Inscriptions");

    // Generate buffer
    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    // Return as downloadable file
    const filename = `GHA_Inscriptions_${new Date().toISOString().slice(0, 10)}.xlsx`;

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("[Admin Export] Error:", error);
    return NextResponse.json(
      { error: "Failed to export registrations" },
      { status: 500 }
    );
  }
}
