import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Platform, Keyboard, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Stethoscope, Truck, BookOpen, FileText, Settings } from 'lucide-react-native';
import { Link, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';

const isWeb = Platform.OS === 'web';
const BlurContainer = isWeb ? View : BlurView;

const DIAGNOSES = [
  {
    id: 1,
    title: 'Respiratory Infection',
    date: 'March 15, 2023',
    icon: '🫁'
  },
  {
    id: 2,
    title: 'Digestive Issue',
    date: 'March 12, 2023',
    icon: '🦠'
  },
  {
    id: 3,
    title: 'Joint Pain',
    date: 'March 10, 2023',
    icon: '🦴'
  },
  {
    id: 4,
    title: 'Skin Condition',
    date: 'March 8, 2023',
    icon: '🔬'
  },
  {
    id: 5,
    title: 'Eye Infection',
    date: 'March 5, 2023',
    icon: '👁️'
  }
];

export default function HomeScreen() {
  const router = useRouter();
  const scrollY = new Animated.Value(0);

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

        {/* Quick Actions */}
          <>
            {/* New Diagnosis Button */}
            <TouchableOpacity style={styles.diagnosisButton} onPress={handleStartDiagnosis}>
              <Stethoscope color="white" size={24} />
              <View style={styles.diagnosisButtonText}>
                <Text style={styles.diagnosisButtonTitle}>Start New Diagnosis</Text>
                <Text style={styles.diagnosisButtonSubtitle}>Get AI-powered results instantly</Text>
              </View>
            </TouchableOpacity>

            {/* Recent Diagnoses */}
            <Text style={styles.sectionTitle}>Recent Diagnoses</Text>
            <View style={styles.diagnosesWrapper}>
              <Animated.ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.diagnosesContainer}
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                  { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
              >
                {DIAGNOSES.map((diagnosis, index) => {
                  const ITEM_HEIGHT = 85; // Height of each diagnosis card + margin
                  const inputRange = [
                    (index - 1) * ITEM_HEIGHT,
                    index * ITEM_HEIGHT,
                    (index + 1) * ITEM_HEIGHT,
                  ];
                  const scale = scrollY.interpolate({
                    inputRange,
                    outputRange: [0.95, 1, 0.95],
                    extrapolate: 'clamp',
                  });
                  const opacity = scrollY.interpolate({
                    inputRange,
                    outputRange: [0.7, 1, 0.7],
                    extrapolate: 'clamp',
                  });

                  return (
                    <Animated.View
                      key={diagnosis.id}
                      style={[{
                        transform: [{ scale }],
                        opacity,
                      }]}
                    >
                      <BlurContainer intensity={80} tint="light" style={styles.diagnosisCard}>
                        <Text style={styles.diagnosisIcon}>{diagnosis.icon}</Text>
                        <View style={styles.diagnosisInfo}>
                          <Text style={styles.diagnosisTitle}>{diagnosis.title}</Text>
                          <Text style={styles.diagnosisDate}>{diagnosis.date}</Text>
                        </View>
                      </BlurContainer>
                    </Animated.View>
                  );
                })}
              </Animated.ScrollView>
            </View>

            {/* Quick Tools */}
            <Text style={styles.sectionTitle}>Quick Tools</Text>
            <View style={styles.quickTools}>
              <Link href="/guide" asChild>
                <TouchableOpacity style={styles.quickTool}>
                  <BlurContainer intensity={80} tint="light" style={styles.quickToolInner}>
                    <BookOpen size={24} color="#6f5415" />
                    <Text style={styles.quickToolText}>Disease{'\n'}Guide</Text>
                  </BlurContainer>
                </TouchableOpacity>
              </Link>
              <TouchableOpacity style={styles.quickTool}>
                <BlurContainer intensity={80} tint="light" style={styles.quickToolInner}>
                  <Truck size={24} color="#6f5415" />
                  <Text style={styles.quickToolText}>Emergency{'\n'}Vet</Text>
                </BlurContainer>
              </TouchableOpacity>
              <Link href="/saved" asChild>
                <TouchableOpacity style={styles.quickTool}>
                  <BlurContainer intensity={80} tint="light" style={styles.quickToolInner}>
                    <FileText size={24} color="#6f5415" />
                    <Text style={styles.quickToolText}>Saved{'\n'}Diagnoses</Text>
                  </BlurContainer>
                </TouchableOpacity>
              </Link>
            </View>
            </>
          {/* No closing tag needed */}
        
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
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
    padding: 20,
    paddingBottom: 100,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  welcomeCard: {
    backgroundColor: isWeb ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
    borderRadius: 20,
    padding: 30,
    marginBottom: 30,
    overflow: 'hidden',
    minHeight: 180,
    position: 'relative',
    width: '100%',
    flex: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  imageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    overflow: 'hidden',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    opacity: 0.15,
    resizeMode: 'cover'
  },
  welcomeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 1,
  },
  welcomeTextContainer: {
    flex: 1,
    paddingRight: 20,
  },
  settingsButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  welcomeEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  welcomeTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 28,
    color: '#34444c',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontFamily: 'Nunito-Regular',
    fontSize: 18,
    color: '#987a59',
  },
  cowIcon: {
    width: 80,
    height: 80,
    borderRadius: 25,
  },
  searchContainer: {
    backgroundColor: isWeb ? 'rgba(255, 255, 255, 0.85)' : 'transparent',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  searchContainerFocused: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 140 : 120,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: '#34444c',
    maxHeight: 100,
  },
  sendIcon: {
    marginLeft: 10,
  },
  diagnosisButton: {
    backgroundColor: '#c89826',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  diagnosisButtonText: {
    marginLeft: 15,
  },
  diagnosisButtonTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: 'white',
  },
  diagnosisButtonSubtitle: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#34444c',
    marginBottom: 15,
  },
  diagnosesWrapper: {
    height: 180,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 10,
  },
  diagnosesContainer: {
    paddingVertical: 5,
  },
  diagnosisCard: {
    backgroundColor: isWeb ? 'rgba(255, 255, 255, 0.85)' : 'transparent',
    borderRadius: 15,
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 2,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  diagnosisIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  diagnosisInfo: {
    flex: 1,
  },
  diagnosisTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#34444c',
  },
  diagnosisDate: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#987a59',
  },
  quickTools: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  quickTool: {
    width: '31%',
  },
  quickToolInner: {
    backgroundColor: isWeb ? 'rgba(255, 255, 255, 0.85)' : 'transparent',
    borderRadius: 15,
    padding: 15,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  quickToolText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#34444c',
    marginTop: 8,
    textAlign: 'center',
  },
});