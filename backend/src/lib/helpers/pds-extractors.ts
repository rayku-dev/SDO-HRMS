import { PrismaService } from '@/prisma/prisma.service';

/**
 * Extract teacher data from PDS JSON structure
 */
export function extractTeacherData(pds: {
  personalData: Record<string, any>;
  civilServiceData?: Record<string, any>;
}) {
  const personal = pds.personalData || {};
  const civilService = pds.civilServiceData || {};

  return {
    firstName: personal.firstName || null,
    lastName: personal.surname || null,
    middleName: personal.middleName || null,
    nameExtension: personal.nameExtension || null,
    dateOfBirth: personal.dateOfBirth
      ? new Date(personal.dateOfBirth)
      : null,
    placeOfBirth: personal.placeOfBirth || null,
    sex: personal.sex || null,
    civilStatus: personal.civilStatus || null,
    height: personal.height || null,
    weight: personal.weight || null,
    bloodType: personal.bloodType || null,
    gsisId: personal.gsisId || null,
    pagibigId: personal.pagibigId || null,
    philhealthId: personal.philhealthId || null,
    sssId: personal.sssId || null,
    tin: personal.tin || null,
    agencyEmployeeNo: personal.agencyEmployeeNo || null,
    residentialAddress: personal.residentialAddress || null,
    permanentAddress: personal.permanentAddress || null,
    telephoneNo: personal.telephoneNo || null,
    mobileNo: personal.mobileNo || null,
    email: personal.email || null,
    station: personal.station || null,
    appointment: personal.appointment || null,
    appointmentDate: personal.appointmentDate
      ? new Date(personal.appointmentDate)
      : null,
  };
}

/**
 * Extract eligibility data from PDS civil service data
 */
export function extractEligibilities(
  civilServiceData?: Record<string, any>,
): Array<{
  careerService?: string;
  rating?: string;
  dateOfExam?: Date | null;
  placeOfExam?: string;
  licenseNumber?: string;
  validityDate?: Date | null;
}> {
  // Handle both 'eligibility' (singular) and 'eligibilities' (plural) for compatibility
  const eligibilityArray =
    civilServiceData?.eligibility || civilServiceData?.eligibilities;

  if (!civilServiceData || !Array.isArray(eligibilityArray)) {
    return [];
  }

  return eligibilityArray.map((elig: any) => ({
    careerService: elig.careerService || elig.careerServiceName || null,
    rating: elig.rating || null,
    dateOfExam: elig.dateOfExam ? new Date(elig.dateOfExam) : null,
    placeOfExam: elig.placeOfExam || null,
    licenseNumber: elig.licenseNumber || elig.licenseNo || null,
    validityDate: elig.validityDate ? new Date(elig.validityDate) : null,
  }));
}

/**
 * Extract employee data from PDS JSON structure
 */
export function extractEmployeeData(pds: {
  personalData: Record<string, any>;
}) {
  const personal = pds.personalData || {};

  // Build address string from residential or permanent address
  const residentialAddr = personal.residentialAddress;
  const permanentAddr = personal.permanentAddress;
  let addressStr = null;
  if (residentialAddr) {
    addressStr = [
      residentialAddr.houseBlockLotNo,
      residentialAddr.street,
      residentialAddr.subdivisionVillage,
      residentialAddr.barangay,
      residentialAddr.cityMunicipality,
      residentialAddr.province,
      residentialAddr.zipCode,
    ]
      .filter(Boolean)
      .join(', ');
  } else if (permanentAddr) {
    addressStr = [
      permanentAddr.houseBlockLotNo,
      permanentAddr.street,
      permanentAddr.subdivisionVillage,
      permanentAddr.barangay,
      permanentAddr.cityMunicipality,
      permanentAddr.province,
      permanentAddr.zipCode,
    ]
      .filter(Boolean)
      .join(', ');
  }

  return {
    firstName: personal.firstName || null,
    lastName: personal.surname || null,
    middleName: personal.middleName || null,
    dateOfBirth: personal.dateOfBirth
      ? new Date(personal.dateOfBirth)
      : null,
    placeOfBirth: personal.placeOfBirth || null,
    sex: personal.sex || null,
    civilStatus: personal.civilStatus || null,
    address: addressStr || null,
    phoneNumber: personal.mobileNo || personal.telephoneNo || null,
    position: personal.position || null,
    department: personal.department || null,
    employeeNumber: personal.agencyEmployeeNo || null,
  };
}

/**
 * Auto-populate teacher profile from PDS data
 */
export async function populateTeacherProfile(
  prisma: PrismaService,
  accountId: string,
  pds: {
    personalData: Record<string, any>;
    civilServiceData?: Record<string, any>;
  },
) {
  const teacherData = extractTeacherData(pds);
  const eligibilities = extractEligibilities(pds.civilServiceData);

  // Get or create teacher profile
  let teacherProfile = await prisma.teacherProfile.findUnique({
    where: { accountId },
  });

  if (!teacherProfile) {
    teacherProfile = await prisma.teacherProfile.create({
      data: {
        accountId,
      },
    });
  }

  // Upsert teacher data
  await prisma.teacherData.upsert({
    where: { teacherProfileId: teacherProfile.id },
    update: teacherData,
    create: {
      teacherProfileId: teacherProfile.id,
      ...teacherData,
    },
  });

  // Handle eligibilities - delete existing and create new ones
  if (eligibilities.length > 0) {
    await prisma.eligibility.deleteMany({
      where: { teacherProfileId: teacherProfile.id },
    });

    await prisma.eligibility.createMany({
      data: eligibilities.map((elig) => ({
        teacherProfileId: teacherProfile.id,
        ...elig,
      })),
    });
  }

  return teacherProfile;
}

/**
 * Auto-populate employee profile from PDS data
 */
export async function populateEmployeeProfile(
  prisma: PrismaService,
  accountId: string,
  pds: {
    personalData: Record<string, any>;
  },
) {
  const employeeData = extractEmployeeData(pds);

  await prisma.employeeProfile.upsert({
    where: { accountId },
    update: employeeData,
    create: {
      accountId,
      ...employeeData,
    },
  });
}
