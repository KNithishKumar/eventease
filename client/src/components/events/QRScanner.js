import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { FiCamera, FiSearch } from 'react-icons/fi';

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
    <div className="bg-white border border-neutral-200 p-6 max-w-lg mx-auto font-[Segoe UI]">
      {/* Mode Switcher */}
      <div className="flex border border-neutral-200 bg-white mb-6">
        <button
          onClick={() => setScanMethod('camera')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 ${
            scanMethod === 'camera'
              ? 'bg-primary-600 text-white'
              : 'text-neutral-700 hover:bg-neutral-100 hover:text-primary-600'
          }`}
        >
          <FiCamera size={16} />
          <span>Camera Scanner</span>
        </button>
        <button
          onClick={() => setScanMethod('manual')}
          className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 ${
            scanMethod === 'manual'
              ? 'bg-primary-600 text-white'
              : 'text-neutral-700 hover:bg-neutral-100 hover:text-primary-600'
          }`}
        >
          <FiSearch size={16} />
          <span>Manual Token Entry</span>
        </button>
      </div>

      {scanMethod === 'camera' ? (
        <div>
          <div id="qr-reader" className="overflow-hidden border border-neutral-200"></div>
          <p className="mt-3 text-xs text-center text-neutral-500 font-[Segoe UI]">
            Position student's digital ticket QR code within the frame to verify attendance.
          </p>
        </div>
      ) : (
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
              Registration ID or QR Token
            </label>
            <input
              type="text"
              placeholder="e.g. REG-8820-1001 or demo_qr_token..."
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 text-sm font-mono text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 font-[Segoe UI]"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !manualInput.trim()}
            className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold text-sm uppercase tracking-wider transition-colors"
          >
            {isLoading ? 'Verifying Ticket...' : 'Check-In Student'}
          </button>
        </form>
      )}
    </div>
  );
};

export default QRScanner;