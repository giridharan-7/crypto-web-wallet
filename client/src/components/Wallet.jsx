import React, { useState, useEffect } from 'react'
import { Copy, Send, Plus, ChevronDown, X, ChevronRight, History, RefreshCw, TestTube, AlertTriangle } from 'lucide-react'
import useWalletGenerator from '../hooks/useWalletGenerator'
import useWalletActions from '../hooks/useWalletActions'
import { decryptPrivateKey ,airdropSol,requestSepoliaFaucet} from '../hooks/useWalletActions'
import TransactionHistory from './TransactionHistory'
import TestModePanel from './TestModePanel'
import NetworkSwitcher from './NetworkSwitcher'
import { validateAddress } from '../utils/errorHandler'
import { toast } from 'react-toastify'


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
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const senderSolanaAddress=JSON.parse(localStorage.getItem(`acnt${index}solanawallet`)).publicKey;
  const senderEthAddress=JSON.parse(localStorage.getItem(`acnt${index}etherwallet`)).publicKey;
  const { sendSolana, sendEth,getSolanaBalance,getEthBalance } = useWalletActions(senderSolanaAddress,senderEthAddress)
  
  

  if (!isOpen) return null

  const validateInputs = () => {
    const newErrors = {}
    
    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount'
    }
    
    if (!receiverAddress) {
      newErrors.receiverAddress = 'Please enter a receiver address'
    } else if (!validateAddress(receiverAddress, type.toLowerCase())) {
      newErrors.receiverAddress = `Invalid ${type} address format`
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSend = async () => {
    if (!validateInputs()) {
      return
    }

    setIsLoading(true)
    try {
      const hashedPassword=localStorage.getItem('hashedPassword')
      const saltForKey=localStorage.getItem('saltForKey')
      const iv=localStorage.getItem('iv')
      const walletInfo=localStorage.getItem(`acnt${index}${type=="Ethereum"?"ether":type.toLowerCase()}wallet`);
      const encryptedPrivateKey=JSON.parse(walletInfo).encryptedPrivateKey
      const decryptedPrivateKey=decryptPrivateKey(encryptedPrivateKey,hashedPassword,saltForKey,iv)
      
      if(type==='Solana'){
        await sendSolana(decryptedPrivateKey,receiverAddress,amount)
        const SenderSolanaBalance=await getSolanaBalance(senderSolanaAddress)
        onBalanceUpdate(SenderSolanaBalance,type)
      } else if(type==='Ethereum'){
        await sendEth(decryptedPrivateKey,receiverAddress,amount)
        const SenderEthBalance=await getEthBalance(senderEthAddress)
        onBalanceUpdate(SenderEthBalance,type)
      }
      
      // Clear form and close modal
      setAmount('')
      setReceiverAddress('')
      setErrors({})
      onClose()
    } catch (error) {
      // Error handling is done in the wallet actions
    } finally {
      setIsLoading(false)
    }
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
              onChange={(e) => {
                setReceiverAddress(e.target.value)
                if (errors.receiverAddress) {
                  setErrors(prev => ({ ...prev, receiverAddress: '' }))
                }
              }}
              className={`mt-1 w-full bg-[#1a1b23] text-white border rounded-md p-2 ${
                errors.receiverAddress ? 'border-red-500' : 'border-gray-700'
              }`}
              placeholder="Enter receiver's address"
            />
            {errors.receiverAddress && (
              <p className="mt-1 text-sm text-red-400">{errors.receiverAddress}</p>
            )}
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-400">Amount</label>
            <input
              type="number"
              step="any"
              min="0"
              id="amount"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value)
                if (errors.amount) {
                  setErrors(prev => ({ ...prev, amount: '' }))
                }
              }}
              className={`mt-1 w-full bg-[#1a1b23] text-white border rounded-md p-2 ${
                errors.amount ? 'border-red-500' : 'border-gray-700'
              }`}
              placeholder={`Enter amount in ${type === 'Solana' ? 'SOL' : 'ETH'}`}
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-400">{errors.amount}</p>
            )}
          </div>
        </div>
        <div className="mt-6 flex justify-around">
          <button
            onClick={handleAirDrop}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Request AirDrop'}
          </button>
          <button
            onClick={handleSend}
            disabled={isLoading || !amount || !receiverAddress}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              'Send'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

const WalletCard = ({ wallet, index, type, currentNetwork }) => {
  const [isSendModalOpen, setIsSendModalOpen] = useState(false)
  const [showTransactions, setShowTransactions] = useState(false)
  const [showTestMode, setShowTestMode] = useState(false)
  const [balanceLoading, setBalanceLoading] = useState(false)
  const senderSolanaAddress = JSON.parse(localStorage.getItem(`acnt${index}solanawallet`)).publicKey;
  const senderEthAddress = JSON.parse(localStorage.getItem(`acnt${index}etherwallet`)).publicKey;
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

  const refreshBalance = async () => {
    setBalanceLoading(true)
    try {
      if(type=="Solana"){
        const newBalance = await getSolanaBalance(senderSolanaAddress)
        setSolBalance(newBalance)
      } else if(type=="Ethereum"){
        const newBalance = await getEthBalance(senderEthAddress)
        setEthBalance(newBalance)
      }
    } catch (error) {
      toast.error('Failed to refresh balance')
    } finally {
      setBalanceLoading(false)
    }
  }
 

  return (
    <div className="bg-[#2a2b35] rounded-lg p-4 mb-4 relative overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">{type} Wallet</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={refreshBalance}
            disabled={balanceLoading}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded"
            title="Refresh balance"
          >
            <RefreshCw className={`w-4 h-4 ${balanceLoading ? 'animate-spin' : ''}`} />
          </button>
          <span className="text-sm text-gray-400">
            Balance: {balanceLoading ? '...' : (type=="Solana"?solBalance:ethBalance)} {type === 'Solana' ? 'SOL' : 'ETH'}
          </span>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <button 
              className="bg-purple-600 text-white px-3 py-2 rounded-md hover:bg-purple-700 transition-colors flex items-center text-sm"
              onClick={() => setIsSendModalOpen(true)}
            >
              <Send className="w-4 h-4 mr-1" />
              Send
            </button>
            <button
              onClick={() => setShowTransactions(!showTransactions)}
              className="bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center text-sm"
            >
              <History className="w-4 h-4 mr-1" />
              History
            </button>
            {currentNetwork === 'testnet' && (
              <button
                onClick={() => setShowTestMode(!showTestMode)}
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-2 rounded-md hover:from-amber-600 hover:to-orange-600 transition-colors flex items-center text-sm"
              >
                <TestTube className="w-4 h-4 mr-1" />
                Test Mode
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 text-xs">
              {WalletStatus.publicKey.slice(0, 6)}...{WalletStatus.publicKey.slice(-6)}
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(wallet.publicKey)
                toast.success('Address copied!')
              }}
              className="text-purple-500 hover:text-purple-600 transition-colors flex items-center p-1 rounded"
              title="Copy address"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {showTestMode && currentNetwork === 'testnet' && (
          <div className="mt-4">
            <TestModePanel 
              walletAddress={WalletStatus.publicKey}
              type={type}
              onBalanceUpdate={updateBalance}
              getSolanaBalance={getSolanaBalance}
              getEthBalance={getEthBalance}
            />
          </div>
        )}

        {showTransactions && (
          <div className="mt-4">
            <TransactionHistory 
              walletAddress={WalletStatus.publicKey} 
              type={type.toLowerCase()} 
            />
          </div>
        )}
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

const AccountCard = ({ account, currentNetwork }) => {
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
          <WalletCard wallet={account.solanaWallet} index={account.index} type="Solana" currentNetwork={currentNetwork} />
          <WalletCard wallet={account.etherWallet} index={account.index} type="Ethereum" currentNetwork={currentNetwork} />
        </div>
      )}
    </div>
  )
}

export default function Wallet() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [currentNetwork, setCurrentNetwork] = useState('testnet')
  const { generateWallets, error } = useWalletGenerator()

  useEffect(() => {
    // Load network preference
    const savedNetwork = localStorage.getItem('network') || 'testnet'
    setCurrentNetwork(savedNetwork)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    window.location.href = '/login'
  }

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
    <div className="min-h-screen bg-[#1a1b23] text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-[#2a2b35]">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">Crypto Wallet</h1>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-400">
                  {accounts.length} account{accounts.length !== 1 ? 's' : ''}
                </span>
                <NetworkSwitcher />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                disabled={loading}
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Account
                  </>
                )}
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Mainnet Warning */}
        {currentNetwork === 'mainnet' && (
          <div className="bg-gradient-to-r from-red-900/30 to-red-800/30 border border-red-700/50 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="bg-red-600 p-2 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-red-200 font-semibold mb-1">⚠️ Mainnet Mode Active</h3>
                <p className="text-red-300/80 text-sm leading-relaxed">
                  You are using real cryptocurrency networks. All transactions will cost real money and cannot be undone. 
                  Double-check all addresses and amounts before sending.
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6">
            <p>{error}</p>
          </div>
        )}

        {accounts.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-[#2a2b35] rounded-lg p-8 max-w-md mx-auto">
              <Plus className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No wallets yet</h3>
              <p className="text-gray-400 mb-6">
                Create your first wallet account to start managing your crypto assets.
              </p>
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                disabled={loading}
                className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition-colors flex items-center mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 mr-2" />
                    Create First Wallet
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {accounts.map((account) => (
              <AccountCard key={account.index} account={account} currentNetwork={currentNetwork} />
            ))}
          </div>
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