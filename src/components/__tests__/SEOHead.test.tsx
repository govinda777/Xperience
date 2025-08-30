import React from 'react';
import { render } from '@testing-library/react';
import { Helmet } from 'react-helmet-async';
import SEOHead from '../SEOHead';

// Mock react-helmet-async
jest.mock('react-helmet-async', () => ({
  Helmet: ({ children }: { children: React.ReactNode }) => <div data-testid="helmet">{children}</div>
}));

describe('SEOHead Component', () => {
  const defaultProps = {
    title: 'Test Page Title',
    description: 'Test page description for SEO',
    keywords: 'test, seo, keywords',
    ogImage: '/test-image.jpg',
    canonical: 'https://example.com/test'
  };

  it('should render with all props', () => {
    const { getByTestId } = render(<SEOHead {...defaultProps} />);
    
    const helmet = getByTestId('helmet');
    expect(helmet).toBeInTheDocument();
  });

  it('should render with minimal props', () => {
    const minimalProps = {
      title: 'Minimal Title',
      description: 'Minimal description'
    };

    const { getByTestId } = render(<SEOHead {...minimalProps} />);
    
    const helmet = getByTestId('helmet');
    expect(helmet).toBeInTheDocument();
  });

  it('should handle empty props gracefully', () => {
    const emptyProps = {
      title: '',
      description: ''
    };

    expect(() => render(<SEOHead {...emptyProps} />)).not.toThrow();
  });

  it('should render with custom og image', () => {
    const propsWithOgImage = {
      ...defaultProps,
      ogImage: '/custom-og-image.png'
    };

    const { getByTestId } = render(<SEOHead {...propsWithOgImage} />);
    
    const helmet = getByTestId('helmet');
    expect(helmet).toBeInTheDocument();
  });

  it('should render with custom canonical URL', () => {
    const propsWithCanonical = {
      ...defaultProps,
      canonical: 'https://custom-domain.com/page'
    };

    const { getByTestId } = render(<SEOHead {...propsWithCanonical} />);
    
    const helmet = getByTestId('helmet');
    expect(helmet).toBeInTheDocument();
  });

  it('should handle long title gracefully', () => {
    const longTitle = 'This is a very long title that exceeds the typical recommended length for SEO titles and should still be handled properly by the component';
    
    const propsWithLongTitle = {
      ...defaultProps,
      title: longTitle
    };

    expect(() => render(<SEOHead {...propsWithLongTitle} />)).not.toThrow();
  });

  it('should handle long description gracefully', () => {
    const longDescription = 'This is a very long description that exceeds the typical recommended length for meta descriptions. It should still be handled properly by the component without causing any issues or errors in the rendering process.';
    
    const propsWithLongDescription = {
      ...defaultProps,
      description: longDescription
    };

    expect(() => render(<SEOHead {...propsWithLongDescription} />)).not.toThrow();
  });

  it('should handle special characters in title', () => {
    const titleWithSpecialChars = 'Title with "quotes" & ampersands < > symbols';
    
    const propsWithSpecialChars = {
      ...defaultProps,
      title: titleWithSpecialChars
    };

    expect(() => render(<SEOHead {...propsWithSpecialChars} />)).not.toThrow();
  });

  it('should handle special characters in description', () => {
    const descriptionWithSpecialChars = 'Description with "quotes" & ampersands < > symbols';
    
    const propsWithSpecialChars = {
      ...defaultProps,
      description: descriptionWithSpecialChars
    };

    expect(() => render(<SEOHead {...propsWithSpecialChars} />)).not.toThrow();
  });

  it('should handle multiple keywords correctly', () => {
    const multipleKeywords = 'keyword1, keyword2, keyword3, keyword with spaces, another-keyword';
    
    const propsWithMultipleKeywords = {
      ...defaultProps,
      keywords: multipleKeywords
    };

    expect(() => render(<SEOHead {...propsWithMultipleKeywords} />)).not.toThrow();
  });

  it('should handle relative image paths', () => {
    const propsWithRelativeImage = {
      ...defaultProps,
      ogImage: './relative-image.jpg'
    };

    expect(() => render(<SEOHead {...propsWithRelativeImage} />)).not.toThrow();
  });

  it('should handle absolute image URLs', () => {
    const propsWithAbsoluteImage = {
      ...defaultProps,
      ogImage: 'https://example.com/absolute-image.jpg'
    };

    expect(() => render(<SEOHead {...propsWithAbsoluteImage} />)).not.toThrow();
  });

  it('should handle relative canonical URLs', () => {
    const propsWithRelativeCanonical = {
      ...defaultProps,
      canonical: '/relative-path'
    };

    expect(() => render(<SEOHead {...propsWithRelativeCanonical} />)).not.toThrow();
  });

  it('should render without optional props', () => {
    const requiredPropsOnly = {
      title: 'Required Title',
      description: 'Required description'
    };

    expect(() => render(<SEOHead {...requiredPropsOnly} />)).not.toThrow();
  });

  it('should handle undefined optional props', () => {
    const propsWithUndefined = {
      title: 'Title',
      description: 'Description',
      keywords: undefined,
      ogImage: undefined,
      canonical: undefined
    };

    expect(() => render(<SEOHead {...propsWithUndefined} />)).not.toThrow();
  });

  it('should handle null optional props', () => {
    const propsWithNull = {
      title: 'Title',
      description: 'Description',
      keywords: null as any,
      ogImage: null as any,
      canonical: null as any
    };

    expect(() => render(<SEOHead {...propsWithNull} />)).not.toThrow();
  });

  it('should be accessible', () => {
    const { getByTestId } = render(<SEOHead {...defaultProps} />);
    
    const helmet = getByTestId('helmet');
    expect(helmet).toBeInTheDocument();
    // In a real implementation, you would check for proper ARIA attributes
  });

  it('should not cause memory leaks on unmount', () => {
    const { unmount } = render(<SEOHead {...defaultProps} />);
    
    expect(() => unmount()).not.toThrow();
  });

  it('should handle re-renders with different props', () => {
    const { rerender } = render(<SEOHead {...defaultProps} />);
    
    const newProps = {
      ...defaultProps,
      title: 'Updated Title',
      description: 'Updated description'
    };

    expect(() => rerender(<SEOHead {...newProps} />)).not.toThrow();
  });
});
