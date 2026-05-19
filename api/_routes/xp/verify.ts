import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setCorsHeaders } from '../../_lib/middleware.js';
import { prisma } from '../../lib/db.js';
import { ethers } from 'ethers';
import crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { address } = req.query;

  if (!address || typeof address !== 'string') {
    return res.status(400).json({ error: 'Wallet address is required' });
  }

  try {
    // 1. Fetch user XP by wallet address
    // We assume the user has linked their wallet and it's stored in UserXp
    const userXp = await prisma.userXp.findUnique({
      where: { walletAddress: address }
    });

    if (!userXp) {
      return res.status(404).json({ error: 'No XP found for this address' });
    }

    // 2. Prepare EIP-712 Signature
    // Process verifyingContract dynamically from environment, fallback to zero address to avoid crashing if not set
    const verifyingContract = process.env.XP_VERIFYING_CONTRACT || "0x0000000000000000000000000000000000000000";

    const domain = {
      name: "XperienceGamification",
      version: "1",
      chainId: 11155111, // Sepolia Testnet
      verifyingContract
    };

    const types = {
      ScoreProof: [
        { name: "user", type: "address" },
        { name: "totalXp", type: "uint256" },
        { name: "nonce", type: "bytes32" }
      ]
    };

    // Generate a random nonce for this proof
    const nonce = '0x' + crypto.randomBytes(32).toString('hex');

    const value = {
      user: address,
      totalXp: userXp.totalXp,
      nonce: nonce
    };

    const privateKey = process.env.XP_SIGNER_KEY;
    if (!privateKey) {
        throw new Error('XP_SIGNER_KEY is not configured');
    }

    const wallet = new ethers.Wallet(privateKey);
    const signature = await wallet._signTypedData(domain, types, value);

    return res.status(200).json({
      address,
      totalXp: userXp.totalXp,
      level: userXp.level,
      proof: {
        domain,
        types,
        value,
        signature
      }
    });

  } catch (error) {
    console.error('[XP Verify API] Error:', error);
    return res.status(500).json({ error: 'Failed to generate proof' });
  }
}
