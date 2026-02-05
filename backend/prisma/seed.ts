import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Hash passwords
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const hrPassword = await bcrypt.hash('Hr@123', 10);
  const employeePassword = await bcrypt.hash('Employee@123', 10);
  const teacherPassword = await bcrypt.hash('Teacher@123', 10);
  const regularPassword = await bcrypt.hash('Regular@123', 10);

  // Create admin account
  const admin = await prisma.account.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      role: Role.ADMIN,
      isActive: true,
      employeeProfile: {
        create: {
          firstName: 'Admin',
          lastName: 'User',
          position: 'System Administrator',
          department: 'IT',
        },
      },
    },
  });

  // Create HR account
  const hr = await prisma.account.upsert({
    where: { email: 'hr@example.com' },
    update: {},
    create: {
      email: 'hr@example.com',
      password: hrPassword,
      role: Role.HR,
      isActive: true,
      employeeProfile: {
        create: {
          firstName: 'HR',
          lastName: 'Manager',
          position: 'HR Manager',
          department: 'Human Resources',
        },
      },
    },
  });

  // Create employee account
  const employee = await prisma.account.upsert({
    where: { email: 'employee@example.com' },
    update: {},
    create: {
      email: 'employee@example.com',
      password: employeePassword,
      role: Role.EMPLOYEE,
      isActive: true,
      employeeProfile: {
        create: {
          firstName: 'Employee',
          lastName: 'User',
          position: 'Staff',
          department: 'Operations',
        },
      },
    },
  });

  // Create teacher account
  const teacher = await prisma.account.upsert({
    where: { email: 'teacher@example.com' },
    update: {},
    create: {
      email: 'teacher@example.com',
      password: teacherPassword,
      role: Role.TEACHER,
      isActive: true,
      teacherProfile: {
        create: {
          teacherData: {
            create: {
              firstName: 'Teacher',
              lastName: 'User',
              station: 'Main Campus',
              appointment: 'Permanent',
            },
          },
        },
      },
    },
  });

  // Create regular account
  const regular = await prisma.account.upsert({
    where: { email: 'regular@example.com' },
    update: {},
    create: {
      email: 'regular@example.com',
      password: regularPassword,
      role: Role.REGULAR,
      isActive: true,
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('Admin:', { email: admin.email, password: 'Admin@123' });
  console.log('HR:', { email: hr.email, password: 'Hr@123' });
  console.log('Employee:', { email: employee.email, password: 'Employee@123' });
  console.log('Teacher:', { email: teacher.email, password: 'Teacher@123' });
  console.log('Regular:', { email: regular.email, password: 'Regular@123' });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
