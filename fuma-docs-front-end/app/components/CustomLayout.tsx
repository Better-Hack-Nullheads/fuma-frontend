import React from 'react';
import { Sidebar } from './Sidebar';
import type { DocItem } from '@/store/slices/docsSlice';

interface CustomLayoutProps {
  children: React.ReactNode;
  docs: DocItem[];
  currentId?: string;
  onRefresh?: () => void;
  showChangelogTab?: boolean;
}

export function CustomLayout({ 
  children, 
  docs, 
  currentId, 
  onRefresh, 
  showChangelogTab = true 
}: CustomLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href="/docs" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Documentation
              </a>
            </div>
            <div className="flex items-center space-x-4">
              {/* Theme toggle or other nav items can go here */}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex">
        <Sidebar 
          docs={docs} 
          currentId={currentId} 
          onRefresh={onRefresh} 
          showChangelogTab={showChangelogTab} 
        />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
