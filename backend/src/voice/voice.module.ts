import { Module } from '@nestjs/common';
import { VoiceController } from './voice.controller';
import { ElevenLabsService } from './elevenlabs.service';

@Module({
  controllers: [VoiceController],
  providers: [ElevenLabsService],
})
export class VoiceModule {}