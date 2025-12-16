const doctorsData = require('../data/doctors.json');

/**
 * Finds doctors based on specialization or general keywords.
 * @param {string} category - e.g., "Dokter Umum", "Gigi", "Jantung"
 */
async function findDoctors(category) {
  if (!category) return "Please specify a specialization.";

  const lowerCategory = category.toLowerCase();

  // Filter doctors where specialization matches the query
  const matches = doctorsData.filter(doc => 
    doc.spesialisasi.toLowerCase().includes(lowerCategory) ||
    doc.nama.toLowerCase().includes(lowerCategory)
  );

  if (matches.length === 0) {
    return "No doctors found for this specialization.";
  }

  // Return key details for the AI to read
  return JSON.stringify(matches.map(doc => ({
    name: doc.nama,
    specialization: doc.spesialisasi,
    schedule_hint: doc.jadwal_praktik,
    calendar_id: doc.calendar_id // The AI needs this for the next step
  })));
}

module.exports = { findDoctors };
