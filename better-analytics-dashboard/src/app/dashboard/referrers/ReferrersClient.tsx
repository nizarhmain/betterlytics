'use client';

import { useState } from "react";
import SummaryCard from "@/components/SummaryCard";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

enum ReferrerTab {
  All = 'all',
  Search = 'search',
  Social = 'social',
  Direct = 'direct',
  Email = 'email'
}

export default function ReferrersClient() {
  const [activeTab, setActiveTab] = useState<ReferrerTab>(ReferrerTab.All);

  return (
    <div className="p-6 space-y-6">
      <div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Referrers</h1>
          <p className="text-sm text-gray-500">Analytics and insights for your website</p>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <SummaryCard
            title="Total Referrers"
            value="-"
            changeText=""
          />
          <SummaryCard
            title="Referral Traffic"
            value="-"
            changeText=""
          />
          <SummaryCard
            title="Avg. Bounce Rate"
            value="-"
            changeText=""
          />
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="font-medium mb-2">Referrer Distribution</div>
              Chart placeholder
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="font-medium mb-2">Referral Traffic Trends</div>
              Chart placeholder
          </div>
        </div>
        
        {/* Table with Tabs */}
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="border-b mb-4">
            <div className="flex space-x-4">
              {[
                { id: ReferrerTab.All, label: 'All' },
                { id: ReferrerTab.Search, label: 'Search' },
                { id: ReferrerTab.Social, label: 'Social' },
                { id: ReferrerTab.Direct, label: 'Direct' },
                { id: ReferrerTab.Email, label: 'Email' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`px-3 py-2 text-sm font-medium border-b-2 ${
                    activeTab === tab.id 
                      ? 'border-gray-800 text-gray-800' 
                      : 'border-transparent hover:border-gray-300 text-gray-600'
                  }`}
                  onClick={() => setActiveTab(tab.id as ReferrerTab)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source</TableHead>
                  <TableHead>Visits</TableHead>
                  <TableHead>Bounce Rate</TableHead>
                  <TableHead>Avg. Visit Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-gray-500">
                    No {activeTab !== ReferrerTab.All ? activeTab : ''} data to display
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
} 