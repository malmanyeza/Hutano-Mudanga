import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Pressable, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, X } from 'lucide-react-native';

const isWeb = Platform.OS === 'web';
const BlurContainer = isWeb ? View : BlurView;

type Disease = {
  id: number;
  name: string;
  description: string;
  severity: string;
};

const DISEASES: Disease[] = [
  {
    id: 1,
    name: 'Foot and Mouth Disease',
    description: 'A highly contagious viral disease affecting cloven-hoofed animals',
    severity: 'High',
  },
  {
    id: 2,
    name: 'Bovine Respiratory Disease',
    description: 'Complex of diseases affecting the respiratory system',
    severity: 'Medium',
  },
  {
    id: 3,
    name: 'Mastitis',
    description: 'Inflammation of the mammary gland and udder tissue',
    severity: 'Medium',
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
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Disease Guide</Text>
        <Text style={styles.subtitle}>Common cattle diseases and their treatments</Text>

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
                    <View style={[styles.severityBadge, { backgroundColor: '#c89826', marginBottom: 16 }]}> 
                      <Text style={styles.severityText}>{selectedDisease.severity} Severity</Text>
                    </View>
                    {/* Placeholder for more details. Add more fields here if available. */}
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalGradient: {
    width: '95%',
    maxWidth: 520,
    borderRadius: 20,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  modalContainer: {
    padding: 24,
    borderRadius: 20,
    backgroundColor: Platform.OS === 'web' ? 'rgba(255,255,255,0.95)' : 'transparent',
    maxHeight: '100%',
    width: '100%',
    alignSelf: 'center',
  },
  modalContent: {
    alignItems: 'flex-start',
    paddingBottom: 24,
  },
  modalTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 22,
    color: '#34444c',
    marginBottom: 10,
  },
  modalDescription: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: '#987a59',
    marginBottom: 12,
  },
  xButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 20,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    padding: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 100,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: '#34444c',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: '#987a59',
    marginBottom: 20,
  },
  diseaseCard: {
    backgroundColor: isWeb ? 'rgba(255, 255, 255, 0.85)' : 'transparent',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        overflow: 'hidden',
      },
      android: {
        elevation: 4,
      },
    }),
  },
  diseaseInfo: {
    flex: 1,
  },
  diseaseName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#34444c',
    marginBottom: 4,
  },
  diseaseDescription: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#987a59',
    marginBottom: 8,
  },
  severityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: 'white',
  },
});