# CareerTrack

A job application tracker built with Angular. Add applications, follow them through your hiring pipeline, and see your progress at a glance. Everything is stored in your browser, so no account or backend is needed.

**Live demo:** _add your deployed link here_

![Dashboard](docs/dashboard.png)

## Features

- Add, edit and delete job applications
- Track status: Applied, Interview, Offer and Rejected
- Change a status directly from the list with a custom dropdown
- Search by company, position or location
- Filter by status and sort by company, position, date or status
- Dashboard with status counts, a breakdown bar and recent applications
- Export your data to JSON and import it back, with validation
- Data saved in Local Storage
- Responsive layout for mobile and desktop

## Tech Stack

- Angular 21 (standalone components, lazy-loaded routes)
- TypeScript
- Angular signals for state (`signal`, `computed`, `effect`)
- Reactive forms with validation
- SCSS with CSS variables

## Getting Started

Requires Node.js and npm.

```bash
git clone https://github.com/Marina-Rajkarnikar/CareerTracker.git
cd CareerTracker
npm install
ng serve
```

Open `http://localhost:4200/`.

To create a production build:

```bash
ng build
```

## Project Structure

```
src/app/
├── core/
│   ├── models/       # types and interfaces
│   └── services/     # storage and applications state
├── features/
│   ├── applications/ # list and form pages
│   └── dashboard/
└── shared/
    └── components/   # status badge and status dropdown
```

## Design Decisions

- **Signals instead of NgRx:** the state is small, so a single service with signals keeps it simple and easy to follow.
- **Storage isolated in one service:** components never touch `localStorage` directly, so swapping it for an API later would only change one file.
- **Validated import:** imported files are checked with a type guard, and duplicates are skipped by ID.

## Possible Improvements

- Authentication and a backend API for syncing across devices
- Follow-up dates and reminders
- Notes history per application
- Dark mode

## Author

Marina Rajkarnikar
