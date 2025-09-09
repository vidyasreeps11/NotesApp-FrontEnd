import React, { useState, useEffect } from "react";

const API_URL = "http://notesapp-backend.railway.internal";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);

  // Fetch all notes on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch(`${API_URL}/notes`);
      const data = await res.json();
      console.log(data[0]);
      setNotes(data);
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // Update existing note
        await fetch(`${API_URL}/notes/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content }),
        });
        setEditId(null);
      } else {
        // Create new note
        await fetch(`${API_URL}/notes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content }),
        });
      }
      setTitle("");
      setContent("");
      fetchNotes(); // Refresh notes list
    } catch (err) {
      console.error("Error submitting note:", err);
    }
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    console.log(note.id);
    setEditId(note.id);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/notes/${id}`, { method: "DELETE" });
      setNotes(notes.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  const handleShare = (note) => {
    const shareUrl = `${API_URL}/notes/share/${note.id}`;
    navigator.clipboard.writeText(shareUrl);
    alert(`Shareable link copied to clipboard:\n${shareUrl}`);
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "20px auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ display: "inline" }}>
        <h1>Notes App</h1>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
          style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          required
          style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
        />
        <button type="submit" style={{ padding: "8px 16px" }}>
          {editId ? "Update Note" : "Add Note"}
        </button>
      </form>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {notes.map((note) => (
          <li
            key={note.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <button
              onClick={() => handleEdit(note)}
              style={{ marginRight: "8px" }}
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(note.id)}
              style={{ marginRight: "8px" }}
            >
              Delete
            </button>
            <button onClick={() => handleShare(note)}>Share</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
