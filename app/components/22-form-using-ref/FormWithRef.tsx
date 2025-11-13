'use client';
import React, { FormEvent, useRef, useState } from "react";

type FormData = {
  name: string;
  email: string;
  password: string;
};

export const FormWithRef = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newName = nameRef.current?.value || "";
    const newEmail = emailRef.current?.value || "";
    const newPassword = passwordRef.current?.value || "";

    setFormData({
      name: newName,
      email: newEmail,
      password: newPassword,
    });

    // Optionally clear the inputs after submission
    if (nameRef.current) nameRef.current.value = "";
    if (emailRef.current) emailRef.current.value = "";
    if (passwordRef.current) passwordRef.current.value = "";
  };

  return (
    <div className="center-content py-12 px-4">
      <div className="bg-[var(--card)] p-8 rounded-[var(--radius)] shadow-[var(--shadow-lg)] max-w-md w-full border border-[var(--border)]">
        <h2 className="text-3xl md:text-4xl font-bold center-text mb-6 heading-gradient">
          Form with useRef
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            ref={nameRef}
            className="input w-full"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            ref={emailRef}
            className="input w-full"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            ref={passwordRef}
            className="input w-full"
          />
          <button
            type="submit"
            className="btn btn-primary w-full"
          >
            Submit
          </button>
        </form>

        {formData.name && (
          <div className="mt-6 p-4 border border-[var(--border)] rounded-[var(--radius)] bg-[var(--muted)]">
            <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">Submitted Data:</h3>
            <p className="text-[var(--muted-foreground)]">Name: {formData.name}</p>
            <p className="text-[var(--muted-foreground)]">Email: {formData.email}</p>
            <p className="text-[var(--muted-foreground)]">Password: {formData.password}</p>
          </div>
        )}
      </div>
    </div>
  );
};
