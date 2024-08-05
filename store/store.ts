import { create } from "zustand";

interface StoreState {
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
}

interface Book {
  bookName: string;
  authorName: string;
  category: string;
}

interface StoreState {
  books: Book[];
  addBook: (book: Book) => void;
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
}

export const useStore = create<StoreState>((set) => ({
  books: [],
  addBook: (book) => set((state) => ({ books: [...state.books, book] })),
  openDialog: false,
  setOpenDialog: (open) => set({ openDialog: open }),
}));
