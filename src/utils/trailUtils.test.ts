import { describe, it, expect } from 'vitest';
import { interpolatePrompt } from './trailUtils';
import { Trail, Step } from '../types/trails';

describe('interpolatePrompt benchmark', () => {
  it('measures performance of interpolatePrompt with large dataset', () => {
    const stepCount = 1000;
    const steps: Step[] = [];
    const allData: Record<string, any> = {};
    let prompt = '';

    for (let i = 0; i < stepCount; i++) {
      const id = `step-${i}`;
      steps.push({
        id,
        title: `Step ${i}`,
        type: 'form',
        fields: [
          { id: 'f1', label: `Field ${i}`, type: 'text' }
        ]
      });
      allData[id] = { f1: `Value ${i}` };
      prompt += `{{${id}}} `;
    }

    const trail: Trail = {
      trailId: 'test-trail',
      title: 'Test Trail',
      steps
    };

    const start = performance.now();
    const result = interpolatePrompt(prompt, allData, trail);
    const end = performance.now();

    const duration = end - start;
    console.log(`[BENCHMARK] interpolatePrompt took ${duration.toFixed(4)}ms for ${stepCount} steps`);

    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  });
});
