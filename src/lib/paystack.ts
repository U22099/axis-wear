

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';
const isPaystackConfigured = Boolean(PAYSTACK_SECRET_KEY);

export interface PaystackInitResponse {
  success: boolean;
  authorizationUrl?: string;
  reference?: string;
  error?: string;
}

export interface PaystackVerifyResponse {
  success: boolean;
  status?: 'success' | 'failed' | 'pending';
  reference?: string;
  amount?: number;
  metadata?: any;
  error?: string;
}

export const paystack = {
  isMock: !isPaystackConfigured,

  async initializeTransaction(
    email: string,
    amountInUSD: number,
    originUrl: string,
    metadata: { orderId: string; userId: string | null; items: any[] }
  ): Promise<PaystackInitResponse> {
    const amountInNGNKobo = Math.round(amountInUSD * 1600 * 100); // 1 USD = 1600 NGN, converted to Kobo
    const reference = `pay-${Math.random().toString(36).substr(2, 9)}-${Date.now()}`;

    if (!isPaystackConfigured) {

      console.log(`[MOCK PAYSTACK] Initializing payment for ${email} of amount $${amountInUSD} (converted: ₦${amountInUSD * 1600})`);
      return {
        success: true,
        authorizationUrl: `${originUrl}/checkout?mock_pay_reference=${reference}`,
        reference
      };
    }

    try {
      const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          amount: amountInNGNKobo,
          reference,
          callback_url: `${originUrl}/checkout?paystack_verify_reference=${reference}`,
          metadata,
          currency: 'NGN',
        }),
      });

      const result = await response.json();
      if (result.status) {
        return {
          success: true,
          authorizationUrl: result.data.authorization_url,
          reference: result.data.reference
        };
      }
      return {
        success: false,
        error: result.message || 'Initialization failed'
      };
    } catch (err: any) {
      console.error('Paystack initialization error:', err);
      return {
        success: false,
        error: err.message || 'Network error occurred'
      };
    }
  },

  async verifyTransaction(reference: string): Promise<PaystackVerifyResponse> {
    if (!isPaystackConfigured) {

      console.log(`[MOCK PAYSTACK] Verifying mock reference: ${reference}`);
      if (reference.startsWith('pay-')) {
        return {
          success: true,
          status: 'success',
          reference,
          amount: 0, // Mock
        };
      }
      return {
        success: false,
        status: 'failed',
        error: 'Invalid mock reference'
      };
    }

    try {
      const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      });

      const result = await response.json();
      if (result.status && result.data.status === 'success') {
        return {
          success: true,
          status: 'success',
          reference: result.data.reference,
          amount: result.data.amount / 100, // In main currency subunit
          metadata: result.data.metadata
        };
      }

      return {
        success: false,
        status: result.data?.status || 'failed',
        error: result.message || 'Verification failed'
      };
    } catch (err: any) {
      console.error('Paystack verification error:', err);
      return {
        success: false,
        status: 'pending',
        error: err.message || 'Network error'
      };
    }
  }
};
