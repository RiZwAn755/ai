"use client";
import { assets } from '@/Assets/assets';
import Footer from '@/Components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const BlogClient = ({ slug }) => {
  const [data, setData] = useState(null);
  const [comments, setComments] = useState([]);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Email subscription state variables
  const [email, setEmail] = useState('');
  const inputRef = useRef(null);

  // Fetch blog data
  const fetchBlogData = async () => {
    if (!slug) return;
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/slug/${slug}`);
      setData(response.data.blog);
    } catch (error) {
      console.error('Error fetching blog data:', error);
    }
  };

  // Fetch comments
  const fetchComments = async () => {
    if (!slug) return;
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/comments`, { blogSlug: slug });
      if (res.data.success) setComments(res.data.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  // Add comment
  const addComment = async (e) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/add-comment`, {
        blog: data._id,
        name,
        content,
      });
      if (res.data.success) {
        setName('');
        setContent('');
        fetchComments();
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Social share handler with enhanced metadata
  const handleSocialShare = (platform) => {
    if (!data) return;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const url = encodeURIComponent(`${baseUrl}/blogs/${slug}`);
    const title = encodeURIComponent(data.title);
    const description = encodeURIComponent(
      data.description?.replace(/<[^>]+>/g, '').slice(0, 160) || ''
    );
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}&hashtags=blog,article`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'googleplus':
        shareUrl = `https://plus.google.com/share?url=${url}`;
        break;
      default:
        return;
    }
    window.open(
      shareUrl,
      'share-dialog',
      'width=600,height=500,resizable=yes,scrollbars=yes'
    );
  };

  // Email subscription handler
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email);
    try {
      const response = await axios.post('/api/email', formData);
      if (response.data.success) {
        toast.success(response.data.msg);
        setEmail("");
        if (inputRef.current) {
          inputRef.current.value = '';
        }
      } else {
        toast.error("Error");
      }
    } catch (error) {
      toast.error("Error occurred while subscribing");
    }
  };

  const onClear = () => {
    setEmail('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  useEffect(() => {
    if (slug) {
      fetchBlogData();
      fetchComments();
    }
    // eslint-disable-next-line
  }, [slug]);

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
        {/* Email Subscription Section */}
        <div className="max-w-2xl mx-auto my-16">
          <h3 className="text-xl font-semibold mb-4">Subscribe to our newsletter</h3>
          {/* Email subscription form */}
          <form 
            onSubmit={onSubmitHandler} 
            className='flex justify-between max-w-xl mx-auto border border-gray-200 bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 focus-within:shadow-lg focus-within:border-[#5044E5]/50'
          >
            <input 
              ref={inputRef}
              onChange={(e) => setEmail(e.target.value)} 
              value={email} 
              type="email" 
              placeholder='Enter your email' 
              required 
              className='w-full px-5 py-3 outline-none placeholder-gray-400 text-gray-700'
            />
            <button 
              type="submit" 
              className='bg-gradient-to-r from-[#5044E5] to-[#5044E5] text-white px-6 py-3 font-medium hover:opacity-90 transition-opacity duration-200 flex items-center'
            >
              Subscribe
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </button>
          </form>
          {/* Clear button */}
          {email && (
            <div className='mt-4'>
              <button 
                onClick={onClear} 
                className='inline-flex items-center text-sm text-gray-500 hover:text-[#5044E5] transition-colors duration-200'
              >
                Clear email
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
        {/* Share Section */}
        <div className='my-24'>
          <p className='text-black font-semibold my-4'>Share this article on social media</p>
          <div className='flex gap-2'>
            {/* Facebook Share */}
            <button
              onClick={() => handleSocialShare('facebook')}
              className="hover:opacity-80 transition-opacity cursor-pointer"
              title="Share on Facebook"
            >
              <Image src={assets.facebook_icon} width={50} alt='Share on Facebook' />
            </button>
            {/* Twitter Share */}
            <button
              onClick={() => handleSocialShare('twitter')}
              className="hover:opacity-80 transition-opacity cursor-pointer"
              title="Share on Twitter"
            >
              <Image src={assets.twitter_icon} width={50} alt='Share on Twitter' />
            </button>
            {/* LinkedIn Share */}
            <button
              onClick={() => handleSocialShare('linkedin')}
              className="hover:opacity-80 transition-opacity cursor-pointer"
              title="Share on LinkedIn"
            >
              <Image src={assets.linkedin_icon} width={50} alt='Share on LinkedIn' />
            </button>
            {/* Google Plus Share */}
            <button
              onClick={() => handleSocialShare('googleplus')}
              className="hover:opacity-80 transition-opacity cursor-pointer"
              title="Share on Google Plus"
            >
              <Image src={assets.googleplus_icon} width={50} alt='Share on Google Plus' />
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  ) : <div>Loading...</div>);
};

export default BlogClient; 