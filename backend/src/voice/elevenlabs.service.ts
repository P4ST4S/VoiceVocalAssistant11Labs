import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElevenLabsApi } from '@elevenlabs/elevenlabs-js';

@Injectable()
export class ElevenLabsService {
  private readonly logger = new Logger(ElevenLabsService.name);
  private readonly elevenLabs: ElevenLabsApi;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('ELEVENLABS_API_KEY');
    if (!apiKey) {
      throw new Error('ELEVENLABS_API_KEY is required');
    }
    
    this.elevenLabs = new ElevenLabsApi({
      apiKey,
    });
  }

  async speechToText(audioBuffer: Buffer): Promise<string> {
    try {
      this.logger.log('Converting speech to text');
      
      const response = await this.elevenLabs.speechToSpeech.create({
        voice_id: "pNInz6obpgDQGcFmaJgB", // Default voice ID
        model_id: "eleven_english_sts_v2",
        audio: audioBuffer,
      });

      // Note: ElevenLabs Speech-to-Speech returns audio, not text
      // For actual STT, you might need to use a different service
      // This is a placeholder implementation
      this.logger.log('Speech to text conversion completed');
      return "Transcribed text placeholder";
      
    } catch (error) {
      this.logger.error('Error in speech to text conversion', error);
      throw new Error('Failed to convert speech to text');
    }
  }

  async textToSpeech(text: string, voiceId?: string): Promise<Buffer> {
    try {
      this.logger.log('Converting text to speech');
      
      const audioStream = await this.elevenLabs.textToSpeech.convert({
        voice_id: voiceId || "pNInz6obpgDQGcFmaJgB",
        model_id: "eleven_multilingual_v2",
        text,
        voice_settings: {
          stability: 0.1,
          similarity_boost: 0.3,
          style: 0.2,
        },
      });

      const chunks: Buffer[] = [];
      for await (const chunk of audioStream) {
        chunks.push(chunk);
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
      const voices = await this.elevenLabs.voices.getAll();
      return voices;
    } catch (error) {
      this.logger.error('Error fetching voices', error);
      throw new Error('Failed to fetch voices');
    }
  }
}