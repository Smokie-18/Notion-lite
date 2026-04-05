import { useState } from "react";
import { Link } from "react-router-dom";

function Home({
  projects,
  addProject,
  getProjectStats,
  renameProject,
}) {
  const [input, setInput] = useState("");
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [draftName, setDraftName] = useState("");

  function handleAdd() {
    if (!input.trim()) return;
    addProject(input);
    setInput("");
  }

  function startRename(project) {
    setEditingProjectId(project.id);
    setDraftName(project.name);
  }

  function saveRename(projectId) {
    if (!draftName.trim()) {
      setDraftName("");
      setEditingProjectId(null);
      return;
    }

    renameProject(projectId, draftName.trim());
    setEditingProjectId(null);
  }

  const totalTasks = projects.reduce(
    (sum, project) => sum + project.tasks.length,
    0
  );
  const completedTasks = projects.reduce(
    (sum, project) =>
      sum + project.tasks.filter((task) => task.completed).length,
    0
  );
  const activeProjects = projects.filter(
    (project) => project.tasks.some((task) => !task.completed)
  ).length;
  const completionRate =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);
  const recentProjects = [...projects]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 3);

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Notion Lite Workspace</p>
          <h1>Plan projects with clarity, not clutter.</h1>
          <p className="hero-text">
            A calm dashboard for shaping ideas into trackable
            work. Create a project, open it, and turn the page
            into a focused task flow.
          </p>
        </div>

        <div className="hero-stats">
          <article className="stat-card stat-card-accent">
            <span>Projects</span>
            <strong>{projects.length}</strong>
            <p>Spaces you are currently organizing</p>
          </article>
          <article className="stat-card">
            <span>Tasks</span>
            <strong>{totalTasks}</strong>
            <p>Every item captured across the workspace</p>
          </article>
          <article className="stat-card">
            <span>Completed</span>
            <strong>{completedTasks}</strong>
            <p>Progress shipped and checked off</p>
          </article>
          <article className="stat-card">
            <span>Active Boards</span>
            <strong>{activeProjects}</strong>
            <p>Projects still carrying open work</p>
          </article>
        </div>
      </section>

      <section className="workspace-grid workspace-grid-wide">
        <aside className="panel sidebar-panel">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Workspace</p>
              <h2>Daily pulse</h2>
            </div>
            <span className="pill">Live</span>
          </div>

          <div className="sidebar-stack">
            <article className="sidebar-card accent-card">
              <span>Completion rate</span>
              <strong>{completionRate}%</strong>
              <p>Measured across every task in the workspace.</p>
            </article>

            <article className="sidebar-card">
              <span>Recent projects</span>
              {recentProjects.length === 0 ? (
                <p>New projects will appear here as you create them.</p>
              ) : (
                <div className="mini-list">
                  {recentProjects.map((project) => (
                    <Link
                      key={project.id}
                      to={`/project/${project.id}`}
                      className="mini-list-item"
                    >
                      <strong>{project.name}</strong>
                      <span>
                        {project.tasks.length} tasks
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </article>

            <article className="sidebar-card">
              <span>Focus prompt</span>
              <p>
                Create projects by outcome, then break them into
                small concrete tasks you can finish in one sitting.
              </p>
            </article>
          </div>
        </aside>

        <div className="workspace-main">
          <div className="panel composer-panel">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Create</p>
              <h2>Start a new project</h2>
            </div>
            <span className="pill">Quick capture</span>
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
              placeholder="Q2 launch plan, Design sprint, Hiring pipeline..."
            />
            <button onClick={handleAdd}>Create Project</button>
          </div>

          <p className="supporting-text">
            Give each initiative its own focused space for tasks,
            progress, and next actions.
          </p>
          </div>

          <div className="panel projects-panel">
            <div className="section-heading">
              <div>
                <p className="section-kicker">Overview</p>
                <h2>Your projects</h2>
              </div>
              <span className="pill">{projects.length} total</span>
            </div>

            {projects.length === 0 ? (
              <div className="empty-state">
                <div className="empty-orb" />
                <h3>No projects yet</h3>
                <p>
                  Create your first project to turn this into a
                  clean command center for work.
                </p>
              </div>
            ) : (
              <div className="project-list">
                {projects.map((project) => {
                  const {
                    totalTasks: taskCount,
                    completedTasks: doneCount,
                  } = getProjectStats(project);
                  const progress =
                    taskCount === 0
                      ? 0
                      : Math.round((doneCount / taskCount) * 100);
                  const isEditing =
                    editingProjectId === project.id;

                  return (
                    <div
                      key={project.id}
                      className="project-card"
                    >
                      <div className="project-card-top">
                        <div className="project-card-heading">
                          {isEditing ? (
                            <input
                              value={draftName}
                              onChange={(e) =>
                                setDraftName(e.target.value)
                              }
                              onBlur={() =>
                                saveRename(project.id)
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  saveRename(project.id);
                                }

                                if (e.key === "Escape") {
                                  setEditingProjectId(null);
                                }
                              }}
                              className="inline-input"
                              autoFocus
                            />
                          ) : (
                            <button
                              className="title-button"
                              onClick={() => startRename(project)}
                            >
                              {project.name}
                            </button>
                          )}
                          <p>
                            {taskCount === 0
                              ? "No tasks yet"
                              : `${doneCount} of ${taskCount} tasks complete`}
                          </p>
                        </div>
                        <div className="project-card-actions">
                          <button
                            className="chip-button"
                            onClick={() => startRename(project)}
                          >
                            Rename
                          </button>
                          <Link
                            to={`/project/${project.id}`}
                            className="arrow-chip"
                          >
                            Open
                          </Link>
                        </div>
                      </div>

                      <div className="progress-row">
                        <div className="progress-track">
                          <span
                            className="progress-fill"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <strong>{progress}%</strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
