export default function App() {
  return (
    <>
      {/* HEADER */}
      <header className="bg-gradient-to-r from-blue-800 to-cyan-500 text-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          
          {/* LOGO */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white text-blue-800 font-bold flex items-center justify-center">
              IPB
            </div>
            <div>
              <h2 className="text-lg font-semibold leading-tight">IPB University</h2>
              <span className="text-xs opacity-80">Bogor Indonesia</span>
            </div>
          </div>

          {/* MENU */}
          <nav className="flex flex-wrap gap-2 text-sm">
            <a href="#" className="px-3 py-2 rounded hover:bg-white/20 bg-white/20">
              🏠 Beranda
            </a>
            <a href="#" className="px-3 py-2 rounded hover:bg-white/20">
              ➕ Buka Tiket Baru
            </a>
            <a href="#" className="px-3 py-2 rounded hover:bg-white/20">
              📄 Cek Status Tiket
            </a>
          </nav>

          {/* AUTH */}
          <div className="flex gap-2">
            <button className="px-3 py-2 rounded bg-slate-300 text-black text-sm">
              Pengguna Tamu
            </button>
            <button className="px-3 py-2 rounded bg-emerald-500 text-white text-sm">
              Masuk
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="bg-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-20 flex flex-wrap items-center justify-center gap-12">
          
          {/* CONTENT */}
          <section className="text-center max-w-md">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3059/3059518.png"
              alt="Help Center"
              className="w-32 md:w-40 mx-auto mb-5"
            />
            <h1 className="text-xl md:text-3xl font-semibold text-gray-700 mb-2">
              Selamat Datang di IPB Help Center
            </h1>
            <p className="text-gray-500 text-sm md:text-base">
              Silakan login dengan akun IPB Anda untuk membuat tiket baru.
            </p>
          </section>

          {/* SIDE BUTTONS */}
          <aside className="flex flex-col gap-4 w-full max-w-xs">
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded">
              Buka Tiket Baru
            </button>
            <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded">
              Cek Status Tiket
            </button>
          </aside>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="text-center text-xs bg-gray-200 py-4 mt-10">
        Copyright © 2026 IPB University - All rights reserved.
      </footer>
    </>
  );
}