export interface BlogPost {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
}

// CRÍTICO PARA PRODUÇÃO: Utilizando caminhos relativos e sintaxe moderna para Vite Glob
// @ts-ignore
const modules = import.meta.glob('../../docs/blue-ocean/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
});

export const getPosts = (): BlogPost[] => {
  return Object.entries(modules).map(([path, content]) => {
    const slug = path.split('/').pop()?.replace('.md', '') || '';
    const rawContent = content as string;

    // Extrai o título do primeiro '#' encontrado
    const titleMatch = rawContent.match(/^#\s+(.*)$/m);
    let originalTitle = titleMatch ? titleMatch[1] : slug;

    const title = originalTitle
      .replace('Estudo de Caso Blue Ocean: ', '')
      .replace('Estudo de Caso Blue Ocean ', '')
      .replace('Estudo de Caso: ', '');

    // Remove a primeira linha (título) do conteúdo para evitar duplicação na página do post
    const contentLines = rawContent.split('\n');
    const cleanContent = contentLines[0].startsWith('#')
      ? contentLines.slice(1).join('\n').trim()
      : rawContent;

    // Extrai um resumo (excerpt) do texto (primeiras linhas que não são headers)
    const excerpt = cleanContent
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#') && !line.startsWith('!['))
      .slice(0, 3)
      .join(' ')
      .slice(0, 160) + '...';

    return {
      title,
      slug,
      content: cleanContent,
      excerpt
    };
  }).sort((a, b) => a.title.localeCompare(b.title));
};

export const getPostBySlug = (slug: string): BlogPost | undefined => {
  const posts = getPosts();
  return posts.find(p => p.slug === slug);
};
