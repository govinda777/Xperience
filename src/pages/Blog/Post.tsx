import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPostBySlug } from '../../utils/blog';
import SEOHead from '../../components/SEOHead';
import { ArrowLeft, Clock, Tag } from 'lucide-react';

const Post: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      <SEOHead
        title={`${post.title} | Xperience Blog`}
        description={post.excerpt}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <Link
          to="/blog"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#F34A0D] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para o blog
        </Link>

        <header className="mb-12">
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              Estudo de Caso
            </span>
            <span className="flex items-center">
              <Tag className="w-4 h-4 mr-1" />
              Blue Ocean
            </span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl tracking-tight">
            {post.title}
          </h1>
        </header>

        <div className="prose prose-orange max-w-none shadow-sm border border-gray-100 rounded-2xl p-8 md:p-12 bg-white">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({node, ...props}) => <h1 {...props} className="text-3xl font-extrabold text-gray-900 border-b border-orange-100 pb-2 mb-4 mt-6" />,
              h2: ({node, ...props}) => (
                <h2 {...props} className="text-2xl font-bold text-gray-800 mb-3 mt-8 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-orange-500 rounded-full inline-block"></span>
                  {props.children}
                </h2>
              ),
              h3: ({node, ...props}) => <h3 {...props} className="text-xl font-bold text-orange-700 mb-2 mt-6" />,
              p: ({node, ...props}) => <p {...props} className="text-gray-700 leading-relaxed mb-4 text-lg" />,
              ul: ({node, ...props}) => <ul {...props} className="list-none space-y-3 mb-6 pl-1" />,
              li: ({node, ...props}) => (
                <li {...props} className="flex items-start gap-3 text-gray-700 text-lg">
                  <span className="text-orange-500 mt-2 text-xs">◆</span>
                  <span>{props.children}</span>
                </li>
              ),
              strong: ({node, ...props}) => <strong {...props} className="font-semibold text-orange-950 bg-orange-50 px-1 rounded" />,
              table: ({node, ...props}) => (
                <div className="overflow-x-auto my-8">
                  <table {...props} className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg" />
                </div>
              ),
              th: ({node, ...props}) => <th {...props} className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />,
              td: ({node, ...props}) => <td {...props} className="px-6 py-4 whitespace-normal text-sm text-gray-500 border-t border-gray-200" />,
              blockquote: ({node, ...props}) => (
                <blockquote {...props} className="border-l-4 border-orange-500 pl-4 italic my-6 text-gray-600 bg-orange-50 py-4 pr-4 rounded-r-lg" />
              ),
              code: ({node, className, children, ...props}: any) => {
                const isMermaid = /language-mermaid/.test(className || '');
                if (isMermaid) {
                  return (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 my-6 overflow-x-auto">
                      <pre className="text-xs text-gray-600">
                        {children}
                      </pre>
                      <p className="text-[10px] text-gray-400 mt-2 italic text-center">Gráfico Mermaid (Renderização em breve)</p>
                    </div>
                  );
                }
                return <code {...props} className="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>;
              }
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        <div className="mt-16 border-t border-gray-100 pt-8 flex justify-between items-center">
          <Link
            to="/blog"
            className="text-[#F34A0D] font-bold hover:underline flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Ver outros estudos de caso
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Post;
