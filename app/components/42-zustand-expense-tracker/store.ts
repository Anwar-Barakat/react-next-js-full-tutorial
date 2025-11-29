import { create } from "zustand";

export type Expense = {
    id: number;
    title: string;
    amount: number;
};

type ExpenseState = {
    expenses: Expense[];
};

type ExpenseAction = {
    addExpense: (expense: Expense) => void;
    updateExpense: (expense: Expense) => void;
    deleteExpense: (id: number) => void;
};

const useExpense = create<ExpenseState & ExpenseAction>((set) => ({
    expenses: [],
    addExpense: (expense) =>
        set((state) => ({
            expenses: [...state.expenses, expense],
        })),
    updateExpense: (expense: Expense) => (
        set((state) => ({
            expenses: state.expenses.map(ex => (
                ex.id === expense.id ? expense : ex
            ))
        }))
    ),
    deleteExpense: (id) =>
        set((state) => ({
            expenses: state.expenses.filter((ex) => ex.id !== id),
        })),
}));

export default useExpense;