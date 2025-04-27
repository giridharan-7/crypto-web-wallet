import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Connection, clusterApiUrl, Keypair, LAMPORTS_PER_SOL, Transaction, SystemProgram, sendAndConfirmTransaction, PublicKey } from '@solana/web3.js';
import crypto from 'crypto';
import {Buffer} from 'buffer';

const ethProvider = new ethers.getDefaultProvider('https://sepolia.infura.io/v3/f1eacd24f5a44535a14fc93a91e380a8');


const solConnection = new Connection(clusterApiUrl('devnet'), 'confirmed');

export const decryptPrivateKey = (encryptedPrivateKey, hashedPassword, saltForKey, iv) => {
  const key = crypto.pbkdf2Sync(hashedPassword, saltForKey, 10000, 16, 'sha256');
  const ivBuffer = Buffer.from(iv, 'hex');
  const decipher = crypto.createDecipheriv('aes-128-cbc', key, ivBuffer);
  let decrypted = decipher.update(encryptedPrivateKey, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

export const airdropSol = async (publicKey, amount) => {
  // setLoading(true);
  try {
    const signature = await solConnection.requestAirdrop(new PublicKey(publicKey), amount * LAMPORTS_PER_SOL);
    const latestBlockhash = await solConnection.getLatestBlockhash();
    await solConnection.confirmTransaction({
      signature,
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
    });
    console.log(`Airdrop successful! Signature: ${signature}`);
    // console.log(await getSolanaBalance(publicKey));
  } catch (error) {
    console.error('Error requesting SOL airdrop:', error);
  } finally {
    // setLoading(false);
  }
};

export const requestSepoliaFaucet = async (ethAddress) => {
  // setLoading(true);
  try {
   console.log("this is eth faucet")
    const response = await fetch('https://faucet.sepolia.dev/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address: ethAddress }),
    });
    const result = await response.json();
    console.log(result)
    if (result.success) {
      console.log(`Sepolia ETH faucet request successful! Transaction: ${result.txHash}`);
      // await getEthBalance(ethAddress); 
    } else {
      console.error('Faucet request failed:', result.message);
    }
  } catch (error) {
    console.error('Error requesting Sepolia ETH from faucet:', error);
  } finally {
    // setLoading(false);
  }
};


export default function useWalletActions(senderSolPublicKey, senderEthAddress) {
  const [solanaBalance, setSolanaBalance] = useState(null);
  const [ethBalance, setEthBalance] = useState(null);
  const [loading, setLoading] = useState(false);

  const getSolanaBalance = async (publicKey) => {
    // console.log("hi this is from this public key",publicKey)
    const Address=new PublicKey(publicKey);
    const balance = await solConnection.getBalance(Address);
    // console.log(publicKey,balance/LAMPORTS_PER_SOL)
    // setSolanaBalance(balance / LAMPORTS_PER_SOL);
    return balance / LAMPORTS_PER_SOL;
  };


  const getEthBalance = async (ethAddress) => {
    const balance = await ethProvider.getBalance(ethAddress);
    // console.log(balance)
    // setEthBalance(ethers.formatEther(balance)); 
    return ethers.formatEther(balance);
  };



  const sendSolana = async (senderPrivateKey, recipientAddress, amount) => {
    setLoading(true);
    try {
      const secretKeyArray=Uint8Array.from(senderPrivateKey.split(',').map(Number));
      // const privateKeyArray=Uint8Array.from(Buffer.from(senderPrivateKey, 'hex'));
      // const publicKeyArray=Uint8Array.from(Buffer.from(senderSolPublicKey, 'hex'));
      // const secretKeyArray=new Uint8Array([...privateKeyArray,...publicKeyArray]);
      // console.log(secretKeyArray.byteLength)
      const senderKeypair = Keypair.fromSecretKey(secretKeyArray);
      const lamportsToSend = amount * LAMPORTS_PER_SOL;
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: senderKeypair.publicKey,
          toPubkey: recipientAddress,
          lamports: lamportsToSend,
        })
      );
      const signature = await sendAndConfirmTransaction(solConnection, transaction, [senderKeypair]);
       console.log(`Transaction successful! Signature: ${signature}`);
    } catch (error) {
       console.error('Error sending SOL:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendEth = async (senderPrivateKey, recipientAddress, amount) => {
    setLoading(true);
    try {

      const wallet = new ethers.Wallet(senderPrivateKey, ethProvider);
      const transaction = await wallet.sendTransaction({
        to: recipientAddress,
        value: ethers.parseEther(amount),
      });
      console.log(`Transaction hash: ${transaction.hash}`);
    } catch (error) {
      console.error('Error sending ETH:', error);
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

