import React, { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import styled from 'styled-components';

const FormContainer = styled.div`
  background: white;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  border: 1px solid #f3f4f6;
  max-width: 800px;
  margin: 0 auto;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 16px;
  border-bottom: 2px solid #f3f4f6;
  padding-bottom: 8px;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 700;
  color: #4b5563;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  color: #1f2937;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #f97316;
    box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  color: #1f2937;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #f97316;
    box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 16px;
  background-color: #f97316;
  color: white;
  font-weight: 800;
  font-size: 1.125rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;

  &:hover {
    background-color: #ea580c;
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    background-color: #fdba74;
    cursor: not-allowed;
  }
`;

interface BusinessMapFormProps {
  onComplete: () => void;
}

export const BusinessMapForm: React.FC<BusinessMapFormProps> = ({ onComplete }) => {
  const { getAccessToken } = usePrivy();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    mission: '',
    vision: '',
    teamStructure: '',
    kpiRevenue: false,
    kpiEfficiency: false,
    kpiExpansion: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = await getAccessToken();
      if (!token) throw new Error('Não autenticado');

      const res = await fetch('/api/mountain/map', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Erro ao salvar o Mapa do Negócio');
      }

      onComplete(); // Notify parent that map is complete
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-black text-gray-900">Mapa do Seu Negócio - Fase 01</h2>
        <p className="text-gray-500 mt-2">Defina o DNA da sua empresa antes de iniciar a escalada.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 font-medium border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <SectionTitle>Identidade</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormGroup>
            <Label htmlFor="mission">Missão</Label>
            <TextArea
              id="mission"
              name="mission"
              placeholder="Qual o propósito da sua empresa?"
              value={formData.mission}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="vision">Visão</Label>
            <TextArea
              id="vision"
              name="vision"
              placeholder="Onde você quer chegar em 5 anos?"
              value={formData.vision}
              onChange={handleChange}
              required
            />
          </FormGroup>
        </div>

        <SectionTitle>Organização</SectionTitle>
        <FormGroup>
          <Label htmlFor="teamStructure">Estrutura de Times (Resumo)</Label>
          <Input
            type="text"
            id="teamStructure"
            name="teamStructure"
            placeholder="Ex: Marketing, Vendas, Produto, Engenharia"
            value={formData.teamStructure}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <SectionTitle>KPIs Primários (Foco do Ano)</SectionTitle>
        <FormGroup>
          <div className="flex gap-6 flex-wrap">
            <label className="flex items-center gap-2 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                name="kpiRevenue"
                checked={formData.kpiRevenue}
                onChange={handleChange}
                className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
              />
              <span className="font-bold text-gray-700">Receita</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                name="kpiEfficiency"
                checked={formData.kpiEfficiency}
                onChange={handleChange}
                className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
              />
              <span className="font-bold text-gray-700">Eficiência</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                name="kpiExpansion"
                checked={formData.kpiExpansion}
                onChange={handleChange}
                className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
              />
              <span className="font-bold text-gray-700">Expansão</span>
            </label>
          </div>
        </FormGroup>

        <SubmitButton type="submit" disabled={loading}>
          {loading ? 'Salvando...' : 'FINALIZAR E INICIAR SUBIDA'}
        </SubmitButton>
      </form>
    </FormContainer>
  );
};
