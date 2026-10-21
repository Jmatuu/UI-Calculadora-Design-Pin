import React from 'react';
import {
  Platform,
  StatusBar as NativeStatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { Cloud } from './Cloud';
import { COLORS, FONT_FAMILY, LAYOUT } from '../constants/theme';

type DisplayProps = {
  /** Número grande, alineado a la derecha */
  value?: string;
  /** Operación pequeña, debajo de la línea */
  operation?: string;
};

/**
 * Zona superior del display: cielo azul con nubes pixeladas, número grande
 * blanco a la derecha, línea separadora y operación pequeña alineada a la derecha.
 *
 * El display se divide en dos:
 * - `skyArea`: la zona azul con las nubes (flex: 1, recorta lo que se salga)
 * - `content`: el número, la línea y la operación, anclados abajo
 *
 * Así las nubes quedan SIEMPRE dentro de la zona azul y nunca pisan el texto.
 */
export function Display({ value = '0', operation = '' }: DisplayProps) {
  // En Android con edge-to-edge el contenido arranca bajo el status bar.
  const topInset = Platform.OS === 'android' ? NativeStatusBar.currentHeight ?? 0 : 0;

  const { width } = useWindowDimensions();

  // Press Start 2P es monoespaciada: el ancho del texto es fontSize * nº de caracteres.
  const contentWidth = width - LAYOUT.screenPadding * 2;
  const charCount = Math.max(value.length, 1);
  const valueFontSize = Math.min(
    LAYOUT.displayFontSizeMax,
    Math.max(
      LAYOUT.displayFontSizeMin,
      (contentWidth / charCount) * LAYOUT.displayWidthFill
    )
  );

  return (
    <View style={styles.container}>
      <View style={styles.skyArea}>
        <View style={[styles.cloudLayer, { top: topInset }]}>
          <Cloud style={{ position: 'absolute', top: '4%', left: 6 }} scale={1.5} variant="a" />
          <Cloud style={{ position: 'absolute', top: '34%', right: 10 }} scale={1.25} variant="b" />
          <Cloud style={{ position: 'absolute', top: '62%', left: -12 }} scale={1.15} variant="a" />
        </View>
      </View>

      <View style={styles.content}>
        <Text
          style={[styles.value, { fontSize: valueFontSize }]}
          numberOfLines={1}
          adjustsFontSizeToFit
          allowFontScaling={false}
        >
          {value}
        </Text>

        <View style={styles.separator}>
          <View style={styles.line} />
          <View style={styles.lineShadow} />
        </View>

        <Text style={styles.operation} numberOfLines={1} allowFontScaling={false}>
          {operation}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: LAYOUT.displayFlex,
    backgroundColor: COLORS.sky,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  skyArea: {
    flex: 1,
    overflow: 'hidden',
  },
  cloudLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  content: {
    paddingHorizontal: LAYOUT.screenPadding,
    paddingBottom: LAYOUT.gap * 2,
  },
  value: {
    fontFamily: FONT_FAMILY,
    fontSize: LAYOUT.displayFontSizeMin,
    color: COLORS.displayText,
    textAlign: 'right',
  },
  separator: {
    marginTop: LAYOUT.gap,
  },
  line: {
    height: 3,
    backgroundColor: COLORS.displayLine,
  },
  lineShadow: {
    height: 2,
    marginTop: 2,
    backgroundColor: COLORS.skyDeep,
  },
  operation: {
    marginTop: LAYOUT.gap,
    fontFamily: FONT_FAMILY,
    fontSize: LAYOUT.operationFontSize,
    color: COLORS.displayText,
    textAlign: 'right',
  },
});
