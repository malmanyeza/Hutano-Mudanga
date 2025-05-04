import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';
const BlurContainer = isWeb ? View : BlurView;

const SAVED_DIAGNOSES = [
  {
    id: 1,
    condition: 'Respiratory Infection',
    date: 'March 15, 2023',
    status: 'Treated',
    notes: 'Prescribed antibiotics for 7 days',
  },
  {
    id: 2,
    condition: 'Digestive Issue',
    date: 'March 12, 2023',
    status: 'Monitoring',
    notes: 'Dietary changes implemented',
  },
];

export default function SavedScreen() {
  return (
    <LinearGradient colors={['#edcc9a', '#92ccce']} style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Saved Diagnoses</Text>
        <Text style={styles.subtitle}>Your cattle's health history</Text>

        {SAVED_DIAGNOSES.map((diagnosis) => (
          <BlurContainer key={diagnosis.id} intensity={80} tint="light" style={styles.diagnosisCard}>
            <View style={styles.header}>
              <Text style={styles.condition}>{diagnosis.condition}</Text>
              <Text style={styles.date}>{diagnosis.date}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: '#c89826' }]}>
              <Text style={styles.statusText}>{diagnosis.status}</Text>
            </View>
            <Text style={styles.notes}>{diagnosis.notes}</Text>
          </BlurContainer>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
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
  diagnosisCard: {
    backgroundColor: isWeb ? 'rgba(255, 255, 255, 0.85)' : 'transparent',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  condition: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#34444c',
  },
  date: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#987a59',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10,
  },
  statusText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: 'white',
  },
  notes: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#987a59',
  },
});