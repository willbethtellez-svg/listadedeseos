# Contexto del Proyecto: Wishlist de Baby Shower para Elizabeth

**Descripción General:**
Aplicación web interactiva tipo "Single-Page Application" (SPA) diseñada para gestionar la lista de regalos de un Baby Shower. La estética está inspirada en "El Bosque de los 100 Acres" (Winnie the Pooh) adaptada con una paleta de colores rosa pastel y crema para una niña llamada Elizabeth.

**Pila Tecnológica:**
- **Frontend:** React, Tailwind CSS para el diseño responsivo.
- **Iconografía:** Lucide React.
- **Gráficos:** Ilustraciones vectoriales personalizadas y animadas en SVG nativo (abejas, tarros de miel y ramas decorativas).
- **Base de Datos / Persistencia:** Sistema híbrido. Utiliza `localStorage` de forma local y ofrece un módulo integrado de sincronización HTTP (GET/POST) compatible con Google Sheets (vía Google Apps Script) o Supabase REST.

**Funcionalidades Clave:**
1. **Catálogo de Regalos Interactivo:** Permite buscar y filtrar productos por categorías (Ropa, Decoración, Lactancia, Juguetes, Higiene, etc.) y nivel de prioridad.
2. **Reserva Inteligente de Cantidades:** Si un producto requiere múltiples unidades (ej. 4 paquetes de pañales), un invitado puede seleccionar regalar solo 1 o 2. El sistema descuenta esa cantidad y mantiene el resto disponible para otros invitados en tiempo real.
3. **Muro de Dedicatorias:** Al reservar un regalo, el invitado registra su nombre y una dedicatoria, las cuales se consolidan de forma dinámica en una sección tipo "Libro de visitas".
4. **Acceso de Administrador Discreto:** Se accede mediante un icono de engranaje (Settings) flotante en la esquina superior derecha. Está protegido con la contraseña `elizabeth2026` y permite a los padres:
   - Añadir nuevos regalos recomendados con sus especificaciones y enlaces de compra.
   - Eliminar artículos del catálogo.
   - Configurar y probar el endpoint de sincronización en la nube.
   - Restaurar el catálogo a los datos de demostración de fábrica.