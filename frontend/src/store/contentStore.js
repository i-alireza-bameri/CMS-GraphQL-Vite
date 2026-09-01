import { create } from 'zustand'

export const useContentStore = create((set) => ({
  contents: [],
  categories: [],
  loading: false,
  error: null,
  
  setContents: (contents) => set({ contents }),
  setCategories: (categories) => set({ categories }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  addContent: (content) => set((state) => ({
    contents: [...state.contents, content]
  })),
  
  updateContent: (id, updatedContent) => set((state) => ({
    contents: state.contents.map(c => c.id === id ? { ...c, ...updatedContent } : c)
  })),
  
  deleteContent: (id) => set((state) => ({
    contents: state.contents.filter(c => c.id !== id)
  })),
}))
