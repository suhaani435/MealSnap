import { useState, useEffect } from 'react'
import Header from './components/Header'
import DailyProgress from './components/DailyProgress'
import AISuggestion from './components/AISuggestion'
import CameraInput from './components/CameraInput'
import Results from './components/Results'
import Loading from './components/Loading'
import FoodLog from './components/FoodLog'

function App() {
  const [stats, setStats] = useState({
    totals: { protein: 0, carbs: 0, fats: 0, calories: 0 },
    targets: { protein: 180, carbs: 200, fats: 60 },
    logs: []
  })

  const [suggestion, setSuggestion] = useState({
    suggestion: '200g Greek yogurt + 1 banana',
    reason: 'This will give you 40g protein and help you hit your remaining macro targets'
  })

  const [analysisResult, setAnalysisResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const analyzeImage = async (imageData) => {
    setLoading(true)
    setAnalysisResult(null)

    try {
      const formData = new FormData()
      // Convert base64/blob to file if needed or send as is depending on backend expectation
      // Assuming imageData is a base64 string or similar from camera
      // We need to convert it to a blob or file for multer
      const response = await fetch(imageData)
      const blob = await response.blob()

      formData.append('image', blob, 'capture.jpg')

      const res = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        body: formData
      })

      if (!res.ok) throw new Error('Failed to analyze image')

      const result = await res.json()

      setAnalysisResult(result)

      setStats(prev => ({
        ...prev,
        totals: {
          protein: prev.totals.protein + (result.total?.protein || 0),
          carbs: prev.totals.carbs + (result.total?.carbs || 0),
          fats: prev.totals.fats + (result.total?.fats || 0),
          calories: prev.totals.calories + (result.total?.calories || 0)
        },
        logs: [
          ...prev.logs,
          {
            timestamp: new Date().getTime(),
            foods: result.foods || [],
            total: result.total || {}
          }
        ]
      }))

      // Update suggestion based on new totals
      const currentProtein = stats.totals.protein + (result.total?.protein || 0)
      const proteinLeft = stats.targets.protein - currentProtein

      if (proteinLeft > 30) {
        setSuggestion({
          suggestion: 'High protein meal needed',
          reason: `You still need ${Math.round(proteinLeft)}g protein today`
        })
      } else if (proteinLeft > 0) {
        setSuggestion({
          suggestion: 'Small protein snack',
          reason: `Almost there! Just ${Math.round(proteinLeft)}g protein remaining`
        })
      } else {
        setSuggestion({
          suggestion: 'Great job! Target hit 🎉',
          reason: 'Focus on recovery and hydration now'
        })
      }

    } catch (error) {
      console.error('Analysis failed:', error)
      alert(`Failed to analyze image: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <div className="max-w-2xl mx-auto p-6">
        <Header />

        <DailyProgress
          totals={stats.totals}
          targets={stats.targets}
        />

        <AISuggestion
          suggestion={suggestion.suggestion}
          reason={suggestion.reason}
        />

        <CameraInput onAnalyze={analyzeImage} />

        {loading && <Loading />}

        {analysisResult && !loading && (
          <Results
            data={analysisResult}
            onClose={() => setAnalysisResult(null)}
          />
        )}

        <FoodLog logs={stats.logs} />
      </div>
    </div>
  )
}

export default App