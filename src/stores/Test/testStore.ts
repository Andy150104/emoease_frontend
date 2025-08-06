// src/stores/usePaymentStore.ts
import { create } from "zustand";

const initialFileList = [
  { url: "https://example.com/image.jpg" },
]
const initialValues = {
    firstName: "a",
    email: "a",
    phone: "a",
    Image: initialFileList.map((f) => ({ baseUrl: f.url! })),
}

export interface TestFormValues {
  firstName: string;
  email: string;
  phone: string;
  Image: {
    baseUrl: string;
  }[];
}

interface TestState {
  testFunction: () => Promise<TestFormValues>;
}

export const useTestStore = create<TestState>(() => ({
  testFunction: async () => {
    console.log("Test function called");
    return initialValues;
  },
}));
