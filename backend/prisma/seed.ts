import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Hash passwords
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const approvingAuthorityPassword = await bcrypt.hash('ApprovingAuthority@123', 10);
  const employeePassword = await bcrypt.hash('Employee@123', 10);
  const hrAssociatePassword = await bcrypt.hash('HrAssociate@123', 10);
  const hrHeadPassword = await bcrypt.hash('HrHead@123', 10);
  const unitHeadPassword = await bcrypt.hash('UnitHead@123', 10);
  const schoolPersonnelPassword = await bcrypt.hash('SchoolPersonnel@123', 10);
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
      staffProfile: {
        create: {
          staffData: {
            create: {
              firstName: 'Admin',
              lastName: 'User',
              position: 'System Administrator',
              department: 'IT',
            },
          },
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
      staffProfile: {
        create: {
          staffData: {
            create: {
              firstName: 'Approving',
              lastName: 'Authority',
              position: 'Department Head',
              department: 'Administration',
            },
          },
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
      staffProfile: {
        create: {
          staffData: {
            create: {
              firstName: 'Employee',
              lastName: 'User',
              position: 'Staff',
              department: 'Operations',
            },
          },
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
      staffProfile: {
        create: {
          staffData: {
            create: {
              firstName: 'HR',
              lastName: 'Associate',
              position: 'HR Associate',
              department: 'Human Resources',
            },
          },
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
      staffProfile: {
        create: {
          staffData: {
            create: {
              firstName: 'HR',
              lastName: 'Head',
              position: 'HR Head',
              department: 'Human Resources',
            },
          },
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
      staffProfile: {
        create: {
          staffData: {
            create: {
              firstName: 'Unit',
              lastName: 'Head',
              position: 'Unit Head',
              department: 'Operations',
            },
          },
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
      schoolPersonnelProfile: {
        create: {
          schoolPersonnelData: {
            create: {
              firstName: 'School',
              lastName: 'Personnel',
              station: 'Main Campus',
              appointment: 'Permanent',
            },
          },
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
  console.log('Approving Authority:', { email: approvingAuthority.email, password: 'ApprovingAuthority@123' });
  console.log('Employee:', { email: employee.email, password: 'Employee@123' });
  console.log('HR Associate:', { email: hrAssociate.email, password: 'HrAssociate@123' });
  console.log('HR Head:', { email: hrHead.email, password: 'HrHead@123' });
  console.log('Unit Head:', { email: unitHead.email, password: 'UnitHead@123' });
  console.log('School Personnel:', { email: schoolPersonnel.email, password: 'SchoolPersonnel@123' });
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
