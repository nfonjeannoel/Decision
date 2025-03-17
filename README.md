# Decidr - AI-Powered Decision Engine

Decidr is an AI-powered web application that helps people make better decisions by analyzing their preferences, priorities, and constraints. The system provides personalized recommendations for important life choices like career moves, major purchases, and life changes.

## Features

- **Decision Templates** for common decision types (career, purchases, life changes)
- **AI-Suggested Factors** tailored to your specific decision context
- **Smart Visualization** of options and analysis
- **Personalized Recommendations** with AI-generated explanations
- **Factor Analysis** to understand strengths and weaknesses of each option

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env.local` file in the root directory with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

### Development

Run the development server:

```
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Build for Production

```
npm run build
npm start
```

## Technology Stack

- **Frontend**: Next.js 14 with React 19
- **Styling**: TailwindCSS
- **AI Integration**: OpenAI API

## Project Structure

```
/src
  /app             # Next.js app router 
    /api           # API routes for AI integration
    /decisions     # Decision-related pages
    /dashboard     # User dashboard
  /components      # Reusable UI components
  /lib             # Utility functions and API clients
  /styles          # Global styles
```

## Environment Variables

- `OPENAI_API_KEY` - Your OpenAI API key

## License

This project is licensed under the MIT License.

## Acknowledgements

- OpenAI for providing the AI capabilities
- Next.js team for the amazing framework
- TailwindCSS for the styling utilities 