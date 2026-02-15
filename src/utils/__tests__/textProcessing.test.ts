import { chunkText } from '../textProcessing';

describe('textProcessing utils', () => {
  describe('chunkText', () => {
    it('should return the original text if it is shorter than chunkSize', () => {
      const text = 'Hello world';
      const chunks = chunkText(text, { chunkSize: 20, overlap: 5 });
      expect(chunks).toHaveLength(1);
      expect(chunks[0]).toBe(text);
    });

    it('should split text into chunks with overlap', () => {
      const text = 'abcdefghij';
      // chunkSize 5, overlap 2
      // 0-5: abcde
      // 3-8: defgh
      // 6-10: ghij
      // 9-10: j (tail)
      const chunks = chunkText(text, { chunkSize: 5, overlap: 2 });
      expect(chunks).toEqual(['abcde', 'defgh', 'ghij', 'j']);
    });

    it('should handle overlap equal to or greater than chunkSize gracefully (prevent infinite loop)', () => {
       const text = 'abcdefghij';
       // If overlap >= chunkSize, implementation adds 1 to start to progress
       const chunks = chunkText(text, { chunkSize: 3, overlap: 3 });
       // start 0, end 3: abc
       // start 1, end 4: bcd
       // ...
       expect(chunks.length).toBeGreaterThan(0);
       expect(chunks[0]).toBe('abc');
       expect(chunks[1]).toBe('bcd');
    });

    it('should not include empty chunks', () => {
        const text = '   ';
        const chunks = chunkText(text, { chunkSize: 5, overlap: 0 });
        expect(chunks).toEqual([]);
    });
  });
});
