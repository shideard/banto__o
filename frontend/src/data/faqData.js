// src/data/faqData.js
export const faqCategories = [
  {
    id: "ubah-password",
    icon: "🔑",
    label: "Ubah / Reset Password",
    questions: [
      {
        id: "ubah-pw-1",
        q: "Bagaimana cara mengganti password?",
        a: "Bagi civitas akademika IPB (Mahasiswa / Staf) dapat mengunjungi https://apps.ipb.ac.id kemudian pilih menu **Change Password**.",
        links: [{ label: "apps.ipb.ac.id", url: "https://apps.ipb.ac.id" }],
      },
      {
        id: "ubah-pw-2",
        q: "Apabila saya lupa password, apa yang dapat saya lakukan?",
        a: "Bagi civitas akademika IPB (Mahasiswa / Staf) dapat mengunjungi https://apps.ipb.ac.id kemudian pilih menu **Reset Password** dan nanti anda akan diarahkan untuk mereset password di email alternatif anda.",
        links: [{ label: "apps.ipb.ac.id", url: "https://apps.ipb.ac.id" }],
      },
      {
        id: "ubah-pw-3",
        q: "Bagaimana kalau lupa password dan belum/lupa ada email alternatif?",
        a: "Pilih menu Reset Password, inputkan identitas yang masih anda ingat (username/nrp/nip) kemudian input data yang diperlukan. Jangan lupa, lakukan **swafoto dengan menyertakan kartu identitas**. Tunggu sampai ada email masuk dari admin untuk proses verifikasi.",
      },
      {
        id: "ubah-pw-4",
        q: "Berapa lama tahap verifikasi email berlangsung?",
        a: "Estimasi proses verifikasi email alternatif **maksimal 3 x 24 jam**. Silakan cek email alternatif anda secara berkala, selain di inbox email cek juga pada folder spam dan lain-lain.",
      },
      {
        id: "ubah-pw-5",
        q: "Apa yang harus dilakukan setelah reset password berhasil?",
        a: "Silakan lakukan proses **setting ulang device** anda (handphone/laptop) dengan melakukan *forget wifi* IPB-ACCESS lalu setting kembali wifi IPB-ACCESS.",
      },
      {
        id: "ubah-pw-6",
        q: "Bagaimana cara setting ulang IPB Access?",
        a: "Silakan kunjungi laman https://ipb.link/connect-ipb-access. Atau jika anda terkendala, silakan meminta bantuan helpdesk kami yang berlokasi di **Gedung Perpustakaan B Lantai 1**.",
        links: [{ label: "Panduan Connect IPB Access", url: "https://ipb.link/connect-ipb-access" }],
      },
      {
        id: "ubah-pw-7",
        q: "Apakah akun unit kerja juga perlu email alternatif untuk Reset Password?",
        a: "**YA**, akun unit kerja (email unit, email jurnal, email organisasi, email event) memerlukan email alternatif selain email IPB pada proses reset password.",
      },
      {
        id: "ubah-pw-8",
        q: "Bagaimana cara mendaftarkan email alternatif untuk akun unit kerja?",
        a: "Silahkan mengisi link GForm berikut:",
        links: [{ label: "GForm Konfirmasi Email Alternatif", url: "https://ipb.link/konfirmasi-emailalternatif" }],
      },
      {
        id: "ubah-pw-9",
        q: "Bagaimana cara tahu email alternatif sudah terdaftar?",
        a: "Silakan cek email alternatif anda **maksimal 2 x 24 jam** setelah anda input data di GForm. Setelah itu, anda kunjungi kembali laman https://apps.ipb.ac.id dan lanjutkan proses reset password di menu \"Reset Password\".",
        links: [{ label: "apps.ipb.ac.id", url: "https://apps.ipb.ac.id" }],
      },
    ],
  },
  {
    id: "akun-ipb",
    icon: "👤",
    label: "Akun IPB",
    questions: [
      {
        id: "akun-1",
        q: "Sampai kapan akun ID IPB saya berlaku?",
        a: "Untuk mahasiswa, masa berlaku ID IPB adalah **satu tahun sejak tanggal lulus**. Dalam jangka waktu satu tahun tersebut silakan backup data Anda ke tempat lain (hard disk, komputer, laptop). Data yang dihapus termasuk email, Google Calendar, dan file di Google Drive.",
      },
      {
        id: "akun-2",
        q: "Bagaimana jika lupa Username dan Password?",
        a: "Kunjungi **apps.ipb.ac.id** → pilih menu *Reset Password*. Pilih jenis identitas yang masih anda ingat: **Username**, **NIM**, atau **NIP**. Sistem akan mengirimkan verifikasi ke email alternatif Anda (cek inbox dan folder spam).",
        links: [{ label: "apps.ipb.ac.id", url: "https://apps.ipb.ac.id" }],
      },
      {
        id: "akun-3",
        q: "Bagaimana jika ingin mengubah password (password lama masih ingat)?",
        a: "Disarankan mengikuti panduannya di laman Change Password:",
        links: [{ label: "Change Password IPB", url: "https://akun.ipb.ac.id/changepassword" }],
      },
      {
        id: "akun-4",
        q: "Bagaimana jika belum mempunyai akun IPB?",
        a: "Melampirkan **surat permohonan** yang ditujukan kepada Kepala Lembaga Manajemen Informasi dan Transformasi Digital, dengan mencantumkan:\n1. Nama Lengkap\n2. NIP/NIK\n3. Email Alternatif\n4. No Kontak",
      },
      {
        id: "akun-5",
        q: "Permohonan pembuatan Akun Guest?",
        a: "Mengirimkan **surat permohonan** yang ditujukan kepada Kepala Lembaga Manajemen Informasi dan Transformasi Digital dengan mencantumkan informasi berapa jumlah tamu dan berapa lama penggunaan akun tersebut.",
      },
    ],
  },
  {
    id: "email-gapps",
    icon: "📧",
    label: "Email & GApps",
    questions: [
      {
        id: "email-1",
        q: "Permohonan pembuatan email IPB bagi dosen, tendik, dan mahasiswa?",
        a: "Mengirimkan **surat permohonan** kepada Kepala Lembaga Manajemen Informasi dan Transformasi Digital, dengan mencantumkan:\n1. Nama Lengkap\n2. NIP/NIK\n3. Email Alternatif\n4. No Kontak",
      },
      {
        id: "email-2",
        q: "Permohonan pembuatan email IPB bagi unit dan Lembaga Kemahasiswaan?",
        a: "Melampirkan **surat permohonan** kepada Kepala Lembaga Manajemen Informasi dan Transformasi Digital, dengan mencantumkan:\n1. Username yang diinginkan\n2. Email Alternatif\n3. No Kontak",
      },
      {
        id: "email-3",
        q: "Bagaimana jika email apps.ipb.ac.id invalid?",
        a: "Biasanya terjadi karena akun email **belum diaktifkan**. Silakan mengirim tiket melalui Helpcenter IPB dan tunggu respon selanjutnya.",
      },
      {
        id: "email-4",
        q: "Bagaimana jika email IPB (ipb.ac.id) ingin diaktifkan kembali?",
        a: "Silakan mengirim tiket melalui **Helpcenter IPB** dan tunggu respon selanjutnya.",
      },
      {
        id: "email-5",
        q: "Bagaimana jika G-Apps di suspend?",
        a: "Akun anda (terutama drive) di-suspend langsung oleh pihak Google karena **melanggar peraturan**. Demi keamanan, akun google anda akan dinonaktifkan sampai batas waktu yang tidak dapat ditentukan. Pengaktifan kembali tergantung kebijakan IPB.",
      },
    ],
  },
  {
    id: "koneksi-internet",
    icon: "🌐",
    label: "Konektivitas Internet",
    questions: [
      {
        id: "inet-1",
        q: "Bagaimana cara terhubung ke IPB-ACCESS atau Eduroam?",
        a: "Silakan akses laman Konektivitas Internet IPB yang berisi cara-cara dan langkah yang harus dilakukan secara detail:",
        links: [{ label: "Panduan Konektivitas Internet IPB", url: "https://ict.ipb.ac.id/konektivitas-internet-ipb/" }],
      },
      {
        id: "inet-2",
        q: "Jika masih terkendala apa yang harus saya lakukan?",
        a: "Silahkan datang langsung ke **Kantor LMITD (Layanan ICT) Lt. 1 Gedung B Perpustakaan (Gedung Bundar)** pada hari kerja Senin–Jumat, Pukul 08.00 s/d 16.00.",
      },
      {
        id: "inet-3",
        q: "Permohonan Akses VPN?",
        a: "Terlebih dahulu menyertakan **surat permohonan** yang ditujukan kepada Kepala Lembaga Manajemen Informasi dan Transformasi Digital, untuk selanjutnya di proses.",
      },
    ],
  },
  {
    id: "windows-office",
    icon: "💻",
    label: "Windows & Microsoft Office",
    questions: [
      {
        id: "ms-1",
        q: "Bagaimana cara meng-install Windows 10 / Office 2016 / Office for Mac?",
        a: "Disarankan datang langsung ke **Kantor LMITD (Layanan ICT) Lt. 1 Gedung B Perpustakaan (Gedung Bundar)** pada hari kerja Senin–Jumat, Pukul 08.00 s/d 16.00.",
      },
      {
        id: "ms-2",
        q: "Bagaimana jika tidak bisa akses Office 365?",
        a: "Disarankan mengikuti panduannya di laman **Aplikasi Kolaboratif** IPB.",
      },
      {
        id: "ms-3",
        q: "Bagaimana cara mendapatkan aplikasi SAS, ArcGIS, dan SPSS di IPB?",
        a: "Disarankan menghubungi **Pascasarjana atau departemen** anda langsung.",
      },
      {
        id: "ms-4",
        q: "Bagaimana Login OneDrive dengan Email IPB?",
        a: "Bisa langsung melalui laman **office.com** atau **apps.ipb.ac.id/ms365**.",
        links: [
          { label: "office.com", url: "https://office.com" },
          { label: "apps.ipb.ac.id/ms365", url: "https://apps.ipb.ac.id/ms365" },
        ],
      },
    ],
  },
  {
    id: "zoom-gdrive",
    icon: "☁️",
    label: "Zoom, GDrive & Storage",
    questions: [
      {
        id: "zoom-1",
        q: "Permohonan penambahan kapasitas / aktivasi lisensi Zoom?",
        a: "Melampirkan **surat permohonan** yang ditujukan kepada Lembaga Manajemen Informasi dan Transformasi Digital, untuk selanjutnya akan di proses.",
      },
      {
        id: "zoom-2",
        q: "Bagaimana jika akun Zoom masih basic / belum premium?",
        a: "Harus mengaktivasi ulang dan untuk aktivasinya dikirim melalui **Helpcenter IPB**.",
      },
      {
        id: "zoom-3",
        q: "Permohonan penambahan kapasitas Google Drive untuk unit?",
        a: "Terlebih dahulu menyertakan **surat permohonan** yang ditujukan kepada Kepala Lembaga Manajemen dan Transformasi Digital. Jika disetujui akan di proses, jika tidak akan dikonfirmasikan kembali.",
      },
      {
        id: "zoom-4",
        q: "Bagaimana Login OneDrive dengan Email IPB?",
        a: "Bisa langsung melalui laman **office.com** atau **apps.ipb.ac.id/ms365**.",
        links: [
          { label: "office.com", url: "https://office.com" },
          { label: "apps.ipb.ac.id/ms365", url: "https://apps.ipb.ac.id/ms365" },
        ],
      },
    ],
  },
  {
    id: "sistem-informasi",
    icon: "📱",
    label: "Sistem Informasi",
    questions: [
      {
        id: "si-1",
        q: "Jika ada data saya yang salah di sistem informasi/IPB Mobile?",
        a: "Anda dapat melakukan permintaan perubahan data dengan menunjukkan dokumen resmi ke unit pengampu Anda:\n• Dosen/Tendik → bagian kepegawaian departemen/unit\n• Mahasiswa Vokasi → Sekolah Vokasi\n• Mahasiswa Sarjana → departemen atau Direktorat Administrasi Pendidikan\n• Mahasiswa Profesi Dokter Hewan → Fakultas Kedokteran Hewan\n• Mahasiswa Magister/Doktor → Program Studi atau Sekolah Pascasarjana",
      },
      {
        id: "si-2",
        q: "Permohonan Pembuatan Akun Apps Orang Tua?",
        a: "Silakan ikuti panduan di laman IPB Mobile for Parents:",
        links: [{ label: "Panduan IPB Mobile for Parents", url: "https://ict.ipb.ac.id/panduan-permintaan-akun-ipb-mobile-for-parents/" }],
      },
      {
        id: "si-3",
        q: "Bagaimana jika tidak bisa sign in ke IPB DigiSign?",
        a: "Silakan ikuti panduan di laman IPB DigiSign:",
        links: [{ label: "Panduan IPB DigiSign", url: "https://ict.ipb.ac.id/ipb-digisign/" }],
      },
      {
        id: "si-4",
        q: "Bagaimana jika tidak bisa finger print?",
        a: "Kami sarankan menghubungi **Direktorat Sumber Daya Manusia** dengan Pak Bagas.",
      },
    ],
  },
];
