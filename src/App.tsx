import { useEffect, useState } from "react";
import "./App.css";

function App() {

  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [selectedProject, setSelectedProject] = useState<string>("");

  useEffect(() => {

    fetch("http://localhost:4000/projects")
      .then(res => res.json())
      .then(data => setProjects(data));

    fetch("http://localhost:4000/tasks")
      .then(res => res.json())
      .then(data => setTasks(data));

  }, []);

  const addProject = async () => {

    if (!name) return;

    const res = await fetch("http://localhost:4000/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name })
    });

    const data = await res.json();

    setProjects([...projects, data]);
    setName("");
  };

  const deleteProject = async (id:string) => {

    await fetch(`http://localhost:4000/projects/${id}`, {
      method: "DELETE"
    });

    setProjects(projects.filter(p => p.id !== id));
  };

  const addTask = async () => {

    if (!taskTitle || !selectedProject) {
      alert("Select project and enter task");
      return;
    }

    const res = await fetch("http://localhost:4000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: taskTitle,
        projectId: selectedProject
      })
    });

    const data = await res.json();

    setTasks([...tasks, data]);
    setTaskTitle("");
  };

  const deleteTask = async (id:string) => {

    await fetch(`http://localhost:4000/tasks/${id}`, {
      method: "DELETE"
    });

    setTasks(tasks.filter(t => t.id !== id));
  };

  return (

    <div className="container">

      <h1 className="title">TaskFlow Manager</h1>

      {/* ADD PROJECT */}

      <div className="card">

        <h2>Add Project</h2>

        <div className="form-row">

          <input
            type="text"
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <button onClick={addProject}>
            Add
          </button>

        </div>

      </div>

      {/* PROJECT LIST */}

      <div className="card">

        <h2>Projects</h2>

        {projects.map(project => (

          <div key={project.id} className="project">

            <div className="project-header">

              <h3>{project.name}</h3>

              <button
                className="delete-btn"
                onClick={() => deleteProject(project.id)}
              >
                Delete
              </button>

            </div>

            <ul className="task-list">

              {tasks
                .filter(task => task.projectId === project.id)
                .map(task => (

                  <li key={task.id} className="task">

                    {task.title}

                    <button
                      className="delete-btn"
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </button>

                  </li>

                ))}

            </ul>

          </div>

        ))}

      </div>

      {/* ADD TASK */}

      <div className="card">

        <h2>Add Task</h2>

        <div className="form-row">

          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            <option value="">Select project</option>

            {projects.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}

          </select>

          <input
            type="text"
            placeholder="Task title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />

          <button onClick={addTask}>
            Add Task
          </button>

        </div>

      </div>

    </div>

  );
}

export default App;