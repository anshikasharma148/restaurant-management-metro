import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import User from '../models/User.js';
import MenuCategory from '../models/MenuCategory.js';
import MenuItem from '../models/MenuItem.js';
import Table from '../models/Table.js';
import Settings from '../models/Settings.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await MenuCategory.deleteMany({});
    await MenuItem.deleteMany({});
    await Table.deleteMany({});
    await Settings.deleteMany({});

    console.log('Cleared existing data...');

    // Create users
    const users = await User.create([
      {
        name: 'Admin User',
        email: 'admin@metro.com',
        password: 'admin123',
        role: 'admin',
      },
      {
        name: 'Manager User',
        email: 'manager@metro.com',
        password: 'manager123',
        role: 'manager',
      },
      {
        name: 'Cashier User',
        email: 'cashier@metro.com',
        password: 'cashier123',
        role: 'cashier',
      },
      {
        name: 'Kitchen Staff',
        email: 'kitchen@metro.com',
        password: 'kitchen123',
        role: 'kitchen',
      },
    ]);

    console.log('Created users...');

    // Create categories
    const categories = await MenuCategory.create([
      { name: 'Starters', emoji: '🥗' },
      { name: 'Main Course', emoji: '🍝' },
      { name: 'Burgers', emoji: '🍔' },
      { name: 'Pizza', emoji: '🍕' },
      { name: 'Desserts', emoji: '🍰' },
      { name: 'Beverages', emoji: '🥤' },
    ]);

    console.log('Created categories...');

    // Create menu items
    await MenuItem.create([
      // Starters
      {
        name: 'Caesar Salad',
        description: 'Fresh romaine, parmesan, croutons',
        price: 8.99,
        category: categories[0]._id,
        emoji: '🥗',
        available: true,
      },
      {
        name: 'Garlic Bread',
        description: 'Toasted with herb butter',
        price: 4.99,
        category: categories[0]._id,
        emoji: '🍞',
        available: true,
      },
      {
        name: 'Soup of the Day',
        description: "Chef's special",
        price: 5.99,
        category: categories[0]._id,
        emoji: '🍲',
        available: true,
      },
      {
        name: 'Bruschetta',
        description: 'Tomato, basil, olive oil',
        price: 6.99,
        category: categories[0]._id,
        emoji: '🍅',
        available: true,
      },
      // Main Course
      {
        name: 'Grilled Salmon',
        description: 'With lemon butter sauce',
        price: 18.99,
        category: categories[1]._id,
        emoji: '🐟',
        available: true,
      },
      {
        name: 'Chicken Parmesan',
        description: 'Breaded chicken with marinara',
        price: 15.99,
        category: categories[1]._id,
        emoji: '🍗',
        available: true,
      },
      {
        name: 'Pasta Carbonara',
        description: 'Creamy bacon pasta',
        price: 13.99,
        category: categories[1]._id,
        emoji: '🍝',
        available: true,
      },
      {
        name: 'Steak Frites',
        description: '8oz ribeye with fries',
        price: 24.99,
        category: categories[1]._id,
        emoji: '🥩',
        variants: [
          { name: 'Rare', priceModifier: 0 },
          { name: 'Medium', priceModifier: 0 },
          { name: 'Well Done', priceModifier: 0 },
        ],
        available: true,
      },
      // Burgers
      {
        name: 'Classic Burger',
        description: 'Beef patty, lettuce, tomato',
        price: 11.99,
        category: categories[2]._id,
        emoji: '🍔',
        variants: [
          { name: 'Single', priceModifier: 0 },
          { name: 'Double', priceModifier: 4 },
        ],
        available: true,
      },
      {
        name: 'Cheese Burger',
        description: 'With cheddar cheese',
        price: 12.99,
        category: categories[2]._id,
        emoji: '🧀',
        variants: [
          { name: 'Single', priceModifier: 0 },
          { name: 'Double', priceModifier: 4 },
        ],
        available: true,
      },
      {
        name: 'Veggie Burger',
        description: 'Plant-based patty',
        price: 10.99,
        category: categories[2]._id,
        emoji: '🌱',
        available: true,
      },
      // Pizza
      {
        name: 'Margherita',
        description: 'Tomato, mozzarella, basil',
        price: 12.99,
        category: categories[3]._id,
        emoji: '🍕',
        variants: [
          { name: 'Small', priceModifier: 0 },
          { name: 'Medium', priceModifier: 3 },
          { name: 'Large', priceModifier: 6 },
        ],
        available: true,
      },
      {
        name: 'Pepperoni',
        description: 'Classic pepperoni pizza',
        price: 14.99,
        category: categories[3]._id,
        emoji: '🍕',
        variants: [
          { name: 'Small', priceModifier: 0 },
          { name: 'Medium', priceModifier: 3 },
          { name: 'Large', priceModifier: 6 },
        ],
        available: true,
      },
      {
        name: 'BBQ Chicken',
        description: 'BBQ sauce, chicken, onions',
        price: 15.99,
        category: categories[3]._id,
        emoji: '🍕',
        variants: [
          { name: 'Small', priceModifier: 0 },
          { name: 'Medium', priceModifier: 3 },
          { name: 'Large', priceModifier: 6 },
        ],
        available: true,
      },
      // Desserts
      {
        name: 'Chocolate Cake',
        description: 'Rich chocolate layer cake',
        price: 6.99,
        category: categories[4]._id,
        emoji: '🍫',
        available: true,
      },
      {
        name: 'Cheesecake',
        description: 'New York style',
        price: 7.99,
        category: categories[4]._id,
        emoji: '🍰',
        available: true,
      },
      {
        name: 'Ice Cream',
        description: 'Three scoops',
        price: 4.99,
        category: categories[4]._id,
        emoji: '🍨',
        variants: [
          { name: 'Vanilla', priceModifier: 0 },
          { name: 'Chocolate', priceModifier: 0 },
          { name: 'Strawberry', priceModifier: 0 },
        ],
        available: true,
      },
      // Beverages
      {
        name: 'Soft Drink',
        description: 'Coca-Cola, Sprite, Fanta',
        price: 2.99,
        category: categories[5]._id,
        emoji: '🥤',
        available: true,
      },
      {
        name: 'Fresh Juice',
        description: 'Orange or Apple',
        price: 3.99,
        category: categories[5]._id,
        emoji: '🧃',
        variants: [
          { name: 'Orange', priceModifier: 0 },
          { name: 'Apple', priceModifier: 0 },
        ],
        available: true,
      },
      {
        name: 'Coffee',
        description: 'Freshly brewed',
        price: 2.49,
        category: categories[5]._id,
        emoji: '☕',
        variants: [
          { name: 'Regular', priceModifier: 0 },
          { name: 'Large', priceModifier: 1 },
        ],
        available: true,
      },
      {
        name: 'Beer',
        description: 'Draft or bottled',
        price: 5.99,
        category: categories[5]._id,
        emoji: '🍺',
        available: true,
      },
    ]);

    console.log('Created menu items...');

    // Create tables
    await Table.create([
      { number: 1, capacity: 2, status: 'available' },
      { number: 2, capacity: 2, status: 'available' },
      { number: 3, capacity: 4, status: 'available' },
      { number: 4, capacity: 4, status: 'available' },
      { number: 5, capacity: 4, status: 'available' },
      { number: 6, capacity: 6, status: 'available' },
      { number: 7, capacity: 6, status: 'available' },
      { number: 8, capacity: 8, status: 'available' },
      { number: 9, capacity: 8, status: 'available' },
      { number: 10, capacity: 10, status: 'available' },
    ]);

    console.log('Created tables...');

    // Create settings
    await Settings.create({
      restaurantName: 'Metro Restaurant',
      address: '123 Main Street, City',
      phone: '+1 234 567 8900',
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
      soundNotifications: true,
      autoPrint: false,
    });

    console.log('Created settings...');
    console.log('✅ Seed data created successfully!');
    console.log('\nDefault login credentials:');
    console.log('Admin: admin@metro.com / admin123');
    console.log('Manager: manager@metro.com / manager123');
    console.log('Cashier: cashier@metro.com / cashier123');
    console.log('Kitchen: kitchen@metro.com / kitchen123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

