import { getBlogPostsByCategory } from "@/lib/markdown";
import Link from "next/link";
import { notFound } from "next/navigation";

interface CategoryPageProps {
    params: {
        category: string;
    };
}

export default function CategoryPage({ params }: CategoryPageProps) {
    const posts = getBlogPostsByCategory(params.category);

    if (posts.length === 0) {
        notFound();
    }

    return (
        <main className="max-w-6xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-8">
                {posts[0].categoryLabel} Tips & Guides
            </h1>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <Link key={post.slug} href={`/ielts-exam-tips/${post.category}/${post.slug}`}>
                        <article className="rounded-lg border border-gray-200 p-5 hover:shadow-md transition bg-white">
                            <p className="text-sm text-gray-500 mb-1">{post.date}</p>
                            <h3 className="text-lg font-semibold">{post.title}</h3>
                            <p className="text-sm text-gray-600 mt-2 line-clamp-3">{post.excerpt}</p>
                            <span className="text-blue-500 text-sm font-medium mt-3 inline-block">Read More →</span>
                        </article>
                    </Link>
                ))}
            </div>
        </main>
    );
} 