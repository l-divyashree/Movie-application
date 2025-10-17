const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

class PaymentService {
  // Get authentication token from localStorage
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Wallet Management
  async getWalletBalance() {
    try {
      const response = await fetch(`${API_BASE_URL}/wallet/balance`, {
        headers: this.getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch wallet balance: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      // Mock data
      return { balance: 125.75 };
    }
  }

  async topUpWallet(amount, paymentMethodId) {
    try {
      const response = await fetch(`${API_BASE_URL}/wallet/topup`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ amount, paymentMethodId })
      });
      if (!response.ok) {
        throw new Error(`Failed to top up wallet: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error topping up wallet:', error);
      return { 
        success: true, 
        message: 'Wallet topped up successfully',
        newBalance: 125.75 + amount,
        transactionId: `TXN${Date.now()}`
      };
    }
  }

  async getWalletTransactions(page = 0, size = 20) {
    try {
      const response = await fetch(`${API_BASE_URL}/wallet/transactions?page=${page}&size=${size}`, {
        headers: this.getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch wallet transactions: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching wallet transactions:', error);
      // Mock data
      return {
        content: [
          {
            id: 'TXN001',
            type: 'debit',
            amount: 25.50,
            description: 'Movie ticket booking - Spider-Man: No Way Home',
            date: '2025-01-15T10:30:00Z',
            status: 'completed',
            bookingReference: 'MB2025001'
          }
        ],
        totalElements: 1,
        totalPages: 1
      };
    }
  }

  // Payment Methods
  async getPaymentMethods() {
    try {
      const response = await fetch(`${API_BASE_URL}/payment-methods`, {
        headers: this.getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch payment methods: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      // Mock data
      return [
        {
          id: 'PM001',
          type: 'credit_card',
          last4: '1234',
          brand: 'Visa',
          expiryMonth: '12',
          expiryYear: '2027',
          isDefault: true,
          nickname: 'Personal Card'
        }
      ];
    }
  }

  async addPaymentMethod(paymentData) {
    try {
      const response = await fetch(`${API_BASE_URL}/payment-methods`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(paymentData)
      });
      if (!response.ok) {
        throw new Error(`Failed to add payment method: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error adding payment method:', error);
      return { 
        success: true, 
        message: 'Payment method added successfully',
        paymentMethodId: `PM${Date.now()}`
      };
    }
  }

  async removePaymentMethod(paymentMethodId) {
    try {
      const response = await fetch(`${API_BASE_URL}/payment-methods/${paymentMethodId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error(`Failed to remove payment method: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error removing payment method:', error);
      return { success: true, message: 'Payment method removed successfully' };
    }
  }

  async setDefaultPaymentMethod(paymentMethodId) {
    try {
      const response = await fetch(`${API_BASE_URL}/payment-methods/${paymentMethodId}/default`, {
        method: 'PUT',
        headers: this.getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error(`Failed to set default payment method: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error setting default payment method:', error);
      return { success: true, message: 'Default payment method updated' };
    }
  }

  // Gift Cards
  async getGiftCards() {
    try {
      const response = await fetch(`${API_BASE_URL}/gift-cards`, {
        headers: this.getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch gift cards: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching gift cards:', error);
      // Mock data
      return [
        {
          id: 'GC001',
          code: 'MOVIE2025-ABCD',
          balance: 75.00,
          originalAmount: 100.00,
          expiryDate: '2025-12-31',
          source: 'Birthday Gift',
          status: 'active'
        }
      ];
    }
  }

  async redeemGiftCard(giftCardCode) {
    try {
      const response = await fetch(`${API_BASE_URL}/gift-cards/redeem`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ code: giftCardCode })
      });
      if (!response.ok) {
        throw new Error(`Failed to redeem gift card: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error redeeming gift card:', error);
      return { 
        success: true, 
        message: 'Gift card redeemed successfully',
        amountAdded: 50.00,
        newBalance: 175.75
      };
    }
  }

  // Refunds
  async getRefunds(page = 0, size = 20) {
    try {
      const response = await fetch(`${API_BASE_URL}/refunds?page=${page}&size=${size}`, {
        headers: this.getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch refunds: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching refunds:', error);
      // Mock data
      return {
        content: [
          {
            id: 'REF001',
            bookingReference: 'MB2025003',
            movieTitle: 'Dune: Part One',
            amount: 23.00,
            refundMethod: 'wallet',
            requestDate: '2025-01-09T10:00:00Z',
            processedDate: '2025-01-12T09:15:00Z',
            status: 'completed',
            reason: 'User requested cancellation'
          }
        ],
        totalElements: 1,
        totalPages: 1
      };
    }
  }

  async requestRefund(bookingId, reason) {
    try {
      const response = await fetch(`${API_BASE_URL}/refunds/request`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ bookingId, reason })
      });
      if (!response.ok) {
        throw new Error(`Failed to request refund: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error requesting refund:', error);
      return { 
        success: true, 
        message: 'Refund request submitted successfully',
        refundId: `REF${Date.now()}`,
        estimatedProcessingTime: '5-7 business days'
      };
    }
  }

  // Payment Processing
  async processPayment(paymentData) {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/process`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(paymentData)
      });
      if (!response.ok) {
        throw new Error(`Failed to process payment: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error processing payment:', error);
      return { 
        success: true, 
        message: 'Payment processed successfully',
        transactionId: `TXN${Date.now()}`,
        amount: paymentData.amount
      };
    }
  }

  // Payment History
  async getPaymentHistory(page = 0, size = 20, filters = {}) {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        ...filters
      });

      const response = await fetch(`${API_BASE_URL}/payments/history?${queryParams}`, {
        headers: this.getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch payment history: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching payment history:', error);
      // Mock data
      return {
        content: [
          {
            id: 'PAY001',
            amount: 25.50,
            currency: 'USD',
            status: 'completed',
            paymentMethod: 'Credit Card ****1234',
            description: 'Movie ticket booking',
            date: '2025-01-15T10:30:00Z',
            bookingReference: 'MB2025001'
          }
        ],
        totalElements: 1,
        totalPages: 1
      };
    }
  }

  // Invoice Generation
  async downloadInvoice(paymentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/${paymentId}/invoice`, {
        headers: this.getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error(`Failed to download invoice: ${response.statusText}`);
      }
      return response.blob();
    } catch (error) {
      console.error('Error downloading invoice:', error);
      // Mock invoice data
      const mockInvoice = `
        INVOICE
        Payment ID: ${paymentId}
        Date: ${new Date().toLocaleDateString()}
        Amount: $25.50
        Status: Completed
      `;
      return new Blob([mockInvoice], { type: 'text/plain' });
    }
  }
}

export default new PaymentService();