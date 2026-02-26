import { useState } from 'react';
import { MdLocalCafe, MdLunchDining, MdCookie, MdCasino, MdAdd, MdBrightnessMedium } from "react-icons/md";

// 1. AHORA RECIBIMOS 'productos' COMO PROP
function Menu({ irAlCarrito, carrito, agregarAlCarrito, productos }) {
  const [categoriaActiva, setCategoriaActiva] = useState('Bebidas');
  const totalItems = carrito.reduce((suma, item) => suma + item.cantidad, 0);
  const totalPrecio = carrito.reduce((suma, item) => suma + (item.precio * item.cantidad), 0);

  // 2. LA MAGIA DE AGRUPAR: Convertimos la lista plana en secciones para dibujar
  // Primero sacamos una lista de todas las categorías únicas ("Bebidas de Café", "Smash Burgers", etc.)
  const categoriasUnicas = [...new Set(productos.map(p => p.categoria))];
  
  // Luego creamos el arreglo anidado que necesita nuestro diseño
  const menuAgrupado = categoriasUnicas.map(categoriaFiltro => {
    return {
      categoria: categoriaFiltro,
      items: productos.filter(p => p.categoria === categoriaFiltro)
    };
  });
  const scrollToCategory = (idCategoria, nombreBoton) => {
    setCategoriaActiva(nombreBoton); // Cambia el color del botón
    const elemento = document.getElementById(idCategoria);
    if (elemento) {
      // Usamos block: 'start' para ir al inicio de la sección
      elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  return (
    <div className="bg-[#FFFBF2] font-['Nunito'] text-[#4A3B32] min-h-screen pb-24 selection:bg-[#E95D34] selection:text-white">
      
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 bg-[#FFFBF2]/90 backdrop-blur-md border-b border-[#E95D34]/10 pb-2">
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
            
            {/* Botón Bebidas */}
            {/* Botón Bebidas */}
            <button 
              onClick={() => scrollToCategory("Bebidas-de-Café", "Bebidas")} 
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-full whitespace-nowrap transition-transform active:scale-95 ${categoriaActiva === 'Bebidas' ? 'bg-[#E95D34] text-white shadow-[0_4px_20px_-2px_rgba(233,93,52,0.3)]' : 'bg-white border border-gray-200 text-gray-600 hover:bg-orange-50'}`}
            >
              <MdLocalCafe className="text-lg" />
              <span className="font-['Fredoka'] font-medium">Bebidas</span>
            </button>

            {/* Botón Comidas */}
            <button 
              onClick={() => scrollToCategory("Smash-Burgers", "Comidas")} 
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-full whitespace-nowrap transition-transform active:scale-95 ${categoriaActiva === 'Comidas' ? 'bg-[#E95D34] text-white shadow-[0_4px_20px_-2px_rgba(233,93,52,0.3)]' : 'bg-white border border-gray-200 text-gray-600 hover:bg-orange-50'}`}
            >
              <MdLunchDining className="text-lg" />
              <span className="font-['Fredoka'] font-medium">Comidas</span>
            </button>

            {/* Botón Postres */}
            <button 
              onClick={() => scrollToCategory("Mini-Waffles", "Postres")} 
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-full whitespace-nowrap transition-transform active:scale-95 ${categoriaActiva === 'Postres' ? 'bg-[#E95D34] text-white shadow-[0_4px_20px_-2px_rgba(233,93,52,0.3)]' : 'bg-white border border-gray-200 text-gray-600 hover:bg-orange-50'}`}
            >
              <MdCookie className="text-lg" />
              <span className="font-['Fredoka'] font-medium">Postres</span>
            </button>
          </div>
        </nav>
      </header>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="px-5 py-6 space-y-8">
        
        {/* Banner Promocional */}
        <div className="relative w-full h-40 rounded-2xl overflow-hidden shadow-lg group bg-gray-800">
          <img 
            src="/cheesecake_fresa.jpg"
            alt="Fondo de Cheesecake" 
            className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent flex flex-col justify-center px-6 z-10">
            <span className="text-white/90 text-xs font-bold uppercase tracking-wider mb-1">Especial del día</span>
            <h2 className="text-white font-['Fredoka'] text-2xl font-bold leading-tight">Cheesecake<br/>de Fresa</h2>
            <button className="mt-3 bg-[#E95D34] text-white text-xs font-bold px-4 py-2 rounded-lg w-max shadow-md hover:bg-[#C8411B] transition-colors">
              Ver Promo
            </button>
          </div>
        </div>

        {/* --- LISTA DE PRODUCTOS --- */}
        {/* Ahora recorremos 'menuAgrupado' que creamos dinámicamente arriba */}
        {menuAgrupado.map((seccion, index) => {
          // TRUCO: Reemplazamos los espacios por guiones para tener un ID válido en HTML
          const idSeccionValido = seccion.categoria.replace(/\s+/g, '-');

          return (
            <section key={index}>
              <div className="flex justify-between items-end mb-4">
                {/* Le asignamos el ID corregido */}
                <h2 id={idSeccionValido} className="font-['Fredoka'] text-xl font-bold text-gray-800 scroll-mt-32">
                  {seccion.categoria}
                </h2>
              </div>
            
            <div className="grid grid-cols-1 gap-4">
              {seccion.items.map((producto) => (
                <article 
                  key={producto.id} 
                  className={`bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex gap-4 transition-transform active:scale-[0.99] relative overflow-hidden ${!producto.disponible ? 'opacity-70 grayscale' : ''}`}
                >
                  {!producto.disponible && (
                    <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded z-10 shadow-sm uppercase tracking-wider">Agotado</div>
                  )}

                  <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden relative bg-gray-100">
                    <img alt={producto.nombre} className="w-full h-full object-cover" src={producto.imagen} />
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
                        onClick={() => agregarAlCarrito(producto)}
                        disabled={!producto.disponible}
                        className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-colors ${producto.disponible ? 'bg-[#E95D34] text-white hover:bg-[#C8411B]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                      >
                        <MdAdd className="text-lg" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
         )})}
      </main>

      {/* --- BOTÓN FLOTANTE DINÁMICO --- */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-sm px-5 z-40">
        <button 
          onClick={irAlCarrito} 
          className="w-full bg-[#1F1B1A] text-white p-4 rounded-xl shadow-2xl flex justify-between items-center hover:scale-[1.02] transition-transform duration-200"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 px-3 py-1 rounded-lg text-sm font-bold backdrop-blur-sm">
              {totalItems}
            </div>
            <span className="font-['Fredoka'] font-medium">Ver tu pedido</span>
          </div>
          <div className="font-bold text-lg">
            S/ {totalPrecio.toFixed(2)}
          </div>
        </button>
      </div>

    </div>
  );
}

export default Menu;