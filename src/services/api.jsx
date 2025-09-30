// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7056/api", // Your .NET API
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;





// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:3000/",
// });

// export default api;

// // import axios from "axios";

// // const api = axios.create({
// //   baseURL: "https://sports-project-databases.onrender.com/",
// // });

// // export default api;