import Image from 'next/image'
import React from 'react'
import { useRouter } from 'next/navigation'
import { EyeIcon, EyeSlashIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useAppContext } from '@/context/AppContext'
import toast from 'react-hot-toast'

const BlogTableItem = ({ blog, fetchBlogs, index }) => {
    const router = useRouter();
    const isPublished = blog.isPublished;
    const BlogDate = blog.date ? new Date(blog.date) : null;
    const { axios } = useAppContext();

    const handlePublish = async () => {
      try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/toggle-publish`, { id: blog._id });
        if (data.success) {
          toast.success('Blog published!');
          fetchBlogs();
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    const handleUnpublish = async () => {
      try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/toggle-publish`, { id: blog._id });
        if (data.success) {
          toast.success('Blog unpublished!');
          fetchBlogs();
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    const handleDelete = async () => {
      if (confirm('Are you sure you want to delete this blog?')) {
        try {
          const { data } = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/delete`, { id: blog._id });
          if (data.success) {
            toast.success('Blog deleted!');
            fetchBlogs();
          } else {
            toast.error(data.message);
          }
        } catch (error) {
          toast.error(error.message);
        }
      }
    };
    return (
      <tr className='bg-white border-b'>
        <th scope='row' className='items-center gap-3 hidden sm:flex px-6 py-4 font-medium text-gray-900 whitespace-nowrap'>
          {/* <Image width={40} height={40} src={blog.authorImg ? blog.authorImg : assets.profile_icon} alt={blog.author || 'author'} /> */}
          <p>{blog.author || 'No author'}</p>
        </th>
        <td className='px-6 py-4'>
          {blog.title || 'no title'}
        </td>
        <td className='px-6 py-4'>
          {BlogDate && !isNaN(BlogDate) ? BlogDate.toLocaleDateString() : 'No date'}
        </td>
        <td className='px-6 py-4'>
          {isPublished ? (
            <span className="inline-block px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
              Published
            </span>
          ) : (
            <span className="inline-block px-3 py-1 text-xs font-semibold bg-yellow-100 text-yellow-700 rounded-full">
              Draft
            </span>
          )}
        </td>
        <td className='px-6 py-4'>
          <div className="flex gap-2">
            {isPublished ? (
              <button
                className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-xs border border-gray-600 font-semibold"
                onClick={handleUnpublish}
                title="Unpublish blog"
              >
                <EyeSlashIcon className="w-4 h-4" />
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
                Unpublish
              </button>
            ) : (
              <button
                className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs border border-blue-600 font-semibold"
                onClick={handlePublish}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Publish
              </button>
            )}
            <button
              className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs border border-red-600 font-semibold"
              onClick={handleDelete}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </td>
      </tr>
    )
}

export default BlogTableItem