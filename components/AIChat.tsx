import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Leaf } from 'lucide-react';
import { ChatMessage } from '../types';
import { createChatSession, sendMessageStream } from '../services/geminiService';
import { Chat, GenerateContentResponse } from "@google/genai";

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello! I am Leafy 🌿. How can I help you heal today?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Keep chat session in a ref to persist across renders
  const chatSessionRef = useRef<Chat | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMsg = inputText;
    setInputText('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
        if (!chatSessionRef.current) {
            chatSessionRef.current = createChatSession();
        }

        const chat = chatSessionRef.current;
        const streamResult = await sendMessageStream(chat, userMsg);
        
        let fullText = '';
        setMessages(prev => [...prev, { role: 'model', text: '', isStreaming: true }]);

        for await (const chunk of streamResult) {
            const c = chunk as GenerateContentResponse;
            const chunkText = c.text || '';
            fullText += chunkText;
            
            setMessages(prev => {
                const newMessages = [...prev];
                const lastMsg = newMessages[newMessages.length - 1];
                if (lastMsg.role === 'model') {
                    lastMsg.text = fullText;
                }
                return newMessages;
            });
        }
        
        setMessages(prev => {
             const newMessages = [...prev];
             const lastMsg = newMessages[newMessages.length - 1];
             lastMsg.isStreaming = false;
             return newMessages;
        });

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting to nature right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 right-4 z-40 bg-brand text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-transform hover:scale-105 active:scale-95 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed inset-x-0 bottom-0 sm:right-4 sm:left-auto sm:bottom-24 sm:w-96 bg-white z-50 shadow-2xl sm:rounded-2xl flex flex-col transition-all duration-300 ease-in-out transform ${
          isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
        }`}
        style={{ height: '500px', maxHeight: '80vh' }}
      >
        {/* Chat Header */}
        <div className="bg-primary-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-white/20 p-1.5 rounded-full">
              <Leaf size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm">Leafy Assistant</h3>
              <p className="text-xs text-green-100">AI Herbal Expert</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="hover:bg-white/20 p-1 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-brand text-white rounded-br-none' 
                    : 'bg-white text-gray-800 border border-gray-200 shadow-sm rounded-bl-none'
                }`}
              >
                {msg.text}
                {msg.isStreaming && <span className="inline-block w-1.5 h-3 ml-1 bg-gray-400 animate-pulse"/>}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 border-t bg-white">
          <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about remedies..."
              className="flex-grow bg-transparent outline-none text-sm text-gray-700"
              disabled={isLoading}
            />
            <button 
              onClick={handleSendMessage}
              disabled={isLoading || !inputText.trim()}
              className={`p-1.5 rounded-full ${isLoading || !inputText.trim() ? 'text-gray-400' : 'text-brand hover:bg-green-50'}`}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIChat;
