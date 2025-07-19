import { assets } from '@/Assets/assets'
import Image from 'next/image'
import React from 'react'

const BlogTableItem = ({ blog, fetchBlogs, index }) => {
  // Use correct fields from the blog object
  const BlogDate = blog.date ? new Date(blog.date) : null;
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
        x
      </td>
      <td className='px-6 py-4'>
        {/* Actions, e.g., delete, edit, etc. */}
      </td>
    </tr>
  )
}

export default BlogTableItem
