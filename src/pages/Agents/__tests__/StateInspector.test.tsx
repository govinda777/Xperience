import React from 'react';
import { render, screen } from '@testing-library/react';
import { StateInspector } from '../components/StateInspector';
import '@testing-library/jest-dom';

describe('StateInspector', () => {
  it('renders waiting message when state is null', () => {
    render(<StateInspector state={null} />);
    expect(screen.getByText('Waiting for agent state...')).toBeInTheDocument();
  });

  it('renders metadata correctly', () => {
    const mockState = {
      sessionId: 'test-session-id',
      intent: 'search',
      securityLevel: 3,
      auditLog: []
    };
    render(<StateInspector state={mockState} />);

    expect(screen.getByText('test-ses...')).toBeInTheDocument();
    expect(screen.getByText('search')).toBeInTheDocument();
    expect(screen.getByText('🔒 Level 3')).toBeInTheDocument();
  });

  it('renders audit trail items', () => {
    const mockState = {
      sessionId: '123',
      auditLog: [
        { step: 'Hydration', timestamp: new Date().toISOString(), details: 'Session loaded' },
        { step: 'Perception', timestamp: new Date().toISOString(), details: 'Intent detected' }
      ]
    };
    render(<StateInspector state={mockState} />);

    expect(screen.getByText('Hydration')).toBeInTheDocument();
    expect(screen.getByText('Session loaded')).toBeInTheDocument();
    expect(screen.getByText('Perception')).toBeInTheDocument();
    expect(screen.getByText('Intent detected')).toBeInTheDocument();
  });
});
