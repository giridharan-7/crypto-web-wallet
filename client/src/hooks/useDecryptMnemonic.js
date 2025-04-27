import { useState, useEffect } from 'react';
import crypto from 'crypto-browserify';
import { Buffer } from 'buffer';
globalThis.Buffer = globalThis.Buffer || Buffer;
const useDecryptMnemonic = (hashedPassword) => {
  const [loading, setIsLoading] = useState(true);
  const [decryptedData, setDecryptedData] = useState({ decryptedMnemonic: null, decryptedSeed: null });
  const [error, setError] = useState(null);
  
  const saltForKey = localStorage.getItem('saltForKey');
  const encryptedMnemonic = localStorage.getItem('encryptedMnemonic');
  const encryptedSeed = localStorage.getItem('encryptedSeed');
  const ivHex = localStorage.getItem('iv');
  console.log(saltForKey, encryptedMnemonic, encryptedSeed, ivHex)
  
  useEffect(() => {
    const decryptMnemonicAndSeed = () => {
      try {
        // console.log("inside from function decryptmenomicandseed")
        if (!saltForKey || !encryptedMnemonic || !encryptedSeed || !ivHex) {
          throw new Error('Missing encrypted data or salt in local storage.');
        }
      //  console.log("check1")
        const iv = new Uint8Array(ivHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
        // console.log("check2")

        const key = crypto.pbkdf2Sync(hashedPassword, saltForKey, 10000, 16, 'sha256'); 
        // console.log("check3")

        const decipherMnemonic = crypto.createDecipheriv('aes-128-cbc', key, iv); 
        let decryptedMnemonic = decipherMnemonic.update(encryptedMnemonic, 'hex', 'utf8');
        decryptedMnemonic += decipherMnemonic.final('utf8');

        // console.log("------------------------------------------------------------")
        // console.log(decipherMnemonic)

        const decipherSeed = crypto.createDecipheriv('aes-128-cbc', key, iv); 
        let decryptedSeed = decipherSeed.update(encryptedSeed, 'hex', 'utf8');
        decryptedSeed += decipherSeed.final('utf8');

        setDecryptedData({ decryptedMnemonic: decryptedMnemonic.split(' '), decryptedSeed });
      } catch (error) {
        // console.log("error in try block")
        // console.log(error)
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    decryptMnemonicAndSeed();
    // console.log("Decrypted mneomic is: ")
    console.log(decryptedData.decryptedMnemonic)
  }, [hashedPassword, saltForKey, encryptedMnemonic, encryptedSeed, ivHex]);

  return { loading, decryptedData, error };
};

export default useDecryptMnemonic;
