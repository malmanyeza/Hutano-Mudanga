import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Pressable, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, X } from 'lucide-react-native';
import { colors, typography, spacing, layout } from '../../styles/shared';

const isWeb = Platform.OS === 'web';
const BlurContainer = isWeb ? View : BlurView;

type Disease = {
  id: number;
  name: string;
  description: string;
  severity: string;
  treatment: {
    immediateAction?: string;
    medications?: string;
    precautions?: string;
    supportiveCare?: string[];
  };
  prevention: string[];
};

const DISEASES: Disease[] = [
  {
    id: 1,
    name: 'Anthrax',
    description: 'A serious bacterial disease that can affect both animals and humans',
    severity: 'High',
    treatment: {
      immediateAction: 'Isolate the affected animal and notify veterinary authorities.',
      medications: 'Administer antibiotics like penicillin or oxytetracycline under veterinary supervision.',
      precautions: 'Avoid opening carcasses of suspected cases, as this releases spores into the environment.',
    },
    prevention: [
      'Vaccination in endemic areas',
      'Proper carcass disposal (burning or deep burial with lime)',
    ],
  },
  {
    id: 2,
    name: 'Foot and Mouth Disease (FMD)',
    description: 'A highly contagious viral disease affecting cloven-hoofed animals',
    severity: 'High',
    treatment: {
      supportiveCare: [
        'Disinfect ulcers with mild antiseptics',
        'Provide soft, easily digestible feed',
        'Use anti-inflammatory drugs if prescribed',
      ],
    },
    prevention: [
      'Regular vaccination',
      'Maintain strict biosecurity measures',
    ],
  },
  {
    id: 3,
    name: 'Botulism',
    description: 'A serious form of food poisoning caused by bacterial toxins',
    severity: 'High',
    treatment: {
      medications: 'Administer botulinum antitoxin if available',
      supportiveCare: ['Provide supportive care, including intravenous fluids and nutritional support'],
    },
    prevention: [
      'Avoid feeding spoiled or decomposed feed',
      'Vaccinate animals in endemic areas',
    ],
  },
  {
    id: 4,
    name: 'Blackleg',
    description: 'An acute, infectious disease primarily affecting young cattle',
    severity: 'High',
    treatment: {
      medications: 'Early stages: High doses of penicillin or oxytetracycline may be effective',
      precautions: 'In advanced cases, treatment is often unsuccessful',
    },
    prevention: [
      'Vaccination of calves between 2-6 months of age',
      'Proper disposal of infected carcasses',
    ],
  },
  {
    id: 5,
    name: 'Brucellosis',
    description: 'A bacterial infection affecting cattle and other livestock',
    severity: 'High',
    treatment: {
      precautions: 'No effective treatment; infected animals are typically culled',
    },
    prevention: [
      'Vaccination (e.g., with RB51 or S19 vaccine)',
      'Test and slaughter infected animals',
    ],
  },
  {
    id: 6,
    name: 'Bloat',
    description: 'A digestive disorder causing excessive gas in the rumen',
    severity: 'Medium',
    treatment: {
      immediateAction: 'Pass a stomach tube to relieve gas or use a trocar and cannula in severe cases',
      medications: 'Administer antifoaming agents like vegetable oil or simethicone',
    },
    prevention: [
      'Avoid grazing animals on wet, lush legumes or high-risk pastures',
      'Feed bloat-preventing additives if necessary',
    ],
  },
  {
    id: 7,
    name: 'Theileriosis',
    description: 'A parasitic disease transmitted by ticks',
    severity: 'High',
    treatment: {
      medications: 'Use antiprotozoal drugs like buparvaquone or parvaquone',
      supportiveCare: ['Provide supportive care with fluids, vitamins, and minerals'],
    },
    prevention: [
      'Regular tick control through acaricides',
      'Vaccination in endemic areas',
    ],
  },
  {
    id: 8,
    name: 'Abscess',
    description: 'A localized collection of pus in body tissues',
    severity: 'Medium',
    treatment: {
      immediateAction: 'Drain the abscess and clean the area with antiseptic',
      medications: 'Administer antibiotics if there are signs of systemic infection',
    },
    prevention: [
      'Maintain good hygiene during injections or procedures',
    ],
  },
  {
    id: 9,
    name: 'Mastitis',
    description: 'Inflammation of the mammary gland and udder tissue',
    severity: 'Medium',
    treatment: {
      medications: 'Intramammary infusion of antibiotics such as penicillin, cephalosporins, or oxytetracycline',
      supportiveCare: ['Use anti-inflammatory drugs if necessary'],
    },
    prevention: [
      'Maintain proper milking hygiene',
      'Use post-milking teat dips',
      'Address bedding cleanliness',
    ],
  },
  {
    id: 10,
    name: 'Lumpy Skin Disease (LSD)',
    description: 'A viral disease characterized by skin nodules',
    severity: 'High',
    treatment: {
      medications: 'Antibiotics to prevent secondary infections (e.g., oxytetracycline)',
      supportiveCare: [
        'Wound care with antiseptics',
        'Provide adequate nutrition and hydration',
      ],
    },
    prevention: [
      'Vaccination',
      'Control biting insects (vectors)',
    ],
  },
];

export default function GuideScreen() {
  const [selectedDisease, setSelectedDisease] = React.useState<Disease | null>(null);
  const [modalVisible, setModalVisible] = React.useState(false);

  const openModal = (disease: Disease) => {
    setSelectedDisease(disease);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedDisease(null);
  };

  return (
    <LinearGradient colors={['#edcc9a', '#92ccce']} style={styles.container}>
      <LinearGradient colors={['#edcc9a', '#92ccce']} style={styles.header}>
        <View  style={styles.headerContent}>
          <Text style={styles.title}>Disease Guide</Text>
          <Text style={styles.subtitle}>Common cattle diseases and their treatments</Text>
        </View>
      </LinearGradient>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.contentContainer}
      >
        {DISEASES.map((disease) => (
          <TouchableOpacity key={disease.id} onPress={() => openModal(disease)}>
            <BlurContainer intensity={80} tint="light" style={styles.diseaseCard}>
              <View style={styles.diseaseInfo}>
                <Text style={styles.diseaseName}>{disease.name}</Text>
                <Text style={styles.diseaseDescription}>{disease.description}</Text>
                <View style={[styles.severityBadge, { backgroundColor: '#c89826' }]}> 
                  <Text style={styles.severityText}>{disease.severity} Severity</Text>
                </View>
              </View>
              <ChevronRight size={24} color="#6f5415" />
            </BlurContainer>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Modal for Disease Details */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackdrop}>
          <LinearGradient colors={["#edcc9a", "#92ccce"]} style={styles.modalGradient}>
            <BlurContainer intensity={80} tint="light" style={styles.modalContainer}>
              {/* X Close Button */}
              <Pressable style={styles.xButton} onPress={closeModal} hitSlop={12}>
                <X size={28} color="#34444c" />
              </Pressable>
              <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
                {selectedDisease && (
                  <>
                    <Text style={styles.modalTitle}>{selectedDisease.name}</Text>
                    <Text style={styles.modalDescription}>{selectedDisease.description}</Text>
                    <View style={[styles.severityBadge, { backgroundColor: selectedDisease.severity === 'High' ? '#ef4444' : '#f59e0b', marginBottom: 16 }]}> 
                      <Text style={styles.severityText}>{selectedDisease.severity} Severity</Text>
                    </View>

                    <Text style={styles.sectionTitle}>Treatment</Text>
                    {selectedDisease.treatment.immediateAction && (
                      <View style={styles.treatmentSection}>
                        <Text style={styles.treatmentLabel}>Immediate Action:</Text>
                        <Text style={styles.treatmentText}>{selectedDisease.treatment.immediateAction}</Text>
                      </View>
                    )}
                    {selectedDisease.treatment.medications && (
                      <View style={styles.treatmentSection}>
                        <Text style={styles.treatmentLabel}>Medications:</Text>
                        <Text style={styles.treatmentText}>{selectedDisease.treatment.medications}</Text>
                      </View>
                    )}
                    {selectedDisease.treatment.precautions && (
                      <View style={styles.treatmentSection}>
                        <Text style={styles.treatmentLabel}>Precautions:</Text>
                        <Text style={styles.treatmentText}>{selectedDisease.treatment.precautions}</Text>
                      </View>
                    )}
                    {selectedDisease.treatment.supportiveCare && (
                      <View style={styles.treatmentSection}>
                        <Text style={styles.treatmentLabel}>Supportive Care:</Text>
                        {selectedDisease.treatment.supportiveCare.map((care, index) => (
                          <Text key={index} style={styles.treatmentText}>• {care}</Text>
                        ))}
                      </View>
                    )}

                    <Text style={styles.sectionTitle}>Prevention</Text>
                    <View style={styles.preventionSection}>
                      {selectedDisease.prevention.map((step, index) => (
                        <Text key={index} style={styles.preventionText}>• {step}</Text>
                      ))}
                    </View>
                  </>
                )}
              </ScrollView> 
            </BlurContainer>
          </LinearGradient>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    ...typography.subtitle,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  treatmentSection: {
    marginBottom: spacing.sm,
  },
  treatmentLabel: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  treatmentText: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  preventionSection: {
    marginTop: spacing.xs,
  },
  preventionText: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalGradient: {
    width: '95%',
    maxWidth: 520,
    borderRadius: layout.borderRadius.large,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  modalContainer: {
    padding: spacing.xl,
    borderRadius: layout.borderRadius.large,
    backgroundColor: Platform.select({
      web: 'rgba(255,255,255,0.95)',
      ios: colors.background.transparent,
      android: '#ffffff',
    }),
    maxHeight: '100%',
    width: '100%',
    alignSelf: 'center',
    overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
  },
  modalContent: {
    alignItems: 'flex-start',
    paddingBottom: spacing.xl,
  },
  modalTitle: {
    ...typography.title,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    fontSize: 22,
  },
  modalDescription: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  xButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    zIndex: 20,
    backgroundColor: Platform.select({
      android: '#ffffff',
      default: 'rgba(255,255,255,0.7)',
    }),
    borderRadius: layout.borderRadius.large,
    padding: spacing.xs,
    ...Platform.select({
      ios: layout.shadow.small
    }),
  },
  container: {
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
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 4,
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
  diseaseCard: {
    backgroundColor: Platform.select({
      web: 'rgba(255, 255, 255, 0.85)',
      ios: colors.background.transparent,
      android: '#ffffff',
    }),
    borderRadius: layout.borderRadius.medium,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
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
  diseaseInfo: {
    flex: 1,
  },
  diseaseName: {
    ...typography.subtitle,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  diseaseDescription: {
    ...typography.body,
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  severityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: layout.borderRadius.small + 4,
  },
  severityText: {
    ...typography.body,
    fontSize: 12,
    color: colors.background.light,
  },
});