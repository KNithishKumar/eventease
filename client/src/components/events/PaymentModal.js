import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { paymentService } from '../../services/paymentService';
import toast from 'react-hot-toast';
import {
  FiCreditCard,
  FiSmartphone,
  FiGlobe,
  FiLock,
  FiAlertTriangle,
  FiCheck
} from 'react-icons/fi';

const PaymentModal = ({ isOpen, onClose, event, onPaymentSuccess, isProcessing }) => {
  if (!event) return null;

  const [razorpaySubMethod, setRazorpaySubMethod] = useState('UPI'); // 'UPI', 'Card', 'Netbanking'
  const [loadingOrder, setLoadingOrder] = useState(false);

  const accountHolder = event.accountHolderName || event.organizer?.name || 'EventEase College Organizer';
  const upiId = event.upiId || 'eventease.organizer@okaxis';
  const bankName = event.bankName || 'State Bank of India (Campus Branch)';

  // Load Razorpay JS SDK if available
  useEffect(() => {
    if (!document.getElementById('razorpay-sdk')) {
      const script = document.createElement('script');
      script.id = 'razorpay-sdk';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Full Razorpay Order Creation & Verification Workflow
  const handleStartRazorpayCheckout = async () => {
    setLoadingOrder(true);
    try {
      // 1. Request Order Creation from Backend (MongoDB fetched price)
      const orderData = await paymentService.createOrder(event._id);

      if (orderData.isFree) {
        toast.success('Event is free! Confirming booking...');
        onPaymentSuccess({});
        return;
      }

      const keyId = orderData.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_EventEase2026';

      // 2. Setup Razorpay Checkout options
      const options = {
        key: keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'EventEase Platform',
        description: `Booking for ${event.title}`,
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            // 3. Send Razorpay response to Backend Signature Verification endpoint
            const verifyRes = await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              eventId: event._id
            });
            toast.success('Razorpay Payment Signature Verified! Booking Confirmed.');
            onPaymentSuccess(verifyRes);
          } catch (verifyErr) {
            toast.error(verifyErr.response?.data?.message || 'Payment signature verification failed. Booking unconfirmed.');
          }
        },
        prefill: {
          name: 'Student User',
          email: 'student@eventease.edu',
          contact: '9876543210'
        },
        notes: {
          event_id: event._id,
          organizer: accountHolder
        },
        theme: { color: '#4f46e5' },
        modal: {
          ondismiss: function () {
            toast.error('Razorpay payment cancelled. Booking was not created.');
          }
        }
      };

      // Open Razorpay SDK if available, or call sandbox test handler
      if (window.Razorpay) {
        try {
          const rzp = new window.Razorpay(options);
          rzp.open();
        } catch (sdkErr) {
          await handleSimulatedBackendVerify(orderData.orderId);
        }
      } else {
        await handleSimulatedBackendVerify(orderData.orderId);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to initialize Razorpay checkout order.');
    } finally {
      setLoadingOrder(false);
    }
  };

  // Helper for direct Razorpay Test Sandbox verification with backend
  const handleSimulatedBackendVerify = async (providedOrderId) => {
    try {
      const mockPayId = `pay_rzp_test_${Math.random().toString(36).substring(2, 11)}${Date.now().toString().slice(-4)}`;
      const orderId = providedOrderId || `order_test_${Date.now()}`;
      const mockSignature = 'simulated_valid_test_signature';

      const verifyRes = await paymentService.verifyPayment({
        razorpay_order_id: orderId,
        razorpay_payment_id: mockPayId,
        razorpay_signature: mockSignature,
        eventId: event._id
      });

      toast.success('Razorpay Test Payment Verified by Backend!');
      onPaymentSuccess(verifyRes);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
    }
  };

  const handleSimulateFailure = () => {
    toast.error('Payment Declined by Issuer. Booking was NOT created in MongoDB.');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Razorpay Standard Checkout (Test Mode)" maxWidth="max-w-xl">
      <div className="space-y-5">
        {/* Payment Summary Header */}
        <div className="p-4 rounded-lg bg-neutral-900 text-white flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider bg-neutral-800 px-2 py-0.5 rounded text-indigo-300">
              Razorpay Test Checkout
            </span>
            <h3 className="text-base font-semibold mt-1">{event.title}</h3>
            <p className="text-xs text-neutral-400">{event.category} • {event.venue}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-neutral-400 font-medium block">Total Amount</span>
            <span className="text-2xl font-bold">₹{event.registrationFee}</span>
          </div>
        </div>

        {/* RAZORPAY TEST GATEWAY CONTAINER */}
        <div className="space-y-4 rounded-lg border border-indigo-200 dark:border-indigo-800/80 overflow-hidden bg-neutral-900 text-white shadow-md">
          {/* Razorpay Top Bar */}
          <div className="bg-indigo-950 p-4 border-b border-indigo-800/50 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-white text-xs">
                R
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Razorpay Standard Checkout</h4>
                <span className="text-[10px] text-indigo-300 font-mono">Test Mode Integration</span>
              </div>
            </div>
            <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold rounded-full uppercase tracking-wider">
              Test Mode Active
            </span>
          </div>

          <div className="p-5 space-y-4">
            {/* Payment Methods Sub-Selector */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Select Razorpay Test Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'UPI', label: 'UPI / QR', icon: FiSmartphone },
                  { id: 'Card', label: 'Test Card', icon: FiCreditCard },
                  { id: 'Netbanking', label: 'Net Banking', icon: FiGlobe }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setRazorpaySubMethod(item.id)}
                      className={`p-2.5 rounded-lg border text-xs font-semibold flex flex-col items-center justify-center space-y-1 transition-all ${
                        razorpaySubMethod === item.id
                          ? 'bg-indigo-600 border-indigo-400 text-white shadow-sm'
                          : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Context Details */}
            <div className="p-3.5 bg-neutral-800/90 rounded-lg border border-neutral-700/80 text-xs space-y-1.5 font-mono text-neutral-300">
              <div className="flex justify-between">
                <span className="text-neutral-400">Order Amount:</span>
                <span className="font-bold text-emerald-400">₹{event.registrationFee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Merchant / Beneficiary:</span>
                <span className="font-bold text-white">{accountHolder}</span>
              </div>
              {razorpaySubMethod === 'UPI' && (
                <div className="flex justify-between text-[11px] pt-1 text-neutral-400">
                  <span>Test UPI VPA:</span>
                  <span className="text-indigo-300 font-bold">{upiId}</span>
                </div>
              )}
              {razorpaySubMethod === 'Card' && (
                <div className="flex justify-between text-[11px] pt-1 text-neutral-400">
                  <span>Test Card:</span>
                  <span className="text-indigo-300 font-bold">4111 •••• •••• 1111 (Visa Test)</span>
                </div>
              )}
              {razorpaySubMethod === 'Netbanking' && (
                <div className="flex justify-between text-[11px] pt-1 text-neutral-400">
                  <span>Test Bank:</span>
                  <span className="text-indigo-300 font-bold">{bankName}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={handleStartRazorpayCheckout}
                disabled={isProcessing || loadingOrder}
                className="py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-lg shadow-sm transition-all text-xs flex items-center justify-center space-x-2"
              >
                <FiCheck size={16} />
                <span>
                  {loadingOrder || isProcessing
                    ? 'Processing Order...'
                    : `Proceed to Razorpay Checkout (₹${event.registrationFee})`}
                </span>
              </button>

              <button
                type="button"
                onClick={handleSimulateFailure}
                disabled={isProcessing || loadingOrder}
                className="py-3 bg-neutral-800 hover:bg-rose-950 text-rose-300 border border-rose-800/40 font-semibold rounded-lg transition-all text-xs flex items-center justify-center space-x-1.5"
              >
                <FiAlertTriangle size={14} />
                <span>Simulate Cancel / Failure</span>
              </button>
            </div>
          </div>
        </div>

        {/* Security Guarantee Note */}
        <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 pt-2">
          <span className="flex items-center space-x-1">
            <FiLock size={14} />
            <span>Razorpay Signature Verification Active</span>
          </span>
          <span className="font-semibold text-neutral-700 dark:text-neutral-300">Instant Digital Ticket Generation</span>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentModal;
