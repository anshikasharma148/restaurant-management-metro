import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: [true, 'Please provide a table number'],
      unique: true,
    },
    capacity: {
      type: Number,
      required: [true, 'Please provide table capacity'],
      min: 1,
    },
    status: {
      type: String,
      enum: ['available', 'occupied', 'reserved'],
      default: 'available',
    },
  },
  {
    timestamps: true,
  }
);

const Table = mongoose.model('Table', tableSchema);

export default Table;

