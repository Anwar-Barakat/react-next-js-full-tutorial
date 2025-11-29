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

    if (nameRef.current) nameRef.current.value = "";
    if (emailRef.current) emailRef.current.value = "";
    if (passwordRef.current) passwordRef.current.value = "";
  };

  return (
    <div className="glass glass-xl w-full max-w-md">
      <h2 className="text-3xl font-bold text-primary text-center mb-6">
        Form with useRef
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          ref={nameRef}
          className="input w-full bg-white/10 border-white/20 focus:border-primary focus:bg-white/20"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          ref={emailRef}
          className="input w-full bg-white/10 border-white/20 focus:border-primary focus:bg-white/20"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          ref={passwordRef}
          className="input w-full bg-white/10 border-white/20 focus:border-primary focus:bg-white/20"
        />
        <button
          type="submit"
          className="btn bg-primary/50 w-full"
        >
          Submit
        </button>
      </form>

      {formData.name && (
        <div className="glass mt-6 text-left">
          <h3 className="text-xl font-semibold text-primary mb-2">Submitted Data:</h3>
          <p className="text-foreground">Name: {formData.name}</p>
          <p className="text-foreground">Email: {formData.email}</p>
          <p className="text-foreground">Password: {formData.password}</p>
        </div>
      )}
    </div>
  );
};