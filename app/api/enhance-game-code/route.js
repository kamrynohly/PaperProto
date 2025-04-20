// // app/api/enhance-game-code/route.js
// import { NextResponse } from 'next/server';

// export async function POST(request) {
//   console.log("⭐ API route called: /api/enhance-game-code");
  
//   const API_KEY = process.env.API_KEY; // Ensure this matches your API key env variable name
  
//   if (!API_KEY) {
//     console.error("❌ API key not configured");
//     return NextResponse.json(
//       { message: 'API key not configured' },
//       { status: 500 }
//     );
//   }

//   try {
//     const body = await request.json();
//     const { gameCode, gameType } = body;
    
//     console.log(`📝 Enhancing ${gameType} game code for leaderboard functionality`);
    
//     const messages = [
//       {
//         role: "user",
//         content: `
//           You're enhancing a ${gameType} game to include standard leaderboard functionality.
          
//           The game needs to:
//           1. Track scores in a variable called window.gameAPI.gameScore
//           2. Update scores using window.gameAPI.setScore() or window.gameAPI.addScore()
//           3. End the game with window.gameAPI.endGame() to submit the final score
          
//           Modify the following code to include these features WITHOUT changing the core gameplay:
          
//           ${gameCode}
          
//           Make sure the game calls window.gameAPI.endGame() when the game ends (win or loss condition).
//           Important: Preserve ALL original game mechanics and visual styling.
//         `
//       }
//     ];

//     const system = "You are an expert JavaScript developer focusing on game development. Your task is to enhance game code with leaderboard functionality without changing core game mechanics.";

//     const payload = {
//       model: "claude-3-7-sonnet-20250219",
//       messages: messages,
//       max_tokens: 16000,
//       temperature: 0.5,
//       system: system
//     };

//     console.log("🚀 Sending request to Claude API");
    
//     const response = await fetch('https://api.anthropic.com/v1/messages', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'x-api-key': API_KEY,
//         'anthropic-version': '2023-06-01'
//       },
//       body: JSON.stringify(payload),
//     });

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => null) || await response.text();
//       console.error("❌ Error from Claude API:", errorData);
//       return NextResponse.json(
//         { message: 'Error from Claude API', status: response.status, error: errorData },
//         { status: response.status }
//       );
//     }

//     console.log("✅ Successfully received response from Claude API");
//     const data = await response.json();
    
//     // Extract the enhanced code from Claude's response
//     const enhancedCode = data.content[0].text;
    
//     return NextResponse.json({
//       success: true,
//       code: enhancedCode
//     });
    
//   } catch (error) {
//     console.error("❌ Server error:", error.message);
//     return NextResponse.json(
//       { message: 'Internal server error', error: error.message },
//       { status: 500 }
//     );
//   }
// }