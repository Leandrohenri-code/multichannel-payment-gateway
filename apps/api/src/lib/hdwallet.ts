// src/lib/hdwallet.ts
// Derivação de endereços a partir de xPub sem nunca precisar da seed
// Dependências: npm install hdkey bitcoinjs-lib ethers
// A xPub só permite derivar endereços públicos (receive-only)
// O sistema NUNCA move fundos — apenas monitora recebimentos

// import HDKey from 'hdkey'
// import * as bitcoin from 'bitcoinjs-lib'
// import { ethers } from 'ethers'
// import { TronWeb } from 'tronweb'

export function deriveAddress(xPub: string, network: 'tron' | 'bitcoin' | 'bsc', index: number): string {
  if (!xPub) throw new Error(`Configure HD_WALLET_XPUB_${network.toUpperCase()} no .env`)

  // const root = HDKey.fromExtendedKey(xPub)
  // const child = root.derive(`m/0/${index}`)

  switch (network) {
    case 'tron': {
      // Deriva pubkey comprimida → converte para endereço TRON via TronWeb
      // const pubKeyHex = child.publicKey.toString('hex')
      // return TronWeb.address.fromPublicKey(pubKeyHex)
      throw new Error('[TODO] Instale hdkey e tronweb, descomente o código acima')
    }
    case 'bitcoin': {
      // const { address } = bitcoin.payments.p2wpkh({
      //   pubkey: child.publicKey,
      //   network: bitcoin.networks.bitcoin,
      // })
      // return address!
      throw new Error('[TODO] Instale hdkey e bitcoinjs-lib, descomente o código acima')
    }
    case 'bsc': {
      // const pubKey = '04' + child.publicKey.slice(1).toString('hex')
      // return ethers.computeAddress('0x' + pubKey)
      throw new Error('[TODO] Instale hdkey e ethers, descomente o código acima')
    }
  }
}

export async function getNextWalletIndex(prisma: any): Promise<number> {
  // Retorna o próximo índice disponível (auto-incremento baseado no banco)
  const result = await prisma.merchant.aggregate({ _max: { hdWalletIndex: true } })
  return (result._max.hdWalletIndex ?? -1) + 1
}

export function generateAllAddresses(xPubs: {
  tron: string
  bitcoin: string
  bsc: string
}, index: number): { trc20: string; btc: string; bep20: string } {
  return {
    trc20:  deriveAddress(xPubs.tron,    'tron',    index),
    btc:    deriveAddress(xPubs.bitcoin, 'bitcoin', index),
    bep20:  deriveAddress(xPubs.bsc,     'bsc',     index),
  }
}
