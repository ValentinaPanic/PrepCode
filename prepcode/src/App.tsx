import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomeScreen } from './screens/HomeScreen'
import { SystemDesign } from './modes/SystemDesign'

function App() {
  return (
    <div className="bg-zinc-900 text-zinc-100 h-screen flex flex-col">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/system-design" element={<SystemDesign />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
