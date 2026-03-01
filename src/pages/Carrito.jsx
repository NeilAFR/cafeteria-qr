import { useEffect } from 'react';
import { MdArrowBackIosNew, MdInfo, MdRestaurantMenu, MdDeleteOutline, MdEditNote, MdCheckCircle } from "react-icons/md";

function Carrito({ irAlMenu, carrito, productosDB, agregarAlCarrito, disminuirCantidad, aumentarCantidad, eliminarDelCarrito, irAConfirmacion, numeroMesa }) {

  const subtotal = carrito.reduce((suma, item) => suma + (item.precio * item.cantidad), 0);
  const total = subtotal;

  const categoriasEnCarrito = [...new Set(carrito.map(item => item.macro_categoria))];
  const idsBaseEnCarrito = carrito.map(item => item.id);

  const tieneBebidaCaliente = categoriasEnCarrito.includes("Bebidas calientes");
  const tieneBebidaFria = categoriasEnCarrito.includes("Bebidas frías");
  const tieneDulce = categoriasEnCarrito.includes("Dulces");
  const tieneSalado = categoriasEnCarrito.includes("Salados");

  let macroObjetivo = "Dulces";
  let categoriaObjetivo = null;

  if ((tieneBebidaCaliente || tieneBebidaFria) && tieneDulce) {
    macroObjetivo = "Dulces";
    categoriaObjetivo = "Postres";
  } else if (tieneBebidaFria && !tieneSalado && !tieneDulce) {
    macroObjetivo = "Salados";
  } else if (tieneBebidaCaliente && !tieneSalado && !tieneDulce) {
    macroObjetivo = "Dulces";
  } else if (tieneSalado && !tieneBebidaFria && !tieneBebidaCaliente && !tieneDulce) {
    macroObjetivo = "Bebidas frías";
  }

  const recomendaciones = productosDB.filter(producto => {
    if (idsBaseEnCarrito.includes(producto.id)) return false;
    if (producto.disponible !== true) return false;
    if (producto.macro_categoria !== macroObjetivo) return false;
    if (categoriaObjetivo !== null && producto.categoria !== categoriaObjetivo) return false;
    return true;
  }).slice(0, 4);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  return (
    <div className="bg-[#FFF8F0] dark:bg-background-dark text-[#4A403A] dark:text-text-cream font-['Nunito'] antialiased min-h-screen flex flex-col animate-[slideUp_0.4s_ease-out] transition-colors duration-300">

      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-[#FFF8F0]/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-[#E65E3A]/10 dark:border-white/5 px-4 pt-8 pb-4 shadow-sm transition-colors duration-300">
        <div className="flex items-center justify-between">
          <button onClick={irAlMenu} className="p-2 -ml-2 rounded-full hover:bg-[#E65E3A]/10 dark:hover:bg-white/10 transition-colors">
            <MdArrowBackIosNew className="text-[#E65E3A] dark:text-primary text-2xl" />
          </button>
          <div className="flex flex-col items-center">
            <h1 className="font-['Fredoka'] text-xl font-bold text-gray-800 dark:text-text-cream tracking-wide">Mi Pedido</h1>
            <span className="text-xs font-bold text-[#E65E3A] dark:text-primary bg-[#E65E3A]/10 dark:bg-primary/10 px-3 py-1 rounded-full mt-1">Mesa {numeroMesa}</span>
          </div>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 space-y-6 overflow-y-auto pb-48">

        {/* MENSAJE INFORMATIVO */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-xl p-4 flex items-start gap-3 transition-colors duration-300">
          <MdInfo className="text-blue-500 dark:text-blue-400 text-xl mt-0.5" />
          <div>
            <p className="text-sm text-blue-800 dark:text-blue-300 font-semibold">¿Todo listo con tu pedido?</p>
            <p className="text-xs text-blue-600 dark:text-blue-400/80 mt-1">Revisa tus productos antes de enviarlos. La cocina empezará a prepararlos inmediatamente.</p>
          </div>
        </div>

        {/* LISTA DE PRODUCTOS DEL CARRITO */}
        <div className="space-y-4">
          <h2 className="font-['Fredoka'] text-lg font-bold text-gray-800 dark:text-text-cream flex items-center gap-2">
            <MdRestaurantMenu className="text-[#E65E3A] dark:text-primary text-xl" />
            Ítems seleccionados
          </h2>

          {carrito.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-text-muted py-10">Tu carrito está vacío. ¡Anímate a pedir algo delicioso!</p>
          ) : (
            carrito.map((item) => (
              <div key={item.idCarrito} className="bg-white dark:bg-surface-dark rounded-2xl p-4 shadow-sm dark:shadow-dark-elevated flex gap-4 items-center border border-gray-100 dark:border-white/5 transition-colors">
                <div className="w-20 h-20 rounded-xl bg-gray-100 dark:bg-black/20 flex-shrink-0 overflow-hidden mt-1 self-start">
                  <img src={item.imagen_url} alt={item.nombre} className="w-full h-full object-cover dark:opacity-90" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-['Fredoka'] font-bold text-gray-800 dark:text-text-cream truncate pr-2">{item.nombre}</h3>
                    <p className="font-bold text-[#E65E3A] dark:text-primary whitespace-nowrap">S/ {(item.precio * item.cantidad).toFixed(2)}</p>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-text-muted mb-2 truncate">{item.descripcion}</p>

                  {(item.extras?.length > 0 || item.notas) && (
                    <div className="mb-3 space-y-1">
                      {item.extras?.map((extra, i) => (
                        <div key={i} className="text-[10px] inline-block bg-orange-50 dark:bg-primary/10 text-[#E65E3A] dark:text-primary border border-orange-100 dark:border-primary/20 px-2 py-0.5 rounded-md font-semibold mr-1 mb-1">
                          + {extra.nombre} (S/ {extra.precio.toFixed(2)})
                        </div>
                      ))}
                      {item.notas && (
                        <div className="text-[10px] text-gray-500 dark:text-text-muted italic bg-gray-50 dark:bg-white/5 px-2 py-1 rounded-md border border-gray-100 dark:border-white/10 mt-1">
                          <span className="font-semibold not-italic">Nota:</span> {item.notas}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center bg-gray-50 dark:bg-black/20 rounded-lg p-1 border border-gray-100 dark:border-white/5">
                      <button
                        onClick={() => disminuirCantidad(item.idCarrito)}
                        className="w-7 h-7 flex items-center justify-center rounded-md bg-white dark:bg-surface-dark shadow-sm text-gray-600 dark:text-text-muted hover:text-[#E65E3A] dark:hover:text-primary active:scale-95 transition-all text-lg font-bold">
                        -
                      </button>
                      <span className="w-8 text-center font-bold text-sm text-gray-800 dark:text-text-cream">
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() => aumentarCantidad(item.idCarrito)}
                        className="w-7 h-7 flex items-center justify-center rounded-md bg-[#E65E3A] dark:bg-primary text-white shadow-sm shadow-orange-500/30 active:scale-95 transition-all text-lg font-bold">
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => eliminarDelCarrito(item.idCarrito)}
                      className="text-xs text-red-400 hover:text-red-500 dark:text-red-400/80 dark:hover:text-red-400 font-semibold ml-auto flex items-center gap-1 transition-colors">
                      <MdDeleteOutline className="text-sm" /> Remover
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* --- RECOMENDACIONES --- */}
        {recomendaciones.length > 0 && (
          <div className="mt-8 mb-6">
            <h3 className="font-['Fredoka'] text-md font-bold text-gray-800 dark:text-text-cream mb-3 flex items-center gap-2 transition-colors">
              <span className="text-yellow-500 text-xl"></span>
              ¿Qué tal si lo acompañas con?
            </h3>

            <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4" style={{ scrollbarWidth: 'none' }}>
              {recomendaciones.map((prod) => (
                <div key={prod.id} className="min-w-[140px] max-w-[140px] bg-white dark:bg-surface-dark rounded-xl p-3 shadow-sm dark:shadow-dark-elevated border border-gray-100 dark:border-white/5 flex flex-col items-center text-center transition-all active:scale-95">
                  <img src={prod.imagen_url} alt={prod.nombre} className="w-16 h-16 rounded-full object-cover mb-2 shadow-sm dark:opacity-90" />

                  <div className="h-10 w-full flex items-center justify-center">
                    <h4 className="font-bold text-sm text-gray-700 dark:text-text-cream line-clamp-2 leading-tight">
                      {prod.nombre}
                    </h4>
                  </div>

                  <span className="text-xs text-[#E65E3A] dark:text-primary font-bold mt-1">S/ {prod.precio.toFixed(2)}</span>

                  <button
                    onClick={() => {
                      if (prod.extras_disponibles && prod.extras_disponibles.length > 0) {
                        irAlMenu();
                      } else {
                        agregarAlCarrito({ ...prod, idCarrito: prod.id.toString(), cantidad: 1 });
                      }
                    }}
                    className="mt-2 w-full py-1.5 bg-gray-50 dark:bg-white/10 text-xs font-bold rounded-lg hover:bg-[#E65E3A] dark:hover:bg-primary text-gray-700 dark:text-text-cream hover:text-white transition-colors">
                    Agregar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OBSERVACIONES */}
        <div className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-gray-100 dark:border-white/5 shadow-sm dark:shadow-dark-elevated transition-colors">
          <h3 className="font-['Fredoka'] text-sm font-bold text-gray-800 dark:text-text-cream mb-2 flex items-center gap-2">
            <MdEditNote className="text-gray-400 dark:text-text-muted text-xl" />
            Observaciones a la mesa
          </h3>
          <p className="text-xs text-gray-500 dark:text-text-muted mb-2">¿Necesitas vasos extra, cubiertos o tienes alguna indicación general para los meseros?</p>
          <textarea
            className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg p-3 text-sm text-gray-700 dark:text-text-cream dark:placeholder-gray-600 focus:outline-none focus:border-[#E65E3A] dark:focus:border-primary transition-colors"
            placeholder="Escribe tus indicaciones generales aquí..."
            rows="3"
          ></textarea>
        </div>
      </main>

      {/* FOOTER TOTALES */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-dark border-t border-gray-100 dark:border-white/5 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)] dark:shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.5)] z-50 rounded-t-3xl animate-[slideUp_0.5s_ease-out] transition-colors duration-300">
        <div className="p-5 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm text-gray-500 dark:text-text-muted">
              <span>Subtotal</span>
              <span>S/ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-xl font-bold text-gray-900 dark:text-text-cream pt-2 border-t border-gray-100 dark:border-white/10">
              <span className="font-['Fredoka']">Total a pagar</span>
              <span className="text-[#E65E3A] dark:text-primary">S/ {total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={irAConfirmacion}
            disabled={carrito.length === 0}
            className={`w-full font-bold text-lg py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all ${carrito.length === 0 ? 'bg-gray-300 dark:bg-white/5 text-gray-500 dark:text-text-muted' : 'bg-[#E65E3A] dark:bg-primary hover:bg-orange-600 dark:hover:bg-primary-dark text-white shadow-orange-500/30 dark:shadow-orange-900/30 active:scale-[0.98]'}`}
          >
            <MdCheckCircle /> Confirmar Pedido a Cocina
          </button>

          <button onClick={irAlMenu} className="w-full text-[#E65E3A] dark:text-primary font-bold text-sm py-1 hover:underline transition-colors">
            ← Volver y agregar más ítems
          </button>
        </div>
      </div>

    </div>
  );
}

export default Carrito;