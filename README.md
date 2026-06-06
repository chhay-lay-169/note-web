# Notes App

A clean, responsive note-taking application built with Vue 3, TypeScript, and Tailwind CSS.

## Features

- **Create, Read, Update, and Delete** notes.
- **Real-time Search**: Filter notes by title or content.
- **Sorting**: Organize notes by date (newest first) or alphabetically (A-Z).
- **Responsive Design**: Optimized for both desktop and mobile viewing.
- **State Management**: Powered by Pinia for predictable data flow.

## Tech Stack

- **Frontend**: Vue 3 (Composition API with `<script setup>`)
- **State Management**: Pinia
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide Vue
- **HTTP Client**: Axios
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Create a `.env` file in the root directory.
   - Add your API URL:
     ```
     VITE_BASE_API_URL=http://localhost:5142/api
     ```

### Development

Start the development server:
```bash
npm run dev
```

### Build

Build for production:
```bash
npm run build
```
