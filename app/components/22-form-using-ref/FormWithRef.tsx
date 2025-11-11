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
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md mx-auto my-8">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">Form with useRef</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          ref={nameRef}
          className="p-2 text-base rounded-md border-2 w-full bg-gray-50 dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          ref={emailRef}
          className="p-2 text-base rounded-md border-2 w-full bg-gray-50 dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          ref={passwordRef}
          className="p-2 text-base rounded-md border-2 w-full bg-gray-50 dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="py-2 px-4 text-base rounded-md border-none bg-blue-600 text-white cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Submit
        </button>
      </form>

      {formData.name && (
        <div className="mt-6 p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Submitted Data:</h3>
          <p className="text-gray-700 dark:text-gray-300">Name: {formData.name}</p>
          <p className="text-gray-700 dark:text-gray-300">Email: {formData.email}</p>
          <p className="text-gray-700 dark:text-gray-300">Password: {formData.password}</p>
        </div>
      )}
    </div>
  );
};
