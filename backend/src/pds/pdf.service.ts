import { Injectable } from '@nestjs/common';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PDFService {
  private cachedTemplateBytes: Buffer | null = null;
  private templateLastModified: number | null = null;

  private async getTemplateBytes(): Promise<Buffer> {
    // Try multiple possible paths for the PDF template
    const possiblePaths = [
      // Development path (when running from src/)
      path.join(
        process.cwd(),
        'src',
        'templates',
        'CS-Form-No.-212-revised-Personal-Data-Sheet.pdf',
      ),
      // Production path (when running from dist/)
      path.join(process.cwd(), 'templates', 'CS-Form-No.-212-revised-Personal-Data-Sheet.pdf'),
      // Alternative: relative to __dirname
      path.join(__dirname, '..', 'templates', 'CS-Form-No.-212-revised-Personal-Data-Sheet.pdf'),
      // Absolute path from project root
      path.join(
        process.cwd(),
        'backend',
        'src',
        'templates',
        'CS-Form-No.-212-revised-Personal-Data-Sheet.pdf',
      ),
    ];

    let templatePath: string | null = null;

    // Find the first existing path
    for (const testPath of possiblePaths) {
      try {
        if (fs.existsSync(testPath)) {
          templatePath = testPath;
          break;
        }
      } catch {
        // Continue to next path
      }
    }

    if (!templatePath) {
      const errorMessage = `PDF template not found. Searched in:\n${possiblePaths.join('\n')}\n\nPlease place CS-Form-No.-212-revised-Personal-Data-Sheet.pdf in one of these locations.`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    try {
      const stats = fs.statSync(templatePath);
      const currentModified = stats.mtime.getTime();

      if (
        !this.cachedTemplateBytes ||
        !this.templateLastModified ||
        currentModified > this.templateLastModified
      ) {
        this.cachedTemplateBytes = fs.readFileSync(templatePath);
        this.templateLastModified = currentModified;
        console.log(`PDF template loaded from: ${templatePath}`);
      }

      return this.cachedTemplateBytes;
    } catch (error: any) {
      const errorMessage = `Error loading PDF template from ${templatePath}: ${error.message}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  private formatDateToMMDDYYYY(dateString: string | Date): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return String(dateString);
    }
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${month}/${day}/${year}`;
  }

  async generateFilledPDF(allData: Record<string, any>): Promise<Buffer> {
    try {
      console.log('Starting PDF generation...');
      const existingPdfBytes = await this.getTemplateBytes();
      console.log('Template loaded, size:', existingPdfBytes.length, 'bytes');

      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const form = pdfDoc.getForm();

      // Field mapping from the original implementation
      const fieldMap = this.getFieldMap();

      // Process all field mappings
      for (const [key, pdfFieldName] of Object.entries(fieldMap)) {
        const formValue = this.getNestedValue(allData, key);

        if (formValue !== undefined && formValue !== null && formValue !== '') {
          try {
            const field = form.getTextField(pdfFieldName);
            let valueToSet = String(formValue);

            // Handle date formatting
            if (
              key.includes('date') ||
              key.includes('Date') ||
              key.includes('birthDate') ||
              key.includes('from') ||
              key.includes('to')
            ) {
              valueToSet = this.formatDateToMMDDYYYY(formValue);
            }

            field.setText(valueToSet);
          } catch (error) {
            // Try to get as checkbox if text field fails
            try {
              const checkField = form.getCheckBox(pdfFieldName);
              if (formValue === true || formValue === 'yes' || formValue === 'Yes') {
                checkField.check();
              } else {
                checkField.uncheck();
              }
            } catch (checkboxError) {
              // Field might not exist - skip silently
            }
          }
        }
      }

      // Handle checkboxes
      this.processCheckboxes(form, allData);

      // Handle arrays (children, work experience, etc.)
      this.processArrays(form, allData);

      // Flatten the form
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      form.updateFieldAppearances(font);
      form.flatten();

      const pdfBytes = await pdfDoc.save();
      console.log('PDF generated successfully, size:', pdfBytes.length, 'bytes');
      return Buffer.from(pdfBytes);
    } catch (error: any) {
      console.error('Error in generateFilledPDF:', error);
      throw new Error(`Failed to generate PDF: ${error.message}`);
    }
  }

  // Helper to get nested values from allData
  private getNestedValue(obj: any, path: string): any {
    const keys = path.split('.');
    let value = obj;
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return undefined;
      }
    }
    return value;
  }

  // Helpers to process checkboxes and arrays
  private processCheckboxes(form: any, data: Record<string, any>) {
    // Handle sex checkboxes
    if (data.personalData?.sex === 'Male') {
      try {
        form.getCheckBox('Check Box1').check();
      } catch {}
    } else if (data.personalData?.sex === 'Female') {
      try {
        form.getCheckBox('Check Box2').check();
      } catch {}
    }

    // Handle civil status
    const civilStatus = data.personalData?.civilStatus;
    if (civilStatus === 'Single') {
      try {
        form.getCheckBox('Check Box3').check();
      } catch {}
    } else if (civilStatus === 'Married') {
      try {
        form.getCheckBox('Check Box4').check();
      } catch {}
    } else if (civilStatus === 'Widowed') {
      try {
        form.getCheckBox('Check Box5').check();
      } catch {}
    } else if (civilStatus === 'Separated') {
      try {
        form.getCheckBox('Check Box6').check();
      } catch {}
    }

    // Handle citizenship
    if (data.personalData?.citizenship === 'Filipino') {
      try {
        form.getCheckBox('Check Box8').check();
      } catch {}
    } else if (
      data.personalData?.dualCitizenshipType &&
      data.personalData.dualCitizenshipType !== 'Dual'
    ) {
      try {
        form.getCheckBox('Check Box9').check();
        if (data.personalData.dualCitizenshipType === 'By Birth') {
          form.getCheckBox('Check Box10').check();
        } else if (data.personalData.dualCitizenshipType === 'By Naturalization') {
          form.getCheckBox('Check Box11').check();
        }
      } catch {}
    }
  }

  private processArrays(form: any, data: Record<string, any>) {
    // Process children array
    if (data.familyData?.children && Array.isArray(data.familyData.children)) {
      data.familyData.children.forEach((child: any, index: number) => {
        if (index < 12) {
          try {
            const nameField = form.getTextField(`Text${54 + index * 2}`);
            const birthDateField = form.getTextField(`Text${55 + index * 2}`);
            if (child.name) nameField.setText(child.name);
            if (child.birthDate) birthDateField.setText(this.formatDateToMMDDYYYY(child.birthDate));
          } catch {}
        }
      });
    }

    // Process Civil Service Eligibility
    if (data.civilServiceData?.eligibility && Array.isArray(data.civilServiceData.eligibility)) {
      data.civilServiceData.eligibility.forEach((elig: any, index: number) => {
        if (index < 7) {
          try {
            const careerField = form.getTextField(`civilCareer${index + 1}`);
            const ratingField = form.getTextField(`civilRating${index + 1}`);
            const examDateField = form.getTextField(`civilExamDate${index + 1}`);
            const placeField = form.getTextField(`civilPlace${index + 1}`);
            const licenseField = form.getTextField(`civilLicense${index + 1}`);
            const validityField = form.getTextField(`civilValidity${index + 1}`);

            if (elig.careerService) careerField.setText(elig.careerService);
            if (elig.rating) ratingField.setText(String(elig.rating));
            if (elig.dateOfExamination)
              examDateField.setText(this.formatDateToMMDDYYYY(elig.dateOfExamination));
            if (elig.placeOfExamination) placeField.setText(elig.placeOfExamination);
            if (elig.licenseNumber) licenseField.setText(elig.licenseNumber);
            if (elig.dateOfValidity)
              validityField.setText(this.formatDateToMMDDYYYY(elig.dateOfValidity));
          } catch {}
        }
      });
    }

    // Process Work Experience
    if (
      data.workExperienceData?.workExperience &&
      Array.isArray(data.workExperienceData.workExperience)
    ) {
      data.workExperienceData.workExperience.forEach((work: any, index: number) => {
        if (index < 28) {
          try {
            const fromField = form.getTextField(`workFrom${index + 1}`);
            const toField = form.getTextField(`workTo${index + 1}`);
            const positionField = form.getTextField(`workPosition${index + 1}`);
            const deptField = form.getTextField(`workDepartment${index + 1}`);
            const salaryField = form.getTextField(`workMonthlySalary${index + 1}`);
            const gradeField = form.getTextField(`workSalary${index + 1}`);
            const statusField = form.getTextField(`workStatus${index + 1}`);
            const govtField = form.getTextField(`workGovt${index + 1}`);

            if (work.from) fromField.setText(this.formatDateToMMDDYYYY(work.from));
            if (work.to) toField.setText(this.formatDateToMMDDYYYY(work.to));
            if (work.positionTitle) positionField.setText(work.positionTitle);
            if (work.department) deptField.setText(work.department);
            if (work.monthlySalary) salaryField.setText(String(work.monthlySalary));
            if (work.salaryGrade) gradeField.setText(work.salaryGrade);
            if (work.statusOfAppointment) statusField.setText(work.statusOfAppointment);
            if (work.governmentService) govtField.setText(work.governmentService);
          } catch {}
        }
      });
    }

    // Process Voluntary Work
    if (
      data.voluntaryWorkData?.voluntaryWork &&
      Array.isArray(data.voluntaryWorkData.voluntaryWork)
    ) {
      data.voluntaryWorkData.voluntaryWork.forEach((vol: any, index: number) => {
        if (index < 7) {
          try {
            const orgField = form.getTextField(`voluntaryName${index + 1}`);
            const fromField = form.getTextField(`voluntaryFrom${index + 1}`);
            const toField = form.getTextField(`voluntaryTo${index + 1}`);
            const hoursField = form.getTextField(`voluntaryHours${index + 1}`);
            const posField = form.getTextField(`voluntaryPosition${index + 1}`);
            if (vol.organization) orgField.setText(vol.organization);
            if (vol.dateFrom) fromField.setText(this.formatDateToMMDDYYYY(vol.dateFrom));
            if (vol.dateTo) toField.setText(this.formatDateToMMDDYYYY(vol.dateTo));
            if (vol.numberOfHours) hoursField.setText(String(vol.numberOfHours));
            if (vol.position) posField.setText(vol.position);
          } catch {}
        }
      });
    }

    // Process Learning and Development (Training Programs)
    if (
      data.trainingProgramsData?.trainingPrograms &&
      Array.isArray(data.trainingProgramsData.trainingPrograms)
    ) {
      data.trainingProgramsData.trainingPrograms.forEach((training: any, index: number) => {
        if (index < 21) {
          try {
            const titleField = form.getTextField(`trainingTitle${index + 1}`);
            const fromField = form.getTextField(`trainingFrom${index + 1}`);
            const toField = form.getTextField(`trainingTo${index + 1}`);
            const hoursField = form.getTextField(`trainingHours${index + 1}`);
            const typeField = form.getTextField(`trainingType${index + 1}`);
            const conductedField = form.getTextField(`trainingConductedBy${index + 1}`);

            if (training.title) titleField.setText(training.title);
            if (training.inclusiveDatesFrom)
              fromField.setText(this.formatDateToMMDDYYYY(training.inclusiveDatesFrom));
            if (training.inclusiveDatesTo)
              toField.setText(this.formatDateToMMDDYYYY(training.inclusiveDatesTo));
            if (training.hours) hoursField.setText(String(training.hours));
            if (training.type) typeField.setText(training.type);
            if (training.conductedBy) conductedField.setText(training.conductedBy);
          } catch {}
        }
      });
    }

    // Process Disclosures (Questions 34-40)
    if (data.lastpData?.answers && Array.isArray(data.lastpData.answers)) {
      const answerMappings: Record<
        number,
        { yes: string; no: string; details?: string; dateFiled?: string; status?: string }
      > = {
        0: { yes: 'Check Box12', no: 'Check Box13' }, // 34a
        1: { yes: 'Check Box14', no: 'Check Box15', details: 'Text311' }, // 34b
        2: { yes: 'Check Box16', no: 'Check Box17', details: 'Text312' }, // 35a
        3: {
          yes: 'Check Box18',
          no: 'Check Box19',
          details: 'Text313',
          dateFiled: 'Text314',
          status: 'Text315',
        }, // 35b
        4: { yes: 'Check Box20', no: 'Check Box21', details: 'Text316' }, // 36
        5: { yes: 'Check Box22', no: 'Check Box23', details: 'Text317' }, // 37
        6: { yes: 'Check Box24', no: 'Check Box25', details: 'Text318' }, // 38a
        7: { yes: 'Check Box26', no: 'Check Box27', details: 'Text319' }, // 38b
        8: { yes: 'Check Box28', no: 'Check Box29', details: 'Text320' }, // 39
        9: { yes: 'Check Box30', no: 'Check Box31', details: 'Text321' }, // 40a
        10: { yes: 'Check Box32', no: 'Check Box33', details: 'Text322' }, // 40b
        11: { yes: 'Check Box34', no: 'Check Box35', details: 'Text323' }, // 40c
      };

      data.lastpData.answers.forEach((ans: any, index: number) => {
        const mapping = answerMappings[index];
        if (!mapping) return;

        try {
          // Handle Yes/No checkboxes
          const yesField = form.getCheckBox(mapping.yes);
          const noField = form.getCheckBox(mapping.no);

          if (ans.value === 'Yes' || ans.value === true || ans.value === 'Y') {
            yesField.check();
            noField.uncheck();
          } else if (ans.value === 'No' || ans.value === false || ans.value === 'N') {
            yesField.uncheck();
            noField.check();
          } else {
            // Neither checked
            yesField.uncheck();
            noField.uncheck();
          }

          // Handle details field
          if (mapping.details && ans.details) {
            const detailsField = form.getTextField(mapping.details);
            detailsField.setText(String(ans.details));
          }

          // Handle special fields for question 35b (index 3)
          if (index === 3) {
            if (mapping.dateFiled && ans.dateFiled) {
              const dateField = form.getTextField(mapping.dateFiled);
              dateField.setText(this.formatDateToMMDDYYYY(ans.dateFiled));
            }
            if (mapping.status && ans.status) {
              const statusField = form.getTextField(mapping.status);
              statusField.setText(String(ans.status));
            }
          }
        } catch {}
      });
    }

    // Process otherInfo arrays (skills, nonAcad, member)
    if (data.otherInfo) {
      // Process Special Skills / Hobbies
      if (data.otherInfo.skills && Array.isArray(data.otherInfo.skills)) {
        data.otherInfo.skills.forEach((skill: any, index: number) => {
          if (index < 7 && skill) {
            try {
              const skillField = form.getTextField(`specialSkill${index + 1}`);
              skillField.setText(String(skill));
            } catch {}
          }
        });
      }

      // Process Non-Academic Distinctions / Recognition
      if (data.otherInfo.nonAcad && Array.isArray(data.otherInfo.nonAcad)) {
        data.otherInfo.nonAcad.forEach((nonAcad: any, index: number) => {
          if (index < 7 && nonAcad) {
            try {
              const nonAcadField = form.getTextField(`nonAcad${index + 1}`);
              nonAcadField.setText(String(nonAcad));
            } catch {}
          }
        });
      }

      // Process Membership in Association / Organization
      if (data.otherInfo.member && Array.isArray(data.otherInfo.member)) {
        data.otherInfo.member.forEach((member: any, index: number) => {
          if (index < 7 && member) {
            try {
              const memberField = form.getTextField(`member${index + 1}`);
              memberField.setText(String(member));
            } catch {}
          }
        });
      }
    }
  }

  private getFieldMap(): Record<string, string> {
    return {
      // Personal Information
      'personalData.surname': 'Text1',
      'personalData.firstName': 'Text2',
      'personalData.middleName': 'Text3',
      'personalData.nameExtension': 'Text4',
      'personalData.dateOfBirth': 'Text5',
      'personalData.placeOfBirth': 'Text6',
      'personalData.civilStatusOthersText': 'Text7',
      'personalData.height': 'Text8',
      'personalData.weight': 'Text9',
      'personalData.bloodType': 'Text10',
      'personalData.gsisId': 'Text11',
      'personalData.pagibigId': 'Text12',
      'personalData.philhealthId': 'Text13',
      'personalData.sssId': 'Text14',
      'personalData.tin': 'Text15',
      'personalData.agencyEmployeeNo': 'Text16',
      'personalData.dualCitizenshipCountry': 'Text17',
      'personalData.residentialAddress.houseBlockLotNo': 'Text18',
      'personalData.residentialAddress.street': 'Text19',
      'personalData.residentialAddress.subdivisionVillage': 'Text20',
      'personalData.residentialAddress.barangay': 'Text21',
      'personalData.residentialAddress.cityMunicipality': 'Text22',
      'personalData.residentialAddress.province': 'Text23',
      'personalData.residentialAddress.zipCode': 'Text24',
      'personalData.permanentAddress.houseBlockLotNo': 'Text25',
      'personalData.permanentAddress.street': 'Text26',
      'personalData.permanentAddress.subdivisionVillage': 'Text27',
      'personalData.permanentAddress.barangay': 'Text28',
      'personalData.permanentAddress.cityMunicipality': 'Text29',
      'personalData.permanentAddress.province': 'Text30',
      'personalData.permanentAddress.zipCode': 'Text31',
      'personalData.telephoneNo': 'Text32',
      'personalData.mobileNo': 'Text33',
      'personalData.email': 'Text34',
      // Family Background
      'familyData.spouse.surname': 'Text35',
      'familyData.spouse.firstName': 'Text36',
      'familyData.spouse.nameExtension': 'Text37',
      'familyData.spouse.middleName': 'Text38',
      'familyData.spouse.occupation': 'Text39',
      'familyData.spouse.employer': 'Text40',
      'familyData.spouse.businessAddress': 'Text41',
      'familyData.spouse.telephone': 'Text42',
      'familyData.father.surname': 'Text43',
      'familyData.father.firstName': 'Text44',
      'familyData.father.nameExtension': 'Text45',
      'familyData.father.middleName': 'Text46',
      'familyData.mother.surname': 'Text47',
      'familyData.mother.firstName': 'Text48',
      'familyData.mother.middleName': 'Text49',
      // Educational Background
      'educationalData.elementary.name': 'Text79',
      'educationalData.elementary.basicEducation': 'Text80',
      'educationalData.elementary.periodFrom': 'Text81',
      'educationalData.elementary.periodTo': 'Text82',
      'educationalData.elementary.highestLevel': 'Text83',
      'educationalData.elementary.yearGraduated': 'Text84',
      'educationalData.elementary.scholarship': 'Text85',
      'educationalData.secondary.name': 'Text86',
      'educationalData.secondary.basicEducation': 'Text87',
      'educationalData.secondary.periodFrom': 'Text88',
      'educationalData.secondary.periodTo': 'Text89',
      'educationalData.secondary.highestLevel': 'Text90',
      'educationalData.secondary.yearGraduated': 'Text91',
      'educationalData.secondary.scholarship': 'Text92',
      'educationalData.vocational.name': 'Text93',
      'educationalData.vocational.basicEducation': 'Text94',
      'educationalData.vocational.periodFrom': 'Text95',
      'educationalData.vocational.periodTo': 'Text96',
      'educationalData.vocational.highestLevel': 'Text97',
      'educationalData.vocational.yearGraduated': 'Text98',
      'educationalData.vocational.scholarship': 'Text99',
      'educationalData.college.name': 'Text100',
      'educationalData.college.basicEducation': 'Text101',
      'educationalData.college.periodFrom': 'Text102',
      'educationalData.college.periodTo': 'Text103',
      'educationalData.college.highestLevel': 'Text104',
      'educationalData.college.yearGraduated': 'Text105',
      'educationalData.college.scholarship': 'Text106',
      'educationalData.graduate.name': 'Text107',
      'educationalData.graduate.basicEducation': 'Text108',
      'educationalData.graduate.periodFrom': 'Text109',
      'educationalData.graduate.periodTo': 'Text110',
      'educationalData.graduate.highestLevel': 'Text111',
      'educationalData.graduate.yearGraduated': 'Text112',
      'educationalData.graduate.scholarship': 'Text113',
      // References
      'lastpData.references.0.name': 'Text324',
      'lastpData.references.0.address': 'Text325',
      'lastpData.references.0.tel': 'Text326',
      'lastpData.references.1.name': 'Text327',
      'lastpData.references.1.address': 'Text328',
      'lastpData.references.1.tel': 'Text329',
      'lastpData.references.2.name': 'Text330',
      'lastpData.references.2.address': 'Text331',
      'lastpData.references.2.tel': 'Text332',
      // Declaration
      'lastpData.declaration.issuedId': 'Text333',
      'lastpData.declaration.adminOath': 'Text334',
      'lastpData.declaration.datePlaceOfIssuance': 'Text335',
      'lastpData.declaration.dateAccomplished': 'Text336',
      'lastpData.declaration.place': 'Text337',
    };
  }
}
