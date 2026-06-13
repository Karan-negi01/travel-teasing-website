'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const categories = [
  { id: 'all', label: 'All' },
  { id: 'travel-tips', label: 'Travel Tips' },
  { id: 'destination-guide', label: 'Destination Guides' },
  { id: 'trek-report', label: 'Trek Reports' },
  { id: 'spiritual', label: 'Spiritual' },
  { id: 'food-culture', label: 'Food & Culture' },
];

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    setLoading(true);
    const params = category !== 'all' ? `?category=${category}` : '';
    fetch(`/api/blogs${params}`).then(r => r.json()).then(d => { setBlogs(d.blogs || []); setLoading(false); }).catch(() => setLoading(false));
  }, [category]);

  return (
    <div className="pt-20">
      <div className="bg-gray-50 py-12">
        <div className="container-max text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-[#1a1a2e] mb-3">
            <em className="italic font-normal">Travel Stories</em> & Tips
          </h1>
          <p className="text-gray-500">Guides, trek reports, and travel inspiration from our team</p>
        </div>
      </div>

      <div className="container-max py-10">
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setCategory(cat.id)}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all ${category === cat.id ? 'bg-[#5bc1d5] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3].map(i => <div key={i} className="bg-gray-100 rounded-xl h-72 animate-pulse" />)}
          </div>
        ) : blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map(blog => (
              <Link key={blog.id} href={`/blog/${blog.slug}`} className="card overflow-hidden group">
                <div className="relative aspect-video overflow-hidden">
                  <Image src={blog.cover_image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600'} alt={blog.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="400px" />
                  {blog.category && (
                    <span className="absolute top-3 left-3 bg-[#5bc1d5] text-white text-xs px-2 py-1 rounded-full capitalize">
                      {blog.category.replace('-', ' ')}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <p className="text-gray-400 text-xs mb-2">{blog.published_at ? new Date(blog.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}</p>
                  <h3 className="font-bold text-[#1a1a2e] mb-2 leading-snug">{blog.title}</h3>
                  {blog.excerpt && <p className="text-gray-500 text-sm line-clamp-2">{blog.excerpt}</p>}
                  <span className="text-[#5bc1d5] text-sm font-semibold mt-3 inline-block">Read More →</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">No articles found in this category.</div>
        )}
      </div>
    </div>
  );
}
