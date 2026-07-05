export interface BlogPost {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
}

// @ts-ignore
const modules = import.meta.glob('/docs/blue-ocean/*.md', { as: 'raw', eager: true });

export const getPosts = (): BlogPost[] => {
  return Object.entries(modules).map(([path, content]) => {
    const slug = path.split('/').pop()?.replace('.md', '') || '';
    const rawContent = content as string;
    const titleMatch = rawContent.match(/^#\s+(.*)$/m);
    const title = titleMatch ? titleMatch[1] : slug;

    // Extract excerpt (first paragraph after title/headers)
    const excerpt = rawContent
      .split('\n')
      .filter(line => line.trim() && !line.startsWith('#'))
      .slice(0, 2)
      .join(' ')
      .slice(0, 150) + '...';

    return {
      title,
      slug,
      content: rawContent,
      excerpt
    };
  });
};

export const getPostBySlug = (slug: string): BlogPost | undefined => {
  const posts = getPosts();
  return posts.find(p => p.slug === slug);
};
