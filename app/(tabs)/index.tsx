import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, TextStyle, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Stethoscope, Truck, BookOpen, FileText, Settings } from 'lucide-react-native';
import { Link, useRouter } from 'expo-router';
import { colors, spacing, typography, layout } from '../../styles/shared';

const isWeb = Platform.OS === 'web';
const BlurContainer = isWeb ? View : BlurView;

export default function HomeScreen() {
  const router = useRouter();

  const handleStartDiagnosis = () => {
    router.push('/diagnose');
  };

  return (
    <LinearGradient
      colors={['#edcc9a', '#92ccce']}
      style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        {/* Welcome Section */}
        <BlurContainer intensity={80} tint="light" style={styles.welcomeCard}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1596733430284-f7437764b1a9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3' }}
              style={styles.backgroundImage}
              resizeMethod="resize"
            />
          </View>
          <View style={styles.welcomeContent}>
            <View style={styles.welcomeTextContainer}>
              <Text style={styles.welcomeEmoji}>👋</Text>
              <Text style={styles.welcomeTitle}>Hutano mudanga</Text>
              <Text style={styles.welcomeSubtitle}>How can we help your cattle today?</Text>
            </View>
            <TouchableOpacity style={styles.settingsButton}>
              <Settings size={24} color="#c89826" />
            </TouchableOpacity>
          </View>
        </BlurContainer>

        {/* Main Actions */}
        <View style={styles.mainActions}>
          {/* New Diagnosis Button */}
          <TouchableOpacity style={styles.diagnosisButton} onPress={handleStartDiagnosis}>
            <Stethoscope color="white" size={24} />
            <View style={styles.diagnosisButtonText}>
              <Text style={styles.diagnosisButtonTitle}>Start New Diagnosis</Text>
              <Text style={styles.diagnosisButtonSubtitle}>Get AI-powered results instantly</Text>
            </View>
          </TouchableOpacity>

          {/* Quick Tools */}
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.quickTools}>
            <Link href="/guide" asChild>
              <TouchableOpacity style={styles.quickTool}>
                <BlurContainer intensity={80} tint="light" style={styles.quickToolInner}>
                  <BookOpen size={24} color="#c89826" />
                  <Text style={styles.toolText.text}>Disease Guide</Text>
                </BlurContainer>
              </TouchableOpacity>
            </Link>

            <Link href="/saved" asChild>
              <TouchableOpacity style={styles.quickTool}>
                <BlurContainer intensity={80} tint="light" style={styles.quickToolInner}>
                  <FileText size={24} color="#c89826" />
                  <Text style={styles.toolText.text}>Saved</Text>
                </BlurContainer>
              </TouchableOpacity>
            </Link>

            <TouchableOpacity style={styles.quickTool}>
              <BlurContainer intensity={80} tint="light" style={styles.quickToolInner}>
                <Truck size={24} color="#c89826" />
                <Text style={styles.toolText.text}>Find Vet</Text>
              </BlurContainer>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

type Styles = {
  mainActions: ViewStyle;
  container: ViewStyle;
  blurredBackground: ViewStyle;
  scrollView: ViewStyle;
  contentContainer: ViewStyle;
  welcomeCard: ViewStyle;
  imageContainer: ViewStyle;
  backgroundImage: ViewStyle;
  welcomeContent: ViewStyle;
  welcomeTextContainer: ViewStyle;
  settingsButton: ViewStyle;
  welcomeEmoji: TextStyle;
  welcomeTitle: TextStyle;
  welcomeSubtitle: TextStyle;
  diagnosisButton: ViewStyle;
  diagnosisButtonText: ViewStyle;
  diagnosisButtonTitle: TextStyle;
  diagnosisButtonSubtitle: TextStyle;
  sectionTitle: TextStyle;
  quickTools: ViewStyle;
  quickTool: ViewStyle;
  quickToolInner: ViewStyle;
  toolText: TextStyle;
};

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
  },
  blurredBackground: {
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
    paddingTop: Platform.OS === 'ios' ? spacing.xl * 3 : spacing.xl * 2,
  },
  welcomeCard: {
    backgroundColor: Platform.select({
      web: 'rgba(255, 255, 255, 0.85)',
      ios: 'transparent',
      android: 'rgba(255, 255, 255, 0.85)',
      default: 'rgba(255, 255, 255, 0.85)',
    }),
    borderRadius: layout.borderRadius.large,
    overflow: 'hidden',
    marginTop: spacing.xl * 1.5,
    marginBottom: spacing.xl,
    ...Platform.select({
      ios: layout.shadow.medium,
      android: {
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      default: {},
    }),
    width: '100%',
    flex: 1,
  },
  imageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 160,
    opacity: 0.5,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    backgroundColor: Platform.select({
      ios: 'transparent',
      android: 'rgba(255, 255, 255, 0.1)',
      default: 'transparent'
    })
  },
  welcomeContent: {
    padding: spacing.lg,
    paddingTop: 180,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 1,
  },
  welcomeTextContainer: {
    flex: 1,
    paddingRight: 20,
    backgroundColor: Platform.select({
      ios: 'transparent',
      android: 'rgba(255, 255, 255, 0.1)',
      default: 'transparent'
    })
  },
  settingsButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  welcomeEmoji: {
    fontSize: 24,
    marginBottom: spacing.sm,
  },
  welcomeTitle: {
    ...typography.title,
    color: colors.text.primary,
    marginBottom: 4,
  },
  welcomeSubtitle: {
    ...typography.subtitle,
    color: colors.text.secondary,
  },
  mainActions: {
    flex: 1,
    justifyContent: 'space-between',
    marginTop: spacing.xl,
  },
  diagnosisButton: {
    backgroundColor: colors.primary,
    borderRadius: layout.borderRadius.large,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
    ...Platform.select({
      ios: layout.shadow.medium,
      android: {
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      default: {},
    })
  },
  diagnosisButtonText: {
    marginLeft: spacing.md,
  },
  diagnosisButtonTitle: {
    ...typography.subtitle,
    color: colors.background.light,
    fontSize: 18,
  },
  diagnosisButtonSubtitle: {
    ...typography.body,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  quickTools: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xl * 1.5,
    marginBottom: spacing.lg,
  },
  quickTool: {
    width: '31%',
  },
  quickToolInner: {
    backgroundColor: Platform.select({
      ios: 'transparent',
      android: 'rgba(255, 255, 255, 0.85)',
      web: 'rgba(255, 255, 255, 0.85)',
      default: 'rgba(255, 255, 255, 0.85)',
    }),
    borderRadius: layout.borderRadius.large,
    padding: spacing.lg,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...Platform.select({
      ios: layout.shadow.medium,
      android: {
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      default: {},
    }),
  },
  toolText: StyleSheet.create<{ text: TextStyle }>({
    text: {
      ...typography.body,
      fontSize: 14,
      color: colors.text.primary,
      marginTop: spacing.sm,
      textAlign: 'center',
    },
  }).text,
});