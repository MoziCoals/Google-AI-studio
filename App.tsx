
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Message } from './types';
import { sendMessageToGemini } from './services/geminiService';
import ChatMessage from './components/ChatMessage';
import LoadingSpinner from './components/LoadingSpinner';

const SUGGESTED_QUERY = `Check latest digital marketing trends with AI, observe the success rate and growth potential, examine the pros and cons. Give me 5 top ideas with low competition, high demand, quick market/internet potential and great profit potential within a short time. Develop these ideas with the best social media platforms to use, the best marketing hooks, the most effective means and a structured plan to grow viral within 30 days.`;

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      text: "Hello! I'm your AI Digital Marketing Strategist. I can provide the latest marketing trends using real-time search data. How can I help you strategize today?",
      sender: 'bot',
    },
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
    };

    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const { text, sources } = await sendMessageToGemini(messageText);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text,
        sender: 'bot',
        sources,
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(userInput);
  };

  const handleSuggestionClick = () => {
    handleSendMessage(SUGGESTED_QUERY);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <header className="p-4 border-b border-gray-700 shadow-md bg-gray-800/50 backdrop-blur-sm">
        <h1 className="text-xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          AI Digital Marketing Strategist
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map(msg => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isLoading && (
            <div className="flex justify-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="max-w-md rounded-2xl p-4 bg-gray-800 rounded-tl-none">
                <LoadingSpinner />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </main>
      
      {messages.length <= 1 && (
        <div className="px-4 pb-2">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={handleSuggestionClick}
                    className="w-full text-left p-3 text-sm bg-gray-800/80 border border-gray-700 rounded-lg hover:bg-gray-700/80 transition-colors text-gray-300"
                >
                    <strong>Try this:</strong> Check latest digital marketing trends...
                </button>
            </div>
        </div>
      )}

      <footer className="p-4 bg-gray-900/80 backdrop-blur-sm sticky bottom-0">
        <form onSubmit={handleFormSubmit} className="max-w-4xl mx-auto flex items-center gap-2">
          <input
            type="text"
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            placeholder="Ask for a marketing plan..."
            className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow text-gray-200"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !userInput.trim()}
            className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </form>
      </footer>
    </div>
  );
};

export default App;
