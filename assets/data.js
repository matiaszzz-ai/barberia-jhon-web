// BARBERÍA Y PELUQUERÍA JHON — Datos editables.
// Cambia precios aquí cuando se actualicen. "desde: true" muestra "Desde $...".
window.JHON = {
  nombre: 'Barbería y Peluquería Jhon',
  color: '#7107AF',
  whatsapp: '593962932993', // Contacto público de la barbería; mantener actualizado.
  direccion: 'Av. Jorge Garcés y Francisco Reboledo, Comité del Pueblo, Quito',
  horarios: {
    '0': {inicio:'08:30', fin:'19:00'}, // Domingo
    '1': {inicio:'09:00', fin:'20:00'}, // Lunes
    '2': {inicio:'09:00', fin:'20:00'}, // Martes
    '3': {inicio:'09:00', fin:'20:00'}, // Miércoles
    '4': {inicio:'09:00', fin:'20:00'}, // Jueves
    '5': {inicio:'08:30', fin:'20:00'}, // Viernes
    '6': {inicio:'08:30', fin:'20:00'}  // Sábado
  },
  equipo: [
    {id:'edinsson', nombre:'Edinsson', foto:'assets/edinsson.webp'},
    {id:'andy', nombre:'Andy', foto:'assets/manuel.webp'},
    {id:'jhon', nombre:'Jhon', foto:'assets/jhon.webp'},
    {id:'kevin', nombre:'Kevin', foto:'assets/kevin.webp'},
    {id:'manuel-2', nombre:'Manuel', foto:'assets/manuel-2.webp'}
  ],
  categorias: [
    {id:'cortes', nombre:'Cortes', codigo:'01'},
    {id:'barba', nombre:'Barba y cejas', codigo:'02'},
    {id:'premium', nombre:'Servicios premium', codigo:'03'},
    {id:'color', nombre:'Color masculino', codigo:'04'},
    {id:'estilo', nombre:'Diseños y trenzas', codigo:'05'}
  ],
  // Exclusivamente servicios de caballero.
  servicios: [
    {id:'corte-clasico',cat:'cortes',nombre:'Corte clásico',precio:5},
    {id:'corte-sombreado',cat:'cortes',nombre:'Corte sombreado',precio:5.5},
    {id:'sombreado-ceja',cat:'cortes',nombre:'Corte sombreado + ceja',precio:6.5},
    {id:'corte-completo',cat:'cortes',nombre:'Corte completo',detalle:'Corte + barba + ceja',precio:8.5},
    {id:'corte-barba',cat:'cortes',nombre:'Corte + barba',precio:7.5},
    {id:'depilacion-barba',cat:'barba',nombre:'Depilación de barba',precio:3.5},
    {id:'depilacion-ceja',cat:'barba',nombre:'Depilación de ceja',precio:3},
    {id:'combo-black',cat:'premium',nombre:'Corte + ceja + mascarilla negra',detalle:'Mascarilla negra en todo el rostro',precio:10},
    {id:'vip',cat:'premium',nombre:'Corte VIP',detalle:'Limpieza facial + corte + ceja',precio:25},
    {id:'limpieza-facial',cat:'premium',nombre:'Limpieza facial',precio:10},
    {id:'semipermanente-caballero',cat:'color',nombre:'Semipermanente caballero',detalle:'Incluye corte de cabello',precio:45,desde:true},
    {id:'rayitos-caballero',cat:'color',nombre:'Rayitos para caballero',precio:45,desde:true},
    {id:'platinado',cat:'color',nombre:'Platinado completo caballero',detalle:'Incluye corte de cabello',precio:70,desde:true},
    {id:'disenos-lineas',cat:'estilo',nombre:'Diseños / líneas',precio:2.5,desde:true},
    {id:'trenzas-caballero',cat:'estilo',nombre:'Trenzas corridas caballero',detalle:'Incluye corte de cabello',precio:45}
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
