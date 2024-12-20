'use strict'

const validateUser = async (username, password) => {
  try {
    const response = await fetch("https://dummyjson.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (response.status !== 200) {
      throw new Error("Could not fetch data");
    }
    const jsonData = await response.json();
    localStorage.setItem("accessToken", jsonData.accessToken);
    document.location = './dashboard/dashboard.html';
    console.log(jsonData);
  } catch (error) {
    console.log(error);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    document.location = './dashboard/dashboard.html'
    return
  }
  const loginForm = document.getElementById("login-form");

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = document.getElementById("uname").value;
    const password = document.getElementById("password").value;
    await validateUser(username, password);
  });
});
