# PDF Templates Directory

## Required Files

Place the official CS Form No. 212 (Revised) PDF template file here:

**File Name:** `CS-Form-No.-212-revised-Personal-Data-Sheet.pdf`

## How to Get the Template

1. Download the official CS Form No. 212 (Revised) Personal Data Sheet from the Civil Service Commission (CSC) website
2. Save it in this directory with the exact filename: `CS-Form-No.-212-revised-Personal-Data-Sheet.pdf`

## Important Notes

- The PDF must have form fields (not a flat PDF)
- The field names should match the ones in `pdf.service.ts` field mapping
- After placing the file, restart your backend server

## File Path

The system will look for the template in the following locations (in order):
1. `backend/src/templates/CS-Form-No.-212-revised-Personal-Data-Sheet.pdf` (development)
2. `backend/templates/CS-Form-No.-212-revised-Personal-Data-Sheet.pdf` (production)
3. Relative to compiled code location

Make sure the file exists in at least one of these locations.
