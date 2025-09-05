import { useState } from 'react'
import Card from './Card'
import './App.css'

function App() {
  const [darkMode, setDarkMode] = useState(true)

  const toggleMode = () => {
    setDarkMode(prev => !prev)
  }

  return (
    <main className="main">
      {/* Remove the mode-toggle div completely */}
      <Card darkMode={darkMode} onThemeToggle={toggleMode} />
    </main>
  )
}

export default App

