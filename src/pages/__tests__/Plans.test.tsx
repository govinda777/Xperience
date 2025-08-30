import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Plans from '../Plans';

// Mock dos componentes filhos
jest.mock('../../components/Plans/TypePlans', () => {
  return function MockTypePlans(props: any) {
    return (
      <div data-testid={`type-plans-${props.type}`}>
        <h3>{props.title}</h3>
        <p>{props.description}</p>
        <ul>
          {props.benefits.map((benefit: string, index: number) => (
            <li key={index}>{benefit}</li>
          ))}
        </ul>
      </div>
    );
  };
});

jest.mock('../../components/Plans/PlansTable', () => {
  return function MockPlansTable(props: any) {
    return (
      <div data-testid={`plans-table-${props.type}`}>
        <div>Type: {props.type}</div>
        <div>Plans count: {props.plans.length}</div>
        {props.plans.map((plan: any, index: number) => (
          <div key={index} data-testid={`plan-${plan.category}`}>
            <span>{plan.title}</span>
            <span>R$ {plan.price}</span>
            {plan.isRecomendad && <span>Recomendado</span>}
          </div>
        ))}
      </div>
    );
  };
});

jest.mock('../Plans/EnjoyTools', () => {
  return function MockEnjoyTools(props: any) {
    return (
      <div data-testid="enjoy-tools">
        <a href={props.link}>Enjoy Tools</a>
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

const renderPlans = () => {
  return render(
    <BrowserRouter>
      <Plans />
    </BrowserRouter>
  );
};

describe('Plans Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all main sections', () => {
    renderPlans();

    expect(screen.getByTestId('seo-head')).toBeInTheDocument();
    expect(screen.getByTestId('type-plans-MENTORIA')).toBeInTheDocument();
    expect(screen.getByTestId('type-plans-ENCUBADORA')).toBeInTheDocument();
    expect(screen.getByTestId('enjoy-tools')).toBeInTheDocument();
    expect(screen.getByTestId('contact-form')).toBeInTheDocument();
  });

  it('should render page header correctly', () => {
    renderPlans();

    expect(screen.getByText('Escolha o plano certo e veja seu negócio crescer')).toBeInTheDocument();
    expect(screen.getByText(/Além da nossa ferramenta/)).toBeInTheDocument();
    expect(screen.getByText(/gratuita/)).toBeInTheDocument();
  });

  it('should render TypePlans components with correct props', () => {
    renderPlans();

    const mentoriaType = screen.getByTestId('type-plans-MENTORIA');
    expect(mentoriaType).toHaveTextContent('Mentoria Individual');
    expect(mentoriaType).toHaveTextContent('Consultoria personalizada com nossos especialistas');
    expect(mentoriaType).toHaveTextContent('Mentoria individual');
    expect(mentoriaType).toHaveTextContent('Acompanhamento personalizado');

    const encubadoraType = screen.getByTestId('type-plans-ENCUBADORA');
    expect(encubadoraType).toHaveTextContent('Encubadora');
    expect(encubadoraType).toHaveTextContent('Processo completo de incubação de experiências');
    expect(encubadoraType).toHaveTextContent('Desenvolvimento completo');
  });

  it('should start with MENTORIA tab active', () => {
    renderPlans();

    const mentoriaButton = screen.getByText('Mentoria Individual');
    const encubadoraButton = screen.getByText('Encubadora');

    expect(mentoriaButton).toHaveClass('bg-[#F34A0D]', 'text-white');
    expect(encubadoraButton).toHaveClass('bg-gray-100', 'text-gray-600');
    expect(screen.getByTestId('plans-table-MENTORIA')).toBeInTheDocument();
  });

  it('should switch to ENCUBADORA tab when clicked', async () => {
    renderPlans();

    const encubadoraButton = screen.getByText('Encubadora');
    fireEvent.click(encubadoraButton);

    await waitFor(() => {
      expect(encubadoraButton).toHaveClass('bg-[#F34A0D]', 'text-white');
      expect(screen.getByTestId('plans-table-ENCUBADORA')).toBeInTheDocument();
    });
  });

  it('should switch back to MENTORIA tab when clicked', async () => {
    renderPlans();

    // Switch to ENCUBADORA first
    const encubadoraButton = screen.getByText('Encubadora');
    fireEvent.click(encubadoraButton);

    await waitFor(() => {
      expect(screen.getByTestId('plans-table-ENCUBADORA')).toBeInTheDocument();
    });

    // Switch back to MENTORIA
    const mentoriaButton = screen.getByText('Mentoria Individual');
    fireEvent.click(mentoriaButton);

    await waitFor(() => {
      expect(mentoriaButton).toHaveClass('bg-[#F34A0D]', 'text-white');
      expect(screen.getByTestId('plans-table-MENTORIA')).toBeInTheDocument();
    });
  });

  it('should render mentoring plans correctly', () => {
    renderPlans();

    const plansTable = screen.getByTestId('plans-table-MENTORIA');
    expect(plansTable).toHaveTextContent('Type: MENTORIA');
    expect(plansTable).toHaveTextContent('Plans count: 5');

    // Check for specific plans
    expect(screen.getByTestId('plan-START')).toBeInTheDocument();
    expect(screen.getByTestId('plan-ESSENCIAL')).toBeInTheDocument();
    expect(screen.getByTestId('plan-PRINCIPAL')).toBeInTheDocument();
    expect(screen.getByTestId('plan-AVANÇADA')).toBeInTheDocument();
    expect(screen.getByTestId('plan-PREMIUM')).toBeInTheDocument();

    // Check for recommended plan
    expect(screen.getByTestId('plan-PRINCIPAL')).toHaveTextContent('Recomendado');
  });

  it('should render incubator plans when tab is switched', async () => {
    renderPlans();

    const encubadoraButton = screen.getByText('Encubadora');
    fireEvent.click(encubadoraButton);

    await waitFor(() => {
      const plansTable = screen.getByTestId('plans-table-ENCUBADORA');
      expect(plansTable).toHaveTextContent('Type: ENCUBADORA');
      expect(plansTable).toHaveTextContent('Plans count: 5');
    });
  });

  it('should render plan prices correctly', () => {
    renderPlans();

    expect(screen.getByTestId('plan-START')).toHaveTextContent('R$ 1500');
    expect(screen.getByTestId('plan-ESSENCIAL')).toHaveTextContent('R$ 3000');
    expect(screen.getByTestId('plan-PRINCIPAL')).toHaveTextContent('R$ 6000');
    expect(screen.getByTestId('plan-AVANÇADA')).toHaveTextContent('R$ 10000');
    expect(screen.getByTestId('plan-PREMIUM')).toHaveTextContent('R$ 30000');
  });

  it('should render guarantee section', () => {
    renderPlans();

    expect(screen.getByText('Garantia de Satisfação')).toBeInTheDocument();
    expect(screen.getByText(/Se você não ficar satisfeito/)).toBeInTheDocument();
    expect(screen.getByText(/devolvemos seu dinheiro/)).toBeInTheDocument();
  });

  it('should render SEO metadata correctly', () => {
    renderPlans();

    const seoHead = screen.getByTestId('seo-head');
    expect(seoHead).toHaveTextContent('Planos de Mentoria e Encubadora | Xperience');
    expect(seoHead.querySelector('meta[name="description"]')).toHaveAttribute(
      'content',
      'Escolha o plano ideal para seu negócio. Mentoria individual ou programa de encubadora com consultoria personalizada e ferramentas inovadoras.'
    );
  });

  it('should render contact form with correct props', () => {
    renderPlans();

    const contactForm = screen.getByTestId('contact-form');
    expect(contactForm).toHaveTextContent('Contact Form - Page: false');
  });

  it('should render enjoy tools section', () => {
    renderPlans();

    const enjoyTools = screen.getByTestId('enjoy-tools');
    expect(enjoyTools).toBeInTheDocument();
    expect(enjoyTools.querySelector('a')).toHaveAttribute('href', '#');
  });

  it('should handle tab state changes correctly', async () => {
    renderPlans();

    // Initial state
    expect(screen.getByText('Programa Xperience - Mentoria Individual')).toBeInTheDocument();

    // Switch to ENCUBADORA
    fireEvent.click(screen.getByText('Encubadora'));

    await waitFor(() => {
      expect(screen.getByText('Programa Xperience - Encubadora')).toBeInTheDocument();
    });

    // Switch back to MENTORIA
    fireEvent.click(screen.getByText('Mentoria Individual'));

    await waitFor(() => {
      expect(screen.getByText('Programa Xperience - Mentoria Individual')).toBeInTheDocument();
    });
  });
});
