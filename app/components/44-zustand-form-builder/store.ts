import { create } from 'zustand'

export interface FormField {
    label: string;
    type: "string" | "number" | "password" | "date" | "file" | "textarea"
    value: string
}

interface FormFieldState {
    formFields: FormField[],
    addField: (field: FormField) => void,
    updateField: (index: number, field: FormField) => void,
    removeField: (index: number) => void,
    resetForm: () => void
}

export const useFormStore = create<FormFieldState>((set, get) => ({
    formFields: [],
    addField: (field: FormField) => {
        set((state) => ({
            formFields: [...state.formFields, field]
        }))
    },
    updateField: (index: number, field: FormField) => {
        set((state) => ({
            formFields: state.formFields.map((f, i) => (
                index === i ? field : f
            ))
        }))
    },
    removeField: (index: number) => {
        set((state) => ({
            formFields: state.formFields.filter((_, i) => i !== index)
        }))
    },
    resetForm: () => {
        set((state) => ({
            formFields: []
        }))
    }
}))
