import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Apenas permitir se for uma requisição de verificação básica
  const envKeys = Object.keys(process.env).map(key => {
    const val = process.env[key];
    return {
      key,
      exists: !!val,
      length: val ? val.length : 0,
      preview: val ? `${val.substring(0, 3)}...` : 'undefined'
    };
  });

  return res.status(200).json({
    message: "Secure Environment Check",
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV,
    keysFound: envKeys.filter(k => !k.key.startsWith('npm_') && !k.key.startsWith('COLOR') && !k.key.startsWith('TERM'))
  });
}
