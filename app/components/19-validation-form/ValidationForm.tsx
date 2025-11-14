'use client';
import React, { useState } from "react";

export const ValidationForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorUsername, setErrorUsername] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorConfirmPassword, setErrorConfirmPassword] = useState("");

  const [isUsernameValid, setIsUsernameValid] = useState<boolean | null>(null);
  const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);
  const [isPasswordValid, setIsPasswordValid] = useState<boolean | null>(null);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState<boolean | null>(null);

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    let formValid = true;

    if (username.length >= 8) {
      setErrorUsername("");
      setIsUsernameValid(true);
    } else {
      setErrorUsername("Username must be at least 8 characters");
      setIsUsernameValid(false);
      formValid = false;
    }

    if (email.includes("@") && email.includes(".")) {
      setErrorEmail("");
      setIsEmailValid(true);
    } else {
      setErrorEmail("Email must be a valid address");
      setIsEmailValid(false);
      formValid = false;
    }

    if (password.length >= 8) {
      setErrorPassword("");
      setIsPasswordValid(true);
    } else {
      setErrorPassword("Password should be at least 8 characters");
      setIsPasswordValid(false);
      formValid = false;
    }

    if (password === confirmPassword && password !== "") {
      setErrorConfirmPassword("");
      setIsConfirmPasswordValid(true);
    } else {
      setErrorConfirmPassword("Passwords do not match");
      setIsConfirmPasswordValid(false);
      formValid = false;
    }

    if (formValid) {
      alert("Form submitted successfully!");
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setErrorUsername("");
      setErrorEmail("");
      setErrorPassword("");
      setErrorConfirmPassword("");
      setIsUsernameValid(null);
      setIsEmailValid(null);
      setIsPasswordValid(null);
      setIsConfirmPasswordValid(null);
    }
  };

  const getInputClasses = (isValid: boolean | null) => {
    let classes = "input";
    if (isValid === true) {
      classes += " input-success";
    } else if (isValid === false) {
      classes += " input-error";
    }
    return classes;
  };

  return (
    <div className="center-content py-12 px-4 bg-gradient-to-br from-[var(--background)] via-[var(--muted)]/20 to-[var(--background)]">
      <div className="bg-gradient-to-br from-[var(--card)] to-[var(--muted)]/30 p-8 md:p-10 rounded-2xl shadow-[var(--shadow-lg)] max-w-md w-full border border-[var(--border)] backdrop-blur-sm">
        <h2 className="text-4xl md:text-5xl font-extrabold center-text mb-8 heading-gradient">Sign Up</h2>
      <form onSubmit={submitHandler} className="flex flex-col gap-4">
        <div>
          <input
            type="text"
            placeholder="Username"
            className={getInputClasses(isUsernameValid)}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {errorUsername && <p className="text-[var(--secondary)] text-sm mt-1">{errorUsername}</p>}
        </div>

        <div>
          <input
            type="email"
            placeholder="Email"
            className={getInputClasses(isEmailValid)}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errorEmail && <p className="text-[var(--secondary)] text-sm mt-1">{errorEmail}</p>}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            className={getInputClasses(isPasswordValid)}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errorPassword && <p className="text-[var(--secondary)] text-sm mt-1">{errorPassword}</p>}
        </div>

        <div>
          <input
            type="password"
            placeholder="Confirm Password"
            className={getInputClasses(isConfirmPasswordValid)}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errorConfirmPassword && <p className="text-[var(--secondary)] text-sm mt-1">{errorConfirmPassword}</p>}
        </div>

        <button type="submit" className="btn btn-primary btn-lg w-full">Submit</button>
      </form>
    </div>
    </div>
  );
};