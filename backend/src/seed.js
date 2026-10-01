require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');

const sampleProducts = [
  {
    name: 'Wireless Noise-Canceling Headphones',
    description: 'Immersive sound experience with industry-leading noise cancellation, 30-hour battery life, and crystal-clear voice calls.',
    price: 299.99,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Minimalist Smart Watch Series 5',
    description: 'Track your health, workouts, and notifications with a vibrant AMOLED display, heart rate sensor, and 7-day battery life.',
    price: 189.50,
    stock: 3,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Ergonomic Desk & Mesh Office Chair',
    description: 'Designed for lumbar support and all-day comfort. Features breathable mesh back, 3D armrests, and dynamic height adjustment.',
    price: 249.00,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d1298?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Mechanical RGB Gaming Keyboard',
    description: 'Tactile mechanical switches, customizable per-key RGB backlighting, aircraft-grade aluminum frame, and detachable wrist rest.',
    price: 129.99,
    stock: 0,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Vintage Leather Everyday Backpack',
    description: 'Crafted from full-grain genuine leather with a padded 15.6-inch laptop compartment, weather-resistant zipper, and rustic brass hardware.',
    price: 119.00,
    stock: 4,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Precision Barista Espresso Machine',
    description: '15-bar Italian pump pressure, integrated conical burr grinder, precise digital temperature control, and micro-foam milk steaming.',
    price: 499.00,
    stock: 6,
    image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'UltraWide Curved 34" 4K Monitor',
    description: '144Hz refresh rate, 1ms response time, HDR400 color precision, and ultra-narrow bezel for seamless multi-monitor setups.',
    price: 549.99,
    stock: 10,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Precision Wireless Ergonomic Mouse',
    description: 'Hyper-fast scroll wheel, multi-device connectivity, ergonomic thumb rest, and 70-day rechargeable battery.',
    price: 79.99,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
  }
];

const autoSeedDB = async () => {
  try {
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('Database has no products. Auto-seeding initial products...');
      await Product.insertMany(sampleProducts);
      console.log(`Auto-seeded ${sampleProducts.length} products!`);
    }

    // Ensure Admin Account exists
    const adminEmail = 'admin@sherystore.com';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      await User.create({
        name: 'Shery Admin',
        email: adminEmail,
        password: 'Admin@1234',
        role: 'admin',
      });
      console.log('Created default Admin user: admin@sherystore.com / Admin@1234');
    }
  } catch (error) {
    console.error('Auto-seed error:', error.message);
  }
};

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shery_app';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB...');

    // Clear existing products and re-seed
    await Product.deleteMany({});
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`Successfully seeded ${insertedProducts.length} products into database!`);

    // Ensure Admin Account exists
    const adminEmail = 'admin@sherystore.com';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        name: 'Shery Admin',
        email: adminEmail,
        password: 'Admin@1234',
        role: 'admin',
      });
      console.log('Created default Admin user: admin@sherystore.com / Admin@1234');
    } else {
      admin.role = 'admin';
      admin.password = 'Admin@1234';
      await admin.save();
      console.log('Updated existing Admin user role to admin.');
    }

    // Ensure Demo User Account exists
    const userEmail = 'user@sherystore.com';
    let demoUser = await User.findOne({ email: userEmail });
    if (!demoUser) {
      await User.create({
        name: 'Demo Customer',
        email: userEmail,
        password: 'User@1234',
        role: 'user',
      });
      console.log('Created default Customer user: user@sherystore.com / User@1234');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDB();
}

module.exports = { autoSeedDB, seedDB };
