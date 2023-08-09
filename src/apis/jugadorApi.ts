import axios from "axios";


const jugadorApi = axios.create({
    baseURL: 'https://localhost:44397/api'
})

export default jugadorApi;

