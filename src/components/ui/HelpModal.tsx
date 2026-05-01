import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Colors, Typography, Spacing, Radii, Shadows } from '../../constants/theme';
import { useColors } from '../../hooks/useColors';

interface HelpModalProps {
  title: string;
  content: string;
}

export function HelpModal({ title, content }: HelpModalProps) {
  const C = useColors();
  const [visible, setVisible] = useState(false);

  return (
    <>
      {/* Bouton ? */}
      <TouchableOpacity
        style={[styles.helpBtn, { backgroundColor: C.primaryContainer, borderColor: C.primary }]}
        onPress={() => setVisible(true)}
        activeOpacity={0.75}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={[styles.helpBtnText, { color: C.primary }]}>?</Text>
      </TouchableOpacity>

      {/* Popup */}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} onPress={() => {}}>
            <View style={styles.sheet}>

              {/* Header */}
              <View style={styles.sheetHeader}>
                <Text style={[styles.sheetTitle, { color: C.primary }]}>
                  💡 {title}
                </Text>
                <TouchableOpacity
                  style={[styles.closeBtn, { backgroundColor: C.primaryContainer }]}
                  onPress={() => setVisible(false)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={[styles.closeBtnText, { color: C.primary }]}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* Contenu */}
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.sheetContent}>{content}</Text>
              </ScrollView>

              {/* Bouton fermer */}
              <TouchableOpacity
                style={[styles.doneBtn, { backgroundColor: C.primary }]}
                onPress={() => setVisible(false)}
                activeOpacity={0.85}
              >
                <Text style={styles.doneBtnText}>J'ai compris !</Text>
              </TouchableOpacity>

            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  helpBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 13,
    lineHeight: 16,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing[5],
  },

  sheet: {
    backgroundColor: Colors.white,
    borderRadius: Radii['2xl'],
    padding: Spacing[5],
    width: '100%',
    maxHeight: 480,
    ...Shadows.lg,
  },

  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing[4],
  },
  sheetTitle: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography.lg,
    flex: 1,
    paddingRight: Spacing[3],
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 12,
  },

  sheetContent: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: Typography.md,
    color: Colors.onSurface,
    lineHeight: 24,
    marginBottom: Spacing[4],
  },

  doneBtn: {
    borderRadius: Radii.full,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: Spacing[2],
  },
  doneBtnText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: Typography.md,
    color: Colors.white,
  },
});
