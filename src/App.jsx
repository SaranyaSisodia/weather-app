import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import DayPage from './pages/DayPage'
import RangePage from './pages/RangePage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#080c14] text-white">
        <Navbar />
        <main>
          <Routes>
            <Route path="/"      element={<DayPage />} />
            <Route path="/range" element={<RangePage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
