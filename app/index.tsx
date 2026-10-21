import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Display } from '../components/Display';
import { PixelButton } from '../components/PixelButton';
import { COLORS, KEYPAD_ROWS, LAYOUT } from '../constants/theme';

/**
 * UI de calculadora retro pixel-art. Sin lógica: los botones no hacen nada.
 */
export default function CalculatorScreen() {
  const { width, height } = useWindowDimensions();

  // Ancho explícito de la celda (4 columnas) -> el botón descuenta el padding
  // de la celda y queda cuadrado.
  const cellWidth = (width - LAYOUT.keypadPadding * 2) / 4;

  // Alto del teclado = filas cuadradas + separaciones
  // (4 huecos entre filas + padding vertical del teclado).
  const keypadHeight = Math.min(
    cellWidth * KEYPAD_ROWS.length + LAYOUT.gap * KEYPAD_ROWS.length,
    height - LAYOUT.minDisplayHeight
  );

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <Display value="99.99" operation="10 + 89.99" />

      <View style={[styles.keypad, { height: keypadHeight }]}>
        {KEYPAD_ROWS.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.keyRow}>
            {row.map((key) => (
              <View
                key={key.label}
                style={[
                  styles.cell,
                  {
                    width: key.wide ? cellWidth * 2 : cellWidth,
                    height: cellWidth,
                  },
                ]}
              >
                <PixelButton label={key.label} />
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.sky,
  },
  keypad: {
    paddingHorizontal: LAYOUT.keypadPadding,
    paddingVertical: LAYOUT.gap / 2,
  },
  keyRow: {
    flexDirection: 'row',
  },
  cell: {
    padding: LAYOUT.gap / 2,
  },
});
