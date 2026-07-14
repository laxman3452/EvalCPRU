"use client";
import { useState } from "react";
import PrintButton from "./PrintButton";
import AssessmentRow from "./AssessmentRow";
import Image from "next/image";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function StudentDashboardTabs({
  student,
  assignment,
  unitsData,
  id,
  isReadOnly = false
}: {
  student: any;
  assignment: any;
  unitsData: any;
  id: string;
  isReadOnly?: boolean;
}) {
  const [activeTab, setActiveTab] = useState<"sheet" | "analytics">("sheet");

  // Prepare chart data
  const chartData: any[] = [];
  unitsData.forEach((unit: any) => {
    unit.objectives.forEach((obj: any, idx: number) => {
      if (obj.assessment) {
        chartData.push({
          name: `U${unit.name.substring(0, 5)}... O${idx + 1}`,
          fullTopic: obj.topic,
          Regular: obj.assessment.regularAssessment?.score || 0,
          Reassessment: obj.assessment.reassessment?.score || 0,
        });
      }
    });
  });

  return (
    <div className="max-w-6xl mx-auto">
      {/* Tabs - Hidden during print */}
      <div className="flex gap-4 mb-6 border-b border-gray-200 print:hidden">
        <button
          onClick={() => setActiveTab("sheet")}
          className={`pb-3 px-4 font-semibold text-sm transition-colors relative ${
            activeTab === "sheet" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Evaluation Sheet
          {activeTab === "sheet" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`pb-3 px-4 font-semibold text-sm transition-colors relative ${
            activeTab === "analytics" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Progress Analytics
          {activeTab === "analytics" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>
          )}
        </button>
      </div>

      {activeTab === "sheet" && (
        <div className="bg-white p-8 lg:p-12 shadow-sm rounded-xl border border-gray-100 print:p-0 print:max-w-full print:border-none print:shadow-none">
          <style>{`
            @media print {
              @page { size: A4 landscape; margin: 10mm; }
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          `}</style>
          
          <div className="flex items-center justify-between mb-8 border-b-2 border-black pb-4">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-blue-900 print:border-black flex-shrink-0 bg-white p-1">
                <img src="/logo.png" alt="CPRU" className="object-contain w-full h-full" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-blue-900 uppercase tracking-widest print:text-xl print:text-black">
                  Chaitanya Pathashala Rapti Upatyaka
                </h1>
                <p className="text-sm lg:text-base font-semibold mt-1">Student Evaluation System</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-between items-end mb-6 font-bold text-sm lg:text-base gap-4">
            <div>
              <div>Class: {assignment.classId.name} — Section: {assignment.sectionId.name}</div>
              <div>Roll No: {student.rollNumber}</div>
            </div>
            <div>
              <div>Subject: {assignment.subjectId.name}</div>
              <div>Academic Year: {assignment.academicYear}</div>
            </div>
            <div>
              <div>Student's Name: {student.name}</div>
            </div>
          </div>
          
          {unitsData.map((unit: any) => {
            let totalScore = 0;
            let maxScore = unit.objectives.length * 4;
            
            unit.objectives.forEach((obj: any) => {
              if (obj.assessment) {
                 const bestScore = Math.max(obj.assessment.regularAssessment?.score || 0, obj.assessment.reassessment?.score || 0);
                 totalScore += bestScore;
              }
            });
            const percentage = maxScore > 0 ? ((totalScore / maxScore) * 100).toFixed(2) : 0;

            return (
              <div key={unit._id.toString()} className="mb-12">
                <div className="mb-3 font-bold text-lg flex items-center gap-2">
                  <span className="border-2 border-black px-1.5 leading-none text-xl">+</span> Unit: {unit.name}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 text-sm text-center mb-4 min-w-[800px] print:min-w-0 print:border-black">
                    <thead>
                      <tr className="bg-gray-100 print:bg-transparent">
                        <th className="border border-gray-300 print:border-black p-2 w-12 text-gray-900 font-bold" rowSpan={2}>S.N.</th>
                        <th className="border border-gray-300 print:border-black p-2 w-48 text-gray-900 font-bold" rowSpan={2}>Content Topic</th>
                        <th className="border border-gray-300 print:border-black p-2 w-48 text-gray-900 font-bold" rowSpan={2}>Learning Achievement / Outcomes</th>
                        <th className="border border-gray-300 print:border-black p-2 text-gray-900 font-bold bg-indigo-50 print:bg-transparent" colSpan={2}>Assessment after Regular Teaching</th>
                        <th className="border border-gray-300 print:border-black p-2 text-gray-900 font-bold bg-purple-50 print:bg-transparent" colSpan={2}>Assessment after Additional Assistance</th>
                        <th className="border border-gray-300 print:border-black p-2 w-32 text-gray-900 font-bold" rowSpan={2}>Remarks</th>
                        <th className="border border-gray-300 p-2 w-16 text-gray-900 font-bold print:hidden" rowSpan={2}>Action</th>
                      </tr>
                      <tr className="bg-gray-50 print:bg-transparent text-xs">
                        <th className="border border-gray-300 print:border-black p-2 text-gray-800 bg-indigo-50 print:bg-transparent">Date</th>
                        <th className="border border-gray-300 print:border-black p-2 text-gray-800 bg-indigo-50 print:bg-transparent">Score</th>
                        <th className="border border-gray-300 print:border-black p-2 text-gray-800 bg-purple-50 print:bg-transparent">Date</th>
                        <th className="border border-gray-300 print:border-black p-2 text-gray-800 bg-purple-50 print:bg-transparent">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {unit.objectives.map((obj: any, idx: number) => (
                        <AssessmentRow 
                          key={obj._id.toString()}
                          index={idx + 1}
                          objective={obj}
                          studentId={student._id.toString()}
                          teacherId={assignment.teacherId._id.toString()}
                          subjectId={assignment.subjectId._id.toString()}
                          unitId={unit._id.toString()}
                          assignmentId={id}
                          isReadOnly={isReadOnly}
                        />
                      ))}
                      {unit.objectives.length === 0 && (
                        <tr>
                          <td colSpan={9} className="p-4 text-center text-gray-500">No objectives found for this unit.</td>
                        </tr>
                      )}
                      {unit.objectives.length > 0 && (
                        <tr className="font-bold bg-gray-50 print:bg-transparent text-left text-gray-900">
                          <td className="border border-gray-300 print:border-black p-3" colSpan={3}>Subject Area Achievement</td>
                          <td className="border border-gray-300 print:border-black p-3" colSpan={6}>
                            <div className="mb-1">Total Score of Learning Achievements: <span className="text-blue-700 print:text-black">{totalScore}</span></div>
                            <div>Achievement Percentage = ({totalScore} / (4 × {unit.objectives.length})) × 100 = <span className="text-blue-700 print:text-black">{percentage}%</span></div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}

          <div className="flex justify-between mt-16 font-bold text-sm lg:text-base break-inside-avoid">
            <div className="flex gap-4">
              <div>Teacher's Signature: ______________________</div>
              <div className="hidden sm:block">Date: ______________________</div>
            </div>
            <div className="flex gap-4">
              <div>Parent's Signature: ______________________</div>
              <div className="hidden sm:block">Date: ______________________</div>
            </div>
          </div>
          
          <div className="mt-12 flex justify-end print:hidden">
            <PrintButton studentName={student.name} />
          </div>
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="flex justify-end print:hidden">
            <PrintButton studentName={`${student.name}_Analytics`} />
          </div>
          
          <div className="bg-white p-6 shadow-sm rounded-xl border border-gray-100 print:shadow-none print:border-black">
            <div className="mb-6 pb-4 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Performance Analytics</h2>
              <p className="text-gray-500">Student: {student.name} | Class: {assignment.classId.name} ({assignment.sectionId.name}) | Subject: {assignment.subjectId.name} | Academic Year: {assignment.academicYear}</p>
            </div>
            
            {chartData.length > 0 ? (
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={70} 
                      tick={{fontSize: 12, fill: '#64748b'}} 
                    />
                    <YAxis 
                      domain={[0, 4]} 
                      ticks={[0, 1, 2, 3, 4]} 
                      tick={{fontSize: 12, fill: '#64748b'}} 
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      labelFormatter={(_, payload) => payload[0]?.payload?.fullTopic || ''}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar dataKey="Regular" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={50} />
                    <Bar dataKey="Reassessment" fill="#a855f7" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-20 text-gray-400">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p>No assessment data available yet to generate analytics.</p>
              </div>
            )}
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2">
              <div className="bg-indigo-50 p-4 rounded-lg print:border print:border-black print:bg-transparent">
                <h3 className="font-bold text-indigo-900 mb-2 print:text-black">Regular Assessment Overview</h3>
                <p className="text-sm text-indigo-700 print:text-black">This chart visualizes the initial learning achievement scores across all evaluated objectives.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg print:border print:border-black print:bg-transparent">
                <h3 className="font-bold text-purple-900 mb-2 print:text-black">Additional Assistance Impact</h3>
                <p className="text-sm text-purple-700 print:text-black">Compare the reassessment scores directly alongside regular scores to track improvement.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
