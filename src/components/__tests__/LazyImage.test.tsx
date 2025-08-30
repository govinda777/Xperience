import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import LazyImage from '../LazyImage';

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
});

window.IntersectionObserver = mockIntersectionObserver;

describe('LazyImage Component', () => {
  const defaultProps = {
    src: '/test-image.jpg',
    alt: 'Test image',
    className: 'test-class'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with basic props', () => {
    render(<LazyImage {...defaultProps} />);
    
    const image = screen.getByAltText('Test image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveClass('test-class');
  });

  it('should render with placeholder initially', () => {
    render(<LazyImage {...defaultProps} />);
    
    const container = screen.getByAltText('Test image').parentElement;
    expect(container).toHaveClass('lazy-image-container');
  });

  it('should handle missing alt text', () => {
    const propsWithoutAlt = {
      src: '/test-image.jpg',
      className: 'test-class'
    };

    render(<LazyImage {...propsWithoutAlt} />);
    
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
  });

  it('should handle missing className', () => {
    const propsWithoutClass = {
      src: '/test-image.jpg',
      alt: 'Test image'
    };

    render(<LazyImage {...propsWithoutClass} />);
    
    const image = screen.getByAltText('Test image');
    expect(image).toBeInTheDocument();
  });

  it('should handle loading state', async () => {
    render(<LazyImage {...defaultProps} />);
    
    const image = screen.getByAltText('Test image');
    expect(image).toBeInTheDocument();
    
    // Simulate image loading
    const imageElement = image as HTMLImageElement;
    Object.defineProperty(imageElement, 'complete', { value: false });
    
    expect(image).toHaveAttribute('src', '/test-image.jpg');
  });

  it('should handle error state', async () => {
    render(<LazyImage {...defaultProps} />);
    
    const image = screen.getByAltText('Test image');
    
    // Simulate image error
    const errorEvent = new Event('error');
    image.dispatchEvent(errorEvent);
    
    await waitFor(() => {
      expect(image).toBeInTheDocument();
    });
  });

  it('should handle successful load', async () => {
    render(<LazyImage {...defaultProps} />);
    
    const image = screen.getByAltText('Test image');
    
    // Simulate image load
    const loadEvent = new Event('load');
    Object.defineProperty(image, 'complete', { value: true });
    image.dispatchEvent(loadEvent);
    
    await waitFor(() => {
      expect(image).toBeInTheDocument();
    });
  });

  it('should handle different image formats', () => {
    const formats = ['.jpg', '.png', '.gif', '.webp', '.svg'];
    
    formats.forEach(format => {
      const props = {
        ...defaultProps,
        src: `/test-image${format}`,
        alt: `Test ${format} image`
      };
      
      const { unmount } = render(<LazyImage {...props} />);
      
      const image = screen.getByAltText(`Test ${format} image`);
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', `/test-image${format}`);
      
      unmount();
    });
  });

  it('should handle responsive images with srcSet', () => {
    const propsWithSrcSet = {
      ...defaultProps,
      srcSet: '/test-image-small.jpg 480w, /test-image-large.jpg 800w',
      sizes: '(max-width: 600px) 480px, 800px'
    };

    render(<LazyImage {...propsWithSrcSet} />);
    
    const image = screen.getByAltText('Test image');
    expect(image).toHaveAttribute('srcset', '/test-image-small.jpg 480w, /test-image-large.jpg 800w');
    expect(image).toHaveAttribute('sizes', '(max-width: 600px) 480px, 800px');
  });

  it('should handle width and height attributes', () => {
    const propsWithDimensions = {
      ...defaultProps,
      width: 300,
      height: 200
    };

    render(<LazyImage {...propsWithDimensions} />);
    
    const image = screen.getByAltText('Test image');
    expect(image).toHaveAttribute('width', '300');
    expect(image).toHaveAttribute('height', '200');
  });

  it('should handle loading attribute', () => {
    const propsWithLoading = {
      ...defaultProps,
      loading: 'eager' as const
    };

    render(<LazyImage {...propsWithLoading} />);
    
    const image = screen.getByAltText('Test image');
    expect(image).toHaveAttribute('loading', 'eager');
  });

  it('should handle decoding attribute', () => {
    const propsWithDecoding = {
      ...defaultProps,
      decoding: 'async' as const
    };

    render(<LazyImage {...propsWithDecoding} />);
    
    const image = screen.getByAltText('Test image');
    expect(image).toHaveAttribute('decoding', 'async');
  });

  it('should handle custom styles', () => {
    const propsWithStyle = {
      ...defaultProps,
      style: { borderRadius: '8px', opacity: 0.8 }
    };

    render(<LazyImage {...propsWithStyle} />);
    
    const image = screen.getByAltText('Test image');
    expect(image).toHaveStyle('border-radius: 8px');
    expect(image).toHaveStyle('opacity: 0.8');
  });

  it('should handle data attributes', () => {
    const propsWithDataAttrs = {
      ...defaultProps,
      'data-testid': 'custom-test-id',
      'data-category': 'hero-image'
    } as any;

    render(<LazyImage {...propsWithDataAttrs} />);
    
    const image = screen.getByTestId('custom-test-id');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('data-category', 'hero-image');
  });

  it('should handle aria attributes for accessibility', () => {
    const propsWithAria = {
      ...defaultProps,
      'aria-describedby': 'image-description',
      'aria-hidden': false
    } as any;

    render(<LazyImage {...propsWithAria} />);
    
    const image = screen.getByAltText('Test image');
    expect(image).toHaveAttribute('aria-describedby', 'image-description');
    expect(image).toHaveAttribute('aria-hidden', 'false');
  });

  it('should handle role attribute', () => {
    const propsWithRole = {
      ...defaultProps,
      role: 'presentation'
    } as any;

    render(<LazyImage {...propsWithRole} />);
    
    const image = screen.getByRole('presentation');
    expect(image).toBeInTheDocument();
  });

  it('should handle crossOrigin attribute', () => {
    const propsWithCrossOrigin = {
      ...defaultProps,
      crossOrigin: 'anonymous' as const
    };

    render(<LazyImage {...propsWithCrossOrigin} />);
    
    const image = screen.getByAltText('Test image');
    expect(image).toHaveAttribute('crossorigin', 'anonymous');
  });

  it('should handle referrerPolicy attribute', () => {
    const propsWithReferrerPolicy = {
      ...defaultProps,
      referrerPolicy: 'no-referrer' as const
    };

    render(<LazyImage {...propsWithReferrerPolicy} />);
    
    const image = screen.getByAltText('Test image');
    expect(image).toHaveAttribute('referrerpolicy', 'no-referrer');
  });

  it('should cleanup on unmount', () => {
    const { unmount } = render(<LazyImage {...defaultProps} />);
    
    expect(() => unmount()).not.toThrow();
  });

  it('should handle re-renders with different props', () => {
    const { rerender } = render(<LazyImage {...defaultProps} />);
    
    const newProps = {
      ...defaultProps,
      src: '/new-image.jpg',
      alt: 'New test image'
    };

    expect(() => rerender(<LazyImage {...newProps} />)).not.toThrow();
    
    const image = screen.getByAltText('New test image');
    expect(image).toHaveAttribute('src', '/new-image.jpg');
  });

  it('should handle empty src gracefully', () => {
    const propsWithEmptySrc = {
      ...defaultProps,
      src: ''
    };

    expect(() => render(<LazyImage {...propsWithEmptySrc} />)).not.toThrow();
  });

  it('should handle invalid src gracefully', () => {
    const propsWithInvalidSrc = {
      ...defaultProps,
      src: 'invalid-url'
    };

    render(<LazyImage {...propsWithInvalidSrc} />);
    
    const image = screen.getByAltText('Test image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'invalid-url');
  });

  it('should be accessible with screen readers', () => {
    render(<LazyImage {...defaultProps} />);
    
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('alt', 'Test image');
  });

  it('should handle multiple instances without conflicts', () => {
    render(
      <div>
        <LazyImage src="/image1.jpg" alt="Image 1" />
        <LazyImage src="/image2.jpg" alt="Image 2" />
        <LazyImage src="/image3.jpg" alt="Image 3" />
      </div>
    );
    
    expect(screen.getByAltText('Image 1')).toBeInTheDocument();
    expect(screen.getByAltText('Image 2')).toBeInTheDocument();
    expect(screen.getByAltText('Image 3')).toBeInTheDocument();
  });
});
