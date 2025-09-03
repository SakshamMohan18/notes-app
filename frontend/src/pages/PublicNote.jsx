import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api'

export default function PublicNote() {
  const { slug } = useParams()
  const [note, setNote] = useState(null)
  const [err, setErr] = useState(null)

useEffect(() => {
  async function fetchData() {
    try {
      const response = await fetch("http://127.0.0.1:8000/notes")
      const data = await response.json()
      setNotes(data)
    } catch (error) {
      console.error("Error fetching notes:", error)
    }
  }

  fetchData()
}, [])


  if (err) return <div className="container card text-red-500">{err}</div>
  if (!note) return <div className="container card">Loading...</div>

  return (
    <div className="container card space-y-3">
      <h1 className="text-2xl font-bold">{note.title}</h1>
      <p className="whitespace-pre-wrap">{note.content}</p>
      <div className="text-xs text-gray-500">Shared note #{note.id}</div>
    </div>
  )
}
