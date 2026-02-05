# PDS Generator Setup Guide

This guide will help you set up the Personal Data Sheet (PDS) generator system.

## Prerequisites

1. Make sure you have Node.js and npm/pnpm installed
2. PostgreSQL database running
3. The official CS Form No. 212 (Revised) PDF template file

## Setup Steps

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Place the PDF template file:
   - Copy your `CS-Form-No.-212-revised-Personal-Data-Sheet.pdf` file to:
   ```
   backend/src/templates/CS-Form-No.-212-revised-Personal-Data-Sheet.pdf
   ```
   - Create the `templates` directory if it doesn't exist:
   ```bash
   mkdir -p src/templates
   ```

4. Set up your database:
   - Update your `.env` file with your database connection string:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
   ```

5. Run Prisma migrations:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

6. Start the backend server:
   ```bash
   npm run start:dev
   ```

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Update your `.env.local` file with the API URL:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

## Features

### Admin Features

1. **View All PDS**: Access `/admin/pds` to see all Personal Data Sheets
2. **Create New PDS**: Click "New PDS" to create a new Personal Data Sheet
3. **Edit PDS**: Click "View/Edit" on any PDS to edit it
4. **Search**: Use the search bar to find PDS by name or email
5. **Download PDF**: Download the filled PDF directly from the form

### Form Sections

The PDS form includes the following sections:

1. **Personal Information**
   - Basic personal details
   - Addresses (residential and permanent)
   - Contact information
   - Government IDs (GSIS, Pag-IBIG, PhilHealth, SSS, TIN)

2. **Family Background**
   - Spouse information
   - Father and mother information
   - Children (add multiple entries)

3. **Educational Background**
   - Elementary
   - Secondary
   - Vocational
   - College
   - Graduate studies

4. **Civil Service Eligibility**
   - Add multiple eligibility entries
   - Include examination details, ratings, and validity dates

5. **Work Experience**
   - Add multiple work experiences
   - Include dates, positions, salaries, and appointment status

6. **Voluntary Work**
   - Add multiple voluntary work entries
   - Include organization details and hours

7. **Training Programs (Learning and Development)**
   - Add multiple training programs
   - Include dates, hours, and conducting organization

8. **Other Information**
   - References (up to 3)
   - Declaration section

## API Endpoints

### PDS Endpoints

- `POST /pds/upsert` - Create or update PDS
- `GET /pds/:userId` - Get PDS by user ID
- `GET /pds` - Get all PDS (admin only)
- `POST /pds/generate-pdf` - Generate PDF from PDS data
- `DELETE /pds/:userId` - Delete PDS (admin only)

## Database Schema

The PDS model includes:

- `personalData` (JSON) - Personal information
- `familyData` (JSON) - Family background
- `educationalData` (JSON) - Educational background
- `civilServiceData` (JSON, optional) - Civil service eligibility
- `workExperience` (JSON, optional) - Work experience
- `voluntaryWork` (JSON, optional) - Voluntary work
- `trainingPrograms` (JSON, optional) - Training programs
- `otherInfo` (JSON, optional) - Other information
- `lastpData` (JSON, optional) - References and declaration
- `status` (String) - Status of PDS (draft, submitted, approved)

## Notes

1. **PDF Template**: Make sure the PDF template file is placed in the correct location. The system will cache the template for better performance.

2. **Field Mapping**: The PDF service maps form fields to PDF form field names. If you're using a different PDF template, you may need to update the field mapping in `backend/src/pds/pdf.service.ts`.

3. **Auto-fill**: When editing a PDS, all previously saved data will be automatically loaded and filled into the form.

4. **PDF Preview**: The preview feature generates a PDF on the fly and displays it using react-pdf. This requires the PDF template to be accessible.

5. **Download**: The download button generates a filled PDF and automatically downloads it to the user's device.

## Troubleshooting

### PDF Template Not Found
- Ensure the PDF template is in `backend/src/templates/CS-Form-No.-212-revised-Personal-Data-Sheet.pdf`
- Check file permissions

### PDF Generation Fails
- Verify the PDF template has form fields with the correct names
- Check the field mapping in `pdf.service.ts`
- Review backend logs for specific error messages

### Data Not Saving
- Verify database connection
- Check Prisma migrations are up to date
- Ensure user authentication is working

## Development

### Backend
- Location: `backend/src/pds/`
- Main files:
  - `pds.controller.ts` - API endpoints
  - `pds.service.ts` - Business logic
  - `pdf.service.ts` - PDF generation logic
  - `dto/` - Data transfer objects

### Frontend
- Location: `frontend/app/(protected)/admin/pds/`
- Main files:
  - `page.tsx` - PDS list page
  - `new/page.tsx` - Create new PDS
  - `[userId]/page.tsx` - Edit PDS
  - `components/pds/pds-form.tsx` - Main form component
  - `components/pds/pdf-preview.tsx` - PDF preview component

## License

This project is part of your HRMIS system.
