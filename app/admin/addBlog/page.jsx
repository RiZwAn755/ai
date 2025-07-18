'use client'

import { assets } from '@/Assets/assets'
import { useAppContext } from '@/Context/AppContext'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import parse from 'html-react-parser'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const Page = () => {
  const { axios } = useAppContext()
  const editorRef = useRef(null)
  const quillRef = useRef(null)

  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState(false)
  const [data, setData] = useState({
    title: '',
    description: '',
    category: 'Startup',
    author: 'Alex Bennett',
    authorImg: '/author_img.png',
  })

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        placeholder: 'Write your blog here...',
      })
    }
  }, [])

  const generateContent = async () => {
    if (!data.title) return toast.error('Please enter a title')

    try {
      setLoading(true)
      const token = localStorage.getItem('token');
      // Call the backend endpoint using axios with Authorization header
      const response = await axios.post(
        `${baseUrl}/api/blog/generate`,
        { prompt: data.title },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      if (response.data.success) {
        quillRef.current.root.innerHTML = response.data.content // Set HTML directly
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const onChangeHandler = (event) => {
    const name = event.target.name
    const value = event.target.value
    setData((data) => ({ ...data, [name]: value }))
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
  alert("wtf");
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append(
      'description',
      quillRef.current.root.innerHTML // fetch from quill
    )
    formData.append('category', data.category)
    formData.append('author', data.author)
    formData.append('authorImg', data.authorImg)
    formData.append('image', image)

    try {
      const response = await axios.post(`${baseUrl}/api/blog/add`, formData)
      if (response.data.success) {
        toast.success(response.data.msg)
        setImage(false)
        setData({
          title: '',
          description: '',
          category: 'Startup',
          author: 'Alex Bennett',
          authorImg: '/author_img.png',
        })
        quillRef.current.root.innerHTML = ''
      } else {
        toast.error('Something went wrong')
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-blue-50 py-10 px-4 sm:px-10">
      <form
        onSubmit={onSubmitHandler}
        className="max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-2xl shadow-md"
      >
        {/* Upload Thumbnail */}
        <p className="text-lg font-medium text-gray-700">Upload Thumbnail</p>
        <label htmlFor="image" className="mt-3 inline-block cursor-pointer">
          <Image
            className="rounded-xl border border-dashed border-gray-300 hover:scale-105 transition-transform"
            src={!image ? assets.upload_area : URL.createObjectURL(image)}
            width={200}
            height={120}
            alt="thumbnail"
          />
        </label>
        <input
          onChange={(e) => setImage(e.target.files[0])}
          type="file"
          id="image"
          hidden
          required
        />

        {/* Blog Title */}
        <p className="text-lg font-medium text-gray-700 mt-6">Blog Title</p>
        <input
          name="title"
          onChange={onChangeHandler}
          value={data.title}
          className="w-full max-w-xl mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Type here..."
          required
        />

        {/* Blog Description (Quill) */}
        <p className="text-lg font-medium text-gray-700 mt-6">Blog Description</p>
        <div className="max-w-xl min-h-[300px] relative mt-2 rounded-lg border border-gray-300 px-3 py-3">
          <div ref={editorRef}></div>

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-lg">
              <div className="w-8 h-8 rounded-full border-2 border-t-white animate-spin"></div>
            </div>
          )}

          <button
            disabled={loading}
            type="button"
            onClick={generateContent}
            className="absolute bottom-2 right-2 text-xs text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-md shadow transition-all"
          >
            Generate with AI
          </button>
        </div>

        {/* Blog Category */}
        <p className="text-lg font-medium text-gray-700 mt-6">Blog Category</p>
        <select
          name="category"
          onChange={onChangeHandler}
          value={data.category}
          className="w-40 mt-2 px-4 py-3 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Startup">Startup</option>
          <option value="Technology">Technology</option>
          <option value="Lifestyle">Lifestyle</option>
        </select>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-8 w-40 h-10 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg transition-all shadow"
        >
          Add Blog
        </button>
      </form>
    </div>
  )
}

export default Page

