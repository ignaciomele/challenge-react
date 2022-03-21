export const API_PATH =
    process.env.NODE_ENV === 'production'
        ? process.env.API_PATH
        : 'http://localhost:3000'