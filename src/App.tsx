import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import HandCricket from './components/HandCricket'
import { Home as HomeIcon } from 'lucide-react'

function App() {
  const [showGame, setShowGame] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-emerald-400 to-teal-500">
      <AnimatePresence mode="wait">
        {!showGame ? (
          <Home onStart={() => setShowGame(true)} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.button
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowGame(false)}
              className="fixed top-2 sm:top-4 left-2 sm:left-4 z-50 bg-white/20 backdrop-blur-md text-white px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full font-semibold text-sm sm:text-base flex items-center gap-1.5 sm:gap-2 hover:bg-white/30 transition-all shadow-lg"
            >
              <HomeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Home</span>
            </motion.button>
            <HandCricket />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Home({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-3 sm:px-4 py-8 sm:py-12 md:py-20">
      {/* Floating particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 sm:w-3 h-2 sm:h-3 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              x: [null, Math.random() * window.innerWidth],
            }}
            transition={{
              duration: Math.random() * 8 + 5,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        ))}
      </div>

      {/* Main Title */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-6 sm:mb-8 md:mb-12 z-10"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-3 sm:mb-4 md:mb-6"
        >
          🏏
        </motion.div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-9xl font-bold text-white mb-3 sm:mb-4 md:mb-6 drop-shadow-2xl px-2">
          Quick Cricket
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/90 font-light mb-4 sm:mb-6 md:mb-8 px-2">
          Show your fingers, guess the runs!
        </p>
      </motion.div>

      {/* Start Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        whileHover={{ scale: 1.1, y: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={onStart}
        className="bg-white text-green-600 px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 rounded-full font-bold text-lg sm:text-xl md:text-2xl shadow-2xl hover:shadow-3xl transition-all z-10 w-full sm:w-auto max-w-xs sm:max-w-none"
      >
        Start Game
      </motion.button>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 sm:mt-12 md:mt-16 max-w-2xl text-center text-white/90 z-10 px-4 sm:px-6"
      >
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">How to Play</h2>
        <div className="text-left space-y-2 sm:space-y-3 text-sm sm:text-base md:text-lg">
          <p>• Choose a number from 0-6 (show that many fingers)</p>
          <p>• If your number matches the computer's, you're OUT!</p>
          <p>• If different, add your number to your score</p>
          <p>• First to reach the target wins, or highest score after both innings</p>
        </div>
      </motion.div>
    </div>
  )
}

export default App
