import { create } from "zustand";

interface Book {
  bookId?: string;
  bookTitle: string;
  authorName: string;
  bookCategoryId: string;
  bookQuantity?: string;
  bookRentPrice?: string;
  bookCoverImageUrl?: string;
}

interface StoreState {
  book: Book | null;
  refreshKey: number;
  addBook: (book: Book) => void;
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  toggleRefresh: () => void;
}

export const useStore = create<StoreState>((set) => ({
  book: null,
  addBook: (book) => set({ book }),
  openDialog: false,
  setOpenDialog: (open) => set({ openDialog: open }),
  refreshKey: 0,
  toggleRefresh: () => set(state => ({ refreshKey: state.refreshKey + 1 })),
}));