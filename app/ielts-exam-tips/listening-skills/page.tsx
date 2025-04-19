// app/ielts-exam-tips/listening-skills/page.tsx
import Link from "next/link";
import { PillarCategories } from "@/components/ielts-exam-tips/blog-data";
import { getBlogPostsByCategory } from "@/lib/markdown";
import { notFound } from "next/navigation";

export default function ListeningSkillsPage() {
  const slug = "listening-skills";
  const pillar = PillarCategories.find((p) => p.slug === slug);
  const posts = getBlogPostsByCategory(slug);

  if (!pillar) {
    notFound();
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 text-gray-900">
      <nav className="text-sm mb-4">
        <Link href="/ielts-exam-tips" className="text-blue-600 hover:underline">
          ← Back to IELTS Exam Tips
        </Link>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{pillar.title}</h1>
        <p className="text-gray-600">{pillar.description}</p>
      </header>

      <section className="grid sm:grid-cols-2 gap-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/ielts-exam-tips/${post.category}/${post.slug}`}
            className="block rounded-lg border border-gray-200 p-5 hover:shadow-md transition bg-white"
          >
            <p className="text-sm text-gray-500 mb-1">{post.date}</p>
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-600 text-sm line-clamp-3">{post.excerpt}</p>
            <span className="mt-3 text-blue-600 font-medium inline-block">Read More →</span>
          </Link>
        ))}
      </section>
    </main>
  );
}
