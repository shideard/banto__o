from typing import Optional


class ChatbotService:
    """
    Stub implementasi Chatbot sesuai class diagram.
    Real implementation butuh integrasi LLM (OpenAI, Gemini, dsb.).
    """

    KEYWORD_KATEGORI: dict[str, str] = {
        "legalisir":   "Legalisasi Dokumen",
        "ijazah":      "Legalisasi Dokumen",
        "transkrip":   "Legalisasi Dokumen",
        "krs":         "Akademik",
        "wisuda":      "Akademik",
        "beasiswa":    "Keuangan & Beasiswa",
        "pembayaran":  "Keuangan & Beasiswa",
        "ukt":         "Keuangan & Beasiswa",
        "surat":       "Administrasi Umum",
    }

    def proses_input(self, tanya: str) -> str:
        """Proses pertanyaan dan kembalikan respons."""
        rekomendasi = self.rekomendasi_kategori(tanya)
        if rekomendasi:
            return (
                f"Pertanyaan Anda tampaknya berkaitan dengan kategori '{rekomendasi}'. "
                "Silakan buat tiket dengan kategori tersebut agar staf kami bisa membantu."
            )
        return (
            "Mohon deskripsikan kendala Anda lebih detail agar kami bisa mengarahkan "
            "ke kategori yang tepat."
        )

    def rekomendasi_kategori(self, deskripsi: str) -> Optional[str]:
        """Rekomendasikan kategori tiket berdasarkan kata kunci deskripsi."""
        lower = deskripsi.lower()
        for keyword, kategori in self.KEYWORD_KATEGORI.items():
            if keyword in lower:
                return kategori
        return None