import React, { useState, useEffect } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Monitor, 
  MonitorOff, 
  Phone, 
  PhoneOff,
  Users,
  MessageSquare,
  Settings,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  Camera,
  Wifi,
  WifiOff,
  Clock,
  FileText,
  Save
} from 'lucide-react';

interface TelehealthSession {
  id: string;
  appointment_id: string;
  patient_name: string;
  provider_name: string;
  scheduled_time: string;
  status: 'waiting' | 'active' | 'completed';
  room_id: string;
}

export function TelehealthPlatform() {
  const [currentSession, setCurrentSession] = useState<TelehealthSession | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor'>('good');
  const [sessionNotes, setSessionNotes] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sessionDuration, setSessionDuration] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  // Mock session data
  useEffect(() => {
    setCurrentSession({
      id: '1',
      appointment_id: 'apt-123',
      patient_name: 'Sarah Johnson',
      provider_name: 'Dr. Michael Chen',
      scheduled_time: '2025-01-16T14:30:00Z',
      status: 'active',
      room_id: 'room-abc123'
    });

    // Mock session timer
    const timer = setInterval(() => {
      setSessionDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    if (currentSession) {
      setCurrentSession({ ...currentSession, status: 'completed' });
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      sender: 'Dr. Michael Chen',
      content: newMessage,
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const getConnectionIcon = () => {
    switch (connectionQuality) {
      case 'excellent': return <Wifi className="h-4 w-4 text-green-600" />;
      case 'good': return <Wifi className="h-4 w-4 text-yellow-600" />;
      case 'poor': return <WifiOff className="h-4 w-4 text-red-600" />;
    }
  };

  if (!currentSession) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Active Session</h2>
          <p className="text-gray-500">Start a telehealth consultation to begin</p>
        </div>
      </div>
    );
  }

  if (currentSession.status === 'completed') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Session Completed</h2>
          <p className="text-gray-500 mb-4">
            Your telehealth consultation with {currentSession.patient_name} has ended.
          </p>
          <p className="text-sm text-gray-400 mb-6">
            Duration: {formatDuration(sessionDuration)}
          </p>
          <div className="space-y-3">
            <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">
              Save Session Notes
            </button>
            <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50">
              Schedule Follow-up
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-white text-sm">Live Session</span>
            </div>
            <div className="text-white">
              <span className="font-medium">{currentSession.patient_name}</span>
              <span className="text-gray-300 ml-2">• {formatDuration(sessionDuration)}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-white">
              {getConnectionIcon()}
              <span className="text-sm capitalize">{connectionQuality}</span>
            </div>
            
            {isRecording && (
              <div className="flex items-center space-x-2 text-red-400">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm">Recording</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Area */}
        <div className="flex-1 relative">
          {/* Main Video */}
          <div className="h-full bg-gray-800 flex items-center justify-center relative">
            <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">
                    {currentSession.patient_name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <p className="text-lg font-medium">{currentSession.patient_name}</p>
                <p className="text-indigo-200">Patient</p>
              </div>
            </div>

            {/* Picture-in-Picture (Provider) */}
            <div className="absolute top-4 right-4 w-48 h-36 bg-gray-700 rounded-lg border-2 border-gray-600 overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-sm font-bold">
                      {currentSession.provider_name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <p className="text-xs">{currentSession.provider_name}</p>
                </div>
              </div>
            </div>

            {/* Screen Sharing Indicator */}
            {isScreenSharing && (
              <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-2">
                <Monitor className="h-4 w-4" />
                <span>Screen Sharing</span>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="bg-gray-800 bg-opacity-90 rounded-full px-6 py-3 flex items-center space-x-4">
              <button
                onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                className={`p-3 rounded-full ${isVideoEnabled ? 'bg-gray-600 hover:bg-gray-500' : 'bg-red-600 hover:bg-red-500'} text-white transition-colors`}
              >
                {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </button>
              
              <button
                onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                className={`p-3 rounded-full ${isAudioEnabled ? 'bg-gray-600 hover:bg-gray-500' : 'bg-red-600 hover:bg-red-500'} text-white transition-colors`}
              >
                {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </button>
              
              <button
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                className={`p-3 rounded-full ${isScreenSharing ? 'bg-blue-600 hover:bg-blue-500' : 'bg-gray-600 hover:bg-gray-500'} text-white transition-colors`}
              >
                {isScreenSharing ? <MonitorOff className="h-5 w-5" /> : <Monitor className="h-5 w-5" />}
              </button>
              
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={`p-3 rounded-full ${isRecording ? 'bg-red-600 hover:bg-red-500' : 'bg-gray-600 hover:bg-gray-500'} text-white transition-colors`}
              >
                <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center">
                  {isRecording && <div className="w-2 h-2 bg-current rounded-full"></div>}
                </div>
              </button>
              
              <button
                onClick={handleEndCall}
                className="p-3 rounded-full bg-red-600 hover:bg-red-500 text-white transition-colors"
              >
                <PhoneOff className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-gray-900">Session Tools</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button className="flex-1 py-3 px-4 text-sm font-medium text-indigo-600 border-b-2 border-indigo-600">
                Chat
              </button>
              <button className="flex-1 py-3 px-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                Notes
              </button>
              <button className="flex-1 py-3 px-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                Files
              </button>
            </nav>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((message) => (
                <div key={message.id} className="flex justify-end">
                  <div className="bg-indigo-600 text-white px-3 py-2 rounded-lg max-w-xs">
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs text-indigo-100 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {chatMessages.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No messages yet</p>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}