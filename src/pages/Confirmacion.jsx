import { MdClose, MdRestaurant, MdVideogameAsset } from "react-icons/md";

function Confirmacion({ volverAlMenu }) {
  return (
    <div className="bg-[#FFF8F0] font-['Nunito'] antialiased text-gray-900 min-h-screen flex flex-col items-center justify-center sm:py-8">
      
      {/* Contenedor principal estilo móvil */}
      <div className="relative flex h-full min-h-screen w-full max-w-md flex-col overflow-hidden bg-[#FFF8F0] shadow-2xl sm:h-[844px] sm:min-h-0 sm:rounded-[2.5rem] sm:border-[8px] sm:border-gray-900">
        
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between bg-[#FFF8F0]/95 backdrop-blur-sm p-4">
          <button onClick={volverAlMenu} className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 transition-colors text-gray-900">
            <MdClose className="text-2xl" />
          </button>
          <h1 className="text-lg font-['Fredoka'] font-bold leading-tight tracking-tight text-gray-900">Confirmación</h1>
          <div className="size-10"></div> 
        </header>

        {/* Contenido Principal */}
        <main className="flex-1 overflow-y-auto px-6 py-4 scrollbar-hide">
          
          <div className="flex flex-col items-center gap-6 mt-4 mb-8">
            {/* Círculo con la foto del gatito */}
            <div className="relative flex items-center justify-center w-full max-w-[240px] aspect-square">
              <div className="absolute inset-0 rounded-full bg-[#E65E3A]/10 scale-90 animate-pulse"></div>
              <div className="absolute inset-0 rounded-full bg-[#E65E3A]/5 scale-110"></div>
              {/* Recuerda guardar una foto llamada gato_confirmacion.jpg en tu carpeta public/ */}
              <img src="/confirmacion.jpg" alt="Gato confirmación" className="w-full h-full object-cover rounded-full z-10 shadow-md" />
            </div>
            
            <div className="flex flex-col items-center text-center gap-2">
              <h2 className="text-3xl font-['Fredoka'] font-extrabold text-[#E65E3A] tracking-tight">¡Pedido Recibido!</h2>
              <p className="text-gray-600 text-base max-w-[280px]">
                Tu pedido para la <span className="font-bold text-gray-900">Mesa 12</span> ha sido enviado a la cocina.
              </p>
            </div>
          </div>

          {/* Tarjeta de Estado del Pedido */}
          <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center size-18 rounded-full bg-[#E65E3A]/10 text-[#E65E3A]">
                  <MdRestaurant className="text-xl" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Recuerda</p>
                  <p className="text-xs text-gray-500">Puedes agregar productos cuando quieras, solo vuelve a escanear el código QR de tu respectiva mesa.</p>
                </div>
              </div>
            </div>
            
            {/* Barra de progreso */}
            
          </div>

          {/* Tarjeta de Dato Curioso */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-orange-50 border border-[#E65E3A]/10">
            <MdVideogameAsset className="text-[#E65E3A] text-3xl shrink-0" />
            <div>
              <h3 className="text-sm font-['Fredoka'] font-bold text-gray-900 mb-1">¿Sabías qué?</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Mientras esperas, puedes pedir un juego de mesa rápido a nuestro Game Master. ¡Pregunta por "Bloodborne: El juego de Cartas"!
              </p>
            </div>
          </div>
        </main>

        {/* Zona del Botón Inferior */}
        <div className="p-6 bg-[#FFF8F0] border-t border-black/5">
          <div className="flex flex-col gap-3">
            <button 
              onClick={volverAlMenu} 
              className="w-full flex items-center justify-center h-14 rounded-full bg-[#E65E3A] hover:bg-orange-600 active:scale-[0.98] transition-all text-white font-bold text-lg shadow-lg shadow-orange-500/30"
            >
              Volver a la Carta
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Confirmacion;