// utils/claude-api.js

/**
 * Sends a message to Claude API with proper handling for text and image content
 * @param {Array} messages - The conversation history
 * @param {String} systemPrompt - The system prompt for Claude
 * @returns {Promise} - Claude's response
 */
export async function sendMessageToClaude(messages, systemPrompt) {
    try {
      // Validate any image URLs to ensure they're accessible
      for (const message of messages) {
        if (Array.isArray(message.content)) {
          for (const contentBlock of message.content) {
            if (contentBlock.type === 'image' && 
                contentBlock.source && 
                contentBlock.source.type === 'url') {
              try {
                // Try fetching the image to verify it's accessible
                const imageResponse = await fetch(contentBlock.source.url, { method: 'HEAD' });
                if (!imageResponse.ok) {
                  console.error(`Image URL not accessible: ${contentBlock.source.url}`, imageResponse.status);
                }
              } catch (imgError) {
                console.error(`Error verifying image URL: ${contentBlock.source.url}`, imgError);
              }
            }
          }
        }
      }
  
      // Prepare the request body
      const requestBody = {
        model: "claude-3-7-sonnet-20250219",
        max_tokens: 16000,
        system: systemPrompt,
        messages: messages
      };
  
      console.log('Sending to Claude:', JSON.stringify(requestBody, null, 2));
  
      // Send the request to your API route that handles the Claude API call
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Claude API error: ${errorData.error || response.statusText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error calling Claude API:', error);
      throw error;
    }
  }