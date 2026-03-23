import { PrismaService } from '@/prisma/prisma.service';

/**
 * Extract unified user data from PDS JSON structure
 */
export function extractUserData(pds: {
  personalData: Record<string, any>;
  familyData?: Record<string, any>;
  civilServiceData?: Record<string, any>;
}) {
  // Handle nested personalData structure if it exists
  const rawPersonal = pds.personalData || {};
  const personal = rawPersonal.personalData || rawPersonal;
  
  return {
    firstName: personal.firstName || null,
    lastName: personal.surname || personal.lastName || null,
    middleName: personal.middleName || null,
    nameExtension: personal.nameExtension || null,
    
    // Government IDs
    gsisId: personal.gsisId || null,
    pagibigId: personal.pagibigId || null,
    philhealthId: personal.philhealthId || null,
    sssId: personal.sssId || null,
    tinId: personal.tin || null,
    
    // Addresses
    residentialAddress: personal.residentialAddress || null,
    permanentAddress: personal.permanentAddress || null,
    
    // Contact
    phoneNumber: personal.mobileNo || null,
    telephoneNumber: personal.telephoneNo || null,
    
    // Station and Assignment
    jobTitle: personal.position || null,
    unit: personal.department || null,
    designation: personal.station || null,
    appointment: personal.appointment || null,
    appointmentDate: personal.appointmentDate ? new Date(personal.appointmentDate) : null,
    employeeNumber: personal.agencyEmployeeNo || personal.employeeNumber || null,
  };
}

/**
 * Auto-populate user profile from PDS data
 */
export async function populateUserProfile(
  prisma: PrismaService,
  accountId: string,
  pds: {
    personalData: Record<string, any>;
    familyData?: Record<string, any>;
    civilServiceData?: Record<string, any>;
  },
) {
  const userData = extractUserData(pds);

  // Check if account exists before trying to upsert profile
  const account = await prisma.account.findUnique({
    where: { id: accountId },
  });

  if (!account) {
    console.warn(`Attempted to populate profile for non-existent account: ${accountId}`);
    return null;
  }

  // Upsert user profile
  return prisma.user.upsert({
    where: { accountId },
    update: userData,
    create: {
      accountId,
      ...userData,
    },
  });
}

// Keep legacy exports empty or as aliases if needed to prevent immediate crashes before all files are updated
export const extractSchoolPersonnelData = extractUserData;
export const extractStaffData = extractUserData;
export const populateSchoolPersonnelProfile = populateUserProfile;
export const populateStaffProfile = populateUserProfile;

