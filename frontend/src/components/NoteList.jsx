import { useState } from 'react'
import api from '../api'

export default function NoteList({ notes, refresh }) {
  const [editingId, setEditingId] = useState(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [shareLink, setShareLink] = useState("")

  // -------------------
  // Delete a note
  // -------------------
  const handleDelete = async (id) => {
    await api.delete(`/notes/${id}`)
    refresh()
  }

  // -------------------
  // Start editing a note
  // -------------------
  const startEdit = (note) => {
    setEditingId(note.id)
    setTitle(note.title)
    setContent(note.content)
  }

  // -------------------
  // Save (Update) a note
  // -------------------
  const handleUpdate = async (id) => {
    await api.put(`/notes/${id}`, { title, content })
    setEditingId(null)
    refresh()
  }

  // -------------------
  // Share a note
  // -------------------
  const handleShare = async (id) => {
    const response = await api.post(`/notes/${id}/share`)
    setShareLink(response.data.url)
  }

  return (
    <div className="space-y-4">
      {notes.map(note => (
        <div key={note.id} className="border p-4 rounded shadow-sm">
          {editingId === note.id ? (
            <div className="space-y-2">
              <input
                className="border w-full p-2"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
              <textarea
                className="border w-full p-2"
                value={content}
                onChange={e => setContent(e.target.value)}
              />
              <button
                onClick={() => handleUpdate(note.id)}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                Save
              </button>
              <button
                onClick={() => setEditingId(null)}
                className="px-3 py-1 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div>
              <h2 className="font-bold">{note.title}</h2>
              <p>{note.content}</p>
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => startEdit(note)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleShare(note.id)}
                  className="px-3 py-1 bg-green-500 text-white rounded"
                >
                  Share
                </button>
              </div>
              {shareLink && (
                <p className="mt-2 text-sm text-blue-600">
                  Share link: <a href={shareLink}>{shareLink}</a>
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
