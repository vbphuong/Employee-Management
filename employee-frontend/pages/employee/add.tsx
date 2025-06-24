import React, { useEffect } from 'react';
import EmployeeForm from '../../components/EmployeeForm';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const AddEmployee: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token) {
      toast.error('Please login.');
      router.push('/login');
      return;
    }
    if (role !== 'MANAGER' && role !== 'ADMIN') {
      toast.error('You do not have permission to add employees.');
      router.push('/');
      return;
    }
  }, [router]);

  const handleSave = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9fbfc] p-6">
      <EmployeeForm onSave={handleSave} />
    </div>
  );
};

export default AddEmployee;