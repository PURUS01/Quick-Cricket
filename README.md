# Quick Cricket 🏏

An exciting, interactive Quick Cricket game built with React! Play against the computer in this classic finger-guessing game with beautiful animations and smooth gameplay.

## Features

### 🎮 Gameplay
- **Player vs Computer** - Challenge the AI in a game of Hand Cricket
- **Number Selection** - Choose numbers from 0-6 (representing finger counts)
- **Two Innings** - Play your innings, then defend your score
- **Smart AI** - Computer plays strategically to beat your target
- **Real-time Scoring** - Watch your score update with smooth animations

### ✨ Visual Features
- **Beautiful Animations** - Smooth transitions and effects using Framer Motion
- **Cricket Theme** - Green gradient backgrounds with cricket-inspired design
- **Hand Gestures** - Visual representation of number choices
- **Score Tracking** - Real-time score display with run history
- **Game Over Screen** - Celebratory animations for winners

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations and transitions
- **Lucide React** - Beautiful icons

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## How to Play

1. **Your Turn**: Click on a number (0-6) to show that many fingers
2. **Match Check**: If your number matches the computer's, you're OUT!
3. **Score Runs**: If numbers differ, add your number to your score
4. **Switch Innings**: After you're out, the computer bats to chase your target
5. **Win**: Highest score after both innings wins!

## Game Rules

- Choose numbers from **0 to 6** (representing finger counts)
- If both players show the **same number**, the batter is OUT
- If numbers differ, the batter **scores that many runs**
- After the first innings, the second player needs to **beat the target** (first score + 1)
- Highest score wins!

## Project Structure

```
src/
├── components/
│   └── HandCricket.tsx    # Main game component
├── App.tsx                # App wrapper with home screen
├── main.tsx               # Entry point
└── index.css              # Global styles
```

## Features in Detail

### Score Display
- Large, animated score numbers
- Run-by-run history display
- Target score indicator during second innings
- Real-time updates with smooth animations

### Animations
- Number selection with hover effects
- Hand gesture reveals with rotation animations
- Score updates with scale animations
- Game over screen with celebratory effects
- Smooth transitions between game states

### Game States
- **Waiting** - Initial state
- **Player Turn** - Your turn to bat
- **Computer Turn** - Computer's turn to bat
- **Out** - When a player gets out
- **Game Over** - Final results screen

## Design Philosophy

This game features:
- **Vibrant Colors** - Green cricket-themed gradients
- **Smooth Animations** - Framer Motion for fluid gameplay
- **Clear UI** - Easy to understand game flow
- **Responsive Design** - Works on desktop and mobile
- **Engaging Feedback** - Visual and textual feedback for every action

## Future Enhancements

Some ideas for future improvements:
- Multiplayer mode (local or online)
- Difficulty levels for AI
- Statistics and history tracking
- Sound effects and background music
- Tournament mode
- Leaderboards

## License

This project is open source and available for personal use.

---

**Show your fingers, guess the runs!** 🏏✨
