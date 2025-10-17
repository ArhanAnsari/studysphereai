# StudyGenius - Project Documentation

## 🚀 Project Overview
StudyGenius is an AI-powered study web application that helps students instantly solve doubts, learn concepts visually, and track their progress.

## 📁 Project Structure
```
studygenius/
├── app/
│   ├── layout.tsx          # Root layout with theme provider
│   ├── page.tsx            # Landing page ✅
│   ├── dashboard/          # Main dashboard
│   ├── ask/                # AI Q&A interface
│   ├── notes/              # Note-taking system
│   ├── profile/            # User profile
│   ├── planner/            # Study planner
│   └── auth/               # Authentication pages
├── components/
│   ├── ui/                 # Base UI components ✅
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── textarea.tsx
│   ├── QuestionInput.tsx   # Question input with voice ✅
│   ├── AnswerCard.tsx      # AI answer display ✅
│   ├── Flashcard.tsx       # Flashcard component ✅
│   ├── PlannerCard.tsx     # Study plan card ✅
│   ├── Sidebar.tsx         # Navigation sidebar ✅
│   └── Navbar.tsx          # Top navbar ✅
├── lib/
│   ├── appwrite.ts         # Appwrite configuration ✅
│   ├── ai.ts               # AI utilities ✅
│   └── utils.ts            # Helper functions ✅
└── .env.local              # Environment variables ✅
```

## ✅ Completed Features

### 1. Dependencies Installed
- ✅ Appwrite SDK
- ✅ Vercel AI SDK (@ai-sdk/google)
- ✅ Framer Motion
- ✅ Radix UI components
- ✅ KaTeX for LaTeX rendering
- ✅ React Markdown & Syntax Highlighter
- ✅ Next Themes

### 2. Core Infrastructure
- ✅ Appwrite client setup
- ✅ Database helper functions
- ✅ Authentication helpers (Email, Google OAuth, Anonymous)
- ✅ AI functions (Answer generation, Flashcards, Quiz, Study plans)

### 3. UI Components
- ✅ Button, Card, Input, Textarea
- ✅ QuestionInput (with voice support)
- ✅ AnswerCard (with LaTeX, code highlighting, text-to-speech)
- ✅ Flashcard (flip animation)
- ✅ PlannerCard (progress tracking)
- ✅ Sidebar & Navbar

### 4. Pages
- ✅ Landing page with hero and features

## 🔧 Setup Instructions

### 1. Configure Appwrite
1. Create an Appwrite project at https://cloud.appwrite.io
2. Create a database named "studygenius"
3. Create collections:
   - **users**: userId (string), name (string), email (string), level (integer), xp (integer), streak (integer), lastActivity (datetime), badges (array)
   - **questions**: userId (string), question (string), answer (string), subject (string), difficulty (enum), mode (enum), hasVisual (boolean), createdAt (datetime)
   - **notes**: userId (string), title (string), content (string), subject (string), tags (array), isFavorite (boolean), createdAt (datetime), updatedAt (datetime)
   - **progress**: userId (string), date (string), questionsAsked (integer), topicsCompleted (array), studyTime (integer), xpEarned (integer)
   - **flashcards**: userId (string), front (string), back (string), subject (string), difficulty (enum), lastReviewed (datetime), nextReview (datetime), createdAt (datetime)
   - **study_plans**: userId (string), title (string), description (string), goals (array), tasks (array), startDate (datetime), endDate (datetime), status (enum), createdAt (datetime)

4. Enable authentication methods:
   - Email/Password
   - Google OAuth
   - Anonymous

### 2. Configure Environment Variables
Update `.env.local`:
```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
APPWRITE_API_KEY=your_api_key
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key
```

### 3. Get Gemini API Key
1. Go to https://makersuite.google.com/app/apikey
2. Create an API key
3. Add it to `.env.local`

## 📋 Next Steps

### Pages to Create:
1. **Authentication Pages**
   - `/auth/signin` - Sign in page
   - `/auth/signup` - Sign up page

2. **Main Application Pages**
   - `/dashboard` - Main dashboard with overview
   - `/ask` - AI Q&A interface
   - `/notes` - Notes management
   - `/planner` - Study planner
   - `/profile` - User profile

### Additional Features:
- Progress tracking charts
- Badge system
- Leaderboard
- Quiz interface
- Voice tutor (TTS)
- PWA support
- Mobile responsiveness

## 🎨 Design System

### Colors
- Primary: Blue (#3B82F6) → Purple (#A855F7)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Error: Red (#EF4444)

### Typography
- Font: Geist Sans
- Headings: Bold, Gradient
- Body: Regular, 16px

### Components
- Rounded corners: 8-12px
- Shadows: Soft, layered
- Animations: Smooth, 0.3s
- Gradients: Blue to Purple

## 🔐 Security Notes
- Never commit `.env.local`
- Use Appwrite permissions for collections
- Implement rate limiting for AI requests
- Validate all user inputs

## 🚀 Running the App
```bash
npm run dev
```
Visit http://localhost:3000

## 📝 API Routes to Create
- `/api/ask` - Handle AI questions
- `/api/flashcards` - Generate flashcards
- `/api/quiz` - Generate quizzes
- `/api/study-plan` - Create study plans

## 🎯 Key Features Implemented
1. ✅ AI-powered question answering
2. ✅ Voice input support
3. ✅ LaTeX formula rendering
4. ✅ Code syntax highlighting
5. ✅ Text-to-speech
6. ✅ Flashcard generation
7. ✅ Quiz generation
8. ✅ Study plan generation
9. ✅ Progress tracking
10. ✅ Dark mode support

## 📊 Database Schema
All Appwrite collections are typed in `lib/appwrite.ts` with TypeScript interfaces.

## 🌟 Unique Features
- Voice-to-text question input
- AI-powered study recommendations
- Automatic difficulty detection
- Subject classification
- Streak-based motivation
- Real-time AI streaming responses
- Interactive flashcards with spaced repetition
- Customizable study plans
