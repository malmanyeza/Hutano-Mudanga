import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Pressable, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, layout } from '../../styles/shared';
import { useDiagnosisAssistant } from '../../hooks/DiagnosisAssistantContext';
import { X } from 'lucide-react-native';
import { SavedDiagnosis } from '../../types/diagnosis';

const isWeb = Platform.OS === 'web';
const BlurContainer = isWeb ? View : BlurView;

const getRiskLevelInfo = (riskLevel?: string) => {
  switch (riskLevel?.toLowerCase()) {
    case 'high':
      return { color: '#ef4444', emoji: '🔴' };
    case 'medium':
      return { color: '#f59e0b', emoji: '🟠' };
    case 'low':
      return { color: '#10b981', emoji: '🟢' };
    default:
      return { color: colors.text.secondary, emoji: '⚪' };
  }
};

const STATUS_COLORS: Record<SavedDiagnosis['status'], string> = {
  Monitoring: '#f59e0b',
  Treated: '#10b981',
  Critical: '#ef4444',
  Recovered: '#6366f1',
};

export default function SavedScreen() {
  const { savedDiagnoses, updateDiagnosisStatus } = useDiagnosisAssistant();
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<SavedDiagnosis | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editedNotes, setEditedNotes] = useState('');

  const removeAsterisks = (text: string) => {
    return text.replace(/\*/g, '');
  };

  const handleStatusClick = async (status: SavedDiagnosis['status']) => {
    if (!selectedDiagnosis?.id) return;
    
    try {
      await updateDiagnosisStatus(selectedDiagnosis.id, status, editedNotes);
      setModalVisible(false);
      setSelectedDiagnosis(null);
    } catch (error: unknown) {
      console.error('Error updating status:', error);
    }
  };

  const openDiagnosisDetails = (diagnosis: SavedDiagnosis) => {
    console.log(diagnosis)
    setSelectedDiagnosis(diagnosis);
    setEditedNotes(diagnosis.notes?.message || '');
    setModalVisible(true);
  };

  return (
    <LinearGradient
      colors={['#edcc9a', '#92ccce']}
      style={styles.gradientContainer}
    >
      {/* Fixed Header */}
      <View style={styles.header}>
        <BlurContainer intensity={80} tint="light" style={styles.headerContent}>
          <View style={styles.headerRow}>
            <View style={styles.headerText}>
              <Text style={styles.title}>Saved Diagnoses</Text>
              <Text style={styles.subtitle}>View and manage your saved diagnoses</Text>
            </View>
          </View>
        </BlurContainer>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        {savedDiagnoses.map((diagnosis: SavedDiagnosis) => (
          <TouchableOpacity 
            key={diagnosis.id} 
            onPress={() => openDiagnosisDetails(diagnosis)}
            activeOpacity={0.8}
          >
            <BlurContainer intensity={80} tint="light" style={styles.diagnosisCard}>
              <View style={styles.cardHeader}>
                <View style={styles.titleContainer}>
                  <Text style={styles.condition}>{diagnosis.disease || 'Unknown Disease'}</Text>
                  <Text style={styles.date}>{diagnosis.date || new Date().toLocaleDateString()}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[diagnosis.status] }]}>
                  <Text style={styles.statusText}>{diagnosis.status}</Text>
                </View>
              </View>
              
              <View style={styles.detailsRow}>
                <View style={styles.riskContainer}>
                  <Text style={styles.detailLabel}>Risk Level:</Text>
                  <View style={styles.riskLevelContainer}>
                    <Text style={styles.riskEmoji}>{getRiskLevelInfo(diagnosis.riskLevel).emoji}</Text>
                    <Text style={[styles.riskLevel, { color: getRiskLevelInfo(diagnosis.riskLevel).color }]}>
                      {diagnosis.riskLevel || 'Not classified'}
                    </Text>
                  </View>
                </View>
                <View style={styles.symptomsContainer}>
                  <Text style={styles.detailLabel}>Symptoms:</Text>
                  <Text style={styles.symptoms} numberOfLines={2}>
                    {diagnosis.matchingSymptoms?.join(', ') || 'No symptoms recorded'}
                  </Text>
                </View>
              </View>
            </BlurContainer>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Details Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <LinearGradient
            colors={['#edcc9a', '#92ccce']}
            style={styles.modalGradient}
          >
            <BlurContainer
              intensity={80}
              tint="light"
              style={styles.modalContainer}
            >
              <TouchableOpacity
                style={styles.xButton}
                onPress={() => setModalVisible(false)}
              >
                <X size={24} color="#34444c" />
              </TouchableOpacity>

              <ScrollView style={styles.modalScroll}>
                <View style={styles.modalContent}>
                  {selectedDiagnosis && (
                    <>
                      <Text style={styles.modalTitle}>{selectedDiagnosis.disease}</Text>
                      <Text style={styles.modalDate}>{selectedDiagnosis.date}</Text>

                      <View style={styles.riskLevelBadge}>
                        <Text style={[styles.riskLevelText, { color: getRiskLevelInfo(selectedDiagnosis.riskLevel).color }]}>
                          {getRiskLevelInfo(selectedDiagnosis.riskLevel).emoji} Risk Level: {selectedDiagnosis.riskLevel}
                        </Text>
                      </View>

                      <Text style={styles.sectionTitle}>Matching Symptoms</Text>
                      <View style={styles.symptomsContainer}>
                        {selectedDiagnosis.matchingSymptoms.map((symptom, index) => (
                          <Text key={index} style={styles.symptomItem}>• {symptom}</Text>
                        ))}
                      </View>

                      <Text style={styles.sectionTitle}>Treatment Advice</Text>
                      <Text style={styles.sectionContent}>{selectedDiagnosis.treatmentAdvice}</Text>

                      <Text style={styles.sectionTitle}>Prevention Tips</Text>
                      <Text style={styles.sectionContent}>{selectedDiagnosis.preventionTips}</Text>

                      {selectedDiagnosis.references && selectedDiagnosis.references.length > 0 && (
                        <>
                          <Text style={styles.sectionTitle}>References</Text>
                          {selectedDiagnosis.references.map((ref, index) => (
                            <Text key={index} style={styles.referenceItem}>• {ref}</Text>
                          ))}
                        </>
                      )}

                      <Text style={styles.sectionTitle}>Notes</Text>
                      <Text style={styles.sectionContent}>{selectedDiagnosis.notes || 'No notes added'}</Text>
                      <Text style={styles.sectionTitle}>Status</Text>
                      <View style={styles.statusButtons}>
                        {Object.keys(STATUS_COLORS).map((status) => (
                          <TouchableOpacity
                            key={status}
                            style={[
                              styles.statusOption,
                              { backgroundColor: STATUS_COLORS[status as keyof typeof STATUS_COLORS] },
                              selectedDiagnosis.status === status && styles.selectedStatus,
                            ]}
                            onPress={() => handleStatusClick(status as SavedDiagnosis['status'])}
                          >
                            <Text style={styles.statusOptionText}>{status}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </>
                  )}
                </View>
              </ScrollView>
            </BlurContainer>
          </LinearGradient>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: spacing.lg,
    backgroundColor: Platform.select({
      web: 'rgba(237, 204, 154, 0.95)',
      ios: colors.background.transparent,
      android: 'rgba(237, 204, 154, 0.95)',
    }),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
  },
  title: {
    ...typography.title,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl * 4,
  },
  diagnosisCard: {
    backgroundColor: Platform.select({
      web: 'rgba(255, 255, 255, 0.85)',
      ios: colors.background.transparent,
      android: '#ffffff',
    }),
    borderRadius: layout.borderRadius.medium,
    padding: spacing.md,
    marginBottom: spacing.sm,
    minHeight: 100,
    ...Platform.select({
      ios: {
        ...layout.shadow.medium,
        overflow: 'hidden',
      },
      android: {
        elevation: 4,
        overflow: 'hidden',
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  condition: {
    ...typography.subtitle,
    color: colors.text.primary,
    flexShrink: 1,
    marginRight: spacing.sm,
  },
  date: {
    ...typography.body,
    fontSize: 14,
    color: colors.text.secondary,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: layout.borderRadius.small + 4,
  },
  statusText: {
    ...typography.body,
    fontSize: 12,
    color: colors.background.light,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalGradient: {
    width: '90%',
    height: '80%',
    borderRadius: layout.borderRadius.large,
  },
  modalContainer: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: layout.borderRadius.large,
    backgroundColor: Platform.select({
      ios: 'rgba(255, 255, 255, 0.85)',
      android: 'rgba(255, 255, 255, 0.95)',
      web: 'rgba(255, 255, 255, 0.85)',
    }),
  },
  modalContent: {
    flex: 1,
    marginTop: 40,
  },
  riskLevelBadge: {
    backgroundColor: colors.background.light,
    borderRadius: layout.borderRadius.medium,
    padding: spacing.sm,
    marginVertical: spacing.md,
    alignSelf: 'flex-start',
  },
  riskLevelText: {
    ...typography.body,
    fontSize: 16,
    fontWeight: '600',
  },
  referenceItem: {
    ...typography.body,
    color: colors.text.secondary,
    marginLeft: spacing.md,
    marginBottom: spacing.xs,
  },
  modalScroll: {
    flex: 1,
  },
  modalTitle: {
    ...typography.title,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  xButton: {
    position: 'absolute',
    right: spacing.md,
    top: spacing.md,
    zIndex: 1,
  },
  modalDate: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  sectionContent: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.md,
    lineHeight: 24,
  },
  symptomItem: {
    ...typography.body,
    color: colors.text.secondary,
    marginLeft: spacing.md,
    marginBottom: spacing.xs,
  },
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  statusOption: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: layout.borderRadius.small,
    marginBottom: spacing.xs,
  },
  selectedStatus: {
    borderWidth: 2,
    borderColor: colors.background.light,
  },
  statusOptionText: {
    ...typography.body,
    fontSize: 14,
    color: colors.background.light,
  },
  titleContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  detailsRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
    gap: spacing.md,
  },
  riskContainer: {
    flex: 1,
  },
  detailLabel: {
    ...typography.body,
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  riskLevelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  riskEmoji: {
    fontSize: 14,
  },
  riskLevel: {
    ...typography.body,
    fontSize: 14,
    fontWeight: '600',
  },
  symptomsContainer: {
    flex: 2,
  },
  symptoms: {
    ...typography.body,
    fontSize: 14,
    color: colors.text.secondary,
  },
});