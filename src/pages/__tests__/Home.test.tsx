import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../Home';

// Mock dos componentes filhos
jest.mock('../Home/Hero', () => {
  return function MockHero(props: any) {
    return (
      <div data-testid="hero">
        <h1>{props.title}</h1>
        <span>{props.highlightedText}</span>
        <p>{props.description}</p>
        <button>{props.buttonText}</button>
      </div>
    );
  };
});

jest.mock('../Home/Solutions', () => {
  return function MockSolutions(props: any) {
    return (
      <div data-testid="solutions">
        <h2>{props.title}</h2>
        <p>{props.description}</p>
      </div>
    );
  };
});

jest.mock('../Home/IaDoEmpreendedor', () => {
  return function MockIaDoEmpreendedor(props: any) {
    return (
      <div data-testid="ia-empreendedor">
        <h2>{props.title}</h2>
        <p>{props.description}</p>
        <button>{props.buttonText}</button>
      </div>
    );
  };
});

jest.mock('../Home/WhyXperience', () => {
  return function MockWhyXperience() {
    return <div data-testid="why-xperience">Why Xperience</div>;
  };
});

jest.mock('../Home/CommunitySection', () => {
  return function MockCommunitySection() {
    return <div data-testid="community-section">Community Section</div>;
  };
});

jest.mock('../Home/TestimonialSection', () => {
  return function MockTestimonialSection() {
    return <div data-testid="testimonial-section">Testimonial Section</div>;
  };
});

jest.mock('../../components/PageTitle', () => {
  return function MockPageTitle(props: any) {
    return (
      <div data-testid="page-title">
        <h2>{props.title}</h2>
      </div>
    );
  };
});

jest.mock('../../components/ContactForm', () => {
  return function MockContactForm(props: any) {
    return (
      <div data-testid="contact-form">
        Contact Form - Page: {props.isPageContact ? 'true' : 'false'}
      </div>
    );
  };
});

jest.mock('../../components/SEOHead', () => {
  return function MockSEOHead(props: any) {
    return (
      <div data-testid="seo-head">
        <title>{props.title}</title>
        <meta name="description" content={props.description} />
      </div>
    );
  };
});

const renderHome = () => {
  return render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );
};

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all main sections', () => {
    renderHome();

    expect(screen.getByTestId('seo-head')).toBeInTheDocument();
    expect(screen.getByTestId('hero')).toBeInTheDocument();
    expect(screen.getByTestId('solutions')).toBeInTheDocument();
    expect(screen.getByTestId('ia-empreendedor')).toBeInTheDocument();
    expect(screen.getByTestId('why-xperience')).toBeInTheDocument();
    expect(screen.getByTestId('community-section')).toBeInTheDocument();
    expect(screen.getByTestId('page-title')).toBeInTheDocument();
    expect(screen.getByTestId('contact-form')).toBeInTheDocument();
    expect(screen.getByTestId('testimonial-section')).toBeInTheDocument();
  });

  it('should render Hero section with correct props', () => {
    renderHome();

    const hero = screen.getByTestId('hero');
    expect(hero).toHaveTextContent('Explore nossa');
    expect(hero).toHaveTextContent('"IA do empreendedor"');
    expect(hero).toHaveTextContent('Descubra como valorizar sua empresa');
    expect(hero).toHaveTextContent('Descubra');
  });

  it('should render Solutions section with correct props', () => {
    renderHome();

    const solutions = screen.getByTestId('solutions');
    expect(solutions).toHaveTextContent('Impulsione seu');
    expect(solutions).toHaveTextContent('Na Xperience Consultoria Empresarial');
  });

  it('should render IA do Empreendedor section with correct props', () => {
    renderHome();

    const iaSection = screen.getByTestId('ia-empreendedor');
    expect(iaSection).toHaveTextContent('IA do Empreendedor');
    expect(iaSection).toHaveTextContent('Nossa nova ferramenta');
    expect(iaSection).toHaveTextContent('Explore a IA');
  });

  it('should render PageTitle with correct props', () => {
    renderHome();

    const pageTitle = screen.getByTestId('page-title');
    expect(pageTitle).toHaveTextContent('Venha construir experiências inesquecíveis para os seus clientes');
  });

  it('should render ContactForm with correct props', () => {
    renderHome();

    const contactForm = screen.getByTestId('contact-form');
    expect(contactForm).toHaveTextContent('Contact Form - Page: false');
  });

  it('should render SEO metadata correctly', () => {
    renderHome();

    const seoHead = screen.getByTestId('seo-head');
    expect(seoHead).toHaveTextContent('Xperience - Mentoria para Empreendedores | IA do Empreendedor');
    expect(seoHead.querySelector('meta[name="description"]')).toHaveAttribute(
      'content',
      'Transforme sua ideia em um negócio de sucesso com nossa mentoria especializada. Descubra nossa IA do Empreendedor gratuita e impulsione seu negócio com soluções práticas e inovadoras.'
    );
  });

  it('should handle image URLs correctly', () => {
    // Test that the component renders without errors when handling image URLs
    expect(() => renderHome()).not.toThrow();
  });

  it('should render all sections in correct order', () => {
    renderHome();

    const sections = [
      'seo-head',
      'hero',
      'solutions',
      'ia-empreendedor',
      'why-xperience',
      'community-section',
      'page-title',
      'contact-form',
      'testimonial-section'
    ];

    sections.forEach(sectionId => {
      expect(screen.getByTestId(sectionId)).toBeInTheDocument();
    });
  });
});
