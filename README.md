# Jobora - AI-Powered Job Aggregator for Bangladesh

<div align="center">
  <img src="public/icons/icon-192x192.png" alt="Jobora Logo" width="120" height="120">
  
  <h3>Find Your Dream Job in Bangladesh</h3>
  
  <p>A production-ready job aggregator app with AI-powered features, skeuomorphic UI design, and comprehensive job search capabilities.</p>

  [![Next.js](https://img.shields.io/badge/Next.js-14.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
</div>

---

## 🚀 Features

### Job Aggregation
- **Multiple Sources**: Aggregates jobs from Bdjobs, Prothom Alo Jobs, Chakri.com, LinkedIn, and newspapers
- **Smart Deduplication**: AI-powered duplicate detection
- **Real-time Updates**: Continuous job scraping and updates

### AI Integration (GLM 5 + OpenRouter)
- **Job Ranking**: AI-powered relevance scoring based on user profile
- **Fraud Detection**: Automatic scam job identification
- **Resume Parsing**: Extract skills and experience from resumes
- **Job Summaries**: AI-generated concise job descriptions
- **Career Recommendations**: Personalized career guidance

### Skeuomorphic UI Design
- **Tactile Interface**: Realistic, textured UI elements
- **3D Badges**: Metallic achievement badges
- **Raised Buttons**: Tactile button interactions
- **Paper & Leather Textures**: Authentic skeuomorphic aesthetics

### Gamification System
- **Points & Levels**: Earn points for activities
- **Achievement Badges**: Bronze, Silver, Gold, Platinum tiers
- **Daily Streaks**: Login streaks with bonus rewards
- **Referral Program**: Invite friends for bonus points

### Additional Features
- **Push Notifications**: Real-time job alerts via FCM
- **Offline Support**: PWA with service worker caching
- **Resume Builder**: Create and manage multiple resumes
- **Application Tracking**: Track all job applications
- **Advanced Filters**: Location, salary, job type, and more

---

## 📱 Screenshots

| Home Screen | Job Details | Gamification |
|-------------|-------------|--------------|
| ![Home](screenshots/home.png) | ![Job](screenshots/job.png) | ![Rewards](screenshots/rewards.png) |

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom skeuomorphic theme
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **AI**: GLM 5, OpenRouter (Llama 3)
- **Auth**: Supabase Auth
- **Notifications**: Firebase Cloud Messaging
- **State Management**: Zustand
- **PWA**: Service Worker, Web App Manifest

---

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Firebase project (for notifications)
- GLM 5 API key
- OpenRouter API key

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/jobora.git
   cd jobora
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your credentials:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # AI APIs
   GLM5_API_KEY=your_glm5_api_key
   OPENROUTER_API_KEY=your_openrouter_api_key

   # Firebase
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_firebase_vapid_key
   ```

4. **Set up the database**
   
   Run the SQL schema in Supabase SQL Editor:
   ```bash
   # Execute supabase/schema.sql in your Supabase dashboard
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

---

## 📁 Project Structure

```
jobora/
├── public/
│   ├── icons/              # PWA icons
│   ├── screenshots/        # App screenshots
│   └── manifest.json       # PWA manifest
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   │   ├── jobs/      # Jobs CRUD
│   │   │   ├── users/     # User management
│   │   │   └── applications/
│   │   ├── jobs/          # Job details pages
│   │   ├── profile/       # User profile
│   │   ├── gamification/  # Rewards dashboard
│   │   ├── notifications/ # Notifications
│   │   ├── resume/        # Resume builder
│   │   ├── layout.tsx     # Root layout
│   │   ├── page.tsx       # Home page
│   │   └── globals.css    # Global styles
│   ├── components/
│   │   └── ui/
│   │       └── skeuomorphic.tsx  # UI components
│   ├── lib/
│   │   ├── ai/            # AI integration
│   │   ├── scraper/       # Job scrapers
│   │   ├── supabase/      # Database client
│   │   ├── firebase.ts    # Push notifications
│   │   └── utils.ts       # Utility functions
│   ├── store/
│   │   └── index.ts       # Zustand stores
│   └── types/
│       └── database.ts    # TypeScript types
├── supabase/
│   └── schema.sql         # Database schema
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

## 🔌 API Endpoints

### Jobs
- `GET /api/jobs` - List jobs with filters
- `GET /api/jobs/[id]` - Get job details
- `POST /api/jobs` - Create job (admin)
- `PUT /api/jobs/[id]` - Update job
- `DELETE /api/jobs/[id]` - Delete job

### Users
- `GET /api/users` - Get current user
- `POST /api/users` - Create user
- `PUT /api/users` - Update profile

### Applications
- `GET /api/applications` - List user applications
- `POST /api/applications` - Save/Apply to job
- `PUT /api/applications` - Update application status
- `DELETE /api/applications` - Remove application

---

## 🤖 AI Features

### Job Ranking
The AI ranks jobs based on:
- Skills match
- Experience level
- Location preference
- Salary expectation
- Job type preference

### Fraud Detection
Flags jobs with:
- Unrealistic salary offers
- Suspicious contact methods
- Poor grammar/spelling
- Missing company information

### Resume Parsing
Extracts:
- Skills
- Work experience
- Education
- Certifications
- Languages

---

## 🎨 Skeuomorphic Design

The app features a unique skeuomorphic design with:

- **Raised buttons** with shadows and highlights
- **Inset inputs** with depth effects
- **Textured backgrounds** (paper, leather, noise)
- **Metallic badges** with shine animations
- **3D achievement badges** with tier-based styling

---

## 📊 Database Schema

### Tables
- `users` - User profiles and preferences
- `jobs` - Scraped job listings
- `applied_jobs` - User job applications
- `resumes` - User resumes
- `notifications` - Push notifications
- `gamification` - Points, badges, achievements
- `job_alerts` - User job alert preferences
- `scraper_logs` - Scraping history

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```bash
docker build -t jobora .
docker run -p 3000:3000 jobora
```

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run e2e tests
npm run test:e2e
```

---

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📧 Contact

- **Website**: [jobora.app](https://jobora.app)
- **Email**: support@jobora.app
- **Twitter**: [@jobora_bd](https://twitter.com/jobora_bd)

---

<div align="center">
  Made with ❤️ for Bangladesh job seekers
</div>
