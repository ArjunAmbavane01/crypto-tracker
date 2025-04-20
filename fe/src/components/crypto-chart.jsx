"use client"

import { useEffect, useRef, useState } from "react"

export function CryptoChart({ data, color, height = 30 }) {
  const canvasRef = useRef(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const canvas = canvasRef.current
    
    // Input validation
    if (!canvas) return
    if (!data || !Array.isArray(data) || data.length === 0) {
      setError("No chart data available")
      return
    }

    // Handle invalid data
    const validData = data.filter(point => typeof point === 'number' && !isNaN(point))
    if (validData.length === 0) {
      setError("Invalid chart data")
      return
    }

    setError(null)

    try {
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        setError("Canvas context not supported")
        return
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Set up dimensions
      const width = canvas.width
      const chartHeight = height

      // Find min and max values
      const minValue = Math.min(...validData)
      const maxValue = Math.max(...validData)
      const valueRange = maxValue - minValue || 1 // Prevent division by zero

      // Draw the line
      ctx.beginPath()
      ctx.strokeStyle = color || "#10b981" // Default to green if no color provided
      ctx.lineWidth = 1.5

      // Move to the first point
      const xStep = width / (validData.length - 1 || 1) // Prevent division by zero
      const firstY = chartHeight - ((validData[0] - minValue) / valueRange) * chartHeight
      ctx.moveTo(0, firstY)

      // Draw lines to each data point
      for (let i = 1; i < validData.length; i++) {
        const x = i * xStep
        const y = chartHeight - ((validData[i] - minValue) / valueRange) * chartHeight
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
    } catch (err) {
      console.error("Error rendering chart:", err)
      setError("Failed to render chart")
    }
  }, [data, color, height])

  // Show fallback UI if there's an error or no data
  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded">
        <span className="text-xs text-gray-400">{error}</span>
      </div>
    )
  }

  return <canvas ref={canvasRef} width="100" height={height} className="w-full h-full" />
}