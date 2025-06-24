import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import EmployeeList from '../components/EmployeeList';
import Link from 'next/link';
import { toast } from 'react-toastify';

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

const Home: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const storedRole = localStorage.getItem('role');
      if (storedRole) {
        setRole(storedRole);
      }
      fetchEmployees();
    } else {
      toast.error('No token found. Please login.');
      router.push('/login');
    }
  }, [router]);

  const fetchEmployees = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('No token found. Please login.');
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/employees', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 401) {
          toast.error('Unauthorized: Please login again.');
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          router.push('/login');
        } else {
          throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
        }
      }

      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Failed to fetch employees. Check backend or network.');
    }
  };

  const handleDelete = async (id: number) => {
    if (role !== 'ADMIN') {
      toast.error('Only ADMIN can delete employees.');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:8080/api/employees/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete: ${response.status}, ${errorText}`);
      }

      setEmployees(employees.filter((employee) => employee.id !== id));
      toast.success('Employee deleted successfully!');
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error('Failed to delete employee. Check permissions or network.');
    }
  };

  const handleEdit = (id: number) => {
    if (role === 'MANAGER' || role === 'ADMIN') {
      router.push(`/employee/edit?id=${id}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9fbfc] p-6">
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl font-semibold text-black mb-6 text-center">Employee Management</h1>
        <div className="flex justify-center mb-6 space-x-4">
          {(role === 'MANAGER' || role === 'ADMIN') && (
            <Link href="/employee/add" className="text-blue-500 hover:underline text-sm font-medium">
              Add Employee
            </Link>
          )}
          <Link href="/role-management" className="text-blue-500 hover:underline text-sm font-medium">
            Role Management
          </Link>
          <button
            onClick={handleLogout}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 text-sm font-medium"
          >
            Logout
          </button>
        </div>
        <EmployeeList 
          employees={employees} 
          onDelete={role === 'ADMIN' ? handleDelete : undefined} 
          onEdit={(role === 'MANAGER' || role === 'ADMIN') ? handleEdit : undefined} 
        />
      </div>
    </div>
  );
};

export default Home;