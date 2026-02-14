import React, { useState } from 'react';
import { SessionKnowledge } from '../../services/agent/SessionKnowledge';

export const KnowledgeUploader: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [knowledgeItems, setKnowledgeItems] = useState(SessionKnowledge.getAll());

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    setUploading(true);

    for (const file of files) {
      try {
        const content = await file.text();
        SessionKnowledge.add(file.name, content);
      } catch (error) {
        console.error(`Erro ao processar ${file.name}:`, error);
      }
    }

    setUploading(false);
    setFiles([]);
    setKnowledgeItems(SessionKnowledge.getAll());
    alert('Arquivos carregados na sessão! Serão descartados ao fechar a aba.');
  };

  const handleRemove = (id: string) => {
    SessionKnowledge.remove(id);
    setKnowledgeItems(SessionKnowledge.getAll());
  };

  return (
    <div style={{
      padding: '1rem',
      border: '1px solid #ccc',
      borderRadius: '8px',
      marginBottom: '1rem'
    }}>
      <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 600 }}>📚 Knowledge Base da Sessão</h3>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="file"
          multiple
          accept=".txt,.md,.json,.csv"
          onChange={handleFileChange}
          disabled={uploading}
        />
        <button
          onClick={handleUpload}
          disabled={files.length === 0 || uploading}
          style={{ marginLeft: '0.5rem', cursor: 'pointer', padding: '0.25rem 0.5rem' }}
        >
          {uploading ? 'Carregando...' : 'Fazer Upload'}
        </button>
      </div>

      <div>
        <strong>Arquivos na sessão ({knowledgeItems.length}):</strong>
        {knowledgeItems.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic', fontSize: '0.9rem', margin: '0.5rem 0' }}>
            Nenhum arquivo carregado ainda
          </p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: '0.5rem 0' }}>
            {knowledgeItems.map(item => (
              <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                <span title={item.filename} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>{item.filename}</span>
                <button
                  onClick={() => handleRemove(item.id)}
                  style={{
                    marginLeft: '0.5rem',
                    fontSize: '0.8rem',
                    color: 'red',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  aria-label="Remover"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <small style={{ color: '#666', fontSize: '0.75rem' }}>
        ⚠️ Esses dados serão automaticamente descartados ao fechar a aba
      </small>
    </div>
  );
};
