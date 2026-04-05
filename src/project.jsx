import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function Project({
  projects,
  addTask,
  deleteTask,
  toggleTask,
  getProjectStats,
  renameProject,
  updateTask,
  clearCompletedTasks,
}) {
  const { id } = useParams();
  const [input, setInput] = useState("");
  const [projectName, setProjectName] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskText, setEditingTaskText] = useState("");

  const project = projects.find((p) => p.id == id);

  useEffect(() => {
    if (project) {
      setProjectName(project.name);
    }
  }, [project]);

  if (!project) {
    return (
      <main className="app-shell project-shell">
        <div className="panel missing-panel">
          <p className="section-kicker">Missing project</p>
          <h1>Project not found</h1>
          <p className="supporting-text">
            This project may have been removed or the link is no
            longer valid.
          </p>
          <Link to="/" className="ghost-link">
            Return to workspace
          </Link>
        </div>
      </main>
    );
  }

  function handleAdd() {
    if (!input.trim()) return;
    addTask(project.id, input);
    setInput("");
  }

  function handleRename() {
    if (!projectName.trim()) {
      setProjectName(project.name);
      return;
    }

    renameProject(project.id, projectName.trim());
  }

  function startTaskEdit(task) {
    setEditingTaskId(task.id);
    setEditingTaskText(task.text);
  }

  function saveTaskEdit(taskId) {
    if (!editingTaskText.trim()) {
      setEditingTaskId(null);
      setEditingTaskText("");
      return;
    }

    updateTask(project.id, taskId, editingTaskText.trim());
    setEditingTaskId(null);
    setEditingTaskText("");
  }

  const { totalTasks, completedTasks } = getProjectStats(project);
  const remainingTasks = totalTasks - completedTasks;
  const progress =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);
  const visibleTasks = project.tasks.filter((task) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "open" && !task.completed) ||
      (filter === "done" && task.completed);
    const matchesSearch = task.text
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <main className="app-shell project-shell">
      <section className="panel project-hero">
        <div className="project-hero-top">
          <Link to="/" className="ghost-link">
            Back to workspace
          </Link>
          <span className="pill">{progress}% complete</span>
        </div>

        <div className="project-title-row">
          <div>
            <p className="section-kicker">Project Board</p>
            <input
              value={projectName || project.name}
              onChange={(e) => setProjectName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleRename();
                }

                if (e.key === "Escape") {
                  setProjectName(project.name);
                }
              }}
              className="project-title-input"
            />
            <p className="hero-text compact">
              Track the next steps, mark wins, and keep momentum
              visible in one calm place.
            </p>
          </div>
        </div>

        <div className="metric-strip">
          <article className="mini-metric">
            <span>Total tasks</span>
            <strong>{totalTasks}</strong>
          </article>
          <article className="mini-metric">
            <span>Completed</span>
            <strong>{completedTasks}</strong>
          </article>
          <article className="mini-metric">
            <span>Remaining</span>
            <strong>{remainingTasks}</strong>
          </article>
        </div>

        <div className="progress-block">
          <div className="progress-row">
            <p>Overall progress</p>
            <strong>{progress}%</strong>
          </div>
          <div className="progress-track large">
            <span
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </section>

      <section className="workspace-grid project-grid">
        <div className="panel composer-panel">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Task capture</p>
              <h2>Add a next action</h2>
            </div>
            <span className="pill">Fast input</span>
          </div>

          <div className="input-group">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAdd();
                }
              }}
              placeholder="Write the next concrete task..."
            />
            <button onClick={handleAdd}>Add Task</button>
          </div>
        </div>

        <div className="panel tasks-panel">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Execution</p>
              <h2>Task list</h2>
            </div>
            <div className="header-actions">
              {completedTasks > 0 ? (
                <button
                  className="chip-button"
                  onClick={() =>
                    clearCompletedTasks(project.id)
                  }
                >
                  Clear completed
                </button>
              ) : null}
              <span className="pill">
                {project.tasks.length} items
              </span>
            </div>
          </div>

          <div className="toolbar">
            <div className="filter-row">
              {["all", "open", "done"].map((option) => (
                <button
                  key={option}
                  className={`filter-pill ${
                    filter === option ? "filter-pill-active" : ""
                  }`}
                  onClick={() => setFilter(option)}
                >
                  {option}
                </button>
              ))}
            </div>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="search-input"
            />
          </div>

          {project.tasks.length === 0 ? (
            <div className="empty-state empty-state-tight">
              <div className="empty-orb" />
              <h3>No tasks yet</h3>
              <p>
                Add the first task to transform this board from an
                idea into an actionable plan.
              </p>
            </div>
          ) : visibleTasks.length === 0 ? (
            <div className="empty-state empty-state-tight">
              <div className="empty-orb" />
              <h3>No matching tasks</h3>
              <p>
                Try a different filter or search term to bring the
                right work back into view.
              </p>
            </div>
          ) : (
            <div className="task-list">
              {visibleTasks.map((task) => (
                <article
                  key={task.id}
                  className={`task-card ${
                    task.completed ? "task-card-done" : ""
                  }`}
                >
                  <button
                    className={`task-toggle ${
                      task.completed ? "task-toggle-done" : ""
                    }`}
                    onClick={() =>
                      toggleTask(project.id, task.id)
                    }
                    aria-label={
                      task.completed
                        ? "Mark task as incomplete"
                        : "Mark task as complete"
                    }
                  >
                    {task.completed ? "Done" : "Open"}
                  </button>

                  <div className="task-content">
                    {editingTaskId === task.id ? (
                      <input
                        value={editingTaskText}
                        onChange={(e) =>
                          setEditingTaskText(e.target.value)
                        }
                        onBlur={() => saveTaskEdit(task.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            saveTaskEdit(task.id);
                          }

                          if (e.key === "Escape") {
                            setEditingTaskId(null);
                            setEditingTaskText("");
                          }
                        }}
                        className="inline-input"
                        autoFocus
                      />
                    ) : (
                      <button
                        className={`task-title-button ${
                          task.completed ? "completed" : ""
                        }`}
                        onClick={() => startTaskEdit(task)}
                      >
                        {task.text}
                      </button>
                    )}
                    <span className="task-meta">
                      {task.completed
                        ? "Completed"
                        : "Use the status pill to mark complete or click the task to edit"}
                    </span>
                  </div>

                  <div className="task-actions">
                    <button
                      className="chip-button"
                      onClick={() => startTaskEdit(task)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteTask(project.id, task.id)
                      }
                      aria-label="Delete task"
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Project;
