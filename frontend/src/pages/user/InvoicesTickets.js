import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import bookingService from '../../services/bookingService';
import paymentService from '../../services/paymentService';

const InvoicesTickets = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('invoices');
  const [invoices, setInvoices] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showResendModal, setShowResendModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load invoices and tickets using services
      const [invoicesData, ticketsData] = await Promise.all([
        paymentService.getInvoices(),
        bookingService.getUserTickets()
      ]);
      
      setInvoices(invoicesData.invoices || []);
      setTickets(ticketsData.tickets || []);

    } catch (error) {
      console.error('Error loading data:', error);
      // Set empty arrays as fallback
      setInvoices([]);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredData = () => {
    const data = activeTab === 'invoices' ? invoices : tickets;
    let filtered = data;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.bookingReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.movie?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (activeTab === 'invoices' && item.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by period
    if (filterPeriod !== 'all') {
      const now = new Date();
      const days = {
        '30': 30,
        '90': 90,
        '365': 365
      };
      
      const cutoffDate = new Date(now.getTime() - (days[filterPeriod] * 24 * 60 * 60 * 1000));
      filtered = filtered.filter(item => new Date(item.date || item.showDateTime) >= cutoffDate);
    }

    return filtered;
  };

  const downloadPDF = (item, type = 'invoice') => {
    // Mock PDF generation
    const content = type === 'invoice' ? generateInvoicePDF(item) : generateTicketPDF(item);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-${item.bookingReference}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const generateInvoicePDF = (invoice) => {
    return `
MOVIE BOOKING INVOICE
Invoice #: ${invoice.invoiceNumber}
Date: ${new Date(invoice.date).toLocaleDateString()}

CUSTOMER INFORMATION:
${invoice.customerInfo.name}
${invoice.customerInfo.email}
${invoice.customerInfo.phone}
${invoice.customerInfo.address}

BOOKING DETAILS:
Booking Reference: ${invoice.bookingReference}
Movie: ${invoice.movie.title}
Venue: ${invoice.venue.name}
Screen: ${invoice.venue.screen}
Show Date & Time: ${new Date(invoice.showDateTime).toLocaleString()}

SEATS:
${invoice.seats.map(seat => `${seat.seatNumber} (${seat.type}) - $${seat.price.toFixed(2)}`).join('\n')}

CONCESSIONS:
${invoice.concessions.map(item => `${item.quantity}x ${item.item} - $${item.totalPrice.toFixed(2)}`).join('\n')}

FEES:
${invoice.fees.map(fee => `${fee.name} - $${fee.amount.toFixed(2)}`).join('\n')}

PAYMENT SUMMARY:
Subtotal: $${invoice.subtotal.toFixed(2)}
Tax: $${invoice.taxAmount.toFixed(2)}
Total: $${invoice.totalAmount.toFixed(2)}
Payment Method: ${invoice.paymentMethod}
Status: ${invoice.status.toUpperCase()}

Thank you for choosing our service!
    `;
  };

  const generateTicketPDF = (ticket) => {
    return `
E-TICKET
Booking Reference: ${ticket.bookingReference}

Movie: ${ticket.movie.title}
Venue: ${ticket.venue.name}
Screen: ${ticket.venue.screen}
Date & Time: ${new Date(ticket.showDateTime).toLocaleString()}
Seats: ${ticket.seats.join(', ')}

QR Code: ${ticket.qrCode}

Please present this ticket and valid ID at the theater.
    `;
  };

  const resendTicket = async (ticket, method) => {
    try {
      setLoading(true);
      await bookingService.resendTicket(ticket.id, method);
      
      setTickets(prev => prev.map(t => 
        t.id === ticket.id 
          ? { ...t, [method === 'email' ? 'emailSent' : 'smsSent']: true }
          : t
      ));
      
      alert(`Ticket resent via ${method} successfully!`);
      setShowResendModal(false);
    } catch (error) {
      console.error(`Error resending ticket via ${method}:`, error);
      alert(`Failed to resend ticket via ${method}`);
    } finally {
      setLoading(false);
    }
  };

  const printTicket = (ticket) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Movie Ticket - ${ticket.bookingReference}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .ticket { border: 2px solid #000; padding: 20px; max-width: 400px; }
            .qr-code { text-align: center; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="ticket">
            <h2>E-TICKET</h2>
            <p><strong>Booking:</strong> ${ticket.bookingReference}</p>
            <p><strong>Movie:</strong> ${ticket.movie.title}</p>
            <p><strong>Venue:</strong> ${ticket.venue.name}</p>
            <p><strong>Screen:</strong> ${ticket.venue.screen}</p>
            <p><strong>Date & Time:</strong> ${new Date(ticket.showDateTime).toLocaleString()}</p>
            <p><strong>Seats:</strong> ${ticket.seats.join(', ')}</p>
            <div class="qr-code">
              <p><strong>QR Code:</strong> ${ticket.qrCode}</p>
            </div>
            <p><small>Please present this ticket and valid ID at the theater.</small></p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    
    // Update print count
    setTickets(prev => prev.map(t => 
      t.id === ticket.id 
        ? { ...t, printCount: t.printCount + 1 }
        : t
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': case 'cancelled': return 'bg-red-100 text-red-800';
      case 'used': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredData = getFilteredData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Invoices & Tickets</h1>
              <p className="text-gray-600 mt-2">Download invoices and manage your tickets</p>
            </div>
            <button
              onClick={() => navigate('/user/dashboard')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <div className="flex justify-between items-center px-6 py-4">
              <nav className="flex space-x-8">
                {[
                  { id: 'invoices', label: 'Invoices', icon: '📄' },
                  { id: 'tickets', label: 'E-Tickets', icon: '🎫' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>

              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={filterPeriod}
                  onChange={(e) => setFilterPeriod(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Time</option>
                  <option value="30">Last 30 Days</option>
                  <option value="90">Last 3 Months</option>
                  <option value="365">Last Year</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Invoices Tab */}
            {activeTab === 'invoices' && (
              <div>
                <div className="space-y-6">
                  {filteredData.map((invoice) => (
                    <div key={invoice.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              Invoice #{invoice.invoiceNumber}
                            </h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                              {invoice.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-1">{invoice.movie.title}</p>
                          <p className="text-sm text-gray-500">{invoice.venue.name}</p>
                          <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Booking ID:</span> {invoice.bookingReference}
                            </div>
                            <div>
                              <span className="font-medium">Date:</span> {new Date(invoice.date).toLocaleDateString()}
                            </div>
                            <div>
                              <span className="font-medium">Amount:</span> ${invoice.totalAmount.toFixed(2)}
                            </div>
                            <div>
                              <span className="font-medium">Payment:</span> {invoice.paymentMethod}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 pt-4 border-t">
                        <button
                          onClick={() => downloadPDF(invoice, 'invoice')}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          📥 Download PDF
                        </button>
                        <button
                          onClick={() => {
                            setSelectedInvoice(invoice);
                            setShowInvoiceModal(true);
                          }}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          👁️ View Details
                        </button>
                        <button
                          onClick={() => resendTicket(invoice, 'email')}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          📧 Email Invoice
                        </button>
                        <button
                          onClick={() => printTicket(invoice)}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          🖨️ Print
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tickets Tab */}
            {activeTab === 'tickets' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredData.map((ticket) => (
                    <div key={ticket.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="w-16 h-20 bg-gray-300 rounded flex items-center justify-center flex-shrink-0">
                          <span className="text-gray-600 text-xs">IMG</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{ticket.movie.title}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                              {ticket.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{ticket.venue.name}</p>
                          <p className="text-xs text-gray-500 mb-2">
                            {new Date(ticket.showDateTime).toLocaleDateString()} • {ticket.venue.screen}
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            Seats: {ticket.seats.join(', ')}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between text-sm">
                          <span>QR Code: {ticket.qrCode}</span>
                          <span className="text-gray-500">#{ticket.bookingReference}</span>
                        </div>
                        <div className="mt-2 flex space-x-4 text-xs text-gray-500">
                          <span>📧 {ticket.emailSent ? 'Sent' : 'Not sent'}</span>
                          <span>📱 {ticket.smsSent ? 'Sent' : 'Not sent'}</span>
                          <span>🖨️ Printed {ticket.printCount} times</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => downloadPDF(ticket, 'ticket')}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors"
                        >
                          📥 Download
                        </button>
                        <button
                          onClick={() => printTicket(ticket)}
                          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors"
                        >
                          🖨️ Print
                        </button>
                      </div>

                      <div className="flex space-x-2 mt-2">
                        <button
                          onClick={() => resendTicket(ticket, 'email')}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors"
                        >
                          📧 Resend Email
                        </button>
                        <button
                          onClick={() => resendTicket(ticket, 'sms')}
                          className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors"
                        >
                          📱 Resend SMS
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Data State */}
            {filteredData.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">
                  {activeTab === 'invoices' ? '📄' : '🎫'}
                </div>
                <p className="text-gray-500 text-lg mb-2">
                  No {activeTab} found
                </p>
                <p className="text-gray-400 text-sm mb-6">
                  {activeTab === 'invoices' 
                    ? 'Your invoices will appear here after booking movies'
                    : 'Your e-tickets will appear here after booking movies'
                  }
                </p>
                <button
                  onClick={() => navigate('/movies')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Browse Movies
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Invoice Details Modal */}
        {showInvoiceModal && selectedInvoice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-2xl mx-4 max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Invoice Details - {selectedInvoice.invoiceNumber}
                </h3>
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Customer Information</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>{selectedInvoice.customerInfo.name}</p>
                      <p>{selectedInvoice.customerInfo.email}</p>
                      <p>{selectedInvoice.customerInfo.phone}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Booking Details</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Reference: {selectedInvoice.bookingReference}</p>
                      <p>Date: {new Date(selectedInvoice.date).toLocaleDateString()}</p>
                      <p>Status: {selectedInvoice.status.toUpperCase()}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Movie Details</h4>
                  <div className="text-sm text-gray-600">
                    <p>{selectedInvoice.movie.title}</p>
                    <p>{selectedInvoice.venue.name} - {selectedInvoice.venue.screen}</p>
                    <p>{new Date(selectedInvoice.showDateTime).toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Payment Summary</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-2 text-sm">
                      {selectedInvoice.seats.map((seat, index) => (
                        <div key={index} className="flex justify-between">
                          <span>{seat.seatNumber} ({seat.type})</span>
                          <span>${seat.price.toFixed(2)}</span>
                        </div>
                      ))}
                      {selectedInvoice.concessions.map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <span>{item.quantity}x {item.item}</span>
                          <span>${item.totalPrice.toFixed(2)}</span>
                        </div>
                      ))}
                      {selectedInvoice.fees.map((fee, index) => (
                        <div key={index} className="flex justify-between">
                          <span>{fee.name}</span>
                          <span>${fee.amount.toFixed(2)}</span>
                        </div>
                      ))}
                      <hr className="my-2" />
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${selectedInvoice.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span>${selectedInvoice.taxAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Total:</span>
                        <span>${selectedInvoice.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => downloadPDF(selectedInvoice, 'invoice')}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  📥 Download PDF
                </button>
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoicesTickets;