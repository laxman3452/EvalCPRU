"use client";

export default function PrintButton({ studentName }: { studentName?: string }) {
  function handlePrint() {
    window.print();
  }

  function handleDownloadPDF() {
    // Set page title to student name so browser saves with a good filename
    const originalTitle = document.title;
    if (studentName) {
      document.title = `Evaluation_${studentName.replace(/\s+/g, "_")}`;
    }
    window.print();
    // Restore after a short delay
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  }

  return (
    <div className="flex gap-3 print:hidden">
      <button
        onClick={handlePrint}
        className="bg-gray-600 text-white px-5 py-2 rounded-lg shadow hover:bg-gray-700 font-medium flex items-center gap-2 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        Print
      </button>
      <button
        onClick={handleDownloadPDF}
        className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 font-medium flex items-center gap-2 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download PDF
      </button>
    </div>
  );
}
