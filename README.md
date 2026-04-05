# Notion Lite

Notion Lite is a lightweight project and task management app inspired by the clarity of Notion-style workflows. It gives you a simple workspace to create projects, open focused project boards, add tasks, track progress, and keep everything saved locally in the browser.

![Notion Lite preview](./src/assets/hero.png)

## Features

- Create and manage multiple projects from a clean workspace dashboard
- Open each project in its own focused task board
- Add tasks quickly with keyboard-friendly input
- Rename projects inline from both the home screen and project view
- Edit task names directly inside a project board
- Mark tasks as complete or incomplete
- Delete tasks you no longer need
- Clear all completed tasks in one click
- Filter tasks by `all`, `open`, or `done`
- Search tasks inside a project
- View live progress stats like total tasks, completed tasks, remaining tasks, and completion percentage
- Keep data persistent with `localStorage`, so your projects stay available after refresh
- Navigate between pages with React Router
- Enjoy a responsive, polished UI built with custom CSS

## How It Works

The app has two main views:

- `Home`: a workspace dashboard where you can create projects, review totals, and jump into recent work
- `Project`: a dedicated board for one project where you can add, edit, search, filter, complete, and remove tasks

All data is stored in the browser using `localStorage`, so there is no backend or database required.

## Tech Stack

- React
- Vite
- React Router
- CSS
- ESLint

## Project Highlights

### Workspace Dashboard

The home page gives a high-level view of your productivity:

- Total number of projects
- Total tasks across the workspace
- Completed task count
- Active boards with unfinished work
- Completion rate across all projects
- Recent projects panel for quick access

### Project Boards

Each project has its own board with:

- Editable project title
- Task creation input
- Progress bar
- Completion metrics
- Search bar
- Status filters
- Inline task editing
- Task removal
- Bulk clear for completed tasks

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

```bash
npm install
```

### Run in Development

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Available Scripts

- `npm run dev` starts the Vite development server
- `npm run build` creates a production build
- `npm run preview` previews the production build locally
- `npm run lint` runs ESLint

## Folder Structure

```text
src/
  App.jsx        # App routes and shared state management
  home.jsx       # Workspace dashboard
  project.jsx    # Individual project board
  app.css        # Main styling
  main.jsx       # React entry point
```

## Data Model

Projects are stored with:

- `id`
- `name`
- `createdAt`
- `tasks`

Each task stores:

- `id`
- `text`
- `completed`
- `createdAt`

## Why This Project

This project is a good example of a small but complete React app that demonstrates:

- State management with React hooks
- Route-based navigation
- Persistent client-side storage
- Reusable UI patterns
- Inline editing and filtering interactions
- Dashboard-style product thinking in a compact app

## Future Improvements

- Due dates and priorities
- Drag-and-drop task ordering
- Project deletion
- Task categories or tags
- Dark mode
- Cloud sync or authentication

## License

This project is open for personal learning and customization.
