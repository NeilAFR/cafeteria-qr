import { useState } from "react";
import { MdClose, MdAdd, MdRemove } from "react-icons/md";

function ModalProducto({ producto, cerrarModal, confirmarAgregado }) {
  // 1. MEMORIA DEL MODAL
  const [cantidad, setCantidad] = useState(1);
  const [extrasSeleccionados, setExtrasSeleccionados] = useState([]);
  const [notas, setNotas] = useState("");

  // 2. LÓGICA DE EXTRAS
  const toggleExtra = (extra) => {
    setExtrasSeleccionados((prev) => {
      // Si ya estaba seleccionado, lo quitamos. Si no, lo agregamos.
      const yaExiste = prev.find((e) => e.id_extra === extra.id_extra);
      if (yaExiste) {
        return prev.filter((e) => e.id_extra !== extra.id_extra);
      } else {
        return [...prev, extra];
      }
    });
  };

  // 3. CÁLCULO DEL PRECIO EN TIEMPO REAL
  const costoExtras = extrasSeleccionados.reduce((suma, extra) => suma + extra.precio, 0);
  const precioUnitario = producto.precio + costoExtras;
  const precioTotal = precioUnitario * cantidad;

  // 4. FUNCIÓN PARA ENVIAR AL CARRITO
  const manejarAgregar = () => {
    // Creamos un ID único para el carrito. 
    // Si pide dos waffles pero uno con Nutella y otro sin, deben ser filas distintas.
    const idsExtras = extrasSeleccionados.map(e => e.id_extra).sort().join('-');
    const idCarritoUnico = `${producto.id}-${idsExtras}-${notas}`;

    const productoPersonalizado = {
      ...producto,
      idCarrito: idCarritoUnico,
      precioOriginal: producto.precio, // Guardamos el precio base
      precio: precioUnitario, // El nuevo precio con extras
      extras: extrasSeleccionados,
      notas: notas,
      cantidad: cantidad
    };

    confirmarAgregado(productoPersonalizado);
  };

  return (
    // Fondo oscuro borroso (El Overlay)
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center transition-opacity">
      
      {/* Contenedor principal del Modal */}
      <div className="relative flex w-full max-w-md flex-col bg-[#FFFBF2] rounded-t-3xl sm:rounded-3xl h-[85vh] overflow-hidden shadow-2xl animate-[slideUp_0.3s_ease-out]">
        
        {/* Sticky Header */}
        <div className="flex items-center bg-[#FFFBF2] p-4 pb-2 justify-between z-10 shadow-sm border-b border-[#E95D34]/10">
          <button onClick={cerrarModal} className="text-gray-800 flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-200 transition-colors">
            <MdClose className="text-2xl" />
          </button>
          <h2 className="text-gray-800 text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">
            Personalizar
          </h2>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pb-32">
          
          {/* Imagen */}
          <div className="p-4">
            <div 
              className="w-full bg-gray-200 bg-center bg-no-repeat bg-cover aspect-video rounded-xl shadow-sm" 
              style={{ backgroundImage: `url(${producto.imagen_url})` }}
            ></div>
          </div>

          {/* Detalles del Producto */}
          <div className="px-5">
            <div className="flex justify-between items-start">
              <h2 className="text-gray-900 tracking-tight text-3xl font-['Fredoka'] font-bold leading-tight mb-2 pr-2">
                {producto.nombre}
              </h2>
              <span className="bg-[#E95D34]/10 text-[#E95D34] text-sm font-bold px-3 py-1 rounded-full mt-1 whitespace-nowrap">
                S/ {producto.precio.toFixed(2)}
              </span>
            </div>
            <p className="text-gray-600 text-sm font-medium leading-relaxed mb-6">
              {producto.descripcion}
            </p>

            <div className="border-t border-gray-200 my-4"></div>

            {/* --- EXTRAS DINÁMICOS --- */}
            <h3 className="text-gray-900 text-lg font-['Fredoka'] font-bold leading-tight mb-4">
              Elige tus extras
            </h3>
            
            <div className="space-y-3">
              {producto.extras_disponibles.map((extra) => {
                const estaSeleccionado = extrasSeleccionados.some(e => e.id_extra === extra.id_extra);
                
                return (
                  <label 
                    key={extra.id_extra} 
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer shadow-sm ${estaSeleccionado ? 'border-[#E95D34] bg-[#E95D34]/5' : 'border-gray-200 bg-white'}`}
                  >
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox"
                        checked={estaSeleccionado}
                        onChange={() => toggleExtra(extra)}
                        className="size-5 rounded border-gray-300 text-[#E95D34] focus:ring-[#E95D34] bg-gray-50"
                      />
                      <span className="text-gray-900 font-semibold text-sm">
                        {extra.nombre}
                      </span>
                    </div>
                    <span className="text-[#E95D34] font-bold text-sm">
                      + S/ {extra.precio.toFixed(2)}
                    </span>
                  </label>
                );
              })}
            </div>

            <div className="border-t border-gray-200 my-6"></div>

            {/* --- NOTAS ESPECIALES --- */}
            <h3 className="text-gray-900 text-lg font-['Fredoka'] font-bold leading-tight mb-3">
              Notas especiales
            </h3>
            <textarea 
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white text-gray-900 p-4 text-sm focus:border-[#E95D34] focus:ring-1 focus:ring-[#E95D34] focus:outline-none resize-none" 
              placeholder="¿Algo que debamos saber? Ej. Sin azúcar glass..." 
              rows="3"
            ></textarea>
            <div className="h-6"></div>
          </div>
        </div>

        {/* --- BOTTOM ACTION BAR FIJA --- */}
        <div className="absolute bottom-0 w-full bg-white border-t border-gray-200 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-2xl z-20 pb-8 sm:pb-4">
          <div className="flex items-center gap-4">
            
            {/* Controles de Cantidad */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1 shrink-0 h-12">
              <button 
                onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                className="size-10 flex items-center justify-center text-gray-600 hover:text-[#E95D34] active:bg-gray-200 rounded-md transition-colors"
              >
                <MdRemove className="text-xl" />
              </button>
              <span className="w-8 text-center font-bold text-lg text-gray-900">
                {cantidad}
              </span>
              <button 
                onClick={() => setCantidad(cantidad + 1)}
                className="size-10 flex items-center justify-center text-gray-900 hover:text-[#E95D34] active:bg-gray-200 rounded-md transition-colors"
              >
                <MdAdd className="text-xl" />
              </button>
            </div>

            {/* Botón Agregar */}
            <button 
              onClick={manejarAgregar}
              className="flex-1 bg-[#E95D34] text-white font-bold text-lg h-12 px-6 rounded-xl shadow-lg shadow-orange-500/30 active:scale-[0.98] transition-all flex items-center justify-between"
            >
              <span>Agregar</span>
              <span className="bg-white/20 text-white text-sm font-bold px-2 py-1 rounded-md">
                S/ {precioTotal.toFixed(2)}
              </span>
            </button>
            
          </div>
        </div>

      </div>
    </div>
  );
}

export default ModalProducto;