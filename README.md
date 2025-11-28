# Kavach Academy - Cybersecurity Learning Platform

Kavach Academy is an interactive cybersecurity education platform designed to teach users about password security and best practices through hands-on modules and gamified learning experiences.

## Features

- **Interactive Password Strength Tester**: Learn to create strong passwords through practical exercises
- **Gamified Learning**: Earn XP and level up as you complete cybersecurity modules
- **Leaderboard**: Compete with other learners and track your progress
- **Educational Content**: Comprehensive theory sections covering key cybersecurity concepts
- **Progress Tracking**: Monitor your learning journey with detailed statistics

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn-ui built on Radix UI
- **State Management**: React Context API
- **Data Validation**: Zod
- **Password Analysis**: zxcvbn library
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Navigate to the project directory:
```bash
cd kavach-prototype
```

3. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Building for Production

```bash
npm run build
```

### Running Production Build

```bash
npm run start
```

## Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── admin/           # Admin dashboard
│   ├── api/             # API routes
│   ├── auth/            # Authentication pages
│   ├── dashboard/       # User dashboard
│   ├── leaderboard/     # Leaderboard page
│   ├── modules/         # Learning modules
│   ├── profile/         # User profile
│   └── ...              # Other pages
├── components/          # Reusable UI components
├── context/             # React context providers
├── hooks/               # Custom React hooks
└── lib/                 # Utility functions
```

## Key Modules

### Crack the Vault (Module 2)
An interactive password security module where users:
- Learn about password entropy and complexity
- Test password strength using the zxcvbn library
- Receive real-time feedback on password security
- Earn XP based on password strength

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [zxcvbn](https://github.com/dropbox/zxcvbn) - Password strength estimation library
- [shadcn/ui](https://ui.shadcn.com/) - Reusable components built with Radix UI and Tailwind CSS
- [Next.js](https://nextjs.org/) - React framework for production