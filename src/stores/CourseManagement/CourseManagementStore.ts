import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Course, mockCourses } from 'EmoEase/types/course';

export interface CourseManagementState {
  courses: Course[];
  isLoading: boolean;
  error: string | null;
}

export interface CourseManagementActions {
  fetchCourses: () => Promise<void>;
  addCourse: (course: Course) => Promise<void>;
  updateCourse: (courseId: string, updates: Partial<Course>) => Promise<void>;
  deleteCourse: (courseId: string) => Promise<void>;
  reset: () => void;
}

export type CourseManagementStore = CourseManagementState & CourseManagementActions;

const initialState: CourseManagementState = {
  courses: [],
  isLoading: false,
  error: null,
};

export const useCourseManagementStore = create<CourseManagementStore>()(
  devtools(
    (set) => ({
      ...initialState,
      fetchCourses: async () => {
        set({ isLoading: true, error: null }, false, 'fetchCourses/start');
        try {
          await new Promise((resolve) => setTimeout(resolve, 500));
          set({ courses: mockCourses, isLoading: false }, false, 'fetchCourses/success');
        } catch (e) {
          const error = e instanceof Error ? e.message : 'An unknown error occurred';
          set({ isLoading: false, error }, false, 'fetchCourses/error');
        }
      },
      addCourse: async (course) => {
        set((state) => ({ courses: [...state.courses, course] }), false, 'addCourse');
      },
      updateCourse: async (courseId, updates) => {
        set((state) => ({
          courses: state.courses.map((c) => (c.id === courseId ? { ...c, ...updates, updatedAt: new Date() } : c)),
        }), false, 'updateCourse');
      },
      deleteCourse: async (courseId) => {
        set((state) => ({ courses: state.courses.filter((c) => c.id !== courseId) }), false, 'deleteCourse');
      },
      reset: () => {
        set(initialState, false, 'reset');
      },
    }),
    { name: 'CourseManagementStore' }
  )
);

