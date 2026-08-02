import Link from 'next/link';
import { blogArticles } from '@/data/blog';
import { ArrowLeft, BookOpen } from 'lucide-react';

export default function BlogListPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-pink-500 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </Link>

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 mb-4">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            恋爱攻略
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            哄人之前先充充电，这些技巧帮你事半功倍
          </p>
        </div>

        <div className="space-y-4">
          {blogArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="block group"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/40 hover:shadow-md hover:border-pink-200 transition-all group-hover:scale-[1.01]">
                <h2 className="text-lg font-bold text-gray-800 group-hover:text-pink-600 transition-colors mb-2">
                  {article.title}
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {article.summary}
                </p>
                <div className="mt-3 text-xs text-pink-400 font-medium">
                  阅读全文 →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
