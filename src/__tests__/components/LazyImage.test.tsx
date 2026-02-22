import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { LazyImage } from "../../components/LazyImage";

// Mock the useAnalytics hook
const mockTrackEvent = jest.fn();
jest.mock("../../contexts/AnalyticsContext", () => ({
  useAnalytics: () => ({
    trackEvent: mockTrackEvent,
  }),
}));

describe("LazyImage Component", () => {
  const defaultProps = {
    src: "test-image.jpg",
    alt: "Test Image",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with native loading='lazy' by default", () => {
    render(<LazyImage {...defaultProps} />);
    const img = screen.getByAltText("Test Image");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("loading", "lazy");
  });

  it("renders with loading='eager' when priority is true", () => {
    render(<LazyImage {...defaultProps} priority={true} />);
    const img = screen.getByAltText("Test Image");
    expect(img).toHaveAttribute("loading", "eager");
  });

  it("shows placeholder initially and fades it out after load", () => {
    render(<LazyImage {...defaultProps} />);

    // Initially shows placeholder
    const placeholder = screen.getByAltText("Carregando...");
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toHaveClass("opacity-100");

    // Primary image is also present but hidden (opacity-0)
    const img = screen.getByAltText("Test Image");
    expect(img).toHaveClass("opacity-0");

    // Simulate load
    fireEvent.load(img);

    // Now image should be visible
    expect(img).toHaveClass("opacity-100");
    // Placeholder should be hidden with opacity but still in DOM
    expect(placeholder).toHaveClass("opacity-0");
    expect(placeholder).toBeInTheDocument();
  });

  it("tracks error event when image fails to load", () => {
    render(<LazyImage {...defaultProps} />);
    const img = screen.getByAltText("Test Image");

    // Simulate error
    fireEvent.error(img);

    expect(mockTrackEvent).toHaveBeenCalledWith(
      "image_error",
      "performance",
      "Test Image"
    );

    // Shows error placeholder (alt text change)
    expect(screen.getByAltText("Erro ao carregar imagem")).toBeInTheDocument();
  });

  it("does not track success event (to reduce analytics spam)", () => {
    render(<LazyImage {...defaultProps} />);
    const img = screen.getByAltText("Test Image");

    // Simulate load
    fireEvent.load(img);

    // trackEvent should NOT have been called for success
    expect(mockTrackEvent).not.toHaveBeenCalledWith(
      "image_loaded",
      expect.any(String),
      expect.any(String)
    );
  });
});
