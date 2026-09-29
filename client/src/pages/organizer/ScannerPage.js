import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { attendanceService } from '../../services/attendanceService';
import { eventService } from '../../services/eventService';
import QRScanner from '../../components/events/QRScanner';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiCheckCircle, FiXCircle, FiArrowLeft } from 'react-icons/fi';

const ScannerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const ev = await eventService.getEventById(id);
        setEvent(ev);
      } catch (err) {
        toast.error('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleScanSuccess = async (tokenOrId) => {
    if (verifying) return;
    setVerifying(true);
    setLastResult(null);

    try {
      const res = await attendanceService.checkInAttendee({
        qrToken: tokenOrId,
        registrationId: tokenOrId,
        eventId: id
      });

      toast.success(res.message || 'Attendance Marked!');
      setLastResult({
        success: true,
        message: res.message,
        student: res.student,
        checkedInAt: res.checkedInAt
      });
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid Ticket';
      toast.error(msg);
      setLastResult({
        success: false,
        message: msg,
        alreadyCheckedIn: err.response?.data?.alreadyCheckedIn,
        student: err.response?.data?.student
      });
    } finally {
      setVerifying(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/organizer/events')}
        className="inline-flex items-center space-x-2 text-s font-bold uppercase tracking-wider text-neutral-600 hover:text-primary-600 transition-colors"
      >
        <FiArrowLeft size={16} />
        <span>Back to My Events</span>
      </button>

      {/* Header Container */}
      <div className="bg-white border border-neutral-200 p-6 text-center">
        <label className="block text-l font-bold uppercase tracking-wider text-primary-600 mb-1">
          Live Gate Attendance Scanner
        </label>
        <h1 className="text-2xl font-bold uppercase tracking-wider text-neutral-900">
          {event?.title}
        </h1>
        <p className="text-s text-neutral-500 font-[Segoe UI] mt-1">
          Point camera at student's digital ticket QR code or manually input registration ID.
        </p>
      </div>

      {/* QR Scanner Component */}
      <QRScanner onScanSuccess={handleScanSuccess} isLoading={verifying} />

      {/* Scan Result Feedback Card */}
      {lastResult && (
        <div
          className={`p-6 border space-y-3 transition-all ${
            lastResult.success
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          <div className="flex items-center space-x-3">
            {lastResult.success ? (
              <FiCheckCircle size={32} className="text-emerald-600 shrink-0" />
            ) : (
              <FiXCircle size={32} className="text-rose-600 shrink-0" />
            )}
            <div>
              <h3 className="text-l font-bold uppercase tracking-wider font-display">
                {lastResult.message}
              </h3>
              {lastResult.student && (
                <p className="text-s font-[Segoe UI] opacity-90 mt-1">
                  <strong className="uppercase font-bold">Student:</strong> {lastResult.student.name} ({lastResult.student.department} - {lastResult.student.year})
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScannerPage;