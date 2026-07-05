import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPostBySlug } from '../../utils/blog';
import SEOHead from '../../components/SEOHead';
import { ArrowLeft, Share2, Printer, Bookmark } from 'lucide-react';

const Post: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className="bg-white min-h-screen pb-24">
      <SEOHead
        title={`${post.title} | Blog Blue Ocean Xperience`}
        description={post.excerpt}
      />

      {/* Progress Bar (Visual only) */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-100 z-50">
        <div className="h-full bg-[#F34A0D] w-1/3"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        {/* Navigation & Actions */}
        <div className="flex items-center justify-between mb-12">
          <Link
            to="/blog"
            className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-[#F34A0D] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            TODOS OS ESTUDOS
          </Link>

          <div className="flex items-center gap-4 text-gray-400">
            <button className="hover:text-[#F34A0D] transition-colors"><Share2 className="w-5 h-5" /></button>
            <button className="hover:text-[#F34A0D] transition-colors"><Bookmark className="w-5 h-5" /></button>
            <button className="hover:text-[#F34A0D] transition-colors" onClick={() => window.print()}><Printer className="w-5 h-5" /></button>
          </div>
        </div>

        <header className="mb-16">
          <div className="inline-block px-3 py-1 bg-orange-50 text-[#F34A0D] text-xs font-bold rounded-full mb-6 tracking-widest uppercase">
            Estratégia de Oceano Azul
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-6xl tracking-tight leading-tight mb-8">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 border-y border-gray-100 py-6">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">X</div>
            <div>
              <p className="text-sm font-bold text-gray-900">Xperience Analyst</p>
              <p className="text-xs text-gray-500">Especialista em Estratégia de Negócios</p>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <article className="prose prose-lg prose-orange max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({...props}) => <h1 {...props} className="text-3xl font-black text-gray-900 border-b-2 border-orange-100 pb-4 mb-8 mt-12 uppercase tracking-tight" />,
              h2: ({...props}) => (
                <h2 {...props} className="text-2xl font-bold text-gray-800 mb-6 mt-12 flex items-center gap-3">
                  <span className="w-2 h-8 bg-[#F34A0D] rounded-sm"></span>
                  {props.children}
                </h2>
              ),
              h3: ({...props}) => <h3 {...props} className="text-xl font-bold text-orange-600 mb-4 mt-8" />,
              p: ({...props}) => <p {...props} className="text-gray-700 leading-relaxed mb-6 text-lg" />,
              ul: ({...props}) => <ul {...props} className="list-none space-y-4 mb-8 pl-0" />,
              li: ({...props}) => (
                <li {...props} className="flex items-start gap-4 text-gray-700 text-lg">
                  <span className="flex-shrink-0 w-2 h-2 mt-2.5 bg-orange-400 rounded-full"></span>
                  <span>{props.children}</span>
                </li>
              ),
              strong: ({...props}) => <strong {...props} className="font-bold text-gray-900" />,
              table: ({...props}) => (
                <div className="overflow-x-auto my-12 shadow-sm border border-gray-200 rounded-xl">
                  <table {...props} className="min-w-full divide-y divide-gray-200" />
                </div>
              ),
              thead: ({...props}) => <thead {...props} className="bg-gray-50" />,
              th: ({...props}) => <th {...props} className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest" />,
              td: ({...props}) => <td {...props} className="px-6 py-4 text-sm text-gray-600 border-t border-gray-100" />,
              blockquote: ({...props}) => (
                <blockquote {...props} className="border-l-4 border-[#F34A0D] pl-8 italic my-10 text-gray-600 bg-orange-50/30 py-8 pr-8 rounded-r-2xl text-xl font-medium" />
              ),
              a: ({...props}) => (
                <Link to={props.href || '#'} className="text-[#F34A0D] font-bold hover:underline decoration-2 underline-offset-4 transition-all">
                  {props.children}
                </Link>
              ),
              code: ({className, children, ...props}: any) => {
                const isMermaid = /language-mermaid/.test(className || '');
                if (isMermaid) {
                  return (
                    <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 my-10 overflow-x-auto text-center">
                      <pre className="text-xs text-gray-400 font-mono inline-block text-left mb-4">
                        {children}
                      </pre>
                      <div className="py-4 border-t border-gray-100">
                        <p className="text-sm font-bold text-orange-400 italic">Curva de Valor Estratégica</p>
                        <p className="text-[10px] text-gray-400 mt-1">Renderização visual via Xperience Graph Engine</p>
                      </div>
                    </div>
                  );
                }
                return <code {...props} className="bg-gray-100 text-[#F34A0D] px-2 py-0.5 rounded text-sm font-mono font-bold">{children}</code>;
              }
            }}
          >
            {post.content}
          </ReactMarkdown>
        </article>

        {/* Footer Navigation */}
        <div className="mt-24 pt-12 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-8">
          <Link
            to="/blog"
            className="group inline-flex items-center text-[#F34A0D] font-black text-sm tracking-widest uppercase"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Voltar para Listagem
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400 font-bold uppercase tracking-widest">Compartilhar:</span>
            <div className="flex gap-2">
               <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#F34A0D] hover:text-white transition-colors cursor-pointer text-gray-400"><Share2 className="w-4 h-4" /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
