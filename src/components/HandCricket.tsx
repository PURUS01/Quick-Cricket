import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, Target } from 'lucide-react'

type GameState = 'setup' | 'toss' | 'waiting' | 'player-turn' | 'player-bowling' | 'computer-turn' | 'out' | 'game-over'
type Innings = 'player' | 'computer'
type TossChoice = 'heads' | 'tails' | null

export default function HandCricket() {
  const [gameState, setGameState] = useState<GameState>('setup')
  const [maxNumber, setMaxNumber] = useState<number>(6)
  const [playerScore, setPlayerScore] = useState(0)
  const [computerScore, setComputerScore] = useState(0)
  const [playerRuns, setPlayerRuns] = useState<number[]>([])
  const [computerRuns, setComputerRuns] = useState<number[]>([])
  const [currentInnings, setCurrentInnings] = useState<Innings>('player')
  const [target, setTarget] = useState(0)
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null)
  const [computerChoice, setComputerChoice] = useState<number | null>(null)
  const [lastResult, setLastResult] = useState<string>('')
  const [isOut, setIsOut] = useState(false)
  const [winner, setWinner] = useState<string | null>(null)
  const [tossResult, setTossResult] = useState<'heads' | 'tails' | null>(null)
  const [playerTossChoice, setPlayerTossChoice] = useState<TossChoice>(null)
  const [tossWinner, setTossWinner] = useState<'player' | 'computer' | null>(null)
  const [showBattingBowlingChoice, setShowBattingBowlingChoice] = useState(false)
  const [isDuckOut, setIsDuckOut] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationType, setCelebrationType] = useState<'4' | '6' | '50' | 'target' | null>(null)
  const [milestoneValue, setMilestoneValue] = useState<number>(0)
  const [showWinCelebration, setShowWinCelebration] = useState(false)
  const [showLoseAnimation, setShowLoseAnimation] = useState(false)
  const [showOutAnimation, setShowOutAnimation] = useState(false)

  const numbers = Array.from({ length: maxNumber + 1 }, (_, i) => i)

  const handleRangeSelection = (max: number) => {
    setMaxNumber(max)
    setGameState('toss')
    setTossResult(null)
    setPlayerTossChoice(null)
    setTossWinner(null)
    setShowBattingBowlingChoice(false)
  }

  const handleTossChoice = (choice: 'heads' | 'tails') => {
    setPlayerTossChoice(choice)
    const coinResult = Math.random() < 0.5 ? 'heads' : 'tails'
    setTossResult(coinResult)
    
    setTimeout(() => {
      const wonToss = choice === coinResult
      setTossWinner(wonToss ? 'player' : 'computer')
      
      setTimeout(() => {
        if (wonToss) {
          // Player won toss - show option to choose batting or bowling
          setShowBattingBowlingChoice(true)
        } else {
          // Computer won toss - computer randomly chooses
          const computerChoosesBat = Math.random() < 0.5
          if (computerChoosesBat) {
            startGameWithBattingOrder('computer')
          } else {
            startGameWithBattingOrder('player')
          }
        }
      }, 2000)
    }, 1000)
  }

  const handlePlayerChoiceBattingBowling = (choice: 'bat' | 'bowl') => {
    if (choice === 'bat') {
      startGameWithBattingOrder('player')
    } else {
      startGameWithBattingOrder('computer')
    }
    setShowBattingBowlingChoice(false)
  }

  const startGameWithBattingOrder = (firstBatter: Innings) => {
    setCurrentInnings(firstBatter)
    setPlayerScore(0)
    setComputerScore(0)
    setPlayerRuns([])
    setComputerRuns([])
    setTarget(0)
    setSelectedNumber(null)
    setComputerChoice(null)
    setLastResult('')
    setIsOut(false)
    setWinner(null)
    
    if (firstBatter === 'player') {
      setGameState('player-turn')
      setLastResult('You are batting first! Choose a number to score runs.')
    } else {
      setGameState('player-bowling')
      setLastResult('Computer is batting first! Your turn to bowl.')
    }
  }

  const handlePlayerChoice = (num: number) => {
    if (gameState !== 'player-turn' || isOut) return

    setSelectedNumber(num)
    const compChoice = Math.floor(Math.random() * (maxNumber + 1))
    setComputerChoice(compChoice)
    setGameState('waiting')

    setTimeout(() => {
      if (num === compChoice) {
        // Player is OUT
        setIsOut(true)
        setShowOutAnimation(true)
        
        // Check for duck out (score 0)
        setPlayerScore(currentScore => {
          const isDuck = currentScore === 0
          if (isDuck) {
            setIsDuckOut(true)
            setLastResult(`DUCK OUT! 🦆 You scored 0 runs!`)
          } else {
            setIsDuckOut(false)
            setLastResult(`OUT! You chose ${num}, Computer chose ${compChoice}`)
          }
          setGameState('out')
          
          setTimeout(() => {
            setIsDuckOut(false)
            setShowOutAnimation(false)
            // Check if it's first or second innings using functional updates
            setTarget(currentTarget => {
              setCurrentInnings(currentInnings => {
                if (currentTarget === 0 && currentInnings === 'player') {
                  // First innings - player got out, switch to computer batting
                  switchInnings()
                } else if (currentTarget > 0 && currentInnings === 'player') {
                  // Second innings - player got out while chasing target, game over
                  setGameState('game-over')
                  checkWinner()
                }
                return currentInnings
              })
              return currentTarget
            })
          }, isDuck ? 3000 : 2000)
          return currentScore
        })
      } else {
        // Player scores - use functional update
        setPlayerScore(currentScore => {
          const newScore = currentScore + num
          setPlayerRuns(prevRuns => [...prevRuns, num])
          
          // Check for 4 or 6
          if (num === 4 || num === 6) {
            setCelebrationType(num === 4 ? '4' : '6')
            setShowCelebration(true)
            setLastResult(`${num === 4 ? 'FOUR' : 'SIX'}! 🎉 You scored ${num}! (You: ${num}, Computer: ${compChoice})`)
            
            setTimeout(() => {
              setShowCelebration(false)
              setCelebrationType(null)
            }, 2000)
          } else {
            setLastResult(`You scored ${num}! (You: ${num}, Computer: ${compChoice})`)
          }
          
          // Check for 50s milestone (50, 100, 150, 200, etc.)
          const milestone = Math.floor(newScore / 50) * 50
          const prevMilestone = Math.floor(currentScore / 50) * 50
          if (milestone >= 50 && milestone > prevMilestone) {
            setTimeout(() => {
              setMilestoneValue(milestone)
              setCelebrationType('50')
              setShowCelebration(true)
              setLastResult(`🎯 ${milestone} RUNS MILESTONE! 🎯`)
              setTimeout(() => {
                setShowCelebration(false)
                setCelebrationType(null)
                setMilestoneValue(0)
              }, 2500)
            }, num === 4 || num === 6 ? 2000 : 500)
          }
          
          // Check if player reached/exceeded the target (second innings)
          if (target > 0 && newScore >= target) {
            setTimeout(() => {
              setCelebrationType('target')
              setShowCelebration(true)
              setLastResult(`🎯 TARGET REACHED! You scored ${num}! Final: ${newScore}/${target}`)
              setTimeout(() => {
                setShowCelebration(false)
                setCelebrationType(null)
                setGameState('game-over')
                checkWinner()
              }, 2000)
            }, num === 4 || num === 6 ? 2000 : 1500)
          } else {
            setTimeout(() => {
              setSelectedNumber(null)
              setComputerChoice(null)
              setGameState('player-turn')
            }, num === 4 || num === 6 ? 2000 : 1500)
          }
          
          return newScore
        })
      }
    }, 500)
  }

  const switchInnings = () => {
    setCurrentInnings(current => {
      if (current === 'player') {
        // Use functional update to get latest player score
        setPlayerScore(currentScore => {
          const newTarget = currentScore + 1
          setTarget(newTarget)
          setCurrentInnings('computer')
          setIsOut(false)
          setGameState('player-bowling')
          setSelectedNumber(null)
          setComputerChoice(null)
          setLastResult(`Target: ${newTarget} runs - Your turn to bowl!`)
          return currentScore
        })
      } else {
        // Game Over
        checkWinner()
      }
      return current
    })
  }

  const switchInningsFromComputer = () => {
    // Computer's innings ended, now player bats
    setComputerScore(currentScore => {
      const newTarget = currentScore + 1
      setTarget(newTarget)
      setCurrentInnings('player')
      setIsOut(false)
      setGameState('player-turn')
      setSelectedNumber(null)
      setComputerChoice(null)
      setLastResult(`Target: ${newTarget} runs - Your turn to bat!`)
      return currentScore
    })
  }

  const handlePlayerBowling = (bowlNumber: number) => {
    if (gameState !== 'player-bowling' || isOut) return

    setSelectedNumber(bowlNumber)
    const compBattingChoice = Math.floor(Math.random() * (maxNumber + 1))
    setComputerChoice(compBattingChoice)
    setGameState('waiting')

    setTimeout(() => {
      if (bowlNumber === compBattingChoice) {
        // Computer is OUT
        setIsOut(true)
        setShowOutAnimation(true)
        
        // Check for duck out
        setComputerScore(currentScore => {
          const isDuck = currentScore === 0
          if (isDuck) {
            setIsDuckOut(true)
            setLastResult(`Computer DUCK OUT! 🦆 Computer scored 0 runs!`)
          } else {
            setIsDuckOut(false)
            setLastResult(`Computer OUT! (You bowled: ${bowlNumber}, Computer batted: ${compBattingChoice})`)
          }
          
          // Check if it's first innings (no target) or second innings (has target) using functional updates
          setTarget(currentTarget => {
            setCurrentInnings(currentInnings => {
              if (currentTarget === 0 && currentInnings === 'computer') {
                // First innings - computer got out, switch to player batting
                setGameState('out')
                setTimeout(() => {
                  setIsDuckOut(false)
                  setShowOutAnimation(false)
                  switchInningsFromComputer()
                }, isDuck ? 3000 : 2000)
              } else if (currentTarget > 0 && currentInnings === 'computer') {
                // Second innings - computer got out while chasing target, game over
                setGameState('game-over')
                setTimeout(() => {
                  setIsDuckOut(false)
                  setShowOutAnimation(false)
                  checkWinner()
                }, isDuck ? 3000 : 2000)
              }
              return currentInnings
            })
            return currentTarget
          })
          return currentScore
        })
      } else {
        // Computer scores - use functional update to get latest score
        setComputerScore(currentScore => {
          const newScore = currentScore + compBattingChoice
          setComputerRuns(prevRuns => [...prevRuns, compBattingChoice])
          
          // Check for 4 or 6
          if (compBattingChoice === 4 || compBattingChoice === 6) {
            setCelebrationType(compBattingChoice === 4 ? '4' : '6')
            setShowCelebration(true)
            setLastResult(`Computer hit ${compBattingChoice === 4 ? 'FOUR' : 'SIX'}! 🎉 Computer scored ${compBattingChoice}!`)
            
            setTimeout(() => {
              setShowCelebration(false)
              setCelebrationType(null)
            }, 2000)
          } else {
            setLastResult(`Computer scored ${compBattingChoice}! (You bowled: ${bowlNumber}, Computer batted: ${compBattingChoice})`)
          }
          
          // Check for 50s milestone
          const milestone = Math.floor(newScore / 50) * 50
          const prevMilestone = Math.floor(currentScore / 50) * 50
          if (milestone >= 50 && milestone > prevMilestone) {
            setTimeout(() => {
              setMilestoneValue(milestone)
              setCelebrationType('50')
              setShowCelebration(true)
              setLastResult(`🎯 Computer reached ${milestone} RUNS MILESTONE! 🎯`)
              setTimeout(() => {
                setShowCelebration(false)
                setCelebrationType(null)
                setMilestoneValue(0)
              }, 2500)
            }, compBattingChoice === 4 || compBattingChoice === 6 ? 2000 : 500)
          }
          
          if (newScore >= target && target > 0) {
            setTimeout(() => {
              setCelebrationType('target')
              setShowCelebration(true)
              setLastResult(`🎯 Computer reached the target! Computer scored ${compBattingChoice}! Final: ${newScore}/${target}`)
              setTimeout(() => {
                setShowCelebration(false)
                setCelebrationType(null)
                setGameState('game-over')
                checkWinner()
              }, 2000)
            }, compBattingChoice === 4 || compBattingChoice === 6 ? 2000 : 1500)
          } else {
            setTimeout(() => {
              setSelectedNumber(null)
              setComputerChoice(null)
              setGameState('player-bowling')
            }, compBattingChoice === 4 || compBattingChoice === 6 ? 2000 : 1500)
          }
          
          return newScore
        })
      }
    }, 500)
  }

  const checkWinner = () => {
    setGameState('game-over')
  }

  // Determine winner when game ends
  useEffect(() => {
    if (gameState === 'game-over' && winner === null) {
      if (playerScore > computerScore) {
        setWinner('player')
        setShowWinCelebration(true)
      } else if (computerScore > playerScore) {
        setWinner('computer')
        setShowLoseAnimation(true)
      } else {
        setWinner('tie')
      }
    }
  }, [gameState, playerScore, computerScore, winner])

  const resetGame = () => {
    setGameState('setup')
    setPlayerScore(0)
    setComputerScore(0)
    setPlayerRuns([])
    setComputerRuns([])
    setCurrentInnings('player')
    setTarget(0)
    setSelectedNumber(null)
    setComputerChoice(null)
    setLastResult('')
    setIsOut(false)
    setWinner(null)
    setTossResult(null)
    setPlayerTossChoice(null)
    setTossWinner(null)
    setShowBattingBowlingChoice(false)
    setIsDuckOut(false)
    setShowCelebration(false)
    setCelebrationType(null)
    setMilestoneValue(0)
    setShowWinCelebration(false)
    setShowLoseAnimation(false)
    setShowOutAnimation(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20 bg-gradient-to-br from-green-600 via-emerald-500 to-teal-600 relative overflow-hidden">
      {/* Animated Background Particles */}
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
      {/* Setup Screen - Number Range Selection */}
      {gameState === 'setup' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-4xl"
        >
          <motion.div
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
              className="text-8xl mb-6"
            >
              🏏
            </motion.div>
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 drop-shadow-2xl">
              Quick Cricket
            </h1>
            <p className="text-2xl text-white/90 mb-8">
              Select Number Range
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/20 backdrop-blur-md rounded-3xl p-8 shadow-2xl"
          >
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Choose Maximum Number
            </h2>
            <p className="text-white/80 text-center mb-8 text-lg">
              Select the highest number you can choose (0 to your selected number)
            </p>
            
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-8">
              {[3, 4, 5, 6, 7, 8, 9, 10].map((max) => (
                <motion.button
                  key={max}
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleRangeSelection(max)}
                  className={`relative bg-gradient-to-br from-white/40 via-white/30 to-white/20 backdrop-blur-lg text-white text-3xl font-black rounded-2xl p-6 shadow-2xl transition-all aspect-square flex flex-col items-center justify-center border-2 ${
                    maxNumber === max 
                      ? 'ring-4 ring-yellow-400 bg-gradient-to-br from-yellow-400/60 to-orange-400/50 border-yellow-300 shadow-yellow-400/50' 
                      : 'border-white/40 hover:border-white/60 hover:bg-white/50'
                  }`}
                >
                  <span className="text-4xl">{max}</span>
                  <span className="text-sm mt-1">0-{max}</span>
                </motion.button>
              ))}
            </div>

            <div className="text-center">
              <p className="text-white/70 text-sm mb-4">
                Current Selection: <span className="font-bold text-white">0 to {maxNumber}</span>
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleRangeSelection(maxNumber)}
                className="bg-gradient-to-r from-white to-green-50 text-green-700 px-12 py-4 rounded-full font-black text-xl shadow-2xl hover:shadow-green-400/50 transition-all border-2 border-green-300 hover:scale-105"
              >
                Start Game with 0-{maxNumber}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Toss Screen */}
      {gameState === 'toss' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-4xl"
        >
          <motion.div
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-2xl">
              Coin Toss
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Choose Heads or Tails to decide who bats first
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/20 backdrop-blur-md rounded-3xl p-8 shadow-2xl"
          >
            {!tossResult ? (
              <>
                <div className="flex justify-center gap-6 mb-8">
                  <motion.button
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleTossChoice('heads')}
                    className="bg-gradient-to-br from-yellow-400 via-orange-400 to-yellow-500 text-white text-3xl font-black rounded-2xl px-12 py-8 shadow-2xl hover:shadow-yellow-400/50 transition-all border-2 border-yellow-300 hover:scale-105 relative overflow-hidden group"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{
                        x: ['-100%', '100%'],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                    />
                    <div className="text-6xl mb-2 relative z-10">🪙</div>
                    <div className="relative z-10">Heads</div>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleTossChoice('tails')}
                    className="bg-gradient-to-br from-blue-400 via-purple-400 to-blue-500 text-white text-3xl font-black rounded-2xl px-12 py-8 shadow-2xl hover:shadow-blue-400/50 transition-all border-2 border-blue-300 hover:scale-105 relative overflow-hidden group"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{
                        x: ['-100%', '100%'],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                    />
                    <div className="text-6xl mb-2 relative z-10">🪙</div>
                    <div className="relative z-10">Tails</div>
                  </motion.button>
                </div>
              </>
            ) : (
              <div className="text-center">
                {/* Coin Animation */}
                <motion.div
                  initial={{ rotateY: 0 }}
                  animate={{ rotateY: [0, 1800, 3600] }}
                  transition={{ duration: 2, ease: 'easeInOut' }}
                  className="mb-8"
                >
                  <div className="text-9xl">
                    {tossResult === 'heads' ? '🪙' : '🪙'}
                  </div>
                </motion.div>

                {/* Result */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 }}
                  className="mb-6"
                >
                  <h2 className="text-4xl font-bold text-white mb-4">
                    {tossResult === 'heads' ? 'Heads!' : 'Tails!'}
                  </h2>
                  <p className="text-2xl text-white/90 mb-4">
                    You chose: <span className="font-bold">{playerTossChoice}</span>
                  </p>
                </motion.div>

                {/* Winner */}
                {tossWinner && !showBattingBowlingChoice && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 }}
                    className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl p-6 mb-4"
                  >
                    <h3 className="text-3xl font-bold text-white mb-2">
                      {tossWinner === 'player' ? '🎉 You Won the Toss!' : 'Computer Won the Toss!'}
                    </h3>
                    {tossWinner === 'computer' && (
                      <p className="text-xl text-white/90">
                        Computer chose to bat first!
                      </p>
                    )}
                  </motion.div>
                )}

                {/* Batting/Bowling Choice - Only shown when player wins toss */}
                {showBattingBowlingChoice && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8"
                  >
                    <h3 className="text-3xl font-bold text-white mb-6 text-center">
                      Choose Your Option
                    </h3>
                    <div className="flex justify-center gap-6">
                      <motion.button
                        whileHover={{ scale: 1.1, y: -5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handlePlayerChoiceBattingBowling('bat')}
                        className="relative bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 text-white text-2xl font-black rounded-2xl px-10 py-6 shadow-2xl hover:shadow-green-400/50 transition-all border-2 border-green-400 hover:scale-105 overflow-hidden group"
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          animate={{
                            x: ['-100%', '100%'],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            repeatDelay: 0.5,
                          }}
                        />
                        <div className="text-5xl mb-2 relative z-10">🏏</div>
                        <div className="relative z-10">Bat First</div>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1, y: -5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handlePlayerChoiceBattingBowling('bowl')}
                        className="relative bg-gradient-to-br from-red-500 via-pink-500 to-red-600 text-white text-2xl font-black rounded-2xl px-10 py-6 shadow-2xl hover:shadow-red-400/50 transition-all border-2 border-red-400 hover:scale-105 overflow-hidden group"
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          animate={{
                            x: ['-100%', '100%'],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            repeatDelay: 0.5,
                          }}
                        />
                        <div className="text-5xl mb-2 relative z-10">🎯</div>
                        <div className="relative z-10">Bowl First</div>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Score Board */}
      {gameState !== 'setup' && gameState !== 'toss' && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-white/25 via-white/20 to-white/15 backdrop-blur-xl rounded-3xl p-8 mb-8 shadow-2xl w-full max-w-4xl border border-white/30 relative z-10"
        >
        <div className="grid grid-cols-2 gap-6 mb-4">
          <motion.div 
            className={`text-center p-6 rounded-2xl transition-all ${
              currentInnings === 'player' 
                ? 'bg-gradient-to-br from-green-400/40 to-emerald-500/40 ring-4 ring-green-300/50 shadow-lg' 
                : 'bg-white/10'
            }`}
            animate={currentInnings === 'player' ? {
              boxShadow: [
                '0 0 20px rgba(74, 222, 128, 0.3)',
                '0 0 30px rgba(74, 222, 128, 0.5)',
                '0 0 20px rgba(74, 222, 128, 0.3)',
              ],
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">You</h3>
            <motion.div
              key={playerScore}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="text-7xl font-black text-white drop-shadow-2xl mb-2"
              style={{ 
                textShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
                background: 'linear-gradient(135deg, #ffffff 0%, #e0f2fe 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {playerScore}
            </motion.div>
            <div className="text-white/90 mt-3">
              {playerRuns.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center">
                  {playerRuns.map((run, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-gradient-to-r from-green-400/50 to-emerald-500/50 px-3 py-1 rounded-lg font-semibold border border-white/30 shadow-md"
                    >
                      {run}
                    </motion.span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
          <motion.div 
            className={`text-center p-6 rounded-2xl transition-all ${
              currentInnings === 'computer' 
                ? 'bg-gradient-to-br from-blue-400/40 to-purple-500/40 ring-4 ring-blue-300/50 shadow-lg' 
                : 'bg-white/10'
            }`}
            animate={currentInnings === 'computer' ? {
              boxShadow: [
                '0 0 20px rgba(96, 165, 250, 0.3)',
                '0 0 30px rgba(96, 165, 250, 0.5)',
                '0 0 20px rgba(96, 165, 250, 0.3)',
              ],
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">Computer</h3>
            <motion.div
              key={computerScore}
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="text-7xl font-black text-white drop-shadow-2xl mb-2"
              style={{ 
                textShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
                background: 'linear-gradient(135deg, #ffffff 0%, #e0f2fe 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {computerScore}
            </motion.div>
            <div className="text-white/90 mt-3">
              {computerRuns.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center">
                  {computerRuns.map((run, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-gradient-to-r from-blue-400/50 to-purple-500/50 px-3 py-1 rounded-lg font-semibold border border-white/30 shadow-md"
                    >
                      {run}
                    </motion.span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
        
        {target > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="text-center mt-6"
          >
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 20px rgba(251, 191, 36, 0.5)',
                  '0 0 30px rgba(251, 191, 36, 0.7)',
                  '0 0 20px rgba(251, 191, 36, 0.5)',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 px-6 py-3 rounded-2xl border-2 border-yellow-300/50 shadow-2xl backdrop-blur-sm"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              >
                <Target className="w-6 h-6 text-white drop-shadow-lg" />
              </motion.div>
              <span className="text-sm font-semibold text-white/90 uppercase tracking-wider">
                Target
              </span>
              <span className="text-3xl font-black text-white drop-shadow-lg">
                {target}
              </span>
              <span className="text-sm font-semibold text-white/90">
                runs
              </span>
            </motion.div>
          </motion.div>
        )}
        </motion.div>
      )}

      {/* Current Status */}
      {gameState !== 'setup' && gameState !== 'toss' && (
        <AnimatePresence mode="wait">
        {gameState === 'player-turn' && !isOut && (
          <motion.div
            key="player-turn"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center mb-8"
          >
            <motion.h2 
              className="text-5xl font-black text-white mb-4 drop-shadow-2xl"
              animate={{
                textShadow: [
                  '0 0 20px rgba(255, 255, 255, 0.5)',
                  '0 0 30px rgba(74, 222, 128, 0.8)',
                  '0 0 20px rgba(255, 255, 255, 0.5)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Your Turn - Choose a Number! ⚡
            </motion.h2>
          </motion.div>
        )}

        {gameState === 'player-bowling' && !isOut && (
          <motion.div
            key="player-bowling"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center mb-8"
          >
            <motion.h2 
              className="text-5xl font-black text-white mb-4 drop-shadow-2xl"
              animate={{
                textShadow: [
                  '0 0 20px rgba(255, 255, 255, 0.5)',
                  '0 0 30px rgba(239, 68, 68, 0.8)',
                  '0 0 20px rgba(255, 255, 255, 0.5)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Your Turn to Bowl! 🎯
            </motion.h2>
            <p className="text-xl text-white/90 font-semibold">
              Choose a number to bowl and try to get the computer out!
            </p>
          </motion.div>
        )}

        {isOut && (
          <motion.div
            key="out"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center mb-8"
          >
            {isDuckOut ? (
              <>
                <motion.div
                  animate={{ 
                    x: [0, 20, -20, 20, -20, 0],
                    rotate: [0, 5, -5, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-8xl mb-4"
                >
                  🦆
                </motion.div>
                <motion.h2
                  animate={{ 
                    scale: [1, 1.1, 1],
                    color: ["#fca5a5", "#ef4444", "#fca5a5"]
                  }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="text-5xl font-bold text-red-200 mb-2 drop-shadow-lg"
                >
                  DUCK OUT! 🦆
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-2xl text-yellow-200 font-semibold"
                >
                  Walked back with 0 runs!
                </motion.p>
              </>
            ) : (
              <>
                <motion.div
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="text-6xl mb-4"
                >
                  ❌
                </motion.div>
                <h2 className="text-4xl font-bold text-red-200 mb-2 drop-shadow-lg">
                  OUT!
                </h2>
              </>
            )}
          </motion.div>
        )}
        </AnimatePresence>
      )}

      {/* Last Result */}
      {gameState !== 'setup' && gameState !== 'toss' && lastResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`backdrop-blur-lg rounded-2xl p-6 mb-8 text-center border shadow-xl ${
            showCelebration && (celebrationType === '4' || celebrationType === '6') 
              ? 'bg-gradient-to-r from-yellow-400/50 to-orange-400/50 border-4 border-yellow-300' 
              : showCelebration && celebrationType === 'target'
              ? 'bg-gradient-to-r from-green-400/50 to-emerald-500/50 border-4 border-green-300'
              : showCelebration && celebrationType === '50'
              ? 'bg-gradient-to-r from-yellow-400/50 to-amber-400/50 border-4 border-yellow-300'
              : 'bg-gradient-to-br from-white/35 via-white/30 to-white/25 border-white/40'
          }`}
        >
          <p className={`text-xl font-bold ${
            showCelebration && (celebrationType === '4' || celebrationType === '6' || celebrationType === '50')
              ? 'text-yellow-100' 
              : showCelebration && celebrationType === 'target'
              ? 'text-green-100'
              : 'text-white'
          }`}>{lastResult}</p>
        </motion.div>
      )}

      {/* Number Selection - Player Batting */}
      {gameState !== 'setup' && gameState !== 'toss' && gameState === 'player-turn' && !isOut && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className={`grid gap-4 mb-8 w-full max-w-4xl ${
            numbers.length <= 7 
              ? 'grid-cols-4 md:grid-cols-7' 
              : numbers.length <= 11
              ? 'grid-cols-4 md:grid-cols-6'
              : 'grid-cols-4 md:grid-cols-5'
          }`}
        >
          {numbers.map((num) => (
            <motion.button
              key={num}
              whileHover={{ 
                scale: 1.15, 
                y: -8,
                boxShadow: '0 10px 30px rgba(255, 255, 255, 0.4)',
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePlayerChoice(num)}
              className="relative bg-gradient-to-br from-white/40 via-white/30 to-white/20 backdrop-blur-lg text-white text-5xl font-black rounded-2xl p-8 shadow-2xl transition-all aspect-square flex items-center justify-center border-2 border-white/40 overflow-hidden group"
            >
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-green-300/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity"
                animate={{
                  background: [
                    'linear-gradient(135deg, rgba(74, 222, 128, 0.2), rgba(16, 185, 129, 0.2))',
                    'linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(74, 222, 128, 0.3))',
                    'linear-gradient(135deg, rgba(74, 222, 128, 0.2), rgba(16, 185, 129, 0.2))',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="relative z-10 drop-shadow-lg" style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)' }}>
                {num}
              </span>
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Number Selection - Player Bowling */}
      {gameState !== 'setup' && gameState !== 'toss' && gameState === 'player-bowling' && !isOut && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className={`grid gap-4 mb-8 w-full max-w-4xl ${
            numbers.length <= 7 
              ? 'grid-cols-4 md:grid-cols-7' 
              : numbers.length <= 11
              ? 'grid-cols-4 md:grid-cols-6'
              : 'grid-cols-4 md:grid-cols-5'
          }`}
        >
          {numbers.map((num) => (
            <motion.button
              key={num}
              whileHover={{ 
                scale: 1.15, 
                y: -8,
                boxShadow: '0 10px 30px rgba(239, 68, 68, 0.5)',
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePlayerBowling(num)}
              className="relative bg-gradient-to-br from-red-400/50 via-red-500/40 to-pink-500/30 backdrop-blur-lg text-white text-5xl font-black rounded-2xl p-8 shadow-2xl transition-all aspect-square flex items-center justify-center border-2 border-red-300/60 overflow-hidden group"
            >
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-red-300/30 to-pink-400/30 opacity-0 group-hover:opacity-100 transition-opacity"
                animate={{
                  background: [
                    'linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(236, 72, 153, 0.3))',
                    'linear-gradient(135deg, rgba(236, 72, 153, 0.4), rgba(239, 68, 68, 0.4))',
                    'linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(236, 72, 153, 0.3))',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="relative z-10 drop-shadow-lg" style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)' }}>
                {num}
              </span>
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Hand Display */}
      {gameState !== 'setup' && gameState !== 'toss' && (selectedNumber !== null || computerChoice !== null) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-12 mb-8 relative z-10"
        >
          {selectedNumber !== null && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="text-center bg-gradient-to-br from-green-400/30 to-emerald-500/30 backdrop-blur-lg rounded-2xl p-6 border-2 border-green-300/50 shadow-xl"
            >
              <motion.div 
                className="text-7xl mb-2"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {gameState === 'player-bowling' || (gameState === 'waiting' && currentInnings === 'computer') ? '🎯' : '✋'}
              </motion.div>
              <div className="text-3xl font-black text-white drop-shadow-lg">
                {gameState === 'player-bowling' || (gameState === 'waiting' && currentInnings === 'computer') 
                  ? `You bowled: ${selectedNumber}` 
                  : `You: ${selectedNumber}`}
              </div>
            </motion.div>
          )}
          {computerChoice !== null && (
            <motion.div
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="text-center bg-gradient-to-br from-blue-400/30 to-purple-500/30 backdrop-blur-lg rounded-2xl p-6 border-2 border-blue-300/50 shadow-xl"
            >
              <motion.div 
                className="text-7xl mb-2"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, -10, 10, 0]
                }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
              >
                🤖
              </motion.div>
              <div className="text-3xl font-black text-white drop-shadow-lg">
                {gameState === 'player-bowling' || (gameState === 'waiting' && currentInnings === 'computer')
                  ? `Comp batted: ${computerChoice}`
                  : `Comp: ${computerChoice}`}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Duck Out Walk Animation */}
      <AnimatePresence>
        {isDuckOut && isOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[85] pointer-events-none flex items-center justify-center"
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ x: '50%', y: '80%', opacity: 0 }}
                animate={{
                  x: `${50 + (i - 2) * 15}%`,
                  y: '80%',
                  opacity: [0, 1, 1, 0],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  repeat: Infinity,
                  repeatDelay: 0.5
                }}
                className="absolute text-6xl"
              >
                🦆
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Out Animation Overlay */}
      <AnimatePresence>
        {showOutAnimation && isOut && !isDuckOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[85] pointer-events-none flex items-center justify-center"
          >
            {/* Shake effect */}
            <motion.div
              animate={{
                x: [0, -10, 10, -10, 10, 0],
                y: [0, -5, 5, -5, 5, 0],
              }}
              transition={{
                duration: 0.5,
                repeat: 1
              }}
              className="absolute inset-0 bg-red-500/20"
            />
            
            {/* Falling particles */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: `${50 + (Math.random() - 0.5) * 40}%`,
                  y: '20%',
                  scale: 0,
                  opacity: 1
                }}
                animate={{
                  y: '100%',
                  x: `${50 + (Math.random() - 0.5) * 100}%`,
                  scale: [0, 1, 0.8, 0],
                  opacity: [1, 1, 0.8, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.05,
                  ease: "easeIn"
                }}
                className="absolute text-3xl"
              >
                {['❌', '💥', '⚡', '🔥'][Math.floor(Math.random() * 4)]}
              </motion.div>
            ))}
            
            {/* Central OUT text */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ 
                scale: [0, 1.3, 1],
                rotate: [-180, 0]
              }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <motion.h1
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 0.3,
                  repeat: 3
                }}
                className="text-9xl font-black text-red-500 drop-shadow-2xl"
                style={{ textShadow: '0 0 30px rgba(239, 68, 68, 0.8)' }}
              >
                OUT!
              </motion.h1>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4 or 6 Celebration */}
      <AnimatePresence>
        {showCelebration && (celebrationType === '4' || celebrationType === '6') && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed inset-0 flex items-center justify-center z-[90] pointer-events-none"
          >
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{
                duration: 0.6,
                repeat: 2
              }}
              className={`text-center ${
                celebrationType === '4' ? 'text-blue-400' : 'text-yellow-400'
              }`}
            >
              <motion.div
                animate={{
                  scale: [1, 1.5, 1],
                  y: [0, -50, 0]
                }}
                transition={{
                  duration: 0.8,
                  repeat: 1
                }}
                className="text-9xl mb-4 drop-shadow-2xl"
              >
                {celebrationType === '4' ? '4️⃣' : '6️⃣'}
              </motion.div>
              <motion.h1
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 0.5,
                  repeat: 2
                }}
                className={`text-8xl font-black drop-shadow-2xl ${
                  celebrationType === '4' ? 'text-blue-300' : 'text-yellow-300'
                }`}
              >
                {celebrationType === '4' ? 'FOUR!' : 'SIX!'}
              </motion.h1>
              <motion.div
                animate={{
                  scale: [0, 1.2, 1],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 1,
                  delay: 0.3
                }}
                className="text-6xl mt-4"
              >
                🎉🎊🎉
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 50s Milestone Celebration */}
      <AnimatePresence>
        {showCelebration && celebrationType === '50' && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed inset-0 flex items-center justify-center z-[90] pointer-events-none"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 0.8,
                repeat: 2
              }}
              className="text-center text-yellow-300"
            >
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  y: [0, -30, 0]
                }}
                transition={{
                  duration: 0.6,
                  repeat: 1
                }}
                className="text-8xl mb-4"
              >
                🎯
              </motion.div>
              <motion.h1
                animate={{
                  scale: [1, 1.15, 1],
                }}
                transition={{
                  duration: 0.4,
                  repeat: 3
                }}
                className="text-8xl font-black drop-shadow-2xl text-yellow-200 mb-2"
              >
                {milestoneValue} RUNS!
              </motion.h1>
              <motion.h2
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 0.4,
                  repeat: 3,
                  delay: 0.1
                }}
                className="text-6xl font-bold drop-shadow-xl text-yellow-100 mb-4"
              >
                {milestoneValue === 50 ? 'HALF CENTURY!' : milestoneValue === 100 ? 'CENTURY!' : 'MILESTONE!'}
              </motion.h2>
              <motion.div
                animate={{
                  scale: [0, 1.1, 1],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 1,
                  delay: 0.2
                }}
                className="text-5xl mt-4"
              >
                🏆⭐🏆
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Target Reached Celebration */}
      <AnimatePresence>
        {showCelebration && celebrationType === 'target' && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed inset-0 flex items-center justify-center z-[90] pointer-events-none"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{
                duration: 0.8,
                repeat: 2
              }}
              className="text-center text-green-300"
            >
              <motion.div
                animate={{
                  scale: [1, 1.4, 1],
                  y: [0, -40, 0]
                }}
                transition={{
                  duration: 0.7,
                  repeat: 1
                }}
                className="text-9xl mb-4"
              >
                🎯
              </motion.div>
              <motion.h1
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 0.5,
                  repeat: 3
                }}
                className="text-7xl font-black drop-shadow-2xl text-green-200"
              >
                TARGET REACHED!
              </motion.h1>
              <motion.div
                animate={{
                  scale: [0, 1.2, 1],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 1,
                  delay: 0.3
                }}
                className="text-6xl mt-4"
              >
                🎉🎊🎉
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Win Celebration Overlay */}
      <AnimatePresence>
        {showWinCelebration && winner === 'player' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[95] pointer-events-none"
          >
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: '50%',
                  y: '50%',
                  scale: 0,
                  opacity: 1
                }}
                animate={{
                  x: `${50 + (Math.random() - 0.5) * 100}%`,
                  y: `${50 + (Math.random() - 0.5) * 100}%`,
                  scale: [0, 1, 0],
                  opacity: [1, 1, 0],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
                className="absolute text-4xl"
              >
                {['🎉', '🎊', '🏆', '⭐', '✨', '💫'][Math.floor(Math.random() * 6)]}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lose Animation Overlay */}
      <AnimatePresence>
        {showLoseAnimation && winner === 'computer' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[95] pointer-events-none flex items-center justify-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, -5, 5, -5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
              className="text-9xl"
            >
              😢
            </motion.div>
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: '50%',
                  y: '50%',
                  scale: 0,
                  opacity: 1
                }}
                animate={{
                  x: `${50 + (Math.random() - 0.5) * 80}%`,
                  y: `${50 + (Math.random() - 0.5) * 80}%`,
                  scale: [0, 0.5, 0],
                  opacity: [0.5, 0.5, 0],
                  rotate: [0, 180]
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.15,
                  repeat: Infinity,
                  repeatDelay: 0.5
                }}
                className="absolute text-3xl"
              >
                💔
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Over Screen */}
      <AnimatePresence>
        {gameState === 'game-over' && winner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className={`bg-gradient-to-br rounded-3xl p-12 text-center shadow-2xl max-w-md mx-4 ${
                winner === 'player' 
                  ? 'from-yellow-400 to-orange-500 border-4 border-yellow-300' 
                  : winner === 'computer'
                  ? 'from-gray-400 to-gray-600 border-4 border-gray-500'
                  : 'from-blue-400 to-purple-500'
              }`}
            >
              {winner === 'player' && (
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 0.8,
                    repeat: Infinity,
                    repeatDelay: 0.5
                  }}
                  className="text-8xl mb-6"
                >
                  🏆
                </motion.div>
              )}
              {winner === 'computer' && (
                <motion.div
                  animate={{ 
                    scale: [1, 0.9, 1],
                    rotate: [0, -5, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 1,
                    repeat: Infinity
                  }}
                  className="text-8xl mb-6"
                >
                  😔
                </motion.div>
              )}
              {winner === 'tie' && (
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
                    scale: { duration: 1, repeat: Infinity }
                  }}
                  className="text-8xl mb-6"
                >
                  🤝
                </motion.div>
              )}
              <motion.h2
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={`text-5xl font-bold mb-4 ${
                  winner === 'player' ? 'text-yellow-100' : winner === 'computer' ? 'text-gray-100' : 'text-white'
                }`}
              >
                {winner === 'player' ? '🎉 YOU WIN! 🎉' : winner === 'computer' ? 'Computer Wins!' : "It's a Tie!"}
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl text-white/90 mb-8"
              >
                Final Score: You {playerScore} - {computerScore} Computer
              </motion.p>
              {winner === 'player' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                  className="text-4xl mb-4"
                >
                  🎊🎉🎊
                </motion.div>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetGame}
                className="bg-white text-green-600 px-8 py-4 rounded-full font-bold text-xl shadow-lg flex items-center gap-2 mx-auto"
              >
                <RotateCcw className="w-6 h-6" />
                Play Again
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset Button */}
      {gameState !== 'setup' && gameState !== 'toss' && gameState !== 'game-over' && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetGame}
          className="bg-gradient-to-r from-white/30 to-white/20 backdrop-blur-lg text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-white/40 transition-all shadow-xl border border-white/30 hover:scale-105"
        >
          <RotateCcw className="w-5 h-5" />
          Reset Game
        </motion.button>
      )}
    </div>
  )
}
