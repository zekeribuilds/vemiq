interface PaystackTransaction {
  amount: number;
  email: string;
  reference: string;
  metadata?: Record<string, any>;
}

interface PaystackResponse {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export class PaystackService {
  private secretKey: string;
  private baseUrl: string;

  constructor(secretKey: string, baseUrl: string = 'https://api.paystack.co') {
    this.secretKey = secretKey;
    this.baseUrl = baseUrl;
  }

  private async request(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Paystack API error: ${response.statusText}`);
    }

    return response.json();
  }

  async initializeTransaction(transaction: PaystackTransaction): Promise<PaystackResponse> {
    const response = await this.request('/transaction/initialize', {
      method: 'POST',
      body: JSON.stringify({
        amount: transaction.amount * 100, // Paystack expects amount in kobo
        email: transaction.email,
        reference: transaction.reference,
        metadata: transaction.metadata,
      }),
    });

    return response;
  }

  async verifyTransaction(reference: string): Promise<any> {
    const response = await this.request(`/transaction/verify/${reference}`);
    return response;
  }

  generateReference(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `vemiq_${timestamp}_${random}`;
  }
}

// Singleton instance
let paystackServiceInstance: PaystackService | null = null;

export function getPaystackService(): PaystackService {
  if (!paystackServiceInstance) {
    const secretKey = process.env.PAYSTACK_SECRET_KEY || '';
    if (!secretKey) {
      throw new Error('PAYSTACK_SECRET_KEY environment variable is not set');
    }
    paystackServiceInstance = new PaystackService(secretKey);
  }
  return paystackServiceInstance;
}
