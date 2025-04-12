const Counter = require('../models/Counter');

const generateCustomId = async (entityPrefix) => {
  const result = await Counter.findOneAndUpdate(
    { entity: entityPrefix },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const paddedSeq = result.seq.toString().padStart(3, '0');
  return `${entityPrefix}${paddedSeq}`;
};

module.exports = generateCustomId;
