import React from 'react';
import styled from 'styled-components';

export const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
`;

export const CardHeader = styled.div`
  padding: 16px 24px;
  border-bottom: 1px solid #e2e8f0;
`;

export const CardTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
`;

export const CardContent = styled.div`
  padding: 24px;
`;
