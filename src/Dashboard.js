import React, { useState, useEffect } from 'react';


const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [inputTask, setInputTask] = useState('');
  const [editIndex, setEditIndex] = useState(null);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('tasks');
    if (stored) {
      setTasks(JSON.parse(stored));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddOrUpdate = () => {
    if (inputTask.trim() === '') return;

    if (editIndex !== null) {
      const updated = [...tasks];
      updated[editIndex].name = inputTask;
      setTasks(updated);
      setEditIndex(null);
    } else {
      setTasks([...tasks, { name: inputTask, completed: false }]);
    }

    setInputTask('');
  };

  const handleEdit = (index) => {
    setInputTask(tasks[index].name);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updated = tasks.filter((_, i) => i !== index);
    setTasks(updated);
  };

  const handleToggleStatus = (index) => {
    const updated = [...tasks];
    updated[index].completed = !updated[index].completed;
    setTasks(updated);
  };

  return (
    <div className="dashboard">
      <h2>Dashboard - To-Do List</h2>
      <div className="input-section">
        <input
          type="text"
          value={inputTask}
          onChange={(e) => setInputTask(e.target.value)}
          placeholder="Enter a task"
        />
        <button onClick={handleAddOrUpdate}>
          {editIndex !== null ? 'Update' : 'Add'}
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Task</th>
            <th>Status</th>
            <th>Edit</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan="5">No tasks available</td>
            </tr>
          ) : (
            tasks.map((task, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td className={task.completed ? 'completed' : ''}>{task.name}</td>
                <td>
                  <button onClick={() => handleToggleStatus(index)}>
                    {task.completed ? 'Done' : 'Pending'}
                  </button>
                </td>
                <td>
                  <button onClick={() => handleEdit(index)}>Edit</button>
                </td>
                <td>
                  <button onClick={() => handleDelete(index)}>Remove</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
