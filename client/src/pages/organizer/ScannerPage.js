import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { attendanceService } from '../../services/attendanceService';
import { eventService } from '../../services/eventService';
import QRScanner from '../../components/events/QRScanner';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiCamera, FiCheckCircle, FiXCircle, FiArrowLeft, FiUser } from 'react-icons/fi';

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
      <button
        onClick={() => navigate('/organizer/events')}
        className="inline-flex items-center space-x-2 text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
      >
        <FiArrowLeft size={16} />
        <span>Back to My Events</span>
      </button>

      <div className="text-center space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Live Gate Attendance Scanner</span>
        <h1 className="text-2xl font-black text-neutral-900 dark:text-white font-display">{event?.title}</h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Point camera at student's digital ticket QR code or manually input registration ID.
        </p>
      </div>

      {/* QR Scanner Component */}
      <QRScanner onScanSuccess={handleScanSuccess} isLoading={verifying} />

      {/* Scan Result Feedback Card */}
      {lastResult && (
        <div
          className={`p-6 rounded-3xl border shadow-lg space-y-3 transition-all ${
            lastResult.success
              ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
              : 'bg-rose-50 dark:bg-rose-950/80 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-100'
          }`}
        >
          <div className="flex items-center space-x-3">
            {lastResult.success ? (
              <FiCheckCircle size={32} className="text-emerald-500 shrink-0" />
            ) : (
              <FiXCircle size={32} className="text-rose-500 shrink-0" />
            )}
            <div>
              <h3 className="text-lg font-bold font-display">{lastResult.message}</h3>
              {lastResult.student && (
                <p className="text-xs font-semibold opacity-90 mt-0.5">
                  Student: {lastResult.student.name} ({lastResult.student.department} - {lastResult.student.year})
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
