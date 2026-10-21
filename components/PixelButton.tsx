import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS, FONT_FAMILY, LAYOUT } from '../constants/theme';

type PixelButtonProps = {
  label: string;
  /** Callback opcional. La app es solo UI: no se pasa ninguno. */
  onPress?: () => void;
};

/**
 * Botón retro pixel-art:
 * - bisel con franja clara arriba/izquierda y franja casi negra abajo/derecha
 * - 4 puntitos negros en las esquinas
 * - etiqueta naranja oscuro/café con sombra pequeña
 *
 * Todo se dibuja con Views y estilos, sin imágenes.
 */
export function PixelButton({ label, onPress }: PixelButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={onPress}
    >
      {/* Bisel: primero las franjas oscuras, luego las claras encima
          (así las esquinas quedan "elevadas": claro arriba/izq, oscuro abajo/der) */}
      <View style={[styles.strip, styles.stripBottom]} />
      <View style={[styles.strip, styles.stripRight]} />
      <View style={[styles.strip, styles.stripTop]} />
      <View style={[styles.strip, styles.stripLeft]} />

      {/* Puntitos negros en las esquinas */}
      <View style={[styles.dot, { top: LAYOUT.dotInset, left: LAYOUT.dotInset }]} />
      <View style={[styles.dot, { top: LAYOUT.dotInset, right: LAYOUT.dotInset }]} />
      <View style={[styles.dot, { bottom: LAYOUT.dotInset, left: LAYOUT.dotInset }]} />
      <View style={[styles.dot, { bottom: LAYOUT.dotInset, right: LAYOUT.dotInset }]} />

      {/* Etiqueta con sombra pequeña */}
      <View style={styles.labelWrap} pointerEvents="none">
        <Text style={[styles.label, styles.labelShadow]} allowFontScaling={false}>
          {label}
        </Text>
        <Text style={[styles.label, styles.labelMain]} allowFontScaling={false}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    backgroundColor: COLORS.button,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
  },

  strip: {
    position: 'absolute',
  },
  stripTop: {
    top: 0,
    left: 0,
    right: 0,
    height: LAYOUT.bevel,
    backgroundColor: COLORS.bevelLight,
  },
  stripLeft: {
    top: 0,
    left: 0,
    bottom: 0,
    width: LAYOUT.bevel,
    backgroundColor: COLORS.bevelLight,
  },
  stripBottom: {
    bottom: 0,
    left: 0,
    right: 0,
    height: LAYOUT.bevel,
    backgroundColor: COLORS.bevelDark,
  },
  stripRight: {
    top: 0,
    right: 0,
    bottom: 0,
    width: LAYOUT.bevel,
    backgroundColor: COLORS.bevelDark,
  },

  dot: {
    position: 'absolute',
    width: LAYOUT.dotSize,
    height: LAYOUT.dotSize,
    backgroundColor: COLORS.dot,
  },

  labelWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    position: 'absolute',
    fontFamily: FONT_FAMILY,
    fontSize: LAYOUT.labelFontSize,
    textAlign: 'center',
  },
  labelShadow: {
    color: COLORS.labelShadow,
    transform: [{ translateX: 2 }, { translateY: 2 }],
  },
  labelMain: {
    color: COLORS.label,
  },
});
