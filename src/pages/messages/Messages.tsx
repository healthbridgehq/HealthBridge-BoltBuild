import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppStore } from '../../stores/appStore';
import { MessageSquare, Send, Paperclip, Search, Filter, Plus, User } from 'lucide-react';

interface Conversation {
  id: string;
  provider_name: string;
  provider_specialty: string;
  subject: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'active' | 'archived' | 'closed';
}

interface Message {
  id: string;
  sender_name: string;
  sender_type: 'patient' | 'provider';
  content: string;
  timestamp: string;
  message_type: 'text' | 'appointment_request' | 'prescription_request';
}

export function Messages() {
  const location = useLocation();
  const { addNotification } = useAppStore();
  
  // Get pre-selected patient from navigation state
  const preSelectedPatient = location.state?.patientId;
  
  // State management
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(preSelectedPatient || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation);
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock data - in production this would come from Supabase
    setConversations([
      {
        id: '1',
        provider_name: 'Dr. Sarah Johnson',
        provider_specialty: 'General Practice',
        subject: 'Follow-up on recent consultation',
        last_message: 'Please let me know how you\'re feeling after the medication change.',
        last_message_time: '2025-01-15T14:30:00Z',
        unread_count: 1,
        priority: 'normal',
        status: 'active'
      },
      {
        id: '2',
        provider_name: 'Dr. Michael Chen',
        provider_specialty: 'Cardiology',
        subject: 'Blood pressure monitoring',
        last_message: 'Your latest readings look good. Keep up the good work!',
        last_message_time: '2025-01-14T10:15:00Z',
        unread_count: 0,
        priority: 'normal',
        status: 'active'
      },
      {
        id: '3',
        provider_name: 'Practice Nurse',
        provider_specialty: 'Nursing',
        subject: 'Vaccination reminder',
        last_message: 'Your flu vaccination is due. Would you like to schedule an appointment?',
        last_message_time: '2025-01-13T16:45:00Z',
        unread_count: 2,
        priority: 'high',
        status: 'active'
      }
    ]);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err) {
      setError('Failed to load conversations');
      addNotification({
        type: 'error',
        title: 'Loading Error',
        message: 'Failed to load conversations. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      // Mock messages for conversation
    setMessages([
      {
        id: '1',
        sender_name: 'Dr. Sarah Johnson',
        sender_type: 'provider',
        content: 'Hi Sarah, I hope you\'re feeling better after our consultation last week. How are you responding to the new medication?',
        timestamp: '2025-01-14T09:00:00Z',
        message_type: 'text'
      },
      {
        id: '2',
        sender_name: 'Sarah Johnson',
        sender_type: 'patient',
        content: 'Thank you for checking in, Dr. Johnson. I\'m feeling much better! The headaches have reduced significantly.',
        timestamp: '2025-01-14T14:30:00Z',
        message_type: 'text'
      },
      {
        id: '3',
        sender_name: 'Dr. Sarah Johnson',
        sender_type: 'provider',
        content: 'That\'s wonderful to hear! Please continue with the current dosage and let me know if you experience any side effects. We should schedule a follow-up in 2 weeks.',
        timestamp: '2025-01-15T10:15:00Z',
        message_type: 'text'
      },
      {
        id: '4',
        sender_name: 'Dr. Sarah Johnson',
        sender_type: 'provider',
        content: 'Please let me know how you\'re feeling after the medication change.',
        timestamp: '2025-01-15T14:30:00Z',
        message_type: 'text'
      }
    ]);

      // Mark conversation as read
      setConversations(prev => prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, unread_count: 0 }
          : conv
      ));
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Loading Error',
        message: 'Failed to load messages.'
      });
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadConversations();
    if (selectedConversation) {
      await loadMessages(selectedConversation);
    }
    setRefreshing(false);
    addNotification({
      type: 'success',
      title: 'Messages Refreshed',
      message: 'Your messages have been updated.'
    });
  };

  const handleSelectConversation = (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    setSelectedConversation(conversationId);
    addNotification({
      type: 'info',
      title: 'Conversation Opened',
      message: `Opening conversation with ${conversation?.provider_name}.`
    });
  };

  const handleNewConversation = () => {
    addNotification({
      type: 'info',
      title: 'New Conversation',
      message: 'Starting a new conversation with a healthcare provider.'
    });
    // In production, this would open a provider selection modal
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (value.length > 2) {
      addNotification({
        type: 'info',
        title: 'Search Updated',
        message: `Searching conversations for "${value}"...`
      });
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.provider_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'all' || conv.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || conv.status === filterStatus;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) {
      addNotification({
        type: 'warning',
        title: 'Empty Message',
        message: 'Please enter a message before sending.'
      });
      return;
    }

    setIsTyping(true);
    const message: Message = {
      id: Date.now().toString(),
      sender_name: 'Sarah Johnson',
      sender_type: 'patient',
      content: newMessage,
      timestamp: new Date().toISOString(),
      message_type: 'text'
    };

    setMessages(prev => [...prev, message]);
    
    // Update conversation last message
    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation 
        ? { 
            ...conv, 
            last_message: newMessage,
            last_message_time: new Date().toISOString()
          }
        : conv
    ));
    
    setNewMessage('');
    
    setTimeout(() => {
      setIsTyping(false);
      addNotification({
        type: 'success',
        title: 'Message Sent',
        message: 'Your message has been delivered securely.'
      });
    }, 500);
  };

  const handleAttachFile = () => {
    addNotification({
      type: 'info',
      title: 'File Attachment',
      message: 'File attachment feature will be available soon.'
    });
  };

  const handleMarkAsRead = (conversationId: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, unread_count: 0 }
        : conv
    ));
  };

  const handleArchiveConversation = (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, status: 'archived' as const }
        : conv
    ));
    addNotification({
      type: 'success',
      title: 'Conversation Archived',
      message: `Conversation with ${conversation?.provider_name} has been archived.`
    });
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      normal: 'bg-blue-100 text-blue-800',
      high: 'bg-yellow-100 text-yellow-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || colors.normal;
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-12rem)] flex bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="w-1/3 border-r border-gray-200 p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
        <div className="flex-1 p-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-12rem)] flex bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-50 p-1"
              >
                <Activity className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={handleNewConversation}
                className="bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          {/* Filters */}
          <div className="flex space-x-2 mt-2">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
              <option value="low">Low</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => handleSelectConversation(conversation.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedConversation === conversation.id ? 'bg-indigo-50 border-indigo-200' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{conversation.provider_name}</p>
                    <p className="text-xs text-gray-500">{conversation.provider_specialty}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(conversation.priority)}`}>
                    {conversation.priority}
                  </span>
                  {conversation.unread_count > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[1.25rem] text-center">
                      {conversation.unread_count}
                    </span>
                  )}
                </div>
              </div>
              <p className="font-medium text-sm text-gray-900 mb-1">{conversation.subject}</p>
              <p className="text-sm text-gray-600 truncate">{conversation.last_message}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(conversation.last_message_time).toLocaleDateString('en-AU', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          ))}
          
          {filteredConversations.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>No conversations found</p>
              {searchTerm && (
                <p className="text-xs mt-1">Try adjusting your search criteria</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Message Thread */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Message Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {conversations.find(c => c.id === selectedConversation)?.provider_name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {conversations.find(c => c.id === selectedConversation)?.subject}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleMarkAsRead(selectedConversation)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                    title="Mark as read"
                  >
                    <CheckCircle className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleArchiveConversation(selectedConversation)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                    title="Archive conversation"
                  >
                    <Archive className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Filter className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender_type === 'patient' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender_type === 'patient'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender_type === 'patient' ? 'text-indigo-100' : 'text-gray-500'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString('en-AU', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                  <p className="text-xs mt-1">Start the conversation by sending a message</p>
                <button
                  type="button"
                  onClick={handleAttachFile}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <Paperclip className="h-5 w-5" />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || isTyping}
                  className="bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isTyping ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </form>
              {isTyping && (
                <div className="mt-2 text-xs text-gray-500 flex items-center space-x-1">
                  <div className="animate-pulse w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span>Sending message...</span>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose a conversation from the list to start messaging</p>
              <button
                onClick={handleNewConversation}
                className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Start New Conversation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}