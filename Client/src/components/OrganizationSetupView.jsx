import React, { useState } from 'react';
import {
  Building2,
  Tags,
  Users
} from 'lucide-react';

export default function OrganizationSetupView() {
  const [activeSection, setActiveSection] = useState('departments');

  const sections = [
    {
      id: 'departments',
      label: 'Departments',
      icon: Building2
    },
    {
      id: 'categories',
      label: 'Asset Categories',
      icon: Tags
    },
    {
      id: 'employees',
      label: 'Employee Directory',
      icon: Users
    }
  ];

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold font-sans text-[#0F172A] leading-tight">
          Organization Setup
        </h1>

        <p className="text-sm text-[#45464d] mt-1 font-sans">
          Manage departments, asset categories, employees, and administrative roles.
        </p>
      </div>

      {/* Internal Navigation Tabs */}
      <div className="bg-white border border-[#e5e4e7] rounded-lg">
        <div className="flex items-center border-b border-[#e5e4e7] px-4">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;

            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`relative flex items-center gap-2 px-4 py-3 text-xs font-bold font-mono tracking-wider uppercase transition-colors cursor-pointer ${
                  isActive
                    ? 'text-[#0F172A]'
                    : 'text-[#76777d] hover:text-[#45464d]'
                }`}
              >
                <Icon
                  size={15}
                  strokeWidth={1.5}
                  className={isActive ? 'text-[#06b6d4]' : ''}
                />

                {section.label}

                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#06b6d4]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Temporary Tab Content */}
        <div className="p-6">
          {activeSection === 'departments' && (
            <div className="border border-dashed border-[#e5e4e7] rounded-lg p-10 text-center">
              <Building2
                size={32}
                strokeWidth={1.5}
                className="mx-auto text-[#06b6d4] mb-3"
              />

              <h2 className="text-sm font-bold text-[#0F172A]">
                Department Management
              </h2>

              <p className="text-xs text-[#76777d] mt-1">
                Department records will appear here.
              </p>
            </div>
          )}

          {activeSection === 'categories' && (
            <div className="border border-dashed border-[#e5e4e7] rounded-lg p-10 text-center">
              <Tags
                size={32}
                strokeWidth={1.5}
                className="mx-auto text-[#06b6d4] mb-3"
              />

              <h2 className="text-sm font-bold text-[#0F172A]">
                Asset Category Management
              </h2>

              <p className="text-xs text-[#76777d] mt-1">
                Asset category records will appear here.
              </p>
            </div>
          )}

          {activeSection === 'employees' && (
            <div className="border border-dashed border-[#e5e4e7] rounded-lg p-10 text-center">
              <Users
                size={32}
                strokeWidth={1.5}
                className="mx-auto text-[#06b6d4] mb-3"
              />

              <h2 className="text-sm font-bold text-[#0F172A]">
                Employee Directory
              </h2>

              <p className="text-xs text-[#76777d] mt-1">
                Employee and role management will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}