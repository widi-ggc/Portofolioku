// Utilitas ini berjalan di browser (sisi admin) SEBELUM file diunggah ke storage.
// Tujuannya: file yang benar-benar tersimpan di server sudah otomatis diberi
// watermark / dibatasi halamannya, supaya karya asli beresolusi/berhalaman penuh
// tidak pernah bocor ke publik.

/**
 * Menambahkan watermark teks transparan berulang (diagonal) ke sebuah gambar.
 * Hasil akhirnya dikembalikan sebagai Blob JPEG baru — file aslinya tidak diubah.
 */
export async function watermarkImage(file: File, text: string): Promise<Blob> {
  try {
    const imgBitmap = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    canvas.width = imgBitmap.width;
    canvas.height = imgBitmap.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;

    ctx.drawImage(imgBitmap, 0, 0);

    const fontSize = Math.max(16, Math.round(canvas.width / 24));
    ctx.font = `${fontSize}px sans-serif`;
    ctx.fillStyle = "rgba(255,255,255,0.32)";
    ctx.strokeStyle = "rgba(0,0,0,0.22)";
    ctx.lineWidth = 1;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(-Math.PI / 6);

    const stepX = fontSize * (text.length * 0.55 + 6);
    const stepY = fontSize * 4;
    const cols = Math.ceil((canvas.width * 1.6) / stepX);
    const rows = Math.ceil((canvas.height * 1.6) / stepY);

    for (let r = -rows; r <= rows; r++) {
      for (let c = -cols; c <= cols; c++) {
        const x = c * stepX;
        const y = r * stepY;
        ctx.strokeText(text, x, y);
        ctx.fillText(text, x, y);
      }
    }
    ctx.restore();

    return await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => resolve(blob || file), "image/jpeg", 0.9);
    });
  } catch (e) {
    console.error("Gagal menambahkan watermark, memakai file asli sebagai cadangan:", e);
    return file;
  }
}

/**
 * Memotong PDF menjadi maksimal `maxPages` halaman pertama, lalu menambahkan
 * watermark teks transparan diagonal di setiap halaman yang tersisa.
 */
export async function processPdf(file: File, text: string, maxPages = 15): Promise<Blob> {
  try {
    const { PDFDocument, rgb, degrees, StandardFonts } = await import("pdf-lib");
    const bytes = await file.arrayBuffer();
    const srcDoc = await PDFDocument.load(bytes);

    const totalPages = srcDoc.getPageCount();
    const keepCount = Math.min(totalPages, maxPages);

    const outDoc = await PDFDocument.create();
    const indices = Array.from({ length: keepCount }, (_, i) => i);
    const copiedPages = await outDoc.copyPages(srcDoc, indices);
    copiedPages.forEach((p) => outDoc.addPage(p));

    const font = await outDoc.embedFont(StandardFonts.HelveticaBold);

    outDoc.getPages().forEach((page) => {
      const { width, height } = page.getSize();
      const fontSize = Math.max(20, Math.round(width / 16));
      page.drawText(text, {
        x: width / 2 - (text.length * fontSize) / 4.5,
        y: height / 2,
        size: fontSize,
        font,
        color: rgb(0.55, 0.55, 0.55),
        opacity: 0.16,
        rotate: degrees(35),
      });
    });

    if (totalPages > maxPages) {
      const notePage = outDoc.getPage(outDoc.getPageCount() - 1);
      notePage.drawText(
        `Pratinjau dibatasi ${maxPages} dari ${totalPages} halaman dokumen asli.`,
        { x: 24, y: 20, size: 9, font, color: rgb(0.45, 0.45, 0.45) }
      );
    }

    const outBytes = await outDoc.save();
    return new Blob([new Uint8Array(outBytes)], { type: "application/pdf" });
  } catch (e) {
    console.error("Gagal memproses PDF, memakai file asli sebagai cadangan:", e);
    return file;
  }
}
