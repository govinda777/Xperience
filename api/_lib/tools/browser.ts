import { tool } from 'ai';
import { z } from 'zod';

export const navigate = (tool as any)({
  description: 'Navega para uma URL específica no navegador.',
  parameters: z.object({
    url: z.string().url().describe('A URL para navegar'),
  }),
  execute: async ({ url }: { url: string }) => {
    console.log(`[BrowserTool] Navigating to ${url}`);
    return { success: true, message: `Navegou com sucesso para ${url}`, currentUrl: url };
  },
});

export const click = (tool as any)({
  description: 'Clica em um elemento da página usando um seletor CSS.',
  parameters: z.object({
    selector: z.string().describe('O seletor CSS do elemento para clicar'),
  }),
  execute: async ({ selector }: { selector: string }) => {
    console.log(`[BrowserTool] Clicking ${selector}`);
    return { success: true, message: `Clicou no elemento ${selector}` };
  },
});

export const typeText = (tool as any)({
  description: 'Digita um texto em um campo de entrada (input) específico.',
  parameters: z.object({
    selector: z.string().describe('O seletor CSS do campo de entrada'),
    text: z.string().describe('O texto a ser digitado'),
  }),
  execute: async ({ selector, text }: { selector: string; text: string }) => {
    console.log(`[BrowserTool] Typing "${text}" into ${selector}`);
    return { success: true, message: `Digitou "${text}" no campo ${selector}` };
  },
});

export const extractData = (tool as any)({
  description: 'Extrai dados estruturados da página atual.',
  parameters: z.object({
    schema: z.string().describe('Descrição do que extrair (ex: "títulos de produtos e preços")'),
  }),
  execute: async ({ schema }: { schema: string }) => {
    console.log(`[BrowserTool] Extracting ${schema}`);
    return {
      success: true,
      data: [
        { title: 'Exemplo de Produto 1', price: 'R$ 99,90' },
        { title: 'Exemplo de Produto 2', price: 'R$ 149,90' }
      ]
    };
  },
});

export const browserTools = {
  navigate,
  click,
  typeText,
  extractData,
};
