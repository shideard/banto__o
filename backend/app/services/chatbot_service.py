# backend/app/services/chatbot_service.py
from typing import Optional
import re


class ChatbotService:
    """
    Chatbot berbasis FAQ untuk Layanan TIK IPB University.
    Mencocokkan pertanyaan user dengan FAQ dari dokumen resmi LMITD.
    """

    FAQ: list[dict] = [
        # ── Ubah / Reset Password ──────────────────────────────────────────────
        {
            "keywords": ["ganti password", "ubah password", "change password", "mengganti password"],
            "answer": (
                "Untuk mengganti password, kunjungi *https://apps.ipb.ac.id* "
                "lalu pilih menu **Change Password**."
            ),
        },
        {
            "keywords": ["lupa password", "reset password", "tidak ingat password"],
            "answer": (
                "Kunjungi *https://apps.ipb.ac.id* lalu pilih menu **Reset Password**. "
                "Anda akan diarahkan untuk mereset password melalui email alternatif yang sudah terdaftar."
            ),
        },
        {
            "keywords": ["lupa password", "belum ada email alternatif", "lupa email alternatif"],
            "answer": (
                "Pilih menu Reset Password, masukkan identitas yang masih Anda ingat "
                "(username/NRP/NIP), lalu isi data yang diperlukan. "
                "Jangan lupa **swafoto dengan menyertakan kartu identitas**. "
                "Tunggu email dari admin untuk proses verifikasi."
            ),
        },
        {
            "keywords": ["berapa lama verifikasi", "lama verifikasi email", "tidak ada email balasan"],
            "answer": (
                "Estimasi proses verifikasi email alternatif **maksimal 3 x 24 jam**. "
                "Silakan cek email alternatif secara berkala, termasuk folder spam."
            ),
        },
        {
            "keywords": ["setelah reset password", "sesudah ganti password", "setting ulang", "forget wifi"],
            "answer": (
                "Setelah reset password berhasil, lakukan **setting ulang device** Anda "
                "(handphone/laptop) dengan cara *forget wifi* IPB-ACCESS "
                "lalu setting kembali wifi IPB-ACCESS."
            ),
        },
        {
            "keywords": ["setting ipb access", "connect ipb access", "cara setting wifi ipb"],
            "answer": (
                "Kunjungi panduan di *https://ipb.link/connect-ipb-access*. "
                "Atau datang langsung ke **Helpdesk di Gedung Perpustakaan B Lantai 1**."
            ),
        },
        {
            "keywords": ["akun unit kerja", "email unit", "email jurnal", "email organisasi"],
            "answer": (
                "Ya, akun unit kerja (email unit, jurnal, organisasi, event) "
                "**juga memerlukan email alternatif** selain email IPB untuk proses reset password."
            ),
        },
        {
            "keywords": ["daftar email alternatif unit", "mendaftarkan email alternatif unit kerja"],
            "answer": (
                "Isi GForm berikut: *https://ipb.link/konfirmasi-emailalternatif* "
                "untuk mendaftarkan email alternatif akun unit kerja."
            ),
        },
        {
            "keywords": ["email alternatif sudah terdaftar", "cek email alternatif terdaftar"],
            "answer": (
                "Cek email alternatif Anda **maksimal 2 x 24 jam** setelah input data di GForm. "
                "Setelah itu, kunjungi kembali *https://apps.ipb.ac.id* "
                "dan lanjutkan reset password di menu **Reset Password**."
            ),
        },

        # ── Akun IPB ───────────────────────────────────────────────────────────
        {
            "keywords": ["masa berlaku akun", "kapan akun kadaluarsa", "akun berlaku sampai kapan"],
            "answer": (
                "Untuk mahasiswa, masa berlaku ID IPB adalah **satu tahun sejak tanggal lulus**. "
                "Segera backup data Anda (email, Google Calendar, Google Drive) ke tempat lain. "
                "Setelah satu tahun, data akan **dihapus secara permanen**."
            ),
        },
        {
            "keywords": ["lupa username", "lupa username dan password", "tidak ingat username"],
            "answer": (
                "Kunjungi *apps.ipb.ac.id*, pilih **Reset Password**. "
                "Pilih jenis identitas yang masih Anda ingat (Username, NIM, atau NIP), "
                "isi kotak isian, klik **Kirim**. "
                "Sistem akan mengirimkan verifikasi ke email alternatif Anda."
            ),
        },
        {
            "keywords": ["belum punya akun ipb", "buat akun baru ipb", "pembuatan akun ipb"],
            "answer": (
                "Lampirkan **surat permohonan** kepada Kepala LMITD, cantumkan: "
                "Nama Lengkap, NIP/NIK, Email Alternatif, dan No Kontak."
            ),
        },
        {
            "keywords": ["akun guest", "buat akun tamu", "akun untuk tamu"],
            "answer": (
                "Kirimkan **surat permohonan** kepada Kepala LMITD, cantumkan "
                "jumlah tamu dan durasi penggunaan akun yang diinginkan."
            ),
        },

        # ── Email & GApps ──────────────────────────────────────────────────────
        {
            "keywords": ["buat email ipb", "pembuatan email ipb", "email ipb baru", "permohonan email"],
            "answer": (
                "Kirimkan **surat permohonan** kepada Kepala LMITD, cantumkan: "
                "Nama Lengkap, NIP/NIK, Email Alternatif, dan No Kontak."
            ),
        },
        {
            "keywords": ["email invalid", "email apps invalid", "email tidak bisa diakses"],
            "answer": (
                "Biasanya terjadi karena **akun email belum diaktifkan**. "
                "Kirimkan tiket kendala melalui **Helpcenter IPB** "
                "dan tunggu respons penanganan selanjutnya."
            ),
        },
        {
            "keywords": ["aktifkan email ipb", "email ipb diaktifkan kembali", "reaktivasi email"],
            "answer": (
                "Kirimkan **tiket resmi** melalui Helpcenter IPB "
                "dan tunggu respons penyelesaian dari tim teknis."
            ),
        },
        {
            "keywords": ["g-apps suspend", "google apps suspend", "akun google suspend", "gapps suspend"],
            "answer": (
                "Akun Anda di-suspend langsung oleh **pihak Google** karena terdeteksi melanggar peraturan. "
                "Akun akan dinonaktifkan sampai batas waktu yang tidak dapat ditentukan. "
                "Pengaktifan kembali bergantung pada **kebijakan IPB** dengan syarat tidak melanggar peraturan."
            ),
        },

        # ── Konektivitas Internet ──────────────────────────────────────────────
        {
            "keywords": ["ipb access", "eduroam", "connect wifi ipb", "terhubung wifi ipb", "koneksi internet ipb"],
            "answer": (
                "Akses panduan lengkapnya di: *https://ict.ipb.ac.id/konektivitas-internet-ipb/*\n"
                "Jika masih terkendala, datang langsung ke **Kantor LMITD Lantai 1 "
                "Gedung B Perpustakaan**, Senin–Jumat pukul 08.00–16.00 WIB."
            ),
        },
        {
            "keywords": ["vpn ipb", "akses vpn", "permohonan vpn"],
            "answer": (
                "Sertakan **surat permohonan resmi** kepada Kepala LMITD "
                "untuk diproses secara berkala."
            ),
        },

        # ── Windows & Microsoft Office ─────────────────────────────────────────
        {
            "keywords": ["install windows", "install office", "instalasi windows", "instalasi office"],
            "answer": (
                "Datang langsung ke **Kantor LMITD Lantai 1 Gedung B Perpustakaan** "
                "pada hari kerja (Senin–Jumat, 08.00–16.00 WIB) "
                "untuk dibantu instalasi oleh petugas."
            ),
        },
        {
            "keywords": ["office 365", "tidak bisa office 365", "akses office 365"],
            "answer": (
                "Ikuti panduan lengkap di menu **Aplikasi Kolaboratif** "
                "yang tersedia di platform layanan TIK IPB."
            ),
        },
        {
            "keywords": ["sas ipb", "arcgis ipb", "spss ipb", "software lisensi"],
            "answer": (
                "Hubungi langsung **Sekolah Pascasarjana atau departemen terkait** "
                "yang mengelola lisensi software tersebut."
            ),
        },
        {
            "keywords": ["login onedrive", "onedrive email ipb", "ms365", "microsoft 365"],
            "answer": (
                "Login secara mandiri melalui *https://office.com* "
                "atau *https://apps.ipb.ac.id/ms365*."
            ),
        },

        # ── Zoom, GDrive & Storage ─────────────────────────────────────────────
        {
            "keywords": ["zoom lisensi", "aktivasi zoom", "lisensi zoom", "kapasitas zoom"],
            "answer": (
                "Lampirkan **surat permohonan resmi** kepada LMITD "
                "untuk diverifikasi dan diproses."
            ),
        },
        {
            "keywords": ["zoom basic", "zoom belum premium", "upgrade zoom"],
            "answer": (
                "Lakukan **aktivasi ulang** dengan mengirimkan permintaan resmi "
                "melalui **sistem tiket di Helpcenter IPB**."
            ),
        },
        {
            "keywords": ["tambah storage", "google drive penuh", "kapasitas google drive", "tambah kapasitas gdrive"],
            "answer": (
                "Kirimkan **surat permohonan resmi** kepada Kepala LMITD. "
                "Jika disetujui, kuota akan diproses. "
                "Jika tidak, akan dikonfirmasikan kembali ke unit terkait."
            ),
        },

        # ── Sistem Informasi ───────────────────────────────────────────────────
        {
            "keywords": ["data salah di sistem", "data salah ipb mobile", "ubah data di sistem informasi"],
            "answer": (
                "Lakukan permintaan perubahan data resmi dengan menunjukkan dokumen sah ke unit pengampu:\n"
                "• Dosen/Tendik → Bagian kepegawaian departemen/unit kerja\n"
                "• Mahasiswa Vokasi → Sekolah Vokasi\n"
                "• Mahasiswa Sarjana → Departemen atau Direktorat Administrasi Pendidikan\n"
                "• Mahasiswa Profesi Dokter Hewan → Fakultas Kedokteran Hewan\n"
                "• Mahasiswa Magister/Doktor → Program Studi atau Sekolah Pascasarjana"
            ),
        },
        {
            "keywords": ["akun orang tua", "ipb mobile parents", "akun parents"],
            "answer": (
                "Ikuti tata cara lengkapnya di: "
                "*https://ict.ipb.ac.id/panduan-permintaan-akun-ipb-mobile-for-parents/*"
            ),
        },
        {
            "keywords": ["digisign", "ipb digisign", "tidak bisa sign in digisign"],
            "answer": (
                "Ikuti petunjuk teknis di laman resmi **Panduan IPB DigiSign**: "
                "*https://ict.ipb.ac.id/ipb-digisign/*"
            ),
        },
        {
            "keywords": ["finger print", "fingerprint gagal", "absensi fingerprint"],
            "answer": (
                "Segera hubungi **Direktorat Sumber Daya Manusia (SDM) IPB**, "
                "khususnya berkoordinasi dengan Pak Bagas."
            ),
        },
    ]

    FALLBACK = (
        "Maaf, aku belum menemukan jawaban yang sesuai untuk pertanyaan tersebut. 😔\n\n"
        "Kamu bisa:\n"
        "• Coba ketik ulang dengan kata kunci yang berbeda\n"
        "• Buat **tiket bantuan** agar staf kami bisa menanganinya langsung\n"
        "• Datang ke **Kantor LMITD Lantai 1 Gedung B Perpustakaan** "
        "(Senin–Jumat, 08.00–16.00 WIB)"
    )

    def proses_input(self, tanya: str) -> str:
        """Proses pertanyaan dan kembalikan respons berdasarkan FAQ."""
        lower = tanya.lower()
        lower = re.sub(r"[^\w\s]", " ", lower)

        best_match = None
        best_score = 0

        for faq in self.FAQ:
            score = sum(
                1 for kw in faq["keywords"]
                if kw in lower
            )
            if score > best_score:
                best_score = score
                best_match = faq

        if best_match and best_score > 0:
            return best_match["answer"]

        rekomendasi = self.rekomendasi_kategori(tanya)
        if rekomendasi:
            return (
                f"Pertanyaan Anda tampaknya berkaitan dengan kategori **'{rekomendasi}'**. "
                "Silakan buat tiket dengan kategori tersebut agar staf kami bisa membantu."
            )

        return self.FALLBACK

    def rekomendasi_kategori(self, deskripsi: str) -> Optional[str]:
        """Rekomendasikan kategori tiket berdasarkan kata kunci."""
        KEYWORD_KATEGORI = {
            "legalisir":  "Legalisasi Dokumen",
            "ijazah":     "Legalisasi Dokumen",
            "transkrip":  "Legalisasi Dokumen",
            "krs":        "Akademik",
            "wisuda":     "Akademik",
            "beasiswa":   "Keuangan & Beasiswa",
            "pembayaran": "Keuangan & Beasiswa",
            "ukt":        "Keuangan & Beasiswa",
            "surat":      "Administrasi Umum",
        }
        lower = deskripsi.lower()
        for keyword, kategori in KEYWORD_KATEGORI.items():
            if keyword in lower:
                return kategori
        return None