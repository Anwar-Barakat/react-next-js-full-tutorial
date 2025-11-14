import { create } from "zustand";

export type Note = {
    id: string;
    text: string;
    color: string;
};

interface NoteState {
    notes: Note[];
    search: string;
    editorContent: string;
    noteColor: string;
    currentNoteIndex: number | null;
}

interface NoteAction {
    setNote: (updatedNotes: Note[]) => void;
    setSearch: (query: string) => void;
    setEditorContent: (content: string) => void;
    setNoteColor: (color: string) => void;
    setCurrentIndex: (index: number | null) => void;
    addOrUpdateNote: () => void;
    selectNote: (index: number) => void;
    deleteNote: (index: number) => void;
}

export const useNoteStore = create<NoteState & NoteAction>((set, get) => ({
    notes: [],
    search: "",
    editorContent: "",
    noteColor: "#ffffff",
    currentNoteIndex: null,

    setNote: (updatedNotes: Note[]) => set({ notes: updatedNotes }),
    setSearch: (query: string) => set({ search: query }),
    setEditorContent: (content: string) => set({ editorContent: content }),
    setNoteColor: (color: string) => set({ noteColor: color }),
    setCurrentIndex: (index: number | null) => set({ currentNoteIndex: index }),

    addOrUpdateNote: () => {
        set((state) => {
            const { editorContent, currentNoteIndex, noteColor, notes } = state;

            if (!editorContent.trim()) return state; // prevent empty notes

            if (currentNoteIndex !== null) {
                return {
                    notes: notes.map((note, index) =>
                        index === currentNoteIndex
                            ? { ...note, text: editorContent, color: noteColor }
                            : note
                    ),
                    currentNoteIndex: null,
                    editorContent: "",
                    noteColor: "#ffffff",
                };
            }

            return {
                notes: [
                    ...notes,
                    { id: crypto.randomUUID(), text: editorContent, color: noteColor },
                ],
                currentNoteIndex: null,
                editorContent: "",
                noteColor: "#ffffff",
            };
        });
    },

    selectNote: (index: number) => {
        const notes = get().notes;
        const note = notes[index];
        if (note) {
            set({
                currentNoteIndex: index,
                editorContent: note.text,
                noteColor: note.color,
            });
        }
    },

    deleteNote: (index: number) => {
        set((state) => ({
            notes: state.notes.filter((_, i) => i !== index),
            currentNoteIndex:
                state.currentNoteIndex === index ? null : state.currentNoteIndex,
            editorContent:
                state.currentNoteIndex === index ? "" : state.editorContent,
        }));
    },
}));
