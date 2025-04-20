"use client"
// components/ChatInterface.js

import { useState, useEffect, useRef } from 'react';
import { sendMessageToClaude } from '../utils/claude-api';

const initialMessages = [
  {
    role: 'assistant',
    content: "Hi there! I'm Claude, your game development assistant. What kind of game would you like me to build for you today?"
  }
];

export default function ChatInterface({ onGameRequest }) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentGameType, setCurrentGameType] = useState(null);
  const [currentGameCode, setCurrentGameCode] = useState(null);
  const [developmentStage, setDevelopmentStage] = useState(0);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Pass updated game code to parent when it changes
  useEffect(() => {
    if (currentGameType && currentGameCode) {
      onGameRequest(currentGameType, currentGameCode);
    }
  }, [currentGameType, currentGameCode, onGameRequest]);

  const processGameRequest = async (userMessage) => {
    console.log("processing user message", userMessage);

    // 1. Add user message
    const updatedMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    try {
      // 2. Build system prompt
      const systemPrompt = `You are a friendly and very skilled game development assistant that makes beautiful, delightful games in the browser.
You co‑create games with the user, one small step at a time.

IMPORTANT PRIMACY RULE — DO NOT END WITH A COLON

${developmentStage > 0
  ? `—––– DEVELOPMENT STAGE ${developmentStage} –––—
1. Look back at the steps we already laid out.
2. Provide only the code for step ${developmentStage + 1}, fully runnable (HTML+CSS+JS).
3. Wrap your answer in:

---GAME_TYPE_START---
[e.g. flappy bird]
---GAME_TYPE_END---

---GAME_CODE_START---
[complete, runnable code]
---GAME_CODE_END---

4. Then ask: “What do you think?”`
  : `—––– INITIAL SETUP –––—
1. Read the user’s request and break it into exactly 3 numbered steps, using "\n" to separate each step.
2. Provide only the code for step 1, fully runnable (HTML+CSS+JS).
3. Wrap your answer in:

---GAME_TYPE_START---
[e.g. flappy bird]
---GAME_TYPE_END---

---GAME_CODE_START---
[complete, runnable code]
---GAME_CODE_END---

4. Then ask: “What do you think? Which step should we tackle next?”`}

IMPORTANT:
• Never provide code for more than one step.
• Always keep your code self‑contained and ready to run in a browser.
• Never end your responses with a colon.
• This is a back‑and‑forth “co‑creation” process — after each code snippet, you must ask for the user’s feedback before proceeding.`;

      // 3. Send to Claude
      const claudeMessages = updatedMessages.map(m => ({
        role: m.role,
        content: m.content
      }));
      const response = await sendMessageToClaude(claudeMessages, systemPrompt);
      const claudeResponse = response.content[0].text;
      console.log("claude response received, length:", claudeResponse.length);

      // 4. Strip out only the marker blocks
      const conversationResponse = claudeResponse
        .replace(/---GAME_TYPE_START---[\s\S]*?---GAME_TYPE_END---/g, '')
        .replace(/---GAME_CODE_START---[\s\S]*?---GAME_CODE_END---/g, '')
        .trim();

      // 5. Extract new game type & code
      let gameType = currentGameType;
      let gameCode = currentGameCode;
      let gameTypeUpdated = false;
      let gameCodeUpdated = false;

      const typeMatch = claudeResponse.match(/---GAME_TYPE_START---([\s\S]*?)---GAME_TYPE_END---/);
      if (typeMatch?.[1]) {
        const newType = typeMatch[1].trim().toLowerCase();
        if (newType !== currentGameType) {
          gameType = newType;
          gameTypeUpdated = true;
        }
      }

      const codeMatch = claudeResponse.match(/---GAME_CODE_START---([\s\S]*?)---GAME_CODE_END---/);
      if (codeMatch?.[1]) {
        const newCode = codeMatch[1].trim();
        if (newCode !== currentGameCode) {
          gameCode = newCode;
          gameCodeUpdated = true;
        }
      }

      // 6. Update state for type & code
      if (gameTypeUpdated) setCurrentGameType(gameType);
      if (gameCodeUpdated) setCurrentGameCode(gameCode);

      // 7. Bump developmentStage
      setDevelopmentStage(prev => {
        if (gameTypeUpdated) return 1;
        if (gameCodeUpdated) return prev + 1;
        return prev;
      });

      // 8. Append Claude's reply if non-empty
      if (conversationResponse) {
        setMessages([
          ...updatedMessages,
          { role: 'assistant', content: conversationResponse }
        ]);
      } else {
        console.warn('Skipping empty assistant message');
      }

      // 9. Notify parent if new code arrived
      if ((gameTypeUpdated || gameCodeUpdated) && gameType && gameCode) {
        onGameRequest(gameType, gameCode);
      }

    } catch (error) {
      console.error('Error processing game request:', error);
      setMessages([
        ...updatedMessages,
        {
          role: 'assistant',
          content: "I'm sorry, I encountered an error while processing your request. Please try again."
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    processGameRequest(input);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-lg ${
                message.role === 'assistant'
                  ? 'bg-purple-50 text-gray-800'
                  : 'bg-purple-600 text-white'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[85%] p-3 rounded-lg bg-purple-50 text-gray-800">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200">
        {currentGameType && (
          <div className="mb-2 text-sm text-gray-500">
            Currently working on: <span className="font-medium">{currentGameType}</span>
            {developmentStage > 0 && <span> | Stage: {developmentStage}</span>}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              currentGameType
                ? "How would you like to modify your game?"
                : "What game would you like to build?"
            }
            className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded-r-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
