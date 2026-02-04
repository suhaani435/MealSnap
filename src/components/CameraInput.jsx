import { useState, useRef, useEffect } from 'react'

export default function CameraInput({ onAnalyze }) {
  const [stream, setStream] = useState(null)
  const [preview, setPreview] = useState(null)
  const [showCamera, setShowCamera] = useState(false)
  
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [stream])

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      })
      
      setStream(mediaStream)
      setShowCamera(true)
      setPreview(null)
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      alert('Camera access denied or not available. Please use upload instead.' + err)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setShowCamera(false)
  }

  const capture = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    
    if (!video || !canvas) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    const context = canvas.getContext('2d')
    context.drawImage(video, 0, 0)
    
    const imageData = canvas.toDataURL('image/jpeg', 0.8)
    setPreview(imageData)
    stopCamera()
    
    onAnalyze(imageData)
  }

  const handleUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target.result)
      stopCamera()
      onAnalyze(e.target.result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Log Your Meal</h2>
      
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={`w-full rounded-lg mb-4 ${showCamera ? '' : 'hidden'}`}
      />
      
      <canvas ref={canvasRef} className="hidden" />
      
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="w-full rounded-lg mb-4"
        />
      )}
      
      <div className="flex gap-3">
        {!showCamera && (
          <button
            onClick={startCamera}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition active:scale-95"
          >
            📸 Open Camera
          </button>
        )}
        
        {showCamera && (
          <button
            onClick={capture}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition active:scale-95"
          >
            ✓ Capture
          </button>
        )}
        
        <label className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition text-center cursor-pointer flex items-center justify-center active:scale-95">
          📁 Upload Photo
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
        </label>
      </div>
    </div>
  )
}