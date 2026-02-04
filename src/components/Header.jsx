export default function Header() {
  return (
    <header className="mb-8 flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          MealSnap 📸
        </h1>
        <p className="text-gray-600">Track macros with AI</p>
      </div>
      <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center text-xl">
        👤
      </div>
    </header>
  )
}
