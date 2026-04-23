/**
 * Quick-start script: Creates the default admin account.
 * Run once: node seedAdmin.js
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Admin = require('./models/Admin');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  let admin = await Admin.findOne({ username: 'admin' });
  if (!admin) {
    admin = await Admin.create({
      admin_id: 'ADM001',
      username: 'admin',
      password: 'admin123',
      name: 'Super Admin',
      email: 'admin@srms.com',
      role: 'superadmin',
    });
    console.log('✅ Admin created! Login with username: admin password: admin123');
    process.exit(0);
  }

  admin.admin_id = 'ADM001';
  admin.password = 'admin123';
  admin.name = 'Super Admin';
  admin.email = 'admin@srms.com';
  admin.role = 'superadmin';
  await admin.save();

  console.log('✅ Admin password reset! Login with username: admin password: admin123');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
