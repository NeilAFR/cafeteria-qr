import { FaArrowRight, FaFacebook, FaInstagram } from "react-icons/fa";
import { MdOutlineLightMode, MdBrightnessMedium, MdRestaurantMenu } from "react-icons/md"; // Importamos los íconos del sol/luna
import { useEffect } from 'react';

function Bienvenida({ alHacerClic, modoOscuro, toggleModoOscuro }) { // Recibimos las props del modo oscuro

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  const numeroMesa = 12;

  return (
    // Agregamos la transición de color y el fondo oscuro
    <div className="relative min-h-screen bg-[#E85D36] dark:bg-background-dark flex flex-col items-center justify-between p-6 font-['Nunito'] text-[#FEF7E6] dark:text-text-cream antialiased transition-colors duration-300">

      {/* --- BOTÓN FLOTANTE MODO OSCURO --- */}
      <button
        onClick={toggleModoOscuro}
        className="absolute top-6 right-6 p-2 rounded-full bg-white/20 dark:bg-surface-dark shadow-sm dark:shadow-dark-elevated text-white dark:text-primary hover:bg-white/30 dark:hover:bg-white/5 transition-colors z-50"
      >
        {modoOscuro ? <MdOutlineLightMode className="text-xl" /> : <MdBrightnessMedium className="text-xl" />}
      </button>

      {/* --- SECCIÓN SUPERIOR: Logo y Título --- */}
      <div className="w-full flex flex-col items-center mt-10">
        <img
          src="/Logo.jpg"
          alt="Logo Cafetería Cusco"
          className="w-40 h-40 mb-6 rounded-3xl object-cover shadow-lg border-4 border-white/20 dark:border-white/5"
        />
        <h1 className="font-['Fredoka'] text-5xl font-bold text-center leading-tight drop-shadow-md text-white dark:text-text-cream">
          4 Gatos
          <span className="block text-lg font-normal tracking-[0.2em] mt-2 uppercase opacity-90 font-['Nunito'] dark:text-text-muted">
            Café Lúdico
          </span>
        </h1>
      </div>

      {/* --- SECCIÓN CENTRAL: Tarjeta de Mesa y Botón --- */}
      <div className="w-full flex flex-col items-center space-y-8 mb-12 w-full max-w-xs">

        {/* TARJETA DE LA MESA */}
        <div className="bg-white/10 dark:bg-surface-dark backdrop-blur-md border border-white/20 dark:border-white/5 rounded-3xl p-8 w-full text-center shadow-lg dark:shadow-dark-elevated transition-transform hover:scale-105 duration-300">
          <span className="text-white/80 dark:text-text-muted text-sm font-semibold uppercase tracking-wider mb-2 block">
            Estás en la
          </span>
          <div className="flex items-center justify-center">
            <span className="text-4xl font-['Fredoka'] font-bold text-white dark:text-text-cream drop-shadow-sm flex items-center gap-2">
              <MdRestaurantMenu className="text-[#E85D36] dark:text-primary hidden dark:block" /> {/* Ícono extra opcional para dark mode */}
              Mesa {numeroMesa}
            </span>
          </div>
          {/* Línea divisoria naranja en dark mode, blanca en light mode */}
          <div className="mt-6 h-1 w-16 bg-[#FEF7E6]/30 dark:bg-primary rounded-full mx-auto"></div>
        </div>

        {/* BOTÓN VER CARTA */}
        <button onClick={alHacerClic} className="group w-full focus:outline-none">
          <div className="relative w-full bg-[#FEF7E6] dark:bg-primary text-[#E85D36] dark:text-white rounded-2xl p-5 shadow-xl transition-all duration-300 transform group-hover:-translate-y-1 group-active:scale-95 flex items-center justify-between border border-transparent dark:border-white/10">
            <span className="text-2xl font-['Fredoka'] font-bold">Ver Carta</span>
            <div className="bg-[#E85D36]/10 dark:bg-white/20 rounded-full p-2 group-hover:bg-[#E85D36]/20 dark:group-hover:bg-white/30 transition-colors">
              <FaArrowRight className="text-xl" />
            </div>
          </div>
        </button>
      </div>

      {/* --- SECCIÓN INFERIOR: Footer y Redes --- */}
      <footer className="text-center text-white/70 dark:text-text-muted text-sm py-4 font-medium w-full flex flex-col items-center">
        <p className="mb-4">Perú - Cusco</p>
        <div className="flex space-x-6 text-2xl">
          <a href="#" className="hover:text-white dark:hover:text-primary hover:-translate-y-1 transition-all"><FaFacebook /></a>
          <a href="#" className="hover:text-white dark:hover:text-primary hover:-translate-y-1 transition-all"><FaInstagram /></a>
        </div>
      </footer>

    </div>
  );
}

export default Bienvenida;