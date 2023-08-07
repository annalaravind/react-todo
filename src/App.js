import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
    const [todos, setTodos] = useState([]);
    const [editedTask, setEditedTask] = useState({});
    const [showCompleted, setShowCompleted] = useState(false);

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await axios.get("https://jsonplaceholder.typicode.com/users/1/todos");
            setTodos(response.data);
        } catch (error) {
            console.error(error.code);
        }
    };

    const toggleCompletion = (id) => {
        const updatedTodos = todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        setTodos(updatedTodos);
    };

    const handleTaskChange = (value) => {
        setEditedTask({ ...editedTask, title: value });
    };

    const handleTaskKeyDown = (event) => {
        if (event.key === "Enter") {
            addTask();
        }
    };

    const editTask = (id) => {
        const taskToEdit = todos.find((todo) => todo.id === id);
        if (!taskToEdit.completed) {
            setEditedTask(taskToEdit);
            const updatedTodos = todos.map((todo) =>
                todo.id === id ? { ...todo, editing: true } : todo
            );
            setTodos(updatedTodos);
        }
    };

    const addTask = () => {
        if (!editedTask.title) {
            alert("Please Enter the Task...");
        } else if (!editedTask.id) {
            const newTask = {
                id: todos.length + 1,
                title: editedTask.title,
                completed: false,
                editing: false,
            };
            setTodos([...todos, newTask]);
            setEditedTask({});
        } else {
            const updatedTodos = todos.map((todo) =>
                todo.id === editedTask.id ? { ...todo, title: editedTask.title, editing: false } : todo
            );
            setTodos(updatedTodos);
            setEditedTask({});
        }
    };

    const deleteTask = (id) => {
        const updatedTodos = todos.filter((todo) => todo.id !== id);
        setTodos(updatedTodos);
    };

    const filteredTodos = showCompleted
        ? todos.filter((todo) => todo.completed)
        : todos;

    return (
        <div className="app">
            <h1>Todo App</h1>
            <div className="input-container">
                <input
                    type="text"
                    value={editedTask.title || ""}
                    onChange={(e) => handleTaskChange(e.target.value)}
                    onKeyDown={(e) => handleTaskKeyDown(e)}
                    placeholder="Enter task... OR... Edit task..."
                />
                <button onClick={addTask}>Add</button>
            </div>
            <div className="filter-container">
                <button
                    onClick={() => setShowCompleted(!showCompleted)}
                    className={showCompleted ? "active" : ""}
                >
                    Show {showCompleted ? "All" : "Completed"} Tasks
                </button>
            </div>
            <ul className="todo-list">
                {filteredTodos.map((todo) => (
                    <li key={todo.id}>
                        <span
                            className={todo.completed ? "completed" : ""}
                            onClick={() => toggleCompletion(todo.id)}
                        >
                            {todo.title}
                        </span>
                        <div className="actions">
                            <button className="actions1" onClick={() => editTask(todo.id)}>Edit</button>
                            <button className="actions2" onClick={() => deleteTask(todo.id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;