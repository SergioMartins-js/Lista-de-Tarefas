import React, { useState, useEffect } from 'react';

function TodoList() {
    const [todos, setTodos] = useState([]);
    const [newTodoTitle, setNewTodoTitle] = useState('');

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await fetch('/api/Todo');
            if (response.ok) {
                const data = await response.json();
                setTodos(data);
            } else {
                console.error('Failed to fetch todos');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleNewTodoTitleChange = (event) => {
        setNewTodoTitle(event.target.value);
    };

    const handleNewTodoSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('/api/Todo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: newTodoTitle, completed: false }),
            });

            if (response.ok) {
                const data = await response.json();
                setTodos([...todos, data]);
                setNewTodoTitle('');
            } else {
                console.error('Failed to create new todo');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleTodoComplete = async (todo) => {
        try {
            const response = await fetch(`/api/Todo/${todo.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...todo, completed: !todo.completed }),
            });

            if (response.ok) {
                const data = await response.json();
                const updatedTodos = todos.map((t) =>
                    t.id === todo.id ? data : t
                );
                setTodos(updatedTodos);
            } else {
                console.error('Failed to update todo');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleTodoDelete = async (todo) => {
        try {
            const response = await fetch(`/api/Todo/${todo.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                const updatedTodos = todos.filter((t) => t.id !== todo.id);
                setTodos(updatedTodos);
            } else {
                console.error('Failed to delete todo');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <form onSubmit={handleNewTodoSubmit}>
                <input
                    type="text"
                    value={newTodoTitle}
                    onChange={handleNewTodoTitleChange}
                />
                <button type="submit">Add</button>
            </form>
            <ul>
                {todos.map((todo) => (
                    <li key={todo.id}>
                        <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => handleTodoComplete(todo)}
                        />
                        <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                            {todo.title}
                        </span>
                        <button onClick={() => handleTodoDelete(todo)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TodoList;
