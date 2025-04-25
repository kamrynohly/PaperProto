// generate-grpc.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure output directory exists
const outputDir = path.join(__dirname, './lib/generated');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

try {
  console.log('Generating gRPC-web definitions...');
  
  execSync(`npx grpc_tools_node_protoc \
    --js_out=import_style=commonjs,binary:./lib/generated \
    --grpc-web_out=import_style=typescript,mode=grpcwebtext:./lib/generated \
    --proto_path=./lib \
    ./lib/service.proto`, { stdio: 'inherit' });
  
  console.log('Successfully generated gRPC-web definitions.');
} catch (error) {
  console.error('Error generating gRPC-web definitions:', error);
  process.exit(1);
}