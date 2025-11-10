
import React from 'react';
import { Source } from '../types';

interface SourceLinkProps {
  source: Source;
  index: number;
}

const SourceLink: React.FC<SourceLinkProps> = ({ source, index }) => (
  <a
    href={source.uri}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center space-x-2 bg-gray-700/50 hover:bg-gray-600/50 p-2 rounded-lg text-xs transition-colors duration-200"
  >
    <span className="flex-shrink-0 bg-gray-600 text-gray-200 w-5 h-5 flex items-center justify-center rounded-full text-xs">
      {index + 1}
    </span>
    <span className="truncate text-blue-300 hover:underline" title={source.title}>
      {source.title}
    </span>
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 flex-shrink-0 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
    </svg>
  </a>
);

export default SourceLink;
