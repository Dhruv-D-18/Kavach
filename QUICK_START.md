# Kavach Academy - Quick Start

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

If you encounter PowerShell execution policy errors, use Command Prompt instead or run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Open Your Browser
Navigate to **http://localhost:3000**

---

## 📂 Project Structure Overview

```
src/app/              # All your pages
├── page.tsx         # Home page
├── auth/            # Authentication
├── dashboard/       # User dashboard
├── modules/         # Learning modules
├── leaderboard/     # Leaderboard
├── profile/         # User profile
└── admin/           # Admin panel

src/components/      # Reusable components
├── ui/              # Shadcn UI components
├── Navigation.tsx   # Main navigation
└── NavLink.tsx      # Active link component
```

---

## 🛠️ Common Commands

| Command            | Description                    |
|--------------------|--------------------------------|
| `npm run dev`      | Start development server       |
| `npm run build`    | Build for production           |
| `npm run start`    | Run production build           |
| `npm run lint`     | Check code quality             |

---

## 📖 Need Help?

Check out [`MIGRATION_GUIDE.md`](./MIGRATION_GUIDE.md) for detailed information about:
- Architecture changes
- Database setup (MySQL + Prisma)
- Authentication setup (NextAuth.js)
- API routes
- Environment variables
- And more!

---

**Happy Coding! 🛡️**
