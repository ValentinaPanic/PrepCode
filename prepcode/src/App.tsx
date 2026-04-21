import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomeScreen } from './screens/HomeScreen'
import { SystemDesign } from './modes/SystemDesign'
import { Quiz } from './modes/Quiz'
import { ComponentPractice } from './modes/ComponentPractice'
import { ApiKeyProvider } from './contexts/ApiKeyContext'
import { ApiKeyGate } from './components/ApiKeyGate'

function App() {
  return (
    <div className="bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 h-screen flex flex-col">
      <ApiKeyProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/system-design" element={<SystemDesign />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/components" element={<ComponentPractice />} />
          </Routes>
        </BrowserRouter>
        <ApiKeyGate />
      </ApiKeyProvider>
    </div>
  )
}

export default App
