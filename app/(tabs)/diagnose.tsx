import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Keyboard } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Send } from 'lucide-react-native';
import { Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useDiagnosisAssistant } from '../../hooks/DiagnosisAssistantContext';

const isWeb = Platform.OS === 'web';
const BlurContainer = isWeb ? View : BlurView;

export default function DiagnoseScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const { symptoms } = useLocalSearchParams<{ symptoms: string }>();
  const [inputText, setInputText] = useState(symptoms || '');

  const {
    assistantMessages,
    sendDiagnosisMessage,
    isAssistantProcessing,
    setAssistantMessages
  } = useDiagnosisAssistant();

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


  return (
    <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? -10 : 0}
      >
      <LinearGradient colors={['#edcc9a', '#92ccce']} style={styles.gradientContainer}>
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
          bounces={false}>

        <View style={styles.chatContainer}>
          {assistantMessages.map((message: any, index: number) => (
            <BlurContainer key={index} intensity={30} tint="light" style={[
              styles.messageContainer,
              message.role === 'user' ? styles.userMessage : styles.aiMessage
            ]}>
              <Text style={styles.message}>{message.content}</Text>
            </BlurContainer>
          ))}
        </View>
        </ScrollView>

        {/* Bottom blur overlay */}
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

        {/* Input area */}
        <View style={[styles.inputWrapper, { 
          bottom: keyboardVisible ? 10 : Platform.OS === 'ios' ? 100 : 100,
          maxHeight: keyboardVisible ? 100 : 150
        }]}>
          <BlurContainer intensity={30} tint="light" style={styles.inputContainer}>
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
          </BlurContainer>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 15,
    backgroundColor: 'rgba(237, 204, 154, 0.95)',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    opacity: 0.9,
  },
  container: {
    flex: 1,
  },
  gradientContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },
  contentContainer: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 130 : 130,
    paddingBottom: Platform.OS === 'ios' ? 180 : 160,
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
  chatContainer: {
    flex: 1,
    marginBottom: 20,
  },
  messageContainer: {
    backgroundColor: isWeb ? 'rgba(255, 255, 255, 0.85)' : 'transparent',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    maxWidth: '80%',
    backdropFilter: 'blur(10px)',
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
    backgroundColor: '#c89826',
  },
  aiMessage: {
    alignSelf: 'flex-start',
  },
  message: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: '#34444c',
  },
  inputWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  inputContainer: {
    backgroundColor: isWeb ? 'rgba(255, 255, 255, 0.85)' : 'transparent',
    borderRadius: 15,
    padding: 15,
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
});