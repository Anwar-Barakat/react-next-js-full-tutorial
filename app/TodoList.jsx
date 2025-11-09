import React from 'react'
import { useState } from 'react'
import { CgClose } from 'react-icons/cg';

const TodoList = () => {
    const [todo, setTodo] = useState(null)
    const [name, setName] = useState('');

    const handleSubmit = () => {
        setTodo([...todo, {
            id: Math.round(Math.random() * 1000),
            name
        }])
    }

    const handleRemove = (id) => {
        setTodo(todo.filter(item => item.id !== id))
    }

    return (
        <div>
            <ul>
                {todo && todo.map((item, index) => {
                    return (
                        <>
                            <li key={index}>{item.name}</li>
                            <button onClick={() => handleRemove(item.id)}>x</button>
                        </>

                    )
                })}
            </ul>
            <input name='name' value={name} onChange={e => setName(e.target.value)} />
            <button onClick={handleSubmit}>Add</button>
        </div>
    )
}

export default TodoList
