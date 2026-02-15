import { renderHook, act } from '@testing-library/react';
import { useSessionRAG } from '../useSessionRAG';
import * as embeddings from '../../utils/embeddings';
import * as textProcessing from '../../utils/textProcessing';

// Mock dependencies
jest.mock('../../utils/embeddings', () => ({
  generateEmbeddingLocal: jest.fn(),
  cosineSimilarity: jest.fn(),
}));

jest.mock('../../utils/textProcessing', () => ({
  readFileAsText: jest.fn(),
  chunkText: jest.fn(),
}));

describe('useSessionRAG', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mock implementations
    (embeddings.generateEmbeddingLocal as jest.Mock).mockResolvedValue([0.1, 0.2, 0.3]);
    (embeddings.cosineSimilarity as jest.Mock).mockImplementation((a, b) => {
        // Simple mock similarity
        return 0.9;
    });
    (textProcessing.readFileAsText as jest.Mock).mockResolvedValue('Mock file content');
    (textProcessing.chunkText as jest.Mock).mockReturnValue(['Mock chunk 1', 'Mock chunk 2']);
  });

  it('should initialize with empty state', () => {
    const { result } = renderHook(() => useSessionRAG());
    expect(result.current.ragContext.files).toHaveLength(0);
  });

  it('should upload and process a file', async () => {
    const { result } = renderHook(() => useSessionRAG());
    const file = new File(['content'], 'test.txt', { type: 'text/plain' });

    await act(async () => {
      await result.current.uploadFile(file);
    });

    expect(result.current.ragContext.files).toHaveLength(1);
    const uploadedFile = result.current.ragContext.files[0];
    expect(uploadedFile.name).toBe('test.txt');
    expect(uploadedFile.status).toBe('ready');
    expect(uploadedFile.chunks).toHaveLength(2);

    expect(textProcessing.readFileAsText).toHaveBeenCalledWith(file);
    expect(textProcessing.chunkText).toHaveBeenCalled();
    expect(embeddings.generateEmbeddingLocal).toHaveBeenCalledTimes(2); // One per chunk
  });

  it('should search for similar chunks', async () => {
     const { result } = renderHook(() => useSessionRAG());
     const file = new File(['content'], 'test.txt', { type: 'text/plain' });

     await act(async () => {
       await result.current.uploadFile(file);
     });

     // Reset mock count after upload
     (embeddings.generateEmbeddingLocal as jest.Mock).mockClear();
     // Mock query embedding
     (embeddings.generateEmbeddingLocal as jest.Mock).mockResolvedValueOnce([1, 0, 0]);

     // Mock similarity to filter results
     (embeddings.cosineSimilarity as jest.Mock).mockReturnValue(0.8);

     const searchResults = await result.current.searchSimilar('query');
     expect(searchResults.length).toBeGreaterThan(0);
     expect(embeddings.generateEmbeddingLocal).toHaveBeenCalledTimes(1); // 1 query (chunks already embedded)
  });

  it('should remove a file', async () => {
    const { result } = renderHook(() => useSessionRAG());
    const file = new File(['content'], 'test.txt', { type: 'text/plain' });

    await act(async () => {
      await result.current.uploadFile(file);
    });

    expect(result.current.ragContext.files).toHaveLength(1);
    const fileId = result.current.ragContext.files[0].id;

    act(() => {
      result.current.removeFile(fileId);
    });

    expect(result.current.ragContext.files).toHaveLength(0);
  });
});
