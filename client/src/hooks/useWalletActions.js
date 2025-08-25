import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Connection, clusterApiUrl, Keypair, LAMPORTS_PER_SOL, Transaction, SystemProgram, sendAndConfirmTransaction, PublicKey } from '@solana/web3.js';
import crypto from 'crypto';
import {Buffer} from 'buffer';
import { getEndpoints, getCurrentNetwork, NETWORK_CONFIG } from '../config/api';
import { handleWalletError, validateAddress } from '../utils/errorHandler';
import { toast } from 'react-toastify';

// Get current network configuration
const getCurrentProviders = () => {
  const network = getCurrentNetwork();
  const endpoints = getEndpoints();
  const config = NETWORK_CONFIG[network];
  
  return {
    ethProvider: new ethers.getDefaultProvider(endpoints.ETHEREUM_RPC),
    solConnection: new Connection(clusterApiUrl(config.solana.cluster), 'confirmed'),
    network
  };
};

export const decryptPrivateKey = (encryptedPrivateKey, hashedPassword, saltForKey, iv) => {
  const key = crypto.pbkdf2Sync(hashedPassword, saltForKey, 10000, 16, 'sha256');
  const ivBuffer = Buffer.from(iv, 'hex');
  const decipher = crypto.createDecipheriv('aes-128-cbc', key, ivBuffer);
  let decrypted = decipher.update(encryptedPrivateKey, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

export const airdropSol = async (publicKey, amount) => {
  const { solConnection, network } = getCurrentProviders();
  
  // Only allow airdrops on testnet
  if (network !== 'testnet') {
    throw new Error('Airdrops are only available on testnet');
  }
  
  try {
    const signature = await solConnection.requestAirdrop(new PublicKey(publicKey), amount * LAMPORTS_PER_SOL);
    const latestBlockhash = await solConnection.getLatestBlockhash();
    await solConnection.confirmTransaction({
      signature,
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
    });
    console.log(`Airdrop successful! Signature: ${signature}`);
  } catch (error) {
    console.error('Error requesting SOL airdrop:', error);
    throw error;
  }
};

export const requestSepoliaFaucet = async (ethAddress) => {
  const { network } = getCurrentProviders();
  const endpoints = getEndpoints();
  
  // Only allow faucet requests on testnet
  if (network !== 'testnet') {
    throw new Error('Faucet requests are only available on testnet');
  }
  
  try {
    console.log("Requesting ETH from Sepolia faucet");
    const response = await fetch(endpoints.SEPOLIA_FAUCET, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address: ethAddress }),
    });
    const result = await response.json();
    console.log(result);
    if (result.success) {
      console.log(`Sepolia ETH faucet request successful! Transaction: ${result.txHash}`);
    } else {
      console.error('Faucet request failed:', result.message);
      throw new Error(result.message || 'Faucet request failed');
    }
  } catch (error) {
    console.error('Error requesting Sepolia ETH from faucet:', error);
    throw error;
  }
};


export default function useWalletActions(senderSolPublicKey, senderEthAddress) {
  const [solanaBalance, setSolanaBalance] = useState(null);
  const [ethBalance, setEthBalance] = useState(null);
  const [loading, setLoading] = useState(false);

  const getSolanaBalance = async (publicKey) => {
    const { solConnection } = getCurrentProviders();
    const Address = new PublicKey(publicKey);
    const balance = await solConnection.getBalance(Address);
    return balance / LAMPORTS_PER_SOL;
  };

  const getEthBalance = async (ethAddress) => {
    const { ethProvider } = getCurrentProviders();
    const balance = await ethProvider.getBalance(ethAddress);
    return ethers.formatEther(balance);
  };



  const sendSolana = async (senderPrivateKey, recipientAddress, amount) => {
    setLoading(true);
    try {
      const { solConnection, network } = getCurrentProviders();
      
      // Validate inputs
      if (!validateAddress(recipientAddress, 'solana')) {
        throw new Error('Invalid Solana address');
      }
      if (!amount || amount <= 0) {
        throw new Error('Invalid amount');
      }

      const secretKeyArray=Uint8Array.from(senderPrivateKey.split(',').map(Number));
      const senderKeypair = Keypair.fromSecretKey(secretKeyArray);
      const lamportsToSend = amount * LAMPORTS_PER_SOL;
      
      // Check balance before sending
      const senderBalance = await solConnection.getBalance(senderKeypair.publicKey);
      if (senderBalance < lamportsToSend) {
        throw new Error('Insufficient funds for this transaction');
      }

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: senderKeypair.publicKey,
          toPubkey: new PublicKey(recipientAddress),
          lamports: lamportsToSend,
        })
      );
      
      const signature = await sendAndConfirmTransaction(solConnection, transaction, [senderKeypair]);
      
      const networkName = network === 'testnet' ? 'Devnet' : 'Mainnet';
      toast.success(`${networkName} transaction successful! Signature: ${signature.slice(0, 8)}...`);
      console.log(`Transaction successful! Signature: ${signature}`);
    } catch (error) {
      handleWalletError(error, 'send Solana');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sendEth = async (senderPrivateKey, recipientAddress, amount) => {
    setLoading(true);
    try {
      const { ethProvider, network } = getCurrentProviders();
      
      // Validate inputs
      if (!validateAddress(recipientAddress, 'ethereum')) {
        throw new Error('Invalid Ethereum address');
      }
      if (!amount || amount <= 0) {
        throw new Error('Invalid amount');
      }

      const wallet = new ethers.Wallet(senderPrivateKey, ethProvider);
      
      // Check balance before sending
      const senderBalance = await ethProvider.getBalance(wallet.address);
      const amountInWei = ethers.parseEther(amount.toString());
      if (senderBalance < amountInWei) {
        throw new Error('Insufficient funds for this transaction');
      }

      const transaction = await wallet.sendTransaction({
        to: recipientAddress,
        value: amountInWei,
      });
      
      const networkName = network === 'testnet' ? 'Sepolia' : 'Mainnet';
      toast.success(`${networkName} transaction successful! Hash: ${transaction.hash.slice(0, 8)}...`);
      console.log(`Transaction hash: ${transaction.hash}`);
      return transaction;
    } catch (error) {
      handleWalletError(error, 'send Ethereum');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   const autoFundAccounts = async () => {
  //     const solanaBalance= await getSolanaBalance(senderSolPublicKey);
  //    const ethBalance=  await getEthBalance(senderEthAddress);

  //     if (solanaBalance === 0 || solanaBalance === null) {
  //       try {
  //         await airdropSol(senderSolPublicKey);
  //       } catch (error) {
  //         console.error('Error requesting SOL airdrop:', error);
  //       }
  //     }

  //     if (ethBalance === "0.0" || ethBalance === null) {
  //       try {
  //         await requestSepoliaFaucet(senderEthAddress);
  //       } catch (error) {
  //         console.error('Error requesting Sepolia ETH from faucet:', error);
  //       }
  //     }
  //   };

  //   autoFundAccounts();
  // }, [senderSolPublicKey, senderEthAddress]);

  return { solanaBalance, ethBalance, getSolanaBalance, getEthBalance, sendSolana, sendEth, airdropSol, loading };
}

export { useWalletActions };

