import "./App.css";
import React, { useState, useEffect } from "react";
export default function App() {
  const [id, setId] = useState(1);
  const [value, setValue] = useState("");
  const [error, setError] = useState();
  const [functionCalled, setfunctionCalled] = useState(true);

  //check if the local storage has data or not
  //if it has data set it as the def. value of state
  const [todo, setTodo] = useState(() => {
    const savedData = localStorage.getItem("data");
    const initialValue = JSON.parse(savedData);
    return initialValue || [];
  });


  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const compareByName = (a, b) => {
    if (a.name > b.name) return 1;
    if (a.name < b.name) return -1;
    return 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setfunctionCalled(!functionCalled);
    if (value === "" || value === null) {
      setError("Task cant be empty");
    } else {
      setError("");
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
  };

  const handleComplete = (e) => {
    e.target.style.backgroundColor = "green";
    e.target.style.color = "whitesmoke";
    let temp = [...todo];

    temp.forEach((item, index) => {
      if (Number.parseInt(item.id, 10) === Number.parseInt(e.target.id, 10)) {
        item.completed = true;
        item.completedAt = new Date().toLocaleTimeString();
      }
    });

    setTodo(temp);
  };

  const handleDelete = (e) => {
    let temp = todo.filter(
      (item) =>
        Number.parseInt(item.id, 10) !== Number.parseInt(e.target.id, 10)
    );
    setTodo(temp);
  };

  const compareByCompleted = (a, b) => {
    if (a.completed) return -1;
    if (b.completed) return 1;
    return 0;
  };

  const handleSortByName = () => {
    let temp = [...todo];
    temp.sort(compareByName);
    setTodo(temp);
  };

  const handleSortByCompleted = () => {
    let temp = [...todo];
    temp.sort(compareByCompleted);
    setTodo(temp);
  };

  const handleReset = () => {
    let temp = [];
    setTodo(temp);
  };

  //whenver the todo will change a new set of list will be update in the localStorage
  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(todo));
  }, [todo]);

  useEffect(() => {
    let timer = setTimeout(() => {
      setError(null);
      console.log("timer");
    }, 1000);
    return () => {
      console.log("cleared ");
      clearTimeout(timer);
    };
  }, [functionCalled]);

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <button onClick={handleSortByCompleted}>Sort by Completion</button>
      <button onClick={handleSortByName}>Sort by Name</button>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Enter a task here"
          value={value}
          onChange={handleChange}
        />
        <button type="submit" onClick={handleSubmit}>
          Add
        </button>
      </form>

      <button onClick={handleReset}>Reset</button>
      <div className="todo">
        {todo?.map((item, index) => {
          return (
            <div key={item.id}>
              <p
                style={
                  item.completed
                    ? { textDecoration: "line-through" }
                    : { textDecoration: "none" }
                }
              >
                {item.name}
              </p>
              {item.completed && <p>{item.completedAt}</p>}
              <button id={item.id} onClick={handleComplete}>
                completed
              </button>
              <button id={item.id} onClick={handleDelete}>
                Delete
              </button>
            </div>
          );
        })}
        {(error !== "" || error !== null) && <p>{error}</p>}
      </div>
    </div>
  );
}
