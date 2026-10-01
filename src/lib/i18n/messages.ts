export type Language = "en" | "id";

export const messages = {
  en: {
    languageLabel: "Language",
    lightTheme: "Switch to light theme",
    darkTheme: "Switch to dark theme",
    privacy: "Your files stay on your device",
    title: "File conversion, right in your browser.",
    description:
      "Convert images, PDFs, Word documents, and short videos on your device. Your files are not uploaded.",
    status: "Choose a file type to get started.",
    footer:
      "No backend conversion service. Files are processed in your browser.",
    featureImage: "Images",
    featurePdf: "PDF",
    featureDocx: "DOCX (experimental)",
    featureVideo: "Video",
    featureAudio: "Audio",
    dropFiles: "Drop files here, or browse your device",
    chooseFiles: "Choose files",
    imageTypes: "JPG, PNG, WebP, AVIF, SVG, BMP, TIFF, HEIC, HEIF",
    tiffFirstPageNote: "Only the first page of a multi-page TIFF is converted.",
    pdfTypes: "PDF documents",
    docxTypes: "DOCX documents",
    videoTypes: "MP4, MOV, or WebM videos (up to 20 MB)",
    audioTypes: "MP3, WAV, M4A/AAC, OGG/Opus, or FLAC audio",
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
    convertedFrom: "Converted from",
    convertedFiles: "Converted files",
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
    checkingVideoFormats: "Checking video encoding support in this browser…",
    videoFormatUnavailableShort: "No supported output formats",
    videoFormatsUnavailable:
      "This browser cannot encode MP4 or WebM locally at the supported video size.",
    videoLimitsNote:
      "Videos stay on your device. Files can be up to 20 MB and 60 seconds. High-resolution videos are resized automatically. Available output formats depend on this browser and device.",
    videoInputUnsupported:
      "This browser could not read the video. The file may be damaged or use an unsupported codec.",
    videoOutputUnsupported:
      "This browser cannot create that video format. Choose another available format.",
    videoWorkerUnsupported:
      "This browser does not support the background processing needed for video conversion.",
    videoTooLarge: "Videos must be 20 MB or smaller.",
    videoTooLong: "Videos must be 60 seconds or shorter.",
    videoDurationUnavailable:
      "Could not determine the video duration. Check that the file plays, then try again.",
    videoResolutionTooLarge:
      "This video’s resolution is too high to convert on this device. Try a smaller or lower-resolution file.",
    videoConversionFailed:
      "Video conversion failed. Check the file and try another output format.",
    checkingAudioFormats: "Checking local audio encoding support…",
    audioFormatUnavailableShort: "No supported output formats",
    audioFormatsUnavailable:
      "This browser could not prepare local audio conversion. Try reloading the page or a current browser.",
    audioLimitsNote:
      "Audio stays on your device. Files can be up to 20 MB and 10 minutes. FLAC input depends on browser support.",
    audioWavNote:
      "WAV can be much larger than the original. Choose MP3 for a smaller file.",
    audioInputUnsupported:
      "This audio file could not be read. It may be damaged or use a codec unsupported by this browser.",
    audioOutputUnsupported:
      "This browser cannot create that audio format. Choose another available format.",
    audioWorkerUnsupported:
      "This browser does not support the background processing needed for audio conversion.",
    audioTooLarge: "Audio files must be 20 MB or smaller.",
    audioTooLong: "Audio must be 10 minutes or shorter.",
    audioDurationUnavailable:
      "Could not determine the audio duration. Check that the file plays, then try again.",
    audioWavTooLarge:
      "This WAV result would be too large to create safely in the browser. Choose MP3 instead.",
    audioConversionFailed:
      "Audio conversion failed. Check the file and try another output format.",
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
      "Konversi gambar, PDF, dokumen Word, dan video pendek langsung di perangkat. File Anda tidak diunggah.",
    status: "Pilih jenis file untuk memulai.",
    footer: "Tanpa layanan konversi backend. File diproses di browser Anda.",
    featureImage: "Gambar",
    featurePdf: "PDF",
    featureDocx: "DOCX (eksperimental)",
    featureVideo: "Video",
    featureAudio: "Audio",
    dropFiles: "Letakkan file di sini atau pilih dari perangkat",
    chooseFiles: "Pilih file",
    imageTypes: "JPG, PNG, WebP, AVIF, SVG, BMP, TIFF, HEIC, HEIF",
    tiffFirstPageNote:
      "Hanya halaman pertama dari TIFF multi-halaman yang dikonversi.",
    pdfTypes: "Dokumen PDF",
    docxTypes: "Dokumen DOCX",
    videoTypes: "Video MP4, MOV, atau WebM (maksimal 20 MB)",
    audioTypes: "Audio MP3, WAV, M4A/AAC, OGG/Opus, atau FLAC",
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
    convertedFrom: "Dikonversi dari",
    convertedFiles: "File hasil konversi",
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
    checkingVideoFormats: "Memeriksa dukungan encoding video di browser ini…",
    videoFormatUnavailableShort: "Format keluaran tidak tersedia",
    videoFormatsUnavailable:
      "Browser ini tidak dapat membuat MP4 atau WebM lokal pada batas ukuran video yang didukung.",
    videoLimitsNote:
      "Video tetap di perangkat Anda. Ukuran file maksimal 20 MB dan durasi 60 detik. Resolusi tinggi akan diperkecil otomatis. Format keluaran yang tersedia bergantung pada browser dan perangkat.",
    videoInputUnsupported:
      "Browser ini tidak dapat membaca video. File mungkin rusak atau memakai codec yang tidak didukung.",
    videoOutputUnsupported:
      "Browser ini tidak dapat membuat format video tersebut. Pilih format lain yang tersedia.",
    videoWorkerUnsupported:
      "Browser ini tidak mendukung pemrosesan latar belakang untuk konversi video.",
    videoTooLarge: "Ukuran video maksimal 20 MB.",
    videoTooLong: "Durasi video maksimal 60 detik.",
    videoDurationUnavailable:
      "Durasi video tidak dapat dibaca. Pastikan file dapat diputar, lalu coba lagi.",
    videoResolutionTooLarge:
      "Resolusi video ini terlalu tinggi untuk dikonversi di perangkat ini. Coba file dengan resolusi lebih rendah.",
    videoConversionFailed:
      "Konversi video gagal. Periksa file atau coba format keluaran lain.",
    checkingAudioFormats: "Memeriksa dukungan konversi audio lokal…",
    audioFormatUnavailableShort: "Format keluaran tidak tersedia",
    audioFormatsUnavailable:
      "Browser ini belum dapat menyiapkan konversi audio lokal. Muat ulang halaman atau coba browser versi terbaru.",
    audioLimitsNote:
      "Audio tetap di perangkat Anda. Ukuran file maksimal 20 MB dan durasi 10 menit. Dukungan input FLAC bergantung pada browser.",
    audioWavNote:
      "Ukuran WAV bisa jauh lebih besar dari file asal. Pilih MP3 untuk hasil yang lebih kecil.",
    audioInputUnsupported:
      "File audio tidak dapat dibaca. File mungkin rusak atau memakai codec yang tidak didukung browser ini.",
    audioOutputUnsupported:
      "Browser ini tidak dapat membuat format audio tersebut. Pilih format lain yang tersedia.",
    audioWorkerUnsupported:
      "Browser ini tidak mendukung pemrosesan latar belakang untuk konversi audio.",
    audioTooLarge: "Ukuran file audio maksimal 20 MB.",
    audioTooLong: "Durasi audio maksimal 10 menit.",
    audioDurationUnavailable:
      "Durasi audio tidak dapat dibaca. Pastikan file dapat diputar, lalu coba lagi.",
    audioWavTooLarge:
      "Hasil WAV ini terlalu besar untuk dibuat dengan aman di browser. Coba pilih MP3.",
    audioConversionFailed:
      "Konversi audio gagal. Periksa file atau coba format keluaran lain.",
    file: "file",
    files: "file",
    errorPrefix: "Konversi gagal",
  },
} satisfies Record<Language, Record<string, string>>;
