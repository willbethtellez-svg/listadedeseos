import React, { useState, useEffect } from 'react';
import { 
  Gift, 
  Heart, 
  Search, 
  Filter, 
  ExternalLink, 
  BookOpen, 
  Check, 
  Settings, 
  MessageSquare, 
  Loader2, 
  Sparkles,
  ChevronRight,
  Info,
  RefreshCw,
  Baby
} from 'lucide-react';
import PRODUCTOS_INICIALES from './data/productosIniciales';
import { IlustracionAbeja, IlustracionTarroMiel, IlustracionRama } from './components/Illustrations';
import IconoCategoria from './components/IconoCategoria';

export default function App() {
  // --- ESTADOS ---
  const [productos, setProductos] = useState(() => {
    const guardados = localStorage.getItem('wishlist_baby_shower_items');
    return guardados ? JSON.parse(guardados) : PRODUCTOS_INICIALES;
  });
  
  const [googleSheetsUrl, setGoogleSheetsUrl] = useState(() => {
    return localStorage.getItem('wishlist_google_sheets_url') || '';
  });

  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [filtroEstado, setFiltroEstado] = useState('Todos'); // Todos, Disponibles, Completados
  const [busqueda, setBusqueda] = useState('');
  
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [nombreDonante, setNombreDonante] = useState('');
  const [cantidadRegalo, setCantidadRegalo] = useState(1);
  const [mensajeDonante, setMensajeDonante] = useState('');
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState(null);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('wishlist'); // wishlist, dedicatorias, configuracion
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Estados para nuevo producto (Admin)
  const [nuevoProducto, setNuevoProducto] = useState({
    titulo: '',
    categoria: 'Ropa',
    descripcion: '',
    enlace: '',
    cantidadNecesitada: 1,
    imagenTipo: 'ropa',
    prioridad: 'Media'
  });

  // Notificación flotante
  const [alerta, setAlerta] = useState(null);

  // --- PERSISTENCIA LOCAL ---
  useEffect(() => {
    localStorage.setItem('wishlist_baby_shower_items', JSON.stringify(productos));
  }, [productos]);

  useEffect(() => {
    localStorage.setItem('wishlist_google_sheets_url', googleSheetsUrl);
  }, [googleSheetsUrl]);

  const mostrarAlerta = (mensaje, tipo = 'success') => {
    setAlerta({ mensaje, tipo });
    setTimeout(() => setAlerta(null), 4000);
  };

  // --- SINCRONIZACIÓN CON GOOGLE SHEETS O SUPABASE REST API ---
  const sincronizarConGoogleSheets = async (actualizarLocalmente = false) => {
    if (!googleSheetsUrl) return;
    setIsSyncing(true);
    setSyncError(null);
    setSyncSuccess(false);

    try {
      const urlConAction = `${googleSheetsUrl}?action=read`;
      const response = await fetch(urlConAction);
      
      if (!response.ok) throw new Error("No se pudo conectar con la base de datos.");
      
      const data = await response.json();
      if (data && data.status === 'success' && data.data) {
        if (actualizarLocalmente) {
          setProductos(data.data);
          mostrarAlerta("¡Datos sincronizados exitosamente! 🍯");
        }
        setSyncSuccess(true);
      } else {
        throw new Error(data.message || "Estructura de respuesta no válida");
      }
    } catch (err) {
      console.error(err);
      setSyncError("Error de conexión. Verifica que el URL o endpoint sea correcto y que tenga los permisos de lectura habilitados.");
    } finally {
      setIsSyncing(false);
    }
  };

  const enviarRegistroAGoogleSheets = async (productosActualizados) => {
    if (!googleSheetsUrl) return;
    setIsSyncing(true);
    
    try {
      const response = await fetch(googleSheetsUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'write', data: productosActualizados })
      });
      
      mostrarAlerta("Tu regalo ha sido registrado y enviado a la nube. ¡Muchas gracias! 💕");
      setSyncSuccess(true);
    } catch (err) {
      console.error(err);
      setSyncError("Se actualizó localmente pero falló la sincronización con la nube.");
    } finally {
      setIsSyncing(false);
    }
  };

  // --- OPERACIONES ---
  const abrirModalRegalo = (producto) => {
    const restantes = producto.cantidadNecesitada - producto.cantidadReservada;
    if (restantes <= 0) return;
    setProductoSeleccionado(producto);
    setCantidadRegalo(1);
    setNombreDonante('');
    setMensajeDonante('');
  };

  const confirmarRegalo = async (e) => {
    e.preventDefault();
    if (!nombreDonante.trim()) {
      mostrarAlerta("Por favor ingresa tu nombre.", "error");
      return;
    }

    const nuevosProductos = productos.map(p => {
      if (p.id === productoSeleccionado.id) {
        const nuevaReserva = p.cantidadReservada + cantidadRegalo;
        const nuevosRegaladores = [
          ...p.regalos,
          {
            donante: nombreDonante,
            fancy: true,
            cantidad: cantidadRegalo,
            mensaje: mensajeDonante,
            fecha: new Date().toLocaleDateString()
          }
        ];
        return {
          ...p,
          cantidadReservada: nuevaReserva,
          regalos: nuevosRegaladores
        };
      }
      return p;
    });

    setProductos(nuevosProductos);
    setProductoSeleccionado(null);
    mostrarAlerta(`¡Muchas gracias, ${nombreDonante}! Has reservado ${cantidadRegalo} unidad(es). 🧸`);

    if (googleSheetsUrl) {
      await enviarRegistroAGoogleSheets(nuevosProductos);
    }
  };

  const crearProductoAdmin = (e) => {
    e.preventDefault();
    if (!nuevoProducto.titulo.trim()) {
      mostrarAlerta("El producto debe tener un título.", "error");
      return;
    }

    const item = {
      ...nuevoProducto,
      id: "prod-" + Date.now(),
      cantidadReservada: 0,
      cantidadNecesitada: parseInt(nuevoProducto.cantidadNecesitada) || 1,
      regalos: []
    };

    const nuevosProductos = [item, ...productos];
    setProductos(nuevosProductos);
    mostrarAlerta("¡Nuevo producto añadido al catálogo del bosque! 🌸");
    
    setNuevoProducto({
      titulo: '',
      categoria: 'Ropa',
      descripcion: '',
      enlace: '',
      cantidadNecesitada: 1,
      imagenTipo: 'ropa',
      prioridad: 'Media'
    });

    if (googleSheetsUrl) {
      enviarRegistroAGoogleSheets(nuevosProductos);
    }
  };

  const eliminarProductoAdmin = (id) => {
    if (confirm("¿Estás seguro de que deseas eliminar este regalo del catálogo?")) {
      const nuevosProductos = productos.filter(p => p.id !== id);
      setProductos(nuevosProductos);
      mostrarAlerta("Producto eliminado.");
      if (googleSheetsUrl) {
        enviarRegistroAGoogleSheets(nuevosProductos);
      }
    }
  };

  const restaurarDemo = () => {
    if (confirm("¿Deseas restaurar los productos por defecto? Se perderá el historial actual.")) {
      setProductos(PRODUCTOS_INICIALES);
      mostrarAlerta("Catálogo demo restaurado.");
      if (googleSheetsUrl) {
        enviarRegistroAGoogleSheets(PRODUCTOS_INICIALES);
      }
    }
  };

  // --- FILTRADO Y BÚSQUEDA ---
  const categorias = ["Todas", ...new Set(productos.map(p => p.categoria))];

  const productosFiltrados = productos.filter(p => {
    const cumpleCategoria = filtroCategoria === 'Todas' || p.categoria === filtroCategoria;
    
    let cumpleEstado = true;
    const restante = p.cantidadNecesitada - p.cantidadReservada;
    if (filtroEstado === 'Disponibles') {
      cumpleEstado = restante > 0;
    } else if (filtroEstado === 'Completados') {
      cumpleEstado = restante === 0;
    }

    const cumpleBusqueda = p.titulo.toLowerCase().includes(busqueda.toLowerCase()) || 
                          p.descripcion.toLowerCase().includes(busqueda.toLowerCase());

    return cumpleCategoria && cumpleEstado && cumpleBusqueda;
  });

  // Métricas de progreso general
  const totalNecesitados = productos.reduce((acc, p) => acc + p.cantidadNecesitada, 0);
  const totalReservados = productos.reduce((acc, p) => acc + p.cantidadReservada, 0);
  const porcentajeProgreso = totalNecesitados > 0 ? Math.round((totalReservados / totalNecesitados) * 100) : 0;

  // Lista consolidada de dedicatorias
  const dedicatorias = productos.flatMap(p => 
    p.regalos.map(r => ({
      ...r,
      productoTitulo: p.titulo,
      idProducto: p.id
    }))
  );

  return (
    <div className="min-h-screen bg-[#FFF0F2] text-amber-950 font-sans selection:bg-pink-200">
      
      {/* --- BOTÓN FLOTANTE DISCRETO DE ADMINISTRACIÓN --- */}
      <button 
        onClick={() => setActiveTab('configuracion')} 
        title="Sincronización y Configuración de Administrador"
        className={`fixed top-4 right-4 z-50 p-3 rounded-full shadow-md hover:shadow-xl transition-all duration-300 ${
          activeTab === 'configuracion' 
            ? 'bg-pink-500 text-white hover:bg-pink-600 scale-110' 
            : 'bg-white/90 backdrop-blur-sm text-amber-900/50 hover:text-pink-600 hover:bg-pink-50 border border-pink-100 hover:scale-105'
        }`}
      >
        <Settings className="w-5 h-5" />
      </button>

      {/* --- ENCABEZADO ESTILO BOSQUE --- */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#FFFDF9] to-[#FFF0F2] border-b-4 border-pink-100 px-4 pt-10 pb-12 md:pb-16 text-center">
        <div className="absolute top-0 left-0 w-32 md:w-56 opacity-80 transform -scale-x-100 pointer-events-none">
          <IlustracionRama />
        </div>
        <div className="absolute top-0 right-0 w-32 md:w-56 opacity-80 pointer-events-none">
          <IlustracionRama />
        </div>

        <div className="absolute top-12 left-[15%] w-12 h-12 hidden md:block animate-bounce" style={{ animationDuration: '3s' }}>
          <IlustracionAbeja />
        </div>
        <div className="absolute bottom-6 right-[12%] w-10 h-10 hidden md:block animate-pulse" style={{ animationDuration: '4.5s' }}>
          <IlustracionAbeja />
        </div>

        <div className="max-w-3xl mx-auto relative z-10">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-pink-100 text-pink-700 font-semibold text-xs tracking-wider uppercase mb-3 border border-pink-200">
            <Baby className="w-3.5 h-3.5" /> Bienvenida, pequeña Elizabeth
          </span>
          
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-amber-900 mb-4 tracking-tight">
            Baby Shower <span className="text-pink-500">Elizabeth</span>
          </h1>
          <p className="font-serif text-lg md:text-xl text-amber-800 italic max-w-xl mx-auto mb-6">
            "A veces las cosas más pequeñas ocupan más espacio en tu corazón."
          </p>
          
          <p className="text-sm md:text-base text-amber-950/80 max-w-2xl mx-auto leading-relaxed">
            ¡Hola, familia y amigos! Estamos preparando el nido para la llegada de nuestra bebé. 
            Si deseas hacernos un regalo, puedes ver nuestra lista sugerida abajo. Selecciona el artículo que prefieras, la cantidad, y márcalo como reservado para evitar repetidos. ¡Gracias por ser parte de nuestra historia!
          </p>

          {/* Tarjeta de Progreso */}
          <div className="mt-8 max-w-md mx-auto bg-white/80 backdrop-blur-sm p-5 rounded-3xl border border-pink-100 shadow-sm relative">
            <div className="absolute -top-6 -right-6 w-16 h-16 pointer-events-none">
              <IlustracionTarroMiel />
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">Deseos del Corazón</span>
              <span className="text-xs font-bold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full">{porcentajeProgreso}% Completado</span>
            </div>
            
            <div className="relative w-full h-4 bg-amber-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-pink-300 to-pink-50 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${porcentajeProgreso}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-amber-900/75">
              <span>🎁 {totalReservados} Regalos Reservados</span>
              <span>🌿 {totalNecesitados - totalReservados} Disponibles</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- MENÚ NAVEGACIÓN DISCRETO --- */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="flex justify-center border-b border-pink-200 gap-1 md:gap-4">
          <button 
            onClick={() => setActiveTab('wishlist')}
            className={`flex items-center gap-2 px-6 py-3.5 text-sm md:text-base font-semibold border-b-2 transition-all ${
              activeTab === 'wishlist' 
                ? 'border-pink-500 text-pink-600 bg-white/40 rounded-t-xl font-bold' 
                : 'border-transparent text-amber-900/60 hover:text-amber-950 hover:bg-white/10'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Catálogo de Regalos
          </button>
          <button 
            onClick={() => setActiveTab('dedicatorias')}
            className={`flex items-center gap-2 px-6 py-3.5 text-sm md:text-base font-semibold border-b-2 transition-all ${
              activeTab === 'dedicatorias' 
                ? 'border-pink-500 text-pink-600 bg-white/40 rounded-t-xl font-bold' 
                : 'border-transparent text-amber-900/60 hover:text-amber-950 hover:bg-white/10'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Dedicatorias ({dedicatorias.length})
          </button>
        </div>
      </div>

      {/* --- CONTENIDO --- */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {alerta && (
          <div className={`fixed bottom-4 right-4 z-50 p-4 rounded-2xl shadow-xl border flex items-center gap-3 animate-slide-up max-w-sm ${
            alerta.type === 'error' 
              ? 'bg-rose-50 border-rose-200 text-rose-900' 
              : 'bg-emerald-50 border-emerald-200 text-emerald-950'
          }`}>
            <span className="text-xl">{alerta.type === 'error' ? '⚠️' : '🐝'}</span>
            <p className="text-sm font-medium">{alerta.mensaje}</p>
          </div>
        )}

        {/* ================= WISHLIST ================= */}
        {activeTab === 'wishlist' && (
          <div>
            <div className="bg-[#FFFDF9] border border-pink-100 p-6 rounded-3xl shadow-sm mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div className="relative">
                  <Search className="absolute left-3.5 top-3 w-5 h-5 text-amber-900/40" />
                  <input 
                    type="text" 
                    placeholder="Buscar regalo..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-amber-50/50 border border-amber-200/60 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent text-amber-950 placeholder-amber-950/40"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-amber-900/60 shrink-0" />
                  <select 
                    value={filtroCategoria}
                    onChange={(e) => setFiltroCategoria(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-2xl bg-amber-50/50 border border-amber-200/60 focus:outline-none focus:ring-2 focus:ring-pink-300 text-amber-950"
                  >
                    {categorias.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-amber-900/60 shrink-0">Disponibilidad:</span>
                  <select 
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-2xl bg-amber-50/50 border border-amber-200/60 focus:outline-none focus:ring-2 focus:ring-pink-300 text-amber-950"
                  >
                    <option value="Todos">Mostrar Todos</option>
                    <option value="Disponibles">Solo Disponibles</option>
                    <option value="Completados">Completamente Reservados</option>
                  </select>
                </div>

              </div>
            </div>

            {productosFiltrados.length === 0 ? (
              <div className="text-center py-16 bg-[#FFFDF9]/60 rounded-3xl border border-pink-100">
                <div className="w-20 h-20 mx-auto opacity-30 mb-4">
                  <IlustracionAbeja />
                </div>
                <h3 className="font-serif text-2xl text-amber-900 font-semibold">No encontramos coincidencias</h3>
                <p className="text-amber-950/70 mt-2">Intenta cambiando el filtro o la búsqueda por otra palabra.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {productosFiltrados.map((producto) => {
                  const restante = producto.cantidadNecesitada - producto.cantidadReservada;
                  const isCompletado = restante === 0;

                  return (
                    <div 
                      key={producto.id}
                      className={`relative bg-[#FFFDF9] border-2 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                        isCompletado 
                          ? 'border-emerald-200/80 bg-emerald-50/10' 
                          : 'border-pink-100 hover:border-pink-200'
                      }`}
                    >
                      {!isCompletado && producto.prioridad === 'Alta' && (
                        <span className="absolute top-3 right-3 bg-rose-100 text-rose-700 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider border border-rose-200">
                          Prioritario 💝
                        </span>
                      )}

                      <div className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <IconoCategoria tipo={producto.imagenTipo} />
                          <div>
                            <span className="text-[11px] font-bold text-amber-800 bg-amber-100/60 px-2 py-0.5 rounded-md uppercase tracking-wider">
                              {producto.categoria}
                            </span>
                            <h3 className="font-serif text-lg font-bold text-amber-950 mt-1 leading-snug">
                              {producto.titulo}
                            </h3>
                          </div>
                        </div>

                        <p className="text-xs md:text-sm text-amber-950/75 leading-relaxed line-clamp-3 mb-4">
                          {producto.descripcion}
                        </p>

                        <div className="space-y-2 bg-amber-50/50 p-3.5 rounded-2xl border border-amber-100/50">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-amber-900/70">Objetivo:</span>
                            <span className="text-amber-950">{producto.cantidadNecesitada} unidades</span>
                          </div>
                          
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-amber-900/70">Ya Reservados:</span>
                            <span className={`${producto.cantidadReservada > 0 ? 'text-pink-600 font-bold' : 'text-amber-950'}`}>
                              {producto.cantidadReservada} unidades
                            </span>
                          </div>

                          <div className="w-full h-2 bg-amber-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                isCompletado ? 'bg-emerald-400' : 'bg-pink-400'
                              }`}
                              style={{ width: `${(producto.cantidadReservada / producto.cantidadNecesitada) * 100}%` }}
                            />
                          </div>

                          <div className="flex justify-between items-center text-xs pt-1">
                            <span className="text-amber-900/60">Restantes:</span>
                            {isCompletado ? (
                              <span className="text-emerald-600 font-extrabold flex items-center gap-1 bg-emerald-100/50 px-2 py-0.5 rounded-md">
                                <Check className="w-3.5 h-3.5" /> ¡Reservado completo!
                              </span>
                            ) : (
                              <span className="text-pink-700 font-bold bg-pink-100/50 px-2 py-0.5 rounded-md">
                                {restante} disponibles
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="p-6 pt-0 border-t border-dashed border-amber-100/80 mt-auto bg-amber-50/10">
                        <div className="flex gap-2.5 mt-4">
                          {producto.enlace && (
                            <a 
                              href={producto.enlace}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl border border-pink-200 text-pink-600 bg-white hover:bg-pink-50 transition-colors text-xs font-semibold shadow-sm w-1/3 text-center"
                            >
                              Ver tienda <ExternalLink className="w-3 h-3" />
                            </a>
                          )}

                          {isCompletado ? (
                            <div className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2.5 rounded-2xl text-xs font-bold shadow-inner">
                              <Check className="w-4 h-4 stroke-[3]" /> ¡Regalado!
                            </div>
                          ) : (
                            <button
                              onClick={() => abrirModalRegalo(producto)}
                              className="flex-1 flex items-center justify-center gap-1.5 bg-pink-500 hover:bg-pink-600 active:bg-pink-700 text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow-sm transition-all hover:shadow hover:-translate-y-0.5"
                            >
                              <Gift className="w-4 h-4" /> Elegir para regalar
                            </button>
                          )}
                        </div>

                        {producto.regalos.length > 0 && (
                          <div className="mt-3.5 pt-3.5 border-t border-amber-100/50">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900/60 block mb-1">Un regalo de parte de:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {producto.regalos.map((r, idx) => (
                                <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white border border-amber-100 rounded-full text-[11px] font-medium text-amber-950">
                                  ❤️ {r.donante} <span className="opacity-60">({r.cantidad})</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {isAdmin && (
                          <div className="mt-4 pt-2 border-t border-rose-100 flex justify-end">
                            <button 
                              onClick={() => eliminarProductoAdmin(producto.id)}
                              className="text-xs text-rose-600 hover:text-rose-800 underline font-medium"
                            >
                              Eliminar regalo ❌
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================= DEDICATORIAS ================= */}
        {activeTab === 'dedicatorias' && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="font-serif text-3xl font-bold text-amber-900">Libro de Dedicatorias</h2>
              <p className="text-amber-950/70 mt-2">Mensajes de amor y buenos deseos de nuestros invitados para la bebé.</p>
            </div>

            {dedicatorias.length === 0 ? (
              <div className="text-center py-12 bg-[#FFFDF9]/80 rounded-3xl border border-pink-100">
                <MessageSquare className="w-12 h-12 mx-auto text-pink-300 mb-3" />
                <h3 className="font-serif text-xl font-semibold text-amber-900">Aún no hay mensajes</h3>
                <p className="text-sm text-amber-950/60 mt-1">Los mensajes aparecerán aquí cuando los invitados reserven regalos.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {dedicatorias.map((d, index) => (
                  <div key={index} className="bg-[#FFFDF9] border border-pink-100 p-6 rounded-3xl shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 opacity-10 pointer-events-none">
                      <IlustracionAbeja />
                    </div>
                    
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-serif text-lg font-bold text-pink-700">{d.donante}</h4>
                        <p className="text-xs text-amber-900/60">Regaló: <span className="font-semibold text-amber-950">{d.productoTitulo}</span> (Cant: {d.cantidad})</p>
                      </div>
                      {d.fecha && <span className="text-[10px] bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full font-medium">{d.fecha}</span>}
                    </div>

                    <p className="text-sm md:text-base text-amber-900 italic font-medium leading-relaxed border-l-2 border-pink-300 pl-4 mt-2 bg-pink-50/20 py-1 rounded-r-lg">
                      "{d.mensaje || '¡Felicitaciones a los papás! Que el amor y la dulzura de la miel rodee siempre a la pequeña Elizabeth.'}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= CONFIGURACIÓN & ADMIN ================= */}
        {activeTab === 'configuracion' && (
          <div className="max-w-3xl mx-auto space-y-8">
            
            {/* Botón rápido para volver al catálogo */}
            <button 
              onClick={() => setActiveTab('wishlist')}
              className="flex items-center gap-1.5 text-xs font-bold text-pink-600 hover:text-pink-700 mb-4 bg-white/80 border border-pink-100 px-3 py-1.5 rounded-full transition-colors shadow-sm"
            >
              <span className="inline-block transform rotate-180"><ChevronRight className="w-3.5 h-3.5" /></span>
              Volver al Catálogo de Regalos
            </button>

            <div className="bg-[#FFFDF9] border border-pink-100 p-6 rounded-3xl shadow-sm">
              <h3 className="font-serif text-2xl font-bold text-amber-900 mb-2 flex items-center gap-2">
                <svg className="w-6 h-6 fill-emerald-600" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-2h2v2zm0-4H7v-2h2v2zm0-4H7V7h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/></svg>
                Base de Datos (Sincronización)
              </h3>
              <p className="text-sm text-amber-950/70 mb-4">
                Pega aquí el endpoint REST de tu **Google Sheets** o el de **Supabase REST** para que los regalos y dedicatorias se guarden automáticamente en tiempo real.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-amber-900/80 uppercase tracking-wider mb-1">URL / API Endpoint de Sincronización</label>
                  <input 
                    type="text" 
                    placeholder="https://script.google.com/macros/s/.../exec  O  https://your-project.supabase.co/rest/v1/wishlist"
                    value={googleSheetsUrl}
                    onChange={(e) => setGoogleSheetsUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-amber-50/30 border border-amber-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => sincronizarConGoogleSheets(true)}
                    disabled={isSyncing || !googleSheetsUrl}
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white rounded-2xl text-xs font-bold shadow-sm transition-all"
                  >
                    {isSyncing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                    Sincronizar y Descargar Datos
                  </button>
                  <button
                    onClick={() => enviarRegistroAGoogleSheets(productos)}
                    disabled={isSyncing || !googleSheetsUrl}
                    className="flex items-center gap-2 px-4 py-2.5 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-300 text-white rounded-2xl text-xs font-bold shadow-sm transition-all"
                  >
                    Subir mi versión local a la Nube
                  </button>
                </div>

                {syncError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-800 flex items-start gap-2">
                    <Info className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{syncError}</span>
                  </div>
                )}

                {syncSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                    <span>Conexión probada de manera exitosa. ¡Todo listo!</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-[#FFFDF9] border border-pink-100 p-6 rounded-3xl shadow-sm">
              <h3 className="font-serif text-2xl font-bold text-amber-900 mb-2 flex items-center gap-2">
                🔑 Panel de Control para los Padres
              </h3>
              <p className="text-sm text-amber-950/70 mb-4">
                Si eres el creador de la lista, ingresa aquí para poder agregar nuevos productos sugeridos, eliminarlos, o reiniciar la lista de demostración.
              </p>

              {!isAdmin ? (
                <div className="flex gap-2">
                  <input 
                    type="password" 
                    placeholder="Escribe 'elizabeth2026' para activar"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="px-4 py-2.5 rounded-2xl bg-amber-50/30 border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                  <button
                    onClick={() => {
                      if (adminPassword === 'elizabeth2026') {
                        setIsAdmin(true);
                        mostrarAlerta("¡Acceso como administrador concedido! 🪄");
                      } else {
                        mostrarAlerta("Contraseña incorrecta. Pista: 'elizabeth2026'", "error");
                      }
                    }}
                    className="px-5 py-2.5 bg-amber-900 text-white font-bold rounded-2xl text-xs"
                  >
                    Ingresar
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="p-3 bg-pink-50 border border-pink-200 rounded-2xl text-xs text-pink-900 flex justify-between items-center">
                    <span>🔓 Modo de Edición Activado (Ahora puedes borrar artículos en el catálogo)</span>
                    <button onClick={() => setIsAdmin(false)} className="underline font-bold">Salir de Admin</button>
                  </div>

                  <form onSubmit={crearProductoAdmin} className="bg-amber-50/30 p-5 rounded-3xl border border-amber-200/50 space-y-4">
                    <h4 className="font-serif text-lg font-bold text-amber-950">Agregar Nuevo Regalo Recomendado</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-amber-900 mb-1">Nombre del artículo</label>
                        <input 
                          type="text" 
                          placeholder="Ej. Tina plegable de baño"
                          value={nuevoProducto.titulo}
                          onChange={(e) => setNuevoProducto({...nuevoProducto, titulo: e.target.value})}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-amber-200 text-sm"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-amber-900 mb-1">Categoría</label>
                        <select
                          value={nuevoProducto.categoria}
                          onChange={(e) => setNuevoProducto({...nuevoProducto, categoria: e.target.value})}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-amber-200 text-sm"
                        >
                          <option value="Ropa">Ropa</option>
                          <option value="Decoración">Decoración</option>
                          <option value="Lactancia">Lactancia</option>
                          <option value="Juguetes">Juguetes</option>
                          <option value="Higiene">Higiene</option>
                          <option value="Otros">Otros</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-amber-900 mb-1">Cantidad Necesitada</label>
                        <input 
                          type="number" 
                          min="1"
                          max="20"
                          value={nuevoProducto.cantidadNecesitada}
                          onChange={(e) => setNuevoProducto({...nuevoProducto, cantidadNecesitada: e.target.value})}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-amber-200 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-amber-900 mb-1">Enlace de sugerencia (Opcional)</label>
                        <input 
                          type="url" 
                          placeholder="https://amazon.com/..."
                          value={nuevoProducto.enlace}
                          onChange={(e) => setNuevoProducto({...nuevoProducto, enlace: e.target.value})}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-amber-200 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-amber-900 mb-1">Icono Representativo</label>
                        <select
                          value={nuevoProducto.imagenTipo}
                          onChange={(e) => setNuevoProducto({...nuevoProducto, imagenTipo: e.target.value})}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-amber-200 text-sm"
                        >
                          <option value="ropa">Ropa / Zapatos</option>
                          <option value="decoracion">Luz / Decoración / Cunas</option>
                          <option value="lactancia">Mamaderas / Biberones / Alimentación</option>
                          <option value="juguetes">Gimnasios / Sonajeros / Peluches</option>
                          <option value="higiene">Toallitas / Pañales / Bañeras</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-amber-900 mb-1">Prioridad</label>
                        <select
                          value={nuevoProducto.prioridad}
                          onChange={(e) => setNuevoProducto({...nuevoProducto, prioridad: e.target.value})}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-amber-200 text-sm"
                        >
                          <option value="Baja">Baja</option>
                          <option value="Media">Media</option>
                          <option value="Alta">Alta (Destacado)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-amber-900 mb-1">Breve descripción / Notas útiles</label>
                      <textarea 
                        rows="2"
                        placeholder="Escribe detalles de colores, tallas o cualquier especificación importante..."
                        value={nuevoProducto.descripcion}
                        onChange={(e) => setNuevoProducto({...nuevoProducto, descripcion: e.target.value})}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-amber-200 text-sm"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-2.5 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-2xl text-xs shadow-sm transition-all"
                    >
                      Añadir Regalo Recomendado ✨
                    </button>
                  </form>

                  <div className="flex justify-between items-center border-t border-rose-100 pt-4">
                    <span className="text-xs text-amber-900/60">Controles de fábrica:</span>
                    <button 
                      onClick={restaurarDemo}
                      className="text-xs text-red-600 hover:text-red-800 underline font-bold"
                    >
                      Restaurar valores de de demostración
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* ================= MODAL DE REGALOS ================= */}
      {productoSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-amber-950/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FFFDF9] border-2 border-pink-200 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-scale-up">
            
            <div className="bg-gradient-to-r from-pink-100 to-pink-50 p-6 border-b border-pink-200 flex justify-between items-center relative">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-pink-600" />
                <h3 className="font-serif text-xl font-bold text-amber-950">¡Elegir un regalo!</h3>
              </div>
              <button 
                onClick={() => setProductoSeleccionado(null)}
                className="text-amber-900/40 hover:text-amber-950 text-2xl font-bold font-mono transition-colors"
              >
                &times;
              </button>
            </div>

            <form onSubmit={confirmarRegalo} className="p-6 space-y-4">
              <div className="bg-pink-50/50 p-4 rounded-2xl border border-pink-100/50">
                <h4 className="text-xs font-bold uppercase text-amber-900/60">Artículo Seleccionado</h4>
                <p className="font-serif text-base font-bold text-amber-950 mt-1">{productoSeleccionado.titulo}</p>
                <p className="text-xs text-amber-900/70 mt-1">{productoSeleccionado.descripcion}</p>
                
                <div className="mt-3 flex gap-4 text-xs font-bold text-amber-950">
                  <span>Requeridos: {productoSeleccionado.cantidadNecesitada}</span>
                  <span className="text-pink-600">Ya reservados: {productoSeleccionado.cantidadReservada}</span>
                  <span className="text-emerald-700">Quedan: {productoSeleccionado.cantidadNecesitada - productoSeleccionado.cantidadReservada}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-900/80 uppercase tracking-wider mb-1.5">
                  ¿Cuántas unidades vas a obsequiar?
                </label>
                <div className="flex items-center gap-3">
                  <select 
                    value={cantidadRegalo}
                    onChange={(e) => setCantidadRegalo(parseInt(e.target.value))}
                    className="w-24 px-3 py-2 rounded-xl bg-amber-50/50 border border-amber-200 text-sm font-semibold text-amber-950 focus:ring-2 focus:ring-pink-300 focus:outline-none"
                  >
                    {Array.from({ length: productoSeleccionado.cantidadNecesitada - productoSeleccionado.cantidadReservada }, (_, i) => i + 1).map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                  <span className="text-xs text-amber-900/60">
                    (Selecciona del listado. El restante seguirá disponible para otros invitados).
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-900/80 uppercase tracking-wider mb-1.5">
                  Tu nombre completo <span className="text-pink-500">*</span>
                </label>
                <input 
                  type="text" 
                  placeholder="Ej. Tía Mercedes o Familia Torres García"
                  value={nombreDonante}
                  onChange={(e) => setNombreDonante(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-amber-50/20 border border-amber-200 text-sm focus:ring-2 focus:ring-pink-300 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-900/80 uppercase tracking-wider mb-1.5">
                  Dedicatoria o Mensaje especial (Opcional)
                </label>
                <textarea 
                  rows="3"
                  placeholder="¡Escribe una tierna nota para Elizabeth y los futuros padres!"
                  value={mensajeDonante}
                  onChange={(e) => setMensajeDonante(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-amber-50/20 border border-amber-200 text-sm focus:ring-2 focus:ring-pink-300 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setProductoSeleccionado(null)}
                  className="w-1/3 py-3 rounded-xl border border-amber-200 text-amber-900 text-xs font-bold hover:bg-amber-50/50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="w-2/3 py-3 bg-pink-500 hover:bg-pink-600 active:bg-pink-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Gift className="w-4 h-4" /> Registrar mi Regalo 🌸
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* --- PIE DE PÁGINA --- */}
      <footer className="bg-gradient-to-t from-pink-100 to-[#FFF0F2] border-t border-pink-200 py-12 px-4 mt-16 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 mx-auto">
            <IlustracionTarroMiel />
          </div>
          <h4 className="font-serif text-lg font-bold text-amber-900">Elizabeth's Baby Shower</h4>
          <p className="text-xs text-amber-900/60 leading-relaxed">
            Diseño inspirado en el Bosque de los 100 Acres, abejitas silvestres y tonos de miel dulce. Hecho con amor para dar la bienvenida a la pequeña Elizabeth en el año 2026.
          </p>
          <div className="pt-2 flex justify-center gap-4 text-xs font-semibold text-pink-600/70">
            <span>🌸 Rosas Pastel</span>
            <span>🐝 Abejitas Dulces</span>
            <span>🧸 Winnie the Pooh Style</span>
          </div>
        </div>
      </footer>

    </div>
  );
}