import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase'; // adjust path if needed
import { signOut } from 'firebase/auth';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [inputTask, setInputTask] = useState('');
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  const user = auth.currentUser;

  // Fetch tasks on mount (real-time sync)
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'users', user.uid, 'tasks'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedTasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(fetchedTasks);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAddOrUpdate = async () => {
    if (inputTask.trim() === '') return;

    if (editId) {
      const taskRef = doc(db, 'users', user.uid, 'tasks', editId);
      await updateDoc(taskRef, { name: inputTask });
      setEditId(null);
    } else {
      await addDoc(collection(db, 'users', user.uid, 'tasks'), {
        name: inputTask,
        completed: false,
      });
    }

    setInputTask('');
  };

  const handleEdit = (task) => {
    setInputTask(task.name);
    setEditId(task.id);
  };

  const handleDelete = async (taskId) => {
    await deleteDoc(doc(db, 'users', user.uid, 'tasks', taskId));
  };

  const handleToggleStatus = async (task) => {
    const taskRef = doc(db, 'users', user.uid, 'tasks', task.id);
    await updateDoc(taskRef, { completed: !task.completed });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out successfully");
      navigate('/login');
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="dashboard">
      <button className="logout-button" onClick={handleLogout}>Logout</button>
      <h2>Dashboard - To-Do List</h2>
      <div className="input-section">
        <input
          type="text"
          value={inputTask}
          onChange={(e) => setInputTask(e.target.value)}
          placeholder="Enter a task"
        />
        <button onClick={handleAddOrUpdate}>
          {editId ? 'Update' : 'Add'}
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
              <tr key={task.id}>
                <td>{index + 1}</td>
                <td className={task.completed ? 'completed' : ''}>
                  {task.name}
                </td>
                <td>
                  <button onClick={() => handleToggleStatus(task)}>
                    {task.completed ? 'Done' : 'Pending'}
                  </button>
                </td>
                <td>
                  <button onClick={() => handleEdit(task)}>Edit</button>
                </td>
                <td>
                  <button onClick={() => handleDelete(task.id)}>Remove</button>
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
