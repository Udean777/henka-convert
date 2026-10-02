import type { Language } from "$lib/i18n/messages";

export type MarketingCard = {
  eyebrow: string;
  title: string;
  description: string;
  icon?: FormatIconKind;
};

export type FormatIconKind =
  "image" | "document" | "table" | "media" | "pdf" | "audio" | "video";

export type MarketingQuestion = {
  title: string;
  answer: string;
};

export const siteChrome = {
  en: {
    navigation: "Main navigation",
    home: "Home",
    convert: "Convert",
    formats: "Formats",
    howItWorks: "How it works",
    help: "Help",
    privacy: "Privacy",
    about: "About",
  },
  id: {
    navigation: "Navigasi utama",
    home: "Beranda",
    convert: "Konversi",
    formats: "Format",
    howItWorks: "Cara kerja",
    help: "Bantuan",
    privacy: "Privasi",
    about: "Tentang",
  },
} satisfies Record<Language, Record<string, string>>;

export const marketingCopy = {
  en: {
    home: {
      metaTitle: "Henka Convert — A file lab that stays yours",
      metaDescription:
        "Convert images, documents, tables, audio, and video in your browser. Your files stay on your device.",
      eyebrow: "A small file lab for everyday changes",
      title: "Give your files a new format.",
      description:
        "A practical browser-based converter for the files you use every day. Choose a format, make the change, and keep your files on your device.",
      primaryAction: "Open the file lab",
      secondaryAction: "See supported formats",
      workbenchLabel: "On the workbench",
      workbenchTitle: "One place for all the little format fixes.",
      workbenchDescription:
        "Images, PDFs, documents, spreadsheets, audio, and video share one clear workspace. No account or upload queue to manage.",
      categories: [
        {
          eyebrow: "01 / IMAGE",
          title: "Images",
          description:
            "Resize by format, keep transparency where supported, or make a PDF from an image.",
        },
        {
          eyebrow: "02 / DOCUMENT",
          title: "Documents & PDF",
          description:
            "Move between common text formats or extract selectable text from a PDF.",
        },
        {
          eyebrow: "03 / TABLE",
          title: "Tables",
          description:
            "Convert CSV, JSON, Excel, OpenDocument, and HTML tables.",
        },
        {
          eyebrow: "04 / MEDIA",
          title: "Audio & video",
          description:
            "Convert common media formats with a local browser worker.",
        },
      ] satisfies MarketingCard[],
      stepsLabel: "Three steps, then done",
      stepsTitle: "A short route from source to result.",
      steps: [
        {
          eyebrow: "01",
          title: "Choose a tool",
          description:
            "Pick the file type that matches what you want to convert.",
        },
        {
          eyebrow: "02",
          title: "Set the result",
          description:
            "Add files and choose the output format and available options.",
        },
        {
          eyebrow: "03",
          title: "Save it locally",
          description:
            "Convert in your browser, then download the finished file.",
        },
      ] satisfies MarketingCard[],
      privacyLabel: "The local-first promise",
      privacyTitle: "Your file takes the short route.",
      privacyDescription:
        "Conversion happens in your browser. Henka does not send your selected files to a conversion server. Audio and video tools are downloaded by your browser the first time you use them.",
      privacyAction: "Read how file privacy works",
      faqLabel: "Before you start",
      faqTitle: "A few useful details.",
      faqLink: "Browse help and answers",
      footerNote: "A local-first file lab. Printed with care.",
    },
    formats: {
      metaTitle: "Supported formats | Henka Convert",
      metaDescription:
        "See which image, PDF, document, spreadsheet, audio, and video formats Henka Convert can process.",
      eyebrow: "The format drawer",
      title: "Know what goes in and what comes out.",
      description:
        "Henka supports everyday formats across six tools. Some conversions have limits or keep only basic content; those notes are listed with each group.",
      groups: [
        {
          eyebrow: "01 / IMAGE",
          icon: "image",
          title: "Images",
          description:
            "Common raster, vector, and camera image formats. GIF input and multi-page TIFF input use only the first frame or page.",
          input:
            "JPG, JPEG, PNG, WebP, AVIF, SVG, BMP, TIFF, GIF, ICO, JPEG XL, HEIC, HEIF",
          output:
            "JPEG, PNG, WebP, AVIF, BMP, TIFF, GIF, ICO, JPEG XL, HEIC, SVG, PDF",
        },
        {
          eyebrow: "02 / PAGE",
          icon: "pdf",
          title: "PDF",
          description:
            "Turn PDF pages into separate image files or extract text when it can be selected. Scanned pages need OCR, which is not included.",
          input:
            "PDF (page export or text extraction); image-to-PDF is in Images",
          output:
            "PNG, JPEG, WebP, AVIF, HEIC, BMP, TIFF, GIF, ICO, JPEG XL, selectable text",
        },
        {
          eyebrow: "03 / DOCUMENT",
          icon: "document",
          title: "Documents",
          description:
            "DOCX conversion keeps basic text and headings. Complex layout, styles, and embedded media can change.",
          input: "DOCX, HTML, TXT, Markdown",
          output: "DOCX, HTML, TXT, Markdown",
        },
        {
          eyebrow: "04 / TABLE",
          icon: "table",
          title: "Tables & spreadsheets",
          description:
            "Spreadsheet conversion uses one selected sheet and keeps visible values, not formulas or styling. JSON input must be a flat list of objects.",
          input: "CSV, TSV, JSON, XLSX, XLS, ODS, HTML tables",
          output: "CSV, TSV, JSON, XLSX, XLS, ODS, HTML tables",
        },
        {
          eyebrow: "05 / AUDIO",
          icon: "audio",
          title: "Audio",
          description:
            "Files up to 20 MB and 10 minutes. Your browser downloads the media engine before the first audio or video conversion.",
          input: "MP3, WAV, M4A, AAC, OGG, Opus, FLAC, AIFF, WMA",
          output: "MP3, WAV, M4A, OGG, FLAC, AIFF, WMA",
        },
        {
          eyebrow: "06 / VIDEO",
          icon: "video",
          title: "Video",
          description:
            "Clips up to 20 MB and 60 seconds. Large videos are resized automatically to fit device limits.",
          input: "MP4, MOV, WebM, MKV, AVI, M4V, 3GP, MPEG, TS",
          output: "MP4, MOV, WebM, MKV, AVI, M4V, 3GP, MPEG, TS",
        },
      ],
      action: "Choose a format and convert",
    },
    help: {
      metaTitle: "Help & common questions | Henka Convert",
      metaDescription:
        "Answers about local file conversion, supported formats, file limits, and common issues.",
      eyebrow: "Help desk, no ticket queue",
      title: "A few answers before the next try.",
      description:
        "Quick notes on how Henka handles files, what it supports, and what to try when a conversion stops.",
      questions: [
        {
          title: "Are my files uploaded?",
          answer:
            "No. The conversion runs in your browser and selected files are not sent to a conversion server. Your browser may download app assets, including the audio/video engine when you first use those tools.",
        },
        {
          title: "Which formats can I convert?",
          answer:
            "Henka has tools for images, PDFs, documents, tables, audio, and video. The Formats page lists the input and output formats for each tool, including known limitations.",
        },
        {
          title: "Why did the conversion fail?",
          answer:
            "The file may be damaged, unsupported, or too large for the available device memory. Check the message beside the file, try a supported format, or use a smaller file.",
        },
        {
          title: "Why does the first audio or video conversion take longer?",
          answer:
            "Your browser downloads the FFmpeg-based media engine the first time. The download is about 31 MB and later conversions can reuse the cached asset, depending on browser storage.",
        },
        {
          title: "Does a PDF scan become editable text?",
          answer:
            "Only if the PDF already contains selectable text. Scanned pages need OCR, which Henka does not currently provide.",
        },
        {
          title: "Will spreadsheets keep formulas and formatting?",
          answer:
            "No. Table conversion preserves visible cell values and leading zeros, but not formulas, macros, or styling. It processes one selected worksheet at a time.",
        },
        {
          title: "What should I try if the page is stuck?",
          answer:
            "Wait for any active conversion to finish, then refresh the page and add the file again. For audio or video, avoid closing the tab while a conversion is running.",
        },
      ] satisfies MarketingQuestion[],
      contactLabel: "Still stuck?",
      contactTitle: "Try the file lab again with a smaller sample.",
      contactDescription:
        "A small test file can help tell whether the issue is the format, the file itself, or the device.",
    },
    privacy: {
      metaTitle: "Privacy | Henka Convert",
      metaDescription:
        "How Henka Convert processes files in your browser and what preferences it saves on your device.",
      eyebrow: "Privacy, in plain language",
      title: "Your files stay in your browser.",
      description:
        "Henka is designed to convert files on your device. There is no conversion upload endpoint in this app.",
      points: [
        {
          eyebrow: "01 / FILES",
          title: "Conversion is local",
          description:
            "Selected files are processed by browser code and workers on your device. Henka does not send file contents to a conversion server.",
        },
        {
          eyebrow: "02 / PREFERENCES",
          title: "Only interface choices are saved",
          description:
            "Henka stores your language and theme preferences in your browser's local storage. Those preferences are not file contents.",
        },
        {
          eyebrow: "03 / MEDIA TOOLS",
          title: "Some tools load on first use",
          description:
            "Audio and video conversion downloads the FFmpeg media engine in your browser when needed. This is application code, not an upload of your media.",
        },
        {
          eyebrow: "04 / YOUR CONTROL",
          title: "You choose the file and the download",
          description:
            "The page keeps file data in memory while you work. Remove files or close the page when finished; downloaded results are saved by your browser.",
        },
      ] satisfies MarketingCard[],
      noteTitle: "A note about this page",
      noteDescription:
        "This page describes the current browser-only implementation. It is not legal advice. If the product adds analytics, accounts, or server-side processing, this page must be updated before those features launch.",
    },
    howItWorks: {
      metaTitle: "How file conversion works | Henka Convert",
      metaDescription:
        "See the steps behind a Henka conversion and what happens to your files in the browser.",
      eyebrow: "From source to result",
      title: "A clear process, right in your browser.",
      description:
        "Henka keeps the workflow short and the conversion close to your file. Choose what you need, check the output, then save it to your device.",
      steps: [
        {
          eyebrow: "01 / CHOOSE",
          title: "Pick a converter",
          description:
            "Select images, PDF, documents, tables, audio, or video to see the formats that fit that kind of file.",
        },
        {
          eyebrow: "02 / PREPARE",
          title: "Add files and options",
          description:
            "Choose files from your device, select an output format, and set any available options such as image quality or worksheet.",
        },
        {
          eyebrow: "03 / CONVERT",
          title: "Let the browser do the work",
          description:
            "The conversion engine runs on your device. Larger tasks may take longer and audio/video tools load the first time you use them.",
        },
        {
          eyebrow: "04 / SAVE",
          title: "Download the result",
          description:
            "Save individual results or download multiple finished files together as a ZIP archive.",
        },
      ] satisfies MarketingCard[],
      localTitle: "What happens to the file?",
      localDescription:
        "The selected file is read by your browser and processed locally. File contents are not sent to a conversion server. The page may download application code needed for certain formats.",
      privacyAction: "Read the privacy notes",
      convertAction: "Start a conversion",
    },
    about: {
      metaTitle: "About Henka Convert",
      metaDescription:
        "Meet Henka Convert, a small browser-based file lab built around useful tools and local processing.",
      eyebrow: "About the file lab",
      title: "Useful tools, with a little print-room character.",
      description:
        "Henka Convert is a browser-based file lab for everyday format changes. Its name nods to transformation; its visual language borrows from layered risograph prints.",
      principles: [
        {
          eyebrow: "01 / PRACTICAL",
          title: "Make the next step obvious",
          description:
            "Choose a tool, add a file, set the result, and download it. The workbench stays at the center.",
        },
        {
          eyebrow: "02 / LOCAL",
          title: "Keep processing close to the file",
          description:
            "Conversion runs on your device, without sending the selected file to a conversion server.",
        },
        {
          eyebrow: "03 / HONEST",
          title: "Show the edges, too",
          description:
            "Format notes and file limits are part of the product, especially where conversion can change content.",
        },
      ] satisfies MarketingCard[],
      action: "Go to the file lab",
    },
  },
  id: {
    home: {
      metaTitle: "Henka Convert — Laboratorium file yang tetap milik Anda",
      metaDescription:
        "Ubah gambar, dokumen, tabel, audio, dan video di browser. File tetap di perangkat Anda.",
      eyebrow: "Laboratorium file untuk kebutuhan sehari-hari",
      title: "Beri file Anda format baru.",
      description:
        "Konverter praktis di browser untuk file yang Anda gunakan sehari-hari. Pilih format, ubah file, dan simpan semuanya di perangkat Anda.",
      primaryAction: "Buka lab file",
      secondaryAction: "Lihat format yang didukung",
      workbenchLabel: "Di meja kerja",
      workbenchTitle: "Satu tempat untuk berbagai kebutuhan format.",
      workbenchDescription:
        "Gambar, PDF, dokumen, spreadsheet, audio, dan video dalam satu ruang kerja. Tanpa akun atau antrean unggahan.",
      categories: [
        {
          eyebrow: "01 / GAMBAR",
          title: "Gambar",
          description:
            "Ubah format, pertahankan transparansi jika didukung, atau buat PDF dari gambar.",
        },
        {
          eyebrow: "02 / DOKUMEN",
          title: "Dokumen & PDF",
          description:
            "Pindah antarformat teks umum atau ambil teks yang dapat dipilih dari PDF.",
        },
        {
          eyebrow: "03 / TABEL",
          title: "Tabel",
          description:
            "Konversi CSV, JSON, Excel, OpenDocument, dan tabel HTML.",
        },
        {
          eyebrow: "04 / MEDIA",
          title: "Audio & video",
          description:
            "Konversi format media umum dengan worker lokal di browser.",
        },
      ] satisfies MarketingCard[],
      stepsLabel: "Tiga langkah, lalu selesai",
      stepsTitle: "Jalur singkat dari file asal ke hasil.",
      steps: [
        {
          eyebrow: "01",
          title: "Pilih alat",
          description: "Pilih jenis file yang ingin Anda konversi.",
        },
        {
          eyebrow: "02",
          title: "Atur hasil",
          description:
            "Tambahkan file, lalu pilih format tujuan dan opsi yang tersedia.",
        },
        {
          eyebrow: "03",
          title: "Simpan di perangkat",
          description: "Konversi berjalan di browser, lalu unduh hasilnya.",
        },
      ] satisfies MarketingCard[],
      privacyLabel: "Prinsip lokal-first",
      privacyTitle: "File Anda menempuh jalur yang singkat.",
      privacyDescription:
        "Konversi berjalan di browser. Henka tidak mengirim file yang Anda pilih ke server konversi. Alat audio dan video diunduh oleh browser saat pertama kali digunakan.",
      privacyAction: "Baca cara kerja privasi file",
      faqLabel: "Sebelum mulai",
      faqTitle: "Beberapa hal yang perlu diketahui.",
      faqLink: "Lihat bantuan dan jawaban",
      footerNote: "Lab file lokal. Dicetak dengan cermat.",
    },
    formats: {
      metaTitle: "Format yang didukung | Henka Convert",
      metaDescription:
        "Lihat format gambar, PDF, dokumen, spreadsheet, audio, dan video yang dapat diproses Henka Convert.",
      eyebrow: "Laci format",
      title: "Ketahui apa yang bisa masuk dan keluar.",
      description:
        "Henka mendukung format sehari-hari dalam enam alat. Beberapa konversi memiliki batas atau hanya mempertahankan konten dasar; catatannya ada di tiap kelompok.",
      groups: [
        {
          eyebrow: "01 / GAMBAR",
          icon: "image",
          title: "Gambar",
          description:
            "Format gambar raster, vektor, dan kamera yang umum. GIF dan TIFF multi-halaman hanya memakai frame atau halaman pertama.",
          input:
            "JPG, JPEG, PNG, WebP, AVIF, SVG, BMP, TIFF, GIF, ICO, JPEG XL, HEIC, HEIF",
          output:
            "JPEG, PNG, WebP, AVIF, BMP, TIFF, GIF, ICO, JPEG XL, HEIC, SVG, PDF",
        },
        {
          eyebrow: "02 / HALAMAN",
          icon: "pdf",
          title: "PDF",
          description:
            "Ubah halaman PDF menjadi file gambar atau ambil teks jika teksnya bisa dipilih. Halaman hasil pindai memerlukan OCR yang belum tersedia.",
          input:
            "PDF (ekspor halaman atau ambil teks); gambar ke PDF ada di menu Gambar",
          output:
            "PNG, JPEG, WebP, AVIF, HEIC, BMP, TIFF, GIF, ICO, JPEG XL, teks yang dapat dipilih",
        },
        {
          eyebrow: "03 / DOKUMEN",
          icon: "document",
          title: "Dokumen",
          description:
            "Konversi DOCX mempertahankan teks dan judul dasar. Tata letak kompleks, gaya, dan media tersemat bisa berubah.",
          input: "DOCX, HTML, TXT, Markdown",
          output: "DOCX, HTML, TXT, Markdown",
        },
        {
          eyebrow: "04 / TABEL",
          icon: "table",
          title: "Tabel & spreadsheet",
          description:
            "Konversi spreadsheet memakai satu sheet terpilih dan mempertahankan nilai yang terlihat, bukan rumus atau gaya. JSON harus berupa daftar objek datar.",
          input: "CSV, TSV, JSON, XLSX, XLS, ODS, tabel HTML",
          output: "CSV, TSV, JSON, XLSX, XLS, ODS, tabel HTML",
        },
        {
          eyebrow: "05 / AUDIO",
          icon: "audio",
          title: "Audio",
          description:
            "Ukuran file maksimal 20 MB dan durasi 10 menit. Browser mengunduh mesin media sebelum konversi audio atau video pertama.",
          input: "MP3, WAV, M4A, AAC, OGG, Opus, FLAC, AIFF, WMA",
          output: "MP3, WAV, M4A, OGG, FLAC, AIFF, WMA",
        },
        {
          eyebrow: "06 / VIDEO",
          icon: "video",
          title: "Video",
          description:
            "Klip maksimal 20 MB dan 60 detik. Video besar akan diperkecil otomatis agar sesuai batas perangkat.",
          input: "MP4, MOV, WebM, MKV, AVI, M4V, 3GP, MPEG, TS",
          output: "MP4, MOV, WebM, MKV, AVI, M4V, 3GP, MPEG, TS",
        },
      ],
      action: "Pilih format dan mulai konversi",
    },
    help: {
      metaTitle: "Bantuan & pertanyaan umum | Henka Convert",
      metaDescription:
        "Jawaban tentang konversi file lokal, format yang didukung, batas file, dan kendala umum.",
      eyebrow: "Meja bantuan, tanpa antrean tiket",
      title: "Beberapa jawaban sebelum mencoba lagi.",
      description:
        "Catatan singkat tentang cara Henka menangani file, format yang didukung, dan langkah saat konversi terhenti.",
      questions: [
        {
          title: "Apakah file saya diunggah?",
          answer:
            "Tidak. Konversi berjalan di browser dan file pilihan tidak dikirim ke server konversi. Browser mungkin mengunduh aset aplikasi, termasuk mesin audio/video saat pertama kali memakai alat tersebut.",
        },
        {
          title: "Format apa yang bisa dikonversi?",
          answer:
            "Henka memiliki alat untuk gambar, PDF, dokumen, tabel, audio, dan video. Halaman Format mencantumkan format masukan dan keluaran tiap alat, termasuk batasannya.",
        },
        {
          title: "Mengapa konversi gagal?",
          answer:
            "File mungkin rusak, tidak didukung, atau terlalu besar untuk memori perangkat. Periksa pesan di samping file, coba format yang didukung, atau gunakan file lebih kecil.",
        },
        {
          title: "Mengapa konversi audio/video pertama lebih lama?",
          answer:
            "Browser mengunduh mesin media berbasis FFmpeg saat pertama kali digunakan. Ukurannya sekitar 31 MB; konversi berikutnya bisa memakai aset yang tersimpan di cache browser.",
        },
        {
          title: "Apakah hasil pindai PDF menjadi teks yang bisa diedit?",
          answer:
            "Hanya jika PDF tersebut sudah memiliki teks yang bisa dipilih. Halaman hasil pindai membutuhkan OCR, yang saat ini belum tersedia di Henka.",
        },
        {
          title: "Apakah rumus dan format spreadsheet tetap ada?",
          answer:
            "Tidak. Konversi tabel mempertahankan nilai sel yang terlihat dan nol di depan, tetapi tidak menyimpan rumus, makro, atau gaya. Satu sheet diproses setiap kali.",
        },
        {
          title: "Apa yang perlu dicoba saat halaman macet?",
          answer:
            "Tunggu konversi aktif selesai, lalu muat ulang halaman dan tambahkan file lagi. Untuk audio atau video, jangan tutup tab saat konversi berlangsung.",
        },
      ] satisfies MarketingQuestion[],
      contactLabel: "Masih terkendala?",
      contactTitle: "Coba lagi dengan file contoh yang lebih kecil.",
      contactDescription:
        "File uji kecil membantu mengetahui apakah masalah berasal dari format, file, atau perangkat.",
    },
    privacy: {
      metaTitle: "Privasi | Henka Convert",
      metaDescription:
        "Cara Henka Convert memproses file di browser dan preferensi yang disimpan di perangkat Anda.",
      eyebrow: "Privasi, dengan bahasa sederhana",
      title: "File Anda tetap di browser.",
      description:
        "Henka dirancang untuk mengonversi file di perangkat Anda. Aplikasi ini tidak memiliki endpoint unggah untuk konversi.",
      points: [
        {
          eyebrow: "01 / FILE",
          title: "Konversi berjalan lokal",
          description:
            "File pilihan diproses oleh kode browser dan worker di perangkat Anda. Henka tidak mengirim isi file ke server konversi.",
        },
        {
          eyebrow: "02 / PREFERENSI",
          title: "Hanya pilihan antarmuka yang disimpan",
          description:
            "Henka menyimpan bahasa dan tema di penyimpanan lokal browser. Preferensi tersebut bukan isi file.",
        },
        {
          eyebrow: "03 / ALAT MEDIA",
          title: "Beberapa alat dimuat saat pertama kali dipakai",
          description:
            "Konversi audio dan video mengunduh mesin media FFmpeg di browser saat diperlukan. Ini adalah kode aplikasi, bukan unggahan media Anda.",
        },
        {
          eyebrow: "04 / KENDALI ANDA",
          title: "Anda memilih file dan hasil unduhan",
          description:
            "Halaman menyimpan data file di memori selama Anda bekerja. Hapus file atau tutup halaman setelah selesai; hasil unduhan disimpan oleh browser.",
        },
      ] satisfies MarketingCard[],
      noteTitle: "Catatan tentang halaman ini",
      noteDescription:
        "Halaman ini menjelaskan implementasi browser-only saat ini dan bukan nasihat hukum. Jika produk menambahkan analitik, akun, atau pemrosesan server, halaman ini perlu diperbarui sebelum fitur tersebut diluncurkan.",
    },
    howItWorks: {
      metaTitle: "Cara kerja konversi file | Henka Convert",
      metaDescription:
        "Lihat langkah konversi Henka dan cara file Anda diproses di browser.",
      eyebrow: "Dari file asal ke hasil",
      title: "Proses yang jelas, langsung di browser.",
      description:
        "Henka membuat alurnya singkat dan proses konversi tetap dekat dengan file Anda. Pilih kebutuhan, periksa hasil, lalu simpan ke perangkat.",
      steps: [
        {
          eyebrow: "01 / PILIH",
          title: "Tentukan konverter",
          description:
            "Pilih gambar, PDF, dokumen, tabel, audio, atau video untuk melihat format yang sesuai.",
        },
        {
          eyebrow: "02 / SIAPKAN",
          title: "Tambahkan file dan opsi",
          description:
            "Pilih file dari perangkat, tentukan format keluaran, dan atur opsi yang tersedia seperti kualitas gambar atau sheet.",
        },
        {
          eyebrow: "03 / KONVERSI",
          title: "Biarkan browser bekerja",
          description:
            "Mesin konversi berjalan di perangkat Anda. Proses besar bisa lebih lama; alat audio/video dimuat saat pertama kali digunakan.",
        },
        {
          eyebrow: "04 / SIMPAN",
          title: "Unduh hasilnya",
          description:
            "Simpan hasil satu per satu atau unduh beberapa file sekaligus dalam arsip ZIP.",
        },
      ] satisfies MarketingCard[],
      localTitle: "Apa yang terjadi pada file?",
      localDescription:
        "File pilihan dibaca browser dan diproses secara lokal. Isinya tidak dikirim ke server konversi. Halaman dapat mengunduh kode aplikasi yang dibutuhkan untuk format tertentu.",
      privacyAction: "Baca catatan privasi",
      convertAction: "Mulai konversi",
    },
    about: {
      metaTitle: "Tentang Henka Convert",
      metaDescription:
        "Kenali Henka Convert, lab file kecil di browser dengan alat praktis dan pemrosesan lokal.",
      eyebrow: "Tentang lab file",
      title: "Alat yang berguna, dengan karakter ruang cetak.",
      description:
        "Henka Convert adalah lab file berbasis browser untuk mengubah format sehari-hari. Namanya merujuk pada perubahan; bahasa visualnya mengambil inspirasi dari cetak risograph berlapis.",
      principles: [
        {
          eyebrow: "01 / PRAKTIS",
          title: "Langkah berikutnya harus jelas",
          description:
            "Pilih alat, tambahkan file, tentukan hasil, lalu unduh. Meja kerja tetap jadi pusatnya.",
        },
        {
          eyebrow: "02 / LOKAL",
          title: "Proses file sedekat mungkin",
          description:
            "Konversi berjalan di perangkat Anda tanpa mengirim file pilihan ke server konversi.",
        },
        {
          eyebrow: "03 / JUJUR",
          title: "Tampilkan batasannya juga",
          description:
            "Catatan format dan batas file adalah bagian dari produk, terutama jika hasil konversi dapat mengubah konten.",
        },
      ] satisfies MarketingCard[],
      action: "Buka lab file",
    },
  },
} satisfies Record<Language, Record<string, unknown>>;
