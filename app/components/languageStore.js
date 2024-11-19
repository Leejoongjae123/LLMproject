import { create } from 'zustand'

export const useLanguageStore = create((set) => ({
  language: 'korean',
  setLanguage: (newLanguage) => set({ language: newLanguage }),
}))