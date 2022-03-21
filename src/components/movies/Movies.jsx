import React, { Fragment, useEffect, useState, useCallback } from "react";
import { v4 as uuidv4 } from 'uuid'
import mockupData from '../../mockup/moviesList.json'
import client from '../../lib/client';
import './movies.css'


export default function Movies() {
    const [moviesData, setMoviesData] = useState([])
    const [sendButtonText, setSendButtonText] = useState('Update Movies')

    const getMovies = useCallback(async () => {
        try {
            const data = await client.getMovies()
            if (data.films && data.films.length) setMoviesData(() => data.films.map(movie => ({ ...movie, uniqueId: uuidv4(), original: true, isModify: false })))
        } catch (err) {
            console.log(err);
        }
    }, [])

    useEffect(() => {
        getMovies()
        if (mockupData.films && mockupData.films.length) setMoviesData(() => mockupData.films.map(movie => ({ ...movie, uniqueId: uuidv4(), original: true, isModify: false })))
    }, [getMovies])

    const sortMovies = () => setMoviesData(prevState => [...prevState.sort(() => Math.random() - 0.5)])

    const changeMovieRate = () => setMoviesData(prevState => prevState.map(movie => {
        if (Math.random() > 0.5) {
            const newRate = Number(parseFloat(Math.random() * 10).toFixed(1))
            const isModify = movie.rate !== newRate
            return {
                ...movie,
                rate: newRate,
                isModify
            }
        }
        return movie
    }))

    const duplicateMovie = uniqueId => setMoviesData(prevState => [
        ...prevState,
        {
            ...prevState[prevState.findIndex(movie => movie.uniqueId === uniqueId)],
            uniqueId: uuidv4(),
            original: false
        }
    ])

    const handleChangeAuthor = e => {
        const { name, value } = e.target
        setMoviesData(prevState => prevState.map(movie => {
            if (movie.uniqueId === name) {
                const originalAuthor = mockupData.films.filter(orgMovie => orgMovie.id === movie.id)[0].author
                return {
                    ...movie,
                    author: value,
                    isModify: originalAuthor !== value
                }
            }
            return movie
        }))
    }

    const updateMovies = async () => {
        setSendButtonText(() => 'Updating...')
        const modifyMovies = moviesData.reduce((acc, movie) => {
            const { original, isModify, uniqueId, ...rest } = movie
            if (original && isModify) acc.push(rest)
            return acc
        }, [])
        try {
            await client.updateMovies(modifyMovies)
            setSendButtonText(() => {
                setTimeout(() => setSendButtonText(() => 'Update Movies'), 3000)
                return 'Movies updated successfully'
            })
            getMovies()
        } catch (err) {
            setSendButtonText(() => {
                setTimeout(() => setSendButtonText(() => 'Update Movies'), 3000)
                return 'Failed updating movies'
            })
        }

    }

    return (
        <Fragment>
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Rate</th>
                        <th>Author</th>
                        <th>Tools</th>
                    </tr>
                </thead>
                <tbody>
                    {moviesData.map(movie => (
                        <tr key={movie.uniqueId}>
                            <td>{movie.name}</td>
                            <td>
                                {movie.rate}
                            </td>
                            <td>
                                <select
                                    name={movie.uniqueId}
                                    value={movie.author}
                                    onChange={e => handleChangeAuthor(e)}
                                >
                                    {mockupData.authors.map(author => (
                                        <option
                                            key={author.id}
                                            value={author.id}
                                        >
                                            {author.name}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td>
                                <button
                                    onClick={() => duplicateMovie(movie.uniqueId)}
                                    className="btn"
                                >
                                    <p>Duplicate</p>
                                </button>
                            </td>
                        </tr>

                    ))}
                </tbody>
            </table>
            <button
                onClick={() => sortMovies()}
                className="send-sort-btn"
            >
                <p>Sort</p>
            </button>
            <button
                onClick={() => changeMovieRate()}
                className="send-sort-btn"
            >
                <p>Change Rate</p>
            </button>
            <button
                className="send-sort-btn"
                type="submit"
                onClick={() => updateMovies()}
            >
                <p>{sendButtonText}</p>
            </button>
        </Fragment>
    )
}