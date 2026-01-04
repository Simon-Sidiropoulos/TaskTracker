# 🚀 ProductivityHub

> Your all-in-one personal productivity platform - combining tasks, habits, goals, and time tracking in one beautiful interface.

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.18-38B2AC?logo=tailwind-css)

## ✨ Features

### 🔐 Authentication & User Management
- Secure signup/login system
- User profile management
- Persistent user sessions with localStorage
- Profile customization

### ✅ Task Management System
- **Create, edit, and delete tasks** with rich details
- **Priority levels**: Low, Medium, High
- **Status tracking**: Todo, In Progress, Done
- **Due dates** with calendar integration
- **Tags** for better organization
- **Subtasks** for breaking down complex tasks
- **Drag & drop** interface for easy task organization
- **Kanban board** view with three columns

### 🎯 Habit Tracker
- Daily habit tracking with streak logic
- **Visual calendar** showing completion history
- **Streak counter** with flame icon
- **30-day consistency** tracking
- Mark habits complete/incomplete for any day
- Missed-day handling

### 🏆 Goals & Milestones
- Set long-term goals with descriptions
- Target dates for goal completion
- **Break goals into milestones**
- **Progress percentage** calculation
- Visual progress bars
- Track milestone completion

### ⏱️ Time Tracking
- Start/stop/pause timer functionality
- Link time entries to tasks
- Track work sessions with descriptions
- **Weekly and daily time reports**
- Filter by time period (Today, This Week, All Time)
- Formatted duration display

### 📊 Analytics Dashboard
- **Task completion trends** (last 7 days)
- **Tasks by priority** pie chart
- **Habit consistency** visualization (30-day)
- **Goal progress** tracking
- **Time tracking charts** with hourly breakdown
- Quick stats overview cards
- Interactive charts using Recharts

### 🎨 Additional Features
- **Dark/Light mode** toggle with persistent preference
- Responsive sidebar navigation
- Beautiful gradient designs
- **Local storage** for offline data persistence
- User-specific data separation
- Smooth animations and transitions
- Modern, clean UI with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Styling**: Tailwind CSS 4.1.18
- **Routing**: React Router DOM
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Drag & Drop**: @dnd-kit
- **State Management**: React Context API
- **Data Persistence**: localStorage

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd my-project
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
my-project/
├── src/
│   ├── components/
│   │   └── Layout.jsx          # Main layout with sidebar
│   ├── contexts/
│   │   ├── AuthContext.jsx     # Authentication state
│   │   ├── DataContext.jsx     # App data management
│   │   └── ThemeContext.jsx    # Dark/light mode
│   ├── pages/
│   │   ├── AuthPage.jsx        # Login/Signup
│   │   ├── DashboardPage.jsx   # Overview dashboard
│   │   ├── TasksPage.jsx       # Task management
│   │   ├── HabitsPage.jsx      # Habit tracking
│   │   ├── GoalsPage.jsx       # Goals & milestones
│   │   ├── TimePage.jsx        # Time tracking
│   │   ├── AnalyticsPage.jsx   # Charts & insights
│   │   └── ProfilePage.jsx     # User profile
│   ├── App.jsx                 # Main app component
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles
├── public/
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🎯 Key Features Explained

### Context Architecture
The app uses three main contexts:
- **AuthContext**: Manages user authentication and profile
- **DataContext**: Handles all CRUD operations for tasks, habits, goals, and time entries
- **ThemeContext**: Controls dark/light mode preferences

### Data Persistence
All user data is stored in localStorage with user-specific keys, ensuring:
- Data survives page refreshes
- Multiple users can use the same browser
- Offline functionality

### Drag & Drop
Tasks can be dragged between columns (Todo, In Progress, Done) using @dnd-kit for smooth reordering.

### Streak Calculation
Habits track consecutive completion days, automatically calculating current streaks and handling missed days.

### Progress Tracking
Goals automatically calculate completion percentage based on milestone completion status.

## 🎨 Customization

### Theme Colors
Modify colors in Tailwind configuration or use the built-in dark/light mode toggle.

### Adding Features
The modular context-based architecture makes it easy to add new features:
1. Add operations to appropriate context
2. Create new page component
3. Add route in App.jsx
4. Update Layout navigation

## 📝 License

MIT License - feel free to use this project for learning or personal use!

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Contact

Created with ❤️ by [Your Name]

---

**Built with React, Vite, and Tailwind CSS** 🚀

