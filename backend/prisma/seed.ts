import { PrismaClient, Role } from '@prisma/client';
import * as bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Hash passwords
  const adminPassword = await bcryptjs.hash('Admin@123', 10);
  const approvingAuthorityPassword = await bcryptjs.hash('ApprovingAuthority@123', 10);
  const employeePassword = await bcryptjs.hash('Employee@123', 10);
  const hrAssociatePassword = await bcryptjs.hash('HrAssociate@123', 10);
  const hrHeadPassword = await bcryptjs.hash('HrHead@123', 10);
  const unitHeadPassword = await bcryptjs.hash('UnitHead@123', 10);
  const schoolPersonnelPassword = await bcryptjs.hash('SchoolPersonnel@123', 10);

  // Create admin account
  const admin = await prisma.account.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      role: Role.ADMIN,
      isActive: true,
      user: {
        create: {
          firstName: 'Admin',
          lastName: 'User',
          jobTitle: 'System Administrator',
          unit: 'IT',
        },
      },
    },
  });

  // Create Approving Authority account
  const approvingAuthority = await prisma.account.upsert({
    where: { email: 'approving.authority@example.com' },
    update: {},
    create: {
      email: 'approving.authority@example.com',
      password: approvingAuthorityPassword,
      role: Role.APPROVING_AUTHORITY,
      isActive: true,
      user: {
        create: {
          firstName: 'Approving',
          lastName: 'Authority',
          jobTitle: 'Department Head',
          unit: 'Administration',
        },
      },
    },
  });

  // Create Employee account
  const employee = await prisma.account.upsert({
    where: { email: 'employee@example.com' },
    update: {},
    create: {
      email: 'employee@example.com',
      password: employeePassword,
      role: Role.EMPLOYEE,
      isActive: true,
      user: {
        create: {
          firstName: 'Employee',
          lastName: 'User',
          jobTitle: 'Staff',
          unit: 'Operations',
        },
      },
    },
  });

  // Create HR Associate account
  const hrAssociate = await prisma.account.upsert({
    where: { email: 'hr.associate@example.com' },
    update: {},
    create: {
      email: 'hr.associate@example.com',
      password: hrAssociatePassword,
      role: Role.HR_ASSOCIATE,
      isActive: true,
      user: {
        create: {
          firstName: 'HR',
          lastName: 'Associate',
          jobTitle: 'HR Associate',
          unit: 'Human Resources',
        },
      },
    },
  });

  // Create HR Head account
  const hrHead = await prisma.account.upsert({
    where: { email: 'hr.head@example.com' },
    update: {},
    create: {
      email: 'hr.head@example.com',
      password: hrHeadPassword,
      role: Role.HR_HEAD,
      isActive: true,
      user: {
        create: {
          firstName: 'HR',
          lastName: 'Head',
          jobTitle: 'HR Head',
          unit: 'Human Resources',
        },
      },
    },
  });

  // Create Unit Head account
  const unitHead = await prisma.account.upsert({
    where: { email: 'unit.head@example.com' },
    update: {},
    create: {
      email: 'unit.head@example.com',
      password: unitHeadPassword,
      role: Role.UNIT_HEAD,
      isActive: true,
      user: {
        create: {
          firstName: 'Unit',
          lastName: 'Head',
          jobTitle: 'Unit Head',
          unit: 'Operations',
        },
      },
    },
  });

  // Create School Personnel account
  const schoolPersonnel = await prisma.account.upsert({
    where: { email: 'school.personnel@example.com' },
    update: {},
    create: {
      email: 'school.personnel@example.com',
      password: schoolPersonnelPassword,
      role: Role.SCHOOL_PERSONNEL,
      isActive: true,
      user: {
        create: {
          firstName: 'School',
          lastName: 'Personnel',
          designation: 'Main Campus',
          appointment: 'Permanent',
        },
      },
    },
  });

  // Seed default file categories
  const categories = [
    { name: 'Certificates', description: 'Training certificates and awards' },
    { name: 'Diplomas', description: 'Academic diplomas and degrees' },
    { name: 'Clearances', description: 'NBI, Police, and other clearances' },
    { name: 'Evaluations', description: 'Performance evaluations' },
    { name: 'Other', description: 'Other documents' },
  ];

  for (const cat of categories) {
    await prisma.fileCategory.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }
  console.log('✅ File categories seeded');

  console.log('✅ Database seeded successfully!');
  console.log('Admin:', { email: admin.email, password: 'Admin@123' });
  console.log('Approving Authority:', {
    email: approvingAuthority.email,
    password: 'ApprovingAuthority@123',
  });
  console.log('Employee:', { email: employee.email, password: 'Employee@123' });
  console.log('HR Associate:', { email: hrAssociate.email, password: 'HrAssociate@123' });
  console.log('HR Head:', { email: hrHead.email, password: 'HrHead@123' });
  console.log('Unit Head:', { email: unitHead.email, password: 'UnitHead@123' });
  console.log('School Personnel:', {
    email: schoolPersonnel.email,
    password: 'SchoolPersonnel@123',
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
