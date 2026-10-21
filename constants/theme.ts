/**
 * Tokens de diseño de la calculadora retro pixel-art.
 * App SIN lógica: aquí solo hay paleta, métricas y la definición del teclado.
 */

export const COLORS = {
  /** Fondo azul cielo */
  sky: '#38B6E8',
  /** Variante profunda del cielo (línea de sombra del display) */
  skyDeep: '#1F6FA8',

  /** Nubes */
  cloud: '#FFFFFF',
  cloudShadow: '#B6DCF2',

  /** Botones */
  button: '#F5A623',
  bevelLight: '#FFD166',
  bevelDark: '#1A0E05',

  /** Puntitos negros de las esquinas */
  dot: '#1A1A1A',

  /** Etiquetas de los botones: naranja oscuro / café */
  label: '#7A3E00',
  labelShadow: '#3A1B00',

  /** Display */
  displayText: '#FFFFFF',
  displayLine: '#FFFFFF',
} as const;

/** Familia de la fuente (cargada en runtime con expo-font) */
export const FONT_FAMILY = 'PressStart2P_400Regular';

/** Unidad base del pixel-art, en dp. Todo múltiplo de este valor. */
export const PIXEL = 4;

export const LAYOUT = {
  /** Padding exterior de la pantalla */
  screenPadding: 16,
  /** Separación entre botones (GAP) */
  gap: 4,
  /** Grosor del bisel del botón */
  bevel: 4,
  /** Lado del puntito negro de las esquinas */
  dotSize: 5,
  /** Distancia del puntito respecto a la esquina del botón */
  dotInset: 8,

  /** Tipografía */
  labelFontSize: 18,
  operationFontSize: 14,
  /** Tamaño mínimo/máximo del número del display (se calcula según el ancho) */
  displayFontSizeMin: 20,
  displayFontSizeMax: 72,
  /** Fracción del ancho disponible que ocupa el número del display */
  displayWidthFill: 0.94,

  /** El display ocupa todo el espacio que sobra; el teclado tiene alto propio */
  displayFlex: 1,
  /** Alto mínimo que se le reserva al display en pantallas bajas */
  minDisplayHeight: 150,

  /** Padding exterior del teclado (deja que el borde de los botones quede a `screenPadding`) */
  keypadPadding: 14,
} as const;

export type KeyDef = {
  label: string;
  /** El botón ocupa 2 columnas */
  wide?: boolean;
};

/** 5 filas x 4 columnas. La última fila: [.] [0] [= (2 columnas)] */
export const KEYPAD_ROWS: readonly (readonly KeyDef[])[] = [
  [{ label: 'AC' }, { label: '±' }, { label: '%' }, { label: '÷' }],
  [{ label: '7' }, { label: '8' }, { label: '9' }, { label: '×' }],
  [{ label: '4' }, { label: '5' }, { label: '6' }, { label: '-' }],
  [{ label: '1' }, { label: '2' }, { label: '3' }, { label: '+' }],
  [{ label: '.' }, { label: '0' }, { label: '=' , wide: true }],
];
