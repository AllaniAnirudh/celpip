# CELPIP Writing Practice App

A full-stack, open-source web application for practicing CELPIP (Canadian English Language Proficiency Index Program) Writing tasks. This application provides a comprehensive platform for users to practice email writing and survey response tasks with AI-powered scoring and feedback.

## 🚀 Features

### Core Functionality
- **Email Writing Practice**: Practice writing professional emails with realistic prompts
- **Survey Response Practice**: Practice responding to survey questions with detailed feedback
- **Real-time Writing Interface**: Clean, distraction-free writing environment
- **Timer & Word Count**: Track time and word count in real-time
- **Auto-save**: Automatic saving of your work as you type
- **AI-Powered Scoring**: Get detailed feedback and scores using OpenAI GPT API

### User Experience
- **Clean, Minimal UI**: Modern interface built with TailwindCSS
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Authentication**: Secure email/password authentication with NextAuth.js
- **Writing History**: Track your progress and review past attempts
- **Session Management**: Persistent sessions with secure JWT tokens

### Technical Features
- **TypeScript**: Full type safety throughout the application
- **Next.js 14**: Latest App Router for optimal performance
- **MongoDB**: Scalable database for user data and writing attempts
- **OpenAI Integration**: Advanced AI scoring and feedback system
- **Vercel Ready**: Optimized for deployment on Vercel

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first CSS framework
- **React Hook Form** - Form handling and validation
- **NextAuth.js** - Authentication solution

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **OpenAI GPT API** - AI-powered scoring and feedback
- **JWT** - Secure session management

### Development & Deployment
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Vercel** - Deployment platform
- **Environment Variables** - Secure configuration management

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **MongoDB** database (local or cloud)
- **OpenAI API Key** (for AI scoring features)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd celpip
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the example environment file and configure your variables:

```bash
cp env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/celpip
# or for MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/celpip

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# OpenAI
OPENAI_API_KEY=your-openai-api-key-here
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
celpip/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── scoring/       # AI scoring endpoints
│   │   └── writing/       # Writing attempt endpoints
│   ├── auth/              # Authentication pages
│   ├── practice/          # Practice task pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable React components
│   ├── Navigation.tsx     # Navigation component
│   └── WritingInterface.tsx # Writing interface component
├── lib/                   # Utility libraries
│   ├── mongodb.ts         # MongoDB connection
│   └── auth.ts            # Authentication utilities
├── models/                # Mongoose models
│   ├── User.ts            # User model
│   └── WritingAttempt.ts  # Writing attempt model
├── types/                 # TypeScript type definitions
└── public/                # Static assets
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB connection string | Yes | - |
| `NEXTAUTH_URL` | NextAuth.js base URL | Yes | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | NextAuth.js secret key | Yes | Auto-generated in production |
| `OPENAI_API_KEY` | OpenAI API key for scoring | Yes | - |

**Important**: For production deployment, you must set `NEXTAUTH_SECRET` to a secure random string. You can generate one using:
```bash
openssl rand -base64 32
```

### Database Setup

1. **Local MongoDB**:
   ```bash
   # Install MongoDB locally
   brew install mongodb-community  # macOS
   sudo systemctl start mongod     # Linux
   ```

2. **MongoDB Atlas** (Recommended for production):
   - Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Get your connection string
   - Add your IP to the whitelist

### OpenAI API Setup

1. Create an account at [OpenAI](https://platform.openai.com/)
2. Generate an API key
3. Add the key to your `.env.local` file

## 🎯 Usage

### Getting Started

1. **Sign Up**: Create a new account with your email and password
2. **Choose Task**: Select either Email Writing or Survey Response practice
3. **Read Prompt**: Carefully read the task instructions and requirements
4. **Start Writing**: Use the clean writing interface with timer and word count
5. **Submit**: Submit your response for AI-powered scoring and feedback
6. **Review**: Get detailed feedback on your writing skills

### Writing Interface Features

- **Timer**: 27-minute countdown timer for realistic CELPIP conditions
- **Word Count**: Real-time word count tracking
- **Auto-save**: Your work is automatically saved every 30 seconds
- **Full-screen**: Distraction-free writing environment
- **Responsive**: Works on all device sizes

### Scoring System

The AI scoring system evaluates your writing based on:

- **Content**: Relevance and completeness of response
- **Organization**: Logical structure and flow
- **Language Use**: Grammar, vocabulary, and sentence structure
- **Overall Score**: Comprehensive evaluation with detailed feedback

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel**:
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically on every push

3. **Environment Variables in Vercel**:
   - Go to your project settings in Vercel
   - Add all environment variables from `.env.local`
   - Update `NEXTAUTH_URL` to your production domain
   - **Important**: Set `NEXTAUTH_SECRET` to a secure random string (use `openssl rand -base64 32`)
   - Ensure `NODE_ENV` is set to `production`

### Manual Deployment

1. **Build the Application**:
   ```bash
   npm run build
   ```

2. **Start Production Server**:
   ```bash
   npm start
   ```

## 🔒 Security Features

- **Password Hashing**: Secure password storage with bcrypt
- **JWT Sessions**: Secure session management
- **Environment Variables**: Sensitive data protection
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Cross-origin request protection

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use ESLint for code quality
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **CELPIP** for providing the test format and guidelines
- **OpenAI** for the GPT API that powers our scoring system
- **Next.js** team for the amazing framework
- **Vercel** for seamless deployment
- **TailwindCSS** for the beautiful UI components

## 🔧 Troubleshooting

### Common Issues

#### NextAuth Secret Errors
If you see `NO_SECRET` or `JWT_SESSION_ERROR` errors:

1. **Development**: Create a `.env.local` file with:
   ```env
   NEXTAUTH_SECRET=development-secret-key-change-in-production-12345
   NEXTAUTH_URL=http://localhost:3000
   ```

2. **Production**: Set a secure secret:
   ```bash
   # Generate a secure secret
   openssl rand -base64 32
   ```
   Then add it to your environment variables as `NEXTAUTH_SECRET`.

#### MongoDB Connection Issues
- Ensure MongoDB is running locally or your Atlas connection string is correct
- Check that your IP is whitelisted in MongoDB Atlas
- Verify the database name in the connection string

#### OpenAI API Errors
- Verify your API key is correct and has sufficient credits
- Check that the API key has access to GPT-4 models
- Ensure your account is not rate-limited

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/celpip/issues) page
2. Create a new issue with detailed information
3. Include your environment details and error messages

## 🔄 Changelog

### v1.0.0 (Current)
- Initial release
- Email writing practice
- Survey response practice
- AI-powered scoring
- User authentication
- Writing history tracking
- Responsive design
- Auto-save functionality

---

**Happy practicing! 🎉**

This application is designed to help you excel in your CELPIP Writing test. Practice regularly, review your feedback, and improve your English writing skills. 