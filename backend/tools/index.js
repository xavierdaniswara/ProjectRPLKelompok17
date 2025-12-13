// tools/index.js
const { searchWeb } = require('./webSearch');
const { getFreeSlots, createAppointment } = require('./calendar');

// 1. Define the tools for Gemini (JSON Schema)
const tools = [
  {
    functionDeclarations: [
      {
        name: "search_web",
        description: "Search the internet for real-time medical information, drug interactions, or recent health news.",
        parameters: {
          type: "OBJECT",
          properties: {
            query: {
              type: "STRING",
              description: "The search query, e.g., 'side effects of lisinopril' or 'current flu outbreak trends'."
            }
          },
          required: ["query"]
        }
      },
      {
        name: "check_doctor_availability",
        description: "Checks specific doctor's calendar for free slots on a given date.",
        parameters: {
          type: "OBJECT",
          properties: {
            doctor_calendar_id: { type: "STRING" }, // You might map this internally from a name
            date: { type: "STRING", description: "YYYY-MM-DD format" }
          },
          required: ["doctor_calendar_id", "date"]
        }
      },
      {
        name: "book_appointment",
        description: "Books a time slot on the doctor's calendar.",
        parameters: {
          type: "OBJECT",
          properties: {
            doctor_calendar_id: { type: "STRING" },
            patient_name: { type: "STRING" },
            start_time: { type: "STRING", description: "ISO date time string" },
            end_time: { type: "STRING", description: "ISO date time string" }
          },
          required: ["doctor_calendar_id", "patient_name", "start_time", "end_time"]
        }
      }
    ]
  }
];

// 2. Map function names to actual code execution
const toolFunctions = {
  search_web: async ({ query }) => {
    return await searchWeb(query);
  },
  check_doctor_availability: async ({ doctor_calendar_id, date }) => {
    return await getFreeSlots(doctor_calendar_id, date);
  },
  book_appointment: async ({ doctor_calendar_id, patient_name, start_time, end_time }) => {
    return await createAppointment(doctor_calendar_id, patient_name, start_time, end_time);
  }
};

module.exports = { tools, toolFunctions };