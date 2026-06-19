const PRODUCTOS_INICIALES = [
  {
    id: "prod-1",
    titulo: "Mamelucos Rosas con Orejitas de Piglet",
    categoria: "Ropa",
    descripcion: "Hermosos mamelucos de algodón orgánico, ultra suaves y perfectos para el clima templado del bosque.",
    enlace: "https://example.com/mameluco-piglet",
    cantidadNecesitada: 3,
    cantidadReservada: 1,
    imagenTipo: "ropa",
    prioridad: "Alta",
    regalos: [{ donante: "Tía Martha", cantidad: 1, mensaje: "¡No puedo esperar para ver a la princesa vestida de Piglet!" }]
  },
  {
    id: "prod-2",
    titulo: "Lámpara de Noche 'Globo de Pooh'",
    categoria: "Decoración",
    descripcion: "Lámpara recargable que proyecta estrellas suaves en tonos pastel. Diseño exclusivo del globo de helio rosa.",
    enlace: "https://example.com/lampara-globo",
    cantidadNecesitada: 1,
    cantidadReservada: 0,
    imagenTipo: "decoracion",
    prioridad: "Media",
    regalos: []
  },
  {
    id: "prod-3",
    titulo: "Extractor de Leche Eléctrico Silencioso",
    categoria: "Lactancia",
    descripcion: "Práctico, portátil y súper silencioso para mayor comodidad de la mamá.",
    enlace: "https://example.com/extractor-leche",
    cantidadNecesitada: 1,
    cantidadReservada: 1,
    imagenTipo: "lactancia",
    prioridad: "Alta",
    regalos: [{ donante: "Abuelita Elena", cantidad: 1, mensaje: "Con todo mi amor para mi hija y mi futura nieta." }]
  },
  {
    id: "prod-4",
    titulo: "Gimnasio de Actividades del Bosque",
    categoria: "Juguetes",
    descripcion: "Tapete acolchado con temática de árboles, animalitos colgantes con sonido y un espejo de seguridad.",
    enlace: "https://example.com/gimnasio-bosque",
    cantidadNecesitada: 1,
    cantidadReservada: 0,
    imagenTipo: "juguetes",
    prioridad: "Media",
    regalos: []
  },
  {
    id: "prod-5",
    titulo: "Pañales Ecológicos Reutilizables (Kit de 6)",
    categoria: "Higiene",
    descripcion: "Pañales de tela ajustables con bellos patrones florales y de abejitas silvestres.",
    enlace: "https://example.com/panales-eco",
    cantidadNecesitada: 4,
    cantidadReservada: 2,
    imagenTipo: "higiene",
    prioridad: "Alta",
    regalos: [
      { donante: "Prima Sofía", cantidad: 1, mensaje: "¡Cuidando el planeta para la nueva exploradora!" },
      { donante: "Carlos & Ana", cantidad: 1, mensaje: "Un gran abrazo para los futuros papás." }
    ]
  },
  {
    id: "prod-6",
    titulo: "Set de Biberones Anticólicos de Cristal",
    categoria: "Lactancia",
    descripcion: "Set de 3 biberones con tetina similar al pecho materno, decorados con ramitas de lavanda.",
    enlace: "https://example.com/biberones-cristal",
    cantidadNecesitada: 2,
    cantidadReservada: 0,
    imagenTipo: "lactancia",
    prioridad: "Media",
    regalos: []
  },
  {
    id: "prod-7",
    titulo: "Cojín de Lactancia 'Nube de Miel'",
    categoria: "Lactancia",
    descripcion: "Cojín ergonómico con funda lavable súper suave de color rosa pastel.",
    enlace: "https://example.com/cojin-lactancia",
    cantidadNecesitada: 1,
    cantidadReservada: 0,
    imagenTipo: "lactancia",
    prioridad: "Baja",
    regalos: []
  },
  {
    id: "prod-8",
    titulo: "Toallitas Húmedas de Bambú Biodegradables",
    categoria: "Higiene",
    descripcion: "Paquete de 12 unidades de toallitas hipoalergénicas sin fragancia.",
    enlace: "https://example.com/toallitas-bambu",
    cantidadNecesitada: 6,
    cantidadReservada: 1,
    imagenTipo: "higiene",
    prioridad: "Media",
    regalos: [{ donante: "Vecina Clara", cantidad: 1, mensaje: "¡Muchas bendiciones!" }]
  }
];

export default PRODUCTOS_INICIALES;
