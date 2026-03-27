import React, { useState } from 'react';

interface Props {
  onCommand: (command: string, message: string) => void;
  disabled?: boolean;
}

export const CommandInput: React.FC<Props> = ({ onCommand, disabled }) => {
  const [command, setCommand] = useState('REPORT');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    onCommand(command, message);
    setMessage('');
  };

  return (
    <div style={{
      padding: '1rem',
      border: '1px solid #ccc',
      borderRadius: '8px',
      marginBottom: '1rem',
      backgroundColor: '#fff'
    }}>
      <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 600 }}>⚡ Comandos Rápidos</h3>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>Tipo de Comando</label>
          <select
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            disabled={disabled}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="REPORT">Report (NotebookLM)</option>
            <option value="PROJECT">Analise de Projeto</option>
            <option value="CUSTOM">Customizado</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>Mensagem / Instrução</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Descreva o que deseja..."
            disabled={disabled}
            rows={3}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd', resize: 'vertical' }}
          />
        </div>

        <button
          type="submit"
          disabled={disabled || !message.trim()}
          style={{
            padding: '0.5rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            marginTop: '0.5rem'
          }}
        >
          Executar Comando
        </button>
      </form>
    </div>
  );
};
