import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { registrationService } from '../../services/registrationService';
import { QRCodeSVG } from 'qrcode.react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import toast from 'react-hot-toast';
import {
  FiCalendar,
  FiMapPin,
  FiUser,
  FiPrinter,
  FiArrowLeft,
  FiCheckCircle,
  FiShield,
  FiDownload,
  FiDollarSign,
  FiAward
} from 'react-icons/fi';

const TicketView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const data = await registrationService.getTicketById(id);
        setTicket(data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load digital ticket');
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [id]);

  if (loading) return <LoadingSpinner fullScreen />;
  if (!ticket) return <div className="p-8 text-center text-neutral-500">Ticket not found</div>;

  const { registrationId, qrToken, user, event, checkedIn, registeredAt, paymentStatus, paymentMethod, amountPaid, paymentId } = ticket;
  const qrValue = qrToken || registrationId || ticket._id || 'EVENT_EASE_TOKEN';

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadImage = () => {
    try {
      const svgElement = document.querySelector('#ticket-qr-container svg');
      if (!svgElement) {
        toast.error('QR element not ready for download');
        return;
      }
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width + 60;
        canvas.height = img.height + 60;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 30, 30);

        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `${registrationId}_QR_Pass.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        toast.success('QR Pass PNG Image downloaded!');
      };

      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    } catch (err) {
      console.error(err);
      toast.error('Failed to download image pass');
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      {/* Top Bar */}
      <div id="ticket-top-nav" className="flex items-center justify-between no-print">
        <button
          onClick={() => navigate('/student/my-events')}
          className="inline-flex items-center space-x-2 text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <FiArrowLeft size={16} />
          <span>Back to My Events</span>
        </button>

        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
          <FiCheckCircle size={14} />
          <span>Verified Registration</span>
        </span>
      </div>

      {/* Celebratory Banner */}
      <div id="ticket-celebration-banner" className="p-4 rounded-lg bg-emerald-700 text-white shadow-sm space-y-1 no-print">
        <div className="flex items-center space-x-2">
          <FiAward size={18} className="shrink-0" />
          <h3 className="font-bold text-sm">Payment Approved & Ticket Generated</h3>
        </div>
        <p className="text-xs text-emerald-100">
          Your entry pass is active. You can download or print your QR ticket below for campus gate check-in.
        </p>
      </div>

      {/* Printable Ticket Card Container */}
      <div id="printable-ticket" className="bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-lg overflow-hidden shadow-sm">
        {/* Header Ribbon */}
        <div className="bg-neutral-900 p-5 text-white text-center space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider bg-neutral-800 text-indigo-300 px-2.5 py-0.5 rounded">
            EventEase Official Campus Pass
          </span>
          <h2 className="text-xl font-bold mt-2 line-clamp-1">{event.title}</h2>
          <p className="text-xs text-neutral-400">{event.category} • {event.department}</p>
        </div>

        {/* Body Details & QR Code */}
        <div className="p-6 space-y-6">
          <div className="flex flex-col items-center justify-center p-6 bg-neutral-50 dark:bg-neutral-800/60 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 space-y-3">
            {/* QR Code Container */}
            <div id="ticket-qr-container" className="bg-white p-3.5 rounded-2xl shadow-md border border-neutral-200">
              {qrValue ? (
                <QRCodeSVG value={qrValue} size={180} level="H" includeMargin={true} />
              ) : (
                <div className="w-[180px] h-[180px] flex items-center justify-center text-xs text-neutral-400">
                  Loading QR...
                </div>
              )}
            </div>

            <span className="font-mono text-xs font-bold text-neutral-700 dark:text-neutral-300 tracking-wider">
              {registrationId}
            </span>

            {/* Payment Status Badge */}
            <div className="flex items-center space-x-2 flex-wrap justify-center gap-1">
              <Badge variant={paymentStatus === 'paid' ? 'success' : 'info'}>
                {paymentStatus === 'paid' ? `Paid via ${paymentMethod} (₹${amountPaid})` : 'Free Registration'}
              </Badge>
              {checkedIn ? (
                <Badge variant="success">Checked In</Badge>
              ) : (
                <Badge variant="neutral">Gate Scan Pending</Badge>
              )}
            </div>

            {paymentId && (
              <span className="text-[10px] font-mono text-neutral-400">
                Payment Ref: {paymentId}
              </span>
            )}

            <span className="text-[11px] font-semibold text-neutral-500 flex items-center space-x-1 pt-1">
              <FiShield size={14} />
              <span>Show QR code to event organizer scanner at gate</span>
            </span>
          </div>

          {/* Student & Event Metadata */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-neutral-400 font-bold uppercase">Attendee Name</span>
              <p className="font-extrabold text-neutral-900 dark:text-white text-sm mt-0.5">{user.name}</p>
              <p className="text-neutral-500">{user.department} ({user.year})</p>
            </div>
            <div>
              <span className="text-neutral-400 font-bold uppercase">Registration Date</span>
              <p className="font-extrabold text-neutral-900 dark:text-white text-sm mt-0.5">
                {new Date(registeredAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <span className="text-neutral-400 font-bold uppercase">Date & Time</span>
              <p className="font-bold text-neutral-800 dark:text-neutral-200 mt-0.5">
                {new Date(event.date).toLocaleDateString()} ({event.startTime})
              </p>
            </div>
            <div>
              <span className="text-neutral-400 font-bold uppercase">Venue</span>
              <p className="font-bold text-neutral-800 dark:text-neutral-200 mt-0.5 line-clamp-1">{event.venue}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons: Download PNG & Print PDF */}
        <div id="ticket-actions-bar" className="p-4 bg-neutral-50 dark:bg-neutral-800/40 border-t border-neutral-100 dark:border-neutral-800 grid grid-cols-1 sm:grid-cols-2 gap-3 no-print">
          <button
            type="button"
            onClick={handleDownloadImage}
            className="py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition-colors shadow-sm"
          >
            <FiDownload size={16} />
            <span>Download Ticket Image (PNG)</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition-colors shadow-sm"
          >
            <FiPrinter size={16} />
            <span>Print / Save as PDF Pass</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketView;
