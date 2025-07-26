import BlogClient from './BlogClient';

// Generate metadata for each individual blog
export async function generateMetadata({ params }) {
  console.log('Generating metadata for slug:', params.id);
  
  try {
    // Get base URL with fallback
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000';
    console.log('Using base URL:', baseUrl);
    
    // Fetch blog data by slug using native fetch (server-side)
    const apiUrl = `${baseUrl}/api/blog/slug/${params.id}`;
    console.log('Fetching from:', apiUrl);
    
    const res = await fetch(apiUrl);
    
    if (!res.ok) {
      console.error('API response not ok:', res.status, res.statusText);
      throw new Error(`Failed to fetch blog: ${res.status}`);
    }
    
    const data = await res.json();
    console.log('API response data:', data);
    
    const blog = data.blog;

    if (!blog) {
      console.log('No blog found for slug:', params.id);
      return {
        title: 'Blog Not Found',
        description: 'This blog does not exist.',
      };
    }

    console.log('Generating metadata for blog:', blog.title);
    
    const metadata = {
      title: blog.title,
      description: blog.description?.replace(/<[^>]+>/g, '').slice(0, 160),
      openGraph: {
        title: blog.title,
        description: blog.description?.replace(/<[^>]+>/g, '').slice(0, 160),
        images: [blog.image],
        url: `${baseUrl}/blogs/${blog.slug}`,
        type: 'article',
        publishedTime: blog.createdAt,
        modifiedTime: blog.updatedAt,
        authors: [blog.author || 'Admin'],
        tags: blog.category ? [blog.category] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: blog.title,
        description: blog.description?.replace(/<[^>]+>/g, '').slice(0, 160),
        images: [blog.image],
        creator: '@yourhandle', // Replace with your Twitter handle
      },
      alternates: {
        canonical: `/blogs/${blog.slug}`,
      },
      keywords: blog.category ? [blog.category, 'blog', 'article'] : ['blog', 'article'],
      authors: [{ name: blog.author || 'Admin' }],
      slug: blog.slug, // Custom field for debugging or custom use
    };
    
    console.log('Generated metadata:', metadata);
    return metadata;
    
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Blog',
      description: 'Blog post',
    };
  }
}

export default function Page({ params }) {
  // Pass slug to BlogClient for client-side logic
  return <BlogClient slug={params.id} />;
}
