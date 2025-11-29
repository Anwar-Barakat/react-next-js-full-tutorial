'use client';
import React, { useState } from "react";
import { FormField, useFormStore } from "./store";

const FormBuilder = () => {
  const { addField, formFields, removeField, resetForm, updateField } =
    useFormStore();

  const [newField, setNewField] = useState<FormField>({
    label: "",
    type: "string",
    value: "",
  });

  const handleAddField = () => {
    if (!newField.label.trim()) return;
    addField(newField);
    setNewField({ label: "", type: "string", value: "" });
  };

  return (
    <div className="glass flex flex-col items-center p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">Form Builder</h2>

      <div className="w-full max-w-md bg-card p-4 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-bold text-foreground mb-3">Add New Field</h3>
        <input
          type="text"
          placeholder="Field label"
          value={newField.label}
          onChange={(e) =>
            setNewField((prev) => ({ ...prev, label: e.target.value }))
          }
          className="input mb-2 w-full bg-card"
        />
        <select
          value={newField.type}
          onChange={(e) =>
            setNewField((prev) => ({
              ...prev,
              type: e.target.value as FormField["type"],
            }))
          }
          className="input mb-2 w-full bg-muted/50 text-foreground"
        >
          <option value="string">Text</option>
          <option value="password">Password</option>
          <option value="textarea">Textarea</option>
          <option value="number">Number</option>
          <option value="file">File</option>
          <option value="date">Date</option>
        </select>
        <input
          type="text"
          placeholder="Field value (optional)"
          value={newField.value}
          onChange={(e) =>
            setNewField((prev) => ({ ...prev, value: e.target.value }))
          }
          className="input mb-4 w-full bg-card"
        />
        <div className="flex gap-2">
          <button type="button" onClick={handleAddField} className="btn bg-primary/50 flex-1">
            Add Field
          </button>
          <button type="button" onClick={resetForm} className="btn btn-muted flex-1">
            Reset Form
          </button>
        </div>
      </div>

      <div className="w-full max-w-md bg-card p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-foreground mb-3">Generated Form</h3>
        {formFields.length === 0 ? (
          <p className="text-muted-foreground text-center">No fields added yet.</p>
        ) : (
          <form className="flex flex-col gap-4">
            {formFields.map((field, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2 p-2 bg-muted/50 rounded-md">
                <label className="text-foreground font-bold w-24 flex-shrink-0">{field.label}:</label>
                {field.type === "textarea" ? (
                  <textarea
                    value={field.value}
                    onChange={(e) =>
                      updateField(index, { ...field, value: e.target.value })
                    }
                    className="input flex-1 bg-card"
                  />
                ) : (
                  <input
                    type={field.type === "string" ? "text" : field.type}
                    value={field.value}
                    onChange={(e) =>
                      updateField(index, { ...field, value: e.target.value })
                    }
                    className="input flex-1 bg-card"
                  />
                )}
                <button type="button" onClick={() => removeField(index)} className="btn btn-sm bg-secondary/50 flex-shrink-0">
                  Remove
                </button>
              </div>
            ))}
          </form>
        )}
      </div>
    </div>
  );
};

export default FormBuilder;