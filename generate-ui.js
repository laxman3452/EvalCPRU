const fs = require('fs');
const path = require('path');

const files = {
  "src/middleware.ts": `import { auth } from "../auth";
import { NextResponse } from "next-auth/middleware";
import type { NextRequest } from 'next/server';

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isAuthRoute = nextUrl.pathname.startsWith("/login");
  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  
  if (isApiAuthRoute) return;

  if (isAuthRoute) {
    if (isLoggedIn) {
      const role = req.auth?.user?.role;
      if (role === "admin") return Response.redirect(new URL("/admin", nextUrl));
      if (role === "teacher") return Response.redirect(new URL("/teacher", nextUrl));
      return Response.redirect(new URL("/", nextUrl));
    }
    return;
  }

  if (!isLoggedIn) {
    return Response.redirect(new URL("/login", nextUrl));
  }
  
  const role = req.auth?.user?.role;
  if (nextUrl.pathname.startsWith("/admin") && role !== "admin") {
    return Response.redirect(new URL("/teacher", nextUrl));
  }
  if (nextUrl.pathname.startsWith("/teacher") && role !== "teacher") {
    return Response.redirect(new URL("/admin", nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
`,
  "src/app/layout.tsx": `import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "School Student Evaluation System",
  description: "Chaitanya Pathashala Rapti Upatyaka",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className + " bg-slate-50 text-slate-900"}>
        <SessionProvider>
          {children}
          <Toaster position="top-right" />
        </SessionProvider>
      </body>
    </html>
  );
}
`,
  "src/app/login/page.tsx": `"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Invalid credentials");
      } else {
        toast.success("Logged in successfully");
        router.push("/");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
            CP Logo
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
`,
  "src/app/page.tsx": `import { redirect } from "next/navigation";
import { auth } from "../../auth";

export default async function Home() {
  const session = await auth();
  
  if (!session) {
    redirect("/login");
  } else if (session.user.role === "admin") {
    redirect("/admin");
  } else if (session.user.role === "teacher") {
    redirect("/teacher");
  }

  return null;
}
`,
  "src/app/admin/layout.tsx": `import Link from "next/link";
import { auth, signOut } from "../../../auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-4 text-xl font-bold text-blue-600 border-b">Admin Portal</div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="block px-4 py-2 rounded text-gray-700 hover:bg-blue-50 hover:text-blue-600">Dashboard</Link>
          <Link href="/admin/teachers" className="block px-4 py-2 rounded text-gray-700 hover:bg-blue-50 hover:text-blue-600">Teachers</Link>
          <Link href="/admin/students" className="block px-4 py-2 rounded text-gray-700 hover:bg-blue-50 hover:text-blue-600">Students</Link>
        </nav>
        <div className="p-4 border-t">
          <form action={async () => { "use server"; await signOut(); }}>
            <button className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded">Logout</button>
          </form>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
}
`,
  "src/app/admin/page.tsx": `import dbConnect from "@/lib/mongoose";
import Teacher from "@/models/Teacher";
import Student from "@/models/Student";
import Class from "@/models/Class";
import Subject from "@/models/Subject";

export default async function AdminDashboard() {
  await dbConnect();
  
  const [totalTeachers, totalStudents, totalClasses, totalSubjects] = await Promise.all([
    Teacher.countDocuments(),
    Student.countDocuments(),
    Class.countDocuments(),
    Subject.countDocuments()
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="Total Teachers" value={totalTeachers} color="bg-blue-500" />
        <DashboardCard title="Total Students" value={totalStudents} color="bg-green-500" />
        <DashboardCard title="Total Classes" value={totalClasses} color="bg-purple-500" />
        <DashboardCard title="Total Subjects" value={totalSubjects} color="bg-orange-500" />
      </div>
    </div>
  );
}

function DashboardCard({ title, value, color }: { title: string, value: number, color: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 flex items-center">
      <div className={\`w-12 h-12 rounded-full \${color} flex items-center justify-center text-white font-bold text-xl mr-4\`}>
        {value}
      </div>
      <div>
        <div className="text-gray-500 text-sm">{title}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </div>
  );
}
`,
  "src/app/teacher/layout.tsx": `import Link from "next/link";
import { auth, signOut } from "../../../auth";

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md flex flex-col print:hidden">
        <div className="p-4 text-xl font-bold text-green-600 border-b">Teacher Portal</div>
        <div className="p-4 text-sm font-medium text-gray-500">Welcome, {session?.user?.name}</div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/teacher" className="block px-4 py-2 rounded text-gray-700 hover:bg-green-50 hover:text-green-600">Dashboard</Link>
          <Link href="/teacher/assessments" className="block px-4 py-2 rounded text-gray-700 hover:bg-green-50 hover:text-green-600">Assessments</Link>
        </nav>
        <div className="p-4 border-t">
          <form action={async () => { "use server"; await signOut(); }}>
            <button className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded">Logout</button>
          </form>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-8 print:p-0 print:bg-white">
        {children}
      </main>
    </div>
  );
}
`,
  "src/app/teacher/page.tsx": `import { auth } from "../../../auth";
import dbConnect from "@/lib/mongoose";
import TeacherAssignment from "@/models/TeacherAssignment";
import Assessment from "@/models/Assessment";

export default async function TeacherDashboard() {
  const session = await auth();
  await dbConnect();
  
  const assignments = await TeacherAssignment.find({ teacherId: session?.user?.id }).populate('classId subjectId');
  const totalClasses = new Set(assignments.map(a => a.classId._id.toString())).size;
  const totalSubjects = new Set(assignments.map(a => a.subjectId._id.toString())).size;
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Teacher Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="Assigned Classes" value={totalClasses} color="bg-blue-500" />
        <DashboardCard title="Assigned Subjects" value={totalSubjects} color="bg-green-500" />
      </div>
      
      <h2 className="text-xl font-bold mt-8 mb-4">My Assignments</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {assignments.map((assignment: any) => (
              <tr key={assignment._id}>
                <td className="px-6 py-4 whitespace-nowrap">{assignment.classId.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{assignment.subjectId.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DashboardCard({ title, value, color }: { title: string, value: number, color: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 flex items-center">
      <div className={\`w-12 h-12 rounded-full \${color} flex items-center justify-center text-white font-bold text-xl mr-4\`}>
        {value}
      </div>
      <div>
        <div className="text-gray-500 text-sm">{title}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </div>
  );
}
`,
  "tsconfig.json": `{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
`,
  "tailwind.config.ts": `import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        'print': { 'raw': 'print' },
      }
    },
  },
  plugins: [],
};
export default config;
`
};

for (const [filepath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
  console.log('Created', fullPath);
}
