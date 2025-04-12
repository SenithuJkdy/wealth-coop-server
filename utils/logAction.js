const AuditLog = require('../models/AuditLog');
const generateCustomId = require('./generateCustomId');

const logAction = async (user_id, action, target_table, ip_address = '::1') => {
  try {
    const log_id = await generateCustomId('LOG');

    const log = new AuditLog({
      log_id,
      user_id,
      action,
      target_table,
      ip_address
    });

    await log.save();
  } catch (err) {
    console.error('❌ Failed to write audit log:', err.message);
  }
};

module.exports = logAction;
