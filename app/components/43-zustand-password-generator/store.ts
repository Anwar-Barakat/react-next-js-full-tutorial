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

export const usePasswordStore = create<PasswordState>((set) => ({
    length: 12,
    includeNumbers: true,
    includeSymbols: false,
    includeUppercase: true,
    includeLowercase: true,
    generatedPassword: '',

    setLength: (length: number) => (
        set((_state) => ({
            length: length
        }))
    ),
    toggleNumbers: () => (
        set((_state) => ({
            includeNumbers: !_state.includeNumbers
        }))
    ),
    toggleSymbols: () => {
        set((_state) => ({
            includeSymbols: !_state.includeSymbols
        }))
    },
    toggleLowercase: () => (
        set((_state) => ({
            includeLowercase: !_state.includeLowercase
        }))
    ),
    toggleUppercase: () => (
        set((_state) => ({
            includeUppercase: !_state.includeUppercase
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