// app/ielts-exam-tips/page.tsx
import Link from "next/link";
import { PillarCategories } from "@/components/ielts-exam-tips/blog-data";
import { getAllBlogPosts } from "@/lib/markdown";

export default function IELTSExamTipsPage() {
  const blogPosts = getAllBlogPosts();

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 text-gray-900">
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">IELTS Exam Tips & Guides</h1>
        <p className="text-lg text-gray-600">
          Master the IELTS with expert strategies, practice guides, and insider tips across all sections.
        </p>
      </section>

      {/* 🔷 Pillar Categories as Cards */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {PillarCategories.map((pillar) => (
          <Link key={pillar.slug} href={`/ielts-exam-tips/${pillar.slug}`}>
            <div className="rounded-xl border border-gray-200 p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">{pillar.title}</h3>
              <p className="text-gray-600 text-sm">{pillar.description}</p>
              <p className="mt-3 text-blue-600 font-medium">Explore ➝</p>
            </div>
          </Link>
        ))}
      </section>

      {/* 🕓 Recent Blog Posts */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Recent Posts</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.slice(0, 6).map((post) => (
            <Link key={post.slug} href={`/ielts-exam-tips/${post.category}/${post.slug}`}>
              <article className="rounded-lg border border-gray-200 p-5 hover:shadow-md transition bg-white">
                <p className="text-sm text-gray-500 mb-1">{post.categoryLabel} · {post.date}</p>
                <h3 className="text-lg font-semibold">{post.title}</h3>
                <p className="text-sm text-gray-600 mt-2 line-clamp-3">{post.excerpt}</p>
                <span className="text-blue-500 text-sm font-medium mt-3 inline-block">Read More →</span>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
