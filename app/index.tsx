import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Display } from '../components/Display';
import { HistoryPanel } from '../components/HistoryPanel';
import { PixelButton } from '../components/PixelButton';
import { COLORS, FONT_FAMILY, KEYPAD_ROWS, LAYOUT } from '../constants/theme';
import { useCalculadora } from '../hooks/useCalculadora';
import { useHistorial } from '../hooks/useHistorial';

/**
 * UI de calculadora retro pixel-art.
 */
export default function CalculatorScreen() {
  const { width, height } = useWindowDimensions();
  const maxCaracteres = Math.max(
    1,
    Math.floor(
      ((width - LAYOUT.screenPadding * 2) * LAYOUT.displayWidthFill) /
        LAYOUT.displayFontSizeMin
    )
  );
  const {
    pantalla,
    operacionMostrada,
    ultimaOperacion,
    presionarBoton,
    restaurarOperacion,
  } = useCalculadora(maxCaracteres);
  const { operaciones, agregarOperacion, eliminarOperacion, borrarHistorial } =
    useHistorial();
  const [historialVisible, setHistorialVisible] = useState(false);
  const operacionGuardadaRef = useRef(ultimaOperacion);

  useEffect(() => {
    if (!ultimaOperacion || operacionGuardadaRef.current === ultimaOperacion) return;
    operacionGuardadaRef.current = ultimaOperacion;
    agregarOperacion(ultimaOperacion.expresion, ultimaOperacion.resultado);
  }, [ultimaOperacion, agregarOperacion]);

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

      <Display value={pantalla} operation={operacionMostrada} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Abrir historial de operaciones"
        onPress={() => setHistorialVisible(true)}
        style={styles.historyToggle}
      >
        <Text style={styles.historyToggleText}>HIST</Text>
      </Pressable>

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
                <PixelButton
  label={key.label}
  color={key.label === '+' ? '#00FF00' : undefined}
  onPress={() =>
    presionarBoton(key.label === '-' ? '×' : key.label)
  }
/>
              </View>
            ))}
          </View>
        ))}
      </View>
      <HistoryPanel
        visible={historialVisible}
        operaciones={operaciones}
        onClose={() => setHistorialVisible(false)}
        onSelect={(operation) => {
          restaurarOperacion(operation.expresion, operation.resultado);
          setHistorialVisible(false);
        }}
        onDelete={eliminarOperacion}
        onClear={borrarHistorial}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.sky,
  },
  historyToggle: {
    position: 'absolute',
    top: 40,
    right: LAYOUT.screenPadding,
    zIndex: 5,
    width: 48,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: LAYOUT.bevel / 2,
    borderColor: COLORS.bevelDark,
    backgroundColor: COLORS.button,
  },
  historyToggleText: {
    color: COLORS.label,
    fontFamily: FONT_FAMILY,
    fontSize: 7,
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
