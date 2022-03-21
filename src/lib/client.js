import axios from 'axios'
import { API_PATH } from '../config/urlConfig'

const DEFAULT_REQUEST_CONFIG = {
    headers: {
        'Content-Type': 'application/json'
    },
}

const client = {
    getMovies() {
        const url = `${API_PATH}/movies`
        return axios.get(url, DEFAULT_REQUEST_CONFIG)
    },

    updateMovies(moviesArray) {
        const url = `${API_PATH}/movies`
        return axios.put(url, moviesArray, DEFAULT_REQUEST_CONFIG)
    }
}

export default client
