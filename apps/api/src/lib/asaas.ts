// src/lib/asaas.ts
// PLACEHOLDER — Integração com Asaas API

export const ASAAS_BASE_URL = process.env.ASAAS_ENVIRONMENT === 'production'
  ? 'https://api.asaas.com/v3'
  : 'https://sandbox.asaas.com/api/v3'

function checkApiKey() {
  if (!process.env.ASAAS_API_KEY) {
    throw new Error('Configure ASAAS_API_KEY no .env — veja README.md')
  }
}

export async function createCustomer(data: any) {
  checkApiKey();
  // TODO
}

export async function createRecipient(data: any) {
  checkApiKey();
  // TODO
}

export async function createCharge(data: any) {
  checkApiKey();
  // TODO
}

export async function getCharge(id: string) {
  checkApiKey();
  // TODO
}

export async function createWithdrawal(recipientId: string, amount: number, pixKey: string) {
  checkApiKey();
  // TODO
}

export async function getRecipientBalance(recipientId: string) {
  checkApiKey();
  // TODO
}

export async function validateWebhook(token: string) {
  checkApiKey();
  // TODO
}
