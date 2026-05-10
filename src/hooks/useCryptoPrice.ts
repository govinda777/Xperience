import { useState, useEffect } from 'react';

interface CryptoPriceData {
  price: number;
  amount: number;
  loading: boolean;
  error: Error | null;
}

export const useCryptoPrice = (cryptoId: string, finalPrice: number, fallbackPrice: number): CryptoPriceData => {
  const [price, setPrice] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoId}&vs_currencies=brl`
        );
        const data = await response.json();

        if (data[cryptoId] && data[cryptoId].brl) {
            const currentPrice = data[cryptoId].brl;
            setPrice(currentPrice);
            setAmount(finalPrice / currentPrice);
        } else {
            throw new Error(`Data for ${cryptoId} not found`);
        }
      } catch (err) {
        console.error(`Erro ao buscar cotação ${cryptoId}:`, err);
        setError(err as Error);
        // Fallback
        setPrice(fallbackPrice);
        setAmount(finalPrice / fallbackPrice);
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();

    const interval = setInterval(fetchPrice, 30000);
    return () => clearInterval(interval);
  }, [cryptoId, finalPrice, fallbackPrice]);

  return { price, amount, loading, error };
};
