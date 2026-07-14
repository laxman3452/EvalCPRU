require('dotenv').config();
const mongoose = require('mongoose');
const URI = process.env.MONGODB_URI;

mongoose.connect(URI).then(async () => {
  // Directly use the raw collection to patch without schema conflicts
  const col = mongoose.connection.collection('teacherassignments');
  
  const result = await col.updateMany(
    { academicYear: { $in: [null, undefined, ''] } },
    { $set: { academicYear: '2083' } }
  );
  console.log('Patched assignments:', result.modifiedCount);

  // Also patch students
  const studentCol = mongoose.connection.collection('students');
  const studentResult = await studentCol.updateMany(
    { academicYear: { $in: [null, undefined, ''] } },
    { $set: { academicYear: '2083' } }
  );
  console.log('Patched students:', studentResult.modifiedCount);

  // Verify assignments
  const all = await col.find({}).toArray();
  console.log('\nAll assignments:');
  all.forEach(a => console.log(' - academicYear:', a.academicYear));

  mongoose.disconnect();
});
