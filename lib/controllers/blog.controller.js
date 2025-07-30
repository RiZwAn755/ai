import fs from 'fs';
import imagekit from '../config/imagekit.js';
import Blog from '../models/BlogModel.js';
import Comment from '../models/CommentModel.js';
import main from '../config/gemini.js';

// Helper function to slugify the blog title
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^a-z0-9\-]/g, '')    // Remove all non-alphanumeric chars except -
    .replace(/\-+/g, '-')           // Replace multiple - with single -
    .replace(/^-+/, '')              // Trim - from start of text
    .replace(/-+$/, '');             // Trim - from end of text
}

export const addBlog = async (req, res) => {
  try {
    // If using FormData, fields are in req.body, file in req.file
    const { title, description, category, author, authorImg, isPublished } = req.body;
    const imageFile = req.file;

    if (!title || !description || !category || !author || !authorImg || !imageFile) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    const fileBuffer = fs.readFileSync(imageFile.path);

    // Upload Image to ImageKit
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/blogs"
    });

    // Clean up temp file
    fs.unlinkSync(imageFile.path);

    // optimization through imagekit URL transformation
    const optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { quality: 'auto' },
        { format: 'webp' },
        { width: '1280' }
      ]
    });

    const image = optimizedImageUrl;
    const slug = slugify(title);

    await Blog.create({ title, description, category, author, authorImg, image, slug, isPublished: isPublished === 'true' });

    res.json({ success: true, message: "Blog added successfully" });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true }); // Only return published blogs for public API
    res.json({ success: true, blogs });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }
    res.json({ success: true, blog });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export const deleteBlogById = async (req, res) => {
  try {
    const { id } = req.body;
    await Blog.findByIdAndDelete(id);
    // Delete all comments associated with the blog
    await Comment.deleteMany({ blog: id });
    res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export const togglePublish = async (req, res) => {
  try {
    const { id } = req.body;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }
    blog.isPublished = !blog.isPublished;
    await blog.save();
    res.json({ success: true, message: 'Blog status updated' });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { blog, name, content } = req.body;
    await Comment.create({ blog, name, content });
    res.json({ success: true, message: 'Comment added for review' });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export const getBlogComments = async (req, res) => {
  try {
    const { blogSlug } = req.body;
    const blog = await Blog.findOne({ slug: blogSlug });
    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }
    const comments = await Comment.find({ blog: blog._id, isApproved: true }).sort({ createdAt: -1 });
    res.json({ success: true, comments });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export const generateContent = async (req, res) => {
  try {
    const { prompt } = req.body;
    const content = await main(prompt + ' Generate a blog content for this topic in simple text format');
    res.json({ success: true, content });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug, isPublished: true }); // Only return published blogs
    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }
    res.json({ success: true, blog });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};