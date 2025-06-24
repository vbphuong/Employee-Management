import React, { useState, useEffect } from 'react';
import EmployeeForm from '../../components/EmployeeForm';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

const EditEmployee: React.FC = () => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token) {
      toast.error('Please login.');
      router.push('/login');
      return;
    }
    if (role !== 'MANAGER' && role !== 'ADMIN') {
      toast.error('You do not have permission to edit employees.');
      router.push('/');
      return;
    }

    if (!id) return;

    fetch(`http://localhost:8080/api/employees/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => setEmployee(data))
      .catch((error) => {
        toast.error('Failed to fetch employee.');
        router.push('/');
      });
  }, [id, router]);

  const handleSave = (updatedEmployee: { id?: number; firstName: string; lastName: string; email: string }) => {
    setEmployee({ ...employee, ...updatedEmployee } as Employee);
    router.push('/');
  };

  if (!employee) return <div className="w-full max-w-md mx-auto bg-gray-50 p-6 rounded-lg shadow-sm text-center text-gray-700">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9fbfc] p-6">
      <EmployeeForm onSave={handleSave} initialData={employee} />
    </div>
  );
};

export default EditEmployee;