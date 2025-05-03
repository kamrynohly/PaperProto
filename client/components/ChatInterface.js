"use client"
// components/ChatInterface.js

import { useState, useEffect, useRef } from 'react';
import { sendMessageToClaude } from '../utils/claude-api';
import NextImage from 'next/image';

const initialMessages = [
  {
    role: 'assistant',
    content: "Hi there! I'm Claude, your game development assistant. What kind of game would you like me to build for you today?"
  }
];

export default function ChatInterface({ onGameRequest, setLoading }) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentGameType, setCurrentGameType] = useState(null);
  const [currentGameCode, setCurrentGameCode] = useState(null);
  const [developmentStep, setDevelopmentStep] = useState(0);
  const [gameSteps, setGameSteps] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const fileInputRef = useRef(null);
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

  /**
   * Compress an image file by resizing and lowering quality
   * @param {File} file
   * @returns {Promise<File>}
   */
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        // Adjust max dimensions as needed
        const maxWidth = 1024;
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        const canvas = document.createElement('canvas');
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Compression failed: blob is null'));
              return;
            }
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          'image/jpeg',
          0.7 // quality between 0 and 1
        );
      };
      img.onerror = (err) => reject(err);
    });
  };

  // Handle file selection with compression
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
  
    if (imageFiles.length === 0) return;
  
    const newUploadedImages = [...uploadedImages];
  
    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
  
          // Resize to max dimension 128px for even smaller size
          const maxDim = 128;
          let width = img.width;
          let height = img.height;
  
          if (width > height) {
            if (width > maxDim) {
              height *= maxDim / width;
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width *= maxDim / height;
              height = maxDim;
            }
          }
  
          canvas.width = width;
          canvas.height = height;
  
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
  
          // Convert to base64 JPEG at 25% quality for smaller size
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.25);
          
          // Log the size for debugging
          console.log(`Image compressed. Size: ~${Math.round(compressedDataUrl.length / 1024)}KB`);
          
          // Store the full data URL
          newUploadedImages.push(compressedDataUrl);
          setUploadedImages([...newUploadedImages]);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };
  
  // Handle file upload button click
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // Remove an uploaded image
  const removeImage = (index) => {
    const newImages = [...uploadedImages];
    newImages.splice(index, 1);
    setUploadedImages(newImages);
  };

  // Toggle image upload section
  const toggleImageUpload = () => {
    setShowImageUpload(!showImageUpload);
  };

  const processGameRequest = async (userMessage, imageUrls = []) => {
    setLoading(true);
    console.log("Processing user message:", userMessage);
    console.log("With images:", imageUrls.length);
    
    // Debug image sizes if any
    if (imageUrls.length > 0) {
      console.log("Image sizes:");
      imageUrls.forEach((img, idx) => {
        console.log(`Image ${idx+1}: ~${Math.round(img.length / 1024)}KB`);
      });
    }
  
    // 1. Add user message with any attached images
    // Ensure text is never empty - add default text if user didn't provide any
    const messageText = userMessage.trim() || (imageUrls.length > 0 ? "Make a game based on this image." : "Make me a game.");
    
    // Create user message object - only add hasImages property when there are images
    let userMessageObj = { 
      role: 'user'
    };
    
    if (imageUrls.length > 0) {
      userMessageObj.content = { text: messageText, images: imageUrls };
      userMessageObj.hasImages = true;
    } else {
      userMessageObj.content = messageText;
      // Don't add hasImages property for text-only messages
    }
    
    const updatedMessages = [...messages, userMessageObj];
    
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);
    setUploadedImages([]);
  
    try {
      // 2. Build system prompt based on current development step
      const systemPrompt = buildSystemPrompt(messageText, developmentStep);
  
      // 3. Send to Claude - include ALL text messages but optimize code messages
      // Create a copy of messages to modify for sending to Claude
      const messagesForClaude = updatedMessages.map((message, index) => {
        // If this is a user message with code, keep it as is
        if (message.role === 'user') {
          return {
            role: message.role,
            content: message.content,
            hasImages: message.hasImages || false
          };
        }
        
        // For assistant messages, we need to check for code blocks
        const isCodeMessage = message.content && 
          (message.content.includes('---GAME_CODE_START---') || 
           (typeof message.content === 'string' && message.content.includes('```')));
        
        // If this is a code message but NOT the most recent one, remove the code
        if (isCodeMessage && index < updatedMessages.length - 1) {
          // Keep the conversation text but remove code blocks
          const strippedContent = typeof message.content === 'string' 
            ? message.content
                .replace(/---GAME_TYPE_START---[\s\S]*?---GAME_TYPE_END---/g, '[Game Type Omitted]')
                .replace(/---GAME_CODE_START---[\s\S]*?---GAME_CODE_END---/g, '[Code Omitted]')
                .replace(/---GAME_STEPS_START---[\s\S]*?---GAME_STEPS_END---/g, '[Steps Omitted]')
                .replace(/```[\s\S]*?```/g, '[Code Block Omitted]')
            : message.content;
            
          return {
            role: message.role,
            content: strippedContent
          };
        }
        
        // For all other messages (including the most recent code message), keep as is
        return {
          role: message.role,
          content: message.content
        };
      });
      
      // We don't handle image messages here, that's now done on the server side
      
      const response = await sendMessageToClaude(messagesForClaude, systemPrompt);
      const claudeResponse = response.content[0].text;
      console.log("Claude response received, length:", claudeResponse.length);
  
      // 4. Extract conversation text by removing the marker blocks
      const conversationResponse = claudeResponse
        .replace(/---GAME_TYPE_START---[\s\S]*?---GAME_TYPE_END---/g, '')
        .replace(/---GAME_CODE_START---[\s\S]*?---GAME_CODE_END---/g, '')
        .replace(/---GAME_STEPS_START---[\s\S]*?---GAME_STEPS_END---/g, '')
        .trim();
  
      // 5. Extract game type, steps, and code from Claude's response
      let gameType = currentGameType;
      let gameCode = currentGameCode;
      let extractedSteps = gameSteps;
      
      // Extract game type if present
      const typeMatch = claudeResponse.match(/---GAME_TYPE_START---([\s\S]*?)---GAME_TYPE_END---/);
      if (typeMatch?.[1]) {
        gameType = typeMatch[1].trim();
        setCurrentGameType(gameType);
      }
  
      // Extract game steps if present
      const stepsMatch = claudeResponse.match(/---GAME_STEPS_START---([\s\S]*?)---GAME_STEPS_END---/);
      if (stepsMatch?.[1]) {
        extractedSteps = stepsMatch[1].trim().split('\n');
        setGameSteps(extractedSteps);
      }
  
      // Extract code if present
      const codeMatch = claudeResponse.match(/---GAME_CODE_START---([\s\S]*?)---GAME_CODE_END---/);
      if (codeMatch?.[1]) {
        // Only store the latest version of the code
        gameCode = codeMatch[1].trim();
        setCurrentGameCode(gameCode);
      }
  
      // 6. Determine new development step
      if (developmentStep === 0 && gameType && gameCode) {
        // First time setup completed - move to improvement cycle
        setDevelopmentStep(1);
      } else if (developmentStep > 0 && gameCode !== currentGameCode) {
        // User has requested improvements and we have new code
        // Stay in improvement cycle (step 1)
        setDevelopmentStep(1);
      }
  
      // 7. Append Claude's reply if non-empty - only store the display text
      if (conversationResponse) {
        // To save on tokens, potentially trim older messages if the chat gets too long
        let newMessages = [...updatedMessages];
        if (newMessages.length > 10) {
          // Keep only the latest messages to prevent token bloat
          newMessages = [
            initialMessages[0], // Keep the initial assistant greeting
            ...newMessages.slice(-9) // And the last 9 messages (to make 10 total with the new one)
          ];
        }
        
        // Add the new assistant message
        newMessages.push({ role: 'assistant', content: conversationResponse });
        setMessages(newMessages);
      } else {
        console.warn('Skipping empty assistant message');
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
      setLoading(false);
    }
  };

  // Build system prompt based on current development state
  const buildSystemPrompt = (userMessage, step) => {
    // Initial setup - complete game implementation
    if (step === 0) {
      return `You are a friendly and very skilled game development assistant that makes beautiful, delightful computer games in the browser.
You co-create games with the user by providing complete implementations and iteratively improving them.

—––– COMPLETE IMPLEMENTATION –––—
1. Read the user's request carefully and mentally break it down into 3-5 logical steps.
2. DO NOT share these steps with the user. They are only for your internal planning.
3. Implement the COMPLETE game in one go, making sure it's fully functional.
4. Wrap your answer in these markers:

---GAME_TYPE_START---
[game name]
---GAME_TYPE_END---

---GAME_STEPS_START---
Step 1: [brief description]
Step 2: [brief description]
Step 3: [brief description]
[additional steps if necessary]
---GAME_STEPS_END---

---GAME_CODE_START---
[complete, runnable HTML+CSS+JS code for the full game]
---GAME_CODE_END---

5. Ask the user if they would like any specific improvements to the game.

IMPORTANT:
- Keep your explanations concise and focus on what the game does
- Never include sound effects
- Ensure your code is fully runnable in a browser
- Make sure the code does not exceed size limitations
- Never reference external images, create all of your own images
- If the user does not ask for a specific style, pick a fun fitting style with animations
- If the user just attaches an image and doesnt specify what game, it is atari breakout
- Never end your responses with a colon`;
    }
    
    // Improvement cycle - refine based on user feedback
    else {
      return `You are a friendly and very skilled game development assistant that makes beautiful, delightful computer games in the browser.
You co-create games with the user by providing complete implementations and iteratively improving them.

—––– IMPROVEMENT CYCLE –––—
1. The user has provided feedback on your implementation.
2. Carefully incorporate their requested changes while keeping the core game intact.
3. Wrap your answer in:

---GAME_TYPE_START---
[game name]
---GAME_TYPE_END---

---GAME_CODE_START---
[improved, runnable HTML+CSS+JS code for the complete game]
---GAME_CODE_END---

4. Ask the user if they'd like any additional improvements.

IMPORTANT:
- Keep your explanations concise
- Ensure the code remains fully runnable in a browser
- Make sure the code does not exceed size limitations
- Never reference external images, create all of your own images
- Never end your responses with a colon`;
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === '' && uploadedImages.length === 0) return;
    processGameRequest(input, uploadedImages);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-lg pixel-border ${
                message.role === 'assistant'
                  ? 'bg-gray-800 text-indigo-200'
                  : 'bg-indigo-700 text-gray-100'
              }`}
            >
              {/* Handle messages with images */}
              {message.hasImages && typeof message.content === 'object' ? (
                <div>
                  <div className="mb-2 font-pixelify">{message.content.text}</div>
                  <div className="flex flex-wrap gap-2">
                    {message.content.images.map((img, imgIndex) => (
                      <div key={imgIndex} className="border border-indigo-500 rounded overflow-hidden pixel-border">
                        <NextImage 
                          src={img} 
                          alt={`Uploaded image ${imgIndex + 1}`} 
                          width={150} 
                          height={150}
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="font-pixelify">{message.content}</div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[85%] p-3 rounded-lg bg-gray-800 text-indigo-200 pixel-border">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-700 bg-gray-800">
        <form onSubmit={handleSubmit} className="space-y-2">
          {/* Image upload section */}
          <div className="flex justify-between items-center mb-2">
            <button 
              type="button" 
              onClick={toggleImageUpload}
              className="text-pink-400 hover:text-pink-300 text-sm flex items-center bg-gray-700 px-3 py-1 rounded pixel-border retro-text"
            >
              {showImageUpload ? "Hide Drawings" : "Add Drawings"}
            </button>
            {uploadedImages.length > 0 && (
              <div className="text-xs text-indigo-300 retro-text">
                {uploadedImages.length} image{uploadedImages.length > 1 ? 's' : ''} added
              </div>
            )}
          </div>
          
          {showImageUpload && (
            <div className="mb-3 bg-gray-700 p-3 rounded pixel-border">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                multiple
                className="hidden"
              />
              <div className="flex flex-wrap gap-2 mb-2">
                {uploadedImages.map((img, index) => (
                  <div key={index} className="relative inline-block">
                    <div className="w-16 h-16 border border-indigo-500 rounded overflow-hidden pixel-border">
                      <NextImage
                        src={img} 
                        alt={`Uploaded ${index}`} 
                        width={64} 
                        height={64} 
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-1 -right-1 bg-pink-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {uploadedImages.length < 3 && (
                  <button
                    type="button"
                    onClick={handleUploadClick}
                    className="w-16 h-16 border-2 border-dashed border-indigo-500 rounded flex items-center justify-center text-indigo-400 hover:text-pink-400 hover:border-pink-400 pixel-border"
                  >
                    <span className="text-2xl">+</span>
                  </button>
                )}
              </div>
            </div>
          )}
          
          {/* Message input and send button */}
          <div className="flex pt-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                currentGameType
                  ? "Any changes?"
                  : "What game would you like to build?"
              }
              className="flex-1 p-2 border-2 border-indigo-600 bg-gray-700 rounded-l-lg text-white focus:outline-none focus:border-pink-500 font-pixelify pixel-border"
            />
            <button
              type="submit"
              disabled={isTyping}
              className={`px-4 py-2 rounded-r-lg focus:outline-none retro-text ${
                isTyping 
                  ? 'bg-indigo-700 text-gray-300' 
                  : 'bg-indigo-600 hover:bg-pink-600 text-white'
              } pixel-border`}
            >
              SEND
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}