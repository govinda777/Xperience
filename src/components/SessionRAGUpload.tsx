// components/SessionRAGUpload.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import type { useSessionRAG } from '../hooks/useSessionRAG';

interface Props {
  sessionRAG: ReturnType<typeof useSessionRAG>;
}

export const SessionRAGUpload: React.FC<Props> = ({ sessionRAG }) => {
  const [uploading, setUploading] = useState(false);
  const { uploadFile, ragContext, removeFile, setActiveFile } = sessionRAG;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Valida tipo de arquivo (extensões permitidas)
    const allowedExtensions = ['.txt', '.md', '.json', '.csv', '.xml', '.yml', '.yaml'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      alert(`Tipo de arquivo não suportado. Use: ${allowedExtensions.join(', ')}`);
      return;
    }

    // Valida tamanho (máx 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Arquivo muito grande. Máximo 10MB');
      return;
    }

    setUploading(true);
    try {
      await uploadFile(file);
      alert(`✅ ${file.name} processado com sucesso!`);
    } catch (error: any) {
      alert(`❌ Erro: ${error.message}`);
    } finally {
      setUploading(false);
      // Reset input value to allow uploading the same file again if needed
      e.target.value = '';
    }
  };

  return (
    <Container>
      <UploadArea>
        <UploadButton disabled={uploading}>
          <input
            type="file"
            onChange={handleFileSelect}
            accept=".txt,.md,.json,.csv,.xml,.yml,.yaml"
            disabled={uploading}
          />
          {uploading ? '⏳ Processando...' : '📎 Upload Documento'}
        </UploadButton>

        <HelpText>
          Formatos: txt, md, json, csv, xml, yml • Máx: 10MB
        </HelpText>
      </UploadArea>

      {ragContext.files.length > 0 && (
        <FilesList>
          <ListTitle>Documentos Carregados ({ragContext.files.length})</ListTitle>

          {ragContext.files.map(file => (
            <FileItem key={file.id}>
              <FileIcon status={file.status}>
                {file.status === 'processing' && '⏳'}
                {file.status === 'ready' && '✅'}
                {file.status === 'error' && '❌'}
              </FileIcon>

              <FileInfo
                onClick={() => setActiveFile(
                  ragContext.activeFileId === file.id ? undefined : file.id
                )}
                $active={ragContext.activeFileId === file.id}
              >
                <FileName>{file.name}</FileName>
                <FileStats>
                  {file.chunks.length} chunks • {(file.size / 1024).toFixed(0)}KB
                </FileStats>
                {file.errorMessage && (
                  <ErrorMessage>{file.errorMessage}</ErrorMessage>
                )}
              </FileInfo>

              <RemoveButton
                onClick={() => removeFile(file.id)}
                title="Remover arquivo"
              >
                🗑️
              </RemoveButton>
            </FileItem>
          ))}
        </FilesList>
      )}

      {ragContext.files.length === 0 && (
        <EmptyState>
          <EmptyIcon>📄</EmptyIcon>
          <EmptyText>
            Nenhum documento carregado
          </EmptyText>
          <EmptySubtext>
            Faça upload para começar a fazer perguntas
          </EmptySubtext>
        </EmptyState>
      )}
    </Container>
  );
};

// Estilos
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
`;

const UploadArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const UploadButton = styled.label<{ disabled?: boolean }>`
  display: inline-block;
  padding: 0.75rem 1rem;
  background: #007bff;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  text-align: center;
  transition: background 0.2s;

  &:hover:not([disabled]) {
    background: #0056b3;
  }

  &[disabled] {
    background: #6c757d;
    cursor: not-allowed;
  }

  input {
    display: none;
  }
`;

const HelpText = styled.div`
  font-size: 0.75rem;
  color: #6c757d;
`;

const FilesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ListTitle = styled.div`
  font-weight: 600;
  font-size: 0.875rem;
  color: #495057;
  margin-bottom: 0.25rem;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: white;
  border-radius: 6px;
  border: 1px solid #dee2e6;
`;

const FileIcon = styled.div<{ status: string }>`
  font-size: 1.25rem;
`;

const FileInfo = styled.div<{ $active: boolean }>`
  flex: 1;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  background: ${props => props.$active ? '#e7f3ff' : 'transparent'};
  border: 2px solid ${props => props.$active ? '#007bff' : 'transparent'};
  transition: all 0.2s;

  &:hover {
    background: #f8f9fa;
  }
`;

const FileName = styled.div`
  font-weight: 500;
  font-size: 0.875rem;
  color: #212529;
  margin-bottom: 0.25rem;
  word-break: break-all;
`;

const FileStats = styled.div`
  font-size: 0.75rem;
  color: #6c757d;
`;

const ErrorMessage = styled.div`
  font-size: 0.75rem;
  color: #dc3545;
  margin-top: 0.25rem;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  opacity: 0.6;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  text-align: center;
  color: #6c757d;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 0.5rem;
`;

const EmptyText = styled.div`
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const EmptySubtext = styled.div`
  font-size: 0.875rem;
`;
