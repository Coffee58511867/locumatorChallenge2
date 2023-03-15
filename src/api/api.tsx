import axios from "axios";

const instance = axios.create({
  baseURL: "https://ionic-testing.onrender.com/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

export default instance;
