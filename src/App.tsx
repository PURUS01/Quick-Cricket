import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import HandCricket from './components/HandCricket'
import { Home as HomeIcon } from 'lucide-react'

function App() {
  const [showGame, setShowGame] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-emerald-500 to-teal-600 relative overflow-hidden">
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
              className="fixed top-4 left-4 z-50 bg-gradient-to-r from-white/30 to-white/20 backdrop-blur-lg text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-white/40 transition-all shadow-xl border border-white/30 hover:scale-105"
            >
              <HomeIcon className="w-5 h-5" />
              Home
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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
      {/* Enhanced Floating particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50, 0],
              x: [0, Math.random() * 100 - 50, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Main Title */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 z-10"
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
          className="text-9xl mb-6 drop-shadow-2xl"
        >
          🏏
        </motion.div>
        <motion.h1 
          className="text-7xl md:text-9xl font-black text-white mb-6 drop-shadow-2xl"
          animate={{
            textShadow: [
              '0 0 20px rgba(255, 255, 255, 0.5)',
              '0 0 30px rgba(74, 222, 128, 0.8)',
              '0 0 20px rgba(255, 255, 255, 0.5)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #e0f2fe 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Quick Cricket
        </motion.h1>
        <p className="text-2xl md:text-3xl text-white/95 font-semibold mb-8 drop-shadow-lg">
          Show your fingers, guess the runs! ⚡
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
        className="relative bg-gradient-to-r from-white via-green-50 to-white text-green-700 px-12 py-6 rounded-full font-black text-2xl shadow-2xl hover:shadow-green-400/50 transition-all z-10 border-2 border-green-300 overflow-hidden group"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1,
          }}
        />
        <span className="relative z-10">Start Game 🚀</span>
      </motion.button>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-16 max-w-2xl text-center z-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2 }}
          className="bg-gradient-to-br from-white/25 via-white/20 to-white/15 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30"
        >
          <h2 className="text-4xl font-black text-white mb-6 drop-shadow-lg">How to Play</h2>
          <div className="text-left space-y-4 text-lg text-white/95 font-semibold">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.3 }}
              className="flex items-center gap-3"
            >
              <span className="text-2xl">🎯</span>
              <span>Choose a number from 0-6 (show that many fingers)</span>
            </motion.p>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 }}
              className="flex items-center gap-3"
            >
              <span className="text-2xl">❌</span>
              <span>If your number matches the computer's, you're OUT!</span>
            </motion.p>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.5 }}
              className="flex items-center gap-3"
            >
              <span className="text-2xl">✅</span>
              <span>If different, add your number to your score</span>
            </motion.p>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.6 }}
              className="flex items-center gap-3"
            >
              <span className="text-2xl">🏆</span>
              <span>First to reach the target wins, or highest score after both innings</span>
            </motion.p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default App
