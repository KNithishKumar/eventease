const Registration = require('../models/Registration');
const Event = require('../models/Event');
const Notification = require('../models/Notification');

/**
 * Promotes the next waitlisted user for an event if capacity permits.
 * @param {string} eventId
 */
const promoteWaitlistUser = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    if (!event) return;

    // Active registered count
    const registeredCount = await Registration.countDocuments({
      event: eventId,
      status: 'registered'
    });

    if (registeredCount < event.capacity) {
      // Find the first waitlisted user (lowest waitlistPosition)
      const nextWaitlisted = await Registration.findOne({
        event: eventId,
        status: 'waitlisted'
      }).sort({ waitlistPosition: 1 });

      if (nextWaitlisted) {
        nextWaitlisted.status = 'registered';
        nextWaitlisted.waitlistPosition = null;
        await nextWaitlisted.save();

        // Re-calculate waitlist positions for remaining waitlisted users
        const remainingWaitlisted = await Registration.find({
          event: eventId,
          status: 'waitlisted'
        }).sort({ createdAt: 1 });

        for (let i = 0; i < remainingWaitlisted.length; i++) {
          remainingWaitlisted[i].waitlistPosition = i + 1;
          await remainingWaitlisted[i].save();
        }

        // Notify promoted user
        await Notification.create({
          user: nextWaitlisted.user,
          event: event._id,
          title: '🎉 You have been registered!',
          message: `Great news! A spot opened up for "${event.title}". You are now confirmed as registered. Access your digital ticket now!`,
          type: 'waitlist_promoted'
        });

        console.log(`[Waitlist Promoted]: User ${nextWaitlisted.user} for Event ${event.title}`);
      }
    }
  } catch (error) {
    console.error('[Waitlist Promotion Error]:', error.message);
  }
};

module.exports = { promoteWaitlistUser };
