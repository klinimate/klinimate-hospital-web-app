# Klinimate Hospital Web App — Frontend

Modern, mobile-first React application for the Klinimate Clinical Command Centre.

## Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- React Router

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Production build         |
| `npm run preview` | Preview production build |
| `npm run lint`  | Run Oxlint               |

## Project Structure

```
src/
├── components/
│   ├── layout/     # App shell, auth layout, bottom navigation
│   └── ui/         # Reusable UI primitives (Button, Input, Card)
├── pages/          # Route-level screens
├── router/         # React Router configuration
├── App.tsx
├── main.tsx
└── index.css       # Tailwind theme and base styles
```

## Routes

| Path              | Screen        |
| ----------------- | ------------- |
| `/login`          | Login         |
| `/dashboard`      | Hospital dashboard |
| `/cases`          | Cases list    |
| `/notifications`  | Notifications |
| `/profile`        | Profile       |
