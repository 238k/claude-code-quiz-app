"use client";

import { createContext, useCallback, useEffect, useReducer } from "react";
import { Quiz, QuizSet } from "@/types";
import { localStore } from "@/lib/storage";
import { STORAGE_KEYS } from "@/lib/storageKeys";
import { generateId } from "@/lib/id";
import { seedQuizzes, seedSet } from "@/data/seed";

interface StoreState {
  isLoaded: boolean;
  quizzes: Quiz[];
  sets: QuizSet[];
}

type StoreAction =
  | { type: "INIT"; payload: Omit<StoreState, "isLoaded"> }
  | { type: "ADD_SET"; payload: QuizSet }
  | { type: "UPDATE_SET"; payload: { id: string; updates: Partial<QuizSet> } }
  | { type: "DELETE_SET"; payload: string }
  | { type: "ADD_QUIZ"; payload: Quiz }
  | { type: "UPDATE_QUIZ"; payload: { id: string; updates: Partial<Quiz> } }
  | { type: "DELETE_QUIZ"; payload: string };

function storeReducer(state: StoreState, action: StoreAction): StoreState {
  switch (action.type) {
    case "INIT":
      return { ...action.payload, isLoaded: true };
    case "ADD_SET":
      return { ...state, sets: [...state.sets, action.payload] };
    case "UPDATE_SET":
      return {
        ...state,
        sets: state.sets.map((s) =>
          s.id === action.payload.id ? { ...s, ...action.payload.updates } : s,
        ),
      };
    case "DELETE_SET":
      return {
        ...state,
        sets: state.sets.filter((s) => s.id !== action.payload),
        quizzes: state.quizzes.filter((q) => q.setId !== action.payload),
      };
    case "ADD_QUIZ":
      return { ...state, quizzes: [...state.quizzes, action.payload] };
    case "UPDATE_QUIZ":
      return {
        ...state,
        quizzes: state.quizzes.map((q) =>
          q.id === action.payload.id ? { ...q, ...action.payload.updates } : q,
        ),
      };
    case "DELETE_QUIZ":
      return {
        ...state,
        quizzes: state.quizzes.filter((q) => q.id !== action.payload),
      };
  }
}

function loadFromStorage(): Omit<StoreState, "isLoaded"> {
  const storedSets = localStore.get<QuizSet[]>(STORAGE_KEYS.SETS);
  if (!storedSets || storedSets.length === 0) {
    const initialSets = [seedSet];
    const initialQuizzes = seedQuizzes;
    localStore.set(STORAGE_KEYS.SETS, initialSets);
    localStore.set(STORAGE_KEYS.QUIZZES, initialQuizzes);
    return { sets: initialSets, quizzes: initialQuizzes };
  }
  return {
    sets: storedSets,
    quizzes: localStore.get<Quiz[]>(STORAGE_KEYS.QUIZZES) ?? [],
  };
}

interface QuizStoreContextValue {
  isLoaded: boolean;
  quizzes: Quiz[];
  sets: QuizSet[];
  addSet: (data: Omit<QuizSet, "id" | "createdAt" | "updatedAt">) => QuizSet;
  updateSet: (
    id: string,
    updates: Partial<Omit<QuizSet, "id" | "createdAt">>,
  ) => void;
  deleteSet: (id: string) => void;
  addQuiz: (data: Omit<Quiz, "id" | "createdAt" | "updatedAt">) => Quiz;
  updateQuiz: (
    id: string,
    updates: Partial<Omit<Quiz, "id" | "createdAt">>,
  ) => void;
  deleteQuiz: (id: string) => void;
  getQuizzesBySetId: (setId: string) => Quiz[];
}

export const QuizStoreContext = createContext<QuizStoreContextValue | null>(
  null,
);

export function QuizStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(storeReducer, { isLoaded: false, sets: [], quizzes: [] });

  useEffect(() => {
    dispatch({ type: "INIT", payload: loadFromStorage() });
  }, []);

  const addSet = useCallback(
    (data: Omit<QuizSet, "id" | "createdAt" | "updatedAt">): QuizSet => {
      const now = new Date().toISOString();
      const newSet: QuizSet = {
        ...data,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };
      dispatch({ type: "ADD_SET", payload: newSet });
      const current = localStore.get<QuizSet[]>(STORAGE_KEYS.SETS) ?? [];
      localStore.set(STORAGE_KEYS.SETS, [...current, newSet]);
      return newSet;
    },
    [],
  );

  const updateSet = useCallback(
    (id: string, updates: Partial<Omit<QuizSet, "id" | "createdAt">>) => {
      const withTimestamp = { ...updates, updatedAt: new Date().toISOString() };
      dispatch({ type: "UPDATE_SET", payload: { id, updates: withTimestamp } });
      const current = localStore.get<QuizSet[]>(STORAGE_KEYS.SETS) ?? [];
      localStore.set(
        STORAGE_KEYS.SETS,
        current.map((s) => (s.id === id ? { ...s, ...withTimestamp } : s)),
      );
    },
    [],
  );

  const deleteSet = useCallback((id: string) => {
    dispatch({ type: "DELETE_SET", payload: id });
    const currentSets = localStore.get<QuizSet[]>(STORAGE_KEYS.SETS) ?? [];
    const currentQuizzes = localStore.get<Quiz[]>(STORAGE_KEYS.QUIZZES) ?? [];
    localStore.set(
      STORAGE_KEYS.SETS,
      currentSets.filter((s) => s.id !== id),
    );
    localStore.set(
      STORAGE_KEYS.QUIZZES,
      currentQuizzes.filter((q) => q.setId !== id),
    );
  }, []);

  const addQuiz = useCallback(
    (data: Omit<Quiz, "id" | "createdAt" | "updatedAt">): Quiz => {
      const now = new Date().toISOString();
      const newQuiz: Quiz = {
        ...data,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };
      dispatch({ type: "ADD_QUIZ", payload: newQuiz });
      const current = localStore.get<Quiz[]>(STORAGE_KEYS.QUIZZES) ?? [];
      localStore.set(STORAGE_KEYS.QUIZZES, [...current, newQuiz]);
      return newQuiz;
    },
    [],
  );

  const updateQuiz = useCallback(
    (id: string, updates: Partial<Omit<Quiz, "id" | "createdAt">>) => {
      const withTimestamp = { ...updates, updatedAt: new Date().toISOString() };
      dispatch({
        type: "UPDATE_QUIZ",
        payload: { id, updates: withTimestamp },
      });
      const current = localStore.get<Quiz[]>(STORAGE_KEYS.QUIZZES) ?? [];
      localStore.set(
        STORAGE_KEYS.QUIZZES,
        current.map((q) => (q.id === id ? { ...q, ...withTimestamp } : q)),
      );
    },
    [],
  );

  const deleteQuiz = useCallback((id: string) => {
    dispatch({ type: "DELETE_QUIZ", payload: id });
    const current = localStore.get<Quiz[]>(STORAGE_KEYS.QUIZZES) ?? [];
    localStore.set(
      STORAGE_KEYS.QUIZZES,
      current.filter((q) => q.id !== id),
    );
  }, []);

  const getQuizzesBySetId = useCallback(
    (setId: string) => state.quizzes.filter((q) => q.setId === setId),
    [state.quizzes],
  );

  return (
    <QuizStoreContext.Provider
      value={{
        isLoaded: state.isLoaded,
        quizzes: state.quizzes,
        sets: state.sets,
        addSet,
        updateSet,
        deleteSet,
        addQuiz,
        updateQuiz,
        deleteQuiz,
        getQuizzesBySetId,
      }}
    >
      {children}
    </QuizStoreContext.Provider>
  );
}
