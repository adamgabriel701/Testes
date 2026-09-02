import { getAllPosts, getPostBySlug, PostData } from '@/lib/posts';

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post: PostData = await getPostBySlug(slug);

  return (
    <article className="min-h-screen bg-[#0c0b09] text-[#f0ead6] pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto font-mono">
        <a href="/" className="text-[#f59e0b] text-sm mb-8 inline-block">← cd ..</a>
        <h1 className="text-4xl font-bold mb-4 text-[#f0ead6]">{post.title}</h1>
        <div className="text-[#8a8275] text-sm mb-12 border-b border-[rgba(240,234,214,0.08)] pb-4">
          {post.date} — {post.readTime} de leitura
        </div>
        
        <div className="prose prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
        </div>
      </div>
    </article>
  );
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}