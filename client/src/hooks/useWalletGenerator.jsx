import { useState } from 'react';
import nacl from 'tweetnacl';
import { derivePath } from 'ed25519-hd-key';
import { Keypair } from '@solana/web3.js';
import { ethers, Mnemonic } from 'ethers';
import crypto from 'crypto'; 
import bcrypt from 'bcryptjs'; 
import { Buffer } from 'buffer';
import { HDNodeWallet } from 'ethers';

const useWalletGenerator = () => {
  const [error, setError] = useState(null);

  const generateWallets = (accountIndex, inputPassword) => {
    return new Promise((resolve) => {
      const hashedPassword = localStorage.getItem('hashedPassword');
      const saltForKey = localStorage.getItem('saltForKey');
      const encryptedMnemonic = localStorage.getItem('encryptedMnemonic');
      const encryptedSeed = localStorage.getItem('encryptedSeed');
      const iv = localStorage.getItem('iv');

      if (!hashedPassword || !saltForKey || !encryptedMnemonic || !encryptedSeed || !iv) {
        setError('Missing required data in local storage.');
        resolve();
        return;
      }
      const isPasswordCorrect = bcrypt.compareSync(inputPassword, hashedPassword);
      if (!isPasswordCorrect) {
        setError('Incorrect password.');
        resolve();
        return;
      }

      const key = crypto.pbkdf2Sync(hashedPassword, saltForKey, 10000, 16, 'sha256');

      const mnemonic = decryptData(encryptedMnemonic, key, iv);
      const seed = decryptData(encryptedSeed, key, iv);

      const solanaPathPrefix = `m/44'/501'/${accountIndex}'/0'`;
    //   const path = `${solanaPathPrefix}0`;
     console.log(solanaPathPrefix)
      const derivedSeed = derivePath(solanaPathPrefix, seed.toString('hex')).key;
      const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
      const solanaKeypair = Keypair.fromSecretKey(secret);

      localStorage.setItem(`acnt${accountIndex}solanawallet`, JSON.stringify({
        publicKey: solanaKeypair.publicKey.toBase58(),
        encryptedPrivateKey: encryptPrivateKey(secret, key, iv),
      }));

      const ethPath = `m/44'/60'/0'/0`;
      // console.log(mnemonic)
      const mnemonicInstance=Mnemonic.fromPhrase(mnemonic);
      const hdNode=ethers.HDNodeWallet.fromMnemonic(mnemonicInstance,ethPath+"/"+accountIndex);
      // const wallet = ethers.Wallet.fromPhrase(mnemonic, {path:ethPath});import { on } from 'events'

      const wallet=new ethers.Wallet(hdNode.privateKey);
      const encryptedPrivateKey = encryptPrivateKey(wallet.privateKey, key, iv);

      // console.log("etherium same key test")
      // console.log(ethPath)
      // console.log(wallet.address);
      // console.log(encryptPrivateKey)

      localStorage.setItem(`acnt${accountIndex}etherwallet`, JSON.stringify({
        publicKey: wallet.address,
        encryptedPrivateKey,
      }));

      setError(null); 
      resolve(); 
    });
  };

  const encryptPrivateKey = (privateKey, key, iv) => {
    // const ivBuffer = Uint8Array.from(atob(iv), c => c.charCodeAt(0));
    const ivb=Buffer.from(iv,'hex')
    // console.log(ivb)
    const cipher = crypto.createCipheriv('aes-128-cbc', key, ivb);
    let encrypted = cipher.update(privateKey.toString('hex'), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
};

const decryptData = (data, key, iv) => {
    try {
       
        const ivb=Buffer.from(iv,'hex')
        // console.log(ivb)
        const decipher = crypto.createDecipheriv('aes-128-cbc', key, ivb);
        let decrypted = decipher.update(data, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Decryption failed. Please check the input data and keys.');
    }
};

  

  return { generateWallets, error };
};

export default useWalletGenerator;
