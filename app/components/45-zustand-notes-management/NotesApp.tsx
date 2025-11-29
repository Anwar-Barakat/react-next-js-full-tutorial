'use client';
import React from "react";
import { useNoteStore } from "./store";
import Sidebar from "./Sidebar";

const NotesApp = () => {
  const {
    addOrUpdateNote,
    currentNoteIndex,
    editorContent,
    noteColor,
    setEditorContent,
    setNoteColor,
  } = useNoteStore();

  return (
    <div className="glass flex h-screen p-0">
      <Sidebar />

      <div className="w-2/3 p-8 flex flex-col bg-background/50 rounded-r-[var(--radius)]">
        <textarea
          className="flex-1 p-4 border border-[var(--border)] rounded-lg mb-4 input bg-card"
          placeholder="Write your note..."
          value={editorContent}
          onChange={(e) => setEditorContent(e.target.value)}
          style={{ backgroundColor: noteColor + '20' }}
        />

        <div className="flex items-center mb-4 gap-4">
          <input
            type="color"
            value={noteColor}
            onChange={(e) => setNoteColor(e.target.value)}
            className="w-10 h-10 rounded-full border-none cursor-pointer"
          />
          <button
            className="btn bg-primary/50"
            onClick={addOrUpdateNote}
          >
            {currentNoteIndex !== null ? "Update Note" : "Save Note"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotesApp;