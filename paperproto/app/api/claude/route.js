// app/api/claude/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  console.log("⭐ API route called: /api/claude");
  
  const API_KEY = process.env.API_KEY;
  
  if (!API_KEY) {
    console.error("❌ API key not configured");
    return NextResponse.json(
      { message: 'API key not configured' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { messages, system } = body;

    console.log("📝 Request system prompt:", system ? system.substring(0, 100) + "..." : "None");
    console.log("📨 Number of messages:", messages.length);
    
    // Debug output about message format
    console.log("Message formats:", messages.map(msg => ({
      role: msg.role,
      contentType: typeof msg.content,
      isArray: Array.isArray(msg.content)
    })));
    
    // Fix message formats - ensure all are valid
    for (let i = 0; i < messages.length; i++) {
      if (messages[i].content === undefined || messages[i].content === null) {
        console.log(`⚠️ Fixing undefined/null content in message ${i}`);
        messages[i].content = "";
      }
    }
    
    const hasMultimodal = messages.some(msg => Array.isArray(msg.content));
    
    // Validate message format
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      
      // Ensure role is valid
      if (!msg.role || (msg.role !== 'user' && msg.role !== 'assistant')) {
        console.error("❌ Invalid role in message at index", i);
        return NextResponse.json(
          { message: `Invalid role in message at index ${i}` },
          { status: 400 }
        );
      }
      
      // Fix invalid content formats
      if (msg.content === undefined || msg.content === null) {
        console.log(`⚠️ Fixing null/undefined content in message ${i}`);
        messages[i].content = "";
      } else if (typeof msg.content === 'object' && !Array.isArray(msg.content)) {
        // Convert object content (not array) to string
        console.log(`⚠️ Converting object content to string in message ${i}`);
        try {
          messages[i].content = JSON.stringify(msg.content);
        } catch (e) {
          messages[i].content = ""; // Fallback if can't stringify
        }
      }
      
      // Validate content format after fixes
      if (Array.isArray(msg.content)) {
        // For array content, each item must have a valid type
        for (let j = 0; j < msg.content.length; j++) {
          const item = msg.content[j];
          if (!item.type || (item.type !== 'text' && item.type !== 'image')) {
            console.error(`❌ Invalid content type in message ${i}, item ${j}`);
            return NextResponse.json(
              { message: `Invalid content type in message ${i}, item ${j}` },
              { status: 400 }
            );
          }
          
          // For text items, validate text field
          if (item.type === 'text' && typeof item.text !== 'string') {
            console.error(`❌ Missing text field in message ${i}, item ${j}`);
            messages[i].content[j].text = ""; // Fix it
          }
          
          // For image items, validate source field
          if (item.type === 'image') {
            if (!item.source || !item.source.type || !item.source.media_type || !item.source.data) {
              console.error(`❌ Invalid image source in message ${i}, item ${j}`);
              return NextResponse.json(
                { message: `Invalid image source in message ${i}, item ${j}` },
                { status: 400 }
              );
            }
          }
        }
      } else if (typeof msg.content !== 'string') {
        // If still not string after fixes, report error
        console.error(`❌ Invalid content in message ${i}, expected string or array`);
        return NextResponse.json(
          { message: `Invalid content in message ${i}, expected string or array` },
          { status: 400 }
        );
      }
    }
    
    // Ensure consistent format across all messages
    const firstMessageFormat = Array.isArray(messages[0].content) ? 'array' : 'string';
    const hasInconsistentFormat = messages.some(msg => 
      (Array.isArray(msg.content) ? 'array' : 'string') !== firstMessageFormat
    );
    
    if (hasInconsistentFormat) {
      console.error("❌ Inconsistent message format: all messages must use same content format");
      
      // Convert all messages to array format for consistency
      for (let i = 0; i < messages.length; i++) {
        if (!Array.isArray(messages[i].content)) {
          messages[i] = {
            role: messages[i].role,
            content: [{ type: 'text', text: messages[i].content }]
          };
        }
      }
      
      console.log("✅ Automatically converted all messages to array format for consistency");
    }

    const payload = {
        model: "claude-3-7-sonnet-20250219",
        messages: messages,
        max_tokens: 64000,
        temperature: 0.7
    };

    if (system) {
      payload.system = system;
    }

    console.log("🚀 Sending request to Claude API");
    
    // Log a sample of the payload (omitting large base64 strings)
    const samplePayload = JSON.parse(JSON.stringify(payload));
    if (samplePayload.messages && Array.isArray(samplePayload.messages)) {
      samplePayload.messages = samplePayload.messages.map(msg => {
        if (Array.isArray(msg.content)) {
          return {
            ...msg,
            content: msg.content.map(item => {
              if (item.type === 'image' && item.source && item.source.data) {
                return {
                  ...item,
                  source: {
                    ...item.source,
                    data: '[BASE64_DATA]'
                  }
                };
              }
              return item;
            })
          };
        }
        return msg;
      });
    }
    console.log("📦 Payload sample:", JSON.stringify(samplePayload).substring(0, 500) + "...");

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null) || await response.text();
      console.error("❌ Error from Claude API:", errorData);
      return NextResponse.json(
        { message: 'Error from Claude API', status: response.status, error: errorData },
        { status: response.status }
      );
    }

    console.log("✅ Successfully received response from Claude API");
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Server error:", error.message);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}