import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

interface Employee {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  username?: string;
}

interface EmployeeFormProps {
  onSave: (employee: Employee) => void;
  initialData?: Employee;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ onSave, initialData }) => {
  const [firstName, setFirstName] = useState(initialData?.firstName || '');
  const [lastName, setLastName] = useState(initialData?.lastName || '');
  const [email, setEmail] = useState(initialData?.email || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const role = localStorage.getItem('role');
    if (!['MANAGER', 'ADMIN'].includes(role || '')) {
      toast.error('Access denied: Only MANAGER or ADMIN can add/edit employees.');
      return;
    }

    const employee = { id: initialData?.id, firstName, lastName, email };
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('No token found. Please login.');
      return;
    }

    try {
      const response = await fetch(
        initialData?.id
          ? `http://localhost:8080/api/employees/${initialData.id}`
          : 'http://localhost:8080/api/employees',
        {
          method: initialData?.id ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(employee),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 403) {
          toast.error('Access denied: Only MANAGER or ADMIN can add/edit employees.');
        } else if (response.status === 401) {
          toast.error('Unauthorized: Please login again.');
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          window.location.href = '/login';
        }
        throw new Error(`Failed to save employee: Status ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      toast.success(initialData?.id ? 'Employee updated!' : 'Employee added!');
      onSave(data);
    } catch (error) {
      console.error('Error saving employee:', error);
      toast.error(`Failed to save employee: `);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-black text-center">
          {initialData?.id ? 'Edit Employee' : 'Add Employee'}
        </h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            placeholder="First Name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            placeholder="Last Name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            placeholder="Email"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          {initialData?.id ? 'Update' : 'Add'}
        </button>
      </form>
    </div>
  );
};

export default EmployeeForm;