import Link from 'next/link';
import { blogArticles, getArticleBySlug } from '@/data/blog';
import { ArrowLeft } from 'lucide-react';

export function generateStaticParams() {
  return blogArticles.map((article) => ({ slug: article.slug }));
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100">
        <div className="text-center">
          <p className="text-4xl mb-4">😢</p>
          <p className="text-gray-600 mb-4">文章不存在</p>
          <Link href="/blog" className="text-pink-500 hover:underline text-sm">
            返回文章列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-pink-500 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          返回攻略列表
        </Link>

        <article className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-white/40 p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {article.title}
          </h1>
          <div className="max-w-none">
            {article.content.split('\n\n').map((paragraph, i) => (
              <p
                key={i}
                className="text-gray-700 leading-relaxed mb-4 text-[15px]"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </article>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-400 to-purple-400 text-white font-medium shadow-md hover:shadow-lg transition-all hover:scale-[1.02]"
          >
            去哄哄 TA 💕
          </Link>
        </div>
      </div>
    </div>
  );
}
