import styled from 'styled-components';
import { Card } from '../styled/styled';

export const AgentPanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
  overflow-y: auto;
  padding: 1rem;
  background-color: #f8f9fa;
  border-left: 1px solid #e9ecef;
`;

export const InspectorCard = styled(Card)`
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const CardTitle = styled.h4`
  font-size: 0.85rem;
  text-transform: uppercase;
  color: #6c757d;
  margin: 0 0 0.5rem 0;
  font-weight: 700;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #f1f3f5;
  padding-bottom: 0.5rem;
`;

export const KeyValueRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  margin-bottom: 0.25rem;
`;

export const KeyLabel = styled.span`
  color: #868e96;
`;

export const ValueLabel = styled.span`
  font-weight: 600;
  color: #343a40;
`;

export const StatusBadge = styled.span<{ status: 'pending' | 'running' | 'done' | 'error' }>`
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: bold;
  text-transform: uppercase;
  background-color: ${props => {
    switch(props.status) {
      case 'done': return '#d3f9d8';
      case 'running': return '#fff3bf';
      case 'error': return '#ffe3e3';
      default: return '#f1f3f5';
    }
  }};
  color: ${props => {
    switch(props.status) {
      case 'done': return '#2b8a3e';
      case 'running': return '#f08c00';
      case 'error': return '#c92a2a';
      default: return '#868e96';
    }
  }};
`;
