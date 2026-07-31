import { defineStore } from 'pinia'
import { ref } from 'vue'

export type Language = 'id' | 'en'

export const useI18nStore = defineStore('i18n', () => {
  const currentLang = ref<Language>('id')

  const initLang = () => {
    const saved = localStorage.getItem('henka_lang') as Language | null
    if (saved === 'id' || saved === 'en') {
      currentLang.value = saved
    } else {
      const browserLang = navigator.language.toLowerCase()
      currentLang.value = browserLang.startsWith('id') ? 'id' : 'en'
    }
  }

  const setLanguage = (lang: Language) => {
    currentLang.value = lang
    localStorage.setItem('henka_lang', lang)
  }

  const toggleLanguage = () => {
    setLanguage(currentLang.value === 'id' ? 'en' : 'id')
  }

  return {
    currentLang,
    initLang,
    setLanguage,
    toggleLanguage,
  }
})

export const translations = {
  id: {
    // Header & Tabs
    fileConverter: 'Konverter File',
    youtubeToSomething: 'YouTube ke Media',
    pdfTools: 'Alat PDF',

    // Hero Section
    heroTitlePrefix: 'Konversi ',
    heroTitleHighlight: 'Apa Saja',
    heroTitleSuffix: ', Secara Lokal.',
    heroSubtitle:
      'File Anda tidak pernah meninggalkan perangkat. Konversi cepat, aman, dan privat didukung oleh mesin WebAssembly.',

    // DropZone
    dropZoneTitle: 'Taruh file di sini atau klik untuk memilih',
    dropZoneSubtitle: 'Mendukung Gambar, Dokumen, Audio, Video, dan Data',
    chooseFiles: 'Pilih File',

    // YouTube
    youtubePlaceholder: 'Tempel link video YouTube di sini (cth: https://youtube.com/watch?v=...)',
    fetchMedia: 'Ambil Media',
    youtubeGuide: 'Tempelkan URL YouTube di atas untuk mengekstrak audio MP3 atau video MP4.',

    // Job Queue
    queueTitle: 'Daftar Konversi',
    clearAll: 'Hapus Semua',
    clearCompleted: 'Hapus Selesai',
    convertAll: 'Konversi Semua',
    converting: 'Mengonversi...',
    statusReady: 'Siap',
    statusProcessing: 'Memproses',
    statusCompleted: 'Selesai',
    statusError: 'Gagal',
    download: 'Unduh',
    downloadZip: 'Unduh ZIP',
    remove: 'Hapus',
    targetFormat: 'Format Tujuan',
    addSuffix: 'Tambah akhiran',
    unsupported: 'Tidak Didukung',
    convert: 'Konversi',

    // PDF Tools
    pdfDropTitle: 'Klik atau taruh file PDF di sini',
    pdfDropSubtitle: 'Hanya file .pdf yang didukung di sini',
    selectedPdfs: 'PDF Terpilih',
    merge: 'Gabung',
    rotate: 'Putar 90°',
    downloadResult: 'Unduh Hasil',
    execute: 'Jalankan',
    processing: 'Memproses...',

    // YouTube
    addQueue: 'Tambah ke Antrean',
    audio: 'Audio',
    video: 'Video',

    // Footer & Modals
    close: 'Tutup',
    features: 'Fitur',
    supportedFormats: 'Format Didukung',
    documentation: 'Dokumentasi',
    githubRepo: 'Repositori GitHub',
    reportIssue: 'Laporkan Masalah',
    privacyFooter: 'Dibuat untuk privasi & kecepatan.',
    noCloudUploads: '0 byte diunggah ke cloud.',
    wasmReady: 'Mesin WASM Siap',
    platformFeatures: 'Fitur Platform',

    // Feature Modal Contents
    featureLocalTitle: '100% Lokal & Privat',
    featureLocalDesc:
      'Semua konversi dilakukan langsung di perangkat Anda melalui WebAssembly dan server lokal. File Anda tidak pernah diunggah ke cloud.',
    featureYtTitle: 'YouTube ke Media',
    featureYtDesc:
      'Unduh dan konversi video YouTube menjadi MP3 (Audio) atau MP4 (Video) secara instan dengan dukungan berbagai pilihan kualitas resolusi terbaik.',
    featurePdfTitle: 'Alat PDF Toolkit',
    featurePdfDesc:
      'Alat komprehensif untuk memanipulasi dokumen PDF Anda, termasuk menggabungkan, memisahkan halaman, kompresi cerdas, dan ekstraksi.',
    featureImgTitle: 'Mesin Gambar & Dokumen',
    featureImgDesc:
      'Konversi massal untuk semua format gambar modern (WebP, PNG, JPG) dan dokumen Office (DOCX, XLSX, PPTX) langsung dari tab browser Anda.',

    formatsSubtitle:
      'HenkaConvert mendukung operasi dua arah dan satu arah untuk standar format populer berikut ini:',
    mediaAudio: 'Media & Audio',
    images: 'Gambar',
    docsData: 'Dokumen & Data',
    // Landing Page
    landingTag: '100% Konversi Lokal & Privat',
    landingTitlePrefix: 'Konversi Berbagai Format File Tanpa ',
    landingTitleHighlight: 'Batas & Cloud Upload.',
    landingSubtitle:
      'Nikmati kecepatan konversi berkecepatan tinggi bertenaga WebAssembly. File dokumen, gambar, audio, dan video Anda tetap 100% aman di perangkat Anda.',
    openConverterApp: 'Buka Konverter',
    exploreFeatures: 'Jelajahi Fitur',

    statUsers: 'Konversi Cepat',
    statFormats: '7,400+ Jalur Format',
    statPrivacy: '100% Privat & Lokal',

    whyHenkaTitle: 'Mengapa Memilih HenkaConvert?',
    whyHenkaSubtitle:
      'Dirancang khusus dengan standar privasi tertinggi dan performa tanpa kompromi.',

    feature1Title: 'Zero Cloud Storage',
    feature1Desc:
      'File tidak pernah diunggah ke server pihak ketiga. Semua proses berjalan secara aman di browser & perangkat lokal Anda.',
    feature2Title: 'Universal Format Matrix',
    feature2Desc:
      'Konversi silang antar dokumen, gambar, audio, video, hingga data (PDF, DOCX, PNG, MP4, MP3, XLSX, JSON, dll).',
    feature3Title: 'WASM Speed Engine',
    feature3Desc:
      'Ditenagai oleh WebAssembly canggih untuk pemrosesan super cepat tanpa batasan ukuran file yang ketat.',
    feature4Title: 'YouTube to Media',
    feature4Desc:
      'Ekstraksi instan audio MP3 dan video MP4 dari link YouTube dengan kualitas resolusi tinggi.',

    faqTitle: 'Pertanyaan yang Sering Diajukan (FAQ)',
    faq1Q: 'Apakah file saya diunggah ke internet?',
    faq1A:
      'Tidak sama sekali. HenkaConvert memproses file secara lokal menggunakan teknologi WebAssembly dan mesin lokal. Data Anda tidak pernah meninggalkan perangkat Anda.',
    faq2Q: 'Apakah layanan ini gratis?',
    faq2A:
      'Ya, HenkaConvert 100% gratis dan open-source tanpa perlu mendaftar akun atau berlangganan.',
    faq3Q: 'Format apa saja yang didukung?',
    faq3A:
      'Kami mendukung 40+ format populer meliputi Gambar (JPG, PNG, WebP, SVG), Dokumen (PDF, DOCX, TXT), Audio (MP3, WAV, FLAC), Video (MP4, WebM, MKV), dan Data (CSV, XLSX, JSON).',

    ctaTitle: 'Siap Mengonversi File Anda?',
    ctaSubtitle: 'Mulai konversi file secara instan, aman, dan tanpa iklan sekarang juga.',

    // Marquee
    marquee100Local: '100% LOKAL',
    marqueePrivate: 'PRIVAT DENGAN DESAIN',
    marqueeConvertAnything: 'KONVERSI APA SAJA',
    marqueeNoCloud: 'TANPA UNGGAH CLOUD',
    marqueeOpenSource: 'SUMBER TERBUKA',
  },
  en: {
    // Header & Tabs
    fileConverter: 'File Converter',
    youtubeToSomething: 'YouTube to Media',
    pdfTools: 'PDF Tools',

    // Hero Section
    heroTitlePrefix: 'Convert ',
    heroTitleHighlight: 'Anything',
    heroTitleSuffix: ', Locally.',
    heroSubtitle:
      'Your files never leave your device. Fast, secure, and private conversion powered by WebAssembly engine.',

    // DropZone
    dropZoneTitle: 'Drop files here or click to browse',
    dropZoneSubtitle: 'Supports Images, Documents, Audio, Video, and Data',
    chooseFiles: 'Choose Files',

    // YouTube
    youtubePlaceholder: 'Paste YouTube video link here (e.g. https://youtube.com/watch?v=...)',
    fetchMedia: 'Fetch Media',
    youtubeGuide: 'Paste a YouTube URL above to extract MP3 audio or MP4 video.',

    // Job Queue
    queueTitle: 'Conversion Queue',
    clearAll: 'Clear All',
    clearCompleted: 'Clear Completed',
    convertAll: 'Convert All',
    converting: 'Converting...',
    statusReady: 'Ready',
    statusProcessing: 'Processing',
    statusCompleted: 'Completed',
    statusError: 'Error',
    download: 'Download',
    downloadZip: 'Download ZIP',
    remove: 'Remove',
    targetFormat: 'Target Format',
    addSuffix: 'Add suffix',
    unsupported: 'Unsupported',
    convert: 'Convert',

    // PDF Tools
    pdfDropTitle: 'Click or drag PDF files here',
    pdfDropSubtitle: 'Only .pdf files are supported here',
    selectedPdfs: 'Selected PDFs',
    merge: 'Merge',
    rotate: 'Rotate 90°',
    downloadResult: 'Download Result',
    execute: 'Execute',
    processing: 'Processing...',

    // YouTube
    addQueue: 'Add to Queue',
    audio: 'Audio',
    video: 'Video',

    // Footer & Modals
    close: 'Close',
    features: 'Features',
    supportedFormats: 'Supported Formats',
    documentation: 'Documentation',
    githubRepo: 'GitHub Repository',
    reportIssue: 'Report Issue',
    privacyFooter: 'Crafted for privacy & speed.',
    noCloudUploads: '0 bytes uploaded to the cloud.',
    wasmReady: 'WASM Engine Ready',
    platformFeatures: 'Platform Features',

    // Feature Modal Contents
    featureLocalTitle: '100% Local & Private',
    featureLocalDesc:
      'All conversions happen directly on your device via WebAssembly and local engines. Your files are never uploaded to the cloud.',
    featureYtTitle: 'YouTube to Media',
    featureYtDesc:
      'Download and convert YouTube videos to MP3 (Audio) or MP4 (Video) instantly with various resolution options.',
    featurePdfTitle: 'PDF Toolkit',
    featurePdfDesc:
      'Comprehensive tool for manipulating your PDF documents, including merging, page rotation, splitting, and extraction.',
    featureImgTitle: 'Image & Docs Engine',
    featureImgDesc:
      'Batch conversion for modern image formats (WebP, PNG, JPG) and Office documents (DOCX, XLSX, PPTX) directly from your browser tab.',

    formatsSubtitle:
      'HenkaConvert supports bidirectional and single direction conversions for popular standard formats:',
    mediaAudio: 'Media & Audio',
    images: 'Images',
    docsData: 'Documents & Data',
    // Landing Page
    landingTag: '100% Local & Private Conversion',
    landingTitlePrefix: 'Convert Any File Format Without ',
    landingTitleHighlight: 'Limits & Cloud Uploads.',
    landingSubtitle:
      'Experience high-speed WebAssembly powered conversion. Your documents, images, audio, and video files stay 100% safe on your device.',
    openConverterApp: 'Open Converter App',
    exploreFeatures: 'Explore Features',

    statUsers: 'Lightning Fast',
    statFormats: '7,400+ Format Paths',
    statPrivacy: '100% Private & Local',

    whyHenkaTitle: 'Why Choose HenkaConvert?',
    whyHenkaSubtitle:
      'Crafted specifically with the highest privacy standards and uncompromised performance.',

    feature1Title: 'Zero Cloud Storage',
    feature1Desc:
      'Files are never uploaded to third-party servers. All operations execute securely inside your browser & local machine.',
    feature2Title: 'Universal Format Matrix',
    feature2Desc:
      'Cross convert documents, images, audio, video, and data (PDF, DOCX, PNG, MP4, MP3, XLSX, JSON, etc).',
    feature3Title: 'WASM Speed Engine',
    feature3Desc:
      'Powered by WebAssembly for ultra-fast processing without strict file size limits.',
    feature4Title: 'YouTube to Media',
    feature4Desc:
      'Instant MP3 audio and MP4 video extraction from YouTube links with high-resolution quality.',

    faqTitle: 'Frequently Asked Questions (FAQ)',
    faq1Q: 'Are my files uploaded to the internet?',
    faq1A:
      'Not at all. HenkaConvert processes files locally using WebAssembly and local engines. Your data never leaves your device.',
    faq2Q: 'Is this service free?',
    faq2A:
      'Yes, HenkaConvert is 100% free and open-source without requiring account creation or subscription.',
    faq3Q: 'What formats are supported?',
    faq3A:
      'We support 40+ popular formats including Images (JPG, PNG, WebP, SVG), Documents (PDF, DOCX, TXT), Audio (MP3, WAV, FLAC), Video (MP4, WebM, MKV), and Data (CSV, XLSX, JSON).',

    ctaTitle: 'Ready to Convert Your Files?',
    ctaSubtitle: 'Start converting files instantly, securely, and ad-free right now.',

    // Marquee
    marquee100Local: '100% LOCAL',
    marqueePrivate: 'PRIVATE BY DESIGN',
    marqueeConvertAnything: 'CONVERT ANYTHING',
    marqueeNoCloud: 'NO CLOUD UPLOADS',
    marqueeOpenSource: 'OPEN SOURCE',
  },
}
