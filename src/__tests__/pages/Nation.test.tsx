import React from "react";
import { render, screen } from "@testing-library/react";
import Nation from "../../pages/Nation";
import { useAppAuth } from "../../contexts/AuthContext";

jest.mock("../../contexts/AuthContext", () => ({
  useAppAuth: jest.fn(),
}));

// Mock the components using the standard jest.mock
jest.mock("nationfun/AgentDashboard", () => ({
  __esModule: true,
  default: () => <div>AgentDashboard Mock</div>,
}));
jest.mock("nationfun/AgentList", () => ({
  __esModule: true,
  default: () => <div>AgentList Mock</div>,
}));

describe("Nation Page", () => {
  it("renders the page title and mocked components", async () => {
    (useAppAuth as jest.Mock).mockReturnValue({
      user: { id: "test-user-id" },
      authenticated: true,
      ready: true,
    });

    render(<Nation />);
    expect(screen.getByText("Nation Agents")).toBeInTheDocument();

    // The components are now loaded via useEffect, so we still need to wait for them
    expect(await screen.findByText("AgentDashboard Mock")).toBeInTheDocument();
    expect(await screen.findByText("AgentList Mock")).toBeInTheDocument();
  });
});
