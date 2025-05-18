# NextGen: NBA Draft Hub

NextGen is a modern, data-driven NBA Draft Hub designed for front office decision makers. This application helps teams evaluate and select the next generation of basketball superstars, providing a comprehensive big board, player profiles, and scouting tools—all in a sleek, responsive interface.

## Features
- **Flashy Landing Page:** Showcases top prospects in a 3D carousel.
- **Big Board:** Data-driven rankings based on multiple scouts, with visual indicators for high/low rankings.
- **Player Profiles:** Detailed player info, stats, and the ability to add new scouting reports (saved in state).
- **Responsive Design:** Optimized for laptops, but works on tablets and phones.
- **Material UI:** Modern, accessible UI components and theming.
- **Data-Driven:** Easily swap in new player data—no hardcoding.

## Tech Stack
- React + Vite
- Material UI
- React Router
- React Slick (3D Carousel)
- TypeScript

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Data
Player and scout data is sourced from `src/data/intern_project_data.json`. The app is fully data-driven—replace this file with new data to update the board and profiles.

---

Built to help NBA teams discover the Next Generation of Basketball Superstars.
