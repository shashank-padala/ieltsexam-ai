# IELTS Exam Tips & Resources 📚

A modern web platform providing comprehensive IELTS exam preparation resources, tips, and practice materials.

## About the Website 🌐

This website offers:
- Detailed IELTS exam tips and strategies
- Blog articles covering all IELTS sections
- Free IELTS writing & speaking practice tests
- User-friendly interface for easy navigation

## How to Publish a Blog Article 📝

### Step 1: Create Your Article File 📄
1. Go to the `_posts` folder
2. Create a new file with the format: `YYYY-MM-DD-article-title.md`
   Example: `2024-03-20-ielts-writing-tips.md`

### Step 2: Add Article Details ✍️
At the top of your file, add these details:
```markdown
---
title: "Your Article Title"
excerpt: "A brief description of your article (1-2 sentences)"
date: "2024-03-20"
category: "writing"
categoryLabel: "IELTS Writing"
---
```

### Step 3: Write Your Content 📖
- Write your article content below the details section
- Use markdown formatting:
  - `# ` for main headings
  - `## ` for subheadings
  - `- ` for bullet points
  - `**text**` for bold text
  - `*text*` for italic text

### Step 4: Add Images (Optional) 🖼️
1. Save your image in the `public/images/blog` folder
2. Reference it in your article using:
   ```markdown
   ![Description](/images/blog/your-image-name.jpg)
   ```

### Step 5: Preview & Publish 🚀
1. Save your file
2. The article will automatically appear in the correct category section
3. It will be sorted by date (newest first)

## Creating New Categories 📑

### Available Categories
Current categories include:
- `writing` (IELTS Writing)
- `speaking` (IELTS Speaking)
- `reading` (IELTS Reading)
- `listening` (IELTS Listening)
- `general` (General Tips)

### Adding a New Category 🆕
1. Choose a simple, lowercase category name (e.g., `grammar`)
2. Choose a display name (e.g., "IELTS Grammar")
3. Use these in your article's front matter:
   ```markdown
   ---
   category: "grammar"
   categoryLabel: "IELTS Grammar"
   ---
   ```
4. The website will automatically create a new category section

### Category Best Practices ✨
- Use short, descriptive category names
- Keep category names in lowercase
- Make sure categoryLabel is clear and user-friendly
- Stick to IELTS-related categories
- Avoid creating duplicate categories

## Need Help? 💡
Contact the development team for any technical assistance or questions about publishing articles.
