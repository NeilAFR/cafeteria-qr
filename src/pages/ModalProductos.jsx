import { useState } from "react";
import { MdClose, MdAdd, MdRemove } from "react-icons/md";
import { FaLeaf } from "react-icons/fa";

function ModalProducto({ producto, cerrarModal, confirmarAgregado }) {

  const [cantidad, setCantidad] = useState(1);
  const [extrasSeleccionados, setExtrasSeleccionados] = useState([]);
  const [notas, setNotas] = useState("");

  const [bebidaCombo, setBebidaCombo] = useState("Naranja Sunrise");
  const opcionesBebidaCombo = ["Naranja Sunrise", "Red Berry Fizz", "Maracuyá Spark", "Coca Orange"];

  const toggleExtra = (extra) => {
    setExtrasSeleccionados((prev) => {
      const yaExiste = prev.find((e) => e.id_extra === extra.id_extra);
      if (yaExiste) {
        return prev.filter((e) => e.id_extra !== extra.id_extra);
      } else {
        return [...prev, extra];
      }
    });
  };

  const costoExtras = extrasSeleccionados.reduce((suma, extra) => suma + extra.precio, 0);
  const precioUnitario = producto.precio + costoExtras;
  const precioTotal = precioUnitario * cantidad;

  const manejarAgregar = () => {
    const extrasProcesados = extrasSeleccionados.map(extra => {
      if (extra.nombre.toLowerCase().includes('combo')) {
        return { ...extra, nombre: `${extra.nombre} (${bebidaCombo})` };
      }
      return extra;
    });

    const idsExtras = extrasProcesados.map(e => e.id_extra).sort().join('-');
    const idCarritoUnico = `${producto.id}-${idsExtras}-${bebidaCombo}-${notas}`;

    const productoPersonalizado = {
      ...producto,
      idCarrito: idCarritoUnico,
      precioOriginal: producto.precio,
      precio: precioUnitario,
      extras: extrasProcesados,
      notas: notas,
      cantidad: cantidad
    };

    confirmarAgregado(productoPersonalizado);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center transition-opacity">

      <div className="relative flex w-full max-w-md flex-col bg-[#FFFBF2] dark:bg-background-dark rounded-t-3xl sm:rounded-3xl h-[85vh] overflow-hidden shadow-2xl animate-[slideUp_0.3s_ease-out] transition-colors duration-300">

        {/* HEADER MODAL */}
        <div className="flex items-center bg-[#FFFBF2] dark:bg-background-dark p-4 pb-2 justify-between z-10 shadow-sm border-b border-[#E95D34]/10 dark:border-white/5 transition-colors">
          <button onClick={cerrarModal} className="text-gray-800 dark:text-text-cream flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
            <MdClose className="text-2xl" />
          </button>
          <h2 className="text-gray-800 dark:text-text-cream text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">
            Personalizar
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto pb-32">

          {/* IMAGEN */}
          <div className="p-4">
            <div
              className="w-full bg-gray-200 dark:bg-black/20 bg-center bg-no-repeat bg-cover aspect-video rounded-xl shadow-sm dark:shadow-dark-elevated"
              style={{ backgroundImage: `url(${producto.imagen_url})` }}
            ></div>
          </div>

          <div className="px-5">
            <div className="flex justify-between items-start">
              <h2 className="text-gray-900 dark:text-text-cream tracking-tight text-3xl font-['Fredoka'] font-bold leading-tight mb-2 pr-2">
                {producto.nombre}
              </h2>
              <span className="bg-[#E95D34]/10 dark:bg-primary/10 text-[#E95D34] dark:text-primary text-sm font-bold px-3 py-1 rounded-full mt-1 whitespace-nowrap">
                S/ {producto.precio.toFixed(2)}
              </span>
            </div>
            <p className="text-gray-600 dark:text-text-muted text-sm font-medium leading-relaxed mb-6">
              {producto.descripcion}
            </p>

            <div className="border-t border-gray-200 dark:border-white/10 my-4"></div>

            <h3 className="text-gray-900 dark:text-text-cream text-lg font-['Fredoka'] font-bold leading-tight mb-4">
              Elige tus extras
            </h3>

            <div className="space-y-3">
              {producto.extras_disponibles?.map((extra) => {
                const estaSeleccionado = extrasSeleccionados.some(e => e.id_extra === extra.id_extra);

                const esVegetariana = extra.nombre.toLowerCase().includes('vegetariana') || extra.nombre.toLowerCase().includes('veggie');
                const esCombo = extra.nombre.toLowerCase().includes('combo');

                return (
                  <div key={extra.id_extra} className="flex flex-col gap-2">

                    <label
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer shadow-sm ${estaSeleccionado ? 'border-[#E95D34] dark:border-primary bg-[#E95D34]/5 dark:bg-primary/10' : 'border-gray-200 dark:border-white/10 bg-white dark:bg-surface-dark'}`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={estaSeleccionado}
                          onChange={() => toggleExtra(extra)}
                          className="size-5 rounded border-gray-300 dark:border-gray-600 text-[#E95D34] dark:text-primary focus:ring-[#E95D34] dark:focus:ring-primary bg-gray-50 dark:bg-black/20"
                        />
                        <span className="text-gray-900 dark:text-text-cream font-semibold text-sm flex items-center gap-2">
                          {extra.nombre}
                          {esVegetariana && <FaLeaf className="text-green-500 text-sm" />}
                        </span>
                      </div>
                      <span className="text-[#E95D34] dark:text-primary font-bold text-sm">
                        + S/ {extra.precio.toFixed(2)}
                      </span>
                    </label>

                    {esCombo && estaSeleccionado && (
                      <div className="ml-8 p-3 bg-orange-50/50 dark:bg-primary/5 rounded-lg border border-orange-100 dark:border-primary/20 flex flex-col gap-2 animate-[slideDown_0.2s_ease-out]">
                        <span className="text-xs font-bold text-gray-700 dark:text-text-muted uppercase tracking-wide">Elige tu bebida gasificada:</span>
                        <select
                          value={bebidaCombo}
                          onChange={(e) => setBebidaCombo(e.target.value)}
                          className="w-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 text-gray-700 dark:text-text-cream text-sm rounded-lg focus:ring-[#E95D34] dark:focus:ring-primary focus:border-[#E95D34] dark:focus:border-primary p-2"
                        >
                          {opcionesBebidaCombo.map(bebida => (
                            <option key={bebida} value={bebida}>{bebida}</option>
                          ))}
                        </select>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>

            <div className="border-t border-gray-200 dark:border-white/10 my-6"></div>

            <h3 className="text-gray-900 dark:text-text-cream text-lg font-['Fredoka'] font-bold leading-tight mb-3">
              Notas especiales
            </h3>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface-dark text-gray-900 dark:text-text-cream dark:placeholder-gray-500 p-4 text-sm focus:border-[#E95D34] dark:focus:border-primary focus:ring-1 focus:ring-[#E95D34] dark:focus:ring-primary focus:outline-none resize-none transition-colors"
              placeholder="¿Algo que debamos saber? Ej. Sin cebolla..."
              rows="3"
            ></textarea>
            <div className="h-6"></div>
          </div>
        </div>

        {/* BOTTOM ACTION BAR FIJA */}
        <div className="absolute bottom-0 w-full bg-white dark:bg-surface-dark border-t border-gray-200 dark:border-white/5 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)] rounded-t-2xl z-20 pb-8 sm:pb-4 transition-colors">
          <div className="flex items-center gap-4">

            <div className="flex items-center bg-gray-100 dark:bg-black/20 rounded-lg p-1 shrink-0 h-12">
              <button
                onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                className="size-10 flex items-center justify-center text-gray-600 dark:text-text-muted hover:text-[#E95D34] dark:hover:text-primary active:bg-gray-200 dark:active:bg-white/10 rounded-md transition-colors"
              >
                <MdRemove className="text-xl" />
              </button>
              <span className="w-8 text-center font-bold text-lg text-gray-900 dark:text-text-cream">
                {cantidad}
              </span>
              <button
                onClick={() => setCantidad(cantidad + 1)}
                className="size-10 flex items-center justify-center text-gray-900 dark:text-text-cream hover:text-[#E95D34] dark:hover:text-primary active:bg-gray-200 dark:active:bg-white/10 rounded-md transition-colors"
              >
                <MdAdd className="text-xl" />
              </button>
            </div>

            <button
              onClick={manejarAgregar}
              className="flex-1 bg-[#E95D34] dark:bg-primary text-white font-bold text-lg h-12 px-6 rounded-xl shadow-lg shadow-orange-500/30 dark:shadow-orange-900/30 active:scale-[0.98] transition-all flex items-center justify-between"
            >
              <span>Agregar</span>
              <span className="bg-white/20 dark:bg-black/20 text-white text-sm font-bold px-2 py-1 rounded-md">
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