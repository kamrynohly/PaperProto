module.exports = {

"[project]/utils/claude-api.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// utils/claude-api.js
/**
 * Sends a message to Claude API with proper handling for text and image content
 * @param {Array} messages - The conversation history
 * @param {String} systemPrompt - The system prompt for Claude
 * @returns {Promise} - Claude's response
 */ __turbopack_context__.s({
    "sendMessageToClaude": (()=>sendMessageToClaude)
});
async function sendMessageToClaude(messages, systemPrompt) {
    try {
        // Validate any image URLs to ensure they're accessible
        for (const message of messages){
            if (Array.isArray(message.content)) {
                for (const contentBlock of message.content){
                    if (contentBlock.type === 'image' && contentBlock.source && contentBlock.source.type === 'url') {
                        try {
                            // Try fetching the image to verify it's accessible
                            const imageResponse = await fetch(contentBlock.source.url, {
                                method: 'HEAD'
                            });
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
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
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
}}),
"[project]/components/ChatInterface.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>ChatInterface)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
// components/ChatInterface.js
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$claude$2d$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/utils/claude-api.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const initialMessages = [
    {
        role: 'assistant',
        content: "Hi there! I'm Claude, your game development assistant. What kind of game would you like me to build for you today?"
    }
];
function ChatInterface({ onGameRequest, setLoading }) {
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialMessages);
    const [input, setInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [isTyping, setIsTyping] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [currentGameType, setCurrentGameType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [currentGameCode, setCurrentGameCode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [developmentStep, setDevelopmentStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [gameSteps, setGameSteps] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [uploadedImages, setUploadedImages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [showImageUpload, setShowImageUpload] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const messagesEndRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Auto-scroll to bottom when messages change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        messagesEndRef.current?.scrollIntoView({
            behavior: 'smooth'
        });
    }, [
        messages
    ]);
    // Pass updated game code to parent when it changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (currentGameType && currentGameCode) {
            onGameRequest(currentGameType, currentGameCode);
        }
    }, [
        currentGameType,
        currentGameCode,
        onGameRequest
    ]);
    /**
   * Compress an image file by resizing and lowering quality
   * @param {File} file
   * @returns {Promise<File>}
   */ const compressImage = (file)=>{
        return new Promise((resolve, reject)=>{
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = ()=>{
                // Adjust max dimensions as needed
                const maxWidth = 1024;
                const scale = img.width > maxWidth ? maxWidth / img.width : 1;
                const canvas = document.createElement('canvas');
                canvas.width = img.width * scale;
                canvas.height = img.height * scale;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                canvas.toBlob((blob)=>{
                    if (!blob) {
                        reject(new Error('Compression failed: blob is null'));
                        return;
                    }
                    const compressedFile = new File([
                        blob
                    ], file.name, {
                        type: 'image/jpeg',
                        lastModified: Date.now()
                    });
                    resolve(compressedFile);
                }, 'image/jpeg', 0.7 // quality between 0 and 1
                );
            };
            img.onerror = (err)=>reject(err);
        });
    };
    // Handle file selection with compression
    const handleFileSelect = (e)=>{
        const files = Array.from(e.target.files);
        const imageFiles = files.filter((file)=>file.type.startsWith('image/'));
        if (imageFiles.length === 0) return;
        const newUploadedImages = [
            ...uploadedImages
        ];
        imageFiles.forEach((file)=>{
            const reader = new FileReader();
            reader.onload = (e)=>{
                const img = new Image();
                img.onload = ()=>{
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
                    setUploadedImages([
                        ...newUploadedImages
                    ]);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    };
    // Handle file upload button click
    const handleUploadClick = ()=>{
        fileInputRef.current.click();
    };
    // Remove an uploaded image
    const removeImage = (index)=>{
        const newImages = [
            ...uploadedImages
        ];
        newImages.splice(index, 1);
        setUploadedImages(newImages);
    };
    // Toggle image upload section
    const toggleImageUpload = ()=>{
        setShowImageUpload(!showImageUpload);
    };
    const processGameRequest = async (userMessage, imageUrls = [])=>{
        setLoading(true);
        console.log("Processing user message:", userMessage);
        console.log("With images:", imageUrls.length);
        // Debug image sizes if any
        if (imageUrls.length > 0) {
            console.log("Image sizes:");
            imageUrls.forEach((img, idx)=>{
                console.log(`Image ${idx + 1}: ~${Math.round(img.length / 1024)}KB`);
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
            userMessageObj.content = {
                text: messageText,
                images: imageUrls
            };
            userMessageObj.hasImages = true;
        } else {
            userMessageObj.content = messageText;
        // Don't add hasImages property for text-only messages
        }
        const updatedMessages = [
            ...messages,
            userMessageObj
        ];
        setMessages(updatedMessages);
        setInput('');
        setIsTyping(true);
        setUploadedImages([]);
        try {
            // 2. Build system prompt based on current development step
            const systemPrompt = buildSystemPrompt(messageText, developmentStep);
            // 3. Send to Claude - include ALL text messages but optimize code messages
            // Create a copy of messages to modify for sending to Claude
            const messagesForClaude = updatedMessages.map((message, index)=>{
                // If this is a user message with code, keep it as is
                if (message.role === 'user') {
                    return {
                        role: message.role,
                        content: message.content,
                        hasImages: message.hasImages || false
                    };
                }
                // For assistant messages, we need to check for code blocks
                const isCodeMessage = message.content && (message.content.includes('---GAME_CODE_START---') || typeof message.content === 'string' && message.content.includes('```'));
                // If this is a code message but NOT the most recent one, remove the code
                if (isCodeMessage && index < updatedMessages.length - 1) {
                    // Keep the conversation text but remove code blocks
                    const strippedContent = typeof message.content === 'string' ? message.content.replace(/---GAME_TYPE_START---[\s\S]*?---GAME_TYPE_END---/g, '[Game Type Omitted]').replace(/---GAME_CODE_START---[\s\S]*?---GAME_CODE_END---/g, '[Code Omitted]').replace(/---GAME_STEPS_START---[\s\S]*?---GAME_STEPS_END---/g, '[Steps Omitted]').replace(/```[\s\S]*?```/g, '[Code Block Omitted]') : message.content;
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
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$claude$2d$api$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sendMessageToClaude"])(messagesForClaude, systemPrompt);
            const claudeResponse = response.content[0].text;
            console.log("Claude response received, length:", claudeResponse.length);
            // 4. Extract conversation text by removing the marker blocks
            const conversationResponse = claudeResponse.replace(/---GAME_TYPE_START---[\s\S]*?---GAME_TYPE_END---/g, '').replace(/---GAME_CODE_START---[\s\S]*?---GAME_CODE_END---/g, '').replace(/---GAME_STEPS_START---[\s\S]*?---GAME_STEPS_END---/g, '').trim();
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
                let newMessages = [
                    ...updatedMessages
                ];
                if (newMessages.length > 10) {
                    // Keep only the latest messages to prevent token bloat
                    newMessages = [
                        initialMessages[0],
                        ...newMessages.slice(-9) // And the last 9 messages (to make 10 total with the new one)
                    ];
                }
                // Add the new assistant message
                newMessages.push({
                    role: 'assistant',
                    content: conversationResponse
                });
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
        } finally{
            setIsTyping(false);
            setLoading(false);
        }
    };
    // Build system prompt based on current development state
    const buildSystemPrompt = (userMessage, step)=>{
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
        } else {
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
    const handleSubmit = (e)=>{
        e.preventDefault();
        if (input.trim() === '' && uploadedImages.length === 0) return;
        processGameRequest(input, uploadedImages);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col h-full bg-gray-900",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto p-4 space-y-4",
                children: [
                    messages.map((message, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `max-w-[85%] p-3 rounded-lg pixel-border ${message.role === 'assistant' ? 'bg-gray-800 text-indigo-200' : 'bg-indigo-700 text-gray-100'}`,
                                children: message.hasImages && typeof message.content === 'object' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mb-2 font-pixelify",
                                            children: message.content.text
                                        }, void 0, false, {
                                            fileName: "[project]/components/ChatInterface.js",
                                            lineNumber: 411,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap gap-2",
                                            children: message.content.images.map((img, imgIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "border border-indigo-500 rounded overflow-hidden pixel-border",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                        src: img,
                                                        alt: `Uploaded image ${imgIndex + 1}`,
                                                        width: 150,
                                                        height: 150,
                                                        className: "object-cover"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ChatInterface.js",
                                                        lineNumber: 415,
                                                        columnNumber: 25
                                                    }, this)
                                                }, imgIndex, false, {
                                                    fileName: "[project]/components/ChatInterface.js",
                                                    lineNumber: 414,
                                                    columnNumber: 23
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/components/ChatInterface.js",
                                            lineNumber: 412,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ChatInterface.js",
                                    lineNumber: 410,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "font-pixelify",
                                    children: message.content
                                }, void 0, false, {
                                    fileName: "[project]/components/ChatInterface.js",
                                    lineNumber: 427,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/ChatInterface.js",
                                lineNumber: 401,
                                columnNumber: 13
                            }, this)
                        }, index, false, {
                            fileName: "[project]/components/ChatInterface.js",
                            lineNumber: 397,
                            columnNumber: 11
                        }, this)),
                    isTyping && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-start",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "max-w-[85%] p-3 rounded-lg bg-gray-800 text-indigo-200 pixel-border",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex space-x-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-3 h-3 bg-pink-500 rounded-full animate-bounce"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ChatInterface.js",
                                        lineNumber: 437,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-3 h-3 bg-indigo-500 rounded-full animate-bounce",
                                        style: {
                                            animationDelay: '0.2s'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/components/ChatInterface.js",
                                        lineNumber: 438,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-3 h-3 bg-pink-500 rounded-full animate-bounce",
                                        style: {
                                            animationDelay: '0.4s'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/components/ChatInterface.js",
                                        lineNumber: 439,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ChatInterface.js",
                                lineNumber: 436,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/ChatInterface.js",
                            lineNumber: 435,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/ChatInterface.js",
                        lineNumber: 434,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: messagesEndRef
                    }, void 0, false, {
                        fileName: "[project]/components/ChatInterface.js",
                        lineNumber: 445,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ChatInterface.js",
                lineNumber: 395,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 border-t border-gray-700 bg-gray-800",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleSubmit,
                    className: "space-y-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between items-center mb-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: toggleImageUpload,
                                    className: "text-pink-400 hover:text-pink-300 text-sm flex items-center bg-gray-700 px-3 py-1 rounded pixel-border retro-text",
                                    children: showImageUpload ? "Hide Drawings" : "Add Drawings"
                                }, void 0, false, {
                                    fileName: "[project]/components/ChatInterface.js",
                                    lineNumber: 452,
                                    columnNumber: 13
                                }, this),
                                uploadedImages.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-xs text-indigo-300 retro-text",
                                    children: [
                                        uploadedImages.length,
                                        " image",
                                        uploadedImages.length > 1 ? 's' : '',
                                        " added"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ChatInterface.js",
                                    lineNumber: 460,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ChatInterface.js",
                            lineNumber: 451,
                            columnNumber: 11
                        }, this),
                        showImageUpload && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-3 bg-gray-700 p-3 rounded pixel-border",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "file",
                                    ref: fileInputRef,
                                    onChange: handleFileSelect,
                                    accept: "image/*",
                                    multiple: true,
                                    className: "hidden"
                                }, void 0, false, {
                                    fileName: "[project]/components/ChatInterface.js",
                                    lineNumber: 468,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-wrap gap-2 mb-2",
                                    children: [
                                        uploadedImages.map((img, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative inline-block",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-16 h-16 border border-indigo-500 rounded overflow-hidden pixel-border",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                            src: img,
                                                            alt: `Uploaded ${index}`,
                                                            width: 64,
                                                            height: 64,
                                                            className: "object-cover w-full h-full"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ChatInterface.js",
                                                            lineNumber: 480,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ChatInterface.js",
                                                        lineNumber: 479,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>removeImage(index),
                                                        className: "absolute -top-1 -right-1 bg-pink-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs",
                                                        children: "×"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ChatInterface.js",
                                                        lineNumber: 488,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, index, true, {
                                                fileName: "[project]/components/ChatInterface.js",
                                                lineNumber: 478,
                                                columnNumber: 19
                                            }, this)),
                                        uploadedImages.length < 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: handleUploadClick,
                                            className: "w-16 h-16 border-2 border-dashed border-indigo-500 rounded flex items-center justify-center text-indigo-400 hover:text-pink-400 hover:border-pink-400 pixel-border",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-2xl",
                                                children: "+"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ChatInterface.js",
                                                lineNumber: 503,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/ChatInterface.js",
                                            lineNumber: 498,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ChatInterface.js",
                                    lineNumber: 476,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ChatInterface.js",
                            lineNumber: 467,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex pt-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: input,
                                    onChange: (e)=>setInput(e.target.value),
                                    placeholder: currentGameType ? "Any changes?" : "What game would you like to build?",
                                    className: "flex-1 p-2 border-2 border-indigo-600 bg-gray-700 rounded-l-lg text-white focus:outline-none focus:border-pink-500 font-pixelify pixel-border"
                                }, void 0, false, {
                                    fileName: "[project]/components/ChatInterface.js",
                                    lineNumber: 512,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    disabled: isTyping,
                                    className: `px-4 py-2 rounded-r-lg focus:outline-none retro-text ${isTyping ? 'bg-indigo-700 text-gray-300' : 'bg-indigo-600 hover:bg-pink-600 text-white'} pixel-border`,
                                    children: "SEND"
                                }, void 0, false, {
                                    fileName: "[project]/components/ChatInterface.js",
                                    lineNumber: 523,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ChatInterface.js",
                            lineNumber: 511,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ChatInterface.js",
                    lineNumber: 449,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ChatInterface.js",
                lineNumber: 448,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ChatInterface.js",
        lineNumber: 394,
        columnNumber: 5
    }, this);
}
}}),
"[project]/components/DinoGame.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// components/DinoGame.js
__turbopack_context__.s({
    "default": (()=>DinoGame)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
function DinoGame() {
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const container = containerRef.current;
        container.innerHTML = "";
        // create sandboxed iframe
        const iframe = document.createElement("iframe");
        Object.assign(iframe.style, {
            width: "100%",
            height: "100%",
            border: "none"
        });
        iframe.allow = "accelerometer; autoplay";
        iframe.title = "Dino Game";
        container.appendChild(iframe);
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        doc.open();
        doc.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <base href="/" />
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <link
    href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
    rel="stylesheet"
  />
  <style>
    :root {
      --bg: #171717;
      --fg: #ededed;
      --accent: #EC4899;
      --border: #6366F1;
      --shadow: #2D3748;
    }
    html, body {
      margin: 0; padding: 0;
      width: 100%; height: 100%;
      background: var(--bg);
      font-family: 'Press Start 2P', cursive;
      overflow: hidden;
    }
    .game-container {
      position: relative;
      width: 900px;    /* 600×1.5 */
      height: 300px;   /* taller */
      margin: auto;
      top: 50%; transform: translateY(-50%);
      background: #222;
      border: 4px solid var(--border);
      box-shadow: 4px 4px 0 var(--shadow), -4px -4px 0 var(--shadow);
      border-radius: 4px;
      overflow: hidden;
      image-rendering: pixelated;
    }
    .score {
      position: absolute;
      top: 8px; left: 50%;
      transform: translateX(-50%);
      color: var(--accent);
      text-shadow: 1px 1px 0 var(--border);
      font-size: 16px;
    }
    .ground {
      position: absolute;
      bottom: 0; width: 100%; height: 3px;
      background: var(--fg);
    }
    /* console.png as player, mirrored */
    #dino {
      position: absolute;
      bottom: 0; left: 100px;
      width: 66px;   /* 44×1.5 */
      height: 70px;  /* 47×1.5 */
      background: url('/console.png') no-repeat center/contain;
      transform: scaleX(-1);
    }
    .cactus {
      position: absolute;
      bottom: 0;
      width: 25px;   /* ~17×1.5 */
      background: var(--accent);
    }
    .cloud {
      position: absolute;
      width: 70px;   /* ~46×1.5 */
      height: 20px;  /* ~14×1.5 */
      background: var(--fg);
      opacity: 0.4;
      border-radius: 50%;
    }
    .start-message,
    .game-over {
      position: absolute;
      left: 50%; transform: translateX(-50%);
      color: var(--accent);
      text-shadow: 1px 1px 0 var(--border);
      text-align: center;
      font-size: 14px;
    }
    .start-message {
      top: 50%; transform: translate(-50%, -80px);
    }
    .game-over {
      top: 50%; transform: translate(-50%, -50%);
      display: none;
      font-size: 16px;
    }
    .restart-btn {
      display: block;
      margin: 8px auto 0;
      padding: 6px 12px;
      background: var(--border);
      color: #fff;
      border: none;
      box-shadow: 2px 2px 0 var(--shadow);
      font-family: 'Press Start 2P', cursive;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="game-container">
    <div class="score">Score: 0</div>
    <div class="ground"></div>
    <div id="dino"></div>
    <div class="start-message">PRESS SPACE OR TAP TO JUMP</div>
    <div class="game-over">
      GAME OVER
      <button class="restart-btn">RESTART</button>
    </div>
  </div>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const dino      = document.getElementById('dino');
      const container = document.querySelector('.game-container');
      const scoreEl   = document.querySelector('.score');
      const overEl    = document.querySelector('.game-over');
      const startEl   = document.querySelector('.start-message');
      const btn       = document.querySelector('.restart-btn');

      // physics & state
      let pos = 0,
          vel = 0,
          gravity = 0.5,       // slower falling
          speed = 5,
          score = 0,
          jumpsRemaining = 2,
          started = false,
          over = false;

      const cacti = [];
      const clouds = [];

      function jump() {
        if (over || jumpsRemaining === 0) return;
        if (!started) {
          started = true;
          startEl.style.display = 'none';
          loop();
        }
        vel = 12;
        jumpsRemaining--;
      }

      function spawnCactus() {
        if (over) return;
        setTimeout(() => {
          if (over) return;
          const c = document.createElement('div');
          c.className = 'cactus';
          // random height 60–110px
          const h = Math.random() * 60 + 60;
          c.style.height = h + 'px';
          container.appendChild(c);
          c.style.left = '900px';
          cacti.push(c);
          moveObstacle(c);
          spawnCactus();
        }, Math.random() * 3000 + 1000);
      }

      function spawnCloud() {
        if (over) return;
        setTimeout(() => {
          if (over) return;
          const cl = document.createElement('div');
          cl.className = 'cloud';
          container.appendChild(cl);
          cl.style.left = '900px';
          cl.style.top = (Math.random() * 200 + 20) + 'px';
          clouds.push(cl);
          moveCloud(cl);
          spawnCloud();
        }, Math.random() * 3000 + 2000);
      }

      function moveObstacle(el) {
        let x = 900;
        const ti = setInterval(() => {
          if (over) return clearInterval(ti);
          x -= speed;
          el.style.left = x + 'px';
          // collision zone
          if (x < 166 && x + el.offsetWidth > 100 && pos < 10) {
            return gameOver(ti);
          }
          if (x < -30) {
            el.remove();
            clearInterval(ti);
            score++;
            scoreEl.textContent = 'Score: ' + score;
            if (score % 10 === 0 && speed < 15) speed += 1;
          }
        }, 20);
      }

      function moveCloud(el) {
        let x = 900;
        const sp = speed * 0.3;
        const ti = setInterval(() => {
          if (over) return clearInterval(ti);
          x -= sp;
          el.style.left = x + 'px';
          if (x < -50) {
            el.remove();
            clearInterval(ti);
          }
        }, 20);
      }

      function loop() {
        // apply physics
        pos += vel;
        vel -= gravity;
        if (pos <= 0) {
          pos = 0;
          vel = 0;
          jumpsRemaining = 2;
        }
        dino.style.bottom = pos + 'px';
        if (!over) requestAnimationFrame(loop);
      }

      function gameOver(ti) {
        over = true;
        overEl.style.display = 'block';
        clearInterval(ti);
      }

      function restart() {
        // clear existing obstacles & clouds
        cacti.forEach(c => c.remove());
        clouds.forEach(c => c.remove());
        cacti.length = 0;
        clouds.length = 0;

        // reset state
        pos = 0; vel = 0; gravity = 0.5;
        speed = 5; score = 0;
        jumpsRemaining = 2;
        started = false; over = false;

        scoreEl.textContent = 'Score: 0';
        overEl.style.display = 'none';
        startEl.style.display = 'block';
        dino.style.bottom = '0px';

        // restart spawns
        spawnCactus();
        spawnCloud();
      }

      // initial spawns
      spawnCactus();
      spawnCloud();

      // input
      document.addEventListener('keydown', e => {
        if (e.code === 'Space') {
          e.preventDefault();
          over ? restart() : jump();
        }
      });
      document.addEventListener('touchstart', e => {
        e.preventDefault();
        over ? restart() : jump();
      });
      btn.addEventListener('click', restart);
    });
  </script>
</body>
</html>`);
        doc.close();
        return ()=>{
            container.innerHTML = "";
        };
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: containerRef,
        className: "w-full h-full pixel-border crt-on scanline"
    }, void 0, false, {
        fileName: "[project]/components/DinoGame.js",
        lineNumber: 309,
        columnNumber: 5
    }, this);
}
}}),
"[project]/components/GameDisplay.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>GameDisplay)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
// components/GameDisplay.js
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DinoGame$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/DinoGame.js [app-ssr] (ecmascript)");
"use client";
;
;
;
function GameDisplay({ gameCode, gameType, loading }) {
    const [gameTitle, setGameTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const gameContainerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const iframeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Update display title when gameType changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (gameType) {
            const formattedType = gameType.split('-').map((w)=>w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            setGameTitle(formattedType);
        }
    }, [
        gameType
    ]);
    // Render the generated game into an iframe
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!gameCode || !gameContainerRef.current) return;
        try {
            // Clear previous content
            gameContainerRef.current.innerHTML = '';
            if (iframeRef.current) iframeRef.current.remove();
            // Create sandbox iframe
            const iframe = document.createElement('iframe');
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
            iframe.title = gameTitle || 'Game';
            iframeRef.current = iframe;
            gameContainerRef.current.appendChild(iframe);
            // Extract HTML, CSS, JS from the generated code
            let htmlContent = '', cssContent = '', jsContent = '';
            const htmlMatch = gameCode.match(/<html[^>]*>([\s\S]*)<\/html>/i);
            const bodyMatch = gameCode.match(/<body[^>]*>([\s\S]*)<\/body>/i);
            const cssMatch = gameCode.match(/<style[^>]*>([\s\S]*)<\/style>/i);
            const jsMatch = gameCode.match(/<script[^>]*>([\s\S]*)<\/script>/i);
            if (htmlMatch) htmlContent = htmlMatch[1];
            else if (bodyMatch) htmlContent = bodyMatch[1];
            else htmlContent = gameCode;
            if (cssMatch) cssContent = cssMatch[1];
            if (jsMatch) jsContent = jsMatch[1];
            // Write into iframe with dark theme
            setTimeout(()=>{
                const doc = iframe.contentDocument;
                doc.open();
                doc.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>${gameTitle || 'Game'}</title>
            <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Pixelify+Sans:wght@400..700&display=swap" rel="stylesheet">
            <style>
              body {
                margin:0; padding:0;
                overflow:hidden;
                display:flex; justify-content:center; align-items:center;
                width:100%; height:100%;
                background-color: #161B22;
                color: #FFFFFF;
                font-family: 'Pixelify Sans', sans-serif;
              }
              ${cssContent}
            </style>
          </head>
          <body>
            ${htmlContent}
            <script>
              // Track image loading
              const OriginalImage = window.Image;
              const promises = [];
              window.Image = function() {
                const img = new OriginalImage();
                promises.push(new Promise(r => {
                  img.onload = r;
                  img.onerror = r;
                }));
                return img;
              };

              Promise.all(promises).finally(() => {
                // Run any exposed game loops
                [window.gameLoop, window.update, window.animate, window.draw, window.render, window.loop]
                  .filter(fn => typeof fn === 'function')
                  .forEach(fn => { try { fn(); } catch(e){} });
              });

              ${jsContent}
            </script>
          </body>
          </html>
        `);
                doc.close();
            }, 0);
        } catch (error) {
            console.error('Error rendering game:', error);
            gameContainerRef.current.innerHTML = `
        <div class="p-4 bg-indigo-900 text-red-300 rounded-lg pixel-border">
          <p class="font-bold retro-text text-sm">Error rendering game:</p>
          <p>${error.message}</p>
        </div>
      `;
        }
    }, [
        gameCode,
        gameTitle
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col h-full",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex-1 flex items-center justify-center bg-gray-900 p-2",
            children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative w-full h-full flex flex-col",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 w-full h-full pixel-border rounded-lg overflow-hidden bg-gray-800 crt-on",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DinoGame$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                            fileName: "[project]/components/GameDisplay.js",
                            lineNumber: 130,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/GameDisplay.js",
                        lineNumber: 129,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute bottom-30 left-0 right-0 text-center"
                    }, void 0, false, {
                        fileName: "[project]/components/GameDisplay.js",
                        lineNumber: 133,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/GameDisplay.js",
                lineNumber: 127,
                columnNumber: 11
            }, this) : gameCode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: gameContainerRef,
                className: "w-full h-full flex items-center justify-center overflow-auto pixel-border rounded-lg bg-gray-800 crt-on"
            }, void 0, false, {
                fileName: "[project]/components/GameDisplay.js",
                lineNumber: 140,
                columnNumber: 11
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center max-w-md bg-gray-800 p-8 rounded-lg pixel-border crt-on",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-lg font-medium retro-text text-indigo-300 mb-2",
                        children: "What would you like to play?"
                    }, void 0, false, {
                        fileName: "[project]/components/GameDisplay.js",
                        lineNumber: 146,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-pink-400 font-normal",
                        children: "Describe your game and I will create it for you!"
                    }, void 0, false, {
                        fileName: "[project]/components/GameDisplay.js",
                        lineNumber: 149,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/GameDisplay.js",
                lineNumber: 145,
                columnNumber: 11
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/GameDisplay.js",
            lineNumber: 125,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/GameDisplay.js",
        lineNumber: 124,
        columnNumber: 5
    }, this);
}
}}),
"[project]/components/BottomNavigation.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
const BottomNavigation = ()=>{
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setMounted(true);
    }, []);
    if (!mounted) {
        return null;
    }
    const tabs = [
        {
            name: 'Community',
            href: '/community',
            iconSrc: '/arcade.png',
            alt: 'Community Icon'
        },
        {
            name: 'Create',
            href: '/create',
            iconSrc: '/console.png',
            alt: 'Create Icon'
        },
        {
            name: 'Profile',
            href: '/profile',
            iconSrc: '/profile.png',
            alt: 'Profile Icon'
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed bottom-0 left-0 right-0 h-16 bg-gray-900 border-t-4 border-indigo-600 flex items-center justify-around z-50 shadow-lg",
        children: tabs.map((tab)=>{
            const isActive = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                href: tab.href,
                className: `flex flex-col items-center justify-center w-full h-full transition-transform duration-200 hover:scale-110 ${isActive ? 'text-pink-500 relative after:content-[""] after:absolute after:bottom-0 after:left-1/4 after:right-1/4 after:h-1' : 'text-gray-400 hover:text-indigo-400'}`,
                style: {
                    textShadow: isActive ? '0px 0px 6px rgba(236, 72, 153, 0.6)' : 'none'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `p-1 ${isActive ? 'bg-gray-700 rounded-md border-2 border-indigo-500' : ''}`,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        src: tab.iconSrc,
                        alt: tab.alt,
                        width: 32,
                        height: 32,
                        className: "object-contain",
                        priority: true
                    }, void 0, false, {
                        fileName: "[project]/components/BottomNavigation.js",
                        lineNumber: 60,
                        columnNumber: 15
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/BottomNavigation.js",
                    lineNumber: 59,
                    columnNumber: 13
                }, this)
            }, tab.name, false, {
                fileName: "[project]/components/BottomNavigation.js",
                lineNumber: 47,
                columnNumber: 11
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/components/BottomNavigation.js",
        lineNumber: 42,
        columnNumber: 5
    }, this);
};
const __TURBOPACK__default__export__ = BottomNavigation;
}}),
"[project]/lib/firebase.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// lib/firebase.js
__turbopack_context__.s({
    "auth": (()=>auth),
    "db": (()=>db),
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$app$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/app/dist/index.mjs [app-ssr] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm2017$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@firebase/app/dist/esm/index.esm2017.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/index.mjs [app-ssr] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$totp$2d$7829abf2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__p__as__getAuth$3e$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/node-esm/totp-7829abf2.js [app-ssr] (ecmascript) <export p as getAuth>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/index.mjs [app-ssr] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.node.mjs [app-ssr] (ecmascript)");
;
;
;
// Our Firebase configuration
const firebaseConfig = {
    apiKey: ("TURBOPACK compile-time value", "AIzaSyB6HfpAaXBkE2izy-VLEm8brcBzfL02hW8"),
    authDomain: ("TURBOPACK compile-time value", "paperproto.firebaseapp.com"),
    projectId: ("TURBOPACK compile-time value", "paperproto"),
    storageBucket: ("TURBOPACK compile-time value", "paperproto.firebasestorage.app"),
    messagingSenderId: ("TURBOPACK compile-time value", "958983830867"),
    appId: ("TURBOPACK compile-time value", "1:958983830867:web:267bf4c8acc89f454435a6"),
    measurementId: ("TURBOPACK compile-time value", "G-TET9X9P4FT")
};
// Initialize Firebase only if it hasn't been initialized yet
let firebaseApp;
if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm2017$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getApps"])().length) {
    firebaseApp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm2017$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["initializeApp"])(firebaseConfig);
} else {
    firebaseApp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm2017$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getApps"])()[0];
}
const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$totp$2d$7829abf2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__p__as__getAuth$3e$__["getAuth"])(firebaseApp);
const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getFirestore"])(firebaseApp);
const __TURBOPACK__default__export__ = firebaseApp;
}}),
"[project]/app/create/page.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// updated Home component with game cover image upload at publish step
__turbopack_context__.s({
    "default": (()=>Home)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ChatInterface$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ChatInterface.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GameDisplay$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/GameDisplay.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gamepad$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Gamepad2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/gamepad-2.js [app-ssr] (ecmascript) <export default as Gamepad2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-square.js [app-ssr] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-ssr] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/share-2.js [app-ssr] (ecmascript) <export default as Share2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$BottomNavigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/BottomNavigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$AuthContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/AuthContext.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/index.mjs [app-ssr] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.node.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/firebase.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2f$v4$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm/v4.js [app-ssr] (ecmascript) <export default as v4>");
"use client";
;
;
;
;
;
;
;
;
;
;
;
function Home() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [gameCode, setGameCode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [gameType, setGameType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showPublishModal, setShowPublishModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [gameTitle, setGameTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [gameDescription, setGameDescription] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [publishing, setPublishing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [publishSuccess, setPublishSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [gameImage, setGameImage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [gameImagePreview, setGameImagePreview] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const { currentUser, userData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$AuthContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setMounted(true);
        document.getElementById('game-container')?.classList.add('crt-on');
    }, []);
    const handleGameGeneration = async (type, code)=>{
        setLoading(true);
        setError(null);
        try {
            await new Promise((resolve)=>setTimeout(resolve, 5000));
            if (code) {
                setGameType(type);
                setGameCode(code);
                console.log(`Received ${type} game code directly, length: ${code.length}`);
            } else {
                console.warn("No game code provided");
            }
        } catch (error) {
            console.error('Error processing game:', error);
            setError(error.message);
        } finally{
            setLoading(false);
        }
    };
    const handleImageUpload = (e)=>{
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev)=>setGameImagePreview(ev.target.result);
        reader.readAsDataURL(file);
        setGameImage(file);
    };
    const handlePublishGame = async ()=>{
        if (!gameCode || !gameTitle.trim() || !gameDescription.trim()) {
            setError("Please generate a game and provide a title and description");
            return;
        }
        // Check if user is logged in
        if (!currentUser) {
            // Redirect to auth page instead of just showing an error
            router.push('/auth');
            return;
        }
        const userId = currentUser.uid;
        const userName = userData?.username || currentUser.displayName || currentUser.email?.split('@')[0] || 'Anonymous User';
        setPublishing(true);
        setError(null);
        try {
            const gameUuid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2f$v4$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])();
            const imageBase64 = gameImagePreview || null;
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["db"], "games", gameUuid), {
                game_uuid: gameUuid,
                creator_id: userId,
                creator_name: userName,
                title: gameTitle,
                description: gameDescription,
                gameType: gameType,
                gameCode: gameCode,
                image: imageBase64,
                playCount: 0,
                favCount: 0,
                createdAt: new Date()
            });
            if (userData) {
                const userRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["db"], "users", userId);
                const currentProjectIds = userData.project_ids || [];
                const gameCount = userData.gameCount || 0;
                if (!currentProjectIds.includes(gameUuid)) {
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateDoc"])(userRef, {
                        gameCount: gameCount + 1,
                        project_ids: [
                            ...currentProjectIds,
                            gameUuid
                        ]
                    });
                }
            }
            setPublishSuccess(true);
            setTimeout(()=>{
                setPublishSuccess(false);
                setShowPublishModal(false);
                setGameTitle('');
                setGameDescription('');
                setGameImage(null);
                setGameImagePreview(null);
            }, 2000);
        } catch (error) {
            console.error('Error publishing game:', error);
            setError(error.message);
        } finally{
            setPublishing(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-900 retro-grid-bg",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "bg-indigo-900 border-b-4 border-pink-500 shadow-lg",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container mx-auto py-4 px-4 flex justify-between items-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-3xl font-bold text-center tracking-wider text-pink-500",
                            style: {
                                textShadow: '2px 2px 0px #4F46E5, 4px 4px 0px #2D3748',
                                fontFamily: '"Press Start 2P", cursive'
                            },
                            children: "GAME GENERATOR"
                        }, void 0, false, {
                            fileName: "[project]/app/create/page.js",
                            lineNumber: 137,
                            columnNumber: 11
                        }, this),
                        gameCode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                if (!currentUser) {
                                    router.push('/auth');
                                } else {
                                    setShowPublishModal(true);
                                }
                            },
                            className: "px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-md border-2 border-pink-400 shadow-[2px_2px_0px_0px_rgba(236,72,153)] transition-all hover:shadow-[1px_1px_0px_0px_rgba(236,72,153)] flex items-center",
                            style: {
                                fontFamily: '"Press Start 2P", cursive',
                                fontSize: '10px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__["Share2"], {
                                    size: 16,
                                    className: "mr-2"
                                }, void 0, false, {
                                    fileName: "[project]/app/create/page.js",
                                    lineNumber: 156,
                                    columnNumber: 17
                                }, this),
                                "PUBLISH"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/create/page.js",
                            lineNumber: 145,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/create/page.js",
                    lineNumber: 136,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/create/page.js",
                lineNumber: 135,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "container mx-auto p-4 pt-6",
                children: [
                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-4 p-4 bg-red-900 text-pink-200 border-4 border-red-500 rounded-lg shadow-[4px_4px_0px_0px_rgba(239,68,68)]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                        size: 24,
                                        className: "mr-2 text-red-400"
                                    }, void 0, false, {
                                        fileName: "[project]/app/create/page.js",
                                        lineNumber: 167,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-medium",
                                        children: [
                                            "ERROR DETECTED: ",
                                            error
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/create/page.js",
                                        lineNumber: 168,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/create/page.js",
                                lineNumber: 166,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm mt-1 ml-8",
                                children: "Please check your API key configuration and try again."
                            }, void 0, false, {
                                fileName: "[project]/app/create/page.js",
                                lineNumber: 170,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/create/page.js",
                        lineNumber: 165,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        id: "game-container",
                        className: "flex flex-col md:flex-row gap-4 h-[80vh]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "md:w-1/3 bg-gray-800 border-4 border-indigo-600 rounded-lg shadow-[6px_6px_0px_0px_rgba(79,70,229)] overflow-hidden",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "px-4 py-2 bg-indigo-800 border-b-4 border-indigo-500 flex items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"], {
                                                size: 20,
                                                className: "mr-2 text-pink-400"
                                            }, void 0, false, {
                                                fileName: "[project]/app/create/page.js",
                                                lineNumber: 178,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-lg font-bold text-white",
                                                style: {
                                                    textShadow: '1px 1px 0px #4F46E5',
                                                    fontFamily: '"Press Start 2P", cursive',
                                                    fontSize: '12px'
                                                },
                                                children: "CHAT CONSOLE"
                                            }, void 0, false, {
                                                fileName: "[project]/app/create/page.js",
                                                lineNumber: 179,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/create/page.js",
                                        lineNumber: 177,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ChatInterface$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        onGameRequest: handleGameGeneration,
                                        setLoading: setLoading
                                    }, void 0, false, {
                                        fileName: "[project]/app/create/page.js",
                                        lineNumber: 188,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/create/page.js",
                                lineNumber: 176,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "md:w-2/3 bg-gray-800 border-4 border-indigo-600 rounded-lg shadow-[6px_6px_0px_0px_rgba(79,70,229)] overflow-hidden",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "px-4 py-2 bg-indigo-800 border-b-4 border-indigo-500 flex items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gamepad$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Gamepad2$3e$__["Gamepad2"], {
                                                size: 20,
                                                className: "mr-2 text-pink-400"
                                            }, void 0, false, {
                                                fileName: "[project]/app/create/page.js",
                                                lineNumber: 194,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-lg font-bold text-white",
                                                style: {
                                                    textShadow: '1px 1px 0px #4F46E5',
                                                    fontFamily: '"Press Start 2P", cursive',
                                                    fontSize: '12px'
                                                },
                                                children: "GAME SCREEN"
                                            }, void 0, false, {
                                                fileName: "[project]/app/create/page.js",
                                                lineNumber: 195,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/create/page.js",
                                        lineNumber: 193,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GameDisplay$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        gameCode: gameCode,
                                        gameType: gameType,
                                        loading: loading
                                    }, void 0, false, {
                                        fileName: "[project]/app/create/page.js",
                                        lineNumber: 205,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/create/page.js",
                                lineNumber: 192,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/create/page.js",
                        lineNumber: 174,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/create/page.js",
                lineNumber: 163,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$BottomNavigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/app/create/page.js",
                lineNumber: 214,
                columnNumber: 7
            }, this),
            showPublishModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-gray-800 border-4 border-pink-500 rounded-lg w-full max-w-md",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-4 border-b-4 border-indigo-500 bg-indigo-800",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg text-white font-bold",
                                children: "PUBLISH YOUR GAME"
                            }, void 0, false, {
                                fileName: "[project]/app/create/page.js",
                                lineNumber: 221,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/create/page.js",
                            lineNumber: 220,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6 space-y-4",
                            children: publishSuccess ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-green-800 text-green-200 p-4 rounded text-center animate-pulse",
                                children: "Game published successfully!"
                            }, void 0, false, {
                                fileName: "[project]/app/create/page.js",
                                lineNumber: 225,
                                columnNumber: 17
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm text-pink-300 font-bold",
                                                children: "GAME TITLE"
                                            }, void 0, false, {
                                                fileName: "[project]/app/create/page.js",
                                                lineNumber: 231,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: gameTitle,
                                                onChange: (e)=>setGameTitle(e.target.value),
                                                className: "w-full bg-gray-700 border-2 border-indigo-500 rounded px-3 py-2 text-white"
                                            }, void 0, false, {
                                                fileName: "[project]/app/create/page.js",
                                                lineNumber: 232,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/create/page.js",
                                        lineNumber: 230,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm text-pink-300 font-bold",
                                                children: "DESCRIPTION"
                                            }, void 0, false, {
                                                fileName: "[project]/app/create/page.js",
                                                lineNumber: 241,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                value: gameDescription,
                                                onChange: (e)=>setGameDescription(e.target.value),
                                                className: "w-full bg-gray-700 border-2 border-indigo-500 rounded px-3 py-2 text-white h-24 resize-none"
                                            }, void 0, false, {
                                                fileName: "[project]/app/create/page.js",
                                                lineNumber: 242,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/create/page.js",
                                        lineNumber: 240,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm text-pink-300 font-bold",
                                                children: "COVER IMAGE"
                                            }, void 0, false, {
                                                fileName: "[project]/app/create/page.js",
                                                lineNumber: 250,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "file",
                                                accept: "image/*",
                                                onChange: handleImageUpload,
                                                className: "mt-1 text-white"
                                            }, void 0, false, {
                                                fileName: "[project]/app/create/page.js",
                                                lineNumber: 251,
                                                columnNumber: 21
                                            }, this),
                                            gameImagePreview && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                src: gameImagePreview,
                                                className: "w-full h-32 object-cover rounded mt-2",
                                                alt: "Cover Preview"
                                            }, void 0, false, {
                                                fileName: "[project]/app/create/page.js",
                                                lineNumber: 253,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/create/page.js",
                                        lineNumber: 249,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setShowPublishModal(false),
                                                className: "px-4 py-2 bg-gray-700 text-white rounded",
                                                children: "Cancel"
                                            }, void 0, false, {
                                                fileName: "[project]/app/create/page.js",
                                                lineNumber: 258,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handlePublishGame,
                                                disabled: publishing || !gameTitle.trim() || !gameDescription.trim(),
                                                className: "px-4 py-2 bg-pink-600 text-white rounded disabled:opacity-50",
                                                children: publishing ? 'Publishing...' : 'Publish Game'
                                            }, void 0, false, {
                                                fileName: "[project]/app/create/page.js",
                                                lineNumber: 259,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/create/page.js",
                                        lineNumber: 257,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true)
                        }, void 0, false, {
                            fileName: "[project]/app/create/page.js",
                            lineNumber: 223,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/create/page.js",
                    lineNumber: 219,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/create/page.js",
                lineNumber: 218,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/create/page.js",
        lineNumber: 133,
        columnNumber: 5
    }, this);
}
}}),

};

//# sourceMappingURL=_67bb2f70._.js.map