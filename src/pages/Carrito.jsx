import { MdArrowBackIosNew, MdInfo, MdRestaurantMenu, MdDeleteOutline, MdEditNote, MdCheckCircle } from "react-icons/md";

function Carrito({ irAlMenu, carrito, productosDB, agregarAlCarrito, disminuirCantidad, eliminarDelCarrito }) {
  
  // 1. CALCULAMOS TOTALES
  const subtotal = carrito.reduce((suma, item) => suma + (item.precio * item.cantidad), 0);
  const total = subtotal; 

  // ======================================================================
  // 2. EL ALGORITMO DE RECOMENDACIONES (CROSS-SELLING)
  // ======================================================================
  
  // A. ¿Qué tenemos en el carrito actualmente? Sacamos las macro-categorías únicas
  const categoriasEnCarrito = [...new Set(carrito.map(item => item.macro_categoria))];
  const idsEnCarrito = carrito.map(item => item.id); // Para no recomendar algo que ya compraron

  const tieneBebida = categoriasEnCarrito.includes("Bebida");
  const tieneComida = categoriasEnCarrito.includes("Comida");

  // B. Decidimos qué recomendar basándonos en la lógica
  let macroObjetivo = "Postre"; // Por defecto, si tiene comida y bebida, le sugerimos un postre

  if (tieneBebida && !tieneComida) {
    macroObjetivo = "Comida"; // Solo pidió bebida -> Sugerir comida
  } else if (tieneComida && !tieneBebida) {
    macroObjetivo = "Bebida"; // Solo pidió comida -> Sugerir bebida
  }

  // C. Filtramos la base de datos para obtener los productos recomendados
  const recomendaciones = productosDB.filter(producto => 
    producto.macro_categoria === macroObjetivo && // Que sea de la categoría objetivo
    producto.disponible === true &&              // Que no esté agotado
    !idsEnCarrito.includes(producto.id)          // Que no lo haya pedido ya
  ).slice(0, 4); // Tomamos máximo 4 recomendaciones para no saturar la pantalla

  // ======================================================================

  return (
    <div className="bg-[#FFF8F0] text-[#4A403A] font-['Nunito'] antialiased min-h-screen flex flex-col">
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-[#FFF8F0]/90 backdrop-blur-md border-b border-[#E65E3A]/10 px-4 pt-8 pb-4 shadow-sm">
        <div className="flex items-center justify-between">
          <button onClick={irAlMenu} className="p-2 -ml-2 rounded-full hover:bg-[#E65E3A]/10 transition-colors">
            <MdArrowBackIosNew className="text-[#E65E3A] text-2xl" />
          </button>
          <div className="flex flex-col items-center">
            <h1 className="font-['Fredoka'] text-xl font-bold text-gray-800 tracking-wide">Mi Pedido</h1>
            <span className="text-xs font-bold text-[#E65E3A] bg-[#E65E3A]/10 px-3 py-1 rounded-full mt-1">Mesa 12</span>
          </div>
          <div className="w-10"></div> 
        </div>
      </header>

      <main className="flex-1 px-4 py-6 space-y-6 overflow-y-auto pb-48">
        
        {/* MENSAJE INFORMATIVO */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
          <MdInfo className="text-blue-500 text-xl mt-0.5" />
          <div>
            <p className="text-sm text-blue-800 font-semibold">¿Todo listo con tu pedido?</p>
            <p className="text-xs text-blue-600 mt-1">Revisa tus productos antes de enviarlos. La cocina empezará a prepararlos inmediatamente.</p>
          </div>
        </div>

        {/* LISTA DE PRODUCTOS DEL CARRITO */}
        <div className="space-y-4">
          <h2 className="font-['Fredoka'] text-lg font-bold text-gray-800 flex items-center gap-2">
            <MdRestaurantMenu className="text-[#E65E3A] text-xl" />
            Ítems seleccionados
          </h2>

          {carrito.length === 0 ? (
            <p className="text-center text-gray-500 py-10">Tu carrito está vacío. ¡Anímate a pedir algo delicioso!</p>
          ) : (
            carrito.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm flex gap-4 items-center border border-gray-100">
                <div className="w-20 h-20 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden">
                  <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-['Fredoka'] font-bold text-gray-800 truncate pr-2">{item.nombre}</h3>
                    <p className="font-bold text-[#E65E3A]">S/ {(item.precio * item.cantidad).toFixed(2)}</p>
                  </div>
                  <p className="text-xs text-gray-500 mb-3 truncate">{item.descripcion}</p>
                  
                  <div className="flex items-center gap-3">
                    {/* CONTROLES DE CANTIDAD */}
                    <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-100">
                      
                      {/* Botón de Menos (-) */}
                      <button 
                        onClick={() => disminuirCantidad(item.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-md bg-white shadow-sm text-gray-600 hover:text-[#E65E3A] active:scale-95 transition-all text-lg font-bold">
                        -
                      </button>
                      
                      <span className="w-8 text-center font-bold text-sm text-gray-800">
                        {item.cantidad}
                      </span>
                      
                      {/* Botón de Más (+) */}
                      <button 
                        onClick={() => agregarAlCarrito(item)}
                        className="w-7 h-7 flex items-center justify-center rounded-md bg-[#E65E3A] text-white shadow-sm shadow-orange-500/30 active:scale-95 transition-all text-lg font-bold">
                        +
                      </button>

                    </div>
                    
                    {/* BOTÓN REMOVER TODO */}
                    <button 
                      onClick={() => eliminarDelCarrito(item.id)}
                      className="text-xs text-red-400 hover:text-red-500 font-semibold ml-auto flex items-center gap-1">
                      <MdDeleteOutline className="text-sm" /> Remover
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* --- SECCIÓN DE RECOMENDACIONES DINÁMICAS --- */}
        {/* Solo la mostramos si hay recomendaciones disponibles */}
        {recomendaciones.length > 0 && (
          <div className="mt-8 mb-6">
            <h3 className="font-['Fredoka'] text-md font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-yellow-500 text-xl">⭐</span>
              ¿Qué tal si lo acompañas con?
            </h3>
            
            <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4" style={{ scrollbarWidth: 'none' }}>
              {recomendaciones.map((prod) => (
                <div key={prod.id} className="min-w-[140px] max-w-[140px] bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex flex-col items-center text-center transition-transform active:scale-95">
                  <img src={prod.imagen} alt={prod.nombre} className="w-16 h-16 rounded-full object-cover mb-2 shadow-sm" />
                  
                  {/* SOLUCIÓN DE TEXTO: h-10 fija la altura y line-clamp-2 recorta el texto largo inteligentemente */}
                  <div className="h-10 w-full flex items-center justify-center">
                    <h4 className="font-bold text-sm text-gray-700 line-clamp-2 leading-tight">
                      {prod.nombre}
                    </h4>
                  </div>
                  
                  <span className="text-xs text-[#E65E3A] font-bold mt-1">S/ {prod.precio.toFixed(2)}</span>
                  
                  <button 
                    onClick={() => agregarAlCarrito(prod)}
                    className="mt-2 w-full py-1.5 bg-gray-50 text-xs font-bold rounded-lg hover:bg-[#E65E3A] hover:text-white transition-colors">
                    Agregar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OBSERVACIONES */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <h3 className="font-['Fredoka'] text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
            <MdEditNote className="text-gray-400 text-xl" />
            Observaciones y Alergias
          </h3>
          <p className="text-xs text-gray-500 mb-2">Queremos que disfrutes sin preocupaciones. Cuéntanos si eres alérgico a algún ingrediente o si deseas retirar algo (ej. sin cebolla).</p>
          <textarea 
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-700 focus:outline-none focus:border-[#E65E3A]" 
            placeholder="Escribe tus indicaciones aquí..." 
            rows="3"
          ></textarea>
        </div>
      </main>

      {/* FOOTER TOTALES */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)] z-50 rounded-t-3xl">
        <div className="p-5 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Subtotal</span>
              <span>S/ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-xl font-bold text-gray-900 pt-2 border-t border-gray-100">
              <span className="font-['Fredoka']">Total a pagar</span>
              <span className="text-[#E65E3A]">S/ {total.toFixed(2)}</span>
            </div>
          </div>
          
          <button 
            disabled={carrito.length === 0}
            className={`w-full font-bold text-lg py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all ${carrito.length === 0 ? 'bg-gray-300 text-gray-500' : 'bg-[#E65E3A] hover:bg-orange-600 text-white shadow-orange-500/30 active:scale-[0.98]'}`}
          >
            <MdCheckCircle /> Confirmar Pedido a Cocina
          </button>
          
          <button onClick={irAlMenu} className="w-full text-[#E65E3A] font-bold text-sm py-1 hover:underline">
            ← Volver y agregar más ítems
          </button>
        </div>
      </div>

    </div>
  );
}

export default Carrito;