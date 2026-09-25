import API from './api';

export const attendanceService = {
  checkInAttendee: async (data) => {
    const res = await API.post('/attendance/check-in', data);
    return res.data;
  }
};
