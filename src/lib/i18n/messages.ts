export type Language = "en" | "id";

export const messages = {
  en: {
    languageLabel: "Language",
    lightTheme: "Switch to light theme",
    darkTheme: "Switch to dark theme",
    fileConverter: "File converter",
    conversionType: "Conversion type",
    privacy: "Your files stay on your device.",
    seoTitle: "Free Online File Converter | Henka Convert",
    seoDescription:
      "Convert images, PDFs, documents, spreadsheets, audio, and video in your browser. Your files stay on your device.",
    title: "Convert files in your browser.",
    description:
      "Convert images, PDFs, documents, spreadsheets, audio, and video. Your files stay on your device.",
    status: "Choose a converter, then add your files.",
    footer: "No account needed. We don't upload your files.",
    featureImage: "Images",
    featurePdf: "PDF",
    featureDocx: "Documents",
    featureVideo: "Video",
    featureAudio: "Audio",
    featureData: "Tables",
    dropFiles: "Drop files here, or browse your device",
    chooseFiles: "Choose files",
    imageTypes:
      "JPG, PNG, WebP, AVIF, SVG, BMP, TIFF, GIF, ICO, JPEG XL, HEIC, HEIF",
    tiffFirstPageNote: "Only the first page of a multi-page TIFF is converted.",
    pdfTypes: "PDF documents",
    docxTypes: "DOCX, HTML, TXT, or Markdown documents",
    videoTypes:
      "MP4, MOV, WebM, MKV, AVI, M4V, 3GP, MPEG, or TS video (up to 20 MB)",
    audioTypes: "MP3, WAV, M4A/AAC, OGG/Opus, FLAC, AIFF, or WMA audio",
    dataTypes: "CSV, TSV, JSON, XLSX, XLS, ODS, and HTML tables",
    convertTo: "Convert to",
    quality: "Image quality",
    transparencyNote:
      "JPEG, BMP, and GIF outputs use a white background for transparent areas.",
    docxNote:
      "Document conversion keeps basic text and headings. Formatting and images may change. We remove code that could run when you open an HTML file.",
    documentWorkerUnsupported:
      "Document conversion couldn't start in this browser. Try another browser or file.",
    documentTooLarge: "Document files must be 20 MB or smaller.",
    documentOutputTooLarge:
      "This document is too large to convert on this device. Try a smaller file.",
    documentInputUnsupported:
      "This file is not a supported DOCX, HTML, TXT, or Markdown document.",
    documentConversionFailed:
      "We couldn't convert this document. Check that it opens on your device, then try again.",
    pdfTextNote:
      "This works when you can select text in the PDF. Scanned pages need text recognition, which isn't available here.",
    pdfNoSelectableText:
      "This PDF has no selectable text. Scanned pages can't be converted to text.",
    pdfPageImageUnavailable:
      "We couldn't create an image from this PDF page. Try another format.",
    addFiles: "Add files",
    clear: "Clear all",
    convert: "Convert files",
    download: "Download",
    downloadAll: "Download all as ZIP",
    convertedFrom: "Converted from",
    convertedFiles: "Converted files",
    remove: "Remove",
    ready: "Ready",
    converting: "Converting",
    complete: "Complete",
    failed: "Failed",
    noFiles: "No files added yet.",
    invalidFiles:
      "Some files weren't added because they don't match this converter.",
    imageOutput:
      "JPEG, PNG, WebP, AVIF, HEIC, BMP, TIFF, GIF, ICO, JPEG XL, SVG, or PDF",
    imageInputUnsupported:
      "We couldn't open this image. It may be damaged or in a format we can't read.",
    imageOutputUnsupported:
      "We couldn't save this image in that format. Try another format.",
    imageWorkerUnsupported:
      "Image conversion couldn't start in this browser. Try another browser or file.",
    imageTooLarge:
      "This image is too large to convert on this device. Try a smaller image.",
    invalidSvg: "This SVG file is invalid or could not be read.",
    svgUnsupported: "We couldn't open this SVG. Try another image format.",
    svgDimensionsMissing:
      "This SVG is missing its image size, so we can't convert it.",
    imageConversionFailed:
      "We couldn't convert this image. Check that it opens, then try another format.",
    svgWidth: "Image width",
    svgWidthHint: "pixels. We'll adjust the height to match.",
    svgOutputNote:
      "The SVG will contain your image. It won't turn it into editable vector artwork.",
    imagePdfNote:
      "Creates a one-page PDF from this image. Transparent areas use a white background.",
    pdfOutput: "Each PDF page becomes a separate image file.",
    docxOutput: "DOCX, HTML, plain text, or Markdown",
    videoLimitsNote:
      "Videos can be up to 20 MB and 60 seconds. We automatically resize very large videos. Before your first audio or video conversion, your browser downloads extra tools. This can take longer on a slow connection. Your video stays on your device.",
    videoInputUnsupported:
      "We couldn't open this video. It may be damaged or use a format we can't read.",
    videoOutputUnsupported:
      "We couldn't save this video in that format. Try another format.",
    videoWorkerUnsupported:
      "Video conversion couldn't start in this browser. Try another browser or file.",
    videoTooLarge: "This video is over the 20 MB limit. Choose a smaller file.",
    videoTooLong:
      "This video is longer than 60 seconds. Choose a shorter clip.",
    videoOutputTooLarge:
      "The converted video would be too large to save. Try a shorter clip.",
    videoDurationUnavailable:
      "We couldn't read how long this video is. Check that it plays, then try again.",
    videoResolutionTooLarge:
      "This video is too large to convert on this device. Try a shorter clip or a smaller video.",
    videoConversionFailed:
      "We couldn't convert this video. Check that it plays, then try another format.",
    audioLimitsNote:
      "Audio files can be up to 20 MB and 10 minutes. Before your first audio or video conversion, your browser downloads extra tools. This can take longer on a slow connection. Your audio stays on your device.",
    audioWavNote:
      "WAV files can be much larger than the original. Choose MP3 for a smaller file.",
    audioInputUnsupported:
      "We couldn't open this audio file. It may be damaged or in a format we can't read.",
    audioOutputUnsupported:
      "We couldn't save this audio in that format. Try another format.",
    audioWorkerUnsupported:
      "Audio conversion couldn't start in this browser. Try another browser or file.",
    audioTooLarge:
      "This audio file is over the 20 MB limit. Choose a smaller file.",
    audioTooLong:
      "This audio is longer than 10 minutes. Choose a shorter file.",
    audioDurationUnavailable:
      "We couldn't read how long this audio is. Check that it plays, then try again.",
    audioOutputTooLarge:
      "The converted audio would be too large to save. Try a shorter file or choose MP3.",
    audioConversionFailed:
      "We couldn't convert this audio. Check that it plays, then try another format.",
    dataLimitsNote:
      "Files can be up to 20 MB. Each spreadsheet sheet can contain up to 1 million cells.",
    dataStructureNote:
      "CSV and TSV use the first row as column names. JSON needs a simple list of objects. For spreadsheets, choose one sheet. Results keep the visible values and leading zeros, but not formulas or styling. HTML files use the first table.",
    dataWorksheetNamesLoading: "Reading sheet names…",
    dataSelectWorksheet: "Choose a sheet",
    dataWorkerUnsupported:
      "Table conversion couldn't start in this browser. Try another browser or file.",
    dataTooLarge: "This file is over the 20 MB limit. Choose a smaller file.",
    dataOutputTooLarge:
      "The converted file would be too large to save. Try a smaller file.",
    dataInvalidInput:
      "We couldn't open this file as a table. Check that it contains CSV, TSV, JSON, Excel, OpenDocument, or HTML table data.",
    dataInvalidHeaders:
      "The first row needs a different name for each column. Column names can't be blank.",
    dataJsonStructureUnsupported:
      "JSON needs a simple list of objects. Nested data isn't supported yet.",
    dataSheetSelectionRequired: "Choose a sheet before converting this file.",
    dataSheetUnavailable:
      "We couldn't find that sheet. Choose another one and try again.",
    dataSheetTooLarge:
      "This sheet has too much data to convert. Try a smaller sheet.",
    dataConversionFailed:
      "We couldn't convert this table. Check that it opens, then try again.",
    file: "file",
    files: "files",
    errorPrefix: "Conversion failed",
  },
  id: {
    languageLabel: "Pilih bahasa",
    lightTheme: "Ganti ke tema terang",
    darkTheme: "Ganti ke tema gelap",
    fileConverter: "Konverter file",
    conversionType: "Jenis konversi",
    privacy: "File tetap di perangkat Anda.",
    seoTitle: "Konverter File Online Gratis | Henka Convert",
    seoDescription:
      "Ubah gambar, PDF, dokumen, spreadsheet, audio, dan video langsung di browser. File tetap di perangkat Anda.",
    title: "Konversi file langsung di browser.",
    description:
      "Ubah gambar, PDF, dokumen, spreadsheet, audio, dan video. File tetap di perangkat Anda.",
    status: "Pilih jenis konverter, lalu tambahkan file.",
    footer: "Tanpa akun dan tanpa mengunggah file.",
    featureImage: "Gambar",
    featurePdf: "PDF",
    featureDocx: "Dokumen",
    featureVideo: "Video",
    featureAudio: "Audio",
    featureData: "Tabel",
    dropFiles: "Letakkan file di sini atau pilih dari perangkat",
    chooseFiles: "Pilih file",
    imageTypes:
      "JPG, PNG, WebP, AVIF, SVG, BMP, TIFF, GIF, ICO, JPEG XL, HEIC, HEIF",
    tiffFirstPageNote:
      "Hanya halaman pertama dari TIFF multi-halaman yang dikonversi.",
    pdfTypes: "Dokumen PDF",
    docxTypes: "Dokumen DOCX, HTML, TXT, atau Markdown",
    videoTypes:
      "Video MP4, MOV, WebM, MKV, AVI, M4V, 3GP, MPEG, atau TS (maksimal 20 MB)",
    audioTypes: "Audio MP3, WAV, M4A/AAC, OGG/Opus, FLAC, AIFF, atau WMA",
    dataTypes: "Tabel CSV, TSV, JSON, XLSX, XLS, ODS, dan HTML",
    convertTo: "Ubah ke",
    quality: "Kualitas gambar",
    transparencyNote:
      "Hasil JPEG, BMP, dan GIF memakai latar putih untuk area transparan.",
    docxNote:
      "Konversi dokumen mempertahankan teks dan judul dasar. Tata letak dan gambar bisa berubah. Kami menghapus kode yang dapat berjalan saat file HTML dibuka.",
    documentWorkerUnsupported:
      "Konversi dokumen tidak bisa dimulai di browser ini. Coba browser atau file lain.",
    documentTooLarge: "Ukuran file dokumen maksimal 20 MB.",
    documentOutputTooLarge:
      "Dokumen ini terlalu besar untuk dikonversi di perangkat ini. Coba file yang lebih kecil.",
    documentInputUnsupported:
      "File ini bukan dokumen DOCX, HTML, TXT, atau Markdown yang didukung.",
    documentConversionFailed:
      "Dokumen ini tidak bisa dikonversi. Pastikan file bisa dibuka, lalu coba lagi.",
    pdfTextNote:
      "Fitur ini bekerja jika teks di PDF bisa dipilih. Halaman hasil pindai memerlukan pengenalan teks yang belum tersedia.",
    pdfNoSelectableText:
      "PDF ini tidak memiliki teks yang bisa dipilih. PDF hasil pindai tidak bisa diubah menjadi teks.",
    pdfPageImageUnavailable:
      "Halaman PDF ini tidak bisa dibuat menjadi gambar. Coba format lain.",
    addFiles: "Tambah file",
    clear: "Hapus semua",
    convert: "Konversi file",
    download: "Unduh",
    downloadAll: "Unduh semua sebagai ZIP",
    convertedFrom: "Dikonversi dari",
    convertedFiles: "File hasil konversi",
    remove: "Hapus",
    ready: "Siap",
    converting: "Mengonversi",
    complete: "Selesai",
    failed: "Gagal",
    noFiles: "Belum ada file.",
    invalidFiles:
      "Beberapa file tidak ditambahkan karena formatnya tidak sesuai dengan konverter ini.",
    imageOutput:
      "JPEG, PNG, WebP, AVIF, HEIC, BMP, TIFF, GIF, ICO, JPEG XL, SVG, atau PDF",
    imageInputUnsupported:
      "Gambar ini tidak bisa dibuka. File mungkin rusak atau formatnya belum didukung.",
    imageOutputUnsupported:
      "Gambar ini tidak bisa disimpan dalam format tersebut. Coba format lain.",
    imageWorkerUnsupported:
      "Konversi gambar tidak bisa dimulai di browser ini. Coba browser atau file lain.",
    imageTooLarge:
      "Gambar ini terlalu besar untuk dikonversi di perangkat ini. Coba gambar yang lebih kecil.",
    invalidSvg: "File SVG ini tidak valid atau tidak dapat dibaca.",
    svgUnsupported: "SVG ini tidak bisa dibuka. Coba format gambar lain.",
    svgDimensionsMissing:
      "Ukuran gambar tidak tercantum di file SVG ini, jadi kami tidak bisa mengonversinya.",
    imageConversionFailed:
      "Gambar ini tidak bisa dikonversi. Pastikan file bisa dibuka, lalu coba format lain.",
    svgWidth: "Lebar gambar",
    svgWidthHint: "piksel. Tinggi akan disesuaikan dengan gambar.",
    svgOutputNote:
      "File SVG akan berisi gambar Anda. Gambar tidak akan berubah menjadi karya vektor yang bisa diedit.",
    imagePdfNote:
      "Membuat PDF satu halaman dari gambar ini. Area transparan akan memakai latar putih.",
    pdfOutput: "Setiap halaman PDF menjadi file gambar tersendiri.",
    docxOutput: "DOCX, HTML, teks biasa, atau Markdown",
    videoLimitsNote:
      "Ukuran video maksimal 20 MB dan durasinya 60 detik. Video yang sangat besar akan diperkecil otomatis. Sebelum konversi audio atau video pertama, browser mengunduh alat tambahan. Proses ini bisa lebih lama jika koneksi lambat. Video tetap di perangkat Anda.",
    videoInputUnsupported:
      "Video ini tidak bisa dibuka. File mungkin rusak atau formatnya belum didukung.",
    videoOutputUnsupported:
      "Video ini tidak bisa disimpan dalam format tersebut. Coba format lain.",
    videoWorkerUnsupported:
      "Konversi video tidak bisa dimulai di browser ini. Coba browser atau file lain.",
    videoTooLarge:
      "Video ini melebihi batas 20 MB. Pilih file yang lebih kecil.",
    videoTooLong:
      "Video ini lebih dari 60 detik. Pilih klip yang lebih pendek.",
    videoOutputTooLarge:
      "Ukuran video hasil konversi terlalu besar. Coba klip yang lebih pendek.",
    videoDurationUnavailable:
      "Lama video tidak bisa dibaca. Pastikan videonya bisa diputar, lalu coba lagi.",
    videoResolutionTooLarge:
      "Video ini terlalu besar untuk dikonversi di perangkat ini. Coba klip yang lebih pendek atau video yang lebih kecil.",
    videoConversionFailed:
      "Video ini tidak bisa dikonversi. Pastikan videonya bisa diputar, lalu coba format lain.",
    audioLimitsNote:
      "Ukuran audio maksimal 20 MB dan durasinya 10 menit. Sebelum konversi audio atau video pertama, browser mengunduh alat tambahan. Proses ini bisa lebih lama jika koneksi lambat. Audio tetap di perangkat Anda.",
    audioWavNote:
      "File WAV bisa jauh lebih besar dari file asal. Pilih MP3 untuk hasil yang lebih kecil.",
    audioInputUnsupported:
      "Audio ini tidak bisa dibuka. File mungkin rusak atau formatnya belum didukung.",
    audioOutputUnsupported:
      "Audio ini tidak bisa disimpan dalam format tersebut. Coba format lain.",
    audioWorkerUnsupported:
      "Konversi audio tidak bisa dimulai di browser ini. Coba browser atau file lain.",
    audioTooLarge:
      "Audio ini melebihi batas 20 MB. Pilih file yang lebih kecil.",
    audioTooLong:
      "Audio ini lebih dari 10 menit. Pilih file yang lebih pendek.",
    audioDurationUnavailable:
      "Lama audio tidak bisa dibaca. Pastikan file bisa diputar, lalu coba lagi.",
    audioOutputTooLarge:
      "Ukuran audio hasil konversi terlalu besar. Coba file yang lebih pendek atau pilih MP3.",
    audioConversionFailed:
      "Audio ini tidak bisa dikonversi. Pastikan file bisa diputar, lalu coba format lain.",
    dataLimitsNote:
      "Ukuran file maksimal 20 MB. Satu sheet spreadsheet dapat berisi hingga 1 juta sel.",
    dataStructureNote:
      "Baris pertama CSV dan TSV menjadi nama kolom. JSON harus berupa daftar objek sederhana. Untuk spreadsheet, pilih satu sheet. Hasil mempertahankan nilai yang terlihat dan nol di depan, tetapi tidak menyimpan rumus atau gaya asli. File HTML memakai tabel pertama.",
    dataWorksheetNamesLoading: "Membaca nama sheet…",
    dataSelectWorksheet: "Pilih sheet",
    dataWorkerUnsupported:
      "Konversi tabel tidak bisa dimulai di browser ini. Coba browser atau file lain.",
    dataTooLarge: "File ini melebihi batas 20 MB. Pilih file yang lebih kecil.",
    dataOutputTooLarge:
      "Ukuran hasil terlalu besar untuk disimpan. Coba file yang lebih kecil.",
    dataInvalidInput:
      "File ini tidak bisa dibuka sebagai tabel. Pastikan isinya berupa CSV, TSV, JSON, Excel, OpenDocument, atau tabel HTML.",
    dataInvalidHeaders:
      "Setiap kolom perlu memiliki nama yang berbeda. Nama kolom tidak boleh kosong.",
    dataJsonStructureUnsupported:
      "JSON harus berupa daftar objek sederhana. Data bertingkat belum didukung.",
    dataSheetSelectionRequired: "Pilih sheet sebelum mengonversi file ini.",
    dataSheetUnavailable:
      "Sheet yang dipilih tidak ditemukan. Pilih sheet lain lalu coba lagi.",
    dataSheetTooLarge:
      "Sheet ini berisi terlalu banyak data untuk dikonversi. Coba sheet yang lebih kecil.",
    dataConversionFailed:
      "Tabel ini tidak bisa dikonversi. Periksa file lalu coba lagi.",
    file: "file",
    files: "file",
    errorPrefix: "Konversi gagal",
  },
} satisfies Record<Language, Record<string, string>>;
