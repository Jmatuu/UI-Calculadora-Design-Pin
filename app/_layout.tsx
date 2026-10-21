import { PressStart2P_400Regular, useFonts } from '@expo-google-fonts/press-start-2p';
import { Slot } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '../constants/theme';

/**
 * Layout raíz de Expo Router.
 * Carga la fuente Press Start 2P una sola vez para todas las rutas
 * y muestra una vista del color del cielo mientras se carga.
 */
export default function RootLayout() {
  const [fontsLoaded] = useFonts({ PressStart2P_400Regular });

  // Evita el flash blanco mientras se carga la fuente pixel.
  if (!fontsLoaded) {
    return <View style={styles.loading} />;
  }

  return <Slot />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: COLORS.sky,
  },
});
