# PaperProto

## About The Project

PaperProto is a revolutionary platform that democratizes game design by allowing anyone to create games without technical knowledge. Simply sketch your prototype on paper, a whiteboard, or describe it verbally, and PaperProto will instantly transform it into a playable game.

### Key Features

- **Instant Transformation**: Convert paper sketches to functional games in seconds
- **No Technical Skills Required**: Anyone can be a game designer regardless of coding experience
- **Community Sharing**: Publish your creations and play games from other creators
- **Multi-Input Support**: Design via sketches, whiteboard drawings, or verbal descriptions
- **Rapid Prototyping**: Go from lo-fi sketches to hi-fi implementation instantly

## Inspiration

In the world of game design, the gap between imagination and implementation has always been significant. Many brilliant ideas remain trapped on paper sketches or exist only in verbal descriptions because of the technical barriers to bringing them to life. PaperProto was born from a simple question: What if anyone could transform their hand-drawn sketches into playable games instantly?

## Tech Stack

- **Frontend**: Next.js & JavaScript
- **Authentication**: Firebase Authentication with Email/Password
- **Storage**: Firebase Storage for tracking images and data inputs
- **Database**: Firebase Firestore for tracking user information, games, and game data
- **AI Integration**: Claude API for:
  - Analyzing visual inputs (sketches) and text descriptions
  - Generating functional game code based on inputs
  - Assisting non-technical users with design refinement
  - Enabling rapid development of the platform itself

## Challenges We Faced

- **Image Optimization**: Finding the right balance in data compression while feeding images to Claude's API without triggering hallucinations
- **Interactive Platform Development**: Creating a seamless environment where users can both design and play games
- **Technical Accessibility**: Developing intuitive interfaces that help non-technical users design games without requiring them to understand code

## Accomplishments

We're proud that PaperProto can take a sketch and bring it to life within seconds without substantial technical work in-between. This platform fundamentally changes how people approach game design by:

- Eliminating technical barriers
- Accelerating the design process
- Democratizing game creation
- Encouraging experimentation

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- Firebase account (for authentication and database)

### Installation

1. Clone the repository
   ```sh
   git clone https://github.com/kamrynohly/PaperProto.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Create a `.env.local` file in the root directory with your Firebase configuration
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   CLAUDE_API_KEY=your_claude_api_key
   ```
4. Start the development server
   ```sh
   npm run dev
   ```

## Usage

1. **Create an account** or log in to PaperProto
2. Select **Create New Game** from the dashboard
3. Choose your input method:
   - Upload a photo of your paper sketch
   - Use the whiteboard tool to draw directly
   - Describe your game idea in text
4. Let PaperProto transform your input into a playable game
5. Test, refine, and publish your game to the community

## Roadmap

- [ ] Mobile app version for on-the-go game creation
- [ ] Additional game templates and components
- [ ] Advanced customization options for experienced designers
- [ ] Collaboration features for team-based game development
- [ ] Export options for standalone game deployment


## Acknowledgements

* [Claude AI](https://www.anthropic.com/claude) - For powering our code generation
* [Firebase](https://firebase.google.com/) - For authentication and database services
* [Next.js](https://nextjs.org/) - For the frontend framework
* [Vercel](https://vercel.com/) - For hosting the application