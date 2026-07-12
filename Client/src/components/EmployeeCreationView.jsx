import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService.js';
import { assetService } from '../services/assetService.js';
import { UserPlus, Sparkles, Loader2, Copy, Check, CheckCircle2 } from 'lucide-react';

export default function EmployeeCreationView() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [designation, setDesignation] = useState('');
  const [roleName, setRoleName] = useState('Employee');

  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Credentials modal state
  const [provisionedCredentials, setProvisionedCredentials] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const list = await assetService.getDepartments();
        setDepartments(list);
        if (list.length > 0) {
          setDepartmentId(list[0].id);
        }
      } catch (err) {
        console.error('Error fetching departments list:', err);
      }
    };
    fetchDepartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!firstName || !lastName || !email || !departmentId || !designation || !roleName) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.createEmployee({
        firstName,
        lastName,
        email,
        phone: phone || null,
        departmentId,
        designation,
        roleName
      });
      setIsLoading(false);
      
      setProvisionedCredentials({
        firstName,
        lastName,
        email: res.email,
        tempPassword: res.tempPassword,
        employeeNumber: res.employeeNumber,
        roleName: res.roleName,
        departmentName: res.departmentName,
        passwordResetRequired: res.passwordResetRequired
      });

      // Clear fields
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setDesignation('');
      setRoleName('Employee');
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Failed to create employee profile.');
    }
  };

  const handleCopyCredentials = () => {
    if (!provisionedCredentials) return;
    const text = `AssetFlow Employee Account Provisioned
--------------------------------------
Employee ID: ${provisionedCredentials.employeeNumber}
Name: ${provisionedCredentials.firstName} ${provisionedCredentials.lastName}
Email: ${provisionedCredentials.email}
Role: ${provisionedCredentials.roleName}
Department: ${provisionedCredentials.departmentName}
Temporary Password: ${provisionedCredentials.tempPassword}
First Login Required: Yes
Password Expiry: 24 Hours
Welcome Notification: Sent
--------------------------------------`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-[#fcf8fa]">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-sans text-[#0F172A] leading-tight flex items-center gap-2">
          <UserPlus className="text-[#06b6d4]" size={24} />
          <span>Provision Employee Account</span>
        </h1>
        <p className="text-sm text-[#45464d] mt-1 font-sans">
          Register new personnel and automatically create their system credentials with forced password resets.
        </p>
      </div>

      <div className="max-w-2xl bg-white border border-[#e5e4e7] p-8 rounded-lg shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded text-xs font-sans leading-relaxed">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase mb-1.5">
                First Name *
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Jane"
                disabled={isLoading}
                required
                className="w-full h-10 px-3 rounded border border-[#e5e4e7] bg-white text-sm font-sans focus:outline-none focus:border-[#0F172A] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase mb-1.5">
                Last Name *
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                disabled={isLoading}
                required
                className="w-full h-10 px-3 rounded border border-[#e5e4e7] bg-white text-sm font-sans focus:outline-none focus:border-[#0F172A] transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase mb-1.5">
                Corporate Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane.doe@company.com"
                disabled={isLoading}
                required
                className="w-full h-10 px-3 rounded border border-[#e5e4e7] bg-white text-sm font-sans focus:outline-none focus:border-[#0F172A] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase mb-1.5">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 019-2834"
                disabled={isLoading}
                className="w-full h-10 px-3 rounded border border-[#e5e4e7] bg-white text-sm font-sans focus:outline-none focus:border-[#0F172A] transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase mb-1.5">
                Corporate Department *
              </label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                disabled={isLoading}
                className="w-full h-10 px-2 rounded border border-[#e5e4e7] bg-white text-sm font-sans focus:outline-none focus:border-[#0F172A] transition-colors cursor-pointer"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase mb-1.5">
                Job Designation *
              </label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="Principal QA Analyst"
                disabled={isLoading}
                required
                className="w-full h-10 px-3 rounded border border-[#e5e4e7] bg-white text-sm font-sans focus:outline-none focus:border-[#0F172A] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold font-mono tracking-wider text-[#76777d] uppercase mb-1.5">
                System Role assignment *
              </label>
              <select
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                disabled={isLoading}
                className="w-full h-10 px-2 rounded border border-[#e5e4e7] bg-white text-sm font-sans focus:outline-none focus:border-[#0F172A] transition-colors cursor-pointer font-sans"
              >
                <option value="Employee">Employee</option>
                <option value="Department Head">Department Head</option>
                <option value="Asset Manager">Asset Manager</option>
                <option value="Resource Manager">Resource Manager</option>
                <option value="Technician">Maintenance Technician</option>
                <option value="Auditor">Auditor</option>
                <option value="Admin">Administrator</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 bg-[#0F172A] hover:bg-slate-800 text-white font-sans font-semibold rounded text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-700"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Provisioning Account & Profiles...</span>
              </>
            ) : (
              <span>Create Account Profile</span>
            )}
          </button>
        </form>
      </div>

      {/* Success modal for temporary credentials */}
      {provisionedCredentials && (
        <div className="fixed inset-0 bg-[#0F172A]/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e5e4e7] p-8 rounded-lg max-w-md w-full shadow-lg relative animate-in fade-in zoom-in duration-200">
            <div className="text-center mb-6">
              <CheckCircle2 size={44} className="text-emerald-500 mx-auto mb-2" />
              <h3 className="text-lg font-bold font-sans text-[#0F172A]">Employee Created Successfully</h3>
              <p className="text-xs text-[#76777d] mt-1 font-sans">
                Save the following credentials. Copy and share them securely with the employee.
              </p>
            </div>

            <div className="bg-gray-50 border border-dashed border-gray-300 p-4 rounded mb-6 font-mono text-xs text-[#0F172A] space-y-2">
              <div>
                <span className="font-bold">Employee ID:</span> {provisionedCredentials.employeeNumber}
              </div>
              <div>
                <span className="font-bold">Name:</span> {provisionedCredentials.firstName} {provisionedCredentials.lastName}
              </div>
              <div>
                <span className="font-bold">Corporate Email:</span> {provisionedCredentials.email}
              </div>
              <div>
                <span className="font-bold">Assigned Role:</span> {provisionedCredentials.roleName}
              </div>
              <div>
                <span className="font-bold">Department:</span> {provisionedCredentials.departmentName}
              </div>
              <div>
                <span className="font-bold text-amber-600">Temporary Password:</span> {provisionedCredentials.tempPassword}
              </div>
              <div>
                <span className="font-bold text-emerald-600">First Login Required:</span> Yes
              </div>
              <div>
                <span className="font-bold text-rose-600">Password Expiration:</span> 24 Hours
              </div>
              <div>
                <span className="font-bold text-cyan-600">Welcome Notification:</span> Sent
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCopyCredentials}
                className="flex-1 h-10 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-sans font-semibold rounded flex items-center justify-center gap-2 border border-gray-300 transition-colors cursor-pointer"
              >
                {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                <span>{copied ? 'Copied Details' : 'Copy Credentials'}</span>
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="h-10 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-sans font-semibold border border-gray-300 rounded cursor-pointer"
                title="Print Credentials"
              >
                Print
              </button>
              <button
                onClick={() => setProvisionedCredentials(null)}
                className="flex-1 h-10 bg-[#0F172A] hover:bg-slate-800 text-white text-sm font-sans font-semibold rounded transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
