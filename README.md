# Voice Virtual Assistant

A complete Voice Virtual Assistant project using ElevenLabs API for Speech-to-Text (STT) and Text-to-Speech (TTS) functionality.

## Project Stack

- **Frontend**: React with TypeScript and Vite
- **Backend**: NestJS with TypeScript
- **Package Manager**: pnpm
- **API Integration**: ElevenLabs for STT and TTS
- **Containerization**: Docker with multi-stage builds

## Architecture

### Backend (NestJS)
- Modular architecture with voice processing module
- RESTful API endpoints for audio processing
- ElevenLabs service integration
- Environment-based configuration
- Comprehensive error handling and logging

### Frontend (React + TypeScript)
- Modern React with hooks and TypeScript
- Real-time microphone capture using MediaRecorder API
- Audio playback for TTS responses
- Clean, developer-friendly UI
- Real-time conversation display

## Features

- 🎤 **Voice Recording**: Capture microphone input with noise suppression
- 🔤 **Speech-to-Text**: Convert audio to text using ElevenLabs
- 💬 **Conversation Processing**: Handle dialogue logic (placeholder implementation)
- 🔊 **Text-to-Speech**: Generate audio responses using ElevenLabs
- 📱 **Real-time UI**: Live status updates and conversation history
- 🔧 **Type Safety**: Full TypeScript coverage across frontend and backend

## Setup Instructions

### Prerequisites

**Option 1: Native Development**
- Node.js (v22 LTS recommended)
- pnpm package manager
- ElevenLabs API key

**Option 2: Docker Development**
- Docker and Docker Compose
- ElevenLabs API key

### 1. Clone and Setup

```bash
# Navigate to project directory
cd VirtualVoiceAssistant

# Copy environment file
cp .env.example backend/.env
```

### 2. Configure Environment

Edit `backend/.env` and add your ElevenLabs API key:

```env
ELEVENLABS_API_KEY=your_actual_api_key_here
PORT=3001
NODE_ENV=development
```

### 3. Install Dependencies

**Backend:**
```bash
cd backend
pnpm install
```

**Frontend:**
```bash
cd frontend
pnpm install
```

### 4. Run the Application

**Start Backend (Terminal 1):**
```bash
cd backend
pnpm start:dev
```

**Start Frontend (Terminal 2):**
```bash
cd frontend
pnpm dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Docker Setup (Alternative)

### Development with Docker

1. **Setup Environment**
```bash
# Copy environment file
cp .env.example .env

# Edit .env and add your ElevenLabs API key
# Example: ELEVENLABS_API_KEY=sk_your_actual_api_key_here
```

2. **Run with Docker Compose**
```bash
# Start development environment
docker-compose up

# Or run in background
docker-compose up -d

# View logs
docker-compose logs -f
```

3. **Stop the application**
```bash
docker-compose down
```

### Production with Docker

1. **Build and run production containers**
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production environment
docker-compose -f docker-compose.prod.yml up -d
```

The application will be available at:
- **Development**: Frontend http://localhost:3000, Backend http://localhost:3001
- **Production**: Frontend http://localhost (port 80), Backend proxied through frontend

### Docker Features

- 🐳 **Multi-stage builds** for optimized production images
- 🔒 **Security-first** with non-root users and proper signal handling
- 📊 **Health checks** for container monitoring
- 🚀 **Hot reload** in development mode
- 🗜️ **Alpine Linux** for minimal image size (Node.js 22 LTS)
- 🔄 **Proper signal handling** with dumb-init
- 📁 **Volume mounting** for development workflow

## API Endpoints

### Voice Processing

- `POST /voice/speech-to-text` - Upload audio file for transcription
- `POST /voice/text-to-speech` - Generate audio from text
- `GET /voice/voices` - Get available ElevenLabs voices
- `POST /voice/process-conversation` - Process conversation message

### Request/Response Examples

**Speech-to-Text:**
```javascript
// Request
FormData with 'audio' file

// Response
{
  "success": true,
  "transcription": "Hello, how are you?"
}
```

**Text-to-Speech:**
```javascript
// Request
{
  "text": "Hello, this is a response",
  "voiceId": "optional_voice_id"
}

// Response
Binary audio data (audio/mpeg)
```

## Project Structure

```
VirtualVoiceAssistant/
├── backend/
│   ├── src/
│   │   ├── voice/
│   │   │   ├── elevenlabs.service.ts    # ElevenLabs API integration
│   │   │   ├── voice.controller.ts      # API endpoints
│   │   │   └── voice.module.ts          # Module configuration
│   │   ├── app.module.ts                # Main application module
│   │   └── main.ts                      # Application entry point
│   ├── .env.example                     # Environment template
│   ├── Dockerfile                       # Multi-stage Docker build
│   ├── .dockerignore                    # Docker ignore patterns
│   ├── healthcheck.js                   # Container health check
│   ├── package.json                     # Backend dependencies
│   └── tsconfig.json                    # TypeScript configuration
├── frontend/
│   ├── src/
│   │   ├── hooks/
│   │   │   └── useMediaRecorder.ts      # Audio recording hook
│   │   ├── services/
│   │   │   └── voiceService.ts          # API client
│   │   ├── App.tsx                      # Main application component
│   │   ├── main.tsx                     # React entry point
│   │   └── index.css                    # Global styles
│   ├── Dockerfile                       # Multi-stage Docker build
│   ├── .dockerignore                    # Docker ignore patterns
│   ├── nginx.conf                       # Production nginx config
│   ├── package.json                     # Frontend dependencies
│   ├── vite.config.ts                   # Vite configuration
│   └── tsconfig.json                    # TypeScript configuration
├── docker-compose.yml                   # Development orchestration
├── docker-compose.prod.yml              # Production orchestration
├── .env.example                         # Global environment template
├── .env.docker.example                  # Docker environment template
└── README.md                            # This file
```

## Usage

1. **Start Recording**: Click "Start Recording" to begin capturing audio
2. **Stop Recording**: Click "Stop Recording" to end capture and process
3. **Processing**: The app will:
   - Convert your speech to text
   - Process the message (placeholder logic)
   - Generate an audio response
   - Play the response automatically
4. **View History**: All conversations are displayed in real-time

## Development

### Backend Scripts

```bash
pnpm start:dev    # Development mode with hot reload
pnpm build        # Build for production
pnpm start:prod   # Run production build
```

### Frontend Scripts

```bash
pnpm dev         # Development server
pnpm build       # Build for production
pnpm preview     # Preview production build
```

## Configuration

### ElevenLabs Settings

The application uses these default settings:
- **Voice ID**: `pNInz6obpgDQGcFmaJgB` (can be customized)
- **Model**: `eleven_multilingual_v2` for TTS
- **Audio Quality**: Optimized for real-time conversation

### Audio Settings

- **Format**: WebM with Opus codec
- **Features**: Echo cancellation, noise suppression, auto gain control
- **Sampling**: Optimized for speech recognition

## Troubleshooting

### Common Issues

1. **Microphone Permission**: Ensure browser has microphone access
2. **API Key**: Verify ElevenLabs API key is correctly set
3. **CORS**: Backend configured for localhost:3000 frontend
4. **Audio Format**: Some browsers may require different audio formats

### Error Handling

The application includes comprehensive error handling:
- Network connectivity issues
- API rate limiting
- Audio recording failures
- Invalid audio formats

## Next Steps

Current implementation includes placeholder dialogue logic. To extend:

1. **Add AI Integration**: Connect to OpenAI, Anthropic, or other LLM APIs
2. **Voice Selection**: Implement voice selection UI
3. **Audio Formats**: Support additional audio formats
4. **Real-time STT**: Implement streaming speech recognition
5. **Conversation Memory**: Add conversation context and memory

## License

ISC License