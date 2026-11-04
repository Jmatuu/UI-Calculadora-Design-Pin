import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useRef, useState } from 'react';

const STORAGE_KEY = '@ui-calculadora-design-pin/historial';
const MAX_OPERACIONES = 20;

export type OperacionHistorial = {
  id: string;
  expresion: string;
  resultado: string;
  fecha: number;
};

type CambioHistorial =
  | { tipo: 'agregar'; operacion: OperacionHistorial }
  | { tipo: 'eliminar'; id: string }
  | { tipo: 'borrar' };

function isOperacionHistorial(value: unknown): value is OperacionHistorial {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === 'string' &&
    typeof record.expresion === 'string' &&
    typeof record.resultado === 'string' &&
    typeof record.fecha === 'number' &&
    Number.isFinite(record.fecha)
  );
}

function leerOperaciones(serialized: string | null): OperacionHistorial[] {
  if (serialized === null) return [];

  const parsed: unknown = JSON.parse(serialized);
  if (!Array.isArray(parsed)) {
    throw new Error('El formato guardado del historial no es una lista.');
  }
  if (!parsed.every(isOperacionHistorial)) {
    throw new Error('El historial guardado contiene registros no válidos.');
  }
  return parsed.slice(0, MAX_OPERACIONES);
}

export function useHistorial() {
  const [operaciones, setOperaciones] = useState<OperacionHistorial[]>([]);
  const operacionesRef = useRef(operaciones);
  const hidratadoRef = useRef(false);
  const cambiosPendientesRef = useRef<CambioHistorial[]>([]);
  const idCounterRef = useRef(0);
  const writeQueueRef = useRef<Promise<void>>(Promise.resolve());

  const persistir = useCallback((next: OperacionHistorial[]) => {
    const serialized = JSON.stringify(next);
    writeQueueRef.current = writeQueueRef.current
      .then(() => AsyncStorage.setItem(STORAGE_KEY, serialized))
      .catch((error: unknown) => {
        console.warn('No se pudo guardar el historial de la calculadora.', error);
      });
  }, []);

  const actualizar = useCallback(
    (next: OperacionHistorial[], change: CambioHistorial) => {
      operacionesRef.current = next;
      setOperaciones(next);
      if (hidratadoRef.current) {
        persistir(next);
      } else {
        cambiosPendientesRef.current.push(change);
      }
    },
    [persistir]
  );

  useEffect(() => {
    let active = true;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((serialized) => {
        const persisted = leerOperaciones(serialized);
        if (!active) return;

        let loaded = persisted;
        for (const change of cambiosPendientesRef.current) {
          if (change.tipo === 'agregar') {
            loaded = [change.operacion, ...loaded].slice(0, MAX_OPERACIONES);
          } else if (change.tipo === 'eliminar') {
            loaded = loaded.filter((operation) => operation.id !== change.id);
          } else {
            loaded = [];
          }
        }

        hidratadoRef.current = true;
        operacionesRef.current = loaded;
        setOperaciones(loaded);
        if (cambiosPendientesRef.current.length > 0) persistir(loaded);
        cambiosPendientesRef.current = [];
      })
      .catch((error: unknown) => {
        console.warn('No se pudo cargar el historial de la calculadora.', error);
        if (active) {
          hidratadoRef.current = true;
          if (cambiosPendientesRef.current.length > 0) {
            persistir(operacionesRef.current);
            cambiosPendientesRef.current = [];
          }
        }
      });

    return () => {
      active = false;
    };
  }, [persistir]);

  const agregarOperacion = useCallback(
    (expresion: string, resultado: string) => {
      idCounterRef.current += 1;
      const operation: OperacionHistorial = {
        id: `${Date.now()}-${idCounterRef.current}`,
        expresion,
        resultado,
        fecha: Date.now(),
      };
      actualizar(
        [operation, ...operacionesRef.current].slice(0, MAX_OPERACIONES),
        { tipo: 'agregar', operacion: operation }
      );
    },
    [actualizar]
  );

  const eliminarOperacion = useCallback(
    (id: string) => {
      actualizar(
        operacionesRef.current.filter((operation) => operation.id !== id),
        { tipo: 'eliminar', id }
      );
    },
    [actualizar]
  );

  const borrarHistorial = useCallback(() => {
    actualizar([], { tipo: 'borrar' });
  }, [actualizar]);

  return {
    operaciones,
    agregarOperacion,
    eliminarOperacion,
    borrarHistorial,
  };
}
