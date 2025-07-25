import { assets } from '@/Assets/assets'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

// Utility function to sanitize image URLs
const cleanImageUrl = (url) => {
  if (!url) return '';
  // Removes any leading/trailing ( ) [ ] and whitespace
  return url.replace(/^[\[\(\s]+|[\]\)\s]+$/g, '');
}

const BlogItem = ({ title, description, category, image, slug }) => {
  // Clean the image URL before using it in <Image />
  const safeImage = cleanImageUrl(image);

  return (
    <div className='max-w-[330px] sm:max-w-[300px] bg-white border border-black transition-all hover:shadow-[-7px_7px_0px_#000000]'>
      <Link href={`/blogs/${slug}`}>
        <Image
          src={safeImage}
          alt={title || 'Blog Image'}
          width={400}
          height={400}
          className='border-b border-black'
        />
      </Link>
      <p className='ml-5 mt-5 px-1 inline-block bg-black text-white text-sm'>{category}</p>
      <div className="p-5">
        <h5 className='mb-2 text-lg font-medium tracking-tight text-gray-900'>{title}</h5>
        <p
          className='mb-3 text-sm tracking-tight text-gray-700'
          dangerouslySetInnerHTML={{ __html: description.slice(0, 120) }}
        ></p>
        <Link href={`/blogs/${slug}`} className='inline-flex items-center py-2 font-semibold text-center'>
          Read more
          <Image src={assets.arrow} className='ml-2' alt='' width={12} />
        </Link>
      </div>
    </div>
  )
}

export default BlogItem

