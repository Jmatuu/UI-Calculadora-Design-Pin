import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { COLORS, PIXEL } from '../constants/theme';

export type CloudVariant = 'a' | 'b';

/**
 * Nubes pixeladas dibujadas con Views (sin imágenes).
 * Cada carácter del bitmap es 1 píxel: 'X' = relleno, '.' = vacío.
 * La silueta es "esponjosa": bultos redondeados arriba y base plana.
 */
const CLOUD_MAPS: Record<CloudVariant, readonly string[]> = {
  // Nube grande: 20 x 5
  a: [
    '...XXXX......XXXX...',
    '..XXXXXXXXXXXXXXXX..',
    '.XXXXXXXXXXXXXXXXXX.',
    'XXXXXXXXXXXXXXXXXXXX',
    'XXXXXXXXXXXXXXXXXXXX',
  ],
  // Nube mediana: 16 x 5
  b: [
    '.....XXXXXX.....',
    '...XXXXXXXXXX...',
    '..XXXXXXXXXXXX..',
    '.XXXXXXXXXXXXXX.',
    'XXXXXXXXXXXXXXXX',
  ],
};

type CloudProps = {
  variant?: CloudVariant;
  /** Multiplica el tamaño del píxel */
  scale?: number;
  /** Dibuja la sombra desplazada un píxel hacia abajo */
  shadow?: boolean;
  style?: StyleProp<ViewStyle>;
};

type Run = {
  key: string;
  width: number;
  /** Hueco en píxeles que hay que dejar antes del tramo (los '.' iniciales) */
  offset: number;
};

/**
 * Convierte el bitmap en filas de tramos horizontales contiguos.
 * Fusionar los tramos reduce de ~60 Views a ~7 por nube.
 * `offset` conserva la posición horizontal de cada tramo dentro de la fila.
 */
function buildRuns(map: readonly string[], unit: number): Run[][] {
  return map.map((row, rowIndex) => {
    const runs: Run[] = [];
    let start = -1;
    let cursor = 0;

    for (let col = 0; col <= row.length; col += 1) {
      const filled = col < row.length && row[col] === 'X';

      if (filled && start === -1) start = col;

      if (!filled && start !== -1) {
        runs.push({
          key: `${rowIndex}-${start}`,
          width: (col - start) * unit,
          offset: (start - cursor) * unit,
        });
        cursor = col;
        start = -1;
      }
    }

    return runs;
  });
}

export function Cloud({ variant = 'a', scale = 1, shadow = true, style }: CloudProps) {
  const map = CLOUD_MAPS[variant];
  const unit = PIXEL * scale;
  const runs = buildRuns(map, unit);

  const width = Math.max(...map.map((row) => row.length)) * unit;
  const height = map.length * unit;

  const renderLayer = (color: string, topOffset: number) => (
    <View style={[styles.layer, { top: topOffset, width, height }]}>
      {runs.map((rowRuns, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {rowRuns.map((run) => (
            <View
              key={run.key}
              style={{
                width: run.width,
                height: unit,
                marginLeft: run.offset,
                backgroundColor: color,
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );

  return (
    <View style={[styles.container, { width, height: height + (shadow ? unit : 0) }, style]}>
      {shadow ? renderLayer(COLORS.cloudShadow, unit) : null}
      {renderLayer(COLORS.cloud, 0)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  layer: {
    position: 'absolute',
    left: 0,
  },
  row: {
    flexDirection: 'row',
  },
});
