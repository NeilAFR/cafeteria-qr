import { FaArrowRight, FaFacebook, FaInstagram } from "react-icons/fa";
import { useEffect } from 'react'; // <-- IMPORTAMOS useEffect

// 1. CAMBIO CLAVE: Cambiamos el nombre a Bienvenida y recibimos { alHacerClic }
function Bienvenida({ alHacerClic }) {
  useEffect(() => {
    // Usamos 'auto' en lugar de 'smooth' para que el salto sea instantáneo
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);
  const numeroMesa = 12;
  return (
    <div className="min-h-screen bg-[#E85D36] flex flex-col items-center justify-between p-6 font-['Nunito'] text-[#FEF7E6] antialiased">

      {/* --- SECCIÓN SUPERIOR: Logo y Título --- */}
      <div className="w-full flex flex-col items-center mt-10">
        <img
          src="/Logo.jpg"
          alt="Logo Cafetería Cusco"
          className="w-40 h-40 mb-6 rounded-3xl object-cover shadow-lg border-4 border-white/20"
        />
        <h1 className="font-['Fredoka'] text-5xl font-bold text-center leading-tight drop-shadow-md">
          4 Gatos
          <span className="block text-lg font-normal tracking-[0.2em] mt-2 uppercase opacity-90 font-['Nunito']">
            Café Lúdico
          </span>
        </h1>
      </div>

      {/* --- SECCIÓN CENTRAL: Tarjeta de Mesa y Botón --- */}
      <div className="w-full flex flex-col items-center space-y-8 mb-12">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 w-full max-w-xs text-center shadow-lg transition-transform hover:scale-105 duration-300">
          <span className="text-white/80 text-sm font-semibold uppercase tracking-wider mb-2 block">
            Estás en la
          </span>
          <div className="flex items-center justify-center">
            <span className="text-4xl font-['Fredoka'] font-bold text-white drop-shadow-sm">
              Mesa {numeroMesa}
            </span>
          </div>
          <div className="mt-4 h-1 w-16 bg-[#FEF7E6]/30 rounded-full mx-auto"></div>
        </div>

        {/* 2. AQUÍ EL BOTÓN EJECUTA LA FUNCIÓN RECIBIDA */}
        <button onClick={alHacerClic} className="group w-full max-w-xs focus:outline-none">
          <div className="relative w-full bg-[#FEF7E6] hover:bg-white text-[#E85D36] rounded-2xl p-5 shadow-xl transition-all duration-300 transform group-hover:-translate-y-1 group-active:scale-95 flex items-center justify-between">
            <span className="text-2xl font-['Fredoka'] font-bold">Ver Carta</span>
            <div className="bg-[#E85D36]/10 rounded-full p-2 group-hover:bg-[#E85D36]/20 transition-colors">
              <FaArrowRight className="text-xl" />
            </div>
          </div>
        </button>
      </div>

      {/* --- SECCIÓN INFERIOR: Footer y Redes --- */}
      <footer className="text-center text-white/70 text-sm py-4 font-medium w-full flex flex-col items-center">
        <p className="mb-4">Perú - Cusco</p>
        <div className="flex space-x-6 text-2xl">
          <a href="#" className="hover:text-white hover:-translate-y-1 transition-all"><FaFacebook /></a>
          <a href="#" className="hover:text-white hover:-translate-y-1 transition-all"><FaInstagram /></a>
        </div>
      </footer>

    </div>
  );
}

// 3. CAMBIO CLAVE: Exportamos con el nuevo nombre
export default Bienvenida;