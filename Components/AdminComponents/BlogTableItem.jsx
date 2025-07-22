import { assets } from '@/Assets/assets'
import Image from 'next/image'
import React from 'react'
import { useRouter } from 'next/navigation'
import { EyeIcon, EyeOffIcon, TrashIcon } from '@heroicons/react/24/outline'
const BlogTableItem = ({ blog, fetchBlogs, index }) => {
    const router = useRouter();
    const isPublished = blog.isPublished;
    const BlogDate = blog.date ? new Date(blog.date) : null;

  const handlePublish = async () => {
    // Call your publish API here, then fetchBlogs()
  };
  const handleUnpublish = async () => {
    // Call your unpublish API here, then fetchBlogs()
  };
  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this blog?')) {
      // Call your delete API here, then fetchBlogs()
    }
  };
  return (
    <tr className='bg-white border-b'>
      <th scope='row' className='items-center gap-3 hidden sm:flex px-6 py-4 font-medium text-gray-900 whitespace-nowrap'>
        <Image width={40} height={40} src={blog.authorImg ? blog.authorImg : assets.profile_icon} alt={blog.author || 'author'} />
        <p>{blog.author || 'No author'}</p>
      </th>
      <td className='px-6 py-4'>
        {blog.title || 'no title'}
      </td>
      <td className='px-6 py-4'>
        {BlogDate && !isNaN(BlogDate) ? BlogDate.toLocaleDateString() : 'No date'}
      </td>
      <td className='px-6 py-4'>
        {/* You can add status logic here if needed */}
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
        {/* Actions, e.g., delete, edit, etc. */}
        <div className="flex gap-2">
          {isPublished ? (
            <button
              className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-xs"
              onClick={handleUnpublish}
            >
              <EyeOffIcon className="w-4 h-4" />
              Unpublish
            </button>
          ) : (
            <button
              className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs"
              onClick={handlePublish}
            >
              <EyeIcon className="w-4 h-4" />
              Publish
            </button>
          )}
          <button
            className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs"
            onClick={handleDelete}
          >
            <TrashIcon className="w-4 h-4" />
            Delete
          </button>
        </div>
      </td>
    </tr>
  )
}

export default BlogTableItem
