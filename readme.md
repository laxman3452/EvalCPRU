# School Student Evaluation System

A production-ready Student Evaluation System for **Chaitanya Pathashala Rapti Upatyaka** built using Next.js (App Router), MongoDB, Tailwind CSS, and TypeScript.

## Features

- **Admin Portal**: Manage teachers, students, classes, and assignments.
- **Teacher Portal**: View assignments, create units & learning objectives, evaluate students.
- **Printable Evaluation Sheets**: Generates exact A4 printable layouts for assessments.
- **Role-Based Authentication**: Secure access using NextAuth credentials (Admin & Teacher).
- **Responsive UI**: Tailwind CSS for mobile and desktop screens.

## Setup Instructions

1. **Clone the repository** (if not already done).
2. **Install Dependencies**:
   \`\`\`bash
   npm install
   \`\`\`
3. **Environment Variables**:
   Copy \`.env.example\` to \`.env.local\` and fill in your MongoDB URI and Admin credentials.
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
4. **Seed Database**:
   Run the seed script to create initial data (e.g. dummy teacher).
   \`\`\`bash
   node seed.js
   \`\`\`
5. **Run Development Server**:
   \`\`\`bash
   npm run dev
   \`\`\`

## Deployment to Vercel

1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and import your repository.
3. In the **Environment Variables** section, add the variables from your \`.env.local\` file (\`MONGODB_URI\`, \`ADMIN_USERNAME\`, \`ADMIN_PASSWORD\`, \`AUTH_SECRET\`).
4. Click **Deploy**. Vercel will automatically detect the Next.js project and build it.

## Architecture

- **Next.js App Router**: Used for server components, layouts, and fast loading.
- **Mongoose**: Cleanly modeled Schemas with ObjectId references.
- **Tailwind CSS**: Print-specific utilities (\`print:hidden\`, \`print:bg-white\`) ensure the evaluation sheets look perfect on paper.
