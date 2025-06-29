# ConnectHub - Real-time Messaging & Video Calling Platform

A modern, full-featured real-time messaging and video calling web application built with the MERN stack.

## Features

### 🔐 Authentication
- Google OAuth integration
- JWT-based session management
- Secure user authentication

### 💬 Real-time Messaging
- One-on-one and group chats
- Real-time message delivery via Socket.IO
- Typing indicators
- Message status (sent, delivered, read)
- Online/offline user status

### 📹 Video Calling
- WebRTC-powered video calls
- Audio/video controls (mute, camera toggle)
- Screen sharing capability
- Call duration tracking
- Room-based calling system

### 🎨 Modern UI/UX
- Responsive design with Tailwind CSS
- Clean, intuitive interface
- Real-time updates
- Mobile-friendly design

### 🏗️ Technical Features
- Redux Toolkit for state management
- Socket.IO for real-time communication
- MongoDB for data persistence
- Express.js REST API
- WebRTC for peer-to-peer communication

## Tech Stack

### Frontend
- **React 18** - UI library
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Socket.IO Client** - Real-time communication
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.IO** - Real-time communication
- **MongoDB** - Database
- **Mongoose** - ODM
- **Passport.js** - Authentication
- **Google OAuth 2.0** - Social authentication

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Google OAuth credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd connecthub
   ```

2. **Install dependencies**
   ```bash
   npm run install-deps
   ```

3. **Set up environment variables**
   
   Create `.env` file in the `server` directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/connecthub
   SESSION_SECRET=your-super-secret-session-key
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   CLIENT_URL=http://localhost:5173
   PORT=5000
   NODE_ENV=development
   ```

4. **Set up Google OAuth**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`

5. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend server on `http://localhost:5173`
   - Backend server on `http://localhost:5000`

## Project Structure

```
connecthub/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Redux store and slices
│   │   ├── utils/         # Utility functions
│   │   └── App.jsx        # Main app component
│   └── package.json
├── server/                # Node.js backend
│   ├── config/           # Configuration files
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── socket/           # Socket.IO handlers
│   ├── middleware/       # Custom middleware
│   └── index.js          # Server entry point
└── package.json          # Root package.json
```

## API Endpoints

### Authentication
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Chats
- `GET /api/chats` - Get user's chats
- `POST /api/chats` - Create new chat
- `GET /api/chats/:chatId/messages` - Get chat messages
- `POST /api/chats/:chatId/messages` - Send message

### Users
- `GET /api/users/search` - Search users
- `GET /api/users/:userId` - Get user profile
- `PUT /api/users/profile` - Update profile

## Socket Events

### Chat Events
- `joinChat` - Join a chat room
- `leaveChat` - Leave a chat room
- `newMessage` - New message received
- `startTyping` / `stopTyping` - Typing indicators
- `messageDelivered` / `messageRead` - Message status updates

### Call Events
- `join-room` / `leave-room` - Video call room management
- `offer` / `answer` - WebRTC signaling
- `ice-candidate` - ICE candidate exchange
- `initiateCall` / `acceptCall` / `rejectCall` / `endCall` - Call management

## Deployment

### Frontend (Netlify/Vercel)
1. Build the client:
   ```bash
   cd client && npm run build
   ```
2. Deploy the `dist` folder to your hosting service

### Backend (Heroku/Railway/DigitalOcean)
1. Set environment variables on your hosting platform
2. Deploy the `server` directory
3. Ensure MongoDB connection is configured

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Socket.IO for real-time communication
- WebRTC for peer-to-peer video calling
- Google for OAuth authentication
- MongoDB for data persistence
- The React and Node.js communities