import { create } from 'zustand';

type FormResult = {
  name: string;
  age: number;
  email: string;
  privacy: Boolean;
};

type FormResultsStore = {
  formsResults: FormResult[];
  addResult: (item: FormResult) => void;
};

export const useFormResults = create<FormResultsStore>((set) => ({
  formsResults: [],

  addResult: (item) =>
    set((state) => ({
      formsResults: [...state.formsResults, item],
    })),
}));
