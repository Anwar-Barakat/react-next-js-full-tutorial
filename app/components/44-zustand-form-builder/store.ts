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

export const useFormStore = create<FormFieldState>((set) => ({
    formFields: [],
    addField: (field: FormField) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        set((_state) => ({
            formFields: [..._state.formFields, field]
        }))
    },
    updateField: (index: number, field: FormField) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        set((_state) => ({
            formFields: _state.formFields.map((f, i) => (
                index === i ? field : f
            ))
        }))
    },
    removeField: (index: number) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        set((_state) => ({
            formFields: _state.formFields.filter((_, i) => i !== index)
        }))
    },
    resetForm: () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        set((_state) => ({
            formFields: []
        }))
    }
}))
