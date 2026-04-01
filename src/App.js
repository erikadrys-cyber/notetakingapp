import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from "firebase/firestore";
import "./App.css";

const notesCollection = collection(db, "notes");

function App() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch notes from Firebase
  const fetchNotes = async () => {
    try {
      const q = query(notesCollection, orderBy("createdAt", "desc"));
      const data = await getDocs(q);
      setNotes(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Error loading notes. Make sure Firebase is configured correctly.");
    }
  };

  // Add a new note
  const addNote = async () => {
    if (note.trim() === "") {
      alert("Please enter a note!");
      return;
    }
    
    setLoading(true);
    try {
      await addDoc(notesCollection, {
        text: note,
        createdAt: new Date(),
        completed: false
      });
      setNote(""); // Clear input
      await fetchNotes(); // Refresh notes
    } catch (error) {
      console.error("Error adding note:", error);
      alert("Error adding note: Check your Firebase Rules!");
    }
    setLoading(false);
  };

  // Delete a note
  const deleteNote = async (id) => {
    try {
      await deleteDoc(doc(db, "notes", id));
      await fetchNotes(); // Refresh notes
    } catch (error) {
      console.error("Error deleting note:", error);
      alert("Error deleting note!");
    }
  };

  // Toggle note completion status
  const toggleComplete = async (id, status) => {
    try {
      await updateDoc(doc(db, "notes", id), { completed: !status });
      await fetchNotes(); // Refresh notes
    } catch (error) {
      console.error("Error updating note:", error);
      alert("Error updating note!");
    }
  };

  // Load notes on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  // Count incomplete notes
  const incompleteCount = notes.filter(n => !n.completed).length;

  return (
    <div className="web-wrapper">
      {/* Top Navigation / Header */}
      <header className="navbar">
        <div className="nav-brand">NotesCloud</div>
        <div className="user-profile-lite"></div>
      </header>

      <main className="central-content">
        {/* Hero Section */}
        <section className="hero-section">
          <h1 className="hero-title">Welcome back!</h1>
          <p className="hero-subtitle">
            You have {incompleteCount} {incompleteCount === 1 ? "item" : "items"} on your list.
          </p>

          <div className="input-hero-container">
            <div className="web-input-pill">
              <input
                type="text"
                placeholder="What are we doing today?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addNote()}
                disabled={loading}
              />
              <button onClick={addNote} disabled={loading} className="web-save-btn">
                {loading ? "Saving..." : "Create Note"}
              </button>
            </div>
          </div>
        </section>

        {/* Notes Grid Area */}
        <section className="notes-display-area">
          <div className="filter-bar">
            <h3>Recent Notes</h3>
          </div>

          {notes.length === 0 ? (
            <div className="empty-state">
              <p>No notes yet. Create one to get started!</p>
            </div>
          ) : (
            <div className="web-masonry-grid">
              {notes.map((n) => (
                <div key={n.id} className={`web-note-tile ${n.completed ? "is-complete" : ""}`}>
                  <div className="tile-top">
                    <span className="category-dot"></span>
                    <button className="tile-del" onClick={() => deleteNote(n.id)}>
                      Remove
                    </button>
                  </div>
                  <p className="tile-body">{n.text}</p>
                  <div className="tile-bottom">
                    <div
                      className={`tile-check ${n.completed ? "checked" : ""}`}
                      onClick={() => toggleComplete(n.id, n.completed)}
                    >
                      {n.completed ? "✓ Completed" : "Mark as Done"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;