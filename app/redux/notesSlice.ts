import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// One note object
export type Note = {     // <-- add `export` here
  id: string;
  note: string;
};

// Slice state contains array of Note objects
type NotesState = {
  notes: any[];
};

// Initial state
const initialState: NotesState = {
  notes: [],
};

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    // Replace all notes
    setUserNotes: (state, action: PayloadAction<Note[]>) => {
      state.notes = action.payload;
    },
    // Add one note
    addNote: (state, action: PayloadAction<Note>) => {
      state.notes.push(action.payload);
    },
  },
});

export const { setUserNotes, addNote } = notesSlice.actions;
export default notesSlice.reducer;
