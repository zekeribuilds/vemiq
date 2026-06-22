# Vemiq

An AI-powered academic operating system for engineering students that transforms raw industrial training activity into institution-ready documentation.

## Features

- **Multi-step Report Creation**: Guided workflow for SWEP and SIWES reports
- **Weekly Logbook System**: Track activities with image uploads
- **AI-Powered Generation**: Transform logs into professional academic content
- **Live A4 Preview**: Real-time document preview with proper formatting
- **PDF Export**: High-quality PDF generation with Puppeteer
- **Payment Integration**: Paystack integration for premium features

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: OpenAI API
- **PDF Generation**: Puppeteer
- **Payments**: Paystack

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key
- Paystack account (for payments)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vemiq
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local
```

Edit `.env.local` and add your credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
PAYSTACK_SECRET_KEY=your_paystack_secret_key
```

4. Set up Supabase database:
   - Run the SQL migrations in `supabase/migrations/` in your Supabase SQL editor
   - Enable Row Level Security (RLS) policies

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### Tables

- `profiles` - User profiles and information
- `reports` - Report metadata and structure
- `report_sections` - Individual report sections
- `weekly_logs` - Weekly activity logs with images
- `uploads` - File uploads
- `chat_messages` - AI chat history
- `payments` - Payment records

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── pdf/          # PDF generation
│   │   └── payments/     # Payment processing
│   ├── dashboard/        # Dashboard pages
│   └── layout.tsx        # Root layout
├── components/            # React components
│   ├── dashboard/       # Dashboard components
│   ├── report/          # Report creation components
│   ├── preview/         # A4 preview components
│   └── ai/              # AI chat components
├── lib/                  # Utility libraries
│   ├── ai/             # AI service and prompts
│   ├── pdf/            # PDF generation
│   ├── payments/       # Payment service
│   └── supabase.ts     # Supabase client
├── store/              # Zustand state management
└── types/              # TypeScript type definitions
```

## Development Phases

The project follows an 8-phase build order:

1. ✅ **Foundation** - Next.js setup, Tailwind, Supabase auth
2. ✅ **Dashboard Layout** - Sidebar, topbar, navigation
3. ✅ **Database Schema** - All tables and RLS policies
4. ✅ **Report Creation Flow** - Multi-step wizard
5. ✅ **Weekly Logbook** - Week editor with image uploads
6. ✅ **A4 Preview Engine** - Print layout and pagination
7. ✅ **AI System** - Prompt pipeline and section generator
8. ✅ **PDF Export** - Server-side rendering with Puppeteer
9. ✅ **Payments** - Paystack integration

## API Endpoints

### PDF Generation
- `POST /api/pdf/generate` - Generate PDF from report data

### Payments
- `POST /api/payments/initialize` - Initialize Paystack transaction
- `POST /api/payments/verify` - Verify payment status

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `OPENAI_API_KEY` | OpenAI API key for AI generation |
| `PAYSTACK_SECRET_KEY` | Paystack secret key for payments |

## License

MIT
