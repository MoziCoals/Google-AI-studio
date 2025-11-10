
import React from 'react';
import { Message } from '../types';
import LoadingSpinner from './LoadingSpinner';
import SourceLink from './SourceLink';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === 'bot';

  return (
    <div className={`flex items-start gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}>
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
        </div>
      )}
      <div className={`max-w-xs md:max-w-md lg:max-w-2xl rounded-2xl p-4 ${isBot ? 'bg-gray-800 rounded-tl-none' : 'bg-blue-600 text-white rounded-br-none'}`}>
        <p className="whitespace-pre-wrap">{message.text}</p>
        {message.sources && message.sources.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-700">
            <h4 className="text-xs font-semibold text-gray-400 mb-2">Sources:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {message.sources.map((source, index) => (
                <SourceLink key={index} source={source} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
