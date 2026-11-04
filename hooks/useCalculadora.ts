import { useCallback, useState } from 'react';

type Operador = '+' | '-' | '×' | '÷';

type EstadoCalculadora = {
  pantalla: string;
  operandos: number[];
  operadores: Operador[];
  expresion: string;
  nuevaEntrada: boolean;
  resultadoMostrado: boolean;
  error: string | null;
};

const ESTADO_INICIAL: EstadoCalculadora = {
  pantalla: '0',
  operandos: [],
  operadores: [],
  expresion: '',
  nuevaEntrada: true,
  resultadoMostrado: false,
  error: null,
};

function formatearNumero(valor: number): string {
  if (valor === 0) return '0';
  return Number(valor.toPrecision(12)).toString();
}

function esOperador(label: string): label is Operador {
  return label === '+' || label === '-' || label === '×' || label === '÷';
}

function calcular(
  anterior: number,
  actual: number,
  operador: Operador
): number | null {
  if (operador === '÷' && actual === 0) return null;

  let resultado: number;
  switch (operador) {
    case '+':
      resultado = anterior + actual;
      break;
    case '-':
      resultado = anterior - actual;
      break;
    case '×':
      resultado = anterior * actual;
      break;
    case '÷':
      resultado = anterior / actual;
      break;
  }

  return Number.isFinite(resultado) ? Number(resultado.toPrecision(12)) : null;
}

function estadoDeError(mensaje: string, expresion = ''): EstadoCalculadora {
  return {
    ...ESTADO_INICIAL,
    pantalla: 'Error',
    expresion,
    error: mensaje,
  };
}

function reemplazarTerminoActual(expresion: string, anterior: string, nuevo: string) {
  if (!anterior || !expresion.endsWith(anterior)) return expresion;
  return `${expresion.slice(0, -anterior.length)}${nuevo}`;
}

function procesarTecla(
  estado: EstadoCalculadora,
  label: string,
  maxCaracteres: number
): EstadoCalculadora {
  if (label === 'AC') return ESTADO_INICIAL;

  if (/^\d$/.test(label)) {
    if (estado.error || estado.resultadoMostrado) {
      return {
        ...ESTADO_INICIAL,
        pantalla: label,
        nuevaEntrada: false,
      };
    }

    if (estado.nuevaEntrada) {
      return {
        ...estado,
        pantalla: label,
        expresion:
          estado.operadores.length > 0
            ? estado.expresion + label
            : estado.expresion,
        nuevaEntrada: false,
      };
    }

    if (estado.pantalla.length >= maxCaracteres) return estado;

    const pantalla =
      estado.pantalla === '0' ? label : estado.pantalla + label;
    const agregarDigito = estado.operadores.length > 0;
    return {
      ...estado,
      pantalla,
      expresion: agregarDigito ? estado.expresion + label : estado.expresion,
    };
  }

  if (label === '.') {
    if (estado.error || estado.resultadoMostrado) {
      return {
        ...ESTADO_INICIAL,
        pantalla: '0.',
        nuevaEntrada: false,
      };
    }

    if (estado.nuevaEntrada) {
      if (maxCaracteres < 2) return estado;
      return {
        ...estado,
        pantalla: '0.',
        expresion:
          estado.operadores.length > 0
            ? estado.expresion + '0.'
            : estado.expresion,
        nuevaEntrada: false,
      };
    }

    if (estado.pantalla.includes('.') || estado.pantalla.length >= maxCaracteres) {
      return estado;
    }

    return {
      ...estado,
      pantalla: estado.pantalla + '.',
      expresion:
        estado.operadores.length > 0
          ? estado.expresion + '.'
          : estado.expresion,
    };
  }

  if (estado.error) return estado;

  if (label === '±' || label === '%') {
    const valorActual = Number(estado.pantalla);
    const pantalla =
      label === '%'
        ? formatearNumero(valorActual / 100)
        : valorActual === 0
          ? estado.pantalla.replace(/^-/, '')
          : estado.pantalla.startsWith('-')
            ? estado.pantalla.slice(1)
            : `-${estado.pantalla}`;

    return {
      ...estado,
      pantalla,
      expresion:
        estado.operadores.length > 0 && !estado.nuevaEntrada
          ? reemplazarTerminoActual(estado.expresion, estado.pantalla, pantalla)
          : estado.expresion,
      nuevaEntrada: false,
    };
  }

  if (esOperador(label)) {
    if (estado.resultadoMostrado) {
      return {
        ...estado,
        operandos: [Number(estado.pantalla)],
        operadores: [label],
        expresion: `${estado.pantalla}${label}`,
        nuevaEntrada: true,
        resultadoMostrado: false,
      };
    }

    if (
      estado.nuevaEntrada &&
      estado.operadores.length > 0 &&
      estado.operandos.length === estado.operadores.length
    ) {
      const operadores = [...estado.operadores];
      operadores[operadores.length - 1] = label;
      return {
        ...estado,
        operadores,
        expresion: `${estado.expresion.slice(0, -1)}${label}`,
      };
    }

    const operadorInicial = estado.operadores.length === 0;
    return {
      ...estado,
      operandos: [...estado.operandos, Number(estado.pantalla)],
      operadores: [...estado.operadores, label],
      expresion: operadorInicial
        ? `${estado.pantalla}${label}`
        : `${estado.expresion}${label}`,
      nuevaEntrada: true,
      resultadoMostrado: false,
    };
  }

  if (label === '=' && estado.operadores.length > 0) {
    const ultimoOperando = estado.nuevaEntrada
      ? estado.operandos[estado.operandos.length - 1]
      : Number(estado.pantalla);
    const operandos =
      estado.operandos.length === estado.operadores.length
        ? [...estado.operandos, ultimoOperando]
        : estado.operandos;

    const operandosReducidos = [operandos[0]];
    const operadoresReducidos: Operador[] = [];

    for (let index = 0; index < estado.operadores.length; index += 1) {
      const operador = estado.operadores[index];
      const siguienteOperando = operandos[index + 1];

      if (operador === '×' || operador === '÷') {
        const ultimoIndice = operandosReducidos.length - 1;
        const resultado = calcular(
          operandosReducidos[ultimoIndice],
          siguienteOperando,
          operador
        );
        if (resultado === null) {
          return estadoDeError(
            'Operación no válida',
            `${estado.expresion}${estado.nuevaEntrada ? formatearNumero(ultimoOperando) : ''}=`
          );
        }
        operandosReducidos[ultimoIndice] = resultado;
      } else {
        operadoresReducidos.push(operador);
        operandosReducidos.push(siguienteOperando);
      }
    }

    let resultado = operandosReducidos[0];
    for (let index = 0; index < operadoresReducidos.length; index += 1) {
      const siguiente = calcular(
        resultado,
        operandosReducidos[index + 1],
        operadoresReducidos[index]
      );
      if (siguiente === null) {
        return estadoDeError(
          'Operación no válida',
          `${estado.expresion}${estado.nuevaEntrada ? formatearNumero(ultimoOperando) : ''}=`
        );
      }
      resultado = siguiente;
    }

    const expresion =
      `${estado.expresion}${estado.nuevaEntrada ? formatearNumero(ultimoOperando) : ''}=`;
    return {
      pantalla: formatearNumero(resultado),
      operandos: [],
      operadores: [],
      expresion,
      nuevaEntrada: true,
      resultadoMostrado: true,
      error: null,
    };
  }

  return estado;
}

export function useCalculadora(maxCaracteres: number) {
  const [estado, setEstado] = useState<EstadoCalculadora>(ESTADO_INICIAL);

  const presionarBoton = useCallback(
    (label: string) => {
      setEstado((actual) => procesarTecla(actual, label, maxCaracteres));
    },
    [maxCaracteres]
  );

  return {
    pantalla: estado.pantalla,
    operacionMostrada: estado.expresion,
    error: estado.error,
    presionarBoton,
  };
}
