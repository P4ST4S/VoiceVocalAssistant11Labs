import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

@Injectable()
export class ElevenLabsService {
  private readonly logger = new Logger(ElevenLabsService.name);
  private readonly elevenLabs: ElevenLabsClient;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('ELEVENLABS_API_KEY');
    if (!apiKey) {
      throw new Error('ELEVENLABS_API_KEY is required');
    }
    
    this.elevenLabs = new ElevenLabsClient({
      apiKey,
    });
  }

  async speechToText(audioBuffer: Buffer): Promise<string> {
    try {
      this.logger.log('Converting speech to text');
      
      // Note: ElevenLabs primarily focuses on TTS, not STT
      // This is a placeholder implementation that simulates transcription
      // In a real implementation, you would use a dedicated STT service like:
      // - OpenAI Whisper API
      // - Google Speech-to-Text
      // - Azure Speech Services
      // - Amazon Transcribe
      
      this.logger.log('Speech to text conversion completed (placeholder)');
      return "Hello, this is a placeholder transcription. Please integrate a real STT service.";
      
    } catch (error) {
      this.logger.error('Error in speech to text conversion', error);
      throw new Error('Failed to convert speech to text');
    }
  }

  async textToSpeech(text: string, voiceId?: string): Promise<Buffer> {
    try {
      this.logger.log('Converting text to speech');
      
      const audioStream = await this.elevenLabs.textToSpeech.convert(
        voiceId || "pNInz6obpgDQGcFmaJgB",
        {
          text,
          modelId: "eleven_multilingual_v2",
          voiceSettings: {
            stability: 0.1,
            similarityBoost: 0.3,
            style: 0.2,
          },
        }
      );

      const chunks: Buffer[] = [];
      for await (const chunk of audioStream) {
        chunks.push(Buffer.from(chunk));
      }

      const audioBuffer = Buffer.concat(chunks);
      this.logger.log('Text to speech conversion completed');
      return audioBuffer;
      
    } catch (error) {
      this.logger.error('Error in text to speech conversion', error);
      throw new Error('Failed to convert text to speech');
    }
  }

  async getVoices() {
    try {
      this.logger.log('Fetching available voices');
      const voices = await this.elevenLabs.voices.search();
      return voices;
    } catch (error) {
      this.logger.error('Error fetching voices', error);
      throw new Error('Failed to fetch voices');
    }
  }
}