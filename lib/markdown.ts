import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export interface BlogPost {
	title: string;
	slug: string;
	category: string;
	categoryLabel: string;
	date: string;
	excerpt: string;
	content: string;
}

export function getAllBlogPosts(): BlogPost[] {
	const postsDirectory = path.join(process.cwd(), "content/ielts-exam-tips");
	const categories = fs.readdirSync(postsDirectory);

	const allPosts: BlogPost[] = [];

	for (const category of categories) {
		const categoryPath = path.join(postsDirectory, category);
		const files = fs.readdirSync(categoryPath);

		for (const file of files) {
			if (file.endsWith(".md")) {
				const filePath = path.join(categoryPath, file);
				const fileContents = fs.readFileSync(filePath, "utf8");
				const { data, content } = matter(fileContents);

				allPosts.push({
					...data,
					content,
				} as BlogPost);
			}
		}
	}

	// Sort posts by date, newest first
	return allPosts.sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
	);
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
	const posts = getAllBlogPosts();
	return posts.find((post) => post.slug === slug) || null;
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
	const posts = getAllBlogPosts();
	return posts.filter((post) => post.category === category);
}
