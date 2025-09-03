import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import api from './api'
import NoteForm from './components/NoteForm'
import NoteList from './components/NoteList'
import PublicNote from './pages/PublicNote'

export default function App() {
  const [notes, setNotes] = useState([])

  // ✅ make this a plain function that does async inside useEffect
  const fetchNotes = async () => {
    try {
      const r = await api.get('/notes')
      setNotes(r.data)
    } catch {
      setNotes([])
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="p-6 max-w-3xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold">📝 Simple Notes</h1>
            <NoteForm onSuccess={fetchNotes} />
            <NoteList notes={notes} refresh={fetchNotes} />
          </div>
        }
      />
      <Route path="/s/:slug" element={<PublicNote />} />
    </Routes>
  )
}
