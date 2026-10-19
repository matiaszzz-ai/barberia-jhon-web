// BARBERÍA Y PELUQUERÍA JHON — Datos editables.
// Cambia precios aquí cuando se actualicen. "desde: true" muestra "Desde $...".
window.JHON = {
  nombre: 'Barbería y Peluquería Jhon',
  color: '#7107AF',
  whatsapp: '', // Pendiente: escribir número internacional sin + (ejemplo 5939XXXXXXXX).
  direccion: 'Av. Jorge Garcés y Francisco Reboledo, Comité del Pueblo, Quito',
  equipo: [
    {id:'edinsson', nombre:'Edinsson', foto:'assets/edinsson.webp'},
    {id:'manuel', nombre:'Manuel', foto:'assets/manuel.webp'},
    {id:'jhon', nombre:'Jhon', foto:'assets/jhon.webp'},
    {id:'kevin', nombre:'Kevin', foto:'assets/kevin.webp'},
    {id:'manuel-2', nombre:'Manuel', foto:'assets/manuel-2.webp'}
  ],
  categorias: [
    {id:'barberia', nombre:'Barbería', codigo:'01'},
    {id:'damas', nombre:'Peluquería dama', codigo:'02'},
    {id:'color', nombre:'Color & mechas', codigo:'03'},
    {id:'unas', nombre:'Uñas', codigo:'04'},
    {id:'extras', nombre:'Trenzas & belleza', codigo:'05'}
  ],
  servicios: [
    {id:'corte-clasico',cat:'barberia',nombre:'Corte clásico',precio:5},
    {id:'corte-sombreado',cat:'barberia',nombre:'Corte sombreado',precio:5.5},
    {id:'sombreado-ceja',cat:'barberia',nombre:'Corte sombreado + ceja',precio:6.5},
    {id:'corte-completo',cat:'barberia',nombre:'Corte completo',detalle:'Corte + barba + ceja',precio:8.5},
    {id:'corte-barba',cat:'barberia',nombre:'Corte + barba',precio:7.5},
    {id:'depilacion-barba',cat:'barberia',nombre:'Depilación de barba',precio:3.5},
    {id:'depilacion-ceja',cat:'barberia',nombre:'Depilación de ceja',precio:3},
    {id:'disenos-lineas',cat:'barberia',nombre:'Diseños / líneas',precio:2.5,desde:true},
    {id:'combo-black',cat:'barberia',nombre:'Corte + ceja + mascarilla negra',detalle:'Mascarilla negra en todo el rostro',precio:10},
    {id:'vip',cat:'barberia',nombre:'Corte VIP',detalle:'Limpieza facial + corte + ceja',precio:25},
    {id:'corte-recto',cat:'damas',nombre:'Corte recto',precio:6},
    {id:'corte-v',cat:'damas',nombre:'Corte en V',precio:7},
    {id:'corte-capas',cat:'damas',nombre:'Corte en capas',precio:8,desde:true},
    {id:'repolarizacion',cat:'damas',nombre:'Repolarización',precio:20,desde:true},
    {id:'botox-capilar',cat:'damas',nombre:'Bótox capilar',precio:40,desde:true},
    {id:'keratina',cat:'damas',nombre:'Keratina',precio:90,desde:true},
    {id:'balayage',cat:'color',nombre:'Balayage',precio:120,desde:true},
    {id:'mechas-dama',cat:'color',nombre:'Mechas para dama',precio:100,desde:true},
    {id:'semipermanente-caballero',cat:'color',nombre:'Semipermanente caballero',detalle:'Incluye corte de cabello',precio:45,desde:true},
    {id:'rayitos-caballero',cat:'color',nombre:'Rayitos para caballero',precio:45,desde:true},
    {id:'platinado',cat:'color',nombre:'Platinado completo caballero',detalle:'Incluye corte de cabello',precio:70,desde:true},
    {id:'unas-acrilicas',cat:'unas',nombre:'Uñas acrílicas',precio:16,desde:true},
    {id:'unas-polygel',cat:'unas',nombre:'Uñas en polygel',precio:18},
    {id:'unas-semipermanente',cat:'unas',nombre:'Uñas semipermanentes',precio:14,desde:true},
    {id:'manicure',cat:'unas',nombre:'Manicure sencillo',precio:6},
    {id:'pedicure',cat:'unas',nombre:'Pedicure',precio:7,desde:true},
    {id:'trenzas-dama',cat:'extras',nombre:'Trenzas africanas dama',precio:65,desde:true},
    {id:'trenzas-caballero',cat:'extras',nombre:'Trenzas corridas caballero',detalle:'Incluye corte de cabello',precio:45},
    {id:'puesta-tension',cat:'extras',nombre:'Puesta de extensión / tensión',detalle:'Precio por unidad (nombre por confirmar)',precio:1.5},
    {id:'pestanas',cat:'extras',nombre:'Pestañas',precio:12,desde:true},
    {id:'pigmentacion-cejas',cat:'extras',nombre:'Pigmentación de cejas',precio:12}
  ],
  tienda: [
    {id:'perfumes',nombre:'Perfumes',familia:'FRAGANCIAS',sub:'Árabes · diseñador y más',icono:'perfume'},
    {id:'ceras',nombre:'Ceras',familia:'STYLING',sub:'Fijación y acabado',icono:'jar'},
    {id:'planchas',nombre:'Planchas',familia:'HERRAMIENTAS',sub:'Herramientas de peinado',icono:'iron'},
    {id:'polvos',nombre:'Polvos de textura',familia:'STYLING',sub:'Textura y volumen',icono:'powder'},
    {id:'valkin',nombre:'Valkin',familia:'CUIDADO CORPORAL',sub:'Cremas corporales perfumadas',icono:'lotion'},
    {id:'secadoras',nombre:'Secadoras',familia:'HERRAMIENTAS',sub:'Equipos para el cabello',icono:'dryer'}
  ]
};
