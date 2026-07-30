export function createSmoothProgress(
  onProgress: (p: number) => void,
  onComplete: (url: string, resultName?: string) => void
) {
  let current = 0
  let target = 90
  let isFinishing = false
  let finalUrl = ''
  let finalName: string | undefined = undefined

  const timer = setInterval(() => {
    if (current < target) {
      // Semakin dekat ke target, semakin lambat bergeraknya (tapi minimal 1%)
      // Jika sedang finishing, bergerak sangat cepat (20% per tick)
      const step = isFinishing ? 15 : Math.max(0.5, (target - current) * 0.05)
      current += step

      if (current >= target) {
        current = target
      }
      onProgress(Math.round(current))
    }

    if (isFinishing && current >= 100) {
      clearInterval(timer)
      onComplete(finalUrl, finalName)
    }
  }, 50) // Update setiap 50ms (20fps) untuk animasi angka yang mulus

  return {
    finish: (url: string, resultName?: string) => {
      isFinishing = true
      target = 100
      finalUrl = url
      finalName = resultName
    },
    error: () => {
      clearInterval(timer)
    }
  }
}
