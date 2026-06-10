import axios from "axios"

const FoodlyApiClient = axios.create({
  baseURL: "https://foodly-backend-5mci.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
})

export default FoodlyApiClient