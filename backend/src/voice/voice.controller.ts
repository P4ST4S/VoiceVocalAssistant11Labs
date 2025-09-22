import {
  Controller,
  Post,
  Get,
  Body,
  UseInterceptors,
  UploadedFile,
  Res,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ElevenLabsService } from './elevenlabs.service';

@Controller('voice')
export class VoiceController {
  private readonly logger = new Logger(VoiceController.name);

  constructor(private readonly elevenLabsService: ElevenLabsService) {}

  @Post('speech-to-text')
  @UseInterceptors(FileInterceptor('audio'))
  async speechToText(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No audio file provided');
    }

    try {
      this.logger.log('Processing speech to text request');
      const transcription = await this.elevenLabsService.speechToText(file.buffer);
      
      return {
        success: true,
        transcription,
      };
    } catch (error) {
      this.logger.error('Error processing speech to text', error);
      return {
        success: false,
        error: 'Failed to process audio',
      };
    }
  }

  @Post('text-to-speech')
  async textToSpeech(
    @Body() body: { text: string; voiceId?: string },
    @Res() res: Response,
  ) {
    if (!body.text) {
      throw new BadRequestException('No text provided');
    }

    try {
      this.logger.log('Processing text to speech request');
      const audioBuffer = await this.elevenLabsService.textToSpeech(
        body.text,
        body.voiceId,
      );

      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length,
        'Content-Disposition': 'inline; filename="speech.mp3"',
      });

      res.send(audioBuffer);
    } catch (error) {
      this.logger.error('Error processing text to speech', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate speech',
      });
    }
  }

  @Get('voices')
  async getVoices() {
    try {
      this.logger.log('Fetching available voices');
      const voices = await this.elevenLabsService.getVoices();
      
      return {
        success: true,
        voices,
      };
    } catch (error) {
      this.logger.error('Error fetching voices', error);
      return {
        success: false,
        error: 'Failed to fetch voices',
      };
    }
  }

  @Post('process-conversation')
  async processConversation(@Body() body: { message: string }) {
    if (!body.message) {
      throw new BadRequestException('No message provided');
    }

    try {
      this.logger.log('Processing conversation message');
      
      // Placeholder for dialogue logic
      const response = `You said: "${body.message}". This is a placeholder response from the virtual assistant.`;
      
      return {
        success: true,
        response,
      };
    } catch (error) {
      this.logger.error('Error processing conversation', error);
      return {
        success: false,
        error: 'Failed to process conversation',
      };
    }
  }
}