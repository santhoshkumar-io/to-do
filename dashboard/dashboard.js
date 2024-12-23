'use strict'

let user = null;

document.addEventListener("DOMContentLoaded", () => {

  const accessToken = localStorage.getItem("accessToken");

  const getcurrentUser = async () => {
    if (!accessToken) {

      document.location = "/";
      return
    }

    try {
      const response = await fetch('https://dummyjson.com/auth/me', {
        method: "GET",
        headers: {
          "Authorization": accessToken,
        },
      })
      if (response.status === 401) {
        document.location = "/";
        localStorage.removeItem('accessToken')
        return
      }
      if (response.status !== 200) {
        throw new Error("Could not fetch data");
      }


      const jsonData = await response.json();
      user = jsonData
      console.log(user);
      document.getElementById("user-greet").textContent = `Welcome ${user.firstName}  ${user.lastName}!`
      getTodos()
    } catch (err) {
      console.log("Err :", err)
    }
  };
  const getTodos = async () => {
    try {

      const response = await fetch('https://dummyjson.com/todos/user/' + user.id)
      if (response.status !== 200) {
        throw new Error("Could not fetch data");
      }
      const jsonData = await response.json();

      const addedTasks = [];
      const todoList = document.getElementById('todo-list')
      jsonData.todos.map(task => {
        addedTasks.push(task)
        localStorage.setItem("addedTasks", JSON.stringify(addedTasks))
        console.log(addedTasks)
        const todoWrap = document.createElement('li')
        todoWrap.className = "todoWrap"
        const todo = document.createElement('label');
        todo.className = "todo";
        todo.textContent = task.todo;
        todo.id = task.id;
        const checkfield = document.createElement('input');
        checkfield.type = "checkbox"
        checkfield.className = "checkField"
        checkfield.checked = task.completed
        if (checkfield.checked) {
          todo.completed = checkfield.checked
          todo.classList.add("completed");
          console.log(todo, checkfield.checked)
        } else {
          todo.classList.remove("completed");
        }
        checkfield.addEventListener('change', (event) => {
          const addedTasks = JSON.parse(localStorage.getItem("addedTasks"));
          const index = addedTasks.findIndex(t => t.id === task.id);
          addedTasks[index].completed = checkfield.checked
          task.completed = checkfield.checked
          if (checkfield.checked) {
            todo.classList.add("completed");
          } else { todo.classList.remove("completed"); }
          localStorage.setItem("addedTasks", JSON.stringify(addedTasks))
        })
        const deleteIcon = document.createElement('i');
        deleteIcon.className = "fa-solid fa-trash";
        const todoItem = document.createElement('div');
        todoItem.className = "todo-item"
        todoItem.appendChild(todo)
        todoItem.appendChild(deleteIcon)
        todo.addEventListener('click', () => {
          console.log("clikced")
          const getUpdatedInput = document.createElement("input")
          getUpdatedInput.type = "text"
          getUpdatedInput.className = "update-input"
          todoItem.textContent = ""
          todoItem.appendChild(getUpdatedInput)
          todoItem.appendChild(deleteIcon)
          getUpdatedInput.addEventListener('keydown', (e) => {
            if (e.code === "Enter") {
              console.log(getUpdatedInput.value)
            }
          })
        })
        todoWrap.appendChild(checkfield)
        todoWrap.appendChild(todoItem);
        todoList.appendChild(todoWrap)

      })
    } catch (err) {
      console.log(err)
    }
  }


  const createTodo = async (todoToBeCreated) => {
    try {

      const response = await fetch('https://dummyjson.com/todos/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          todo: todoToBeCreated,
          completed: false,
          userId: user.id,
        })
      })

      if (response.status === 400) {
        throw new Error(response.message);
      }
      const createdTodo = await response.json();
      console.log(createdTodo)
      const addedTasks = JSON.parse(localStorage.getItem("addedTasks"));

      const lastTodo = addedTasks[addedTasks.length - 1]

      if (lastTodo.id >= 255) {
        createdTodo.id = lastTodo.id + 1
      }

      addedTasks.push(createdTodo)
      console.log(addedTasks)

      localStorage.setItem("addedTasks", JSON.stringify(addedTasks))
      const todoList = document.getElementById('todo-list')

      const todoWrap = document.createElement('div')
      todoWrap.className = "todoWrap"
      const todo = document.createElement('label');
      todo.className = "todo"
      todo.id = createdTodo.id

      const checkfield = document.createElement('input')
      checkfield.type = "checkbox"
      checkfield.className = "checkField"
      checkfield.addEventListener('change', () => {

        const index = addedTasks.findIndex(t => t.id === task.id);
        addedTasks[index].completed = checkfield.checked
        task.completed = checkfield.checked
        if (checkfield.checked) {
          todo.classList.add("completed");
        } else { todo.classList.remove("completed"); }
        localStorage.setItem("addedTasks", JSON.stringify(addedTasks))
      })
      const deleteIcon = document.createElement('i');
      deleteIcon.className = "fa-solid fa-trash";
      const todoItem = document.createElement('div');
      todoItem.className = "todo-item"
      todoItem.appendChild(todo)
      todoItem.appendChild(deleteIcon)

      todo.textContent = createdTodo.todo
      checkfield.checked = createdTodo.completed
      todoWrap.appendChild(checkfield)
      todoWrap.appendChild(todoItem);
      todoList.appendChild(todoWrap)


    } catch (err) {
      console.log(err)
    }
  }
  // const updateTodo = async () => {
  //   try {

  //     const response = await fetch('https://dummyjson.com/todos/1', {
  //       method: 'PUT',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         completed: false,
  //       })
  //     })
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }
  getcurrentUser()
  document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem("accessToken");
    document.location = "/"
  })

  document.getElementById('create-todo').addEventListener('keydown', async (event) => {
    if (event.code === 'Enter') {
      const todo = document.getElementById('create-todo').value;
      await createTodo(todo)
      document.getElementById('create-todo').value = '';

    }
  })
});

