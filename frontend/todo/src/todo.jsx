import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Todo() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const API_URL = "http://127.0.0.1:8000/tasks/";

  // Fetch tasks from backend on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_URL);
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  // Add a new task
 const addTask = async () => {
  if (title.trim() && description.trim()) {
    try {
      await axios.post(API_URL, { title, description });
      fetchTasks(); // reload only first 5 tasks
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error("Error adding task:", err);
    }
  }
};


const completeTask = async (id) => {
  try {
    await axios.patch(`${API_URL}${id}/complete`);
    fetchTasks(); // reload tasks from backend (only incomplete tasks)
  } catch (err) {
    console.error("Error updating task:", err);
  }
};




  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">To-Do List</h1>

      <div className="flex flex-col gap-2 mb-4">
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={addTask}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      <ol className="space-y-3">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="border p-3 rounded flex justify-between items-start"
          >
            <div>
              <h2 className="font-semibold">{task.title}</h2>
              <p>{task.description}</p>
              <small className="text-gray-500">
                Created: {new Date(task.created_at).toLocaleString()}
              </small>
            </div>
            <button
              onClick={() => completeTask(task.id)}
              className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
            >
              Done
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
