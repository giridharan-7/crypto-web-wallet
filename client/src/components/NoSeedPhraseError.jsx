import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import {Link} from 'react-router-dom'

export default function NoSeedPhraseError() {
  return (
    <div className="min-h-screen bg-[#1a1b23] flex flex-col items-center justify-center px-4 text-white">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex justify-center">
          <AlertTriangle className="h-16 w-16 text-yellow-500" aria-hidden="true" />
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">No Seed Phrase Found</h1>
        <p className="mt-2 text-lg text-gray-400">
          We couldn't locate your seed phrase. This could happen if you're accessing a new device or if your local storage has been cleared.
        </p>
        <div className="mt-6 space-y-4">
          <p className="text-sm text-gray-500">
            If you have a backup of your seed phrase, you can restore your wallet using it.
          </p>
          <Link
            href="/restore-wallet"
            className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-purple-500"
          >
            Restore Wallet
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-purple-600 bg-transparent border border-purple-600 rounded-md hover:bg-purple-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-purple-500"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Page
          </button>
        </div>
        <p className="mt-6 text-xs text-gray-500">
          If you believe this is an error, please contact our support team for assistance.
        </p>
      </div>
    </div>
  )
}