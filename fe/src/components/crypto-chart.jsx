"use client"

import { useEffect, useRef } from "react"

export function CryptoChart({ data, color, height = 30 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !data || data.length === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set up dimensions
    const width = canvas.width
    const chartHeight = height

    // Find min and max values
    const minValue = Math.min(...data)
    const maxValue = Math.max(...data)
    const valueRange = maxValue - minValue

    // Draw the line
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = 1.5

    // Move to the first point
    const xStep = width / (data.length - 1)
    const firstY = chartHeight - ((data[0] - minValue) / valueRange) * chartHeight
    ctx.moveTo(0, firstY)

    // Draw lines to each data point
    for (let i = 1; i < data.length; i++) {
      const x = i * xStep
      const y = chartHeight - ((data[i] - minValue) / valueRange) * chartHeight
      ctx.lineTo(x, y)
    }

    ctx.stroke()

    // Add a subtle gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, chartHeight)
    gradient.addColorStop(0, `${color}33`) // 20% opacity
    gradient.addColorStop(1, `${color}00`) // 0% opacity

    ctx.lineTo(width, chartHeight)
    ctx.lineTo(0, chartHeight)
    ctx.fillStyle = gradient
    ctx.fill()
  }, [data, color, height])

  return <canvas ref={canvasRef} width="100" height={height} className="w-full h-full" />
}
