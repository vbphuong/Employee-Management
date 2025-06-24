import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

interface UserRole {
  username: string;
  role: string;
}

const RoleManagement: React.FC = () => {
  const [users, setUsers] = useState<UserRole[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const storedRole = localStorage.getItem('role');
      if (storedRole) {
        setRole(storedRole);
      }
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login.');
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/auth/users', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Unauthorized: Please login again.');
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          router.push('/login');
        } else {
          throw new Error('Failed to fetch users');
        }
      }
      const userList = await response.json();
      const userRoles = await Promise.all(
        userList.map(async (user: any) => {
          const roleRes = await fetch(`http://localhost:8080/api/employees/roles/${user.username}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!roleRes.ok) throw new Error('Failed to fetch role');
          const roles = await roleRes.json();
          return { username: user.username, role: roles.length > 0 ? roles[0].role : 'USER' };
        })
      );
      setUsers(userRoles);
    } catch (error) {
      toast.error('Failed to fetch users.');
    }
  };

  const updateRole = async (username: string, newRole: string) => {
    const token = localStorage.getItem('token');
    if (role !== 'ADMIN') {
      toast.error('Only ADMIN can update roles.');
      return;
    }
    try {
      const response = await fetch(`http://localhost:8080/api/employees/roles/${username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (response.ok) {
        setUsers(users.map(user => user.username === username ? { ...user, role: newRole } : user));
        toast.success(`Role updated to ${newRole} for ${username}`);
      } else {
        throw new Error('Failed to update role');
      }
    } catch (error) {
      toast.error('Failed to update role.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9fbfc] p-6">
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl font-semibold mb-6 text-black text-center">Role Management</h1>
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <ul className="space-y-4">
            {users.map((user) => (
              <li key={user.username} className="flex justify-between items-center p-4 bg-gray-100 rounded-lg">
                <span className="text-sm text-gray-700">{user.username} - Current Role: {user.role}</span>
                {role === 'ADMIN' && user.role !== 'ADMIN' ? (
                  <select
                    value={user.role}
                    onChange={(e) => updateRole(user.username, e.target.value)}
                    className="p-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black text-sm"
                  >
                    <option value="USER">USER</option>
                    <option value="MANAGER">MANAGER</option>
                  </select>
                ) : (
                  <span className="text-sm text-gray-700">
                    {user.role === 'ADMIN' ? 'Admin (Cannot Change)' : 'Read Only'}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RoleManagement;