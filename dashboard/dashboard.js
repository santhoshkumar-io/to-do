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

      const todoList = document.getElementById('todo-list')
      jsonData.todos.map(task => {
        const todoWrap = document.createElement('div')
        todoWrap.className = "todoWrap"
        const todo = document.createElement('label');
        todo.className = "todo completed"
        const checkfield = document.createElement('input')
        checkfield.type = "checkbox"
        checkfield.className = "checkField"
        checkfield.addEventListener('change', () => {

        })
        todo.textContent = task.todo
        todo.id = task.id
        todoWrap.appendChild(checkfield)

        todoWrap.appendChild(todo);
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

      const todoList = document.getElementById('todo-list')

      const todoWrap = document.createElement('div')
      todoWrap.className = "todoWrap"
      const todo = document.createElement('label');
      todo.className = "todo completed"
      todo.id = createdTodo.id
      const checkfield = document.createElement('input')
      checkfield.type = "checkbox"
      checkfield.className = "checkField"
      // checkfield.addEventListener('change', () => {

      // })
      todo.textContent = createdTodo.todo
      checkfield.checked = createdTodo.completed
      todoWrap.appendChild(checkfield)
      todoWrap.appendChild(todo);
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

