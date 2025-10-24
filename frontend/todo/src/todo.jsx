import React, { useState } from "react";

export default function Todo() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function addTask() {
    if (title.trim() !== "" && description.trim() !== "") {
      const newTask = { title, description };
      setTasks((prevTasks) => [...prevTasks, newTask]);
      setTitle("");
      setDescription("");
    }
  }

  function doneTask(index) {
    setTasks(tasks.filter((_, i) => i !== index));
  }

  return (
    <div className="to-do-list">
      <h1>To-Do List</h1>

      <div>
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button className="add-button" onClick={addTask}>
          Add
        </button>
      </div>

      <ol>
        {tasks.map((task, index) => (
          <li key={index}>
            <h2>{task.title}</h2>
            <strong>{task.description}</strong>
            <button
              className="delete-button"
              onClick={() => doneTask(index)}
            >
              Done
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
