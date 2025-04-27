import React, { useState, useEffect } from 'react'
import { Copy, Send, Plus, ChevronDown, X, ChevronRight } from 'lucide-react'
import useWalletGenerator from '../hooks/useWalletGenerator'
 import useWalletActions from '../hooks/useWalletActions'
 import { decryptPrivateKey ,airdropSol,requestSepoliaFaucet} from '../hooks/useWalletActions'


const PasswordModal = ({ isOpen, onClose, onSubmit }) => {
  const [password, setPassword] = useState('')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#2a2b35] rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Enter Password</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        <p className="text-gray-400 mb-4">Enter your password for encryption:</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-[#1a1b23] text-white border border-gray-700 rounded-md p-2 mb-4"
          placeholder="Enter password"
        />
        <div className="flex justify-end">
          <button
            onClick={() => onSubmit(password)}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}

const SendModal = ({ isOpen, onClose, wallet, index,type,onBalanceUpdate }) => {
  const [amount, setAmount] = useState('')
  const [receiverAddress, setReceiverAddress] = useState('')
  const senderSolanaAddress=JSON.parse(localStorage.getItem(`acnt${index}solanawallet`)).publicKey;
  const senderEthAddress=JSON.parse(localStorage.getItem(`acnt${index}etherwallet`)).publicKey;
  // console.log(senderSolanaAddress,senderEthAddress)
  const { sendSolana, sendEth,getSolanaBalance,getEthBalance } = useWalletActions(senderSolanaAddress,senderEthAddress)
  
  

  if (!isOpen) return null

  const handleSend = async () => {
    const hashedPassword=localStorage.getItem('hashedPassword')
    const saltForKey=localStorage.getItem('saltForKey')
    const iv=localStorage.getItem('iv')
    const walletInfo=localStorage.getItem(`acnt${index}${type=="Ethereum"?"ether":type.toLowerCase()}wallet`);
    // console.log(type)
    // console.log(`acnt${index}${type=="Etherium"?"ether":type.toLowerCase()}wallet`)
    // console.log(JSON.parse(walletInfo))
    const encryptedPrivateKey=JSON.parse(walletInfo).encryptedPrivateKey
    // console.log(encryptedPrivateKey)
    // console.log(encryptedPrivateKey)
    const decryptedPrivateKey=decryptPrivateKey(encryptedPrivateKey,hashedPassword,saltForKey,iv)
    if(type==='Solana'){
      await sendSolana(decryptedPrivateKey,receiverAddress,amount)

      // toast.success("Transaction successfull")
      const SenderSolanaBalance=await getSolanaBalance(senderSolanaAddress)
      const ReceiverSolanaBalance=await getSolanaBalance(receiverAddress)
      onBalanceUpdate(SenderSolanaBalance,type)
      onBalanceUpdate(ReceiverSolanaBalance,type)

      console.log(SenderSolanaBalance,ReceiverSolanaBalance)


    } else if(type==='Ethereum'){
      await sendEth(decryptedPrivateKey,receiverAddress,amount)
      // toast.success("Transaction successfull")
      const SenderEthBalance=await getEthBalance(senderEthAddress)
      const ReceiverEthBalance=await getEthBalance(receiverAddress)
      onBalanceUpdate(SenderEthBalance,type)
      onBalanceUpdate(ReceiverEthBalance,type)
    }
    // console.log(`Sending ${amount} ${type} to ${receiverAddress}`)
    onClose()
  }

  const handleAirDrop = async () => {
    if(type=="Solana"){
        await airdropSol(senderSolanaAddress,amount)
        onBalanceUpdate(await getSolanaBalance(senderSolanaAddress),type)
    }
    else if(type=="Ethereum"){
      console.log("hi")
        await requestSepoliaFaucet(senderEthAddress)
        onBalanceUpdate(await getEthBalance(senderEthAddress),type)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#2a2b35] rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Send {type}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="senderAddress" className="block text-sm font-medium text-gray-400">Sender Address</label>
            <input
              type="text"
              id="senderAddress"
              value={wallet.publicKey}
              readOnly
              className="mt-1 w-full bg-[#1a1b23] text-white border border-gray-700 rounded-md p-2"
            />
          </div>
          <div>
            <label htmlFor="receiverAddress" className="block text-sm font-medium text-gray-400">Receiver Address</label>
            <input
              type="text"
              id="receiverAddress"
              value={receiverAddress}
              onChange={(e) => setReceiverAddress(e.target.value)}
              className="mt-1 w-full bg-[#1a1b23] text-white border border-gray-700 rounded-md p-2"
              placeholder="Enter receiver's address"
            />
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-400">Amount</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 w-full bg-[#1a1b23] text-white border border-gray-700 rounded-md p-2"
              placeholder={`Enter amount in ${type === 'Solana' ? 'SOL' : 'ETH'}`}
            />
          </div>
        </div>
        <div className="mt-6 flex justify-around">
          <button
            onClick={handleAirDrop}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
          >
            Request AirDrop
          </button>
          <button
            onClick={handleSend}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

const WalletCard = ({ wallet, index, type }) => {
  const [isSendModalOpen, setIsSendModalOpen] = useState(false)
  const senderSolanaAddress = JSON.parse(localStorage.getItem(`acnt${index}solanawallet`)).publicKey;
  const senderEthAddress = JSON.parse(localStorage.getItem(`acnt${index}etherwallet`)).publicKey;
  // console.log(senderSolanaAddress,senderEthAddress)
  const { getSolanaBalance, getEthBalance,airdropSol } = useWalletActions(senderSolanaAddress, senderEthAddress)
  
  const [solBalance, setSolBalance] = useState(0)
   const [ethBalance, setEthBalance] = useState(0)
  // const setData=async ()=>{
  //   // await airdropSol(senderSolanaAddress)
  //   console.log("hi his is for test",await getSolanaBalance("6vzDhiWSpJeFcjv6CiaEGNq5VQ79TkqxqyA7cAkCSAzu"))
  //   await getEthBalance(senderEthAddress)
  // }
  // setData()
  useEffect(()=>{
      const setData=async ()=>{
        // await airdropSol(senderSolanaAddress)
        if(type=="Solana"){
          setSolBalance(await getSolanaBalance(senderSolanaAddress)) 
        }
        else if(type=="Ethereum"){
          setEthBalance(await getEthBalance(senderEthAddress))
        }
       
      }
      setData()
  },[])

  // const [balance,setBalance]=useState(0);
  // const [balance2,setBalance2]=useState(0);
  // const test=async()=>{
  //   if(type=="Solana"){
  //     console.log("hi this is for test")
  //     setBalance(await getSolanaBalance(senderSolanaAddress))
     
  //   } if(type=="Etherium"){
  //     setBalance2(await getEthBalance(senderEthAddress))
  //   }
  // }
  // test()

  // console.log("data of test balance",balance)

  // console.log(solBalance,ethBalance)

  const [WalletStatus, setWalletStatus] = useState({
    balance: type == 'solana' ? solBalance:ethBalance,
    publicKey: type == 'Solana' ? senderSolanaAddress : senderEthAddress,
  })

//  console.log(type,WalletStatus)

  const updateBalance=(newBalance,type)=>{
    if(type=='Solana'){
      setSolBalance(newBalance)
    } else if(type=='Ethereum'){
      setEthBalance(newBalance)
    } 
  }
 

  return (
    <div className="bg-[#2a2b35] rounded-lg p-4 mb-4 relative overflow-hidden group">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-white">{type} Wallet</h3>
        <span className="text-sm text-gray-400">Balance:{type=="Solana"?solBalance:ethBalance}</span>
      </div>
      <div className="flex justify-between items-center">
        <button 
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors flex items-center"
          onClick={() => setIsSendModalOpen(true)}
        >
          <Send className="w-4 h-4 mr-2" />
          Send
        </button>
        <div className="relative">
          <div className="text-gray-400 text-sm truncate w-32 group-hover:invisible">
            {WalletStatus.publicKey.slice(0, 8)}...{WalletStatus.publicKey.slice(-8)}
          </div>
          <div className="absolute inset-0 flex items-center invisible group-hover:visible">
            <button
              onClick={() => navigator.clipboard.writeText(wallet.publicKey)}
              className="text-purple-500 hover:text-purple-600 transition-colors flex items-center"
            >
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </button>
          </div>
        </div>
      </div>
      <SendModal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        wallet={wallet}
        index={index}
        type={type}
        onBalanceUpdate={updateBalance} 
      />
    </div>
  )
}

const AccountCard = ({ account }) => {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="mb-8 bg-[#2a2b35] rounded-lg overflow-hidden">
      <div 
        className="flex justify-between items-center p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-xl font-semibold">Account {account.index}</h2>
        <div className="flex items-center">
          <button className="text-gray-400 hover:text-white transition-colors flex items-center mr-4">
            <ChevronDown className="w-4 h-4 mr-1" />
            More options
          </button>
          <ChevronRight 
            className={`w-6 h-6 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} 
          />
        </div>
      </div>
      {isExpanded && (
        <div className="p-4 pt-0">
          <WalletCard wallet={account.solanaWallet} index={account.index} type="Solana" />
          <WalletCard wallet={account.etherWallet} index={account.index} type="Ethereum" />
        </div>
      )}
    </div>
  )
}

export default function Wallet() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const { generateWallets, error } = useWalletGenerator()

  useEffect(() => {
    loadAccounts()
  }, [])

  const loadAccounts = () => {
    const loadedAccounts = []
    let index = 1
    while (true) {
      const solanaWallet = localStorage.getItem(`acnt${index}solanawallet`)
      const etherWallet = localStorage.getItem(`acnt${index}etherwallet`)
      if (!solanaWallet && !etherWallet) break

      loadedAccounts.push({
        index,
        solanaWallet: JSON.parse(solanaWallet),
        etherWallet: JSON.parse(etherWallet),
      })
      index++
    }
    setAccounts(loadedAccounts)
  }

  const handleGenerateWallets = async (password) => {
    setLoading(true)
    setIsPasswordModalOpen(false)

    const accountIndex = accounts.length + 1
    await generateWallets(accountIndex, password)
    loadAccounts()
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#1a1b23] text-white p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Wallets</h1>
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            disabled={loading}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              'Generating...'
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add Account
              </>
            )}
          </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {accounts.length === 0 ? (
          <p className="text-gray-400">No wallets available. Please add an account.</p>
        ) : (
          accounts.map((account) => (
            <AccountCard key={account.index} account={account} />
          ))
        )}
      </div>

      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSubmit={handleGenerateWallets}
      />
    </div>
  )
}