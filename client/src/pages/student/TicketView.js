import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { registrationService } from '../../services/registrationService';
import { QRCodeSVG } from 'qrcode.react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import toast from 'react-hot-toast';
import {
  FiArrowLeft,
  FiCheckCircle,
  FiShield,
  FiDownload,
  FiPrinter,
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
  if (!ticket) return <div className="p-8 text-center text-s uppercase font-bold text-neutral-500 font-[Segoe UI]">Ticket not found</div>;

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
    <div className="max-w-xl mx-auto space-y-6">
      {/* Top Bar */}
      <div id="ticket-top-nav" className="flex items-center justify-between no-print">
        <button
          onClick={() => navigate('/student/my-events')}
          className="inline-flex items-center space-x-2 text-s font-bold uppercase tracking-wider text-neutral-600 hover:text-primary-600 transition-colors"
        >
          <FiArrowLeft size={16} />
          <span>Back to My Events</span>
        </button>

        <span className="text-xs font-bold uppercase tracking-wider text-primary-600 flex items-center space-x-1">
          <FiCheckCircle size={14} />
          <span>Verified Registration</span>
        </span>
      </div>

      {/* Celebratory Banner */}
      <div id="ticket-celebration-banner" className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1 no-print">
        <div className="flex items-center space-x-2">
          <FiAward size={18} className="shrink-0 text-emerald-600" />
          <h3 className="font-bold text-xs uppercase tracking-wider">Payment Approved & Ticket Generated</h3>
        </div>
        <p className="text-s text-emerald-800 font-[Segoe UI]">
          Your entry pass is active. You can download or print your QR ticket below for campus gate check-in.
        </p>
      </div>

      {/* Printable Ticket Card Container */}
      <div id="printable-ticket" className="bg-white border border-neutral-200">
        {/* Header Ribbon */}
        <div className="bg-neutral-900 p-6 text-white text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider bg-neutral-800 text-primary-500 px-3 py-1 inline-block border border-neutral-700">
            Official Campus Pass
          </span>
          <h2 className="text-2xl font-bold uppercase tracking-wider mt-2 line-clamp-1">{event.title}</h2>
          <p className="text-s text-neutral-400 font-[Segoe UI]">{event.category} • {event.department}</p>
        </div>

        {/* Body Details & QR Code */}
        <div className="p-6 space-y-6">
          <div className="flex flex-col items-center justify-center p-6 bg-neutral-50 border border-dashed border-neutral-300 space-y-3">
            {/* QR Code Container */}
            <div id="ticket-qr-container" className="bg-white p-4 border border-neutral-200">
              {qrValue ? (
                <QRCodeSVG value={qrValue} size={180} level="H" includeMargin={true} />
              ) : (
                <div className="w-[180px] h-[180px] flex items-center justify-center text-xs text-neutral-400 font-[Segoe UI]">
                  Loading QR...
                </div>
              )}
            </div>

            <span className="font-mono text-sm font-bold text-neutral-900 uppercase tracking-wider">
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
              <span className="text-xs font-mono text-neutral-500 uppercase">
                Payment Ref: {paymentId}
              </span>
            )}

            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center space-x-1 pt-1 font-[Segoe UI]">
              <FiShield size={14} className="text-primary-600" />
              <span>Show QR code to event organizer scanner at gate</span>
            </span>
          </div>

          {/* Student & Event Metadata */}
          <div className="grid grid-cols-2 gap-4 text-xs font-[Segoe UI] border-t border-neutral-200 pt-4">
            <div>
              <span className="text-neutral-500 font-bold uppercase tracking-wider block mb-0.5">Attendee Name</span>
              <p className="font-bold text-neutral-900 text-sm uppercase">{user.name}</p>
              <p className="text-neutral-600">{user.department} ({user.year})</p>
            </div>
            <div>
              <span className="text-neutral-500 font-bold uppercase tracking-wider block mb-0.5">Registration Date</span>
              <p className="font-bold text-neutral-900 text-sm">
                {new Date(registeredAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <span className="text-neutral-500 font-bold uppercase tracking-wider block mb-0.5">Date & Time</span>
              <p className="font-bold text-neutral-900 text-sm">
                {new Date(event.date).toLocaleDateString()} ({event.startTime})
              </p>
            </div>
            <div>
              <span className="text-neutral-500 font-bold uppercase tracking-wider block mb-0.5">Venue</span>
              <p className="font-bold text-neutral-900 text-sm line-clamp-1">{event.venue}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons: Download PNG & Print PDF */}
        <div id="ticket-actions-bar" className="p-4 bg-neutral-50 border-t border-neutral-200 grid grid-cols-1 sm:grid-cols-2 gap-3 no-print">
          <button
            type="button"
            onClick={handleDownloadImage}
            className="py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors"
          >
            <FiDownload size={16} />
            <span>Download PNG Pass</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors"
          >
            <FiPrinter size={16} />
            <span>Print PDF Pass</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketView;