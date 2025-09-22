import React, { useState, useCallback } from 'react';
import { useMediaRecorder } from './hooks/useMediaRecorder';
import { VoiceService } from './services/voiceService';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

type AppState = 'idle' | 'recording' | 'processing' | 'playing';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [appState, setAppState] = useState<AppState>('idle');
  const [error, setError] = useState<string | null>(null);
  
  const { isRecording, startRecording, stopRecording, error: recordingError } = useMediaRecorder();

  const addMessage = useCallback((type: 'user' | 'assistant', text: string) => {
    const message: Message = {
      id: Date.now().toString(),
      type,
      text,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, message]);
  }, []);

  const handleStartRecording = useCallback(async () => {
    try {
      setError(null);
      setAppState('recording');
      await startRecording();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start recording');
      setAppState('idle');
    }
  }, [startRecording]);

  const handleStopRecording = useCallback(async () => {
    try {
      setAppState('processing');
      const audioBlob = await stopRecording();
      
      if (!audioBlob) {
        setError('No audio recorded');
        setAppState('idle');
        return;
      }

      // Convert speech to text
      const sttResponse = await VoiceService.speechToText(audioBlob);
      
      if (!sttResponse.success || !sttResponse.transcription) {
        setError(sttResponse.error || 'Failed to transcribe audio');
        setAppState('idle');
        return;
      }

      // Add user message
      addMessage('user', sttResponse.transcription);

      // Process conversation
      const conversationResponse = await VoiceService.processConversation(sttResponse.transcription);
      
      if (!conversationResponse.success || !conversationResponse.response) {
        setError(conversationResponse.error || 'Failed to process conversation');
        setAppState('idle');
        return;
      }

      // Add assistant message
      addMessage('assistant', conversationResponse.response);

      // Convert response to speech
      const audioResponseBlob = await VoiceService.textToSpeech(conversationResponse.response);
      
      if (audioResponseBlob) {
        setAppState('playing');
        await VoiceService.playAudio(audioResponseBlob);
      }

      setAppState('idle');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setAppState('idle');
    }
  }, [stopRecording, addMessage]);

  const getStatusText = () => {
    switch (appState) {
      case 'recording':
        return 'Recording...';
      case 'processing':
        return 'Processing...';
      case 'playing':
        return 'Playing response...';
      default:
        return 'Ready';
    }
  };

  const getStatusClass = () => {
    switch (appState) {
      case 'recording':
        return 'status recording';
      case 'processing':
      case 'playing':
        return 'status processing';
      default:
        return 'status idle';
    }
  };

  return (
    <div className="App">
      <h1>Voice Virtual Assistant</h1>
      
      <div className="audio-controls">
        <button
          onClick={appState === 'recording' ? handleStopRecording : handleStartRecording}
          disabled={appState === 'processing' || appState === 'playing'}
          className={appState === 'recording' ? 'recording' : ''}
        >
          {appState === 'recording' ? 'Stop Recording' : 'Start Recording'}
        </button>
        
        <div className={getStatusClass()}>
          {getStatusText()}
        </div>
      </div>

      {(error || recordingError) && (
        <div className="message-container" style={{ borderColor: '#dc2626', backgroundColor: '#7f1d1d' }}>
          <h3>Error</h3>
          <p>{error || recordingError}</p>
          <button onClick={() => { setError(null); }}>Dismiss</button>
        </div>
      )}

      <div className="conversation">
        {messages.map((message) => (
          <div key={message.id} className="message-container">
            <h3>{message.type === 'user' ? 'You' : 'Assistant'}</h3>
            <p>{message.text}</p>
            <small>{message.timestamp.toLocaleTimeString()}</small>
          </div>
        ))}
      </div>

      {messages.length === 0 && (
        <div className="message-container">
          <h3>Welcome!</h3>
          <p>Click "Start Recording" to begin a conversation with your voice assistant.</p>
          <p>The assistant will:</p>
          <ul style={{ textAlign: 'left', marginLeft: '1rem' }}>
            <li>Listen to your voice</li>
            <li>Convert speech to text</li>
            <li>Process your message</li>
            <li>Respond with synthesized speech</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;