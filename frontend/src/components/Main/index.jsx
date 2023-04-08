import { useState, useEffect } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import styles from "./styles.module.css";
import axios from "axios";

const Main = () => {
  const [data, setNewTask] = useState({Title: "", user_id: ""});
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editModalTask, setEditModalTask] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage, setTasksPerPage] = useState(10);

    // Handle page change
    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
    };
  
    // Calculate number of pages
    const totalPages = Math.ceil(tasks.length / tasksPerPage);
  
    // Calculate tasks for current page
    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

  const [error, setError] = useState("");
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };


  const user_id= localStorage.getItem('userId');

  useEffect(() => {
    fetchTasks(currentPage, tasksPerPage);
  }, [currentPage, tasksPerPage]);
  
  const handleNewTaskChange = ({ currentTarget: input }) => {
		setNewTask({ ...data, [input.name]: input.value , user_id: user_id});
	};

  const handleNewTaskSubmit =  async (e) => {
    e.preventDefault();
		try {
			const url = "http://localhost:8080/api/createTask";
			const { data: res } = await axios.post(url, data);
          // check if the task already exists in the tasks array
      const taskExists = tasks.some((task) => task.text.toLowerCase() === data.Title.toLowerCase());
      if (taskExists) {
        setError("Task already exists.");
        return;
      }
      setTasks([...tasks, { id: tasks.length + 1, text:data.Title , completed: false }]);
      setNewTask({ Title: "", user_id: "" });
      console.log(res.message);
      console.log(data.Title)
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
			}
		}
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleEdit = (id) => {
    setEditModalOpen(true);
    setEditModalTask({ id:id, text: "" });
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };

  const handleEditModalSubmit = (newText) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === editModalTask.id) {
          return { ...task, text: newText };
        }
        return task;
      })
    );
    setEditModalOpen(false);
  };

  const handleToggleComplete = (id) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          return { ...task, completed: !task.completed };
        }
        return task;
      })
    );
  };


  const filteredTasks =
    filter === "all"
      ? tasks
      : filter === "completed"
      ? tasks.filter((task) => task.completed)
      : tasks.filter((task) => !task.completed);

  const searchedTasks = filteredTasks.filter((task) =>
    task.text.toLowerCase().includes(search.toLowerCase())
  );


  async function fetchTasks(page = 1, limit = 10) {
    const userId = localStorage.getItem("userId");
    try {
      const response = await fetch(`http://localhost:8080/api/getUserTask?user_id=${userId}&page=${page}&limit=${limit}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const tasks = await response.json();
      console.log(tasks);
      if (tasks && tasks.length > 0) {
        setTasks(tasks);
      }
    } catch (error) {
      console.error(error);
    }
  }
  


  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <h1 className={styles.logo}>Task</h1>
        <button className={styles.logout_btn} onClick={handleLogout}>
          Logout
        </button>
      </nav>
      {/* {(
      <div className={styles.edit_modal_container}>
        <form onSubmit={handleEditModalSubmit}>
          <input
            type="text"
            value={tasks.Title}
            onChange={handleNewTaskChange}
            className={styles.edit_modal_input}
          />
          <div className={styles.modal_actions}>
            <button type="submit" className={styles.edit_modal_btn}>
              Save
            </button>
            <button type="button" onClick={handleEditModalClose} className={styles.edit_modal_btn}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    )} */}
      {error && <div className={styles.error_msg}>{error}</div>}
      <form className={styles.create_task_form} onSubmit={handleNewTaskSubmit}>
        <input
          type="text"
          name="Title"
          placeholder="Create a new task here..."
          value={tasks.Title}
          onChange={handleNewTaskChange}
          className={styles.create_task_input}
        />
        <button type="submit" className={styles.create_task_btn}>
          Create
        </button>
      </form>
	 
      <div className={styles.filters_container}>
    <label>
      <input
        type="radio"
        name="filter"
        value="all"
        checked={filter === "all"}
        onChange={handleFilterChange}
      />
      All
    </label>
    <label>
      <input
        type="radio"
        name="filter"
        value="active"
        checked={filter === "active"}
        onChange={handleFilterChange}
      />
      Active
    </label>
    <label>
      <input
        type="radio"
        name="filter"
        value="completed"
        checked={filter === "completed"}
        onChange={handleFilterChange}
      />
      Completed
    </label>
  </div>
  <div className={styles.search_container}>
    <input
      type="text"
      placeholder=""
      value={search}
      onChange={handleSearchChange}
      className={styles.search_input}
    />
    <button type="submit" className={styles.search_btn}>
      Search
    </button>
  </div>
  {searchedTasks.length ? (
    <div>
      <ul className={styles.task_list}>
        {currentTasks.map((task) => (
          <li key={task.id} className={task.completed ? styles.completed_task : styles.task}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggleComplete(task.id)}
              className={styles.checkbox}
            />
            <span className={styles.task_text}>{task.Title}</span>
            <div className={styles.actions}>
              <button onClick={() => handleEdit(task.id)}>
                <i className="fas fa-pencil-alt"></i>
              </button>
              <button onClick={() => handleDelete(task.id)}>
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </li>
        ))}
      </ul>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        styles={styles}
      />
    </div>
  ) : (
    <p className={styles.empty_message}>No tasks have been created yet.</p>
  )}
</div>

		  );
		  };

      // Pagination component
const Pagination = ({ currentPage, totalPages, handlePageChange, styles }) => {
  const pageNumbers = [];
  
  for (let i = 1; i <= totalPages; i++) {
  pageNumbers.push(i);
  }
  
  return (
  <div className={styles.pagination_container}>
  {pageNumbers.map((pageNumber) => (
  <button
  key={pageNumber}
  className={currentPage === pageNumber ? styles.pagination_active : styles.pagination_button}
  onClick={() => handlePageChange(pageNumber)}
  >
  {pageNumber}
  </button>
  ))}
  </div>
  );
  };
		  
		  export default Main;
