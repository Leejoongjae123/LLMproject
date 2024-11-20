import { create } from 'zustand'

export const useLanguageStore = create((set) => ({
  language: localStorage.getItem('selectedLanguage') || 'korean',
  setLanguage: (newLanguage) => set({ language: newLanguage }),
}))