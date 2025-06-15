import { createContext, useContext, useState, useEffect } from 'react';
import OpenAI from 'openai';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OPENAI_API_KEY, ASSISTANT_ID } from '../config/keys';

const DiagnosisAssistantContext = createContext({
  savedDiagnoses: [],
  updateDiagnosisStatus: undefined,
  assistantMessages: [],
  sendDiagnosisMessage: undefined,
  isAssistantProcessing: false,
  setAssistantMessages: undefined,
  currentDiagnosis: null,
  setCurrentDiagnosis: undefined,
  saveDiagnosis: undefined,
  clearChat: undefined
});
const STORAGE_KEY = '@hutano_saved_diagnoses';

export function DiagnosisAssistantProvider({ children }) {
  const [assistantMessages, setAssistantMessages] = useState([]);
  const [assistantThread, setAssistantThread] = useState(null);
  const [isAssistantProcessing, setIsAssistantProcessing] = useState(false);
  const [currentDiagnosis, setCurrentDiagnosis] = useState(null);
  const [savedDiagnoses, setSavedDiagnoses] = useState([]);
  const [tempDiagnosis, setTempDiagnosis] = useState({
    disease: '',
    riskLevel: '',
    matchingSymptoms: [],
    treatmentAdvice: '',
    preventionTips: '',
    references: [],
    icon: null
  });

  // const openai = new OpenAI({
  //   apiKey: OPENAI_API_KEY,
  //   dangerouslyAllowBrowser: true,
  // });

  const getReadableDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  function generateTopicJson(toolOutput, threadId) {
    // toolOutput is parsed JSON from the tool call output
    let title = toolOutput.disease || 'General Inquiry';
    let icon = toolOutput.icon || '💬';
    // If icon not provided, choose based on disease or riskLevel
    if (!toolOutput.icon) {
      if (title.toLowerCase().includes('respiratory')) {
        icon = '🫁';
      } else if (title.toLowerCase().includes('fever')) {
        icon = '🌡️';
      } else if (title.toLowerCase().includes('diarrhea')) {
        icon = '💩';
      } else if (title.toLowerCase().includes('skin')) {
        icon = '🦠';
      } else if (toolOutput.riskLevel && toolOutput.riskLevel.toLowerCase().includes('high')) {
        icon = '⚠️';
      }
      console.log('[Assistant] Topic generator toolOutput:', toolOutput);
    }
    return {
      id: threadId,
      title,
      date: getReadableDate(),
      icon
    };
  };

  async function saveTopicToHistory(topicJson) {
    try {
      console.log('[Assistant] Saving topic to AsyncStorage:', topicJson);
      const historyRaw = await AsyncStorage.getItem('topic_history');
      let history = [];
      if (historyRaw) history = JSON.parse(historyRaw);
      history.push(topicJson);
      await AsyncStorage.setItem('topic_history', JSON.stringify(history));
      console.log('[Assistant] Topic saved to AsyncStorage.');
    } catch (err) {
      console.error('[Assistant] Failed to save topic history:', err);
    }
  };

  // Remove asterisks from text
  const removeAsterisks = (text) => {
    return text.replace(/\*/g, '');
  };

  const sendDiagnosisMessage = async (userMessage) => {
    setIsAssistantProcessing(true);
    try {
      let thread = assistantThread;
      let isFirstMessage = false;
      // If no thread, create it first
      if (!thread) {
        console.log('[Assistant] Creating new thread...');
        thread = await openai.beta.threads.create();
        setAssistantThread(thread);
        isFirstMessage = true;
        console.log('[Assistant] New thread created:', thread.id);
      }

      console.log('[Assistant] Adding user message to thread:', thread.id, userMessage);
      await openai.beta.threads.messages.create(thread.id, {
        role: 'user',
        content: userMessage
      });
      console.log('[Assistant] User message added.');

      console.log('[Assistant] Creating run for thread:', thread.id);
      let run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: ASSISTANT_ID,
        tool_choice: 'auto',
      });
      console.log('[Assistant] Run created:', run.id, 'Status:', run.status);

      // Poll for run status completion
      console.log('[Assistant] Polling for run completion...');
      do {
        run = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        console.log('[Assistant] Run status:', run.status);
        if (run.status === 'completed' || run.status === 'requires_action') break;
        await new Promise(resolve => setTimeout(resolve, 1500));
      } while (run.status === 'in_progress' || run.status === 'queued');

      // Handle tool/function call if required
      let toolOutputForTopic = null;
      if (run.status === 'requires_action') {
        console.log('[Assistant] Run requires action: tool/function call(s)');
        // Loop through all tool calls
        const toolCalls = run.required_action.submit_tool_outputs.tool_calls;
        const toolOutputs = [];
        console.log('[Assistant] Debug - All tool calls:', JSON.stringify(toolCalls));
        for (const toolCall of toolCalls) {
          console.log('[Assistant] Debug - Tool call object:', JSON.stringify(toolCall));
          
          // Access function properties correctly based on API structure
          const functionName = toolCall.function?.name;
          const functionArguments = toolCall.function?.arguments;
          
          console.log('[Assistant] Handling tool call:', functionName, functionArguments);
          
          let args = {};
          try {
            if (functionArguments && typeof functionArguments === 'string') {
              args = JSON.parse(functionArguments);
            } else {
              console.log('[Assistant] Warning: Tool call arguments is undefined or not a string');
            }
          } catch (parseError) {
            console.error('[Assistant] Error parsing tool call arguments:', parseError);
            console.log('[Assistant] Raw arguments received:', toolCall.arguments);
          }
          
          const output = {
            disease: args.disease_name || 'Unknown Disease',
            riskLevel: args.risk_level || 'Not classified',
            matchingSymptoms: Array.isArray(args.matching_symptoms) ? args.matching_symptoms : [],
            treatmentAdvice: args.treatment_advice || 'No treatment advice found.',
            preventionTips: args.prevention_tips || 'No prevention tips found.',
            references: Array.isArray(args.references) ? args.references : [],
            icon: args.icon || null
          };
          
          // Store the diagnosis temporarily
          setTempDiagnosis(output);

          console.log("Here is the output",output)
          
          toolOutputs.push({ tool_call_id: toolCall.id, output: JSON.stringify(output) });
          console.log('[Assistant] Added tool output for:', toolCall.id);
          // For topic, use the first tool output
          if (!toolOutputForTopic) toolOutputForTopic = output;
        }
        console.log('[Assistant] Submitting tool outputs:', toolOutputs);
        await openai.beta.threads.runs.submitToolOutputs(thread.id, run.id, {
          tool_outputs: toolOutputs
        });
        // Wait for completion
        let finalRun;
        do {
          finalRun = await openai.beta.threads.runs.retrieve(thread.id, run.id);
          await new Promise(resolve => setTimeout(resolve, 1500));
        } while (finalRun.status !== 'completed');
        console.log('[Assistant] Tool outputs submitted and run completed.');
      }

      console.log('[Assistant] Fetching updated messages for thread:', thread.id);
      const messages = await openai.beta.threads.messages.list(thread.id);
      const orderedMessages = messages.data.reverse();
      setAssistantMessages(orderedMessages.map(m => {
        // Safely extract content from potentially different message formats
        let content = '';
        try {
          if (Array.isArray(m.content) && m.content.length > 0) {
            if (m.content[0].type === 'text' && m.content[0].text && m.content[0].text.value) {
              content = m.content[0].text.value;
            } else {
              // Try to extract any text content from the array
              content = m.content
                .filter(c => c.type === 'text' && c.text && c.text.value)
                .map(c => c.text.value)
                .join('\n');
            }
          } else if (typeof m.content === 'string') {
            content = m.content;
          }

          // Remove asterisks from content if it's from the assistant
          if (m.role === 'assistant') {
            content = removeAsterisks(content);
          }
        } catch (err) {
          console.error('[Assistant] Error extracting message content:', err);
          content = 'Error processing message';
        }
        return { id: m.id, role: m.role, content };
      }));
      console.log('[Assistant] Messages updated:', orderedMessages.map(m => m.id));

      // After first message, generate and save topicJson
      if (isFirstMessage) {
        console.log('[Assistant] Generating topic JSON for thread:', thread.id);
        const topicJson = generateTopicJson(toolOutputForTopic || {}, thread.id);
        saveTopicToHistory(topicJson);
      }

    } catch (err) {
      console.error('[Assistant] Error in sendDiagnosisMessage:', err);
      setAssistantMessages(prev => ([...prev, { role: 'assistant', content: 'Sorry, there was a problem communicating with the assistant.' }]));
    } finally {
      setIsAssistantProcessing(false);
    }
  };

  // Load saved diagnoses on mount
  useEffect(() => {
    loadSavedDiagnoses();
  }, []);

  // Load saved diagnoses from AsyncStorage
  const loadSavedDiagnoses = async () => {
    try {
      const savedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Validate and transform data if needed
        const validDiagnoses = parsedData.map(item => ({
          id: item.id || Date.now(),
          disease: item.disease || item.details?.disease || 'Unknown Disease',
          riskLevel: item.riskLevel || item.details?.riskLevel || 'Not classified',
          matchingSymptoms: Array.isArray(item.matchingSymptoms) ? item.matchingSymptoms : 
                          Array.isArray(item.details?.matchingSymptoms) ? item.details.matchingSymptoms : [],
          treatmentAdvice: item.treatmentAdvice || item.details?.treatmentAdvice || 'No treatment advice found.',
          preventionTips: item.preventionTips || item.details?.preventionTips || 'No prevention tips found.',
          references: Array.isArray(item.references) ? item.references :
                     Array.isArray(item.details?.references) ? item.details.references : [],
          icon: item.icon || item.details?.icon || '🐄',
          date: item.date || new Date().toLocaleDateString(),
          status: item.status || 'Monitoring',
          notes: item.notes || ''
        }));

        console.log("Here are the valid diagnoses:", validDiagnoses);
        setSavedDiagnoses(validDiagnoses);
      }
    } catch (error) {
      console.error('Error loading saved diagnoses:', error);
      setSavedDiagnoses([]);
    }
  };

  // Save diagnosis from temp storage
  const saveDiagnosis = async (notes = '') => {
    if (!tempDiagnosis) return;

    const newDiagnosis = {
      id: Date.now(),
      disease: tempDiagnosis.disease || 'Unknown Disease',
      riskLevel: tempDiagnosis.riskLevel || 'Not classified',
      matchingSymptoms: Array.isArray(tempDiagnosis.matchingSymptoms) ? tempDiagnosis.matchingSymptoms : [],
      treatmentAdvice: tempDiagnosis.treatmentAdvice || 'No treatment advice found.',
      preventionTips: tempDiagnosis.preventionTips || 'No prevention tips found.',
      references: Array.isArray(tempDiagnosis.references) ? tempDiagnosis.references : [],
      icon: tempDiagnosis.icon || '🐄',
      date: new Date().toLocaleDateString(),
      status: 'Monitoring',
      notes: notes || ''
    };

    const updatedDiagnoses = [...savedDiagnoses, newDiagnosis];
    console.log("Here is the diagnosis to be saved:", newDiagnosis);
    
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDiagnoses));
      setSavedDiagnoses(updatedDiagnoses);
      setTempDiagnosis({
        disease: '',
        riskLevel: '',
        matchingSymptoms: [],
        treatmentAdvice: '',
        preventionTips: '',
        references: [],
        icon: null
      });
      return newDiagnosis;
    } catch (error) {
      console.error('Error saving diagnosis:', error);
      return null;
    }
  };

  // Update diagnosis status
  const updateDiagnosisStatus = async (id, status, notes) => {
    const updatedDiagnoses = savedDiagnoses.map(diagnosis => {
      if (diagnosis.id === id) {
        return { 
          ...diagnosis, 
          status, 
          notes: notes || diagnosis.notes,
          date: new Date().toLocaleDateString() // Update date when status changes
        };
      }
      return diagnosis;
    });

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDiagnoses));
      setSavedDiagnoses(updatedDiagnoses);
    } catch (error) {
      console.error('Error updating diagnosis:', error);
    }
  };

  // Clear all messages and start fresh
  const clearChat = () => {
    setAssistantMessages([]);
    setAssistantThread(null);
    setCurrentDiagnosis(null);
    setTempDiagnosis(null);
  };

  const contextValue = {
    assistantMessages,
    sendDiagnosisMessage,
    clearChat,
    isAssistantProcessing,
    setAssistantMessages,
    currentDiagnosis,
    setCurrentDiagnosis,
    savedDiagnoses,
    saveDiagnosis,
    updateDiagnosisStatus,
    tempDiagnosis,
    setTempDiagnosis
  };

  return (
    <DiagnosisAssistantContext.Provider value={contextValue}>
      {children}
    </DiagnosisAssistantContext.Provider>
  );
}

export const useDiagnosisAssistant = () => {
  const context = useContext(DiagnosisAssistantContext);
  if (!context) {
    throw new Error('useDiagnosisAssistant must be used within a DiagnosisAssistantProvider');
  }
  return context;
};
