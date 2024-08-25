import axios from "axios";

export const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_API_URI + "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const postLink = async (link) => {
  try {
    console.log(api.defaults.baseURL);
    const response = await api.post("/analyze", {
      url: link,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
