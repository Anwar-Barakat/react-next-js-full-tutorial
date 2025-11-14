import { create } from 'zustand'

type PasswordState = {
    length: number;
    includeNumbers: boolean;
    includeSymbols: boolean;
    includeUppercase: boolean;
    includeLowercase: boolean;
    generatedPassword: string;
    setLength: (length: number) => void;
    toggleNumbers: () => void;
    toggleSymbols: () => void;
    toggleUppercase: () => void;
    toggleLowercase: () => void;
    generatePassword: () => void;
}

export const usePasswordStore = create<PasswordState>((set, get) => ({
    length: 12,
    includeNumbers: true,
    includeSymbols: false,
    includeUppercase: true,
    includeLowercase: true,
    generatedPassword: '',

    setLength: (length: number) => (
        set((state) => ({
            length: length
        }))
    ),
    toggleNumbers: () => (
        set((state) => ({
            includeNumbers: !state.includeNumbers // Fixed bug here
        }))
    ),
    toggleSymbols: () => {
        set((state) => ({
            includeSymbols: !state.includeSymbols
        }))
    },
    toggleLowercase: () => (
        set((state) => ({
            includeLowercase: !state.includeLowercase
        }))
    ),
    toggleUppercase: () => (
        set((state) => ({
            includeUppercase: !state.includeUppercase
        }))
    ),
    generatePassword: () => (
        set((state) => {
            const numbers = "0123456789";
            const symbols = "!@#$%^&*()_-+=/[]";
            const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const lowercase = "abcdefghijklmnopqrstuvwxyz";

            let characters = '';
            if (state.includeNumbers) characters += numbers
            if (state.includeLowercase) characters += lowercase
            if (state.includeUppercase) characters += uppercase
            if (state.includeSymbols) characters += symbols

            let password = '';
            // Ensure at least one character type is selected
            if (characters.length === 0) {
                return { generatedPassword: "Select at least one character type." };
            }

            for (let i = 0; i < state.length; i++) {
                password += characters[Math.floor(Math.random() * characters.length)]
            }

            return { generatedPassword: password }
        })
    )
}))
