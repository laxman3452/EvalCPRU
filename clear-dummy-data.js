require('dotenv').config();
const mongoose = require('mongoose');
const URI = process.env.MONGODB_URI;

mongoose.connect(URI).then(async () => {
  const models = ['Teacher', 'Student', 'Unit', 'LearningObjective', 'TeacherAssignment', 'Assessment', 'Class', 'Section', 'Subject'];
  for (const model of models) {
    try {
      let colName = model.toLowerCase() + 's';
      if (model === 'Class') colName = 'classes';
      const col = mongoose.connection.collection(colName);
      await col.deleteMany({});
      console.log(`Cleared ${colName}`);
    } catch (e) {
      console.log('Error clearing', model, e.message);
    }
  }
  
  console.log('All dummy data cleared.');
  mongoose.disconnect();
});
