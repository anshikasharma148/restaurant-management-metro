import mongoose from 'mongoose';

const menuCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a category name'],
      trim: true,
    },
    emoji: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const MenuCategory = mongoose.model('MenuCategory', menuCategorySchema);

export default MenuCategory;

