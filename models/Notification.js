const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    notification_id: { type: String, unique: true, required: true },
    cus_id: String,
    message: String,
    date: Date
  }, { timestamps: true });

  module.exports = mongoose.model('Notification', NotificationSchema);
  