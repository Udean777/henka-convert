export type Language = "en" | "id";

export const messages = {
  en: {
    languageLabel: "Language",
    lightTheme: "Switch to light theme",
    darkTheme: "Switch to dark theme",
    privacy: "Your files stay on your device",
    title: "File conversion, right in your browser.",
    description:
      "Convert images, PDFs, and Word documents on your device. Your files are not uploaded.",
    status: "Choose a file type to get started.",
    footer:
      "No backend conversion service. Files are processed in your browser.",
    featureImage: "Images",
    featurePdf: "PDF",
    featureDocx: "DOCX (experimental)",
    dropFiles: "Drop files here, or browse your device",
    chooseFiles: "Choose files",
    imageTypes: "JPG, PNG, WebP, AVIF, SVG, BMP, TIFF, HEIC, HEIF",
    tiffFirstPageNote: "Only the first page of a multi-page TIFF is converted.",
    pdfTypes: "PDF documents",
    docxTypes: "DOCX documents",
    convertTo: "Convert to",
    quality: "Image quality",
    transparencyNote:
      "JPEG does not support transparency. Transparent areas will use a white background.",
    docxNote:
      "Experimental: complex formatting, tables, and page layout may change during conversion.",
    pdfTextNote:
      "Text extraction works for selectable text. Scanned pages need OCR, which is not included.",
    addFiles: "Add files",
    clear: "Clear all",
    convert: "Convert files",
    download: "Download",
    downloadAll: "Download all as ZIP",
    remove: "Remove",
    ready: "Ready",
    converting: "Converting",
    complete: "Complete",
    failed: "Failed",
    noFiles: "No files added yet.",
    invalidFiles:
      "Some files were skipped because their format does not match this converter.",
    imageOutput: "JPG, PNG, WebP, or AVIF",
    checkingImageFormats: "Checking image format support in this browser…",
    imageFormatsUnavailable:
      "This browser does not support local image conversion. Try a current version of Safari, Firefox, or Chrome.",
    imageFormatUnavailableShort: "No supported formats",
    imageInputUnsupported:
      "This browser could not read this image. The file may be damaged or this format may not be supported.",
    imageOutputUnsupported:
      "This browser cannot create that output format. Choose another format.",
    imageWorkerUnsupported:
      "This browser does not support the background processing needed for image conversion.",
    imageTooLarge:
      "Images must be 40 megapixels or smaller, with no side over 16,384 pixels.",
    invalidSvg: "This SVG file is invalid or could not be read.",
    svgUnsupported: "This browser cannot rasterize this SVG image.",
    svgDimensionsMissing:
      "This SVG needs a valid viewBox or width and height before it can be converted.",
    imageConversionFailed:
      "Image conversion failed. Check the file and try another output format.",
    svgWidth: "SVG output width",
    svgWidthHint: "pixels; height is calculated to preserve the aspect ratio.",
    pdfOutput: "PNG pages, JPG pages, or text",
    docxOutput: "HTML, plain text, or Markdown",
    file: "file",
    files: "files",
    errorPrefix: "Conversion failed",
  },
  id: {
    languageLabel: "Pilih bahasa",
    lightTheme: "Ganti ke tema terang",
    darkTheme: "Ganti ke tema gelap",
    privacy: "File Anda tetap di perangkat ini",
    title: "Konversi file, langsung di browser Anda.",
    description:
      "Konversi gambar, PDF, dan dokumen Word langsung di perangkat. File Anda tidak diunggah.",
    status: "Pilih jenis file untuk memulai.",
    footer: "Tanpa layanan konversi backend. File diproses di browser Anda.",
    featureImage: "Gambar",
    featurePdf: "PDF",
    featureDocx: "DOCX (eksperimental)",
    dropFiles: "Letakkan file di sini atau pilih dari perangkat",
    chooseFiles: "Pilih file",
    imageTypes: "JPG, PNG, WebP, AVIF, SVG, BMP, TIFF, HEIC, HEIF",
    tiffFirstPageNote:
      "Hanya halaman pertama dari TIFF multi-halaman yang dikonversi.",
    pdfTypes: "Dokumen PDF",
    docxTypes: "Dokumen DOCX",
    convertTo: "Ubah ke",
    quality: "Kualitas gambar",
    transparencyNote:
      "JPEG tidak mendukung transparansi. Area transparan akan menggunakan latar putih.",
    docxNote:
      "Eksperimental: format kompleks, tabel, dan tata letak halaman dapat berubah saat konversi.",
    pdfTextNote:
      "Ekstraksi teks bekerja untuk teks yang dapat dipilih. Halaman hasil pindai memerlukan OCR yang belum tersedia.",
    addFiles: "Tambah file",
    clear: "Hapus semua",
    convert: "Konversi file",
    download: "Unduh",
    downloadAll: "Unduh semua sebagai ZIP",
    remove: "Hapus",
    ready: "Siap",
    converting: "Mengonversi",
    complete: "Selesai",
    failed: "Gagal",
    noFiles: "Belum ada file.",
    invalidFiles:
      "Beberapa file dilewati karena formatnya tidak sesuai dengan konverter ini.",
    imageOutput: "JPG, PNG, WebP, atau AVIF",
    checkingImageFormats: "Memeriksa dukungan format gambar di browser ini…",
    imageFormatsUnavailable:
      "Browser ini tidak mendukung konversi gambar lokal. Coba Safari, Firefox, atau Chrome versi terbaru.",
    imageFormatUnavailableShort: "Format tidak tersedia",
    imageInputUnsupported:
      "Browser ini tidak dapat membaca gambar. File mungkin rusak atau formatnya belum didukung.",
    imageOutputUnsupported:
      "Browser ini tidak dapat membuat format keluaran tersebut. Pilih format lain.",
    imageWorkerUnsupported:
      "Browser ini tidak mendukung pemrosesan latar belakang untuk konversi gambar.",
    imageTooLarge:
      "Ukuran gambar maksimal 40 megapiksel dan tiap sisinya maksimal 16.384 piksel.",
    invalidSvg: "File SVG ini tidak valid atau tidak dapat dibaca.",
    svgUnsupported: "Browser ini tidak dapat merasterisasi gambar SVG ini.",
    svgDimensionsMissing:
      "SVG ini perlu memiliki viewBox atau lebar dan tinggi yang valid agar dapat dikonversi.",
    imageConversionFailed:
      "Konversi gambar gagal. Periksa file atau coba format keluaran lain.",
    svgWidth: "Lebar hasil SVG",
    svgWidthHint: "piksel; tinggi dihitung untuk mempertahankan rasio gambar.",
    pdfOutput: "Halaman PNG, halaman JPG, atau teks",
    docxOutput: "HTML, teks biasa, atau Markdown",
    file: "file",
    files: "file",
    errorPrefix: "Konversi gagal",
  },
} satisfies Record<Language, Record<string, string>>;
