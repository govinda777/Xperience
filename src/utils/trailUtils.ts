import { Trail } from '../types/trails';

/**
 * Interpolates step data into a prompt string.
 * Replaces {{stepId}} with the corresponding value from data.
 * If the value is an object (form data), it formats it as "Label: Value".
 */
export const interpolatePrompt = (prompt: string, data: Record<string, any>, trail: Trail) => {
  let interpolated = prompt;

  // Find all {{stepId}} patterns
  const matches = prompt.match(/{{(.*?)}}/g);

  if (matches) {
    // Optimization: Create a Map for O(1) step lookup
    const stepMap = new Map(trail.steps.map(s => [s.id, s]));

    matches.forEach(match => {
      const stepId = match.replace(/{{|}}/g, '');
      const stepValue = data[stepId];

      let replacement = '';
      if (stepValue) {
        if (typeof stepValue === 'object') {
          // Form data - format as "Question: Answer"
          const stepConfig = stepMap.get(stepId);
          if (stepConfig && stepConfig.fields) {
            replacement = stepConfig.fields.map(field => {
              const val = stepValue[field.id];
              const label = field.label;
              return `${label}: ${Array.isArray(val) ? val.join(', ') : val}`;
            }).join('\n');
          } else {
            replacement = JSON.stringify(stepValue);
          }
        } else {
          replacement = String(stepValue);
        }
      }

      interpolated = interpolated.replace(match, replacement);
    });
  }

  return interpolated;
};
