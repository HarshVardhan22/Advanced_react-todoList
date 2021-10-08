import "./App.css";
import React, { useState, useEffect } from "react";
import DoneIcon from "@mui/icons-material/Done";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";


import {
  Button,
  Card,
  CardActions,
  IconButton,
  TextField,
} from "@mui/material";

export default function App() {
  const [id, setId] = useState(1);
  const [value, setValue] = useState("");
  const [error, setError] = useState(1);
  const [functionCalled, setfunctionCalled] = useState(true);
  const [showEditInput, setShowEditInput] = useState(false);
  const [newValue, setNewValue] = useState("");
  const [todoSelected, setTodoSelected] = useState("");

  const overlayStyling = {
    background: "rgba(0,0,0,0.3)",
    zIndex: "2",
    height: "95vh",
    width: "95vw",
    position: "fixed",
  };

 // const colorCodes = ["#F44336", "#9C27B0", "#2196F3", "#00897B", "#FBC02D"];
  //! check if the local storage has data or not
  //! if it has data set it as the def. value of state

  const [todo, setTodo] = useState(() => {
    const savedData = localStorage.getItem("data");
    const initialValue = JSON.parse(savedData);
    return initialValue || [];
  });

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleEditChange = (e) => {
    setNewValue(e.target.value);
  };

  const compareByName = (a, b) => {
    if (a.name > b.name) return 1;
    if (a.name < b.name) return -1;
    return 0;
  };

  const handleSortByName = () => {
    let temp = [...todo];
    temp.sort(compareByName);
    setTodo(temp);
  };

  const compareByCompleted = (a, b) => {
    if (a.completed) return -1;
    if (b.completed) return 1;
    return 0;
  };

  const handleSortByCompleted = () => {
    let temp = [...todo];
    temp.sort(compareByCompleted);
    setTodo(temp);
  };

  const handleSubmit = (e) => {
    try {
      e.preventDefault();
      setfunctionCalled(!functionCalled);
      if (value === "" || value === null) {
        //! throwing error and will catch later
        throw new Error("Task cant be empty");
      } else {
        setError(1);
        let task = {
          name: value,
          completed: false,
          completedAt: null,
          id: id,
        };
        setId(id + 1);
        setTodo([...todo, task]);
        setValue("");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleComplete = (e, id) => {
    let temp = [...todo];

    temp.forEach((item) => {
      if (Number.parseInt(item.id, 10) === Number.parseInt(id, 10)) {
        item.completed = true;
        item.completedAt = new Date().toLocaleTimeString();
      }
    });
    setTodo(temp);
  };

  const handleEditInput = (e, id) => {
    setShowEditInput(true);
    setTodoSelected(id);
  };

  const handleUpdate = (e) => {
    try {
      e.preventDefault();
      setfunctionCalled(!functionCalled);
      if (newValue === "" || newValue === null)
        throw new Error("Updated Task can't be empty");
      else {
        const temp = [...todo];
        temp.forEach((item) => {
          if (Number.parseInt(item.id, 10) === Number.parseInt(todoSelected))
            item.name = newValue;
        });
        setError(1);
        setShowEditInput(false);
        setNewValue("");
        setTodo(temp);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = (e, id) => {
    let temp = todo.filter(
      (item) => Number.parseInt(item.id, 10) !== Number.parseInt(id, 10)
    );
    setTodo(temp);
  };

  const handleReset = () => {
    let temp = [];
    setTodo(temp);
  };

  //! whenver the todo will change a new set of list will be update in the localStorage
  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(todo));
  }, [todo]);

  //this useEffect is used to start the timer, whenever
  //! functionCalled is toggled
  //! in this app, I have used the functionCalled state just to track whenever user is
  //! submiting an input and hnece then the timer will start
  //! but in order to stop the creation multiple timers whnenever FUNCTIONCALLED is updated
  //! we are using a cleanup function

  //! Anyhting inside the useEffect will be called atleast once when the component is loaded on the first time
  //! and then it depends on the dependency array
  //! the cleanup functions are called before the component is updated,,(componentWillUpdate())
  //! so the function clearTimer(timer) will be called just before the component is going to load AGAIN.

  useEffect(() => {
    let timer = setTimeout(() => {
      setError(null);
      console.log("timer");
    }, 1000);

    //! the cleanUp function
    return () => {
      console.log("cleared ");
      clearTimeout(timer);
    };
  }, [functionCalled]);

  return (
    <div className="App">
      <div className="mainContainer">
        <div style={showEditInput ? overlayStyling : { display: "none" }}></div>
        <div
          style={
            typeof error === "string" ? overlayStyling : { display: "none" }
          }
        ></div>
        <div className="conditionalDivs">
          {showEditInput && (
            <form className="editForm" onSubmit={handleUpdate}>
              <TextField
                label="Updated value of TODO"
                variant="standard"
                value={newValue}
                onChange={handleEditChange}
              />
              <div className="editBtns">
                <Button
                  variant="contained"
                  sx={{ m: 2 }}
                  type="submit"
                  onClick={handleUpdate}
                >
                  Update
                </Button>
                <Button
                  variant="contained"
                  sx={{ m: 2 }}
                  type="submit"
                  onClick={() => {
                    setShowEditInput(false);
                  }}
                >
                  Back
                </Button>
              </div>
            </form>
          )}
          {typeof error === "string" && (
            <div className="error">
              <p>{error}</p>
            </div>
          )}
        </div>

        <div className="container">
          <header>
            <div className="functionButtons">
              <Button
                variant="contained"
                sx={{ m: 2 }}
                onClick={handleSortByCompleted}
              >
                Sort by Completion
              </Button>
              <Button
                variant="contained"
                sx={{ m: 2 }}
                onClick={handleSortByName}
              >
                Sort by Name
              </Button>

              <Button variant="contained" sx={{ m: 2 }} onClick={handleReset}>
                Reset
              </Button>
            </div>

            <div className="inputForm">
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Enter TODO"
                  variant="standard"
                  value={value}
                  onChange={handleChange}
                />

                <Button
                  variant="contained"
                  sx={{ m: 2 }}
                  type="submit"
                  onClick={handleSubmit}
                >
                  Add
                </Button>
              </form>
            </div>
          </header>

          <div className="todo">
            {todo?.map((item) => {
              return (
                <Card
                  elevation={4}
                  key={item.id}
                  className="card"
                  style={
                    item.completed
                      ? { backgroundColor: "#3fe878" }
                      : { backgroundColor: "#e0e0e0" }
                  }
                >
                  <div className="todoDetails">
                    <h3
                      style={
                        item.completed
                          ? { textDecoration: "line-through" }
                          : { textDecoration: "none" }
                      }
                    >
                      {item.name}
                    </h3>
                    {item.completed && (
                      <p className="completedAt">{item.completedAt}</p>
                    )}
                  </div>

                  <CardActions>
                    <IconButton disabled={item.completed}>
                      <DoneIcon onClick={(e) => handleComplete(e, item.id)} />
                    </IconButton>
                    <IconButton>
                      <EditIcon onClick={(e) => handleEditInput(e, item.id)} />
                    </IconButton>
                    <IconButton>
                      <DeleteIcon onClick={(e) => handleDelete(e, item.id)} />
                    </IconButton>
                  </CardActions>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
