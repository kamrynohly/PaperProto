"use client"
// utils/claude-api.js

export async function sendMessageToClaude(messages, systemPrompt = null) {
  try {
    console.log("Processing messages for Claude API");
    
    // Debug input messages
    console.log("Input messages:", JSON.stringify(messages.map(m => ({
      role: m.role,
      contentType: typeof m.content,
      hasImages: m.hasImages
    }))));
    
    // Process messages to ensure correct format for Claude API
    const processedMessages = messages.map((message) => {
      // Handle image messages (messages with hasImages property)
      if (message.hasImages && typeof message.content === 'object' && message.content.images) {
        console.log("Processing an image message");
        
        // Create proper array format for multimodal API
        const contentArray = [];
        
        // Add text if present
        if (message.content.text) {
          contentArray.push({
            type: 'text',
            text: message.content.text
          });
        }
        
        // Add each image
        if (Array.isArray(message.content.images)) {
          message.content.images.forEach(imgUrl => {
            if (typeof imgUrl === 'string' && imgUrl.startsWith('data:image/')) {
              const mediaType = imgUrl.split(';')[0].split(':')[1];
              const base64Data = imgUrl.split(',')[1];
              
              contentArray.push({
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType,
                  data: base64Data
                }
              });
            }
          });
        }
        
        return {
          role: message.role,
          content: contentArray
        };
      }
      
      // Handle regular text messages
      if (typeof message.content === 'string') {
        // If we have image messages in conversation, ALL messages must use array format
        const hasAnyImages = messages.some(m => m.hasImages);
        
        if (hasAnyImages) {
          return {
            role: message.role,
            content: [{
              type: 'text',
              text: message.content
            }]
          };
        } else {
          // No images in conversation, use string format
          return {
            role: message.role,
            content: message.content
          };
        }
      }
      
      // Handle any other format (just in case)
      console.log("Unknown message format:", typeof message.content);
      return {
        role: message.role,
        content: typeof message.content === 'string' 
          ? message.content 
          : typeof message.content === 'object' && message.content !== null
            ? JSON.stringify(message.content)
            : "Unknown message content"
      };
    });
    
    // Log the first couple of messages for debugging (without base64 data)
    if (processedMessages.length > 0) {
      console.log("First message format:", JSON.stringify({
        role: processedMessages[0].role,
        contentType: typeof processedMessages[0].content,
        isArray: Array.isArray(processedMessages[0].content),
        content: Array.isArray(processedMessages[0].content) 
          ? processedMessages[0].content.map(item => ({ type: item.type }))
          : typeof processedMessages[0].content === 'string'
            ? processedMessages[0].content.substring(0, 50) + "..."
            : "Not string or array"
      }));
    }
    
    if (processedMessages.length > 1) {
      console.log("Second message format:", JSON.stringify({
        role: processedMessages[1].role,
        contentType: typeof processedMessages[1].content,
        isArray: Array.isArray(processedMessages[1].content),
        content: Array.isArray(processedMessages[1].content) 
          ? processedMessages[1].content.map(item => ({ 
              type: item.type,
              hasData: item.type === 'image' ? 'yes' : 'n/a'
            }))
          : typeof processedMessages[1].content === 'string'
            ? processedMessages[1].content.substring(0, 50) + "..."
            : "Not string or array"
      }));
    }

    const response = await fetch('/api/claude', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: processedMessages,
        system: systemPrompt
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Claude API Error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling Claude API:', error);
    throw error;
  }
}

// Helper to convert a file to base64
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}