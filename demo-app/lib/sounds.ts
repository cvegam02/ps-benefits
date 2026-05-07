"use client"

export const playSound = (type: 'success' | 'delivery') => {
  try {
    const audio = new Audio(`/sounds/${type}.mp3`)
    audio.play().catch(err => {
      console.warn(`Could not play sound ${type}:`, err)
    })
  } catch (err) {
    console.error("Audio playback error:", err)
  }
}
