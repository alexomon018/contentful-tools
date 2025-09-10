import axios from "axios";

export const axiosClient = axios.create({
    timeout: 0
});