// /pages/Solutions/IAReports.tsx

import React from 'react';
import IAReport from "../../components/IAReport";

const IAReports: React.FC = () => {
  return (
    <div className="space-y-24"> 
      {/*
        Mapa do Seu Negócio
        - Imagem no lado esquerdo? Depende do layout do seu print.
        - Pelas imagens, parece que a imagem está do lado esquerdo e o texto à direita.
        - Se for isso, defina "imageLeft={true}" para imagem à esquerda; 
          "imageLeft={false}" para imagem à direita.
        - Ajuste conforme sua necessidade.
      */}
      <IAReport
        imageLeft={false} 
        title="Mapa do Seu Negócio"
        description="Um mapa mental automatizado que mostra:"
        bullets={[
          "Onde sua empresa está agora.",
          "Para onde ela pode ir."
        ]}
        buttonText="Solicitar mapa"
        imageSrc="https://via.placeholder.com/500?text=Mapa+do+Seu+Negocio" 
        imageAlt="Foto do Mapa do Seu Negócio"
      />

      {/*
        Relatório Xperience
      */}
      <IAReport
        imageLeft={true} 
        title="Relatório Xperience"
        description="Análise que utiliza o método Blue Ocean (Oceano azul) e é gerado pela nossa IA do Empreendedor para que você:"
        bullets={[
          "Identifique novas possibilidades e criar mercados inexplorados.",
          "Receba orientações direcionadas para o seu negócio."
        ]}
        buttonText="Solicitar relatório"
        imageSrc="https://via.placeholder.com/500?text=Relatorio+Xperience" 
        imageAlt="Foto Relatório Xperience"
      />

      {/*
        Relatório SEO
      */}
      <IAReport
        imageLeft={false}
        title="Relatório SEO"
        description="Uma forma de manter seu negócio conectado ao mundo digital, e obter:"
        bullets={[
          "Compartilhe fornecedores.",
          "Relatório de gestão de tráfego no Google e Facebook."
        ]}
        buttonText="Solicitar relatório"
        imageSrc="https://via.placeholder.com/500?text=Relatorio+SEO" 
        imageAlt="Foto Relatório SEO"
      />
    </div>
  );
};

export default IAReports;
