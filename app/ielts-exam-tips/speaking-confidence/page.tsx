// app/ielts-exam-tips/speaking-confidence/page.tsx
import Link from "next/link";
import { PillarCategories, BlogList } from "@/components/ielts-exam-tips/blog-data";

export default function SpeakingConfidencePage() {
  const slug = "speaking-confidence";
  const pillar = PillarCategories.find((p) => p.slug === slug)!;
  const posts = BlogList.filter((post) => post.category === slug);

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
            href={`/ielts-exam-tips/${slug}/${post.slug}`}
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
