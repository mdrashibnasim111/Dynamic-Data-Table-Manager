# **App Name**: DataGrid Pro

## Core Features:

- Table View: Display a table with default columns: Name, Email, Age, Role with sorting (ASC/DESC), global search, and client-side pagination.
- Dynamic Columns Management: A modal to add new fields (e.g., Department, Location) and show/hide existing columns, reflecting changes dynamically in the table. Persist column visibility in localStorage.
- CSV Import: Upload and parse CSV files, showing errors for invalid formats.
- CSV Export: Export the current table view to a .csv file, including only visible columns.
- Inline Row Editing: Double-click to edit fields inline, with input validation (e.g., age must be a number) and "Save All"/"Cancel All" buttons.
- Theme Toggle: Switch between Light and Dark mode using MUI theming.

## Style Guidelines:

- Primary color: Deep Indigo (#3F51B5) to reflect data handling and professionalism.
- Background color: Very light Indigo (#F0F2F9) for a clean, readable surface.
- Accent color: Soft Green (#4CAF50) to highlight interactive elements and confirmations, providing a sense of stability.
- Body and headline font: 'Inter' sans-serif, for a clean, modern, readable UI.
- Use simple, geometric icons from Material UI to represent actions and status.
- Maintain a consistent grid layout with sufficient white space to ensure data is easily scannable.
- Subtle animations for loading states and transitions to enhance user experience without being distracting.