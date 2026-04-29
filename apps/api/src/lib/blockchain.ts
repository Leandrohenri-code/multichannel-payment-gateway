// src/lib/blockchain.ts
// Monitora transações nas blockchains usando APIs públicas gratuitas
// TRON:    https://api.trongrid.io/v1/accounts/{address}/transactions/trc20
// Bitcoin: https://blockstream.info/api/address/{address}/utxo
// BSC:     https://api.bscscan.com/api (tier gratuito: 100k req/dia)

const USDT_TRC20_CONTRACT = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'

export interface Transaction {
  txHash: string
  amount: number
  currency: string
  confirmedAt: Date
  confirmations: number
}

export async function getUsdtTrc20Balance(address: string): Promise<number> {
  const res = await fetch(
    `https://api.trongrid.io/v1/accounts/${address}/tokens?limit=20`
  )
  if (!res.ok) throw new Error('TronGrid API error')
  const data: any = await res.json()
  const usdt = (data.data ?? []).find((t: any) => t.tokenId === USDT_TRC20_CONTRACT)
  return usdt ? Number(usdt.balance) / 1e6 : 0
}

export async function getUsdtTrc20Transactions(address: string, since?: Date): Promise<Transaction[]> {
  const params = new URLSearchParams({
    contract_address: USDT_TRC20_CONTRACT,
    limit: '50',
    only_to: 'true',
    ...(since ? { min_timestamp: since.getTime().toString() } : {}),
  })
  const res = await fetch(
    `https://api.trongrid.io/v1/accounts/${address}/transactions/trc20?${params}`
  )
  if (!res.ok) throw new Error('TronGrid API error')
  const data: any = await res.json()
  return (data.data ?? []).map((tx: any) => ({
    txHash:       tx.transaction_id,
    amount:       Number(tx.value) / 1e6,
    currency:     'USDT',
    confirmedAt:  new Date(tx.block_timestamp),
    confirmations: 19, // TRON confirma em ~19 blocos (~1min)
  }))
}

export async function getBtcBalance(address: string): Promise<number> {
  const res = await fetch(`https://blockstream.info/api/address/${address}`)
  if (!res.ok) throw new Error('Blockstream API error')
  const data: any = await res.json()
  return (data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum) / 1e8
}

export async function confirmPayment(order: {
  cryptoAddress: string | null
  cryptoTxHash: string | null
  paymentMethod: string
  cryptoAmount: any
}): Promise<boolean> {
  if (!order.cryptoAddress || !order.cryptoTxHash) return false

  if (order.paymentMethod === 'CRYPTO_USDT_TRC20') {
    const txs = await getUsdtTrc20Transactions(order.cryptoAddress)
    const tx = txs.find(t => t.txHash === order.cryptoTxHash)
    return tx ? tx.confirmations >= 19 : false
  }

  if (order.paymentMethod === 'CRYPTO_BTC_ONCHAIN') {
    const res = await fetch(`https://blockstream.info/api/tx/${order.cryptoTxHash}`)
    if (!res.ok) return false
    const data: any = await res.json()
    return (data.status?.block_height ?? 0) > 0 && data.status?.confirmed === true
  }

  return false
}

export function watchAddress(
  address: string,
  expectedAmount: number,
  currency: 'USDT' | 'BTC',
  expiresAt: Date,
  callback: (txHash: string) => void
): () => void {
  const INTERVAL_MS = 30_000
  let cancelled = false

  async function poll() {
    if (cancelled || new Date() > expiresAt) return

    try {
      if (currency === 'USDT') {
        const txs = await getUsdtTrc20Transactions(address, new Date(Date.now() - INTERVAL_MS * 2))
        const found = txs.find(t => t.amount >= expectedAmount * 0.99) // 1% tolerance
        if (found) { callback(found.txHash); return }
      }
    } catch { /* silently retry */ }

    if (!cancelled) setTimeout(poll, INTERVAL_MS)
  }

  poll()
  return () => { cancelled = true }
}

export async function calculateCryptoAmount(brlAmount: number, currency: 'USDT' | 'BTC'): Promise<number> {
  // Foxbit pública — sem autenticação necessária
  const market = currency === 'USDT' ? 'usdt-brl' : 'btc-brl'
  const res = await fetch(`https://api.foxbit.com.br/rest/v3/markets/${market}/ticker`)
  if (!res.ok) throw new Error('Foxbit ticker API error')
  const data: any = await res.json()
  const rate = parseFloat(data.data?.best_ask ?? data.data?.last_price)
  if (!rate) throw new Error('Não foi possível obter cotação')
  return brlAmount / rate
}
