import React from 'react';

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

interface EmployeeListProps {
  employees: Employee[];
  onDelete?: (id: number) => void;
  onEdit?: (id: number) => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({ employees, onDelete, onEdit }) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-black text-center">Employee List</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 text-sm font-medium text-gray-700">First Name</th>
                <th className="p-3 text-sm font-medium text-gray-700">Last Name</th>
                <th className="p-3 text-sm font-medium text-gray-700">Email</th>
                <th className="p-3 text-sm font-medium text-gray-700">Created By</th>
                {onEdit || onDelete ? (
                  <th className="p-3 text-sm font-medium text-gray-700">Actions</th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="p-3 text-sm text-gray-700">{employee.firstName}</td>
                  <td className="p-3 text-sm text-gray-700">{employee.lastName}</td>
                  <td className="p-3 text-sm text-gray-700">{employee.email}</td>
                  <td className="p-3 text-sm text-gray-700">{employee.username}</td>
                  {onEdit || onDelete ? (
                    <td className="p-3 text-sm space-x-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(employee.id)}
                          className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition duration-200"
                        >
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(employee.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition duration-200"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;