import React from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../../utils/blog';
import SEOHead from '../../components/SEOHead';
import { BookOpen, ArrowRight } from 'lucide-react';

const Blog: React.FC = () => {
  const posts = getPosts();

  return (
    <div className="bg-white min-h-screen">
      <SEOHead
        title="Blog Blue Ocean - Estratégias de Mercado | Xperience"
        description="Explore nossos estudos de caso de estratégias de Oceano Azul. Aprenda como transformar mercados competitivos em oportunidades únicas."
        keywords="oceano azul, estratégia, inovação, empreendedorismo, estudos de caso, blue ocean"
      />

      {/* Hero Section */}
      <section className="bg-gray-50 py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-6xl tracking-tight">
            Blog <span className="text-[#F34A0D]">Blue Ocean</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Navegue por águas inexploradas. Analisamos diversos nichos de mercado para mostrar como a inovação de valor cria novos espaços de lucro.
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-[#F34A0D]/30 transition-all duration-300"
              >
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="p-1.5 bg-orange-50 rounded-lg text-[#F34A0D]">
                      <BookOpen className="w-4 h-4" />
                    </span>
                    <span className="text-sm font-bold text-[#F34A0D] uppercase tracking-wider">
                      Estudo de Caso
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#F34A0D] transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed mb-8 flex-1 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center text-[#F34A0D] font-bold text-sm group-hover:gap-2 transition-all">
                    Explorar Estratégia <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">Nenhum post encontrado.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
