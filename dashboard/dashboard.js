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
      if (response.status !== 200) {
        throw new Error("Could not fetch data");
      }
      const jsonData = await response.json();
      user = jsonData
      console.log(user);
      document.getElementById("user-greet").textContent = `Welcome ${user.firstName}  ${user.lastName}!`



    } catch (err) {
      console.log("Err :", err)
    }

  };
  const getTodos = async () => {
    try {

      const response = await fetch('https://dummyjson.com/todos/user/1')
      if (response.status !== 200) {
        throw new Error("Could not fetch data");
      }
      const jsonData = await response.json();

      const todoList = document.getElementById('todo-list')
      jsonData.todos.map(task => {
        const todoWrap = document.createElement('li')
        todoWrap.className = "todoWrap"
        const todo = document.createElement('p');
        const checkfield = document.createElement('input')
        checkfield.type = "checkbox"
        checkfield.addEventListener('change', () => {

        })
        todo.textContent = task.todo
        todoWrap.appendChild(checkfield)

        todoWrap.appendChild(todo);
        todoList.appendChild(todoWrap)

      })
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
  getTodos()
  document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem("accessToken");
    document.location = "/"
  })
});

