// Dashboard.js
import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const handleLogout = async () => {
    await signOut(auth);
    alert('Logged out successfully!');
    navigate('/login');
  };

  const addTodo = () => {
    if (input.trim() === '') return;
    setTodos([...todos, { text: input, completed: false }]);
    setInput('');
  };

  const toggleTodo = (index) => {
    const updated = [...todos];
    updated[index].completed = !updated[index].completed;
    setTodos(updated);
  };

  const deleteTodo = (index) => {
    const updated = todos.filter((_, i) => i !== index);
    setTodos(updated);
  };

  return (
    <div className="dashboard-container">
      <h2>🎉 Welcome to the Dashboard!</h2>
      <p>This is your protected area after login.</p>
      <button className="logout-button" onClick={handleLogout}>Logout</button>

      <hr />

      <h3>📝 Todo List</h3>

      <div className="todo-input-section">
        <input
          type="text"
          value={input}
          placeholder="Enter a task"
          onChange={(e) => setInput(e.target.value)}
          className="todo-input"
        />
        <button onClick={addTodo} className="add-button">Add</button>
      </div>

      <ul className="todo-list">
        {todos.map((todo, index) => (
          <li key={index} className="todo-item">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(index)}
            />
            <span className={todo.completed ? "todo-text completed" : "todo-text"}>
              {todo.text}
            </span>
            <button className="delete-button" onClick={() => deleteTodo(index)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
