import mongoose from 'mongoose';

const menuVariantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  priceModifier: {
    type: Number,
    default: 0,
  },
});

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a menu item name'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuCategory',
      required: [true, 'Please provide a category'],
    },
    emoji: {
      type: String,
      default: '',
    },
    variants: [menuVariantSchema],
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

export default MenuItem;

