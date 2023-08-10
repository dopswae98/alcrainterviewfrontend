import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import { DataContext } from "../Components/TheContext";
import axios from "axios";
import "font-awesome/css/font-awesome.min.css";

//a function  to check onblur events for divs

function useOutsideAlerter(ref) {
  const { setAddmodal, setTodoDetailsModal } = useContext(DataContext);

  //   const { setAddmodal } = useContext(DataContext);
  useEffect(() => {
    /** * Alert if clicked on outside of element */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setAddmodal(false);
        setTodoDetailsModal(false);
        // alert("You clicked outside of me!");
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

//the main home component

const Homepage = (props) => {
  const {
    addmodal,
    setTodoDetailsModal,
    setAddmodal,
    todoDetailsModal,
    fakeAuthService,
    setFakeAuthService,

    setAuth,
  } = useContext(DataContext);
  const [addFeedback, setAddFeedback] = useState(null);
  const [todoDetails, setTodoDetails] = useState({});

  const wrappperRef = useRef(null);
  useOutsideAlerter(wrappperRef);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    completed: "pending",
    datedue: "",
  });

  const [todos, setTodos] = useState([]);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [completed, setCompleted] = useState("");
  const [checked, setChecked] = useState(false);

  const handleChecked = (todo) => {
    const todoIndex = todos.find((foundTodo) => foundTodo.id === todo.id);

    if (todoIndex) {
      if (todoIndex.completed === "completed") {
        todoIndex.completed = "pending";

        // setTodos([...todos]);
      } else {
        todoIndex.completed = "completed";
      }
      setTodos([...todos]);
    }

    axios
      .put(`http://127.0.0.1:8000/todos/${todo.id}/`, todoIndex)
      .then((response) => {
        api();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    api();
    getCurrentDateTime();
    
  }, [formData]);

  const getCurrentDateTime = () => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;
    const formattedTime = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
    setDate(formattedDate);
    setTime(formattedTime);
  };

  const handleChange = (event) => {
    getCurrentDateTime();
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
      //   status,
      date,
      time,
      //   datedue,
    });
  };

  const api = () =>
    axios
      .get(`http://127.0.0.1:8000/todos/`)
      .then((response) => {
        setTodos(response.data);
      })

      .catch((error) => {
        console.error(error);
      });

  const handleSubmit = async (e) => {
    e.preventDefault();

    axios

      .post("http://127.0.0.1:8000/todos/", formData)
      .then((response) => {
        setAddFeedback(true);
        setFormData({ ...formData, title: "", description: "", datedue: "" });

        api();
      })
      .catch((error) => {
        setAddFeedback(false);
      });
    api();
  };

  const deleteTodo = (id) => {
    axios
      .delete(`http://127.0.0.1:8000/todos/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        api();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleStatus = (e) => {
    setCompleted(e.target.value);
  };
  const onClickOutsideListener = () => {
    setTodoDetailsModal(false);
    setAddmodal(false);
    // alert("click outside");
    document.removeEventListener("click", onClickOutsideListener);
  };
  const handleTodoDetails = (todo) => {
    setTodoDetailsModal(true);

    setTodoDetails({ ...todo });
  };
  const newTodos = [todos];
  const [first, setFirst] = useState([1, 2, 2]);

  const dueTodayData = todos.filter((todoItem) => todoItem.datedue === date);
  console.log("todos", todos);
  console.log("due today data", dueTodayData);

  const doneData = todos.filter(
    (todoItem) => todoItem.completed === "completed"
  );
  const undoneData = todos.filter(
    (todoItem) => todoItem.completed === "pending"
  );

  
  

  const handleLogout = () => {
    fakeAuthService["isAuthenticated"] = false;
    setFakeAuthService({ ...fakeAuthService, isAuthenticated: false });
    setAuth(true);

    if (fakeAuthService.isAuthenticated) {
      return <Navigate to="/" replace={true} />;
    }
  };

  const SetDone = (todo) => {
    if (todo.completed === "completed") {
      setFormData({
        ...todo,
        completed: "pending",
      });
    } else {
      setFormData({
        ...todo,
        completed: "completed",
      });
    }

    axios

      .put("http://127.0.0.1:8000/todos/" + todo.id + "/", formData)
      .then((response) => {
        api();
      })
      .catch((error) => {
        api();
      });
  };

  return (
    <div className="position-relative">
      <button
        type="submit"
        className="btn btn-danger rounded-pill fw-bold ms-md-4 ms-0 position-absolute"
        onClick={handleLogout}
        // disabled={isLoading}
        style={{ top: 2, right: 25 }}
      >
        Logout
      </button>
      <div
        className={todoDetailsModal ? "add_modal pt-5 mt-5" : `d-none`}
        style={{ zIndex: 2000 }}
      >
        <div className="row">
          <div
            className="col-md-8 px-3 position-relative mx-auto box_shadow fs-5 fw-bold bg-white rounded py-3"
            ref={wrappperRef}
          >
            <div
              className="position-absolute close-icon border border-2 rounded-circle d-flex align-items-center justify-content-center text-danger border-danger"
              style={{
                right: 10,
                top: 5,
                height: 30,
                width: 30,
                cursor: "pointer",
              }}
              onClick={() => setTodoDetailsModal(false)}
            >
              <i className="fa fa-close" aria-hidden="true"></i>
            </div>
            <h3 className="text-danger fw-bold">Todo Details</h3>
            <div className="todo_title d-flex gap-2 f">
              <p>Todo Title:</p>
              <p className="todo_text">{todoDetails.title}</p>
            </div>
            <div className="todo_title d-flex gap-2">
              <p>Todo Description:</p>
              <p className="todo_text">{todoDetails.description}</p>
            </div>
            <div className="todo_title d-flex gap-2">
              <p>Todo Completed:</p>
              <p className="todo_text">{todoDetails.completed}</p>
            </div>
            <div className="todo_title d-flex gap-2">
              <p>Date Created:</p>
              <p className="todo_text">{todoDetails.date}</p>
            </div>
            <div className="todo_title d-flex gap-2">
              <p>Time Created:</p>
              <p className="todo_text">{todoDetails.time}</p>
            </div>
            <div className="todo_title d-flex gap-2">
              <p>Date Due Tile:</p>
              <p className="todo_text">{todoDetails.datedue}</p>
            </div>
          </div>
        </div>
      </div>
      <div className={addmodal ? "add_modal pt-5" : `d-none`}>
        <p className="text-center h1 fw-bold text-danger bg-light mx-5 px-5 rounded">
          Add Todo Items
        </p>
        <div className="add_todo">
          <div className="row">
            <div
              className="col-md-6 mx-auto bg-white position-relative px-md-3 px-4 mx-3 mx-md-auto box_shadow mt-3 py-3 rounded"
              ref={wrappperRef}
            >
              <div
                className={
                  addFeedback === true
                    ? "alert alert-success alert-dismissible fade show container mt-5 visible position-absolute"
                    : addFeedback === false
                    ? "alert alert-danger alert-dismissible fade show container mt-5 text-center visible position-absolute"
                    : "invisible alert alert-success alert-dismissible fade show container mt-5 position-absolute"
                }
                role="alert"
                style={{ top: -120, left: 0 }}
              >
                <span className="fw-bold ms-1">
                  {addFeedback ? "Task Added Successfully" : `An Error Occured`}
                </span>
                <button
                  type="button"
                  className="btn-close d-none"
                  data-bs-dismiss="alert"
                  aria-label="Close"
                ></button>
              </div>
              <div
                className="position-absolute close-icon border border-2 rounded-circle d-flex align-items-center justify-content-center text-danger border-danger"
                style={{
                  right: 10,
                  top: 5,
                  height: 30,
                  width: 30,
                  cursor: "pointer",
                }}
                onClick={() => setAddmodal(false)}
              >
                <i className="fa fa-close" aria-hidden="true"></i>
              </div>
              <form
                // action=""
                // method="POST"
                onSubmit={handleSubmit}
              >
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    aria-describedby="emailHelp"
                    value={formData.title}
                    onChange={handleChange}
                    name="title"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="datedue" className="form-label">
                    Date Due
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="datedue"
                    name="datedue"
                    value={formData.datedue}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3 overflow-hidden">
                  <select
                    name="completed"
                    id=""
                    className="form-select overflow-hidden"
                    aria-label="Default select example"
                    onChange={handleChange}
                    value={formData.completed}
                  >
                    <option value="completed">completed</option>
                    <option value="pending">pending</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="btn login_button btn-primarys text-white fw-bold w-100"
                >
                  Add Todo
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="addtodo mt-5 d-flex align-items-center justify-content-center">
        <button
          className="btn btn-outline-danger rounded-0 fw-bold"
          onClick={() => {
            setAddmodal(true);
            setAddFeedback(null);
          }}
        >
          Add Todo
        </button>
      </div>
      <div className="container py-5">
        <div className="row text-center gap-5 mx-auto">
          <div className="col-md-5 p-3 box_shadow1 rounded">
            <p className="fw-bold">Due Today</p>
            {dueTodayData.map((todo, idx) => {
              return (
                <div
                  className="todo d-flex align-items-center justify-content-between"
                  key={idx}
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckDefault"
                        // {completed === 'completed'? 'checked':null}
                        // checked={todo.completed === "completed" ? true : false}
                        // onChange={() => SetDone(todo)}
                        // onClick={() => SetDone(todo)}

                        // checked={checked} working
                        checked={
                          todo.completed === "pending"
                            ? false
                            : todo.completed === "completed"
                            ? true
                            : false
                        }
                        onChange={() => handleChecked(todo)}
                      />
                    </div>
                    <p
                      className="text-start flex-grow-1 rounded ps-2"
                      onClick={() => handleTodoDetails(todo)}
                    >
                      {todo.title}
                    </p>
                  </div>
                  <div className="d-flex gap-3 justify-content-between">
                    <span>
                      <p>{`${todo.datedue}`}</p>
                    </span>
                    <span>
                      <i
                        className="fa fa-trash text-danger"
                        aria-hidden="true"
                        style={{ cursor: "pointer" }}
                        onClick={() => deleteTodo(todo.id)}
                      ></i>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="col-md-5 p-3 box_shadow1 rounded">
            <p className="fw-bold">UNDONE</p>
            {undoneData.map((todo, idx) => {
              return (
                <div
                  className="todo d-flex align-items-center justify-content-between"
                  key={idx}
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckDefault"
                        // {completed === 'completed'? 'checked':null}
                        checked={
                          todo.completed === "pending"
                            ? false
                            : todo.completed === "completed"
                            ? true
                            : false
                        }
                        onChange={() => handleChecked(todo)}
                      />
                    </div>
                    <p
                      className="text-start flex-grow-1 rounded ps-2"
                      onClick={() => handleTodoDetails(todo)}
                    >
                      {todo.title}
                    </p>
                  </div>

                  <div className="d-flex gap-3 justify-content-between">
                    <span>
                      <p>{`${todo.datedue}`}</p>
                    </span>
                    <span>
                      <i
                        className="fa fa-trash text-danger"
                        aria-hidden="true"
                        style={{ cursor: "pointer" }}
                        onClick={() => deleteTodo(todo.id)}
                      ></i>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="col-md-5 p-3 box_shadow rounded">
            <p className="fw-bold">DONE</p>
            {doneData.map((todo, idx) => {
              return (
                <div
                  className="todo d-flex align-items-center justify-content-between"
                  key={idx}
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex">
                    <div className="form-check">
                      <input
                        className={"form-check-input"}
                        type="checkbox"
                        value=""
                        id="flexCheckDefault"
                        checked={
                          todo.completed === "pending"
                            ? false
                            : todo.completed === "completed"
                            ? true
                            : false
                        }
                        onChange={() => handleChecked(todo)}
                      />
                    </div>
                    <p
                      className="text-start flex-grow-1 rounded ps-2"
                      onClick={() => handleTodoDetails(todo)}
                    >
                      {todo.title}
                    </p>
                  </div>
                  <div className="d-flex gap-3 justify-content-between">
                    <span>
                      <p>{`${todo.datedue}`}</p>
                    </span>
                    <span>
                      <i
                        className="fa fa-trash text-danger"
                        aria-hidden="true"
                        style={{ cursor: "pointer" }}
                        onClick={() => deleteTodo(todo.id)}
                      ></i>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
