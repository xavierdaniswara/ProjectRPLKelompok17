const { google } = require('googleapis');
const path = require('path');

// Load the Service Account Key
const KEY_FILE = path.join(__dirname, '../service-account.json');
const SCOPES = ['https://www.googleapis.com/auth/calendar'];

const auth = new google.auth.GoogleAuth({
  keyFile: KEY_FILE,
  scopes: SCOPES,
});

const calendar = google.calendar({ version: 'v3', auth });

// Tool 1: Check Availability
async function getFreeSlots(doctorCalendarId, date) {
  // Define the start and end of the day (e.g., 9 AM to 5 PM)
  const timeMin = new Date(`${date}T09:00:00Z`).toISOString();
  const timeMax = new Date(`${date}T17:00:00Z`).toISOString();

  const res = await calendar.freebusy.query({
    requestBody: {
      timeMin,
      timeMax,
      items: [{ id: doctorCalendarId }],
    },
  });

  const busySlots = res.data.calendars[doctorCalendarId].busy;
  // (Logic here to calculate "gaps" between busy slots implies free time)
  // For simplicity, return the raw busy data or a processed string of free times
  return JSON.stringify(busySlots);
}

// Tool 2: Book Appointment
async function createAppointment(doctorCalendarId, patientName, startTime, endTime) {
  const event = {
    summary: `Appt: ${patientName}`,
    description: 'Booked via Medical Chatbot',
    start: { dateTime: startTime }, // e.g., '2023-10-25T10:00:00Z'
    end: { dateTime: endTime },
  };

  const res = await calendar.events.insert({
    calendarId: doctorCalendarId,
    requestBody: event,
  });

  return `Appointment confirmed! Link: ${res.data.htmlLink}`;
}

module.exports = { getFreeSlots, createAppointment };