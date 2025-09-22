const API_BASE_URL = '/api';

export interface SpeechToTextResponse {
  success: boolean;
  transcription?: string;
  error?: string;
}

export interface TextToSpeechResponse {
  success: boolean;
  error?: string;
}

export interface ProcessConversationResponse {
  success: boolean;
  response?: string;
  error?: string;
}

export class VoiceService {
  static async speechToText(audioBlob: Blob): Promise<SpeechToTextResponse> {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const response = await fetch(`${API_BASE_URL}/voice/speech-to-text`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error in speechToText:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to convert speech to text',
      };
    }
  }

  static async textToSpeech(text: string, voiceId?: string): Promise<Blob | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/voice/text-to-speech`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, voiceId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('Error in textToSpeech:', error);
      return null;
    }
  }

  static async processConversation(message: string): Promise<ProcessConversationResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/voice/process-conversation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error in processConversation:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process conversation',
      };
    }
  }

  static async playAudio(audioBlob: Blob): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        resolve();
      };
      
      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        reject(new Error('Failed to play audio'));
      };
      
      audio.src = audioUrl;
      audio.play().catch(reject);
    });
  }
}