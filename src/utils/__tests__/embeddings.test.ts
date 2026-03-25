import * as use from "@tensorflow-models/universal-sentence-encoder";
import { generateEmbeddingLocal, _clearEmbeddingCache, _resetModel } from "../embeddings";

// Mock tensorflow models
jest.mock("@tensorflow-models/universal-sentence-encoder");
jest.mock("@tensorflow/tfjs", () => ({
  ready: jest.fn().mockResolvedValue(true),
}));

describe("generateEmbeddingLocal Caching", () => {
  let mockEmbed: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    _clearEmbeddingCache();
    _resetModel();

    // Setup mock encoder
    mockEmbed = jest.fn().mockImplementation((texts: string[]) => ({
      array: jest
        .fn()
        .mockResolvedValue(texts.map(() => new Array(512).fill(0.1))),
    }));

    (use.load as jest.Mock).mockResolvedValue({
      embed: mockEmbed,
    });
  });

  it("should call the model only once for the same text", async () => {
    const text = "test text";

    // First call
    const result1 = await generateEmbeddingLocal(text);
    expect(mockEmbed).toHaveBeenCalledTimes(1);

    // Second call with same text
    const result2 = await generateEmbeddingLocal(text);

    // Should NOT have called the model again
    expect(mockEmbed).toHaveBeenCalledTimes(1);
    expect(result1).toEqual(result2);
  });

  it("should call the model multiple times for different texts", async () => {
    await generateEmbeddingLocal("text 1");
    await generateEmbeddingLocal("text 2");

    expect(mockEmbed).toHaveBeenCalledTimes(2);
  });

  it("should evict oldest entries when cache is full", async () => {
    // Fill the cache (MAX_CACHE_SIZE is 200)
    for (let i = 0; i < 200; i++) {
      await generateEmbeddingLocal(`text ${i}`);
    }
    expect(mockEmbed).toHaveBeenCalledTimes(200);
    mockEmbed.mockClear();

    // Call 201 should evict "text 0"
    await generateEmbeddingLocal("text 200");
    expect(mockEmbed).toHaveBeenCalledTimes(1);
    mockEmbed.mockClear();

    // "text 0" should now be a cache miss
    await generateEmbeddingLocal("text 0");
    expect(mockEmbed).toHaveBeenCalledTimes(1);
    mockEmbed.mockClear();

    // "text 1" should still be a cache hit (was NOT evicted by "text 200" or "text 0")
    // "text 200" evicted "text 0"
    // "text 0" (newly added) evicted "text 1"
    // Wait, let's re-verify FIFO:
    // [0, 1, 2, ..., 199] -> add 200 -> evicts 0 -> [1, 2, ..., 199, 200]
    // [1, 2, ..., 199, 200] -> add 0 -> evicts 1 -> [2, ..., 199, 200, 0]
    // So "text 1" SHOULD be evicted now.

    await generateEmbeddingLocal("text 1");
    expect(mockEmbed).toHaveBeenCalledTimes(1);
    mockEmbed.mockClear();

    // "text 2" was evicted by "text 1" call
    // Eviction happens when adding "text 200" (evicts "text 0")
    // Then adding "text 0" again (evicts "text 1")
    // Then adding "text 1" again (evicts "text 2")
    // So "text 2" SHOULD be a cache miss now.
    await generateEmbeddingLocal("text 2");
    expect(mockEmbed).toHaveBeenCalledTimes(1);
  });
});
