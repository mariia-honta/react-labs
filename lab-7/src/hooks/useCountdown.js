/**
 * Зворотний відлік від `totalSeconds` до нуля, по секунді.
 *
 * Використання:
 *   const { secondsLeft, isRunning, start, pause, reset } = useCountdown(180)
 *
 * Вимоги — у тестах tests/useCountdown.test.jsx.
 */
import { useEffect, useState } from 'react'

export function useCountdown(totalSeconds) {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds)
  const [isStarted, setIsStarted] = useState(false)
  const isRunning = isStarted && secondsLeft > 0

  useEffect(() => {
    if (!isRunning) return
    const id = setInterval(() => {
      setSecondsLeft((s) => Math.max(s - 1, 0))
    }, 1000)
    return () => clearInterval(id)
  }, [isRunning])

  const start = () => setIsStarted(true)
  const pause = () => setIsStarted(false)
  const reset = () => {
    setIsStarted(false)
    setSecondsLeft(totalSeconds)
  }

  return { secondsLeft, isRunning, start, pause, reset }
}
