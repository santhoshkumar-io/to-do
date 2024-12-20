//With async fun
const getUser = async () => {
  const response = await fetch("https://dummyjson.com/users");
  if (response.status !== 200) {
    throw new Error("Could not fetch data");
  }
  const data = await response.json();
  return data;
};
console;
getUser()
  .then((data) => console.log(data))
  .catch((err) => console.log(err.message));
//Witout async
// fetch("https://dummyjson.com/users")
//   .then((resolve) => {
//     console.log("Resolved:".resolve);
//     return resolve.json();
//   })
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
//Ancient methods
// const getUser = (resource) => {
//   return new Promise((resolve, reject) => {
//     const request = new XMLHttpRequest();

//     request.addEventListener("readystatechange", () => {
//       //   console.log(request);
//       if (request.readyState === 4 && request.status === 200) {
//         const data = JSON.parse(request.responseText);
//         resolve(data);
//       } else if (request.readyState === 4) {
//         reject("Could not fetch data");
//       }
//     });
//     request.open("GET", resource);
//     request.send();
//   });
// };
// getUser("https://dummyjson.com/users")
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
// //promise
// const getsome = () => {
//   return new Promise((resolve, reject) => {
//     resolve("some data");
//   });
//   //fetch something
// };
// getsome()
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
