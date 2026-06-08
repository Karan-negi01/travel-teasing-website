'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function BlogPostPage({ params }) {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    fetch(`/api/blogs/${params.slug}`).then(r => r.json()).then(d => {
      setBlog(d.blog);
      setLoading(false);
      if (d.blog?.category) {
        fetch(`/api/blogs?category=${d.blog.category}`).then(r => r.json()).then(rd => {
          setRelated((rd.blogs || []).filter(b => b.slug !== params.slug).slice(0, 3));
        });
      }
    }).catch(() => setLoading(false));
  }, [params.slug]);

  if (loading) return <div className="h-screen flex items-center justify-center pt-20"><div className="animate-spin w-10 h-10 border-4 border-[#E8651A] border-t-transparent rounded-full" /></div>;
  if (!blog) return <div className="h-screen flex items-center justify-center pt-20 text-gray-500">Article not found.</div>;

  return (
    <div className="pt-20">
      {/* Cover */}
      {blog.cover_image && (
        <div className="relative h-72 md:h-96 overflow-hidden">
          <Image src={blog.cover_image} alt={blog.title} fill className="object-cover" sizes="100vw" priority />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-0 left-0 right-0 p-8 container-max">
            {blog.category && (
              <span className="bg-[#E8651A] text-white text-xs px-3 py-1 rounded-full capitalize mb-3 inline-block">
                {blog.category.replace('-', ' ')}
              </span>
            )}
            <h1 className="text-2xl md:text-4xl font-bold text-white">{blog.title}</h1>
          </div>
        </div>
      )}

      <div className="container-max py-10">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-8 text-sm text-gray-500">
            <Link href="/blog" className="flex items-center gap-1 text-[#E8651A] hover:underline"><ArrowLeft size={16} /> All Articles</Link>
            <span>·</span>
            <span>{blog.author || 'Travel Teasing Team'}</span>
            <span>·</span>
            <span>{blog.published_at ? new Date(blog.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}</span>
          </div>

          {!blog.cover_image && <h1 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-6">{blog.title}</h1>}

          {blog.excerpt && <p className="text-gray-500 text-lg leading-relaxed mb-6 border-l-4 border-[#E8651A] pl-5 italic">{blog.excerpt}</p>}

          {blog.content ? (
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br/>').replace(/# (.*?)(<br\/>|$)/g, '<h2>$1</h2>').replace(/## (.*?)(<br\/>|$)/g, '<h3>$1</h3>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>') }} />
          ) : (
            <div className="text-gray-400 text-center py-12">Full article content coming soon.</div>
          )}

          <div className="mt-12 p-6 bg-[#fff8f3] rounded-2xl">
            <p className="font-bold text-[#1a1a2e] mb-2">Ready to plan your trip?</p>
            <p className="text-gray-500 text-sm mb-4">Talk to our travel experts and get a customized itinerary.</p>
            <a href="https://wa.me/916396464369?text=Hi! I read your article and want to plan a similar trip." target="_blank" rel="noopener noreferrer" className="btn-primary text-sm">WhatsApp Us Now</a>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map(b => (
                <Link key={b.id} href={`/blog/${b.slug}`} className="card overflow-hidden group">
                  {b.cover_image && <div className="relative aspect-video overflow-hidden"><Image src={b.cover_image} alt={b.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="300px" /></div>}
                  <div className="p-4">
                    <h3 className="font-bold text-[#1a1a2e] text-sm leading-snug line-clamp-2">{b.title}</h3>
                    <span className="text-[#E8651A] text-xs font-semibold mt-2 inline-block">Read →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
