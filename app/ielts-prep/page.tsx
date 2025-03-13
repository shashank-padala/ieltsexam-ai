import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';

export default async function IELTSPrepPage() {
  // Read the Markdown file from the ielts_prep folder
  const filePath = path.join(process.cwd(), 'ielts_content', 'index.md');
  const fileContents = await fs.readFile(filePath, 'utf8');
  const { content } = matter(fileContents);

  return (
    <div className="container mx-auto px-4 py-8">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
