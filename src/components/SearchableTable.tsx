"use client";
import { useState } from "react";

export default function SearchableTable({
  items,
  columns,
  renderRow,
  renderCard,
  emptyMessage = "No records found.",
  placeholder = "Search...",
}: {
  items: any[];
  columns: string[];
  renderRow: (item: any) => React.ReactNode;
  renderCard?: (item: any) => React.ReactNode;
  emptyMessage?: string;
  placeholder?: string;
}) {
  const [query, setQuery] = useState("");

  const filtered = items.filter((item) =>
    Object.values(item).some((val) =>
      String(val ?? "").toLowerCase().includes(query.toLowerCase())
    )
  );

  return (
    <div>
      {/* Search input */}
      <div className="mb-4 relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full md:w-96 pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl shadow-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {query && (
          <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            ✕
          </button>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th key={col} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filtered.map((item) => renderRow(item))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {query ? `No results for "${query}"` : emptyMessage}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-3">
        {filtered.map((item) =>
          renderCard ? renderCard(item) : (
            <div key={item._id} className="bg-white rounded-xl shadow p-4 space-y-1">
              {Object.entries(item)
                .filter(([k]) => k !== "_id")
                .map(([k, v]) => (
                  <div key={k} className="flex gap-2 text-sm">
                    <span className="font-semibold text-gray-500 capitalize min-w-[80px]">{k}:</span>
                    <span className="text-gray-900">{String(v)}</span>
                  </div>
                ))}
            </div>
          )
        )}
        {filtered.length === 0 && (
          <div className="bg-white rounded-xl shadow p-8 text-center text-gray-400">
            {query ? `No results for "${query}"` : emptyMessage}
          </div>
        )}
      </div>

      {query && (
        <p className="mt-3 text-xs text-gray-500">
          Showing <strong>{filtered.length}</strong> of <strong>{items.length}</strong> records
        </p>
      )}
    </div>
  );
}
