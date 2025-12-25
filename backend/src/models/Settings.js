import mongoose from 'mongoose';

const operatingHoursSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  },
  openTime: {
    type: String,
    default: '10:00',
  },
  closeTime: {
    type: String,
    default: '22:00',
  },
  isOpen: {
    type: Boolean,
    default: true,
  },
});

const settingsSchema = new mongoose.Schema(
  {
    restaurantName: {
      type: String,
      default: 'Metro Restaurant',
    },
    address: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    taxRate: {
      type: Number,
      default: 10,
      min: 0,
      max: 100,
    },
    serviceCharge: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    operatingHours: [operatingHoursSchema],
    soundNotifications: {
      type: Boolean,
      default: true,
    },
    autoPrint: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({
      restaurantName: 'Metro Restaurant',
      address: '',
      phone: '',
      taxRate: 10,
      serviceCharge: 0,
      operatingHours: [
        { day: 'Monday', openTime: '10:00', closeTime: '22:00', isOpen: true },
        { day: 'Tuesday', openTime: '10:00', closeTime: '22:00', isOpen: true },
        { day: 'Wednesday', openTime: '10:00', closeTime: '22:00', isOpen: true },
        { day: 'Thursday', openTime: '10:00', closeTime: '22:00', isOpen: true },
        { day: 'Friday', openTime: '10:00', closeTime: '22:00', isOpen: true },
        { day: 'Saturday', openTime: '10:00', closeTime: '22:00', isOpen: true },
        { day: 'Sunday', openTime: '10:00', closeTime: '22:00', isOpen: true },
      ],
    });
  }
  return settings;
};

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;

