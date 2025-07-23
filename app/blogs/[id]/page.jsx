'use client'
import { assets } from '@/Assets/assets';
import Footer from '@/Components/Footer';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const Page = ({ params }) => {
  const [data, setData] = useState(null);
  const [comments, setComments] = useState([]);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch blog data
  const fetchBlogData = async () => {
    const response = await axios.get('/api/blog', {
      params: { id: params.id }
    });
    setData(response.data);
  };

  // Fetch comments
  const fetchComments = async () => {
    const res = await axios.post('/api/blog/comments', { blogId: params.id });
    if (res.data.success) setComments(res.data.comments);
  };

  // Add comment
  const addComment = async (e) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await axios.post('/api/blog/add-comment', {
        blog: data._id,
        name,
        content,
      });
      if (res.data.success) {
        setName('');
        setContent('');
        fetchComments();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchBlogData();
    fetchComments();
    // eslint-disable-next-line
  }, []);

  return (data ? (
    <>
      <div className='bg-gray-200 py-5 px-5 md:px-12 lg:px-28'>
        <div className='flex justify-between items-center'>
          <Link href='/'>
            <Image src={assets.logo} width={180} alt='' className='w-[130px] sm:w-auto' />
          </Link>
          <button className='flex items-center gap-2 font-medium py-1 px-3 sm:py-3 sm:px-6 border border-black shadow-[-7px_7px_0px_#000000]'>
            Get started <Image src={assets.arrow} alt='' />
          </button>
        </div>
        <div className='text-center my-24'>
          <h1 className='text-2xl sm:text-5xl font-semibold max-w-[700px] mx-auto'>{data.title}</h1>
          <Image className='mx-auto mt-6 border border-white rounded-full' src={data.authorImg} width={60} height={60} alt='' />
          <p className='mt-1 pb-2 text-lg max-w-[740px] mx-auto'>{data.author}</p>
        </div>
      </div>
      <div className='mx-5 max-w-[800px] md:mx-auto mt-[-100px] mb-10'>
        <Image className='border-4 border-white' src={data.image} width={800} height={480} alt='' />
        <div className='blog-content' dangerouslySetInnerHTML={{__html:data.description}} />
        {/* Comments Section */}
        <div className="max-w-2xl mx-auto my-16">
          <h2 className="text-2xl font-bold mb-4">Comments ({comments.length})</h2>
          <div className="space-y-4 mb-8">
            {comments.length === 0 && <div className="text-gray-500">No comments yet.</div>}
            {comments.map((c) => (
              <div key={c._id} className="bg-white p-4 rounded shadow">
                <div className="font-semibold">{c.name}</div>
                <div className="text-gray-600">{c.content}</div>
                <div className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
          <form onSubmit={addComment} className="bg-white p-4 rounded shadow space-y-4">
            <input
              className="w-full border px-3 py-2 rounded"
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            <textarea
              className="w-full border px-3 py-2 rounded"
              placeholder="Your comment"
              value={content}
              onChange={e => setContent(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        </div>
        {/* Share Section */}
        <div className='my-24'>
          <p className='text-black font font-semibold my-4'>Share this article on social media</p>
          <div className='flex'>
            <Image src={assets.facebook_icon} width={50} alt='' />
            <Image src={assets.twitter_icon} width={50} alt='' />
            <Image src={assets.googleplus_icon} width={50} alt='' />
          </div>
        </div>
      </div>
      <Footer />
    </>
  ) : <></>);
};

export default Page;