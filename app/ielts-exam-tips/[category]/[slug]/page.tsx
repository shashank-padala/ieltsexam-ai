import { getBlogPostBySlug } from "@/lib/markdown";
import BlogPost from "@/components/blog/BlogPost";

export default async function BlogPostPage({
    params,
}: {
    params: { category: string; slug: string };
}) {
    const post = await getBlogPostBySlug(params.slug);
    if (!post) {
        throw new Error(`Blog post not found: ${params.slug}`);
    }
    return <BlogPost post={post} />;
} 