import { useState, useEffect } from 'react'
import api from '../api'

export default function NoteForm({ onSuccess, initial }) {
  const [title, setTitle] = useState(initial?.title || '')
  const [content, setContent] = useState(initial?.content || '')

  useEffect(() => {
    setTitle(initial?.title || '')
    setContent(initial?.content || '')
  }, [initial])

  const submit = async (e) => {
    e.preventDefault()
    const payload = { title, content, is_public: initial?.is_public || false }
    if (initial?.id) {
      await api.put(`/notes/${initial.id}`, payload)
    } else {
      await api.post('/notes', payload)
    }
    setTitle(''); setContent('')
    onSuccess?.()
  }

  return (
    <form onSubmit={submit} className="card space-y-3">
      <h2 className="text-lg font-semibold">{initial ? 'Edit note' : 'New note'}</h2>
      <input className="input" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" required/>
      <textarea className="textarea h-28" value={content} onChange={e=>setContent(e.target.value)} placeholder="Content" />
      <div className="flex gap-2">
        <button className="btn btn-primary" type="submit">{initial ? 'Update' : 'Add'}</button>
      </div>
    </form>
  )
}
