import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { COLORS, FONT_FAMILY, LAYOUT } from '../constants/theme';
import { OperacionHistorial } from '../hooks/useHistorial';

type HistoryPanelProps = {
  visible: boolean;
  operaciones: OperacionHistorial[];
  onClose: () => void;
  onSelect: (operation: OperacionHistorial) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
};

function formatFecha(timestamp: number): string {
  return new Date(timestamp).toLocaleString();
}

export function HistoryPanel({
  visible,
  operaciones,
  onClose,
  onSelect,
  onDelete,
  onClear,
}: HistoryPanelProps) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Cerrar historial"
        style={StyleSheet.absoluteFill}
        onPress={onClose}
      />
      <View style={styles.panel}>
        <View style={styles.header}>
          <View style={styles.titleGroup}>
            <View style={styles.pixelAccent} />
            <Text style={styles.title}>HISTORIAL</Text>
            <View style={styles.pixelAccent} />
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cerrar historial"
            onPress={onClose}
            style={styles.smallButton}
          >
            <Text style={styles.smallButtonText}>X</Text>
          </Pressable>
        </View>

        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
        >
          {operaciones.length === 0 ? (
            <Text style={styles.empty}>SIN OPERACIONES</Text>
          ) : (
            operaciones.map((operation) => (
              <View key={operation.id} style={styles.entry}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Recuperar ${operation.expresion} resultado ${operation.resultado}`}
                  onPress={() => onSelect(operation)}
                  style={styles.entryContent}
                >
                  <Text style={styles.expression} numberOfLines={1}>
                    {operation.expresion}
                  </Text>
                  <Text style={styles.result} numberOfLines={1}>
                    R: {operation.resultado}
                  </Text>
                  <Text style={styles.date} numberOfLines={1}>
                    {formatFecha(operation.fecha)}
                  </Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Eliminar ${operation.expresion}`}
                  onPress={() => onDelete(operation.id)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteText}>X</Text>
                </Pressable>
              </View>
            ))
          )}
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            accessibilityRole="button"
            disabled={operaciones.length === 0}
            onPress={onClear}
            style={[
              styles.actionButton,
              operaciones.length === 0 && styles.disabledButton,
            ]}
          >
            <Text style={styles.actionText}>BORRAR TODO</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={onClose}
            style={styles.actionButton}
          >
            <Text style={styles.actionText}>VOLVER</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: LAYOUT.screenPadding,
    backgroundColor: 'rgba(26, 14, 5, 0.72)',
  },
  panel: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '82%',
    borderWidth: LAYOUT.bevel,
    borderColor: COLORS.bevelDark,
    backgroundColor: COLORS.skyDeep,
    padding: LAYOUT.gap * 2,
  },
  header: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: COLORS.displayLine,
    paddingBottom: LAYOUT.gap * 2,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: LAYOUT.gap,
  },
  pixelAccent: {
    width: LAYOUT.dotSize,
    height: LAYOUT.dotSize,
    backgroundColor: COLORS.button,
  },
  title: {
    color: COLORS.displayText,
    fontFamily: FONT_FAMILY,
    fontSize: 13,
  },
  smallButton: {
    minWidth: 32,
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.bevelDark,
    backgroundColor: COLORS.button,
  },
  smallButtonText: {
    color: COLORS.label,
    fontFamily: FONT_FAMILY,
    fontSize: 12,
  },
  list: {
    flexShrink: 1,
  },
  listContent: {
    paddingVertical: LAYOUT.gap * 2,
    gap: LAYOUT.gap * 2,
  },
  empty: {
    paddingVertical: LAYOUT.gap * 4,
    color: COLORS.displayText,
    fontFamily: FONT_FAMILY,
    fontSize: 11,
    textAlign: 'center',
  },
  entry: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderWidth: 2,
    borderColor: COLORS.bevelDark,
    backgroundColor: COLORS.button,
  },
  entryContent: {
    flex: 1,
    minWidth: 0,
    padding: LAYOUT.gap * 2,
    gap: LAYOUT.gap,
  },
  expression: {
    color: COLORS.label,
    fontFamily: FONT_FAMILY,
    fontSize: 10,
  },
  result: {
    color: COLORS.labelShadow,
    fontFamily: FONT_FAMILY,
    fontSize: 11,
  },
  date: {
    color: COLORS.labelShadow,
    fontFamily: FONT_FAMILY,
    fontSize: 8,
  },
  deleteButton: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 2,
    borderLeftColor: COLORS.bevelDark,
  },
  deleteText: {
    color: COLORS.label,
    fontFamily: FONT_FAMILY,
    fontSize: 11,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: LAYOUT.gap * 2,
    borderTopWidth: 2,
    borderTopColor: COLORS.displayLine,
    paddingTop: LAYOUT.gap * 2,
  },
  actionButton: {
    flex: 1,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.bevelDark,
    backgroundColor: COLORS.button,
    paddingHorizontal: LAYOUT.gap,
  },
  disabledButton: {
    opacity: 0.5,
  },
  actionText: {
    color: COLORS.label,
    fontFamily: FONT_FAMILY,
    fontSize: 9,
    textAlign: 'center',
  },
});
