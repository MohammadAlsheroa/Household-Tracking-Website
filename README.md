# Household Inventory Tracker

A full-stack CRUD web application for tracking household item storage with comprehensive features for managing items, storage locations, and inventory.

## Features

- **Item Management**: Add, view, edit, and delete items with details like name, category, quantity, location, dates, and images
- **Storage Location Management**: Organize items by rooms and storage locations
- **Search & Filter**: Search by name, category, location, and filter by expiration dates and quantities
- **Dashboard**: View statistics, recently added items, and items expiring soon
- **Bulk Operations**: Delete multiple items or move them to different locations
- **Image Upload**: Upload and preview item images

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Form Validation**: React Hook Form + Zod
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm installed
- Basic knowledge of terminal/command line

### Installation & Initialization

1. **Clone or download the repository:**
```bash
git clone <repository-url>
cd Household-Tracking-Website
```

2. **Install dependencies:**
```bash
npm install
```

3. **Initialize the database:**
```bash
# Generate Prisma client
npx prisma generate

# Create database schema and tables
npx prisma db push

# (Optional) Seed the database with sample data
npx prisma db seed
```

4. **Start the development server:**
```bash
npm run dev
```

5. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000) to access the application.

### Important Notes

- **Database Location**: The SQLite database file will be created at `prisma/dev.db` after initialization
- **Upload Directory**: Image uploads are stored in `public/uploads/` (created automatically on first upload)
- **Environment**: Make sure you're running Node.js 18 or higher for optimal compatibility

## Project Structure

```
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── components/     # React components
│   └── page.tsx        # Main page
├── prisma/             # Database schema and migrations
├── lib/                # Utility functions
└── public/             # Static files and uploads
```

## Database Schema

- **Item**: Stores item details (name, category, quantity, location, dates, notes, image)
- **StorageLocation**: Stores storage location information (name, room, description)
- **Category**: Predefined categories for items

