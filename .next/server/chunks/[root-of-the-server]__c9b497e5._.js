module.exports = {

"[project]/.next-internal/server/app/api/claude/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[project]/app/api/claude/route.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// app/api/claude/route.js
__turbopack_context__.s({
    "POST": (()=>POST)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
async function POST(request) {
    console.log("⭐ API route called: /api/claude");
    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
        console.error("❌ API key not configured");
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: 'API key not configured'
        }, {
            status: 500
        });
    }
    try {
        const body = await request.json();
        const { messages, system } = body;
        console.log("📝 Request system prompt:", system ? system.substring(0, 100) + "..." : "None");
        console.log("📨 Number of messages:", messages.length);
        // Debug output about message format
        console.log("Message formats:", messages.map((msg)=>({
                role: msg.role,
                contentType: typeof msg.content,
                isArray: Array.isArray(msg.content),
                hasImages: msg.hasImages || false
            })));
        // Process user messages with images
        // Process user messages with images
        for(let i = 0; i < messages.length; i++){
            const msg = messages[i];
            // Handle user messages with images
            if (msg.role === 'user' && msg.hasImages === true && typeof msg.content === 'object' && !Array.isArray(msg.content)) {
                console.log(`🖼️ Processing user message with images at index ${i}`);
                const { text, images } = msg.content;
                // Convert to multimodal format
                const multiModalContent = [
                    {
                        type: 'text',
                        text: text || ''
                    }
                ];
                // Add images
                if (Array.isArray(images) && images.length > 0) {
                    console.log(`Found ${images.length} images to process`);
                    for(let j = 0; j < images.length; j++){
                        const imgUrl = images[j];
                        // Strip the data URL prefix
                        const base64Data = imgUrl.replace(/^data:image\/\w+;base64,/, '');
                        multiModalContent.push({
                            type: 'image',
                            source: {
                                type: 'base64',
                                media_type: 'image/jpeg',
                                data: base64Data
                            }
                        });
                        console.log(`Processed image ${j + 1}, data length: ${base64Data.length} chars`);
                    }
                }
                // Replace the original content with the multimodal format
                messages[i] = {
                    role: msg.role,
                    content: multiModalContent
                };
                console.log(`✅ Converted message ${i} to multimodal format with ${multiModalContent.length - 1} images`);
            }
            // Remove hasImages property from all messages before sending to API
            if (messages[i].hasImages !== undefined) {
                delete messages[i].hasImages;
            }
            // Fix undefined/null content
            if (messages[i].content === undefined || messages[i].content === null) {
                console.log(`⚠️ Fixing undefined/null content in message ${i}`);
                messages[i].content = "";
            }
        }
        // Check if any message has multimodal content after processing
        const hasMultimodal = messages.some((msg)=>Array.isArray(msg.content));
        console.log("🖼️ Contains multimodal content:", hasMultimodal);
        // Validate message format
        for(let i = 0; i < messages.length; i++){
            const msg = messages[i];
            // Ensure role is valid
            if (!msg.role || msg.role !== 'user' && msg.role !== 'assistant') {
                console.error("❌ Invalid role in message at index", i);
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    message: `Invalid role in message at index ${i}`
                }, {
                    status: 400
                });
            }
            // Fix non-array object content
            if (typeof msg.content === 'object' && !Array.isArray(msg.content)) {
                console.log(`⚠️ Converting object content to multimodal format in message ${i}`);
                try {
                    // Try to extract text content if any
                    let textContent = '';
                    if (msg.content.text) {
                        textContent = msg.content.text;
                    } else {
                        textContent = JSON.stringify(msg.content);
                    }
                    // Convert to multimodal format with just text
                    messages[i].content = [
                        {
                            type: 'text',
                            text: textContent
                        }
                    ];
                } catch (e) {
                    console.error(`❌ Error converting object content:`, e);
                    messages[i].content = [
                        {
                            type: 'text',
                            text: ''
                        }
                    ]; // Fallback if can't stringify
                }
            }
            // Validate content format after fixes
            if (Array.isArray(msg.content)) {
                // For array content, each item must have a valid type
                for(let j = 0; j < msg.content.length; j++){
                    const item = msg.content[j];
                    if (!item.type || item.type !== 'text' && item.type !== 'image') {
                        console.error(`❌ Invalid content type in message ${i}, item ${j}:`, item.type);
                        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                            message: `Invalid content type in message ${i}, item ${j}`
                        }, {
                            status: 400
                        });
                    }
                    // For text items, validate text field
                    if (item.type === 'text' && typeof item.text !== 'string') {
                        console.error(`❌ Missing text field in message ${i}, item ${j}`);
                        // Fix it with empty string
                        messages[i].content[j].text = "";
                    }
                    // For image items, validate source field
                    if (item.type === 'image') {
                        if (!item.source || !item.source.type || !item.source.media_type || !item.source.data) {
                            console.error(`❌ Invalid image source in message ${i}, item ${j}`);
                            // Log detailed diagnostic info
                            console.error('Image source details:', {
                                hasSource: !!item.source,
                                sourceType: item.source?.type,
                                mediaType: item.source?.media_type,
                                hasData: !!item.source?.data,
                                dataLength: item.source?.data?.length || 0
                            });
                            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                                message: `Invalid image source in message ${i}, item ${j}`
                            }, {
                                status: 400
                            });
                        }
                        // Verify base64 data for image
                        if (item.source.type === 'base64') {
                            // Log info about the image data
                            console.log(`🖼️ Image in message ${i}, item ${j}:`);
                            console.log(`  - Media type: ${item.source.media_type}`);
                            console.log(`  - Data length: ${item.source.data.length} characters`);
                            // Fix media_type if not properly set
                            if (!item.source.media_type.startsWith('image/')) {
                                console.warn(`⚠️ Fixing invalid media_type in message ${i}, item ${j}`);
                                messages[i].content[j].source.media_type = 'image/jpeg';
                            }
                            // Ensure data is actually base64
                            try {
                                // Try to decode a small sample to verify it's valid base64
                                atob(item.source.data.substring(0, 10));
                            } catch (e) {
                                console.error(`❌ Invalid base64 data in message ${i}, item ${j}:`, e.message);
                                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                                    message: `Invalid base64 data in message ${i}, item ${j}`
                                }, {
                                    status: 400
                                });
                            }
                        }
                    }
                }
            } else if (typeof msg.content !== 'string') {
                // If still not string after fixes, report error
                console.error(`❌ Invalid content in message ${i}, expected string or array`);
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    message: `Invalid content in message ${i}, expected string or array`
                }, {
                    status: 400
                });
            }
        }
        // Ensure consistent format across all messages
        const firstMessageFormat = Array.isArray(messages[0].content) ? 'array' : 'string';
        const hasInconsistentFormat = messages.some((msg)=>(Array.isArray(msg.content) ? 'array' : 'string') !== firstMessageFormat);
        if (hasInconsistentFormat) {
            console.log("⚠️ Inconsistent message format: converting all to array format");
            // Convert all messages to array format for consistency
            for(let i = 0; i < messages.length; i++){
                if (!Array.isArray(messages[i].content)) {
                    const originalContent = messages[i].content;
                    messages[i] = {
                        role: messages[i].role,
                        content: [
                            {
                                type: 'text',
                                text: originalContent
                            }
                        ]
                    };
                }
            }
            console.log("✅ All messages converted to array format for consistency");
        }
        const payload = {
            model: "claude-3-7-sonnet-20250219",
            messages: messages,
            max_tokens: 16000,
            temperature: 0.7
        };
        if (system) {
            payload.system = system;
        }
        // Check payload size
        const payloadStringified = JSON.stringify(payload);
        const payloadSizeMB = (payloadStringified.length / 1024 / 1024).toFixed(2);
        console.log(`📊 Payload size: ${payloadSizeMB} MB`);
        if (parseFloat(payloadSizeMB) > 20) {
            console.warn(`⚠️ Large payload detected (${payloadSizeMB} MB) - may exceed API limits`);
        }
        console.log("🚀 Sending request to Claude API");
        // Log a sample of the payload (omitting large base64 strings)
        const samplePayload = JSON.parse(JSON.stringify(payload));
        if (samplePayload.messages && Array.isArray(samplePayload.messages)) {
            samplePayload.messages = samplePayload.messages.map((msg)=>{
                if (Array.isArray(msg.content)) {
                    return {
                        ...msg,
                        content: msg.content.map((item)=>{
                            if (item.type === 'image' && item.source && item.source.data) {
                                return {
                                    ...item,
                                    source: {
                                        ...item.source,
                                        data: `[BASE64_DATA: ${item.source.data.length} chars]`
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
        console.log("📦 Payload sample:", JSON.stringify(samplePayload).substring(0, 1000) + "...");
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: payloadStringified
        });
        if (!response.ok) {
            let errorDetails = "Unknown error";
            try {
                const errorData = await response.json();
                errorDetails = JSON.stringify(errorData);
                console.error("❌ Error from Claude API:", errorData);
            } catch (e) {
                // If can't parse as JSON, try to get text
                errorDetails = await response.text();
                console.error("❌ Error from Claude API (text):", errorDetails);
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: 'Error from Claude API',
                status: response.status,
                error: errorDetails
            }, {
                status: response.status
            });
        }
        console.log("✅ Successfully received response from Claude API");
        const data = await response.json();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(data);
    } catch (error) {
        console.error("❌ Server error:", error.message);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: 'Internal server error',
            error: error.message
        }, {
            status: 500
        });
    }
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__c9b497e5._.js.map