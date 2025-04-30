# EventHub 🎪

<div align="center">
  <h2>Your Multilingual Event Management Platform</h2>
  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#language-support">Language Support</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#license">License</a>
  </p>
</div>

## 📋 Overview

EventHub is a comprehensive event management platform designed to help users discover, create, and register for events in their preferred language. With a focus on multilingual support (English/French), EventHub seamlessly connects event organizers with attendees while providing a personalized experience through language-aware UI elements.

## ✨ Features

- **Multilingual Interface**: Full English and French language support with context-aware emoji indicators
- **Event Discovery**: Browse, search, and filter events by category, date, location, and more
- **Event Creation & Management**: Easily create and manage event details, tickets, and registrations
- **User Registration**: Simple authentication system for both event organizers and attendees
- **Organizer Dashboard**: Track event performance, attendee registrations, and ticket sales
- **Responsive Design**: Beautiful, accessible interface that works on mobile and desktop
- **Language Mood Indicators**: Innovative emoji-based indicators that change based on language and time of day

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for lightning-fast builds
- **TailwindCSS** for responsive styling
- **shadcn/ui** for beautiful, accessible UI components
- **React Query** for data fetching and state management
- **Wouter** for simple routing

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **PostgreSQL** for data persistence
- **Drizzle ORM** for database interactions
- **Zod** for schema validation

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/EventHub.git
cd EventHub
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```
DATABASE_URL=postgresql://username:password@localhost:5432/eventhub
```

4. Run database migrations:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

6. Open your browser and visit `http://localhost:5000`

## 🌐 Language Support

EventHub offers a seamless multilingual experience with:

- **English/French Translation**: All UI elements available in both languages
- **Language Mood Indicators**: Contextual emojis that change based on:
  - Selected language (🫖 for English, 🥖 for French)
  - Time of day (morning: ☕/🥐, afternoon: 🫖/🥖, evening: 🍽️/🍷, night: 🌙/✨)
- **Translation Dictionary**: Efficient, hardcoded translations focused on the event domain
- **Persistent Language Selection**: User language preference maintained across sessions

## 📸 Key Features Showcase

### Innovative Language Mood System 🌍

EventHub introduces a novel language mood system that enhances the user experience with contextual emoji indicators:

- 🫖 / 🥖 - Basic language indicators (English/French)
- ☕ / 🥐 - Morning mood indicators
- 🌙 / ✨ - Night mood indicators

### Multilingual Interface

All content throughout the application is available in both English and French, with seamless switching between languages. The interface adapts to display appropriate cultural indicators based on the selected language.

### Event Management

Create, discover, and manage events with our intuitive interface. Filter by categories, search for specific events, and register directly through the platform.

## 🏗️ Architecture

EventHub follows a modern full-stack architecture:

```
EventHub/
├── client/            # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Utility functions and translations
│   │   ├── pages/       # Page components
│   │   └── types/       # TypeScript types
├── server/            # Express backend
│   ├── routes.ts      # API routes
│   ├── storage.ts     # Data access layer
│   └── translation.ts # Translation service
└── shared/            # Shared code
    └── schema.ts      # Database schema and types
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Eventbrite](https://www.eventbrite.com) for design inspiration
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- The open-source community for the amazing tools that made this project possible

---

<div align="center">
  <p>Made with ❤️ by EventHub Team</p>
</div>
