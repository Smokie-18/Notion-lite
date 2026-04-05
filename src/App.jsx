import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./home";
import Project from "./project";

const STORAGE_KEY = "notion-lite-projects";

function normalizeProjects(rawProjects) {
  if (!Array.isArray(rawProjects)) {
    return [];
  }

  return rawProjects.map((project) => ({
    id: project.id ?? Date.now(),
    name: project.name ?? "Untitled Project",
    createdAt: project.createdAt ?? new Date().toISOString(),
    tasks: Array.isArray(project.tasks)
      ? project.tasks.map((task) => ({
          id: task.id ?? Date.now(),
          text: task.text ?? "",
          completed: Boolean(task.completed),
          createdAt:
            task.createdAt ?? new Date().toISOString(),
        }))
      : [],
  }));
}

function App() {
  const [projects, setProjects] = useState(() => {
    const savedProjects = window.localStorage.getItem(STORAGE_KEY);

    if (!savedProjects) {
      return [];
    }

    try {
      return normalizeProjects(JSON.parse(savedProjects));
    } catch {
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  function addProject(name) {
    const newProject = {
      id: Date.now(),
      name,
      createdAt: new Date().toISOString(),
      tasks: [],
    };
    setProjects([...projects, newProject]);
  }

  function addTask(projectId, text) {
    setProjects(
      projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: [
              ...project.tasks,
                {
                  id: Date.now(),
                  text,
                  completed: false,
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : project
      )
    );
  }

  function deleteTask(projectId, taskId) {
    setProjects(
      projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: project.tasks.filter((t) => t.id !== taskId),
            }
          : project
      )
    );
  }

  function toggleTask(projectId, taskId) {
    setProjects(
      projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: project.tasks.map((t) =>
                t.id === taskId
                  ? { ...t, completed: !t.completed }
                  : t
              ),
            }
          : project
      )
    );
  }

  function renameProject(projectId, name) {
    setProjects(
      projects.map((project) =>
        project.id === projectId
          ? { ...project, name }
          : project
      )
    );
  }

  function updateTask(projectId, taskId, text) {
    setProjects(
      projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: project.tasks.map((task) =>
                task.id === taskId ? { ...task, text } : task
              ),
            }
          : project
      )
    );
  }

  function clearCompletedTasks(projectId) {
    setProjects(
      projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: project.tasks.filter(
                (task) => !task.completed
              ),
            }
          : project
      )
    );
  }

  function getProjectStats(project) {
    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter(
      (task) => task.completed
    ).length;

    return { totalTasks, completedTasks };
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              projects={projects}
              addProject={addProject}
              getProjectStats={getProjectStats}
              renameProject={renameProject}
            />
          }
        />
        <Route
          path="/project/:id"
          element={
            <Project
              projects={projects}
              addTask={addTask}
              deleteTask={deleteTask}
              toggleTask={toggleTask}
              getProjectStats={getProjectStats}
              renameProject={renameProject}
              updateTask={updateTask}
              clearCompletedTasks={clearCompletedTasks}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
