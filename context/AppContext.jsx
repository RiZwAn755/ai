'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import axios from "axios"
import toast from 'react-hot-toast'

axios.defaults.baseURL = process.env.NEXT_PUBLIC_BASE_URL; // use this for Next.js

const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const [token, setToken] = useState(null)
    const [blogs, setBlogs] = useState([])
    const [input, setInput] = useState("")

    const fetchBlogs = async () => {
        try {
            const { data } = await axios.get('/api/blog/all');
            data.success ? setBlogs(data.blogs) : toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchBlogs();
        const token = localStorage.getItem('token')
        if (token) {
            setToken(token);
            axios.defaults.headers.common['Authorization'] = `${token}`;
        }
    }, [])

    const value = {
        axios, token, setToken, blogs, setBlogs, input, setInput
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    return useContext(AppContext)
}
