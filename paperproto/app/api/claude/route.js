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

    const payload = {
        model: "claude-3-7-sonnet-20250219",
        messages: messages,
        max_tokens: 4000,
        temperature: 0.7
    };

    if (system) {
      payload.system = system;
    }

    console.log("🚀 Sending request to Claude API");
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(payload),
    });

    console.log("payload", payload)

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