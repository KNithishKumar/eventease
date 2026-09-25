const cron = require('node-cron');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Notification = require('../models/Notification');

const initReminderCron = () => {
  // Run every 30 minutes
  cron.schedule('*/30 * * * *', async () => {
    console.log('[Node-Cron]: Running event reminder check...');
    try {
      const now = new Date();
      const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const next1h = new Date(now.getTime() + 60 * 60 * 1000);

      // Find upcoming approved events
      const upcomingEvents = await Event.find({
        status: 'approved',
        date: { $gte: now, $lte: next24h }
      });

      for (const event of upcomingEvents) {
        const eventDateObj = new Date(event.date);
        const timeDiffMs = eventDateObj.getTime() - now.getTime();
        const hoursDiff = timeDiffMs / (1000 * 60 * 60);

        // Find registered attendees for this event
        const registrations = await Registration.find({
          event: event._id,
          status: 'registered'
        });

        for (const reg of registrations) {
          // Check 24 hour reminder
          if (hoursDiff <= 24 && hoursDiff > 23) {
            const existing24hNotif = await Notification.findOne({
              user: reg.user,
              event: event._id,
              type: 'reminder',
              title: { $regex: '24 Hours', $options: 'i' }
            });

            if (!existing24hNotif) {
              await Notification.create({
                user: reg.user,
                event: event._id,
                title: '⏰ Reminder: Event in 24 Hours!',
                message: `"${event.title}" is tomorrow at ${event.venue} (${event.startTime}). Don't forget your digital QR ticket!`,
                type: 'reminder'
              });
            }
          }

          // Check 1 hour reminder
          if (hoursDiff <= 1.5 && hoursDiff > 0.5) {
            const existing1hNotif = await Notification.findOne({
              user: reg.user,
              event: event._id,
              type: 'reminder',
              title: { $regex: '1 Hour', $options: 'i' }
            });

            if (!existing1hNotif) {
              await Notification.create({
                user: reg.user,
                event: event._id,
                title: '🚀 Starting Soon: 1 Hour Away!',
                message: `"${event.title}" starts in 1 hour at ${event.venue}. Please arrive early and keep your QR ticket ready for scan.`,
                type: 'reminder'
              });
            }
          }
        }
      }
    } catch (err) {
      console.error('[Reminder Cron Error]:', err.message);
    }
  });

  console.log('[Node-Cron]: Reminder service initialized.');
};

module.exports = initReminderCron;
