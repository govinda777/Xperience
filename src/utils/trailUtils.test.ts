import { describe, it, expect } from 'vitest';
import { interpolatePrompt } from './trailUtils';
import { Trail, Step } from '../types/trails';

describe('interpolatePrompt', () => {
  const mockTrail: Trail = {
    trailId: 'test-trail',
    title: 'Test Trail',
    steps: [
      {
        id: 'step1',
        title: 'Step 1',
        type: 'form',
        fields: [
          { id: 'name', label: 'Nome', type: 'text' },
          { id: 'age', label: 'Idade', type: 'number' }
        ]
      },
      {
        id: 'step2',
        title: 'Step 2',
        type: 'text',
        fields: []
      }
    ]
  };

  it('interpolates simple text values correctly', () => {
    const prompt = 'Olá {{step2}}, bem-vindo!';
    const data = { step2: 'Fulano' };
    const result = interpolatePrompt(prompt, data, mockTrail);
    expect(result).toBe('Olá Fulano, bem-vindo!');
  });

  it('interpolates form data fields correctly into Label: Value structure', () => {
    const prompt = 'Dados do formulário:\n{{step1}}';
    const data = {
      step1: { name: 'Alice', age: '30' }
    };
    const result = interpolatePrompt(prompt, data, mockTrail);
    expect(result).toBe('Dados do formulário:\nNome: Alice\nIdade: 30');
  });

  it('leaves placeholders empty if no data is provided', () => {
    const prompt = 'Olá {{step2}}!';
    const data = {};
    const result = interpolatePrompt(prompt, data, mockTrail);
    expect(result).toBe('Olá !');
  });
});

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
