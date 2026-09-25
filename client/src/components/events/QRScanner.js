import React, { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { FiCamera, FiCheckCircle, FiAlertCircle, FiSearch } from 'react-icons/fi';

const QRScanner = ({ onScanSuccess, isLoading = false }) => {
  const [manualInput, setManualInput] = useState('');
  const [scanMethod, setScanMethod] = useState('camera'); // 'camera' or 'manual'
  const scannerRef = useRef(null);

  useEffect(() => {
    let scanner;
    if (scanMethod === 'camera') {
      scanner = new Html5QrcodeScanner(
        'qr-reader',
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        /* verbose= */ false
      );

      scanner.render(
        (decodedText) => {
          onScanSuccess(decodedText);
          // Optional: pause or clear after scan
        },
        (error) => {
          // ignore minor frame scan errors
        }
      );
      scannerRef.current = scanner;
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch((err) => console.error('Failed to clear scanner', err));
      }
    };
  }, [scanMethod]);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    onScanSuccess(manualInput.trim());
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-lg max-w-lg mx-auto shadow-sm">
      {/* Mode Switcher */}
      <div className="flex rounded-xl bg-neutral-100 dark:bg-neutral-800 p-1 mb-6">
        <button
          onClick={() => setScanMethod('camera')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
            scanMethod === 'camera'
              ? 'bg-white dark:bg-neutral-900 text-primary-600 dark:text-primary-400 shadow-sm'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <FiCamera size={16} />
          <span>Camera Scanner</span>
        </button>
        <button
          onClick={() => setScanMethod('manual')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
            scanMethod === 'manual'
              ? 'bg-white dark:bg-neutral-900 text-primary-600 dark:text-primary-400 shadow-sm'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <FiSearch size={16} />
          <span>Manual Token Entry</span>
        </button>
      </div>

      {scanMethod === 'camera' ? (
        <div>
          <div id="qr-reader" className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800"></div>
          <p className="mt-3 text-xs text-center text-neutral-500 dark:text-neutral-400">
            Position student's digital ticket QR code within the frame to verify attendance.
          </p>
        </div>
      ) : (
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
              Registration ID or QR Token
            </label>
            <input
              type="text"
              placeholder="e.g. REG-8820-1001 or demo_qr_token..."
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm font-mono text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !manualInput.trim()}
            className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition-colors text-sm"
          >
            {isLoading ? 'Verifying Ticket...' : 'Check-In Student'}
          </button>
        </form>
      )}
    </div>
  );
};

export default QRScanner;
