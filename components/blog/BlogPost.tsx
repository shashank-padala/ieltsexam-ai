import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { BlogPost as BlogPostType } from "@/lib/markdown";

interface BlogPostProps {
    post: BlogPostType;
}

export default function BlogPost({ post }: BlogPostProps) {
    return (
        <main className="max-w-3xl mx-auto px-4 py-10 text-gray-900">
            <nav className="mb-8">
                <Link
                    href="/ielts-exam-tips"
                    className="text-gray-700 hover:text-blue-600 transition-all duration-200 px-3 py-2 rounded-md hover:bg-blue-50 font-medium inline-flex items-center"
                >
                    ← Back to IELTS Exam Tips
                </Link>
            </nav>

            <article className="prose prose-lg max-w-none">
                <header className="not-prose mb-8">
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                        <span>{post.categoryLabel}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                    <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                    <p className="text-lg text-gray-600">{post.excerpt}</p>
                </header>

                <div className="prose prose-lg prose-gray max-w-none">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>

                <div className="mt-12 not-prose">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-center text-base font-medium">
                        Want to practice more? Try our free IELTS writing & speaking tests → {" "}
                        <Link href="/ielts-mock-tests" className="underline">
                            Start Now
                        </Link>
                    </div>
                </div>
            </article>
        </main>
    );
} 