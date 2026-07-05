import React from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../../utils/blog';
import SEOHead from '../../components/SEOHead';

const Blog: React.FC = () => {
  const posts = getPosts();

  return (
    <div className="bg-white min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <SEOHead
        title="Blog - Estratégias de Oceano Azul | Xperience"
        description="Explore nossos estudos de caso de estratégias de Oceano Azul para diversos nichos de mercado."
        keywords="oceano azul, estratégia, empreendedorismo, estudos de caso"
      />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Blog <span className="text-[#F34A0D]">Blue Ocean</span>
          </h1>
          <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
            Descubra como transformar mercados competitivos em oportunidades únicas através de estratégias inovadoras.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105 bg-gray-50 border border-gray-100"
            >
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#F34A0D]">
                    Estudo de Caso
                  </p>
                  <div className="block mt-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-base text-gray-500">
                      {post.excerpt}
                    </p>
                  </div>
                </div>
                <div className="mt-6">
                  <span className="text-[#F34A0D] font-semibold text-sm hover:underline">
                    Ler mais →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
