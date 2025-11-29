'use client';
import React from "react";
import { useNoteStore } from "./store";

const Sidebar = () => {
  const { notes, search, selectNote, setSearch, deleteNote, setCurrentIndex, setEditorContent, setNoteColor } = useNoteStore();

  const filteredNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-1/3 p-4 border-r border-[var(--border)] bg-card/50 flex flex-col">
      <input
        type="text"
        placeholder="Search notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input mb-4 bg-card/50"
      />

      <button
        onClick={() => {
          setCurrentIndex(null);
          setSearch("");
          setEditorContent("");
          setNoteColor("#ffffff");
        }}
        className="btn bg-primary/50 mb-4"
      >
        + New Note
      </button>

      <ul className="flex-1 overflow-y-auto">
        {filteredNotes.map((note, index) => (
          <li
            key={note.id}
            className="flex items-center justify-between mb-2 p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors duration-200"
            style={{ backgroundColor: note.color + '30' }}
          >
            <div
              className="flex items-center gap-2 flex-1"
              onClick={() => selectNote(index)}
            >
              <span
                className="w-5 h-5 rounded-full border border-[var(--border)]"
                style={{ backgroundColor: note.color }}
              />
              <span className="text-foreground truncate">{note.text.substring(0, 30)}...</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteNote(index);
              }}
              className="btn btn-sm bg-secondary/50"
            >
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
