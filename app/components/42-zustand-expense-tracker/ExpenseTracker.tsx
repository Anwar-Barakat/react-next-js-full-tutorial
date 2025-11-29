'use client';
import React, { useState } from "react";
import useExpense, { Expense } from "./store";

const ExpenseTracker = () => {
  const { expenses, addExpense, deleteExpense, updateExpense } = useExpense();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [error, setError] = useState("");

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);



  const handleSubmit = () => {
    setError("");
    if (!title.trim()) {
      setError("Title cannot be empty.");
      return;
    }
    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError("Amount must be a positive number.");
      return;
    }

    const newExpense: Expense = {
      id: editingExpense ? editingExpense.id : Math.round(Math.random() * 100000),
      title: title.trim(),
      amount: parseFloat(amount),
    };

    if (editingExpense) {
      updateExpense(newExpense);
    } else {
      addExpense(newExpense);
    }

    setEditingExpense(null);
    setTitle("");
    setAmount("");
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setTitle(expense.title);
    setAmount(expense.amount.toString());
  };

  return (
    <div className="glass flex flex-col items-center p-6">
      <h2 className="text-2xl font-bold text-foreground mb-4">Expense Tracker</h2>

      <div className="w-full max-w-md mb-6">
        <input
          type="text"
          name="title"
          placeholder="Expense Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input mb-2 w-full bg-card/50"
        />

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input mb-4 w-full bg-card/50"
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button onClick={handleSubmit} className="btn bg-primary/50 w-full">
          {editingExpense ? "Update Expense" : "Add Expense"}
        </button>
      </div>

      <h3 className="text-xl font-bold text-foreground mb-3">Expenses</h3>
      <ul className="w-full max-w-md bg-muted/50 rounded-lg p-4">
        {expenses.length === 0 ? (
          <p className="text-muted-foreground text-center">No expenses added yet.</p>
        ) : (
          expenses.map((expense) => (
            <li key={expense.id} className="bg-card/50 p-3 mb-2 rounded-md text-foreground flex justify-between items-center">
              <div>
                <strong>{expense.title}</strong> - ${expense.amount.toFixed(2)}
              </div>
              <div className="flex space-x-2">
                <button onClick={() => handleEdit(expense)} className="btn btn-sm bg-accent/50">Edit</button>
                <button onClick={() => deleteExpense(expense.id)} className="btn btn-sm bg-secondary/50">Delete</button>
              </div>
            </li>
          ))
        )}
      </ul>

      <div className="w-full max-w-md mt-4 p-3 bg-muted/50 rounded-lg text-foreground text-lg font-bold flex justify-between">
        <span>Total:</span>
        <span>${totalExpenses.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default ExpenseTracker;
