import { useState } from 'react';
import { MdLocalCafe, MdLunchDining, MdCookie, MdLocalBar, MdIcecream, MdAdd, MdBrightnessMedium, MdRestaurantMenu } from "react-icons/md";
import ModalProducto from './ModalProductos'; 

const iconosPorMacroCategoria = {
  "Salados": <MdLunchDining className="text-lg" />,
  "Dulces": <MdCookie className="text-lg" />,
  "Bebidas calientes": <MdLocalCafe className="text-lg" />,
  "Bebidas frías": <MdIcecream className="text-lg" />,
  "Bebidas con alcohol": <MdLocalBar className="text-lg" />
};

function Menu({ irAlCarrito, carrito, agregarAlCarrito, productos, toppings }) {
  const macroCategoriasUnicas = [...new Set(productos.map(p => p.macro_categoria))];
  const [categoriaActiva, setCategoriaActiva] = useState(macroCategoriasUnicas[0] || 'Salados');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const totalItems = carrito.reduce((suma, item) => suma + item.cantidad, 0);
  const totalPrecio = carrito.reduce((suma, item) => suma + (item.precio * item.cantidad), 0);

  const menuAgrupado = macroCategoriasUnicas.map(macro => {
    const productosDeEstaMacro = productos.filter(p => p.macro_categoria === macro);
    const subCategorias = [...new Set(productosDeEstaMacro.map(p => p.categoria))];
    
    return {
      macroCategoria: macro,
      subSecciones: subCategorias.map(subCat => ({
        categoria: subCat,
        items: productosDeEstaMacro.filter(p => p.categoria === subCat)
      }))
    };
  });

  const scrollToCategory = (idCategoria, nombreBoton) => {
    setCategoriaActiva(nombreBoton);
    const elemento = document.getElementById(idCategoria);
    if (elemento) {
      elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const manejarClickAgregar = (producto) => {
    const categoriaConExtras = toppings?.find(t => t.categoria === producto.categoria);
    if (categoriaConExtras && categoriaConExtras.extras && categoriaConExtras.extras.length > 0) {
      setProductoSeleccionado({
        ...producto,
        extras_disponibles: categoriaConExtras.extras 
      });
    } else {
      agregarAlCarrito({ ...producto, idCarrito: producto.id.toString(), cantidad: 1 });
    }
  };

  return (
    <div className="bg-[#FFFBF2] font-['Nunito'] text-[#4A3B32] min-h-screen pb-24 selection:bg-[#E95D34] selection:text-white">
      
      <header className="sticky top-0 z-40 bg-[#FFFBF2]/90 backdrop-blur-md border-b border-[#E95D34]/10 pb-2">
        <div className="px-5 pt-6 pb-2 flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="font-['Fredoka'] font-semibold text-2xl text-[#E95D34] tracking-wide">4 Gatos</h1>
            <span className="text-xs uppercase tracking-widest font-bold opacity-70">Café Lúdico</span>
          </div>
          <button className="p-2 rounded-full bg-white shadow-sm text-[#E95D34] hover:bg-orange-50 transition-colors">
            <MdBrightnessMedium className="text-xl" />
          </button>
        </div>

        <nav className="mt-2 w-full overflow-x-auto pl-5 pr-2" style={{ scrollbarWidth: 'none' }}>
          <div className="flex space-x-3 pb-2 min-w-max">
            {macroCategoriasUnicas.map((macro) => {
              const idValido = macro.replace(/\s+/g, '-');
              const estaActivo = categoriaActiva === macro;
              
              return (
                <button 
                  key={macro}
                  onClick={() => scrollToCategory(idValido, macro)} 
                  className={`flex items-center space-x-2 px-5 py-2.5 rounded-full whitespace-nowrap transition-transform active:scale-95 ${estaActivo ? 'bg-[#E95D34] text-white shadow-[0_4px_20px_-2px_rgba(233,93,52,0.3)]' : 'bg-white border border-gray-200 text-gray-600 hover:bg-orange-50'}`}
                >
                  {iconosPorMacroCategoria[macro] || <MdRestaurantMenu className="text-lg" />}
                  <span className="font-['Fredoka'] font-medium">{macro}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </header>

      <main className="px-5 py-6 space-y-8">
        
        <div className="relative w-full h-40 rounded-2xl overflow-hidden shadow-lg group bg-gray-800">
          <img src="/cheesecake_fresa.jpg" alt="Fondo de Cheesecake" className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 group-hover:scale-105"/>
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent flex flex-col justify-center px-6 z-10">
            <span className="text-white/90 text-xs font-bold uppercase tracking-wider mb-1">Especial del día</span>
            <h2 className="text-white font-['Fredoka'] text-2xl font-bold leading-tight">Cheesecake<br/>de Fresa</h2>
            <button className="mt-3 bg-[#E95D34] text-white text-xs font-bold px-4 py-2 rounded-lg w-max shadow-md hover:bg-[#C8411B] transition-colors">Ver Promo</button>
          </div>
        </div>

        {menuAgrupado.map((macroSeccion, indexMacro) => {
          const idMacroValido = macroSeccion.macroCategoria.replace(/\s+/g, '-');
          
          return (
            <section key={indexMacro} id={idMacroValido} className="scroll-mt-32">
              <h2 className="font-['Fredoka'] text-3xl font-extrabold text-[#E95D34] mb-6 uppercase tracking-wider border-b-2 border-[#E95D34]/20 pb-2">
                {macroSeccion.macroCategoria}
              </h2>
              
              {macroSeccion.subSecciones.map((subSeccion, indexSub) => (
                <div key={indexSub} className="mb-8">
                  <h3 className="font-['Fredoka'] text-xl font-bold text-gray-800 mb-4 opacity-90">
                    {subSeccion.categoria}
                  </h3>
                  
                  {/* MAGIA AQUÍ: Verificamos si es Bebidas de Café para cambiar la grilla a 2 columnas */}
                  <div className={`grid gap-4 ${subSeccion.categoria === 'Bebidas de Café' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    
                    {subSeccion.items.map((producto) => {
                      
                      // --- TARJETA COMPACTA (Para Bebidas de Café) ---
                      if (subSeccion.categoria === 'Bebidas de Café') {
                        return (
                          <article key={producto.id} className={`bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center transition-transform active:scale-[0.99] relative overflow-hidden ${!producto.disponible ? 'opacity-70 grayscale' : ''}`}>
                            {!producto.disponible && (
                              <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded z-10 shadow-sm uppercase tracking-wider">Agotado</div>
                            )}
                            <div className="w-24 h-24 mb-3 rounded-xl overflow-hidden relative bg-gray-100 shadow-sm">
                              <img alt={producto.nombre} className="w-full h-full object-cover" src={producto.imagen_url} />
                            </div>
                            {/* Ajustamos la altura mínima para que los nombres largos no rompan la cuadrícula */}
                            <h3 className="font-['Fredoka'] font-bold text-[15px] text-gray-800 leading-tight mb-2 line-clamp-2 min-h-[38px] flex items-center justify-center">
                              {producto.nombre}
                            </h3>
                            
                            <div className="w-full flex justify-between items-center mt-auto pt-2 border-t border-gray-50">
                              <span className={`font-bold text-sm ${producto.disponible ? 'text-[#E95D34]' : 'text-gray-500'}`}>
                                S/ {producto.precio.toFixed(2)}
                              </span>
                              <button 
                                onClick={() => manejarClickAgregar(producto)}
                                disabled={!producto.disponible}
                                className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-colors ${producto.disponible ? 'bg-[#E95D34] text-white hover:bg-[#C8411B]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                              >
                                <MdAdd className="text-base" />
                              </button>
                            </div>
                          </article>
                        );
                      }

                      // --- TARJETA COMPLETA (Para el resto de la carta) ---
                      return (
                        <article key={producto.id} className={`bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex gap-4 transition-transform active:scale-[0.99] relative overflow-hidden ${!producto.disponible ? 'opacity-70 grayscale' : ''}`}>
                          {!producto.disponible && (
                            <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded z-10 shadow-sm uppercase tracking-wider">Agotado</div>
                          )}
                          <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden relative bg-gray-100">
                            <img alt={producto.nombre} className="w-full h-full object-cover" src={producto.imagen_url} />
                            {producto.popular && producto.disponible && (
                              <span className="absolute top-1 left-1 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-1.5 py-0.5 rounded-md">Popular</span>
                            )}
                          </div>
                          
                          <div className="flex-1 flex flex-col justify-between py-1">
                            <div>
                              <h3 className="font-['Fredoka'] font-bold text-lg text-gray-800 leading-tight pr-12">{producto.nombre}</h3>
                              <p className="text-gray-500 text-xs mt-1 line-clamp-2">{producto.descripcion}</p>
                            </div>
                            
                            <div className="flex justify-between items-center mt-2">
                              <span className={`font-bold text-lg ${producto.disponible ? 'text-[#E95D34]' : 'text-gray-500'}`}>
                                S/ {producto.precio.toFixed(2)}
                              </span>
                              
                              <button 
                                onClick={() => manejarClickAgregar(producto)}
                                disabled={!producto.disponible}
                                className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-colors ${producto.disponible ? 'bg-[#E95D34] text-white hover:bg-[#C8411B]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                              >
                                <MdAdd className="text-lg" />
                              </button>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              ))}
            </section>
          );
        })}
      </main>

      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-sm px-5 z-40">
        <button onClick={irAlCarrito} className="w-full bg-[#1F1B1A] text-white p-4 rounded-xl shadow-2xl flex justify-between items-center hover:scale-[1.02] transition-transform duration-200">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 px-3 py-1 rounded-lg text-sm font-bold backdrop-blur-sm">{totalItems}</div>
            <span className="font-['Fredoka'] font-medium">Ver tu pedido</span>
          </div>
          <div className="font-bold text-lg">S/ {totalPrecio.toFixed(2)}</div>
        </button>
      </div>

      {productoSeleccionado && (
        <ModalProducto 
          producto={productoSeleccionado}
          cerrarModal={() => setProductoSeleccionado(null)}
          confirmarAgregado={(productoPersonalizado) => {
            agregarAlCarrito(productoPersonalizado); 
            setProductoSeleccionado(null); 
          }}
        />
      )}

    </div>
  );
}

export default Menu;