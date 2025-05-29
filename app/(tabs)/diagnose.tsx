import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Keyboard, Modal, Pressable, ActivityIndicator } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Send, Save, X, ChevronDown } from 'lucide-react-native';
import { Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useDiagnosisAssistant } from '../../hooks/DiagnosisAssistantContext';

const isWeb = Platform.OS === 'web';
const BlurContainer = isWeb ? View : BlurView;

export default function DiagnoseScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const { symptoms } = useLocalSearchParams<{ symptoms: string }>();
  const [inputText, setInputText] = useState(symptoms || '');
  const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);
  const [diagnosisToSave, setDiagnosisToSave] = useState<{
    title: string;
    message: string;
    date: string;
    notes?: string;
    status?: string;
  } | null>(null);
  const [diagnosisNotes, setDiagnosisNotes] = useState('');

  const {
    assistantMessages,
    sendDiagnosisMessage,
    isAssistantProcessing,
    setAssistantMessages,
    saveDiagnosis
  } = useDiagnosisAssistant();

  // Auto-scroll when messages change
  useEffect(() => {
    if (assistantMessages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [assistantMessages]);

  useEffect(() => {
    if (symptoms && symptoms.trim()) {
      // Send initial symptoms as a message
      sendDiagnosisMessage(symptoms);
      setInputText('');
    }
    const keyboardWillShow = Platform.OS === 'ios'
      ? Keyboard.addListener('keyboardWillShow', () => setKeyboardVisible(true))
      : Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const keyboardWillHide = Platform.OS === 'ios'
      ? Keyboard.addListener('keyboardWillHide', () => setKeyboardVisible(false))
      : Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    // Add user message to chat and send to assistant
    setAssistantMessages((prev: any[]) => ([
      ...prev,
      { role: 'user', content: inputText }
    ]));
    sendDiagnosisMessage(inputText);
    setInputText('');
  };

  const handleSaveDiagnosis = (message: any) => {
    // Only allow saving assistant messages
    if (message.role !== 'assistant') return;
    
    // Try to extract disease_name directly from the structured format (disease_name: "Name")
    const diseaseNameMatch = message.content.match(/disease name[:\s]+(.*?)(?=[\n\r]|$)/i);
    let diseaseName = '';
    
    if (diseaseNameMatch && diseaseNameMatch[1]) {
      // Clean up the extracted disease name (remove stars, quotes, etc.)
      diseaseName = diseaseNameMatch[1].trim().replace(/[*"\n\r]/g, '');
    } else {
      // Fall back to generic extraction
      diseaseName = extractDiseaseTitle(message.content);
    }
    
    setDiagnosisToSave({
      title: diseaseName, // Use the properly extracted disease name as title
      message: message.content,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    });
    setDiagnosisNotes('');
    setIsSaveModalVisible(true);
  };

  const handleConfirmSave = async () => {
    if (!diagnosisToSave) return;
    
    const diagnosisData = {
      ...diagnosisToSave,
      notes: diagnosisNotes,
      status: 'Monitoring',
    };
    
    const success = await saveDiagnosis(diagnosisData);
    if (success) {
      // Show success feedback
      alert('Diagnosis saved successfully');
    } else {
      alert('Failed to save diagnosis');
    }
    
    setIsSaveModalVisible(false);
  };
  
  // Checks if the message contains disease information (from a function call)
  const isDiseaseInformation = (content: string): boolean => {
    // Look for patterns that indicate this is a disease diagnosis response
    return (
      // Look for disease name/risk level pattern
      /disease name|risk level|matching symptoms|treatment advice|prevention/i.test(content) && 
      // Should have at least 3 of these indicators to be considered a diagnosis
      (content.match(/disease|symptoms|treatment|prevention|risk/gi)?.length || 0) >= 3
    );
  };
  
  // Helper function to extract disease title from message content
  const extractDiseaseTitle = (content: string): string => {
    // Try to find disease name pattern in the content
    const diseaseMatch = content.match(/disease name|diagnosis|condition[:\s]+(.*?)(?=[\n\r]|$)/i);
    if (diseaseMatch && diseaseMatch[1]) {
      return diseaseMatch[1].trim().replace(/[*\n\r]/g, '');
    }
    
    // If no match, use first line or generic title
    const firstLine = content.split('\n')[0];
    return firstLine && firstLine.length < 40 ? firstLine : 'Health Diagnosis';
  };

  const renderLoadingIndicator = () => {
    if (!isAssistantProcessing) return null;

    const steps = [
      'Analyzing symptoms...',
      'Checking disease database...',
      'Generating diagnosis...',
      'Preparing recommendations...'
    ];

    const currentStep = Math.floor(Date.now() / 2000) % steps.length;

    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#c89826" size="small" />
        <Text style={styles.loadingText}>{steps[currentStep]}</Text>
        <View style={styles.dotsContainer}>
          {[0, 1, 2].map((dot) => (
            <View
              key={dot}
              style={[styles.dot, { opacity: (Date.now() / 500) % 3 === dot ? 1 : 0.3 }]}
            />
          ))}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? -10 : 0}
    >
      <LinearGradient
        colors={['#edcc9a', '#92ccce']}
        style={styles.gradientContainer}
        locations={[0, 0.5, 1]}
      >
        {/* Fixed Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>AI Diagnosis Assistant</Text>
          <Text style={styles.subtitle}>Describe your cattle's symptoms in detail</Text>
        </View>

        <ScrollView 
          ref={scrollViewRef}
          style={styles.scrollView} 
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          bounces={false}
          onScroll={({ nativeEvent }) => {
            const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
            const paddingToBottom = 20;
            const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= 
              contentSize.height - paddingToBottom;
            setShowScrollButton(!isCloseToBottom);
          }}
          scrollEventThrottle={400}>

        <View style={styles.chatContainer}>
          {assistantMessages.map((message: any, index: number) => (
            <View key={index} style={[
              styles.messageContainer,
              message.role === 'user' ? styles.userMessage : styles.aiMessage
            ]}>
              <Text style={styles.message}>{message.content}</Text>
              
              {/* Only show save button for messages with disease information */}
              {message.role === 'assistant' && isDiseaseInformation(message.content) && (
                <TouchableOpacity 
                  style={styles.saveButton}
                  onPress={() => handleSaveDiagnosis(message)}
                >
                  <Save size={16} color="#6f5415" />
                  <Text style={styles.saveButtonText}>Save Diagnosis</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
          {renderLoadingIndicator()}
        </View>
        </ScrollView>

        {/* Scroll down button */}
        {showScrollButton && (
          <TouchableOpacity 
            style={styles.scrollDownButton}
            onPress={() => {
              scrollViewRef.current?.scrollToEnd({ animated: true });
            }}
          >
            <ChevronDown size={24} color="#6f5415" />
          </TouchableOpacity>
        )}

        {/* Bottom blur overlay - iOS only */}
        {Platform.OS === 'ios' && (
          <>
            <BlurContainer 
              intensity={80} 
              tint="light" 
              style={[styles.bottomBlur, { 
                maxHeight: keyboardVisible ? 80 : 200
              }]}
            />
            {/* Additional gradient overlay */}
            <LinearGradient
              colors={['transparent', 'rgba(237, 204, 154, 0.95)']}
              style={[styles.bottomGradient, { 
                maxHeight: keyboardVisible ? 100 : 200
              }]}
            />
          </>
        )}
        
        {/* Input area */}
        <View style={[styles.inputWrapper, { 
          bottom: keyboardVisible ? 10 : Platform.OS === 'ios' ? 100 : 100,
          maxHeight: keyboardVisible ? 100 : 150
        }]}>
          <View style={styles.inputContainer}>
            <TextInput
              onFocus={() => {
                setTimeout(() => {
                  scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 50);
              }}
              style={[styles.input, keyboardVisible && styles.inputWithKeyboard]}
              placeholder="Type your message..."
              placeholderTextColor="#987a59"
              multiline
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSendMessage}
            />
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={handleSendMessage}
              disabled={isAssistantProcessing}
            >
              <Send size={24} color={isAssistantProcessing ? "#bbb" : "#6f5415"} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Save Diagnosis Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isSaveModalVisible}
          onRequestClose={() => setIsSaveModalVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Save This Diagnosis</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setIsSaveModalVisible(false)}
                >
                  <X size={20} color="#34444c" />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.diagnosisTitle}>{diagnosisToSave?.title}</Text>
              
              <Text style={styles.inputLabel}>Add notes about this diagnosis:</Text>
              <TextInput
                style={styles.notesInput}
                multiline
                placeholder="E.g., Observed symptoms, treatments applied, etc."
                value={diagnosisNotes}
                onChangeText={setDiagnosisNotes}
              />
              
              <Pressable
                style={styles.saveConfirmButton}
                onPress={handleConfirmSave}
              >
                <Text style={styles.saveConfirmButtonText}>Save to History</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

import { colors, typography, spacing, layout } from '../../styles/shared';

const styles = StyleSheet.create({
  scrollDownButton: {
    position: 'absolute',
    right: 20,
    marginBottom: 20,
    bottom: Platform.OS === 'ios' ? 170 : 170,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 25,
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
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

  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: spacing.md,
    borderRadius: layout.borderRadius.medium,
    marginVertical: spacing.sm,
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  loadingText: {
    ...typography.body,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginLeft: spacing.sm,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#c89826',
    marginHorizontal: 2,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: spacing.md,
    backgroundColor: Platform.select({
      ios: 'rgba(237, 204, 154, 0.95)',
      android: 'rgba(237, 204, 154, 0.95)',
      default: 'rgba(237, 204, 154, 0.95)',
    }),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  bottomBlur: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 160 : 140,
    backgroundColor: isWeb ? 'transparent' : 'transparent',
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 160 : 140,
    opacity: 0.95,
  },
  container: {
    flex: 1,
    backgroundColor: '#c8e6c9',
  },
  gradientContainer: {
    flex: 1,
    minHeight: '100%',
  },
  scrollView: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },
  contentContainer: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 130 : 130,
    paddingBottom: Platform.OS === 'ios' ? 220 : 200,
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
  chatContainer: {
    flex: 1,
    marginBottom: 20,
  },
  messageContainer: {
    backgroundColor: Platform.select({
      web: 'rgba(255, 255, 255, 0.98)',
      ios: 'transparent',
      android: 'rgb(255, 255, 255)',
    }),
    borderRadius: layout.borderRadius.medium,
    padding: spacing.md,
    marginBottom: spacing.sm,
    maxWidth: '80%',
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
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
  },
  aiMessage: {
    alignSelf: 'flex-start',
  },
  message: {
    ...typography.body,
    color: colors.text.primary,
  },
  inputWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: 'transparent',
  },
  inputContainer: {
    backgroundColor: Platform.select({
      web: 'rgba(255, 255, 255, 0.85)',
      ios: 'transparent',
      android: 'rgba(255, 255, 255, 0.98)',
    }),
    borderRadius: layout.borderRadius.medium,
    padding: spacing.md,
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
  input: {
    flex: 1,
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: '#34444c',
    maxHeight: 100,
  },
  inputWithKeyboard: {
    maxHeight: 60,
  },
  iconButton: {
    marginLeft: 10,
    padding: 8,
    borderRadius: 20,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 8,
    borderRadius: 15,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  saveButtonText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#6f5415',
    marginLeft: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: colors.background.light,
    borderRadius: layout.borderRadius.large,
    padding: spacing.xl,
    width: '90%',
    maxHeight: '60%',
    ...layout.shadow.large,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#34444c',
  },
  closeButton: {
    padding: 5,
  },
  diagnosisTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#6f5415',
    marginBottom: 15,
  },
  inputLabel: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#34444c',
    marginBottom: 5,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  saveConfirmButton: {
    backgroundColor: '#c89826',
    borderRadius: 15,
    padding: 12,
    alignItems: 'center',
  },
  saveConfirmButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: 'white',
  },
});