# Decidr - Decision Making Assistant

Decidr is an AI-powered decision-making assistant that helps you make better choices by structuring your decision-making process.

## Features

- Create custom decision frameworks
- AI-assisted evaluation of options against important factors
- Visual comparison of alternatives
- AI suggestions for factors, options, and ratings
- User authentication and saved decisions

## Tech Stack

- Next.js (React framework)
- TypeScript
- Tailwind CSS
- Supabase (authentication and database)
- OpenAI API

## Setup

### Prerequisites

- Node.js 18+ and npm
- A Supabase account
- An OpenAI API key

### Setting Up Supabase

1. Create a new project on [Supabase](https://supabase.com)
2. Get your project URL and anon key from the project settings
3. Run the SQL in `supabase-setup.sql` in the Supabase SQL Editor to create the necessary tables and policies

### Environment Configuration

1. Copy `.env.local` to a new file called `.env.local`
2. Fill in the environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `OPENAI_API_KEY`: Your OpenAI API key

### Installation

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

### Authentication Flow

Decidr uses Supabase for authentication. Users can:
1. Sign up with email and password
2. Log in with email and password
3. Securely save and retrieve their decisions

## Usage

1. Create a new account or log in
2. Navigate to "New Decision" to start the decision-making process
3. Follow the step-by-step guide to create your decision framework
4. Use AI assistance to help generate factors, options, and ratings
5. View your results and save your decision
6. Access your saved decisions from the dashboard

## License

MIT 