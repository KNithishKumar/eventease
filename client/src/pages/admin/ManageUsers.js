import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiUsers, FiSearch, FiTrash2, FiToggleLeft, FiToggleRight } from 'react-icons/fi';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  const fetchUsers = async () => {
    try {
      const data = await adminService.getAllUsers({ search, role: roleFilter });
      setUsers(data);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter]);

  const handleToggleStatus = async (user) => {
    if (user.role === 'admin') {
      toast.error('Admin accounts cannot be deactivated.');
      return;
    }
    try {
      const res = await adminService.toggleUserStatus(user._id);
      toast.success(res.message);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (user) => {
    if (user.role === 'admin') {
      toast.error('Admin accounts cannot be deleted.');
      return;
    }
    if (!window.confirm(`Delete user "${user.name}"?`)) return;
    try {
      await adminService.deleteUser(user._id);
      toast.success('User account deleted');
      fetchUsers();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Manage Platform Users</h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Activate, deactivate, or review student and organizer accounts.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -tranneutral-y-1/2 text-neutral-400" size={16} />
          <input
            type="text"
            placeholder="Search by name, email, department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-md text-xs text-neutral-900 dark:text-white"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-md text-xs text-neutral-900 dark:text-white self-end sm:self-auto"
        >
          <option value="All">Role: All</option>
          <option value="student">Students Only</option>
          <option value="organizer">Organizers Only</option>
          <option value="admin">Admins Only</option>
        </select>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-600 dark:text-neutral-300">
            <thead className="bg-neutral-50 dark:bg-neutral-800/60 font-bold uppercase tracking-wider text-neutral-400">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-4 py-4">Email</th>
                <th className="px-4 py-4">Role</th>
                <th className="px-4 py-4">Department & Year</th>
                <th className="px-4 py-4">Account Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {users.map((u) => (
                <tr key={u._id}>
                  <td className="px-6 py-4 font-bold text-neutral-900 dark:text-white">{u.name}</td>
                  <td className="px-4 py-4">{u.email}</td>
                  <td className="px-4 py-4 uppercase font-bold text-[10px]">
                    <Badge variant={u.role === 'admin' ? 'danger' : u.role === 'organizer' ? 'purple' : 'info'}>
                      {u.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    {u.department} ({u.year})
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant={u.isActive ? 'success' : 'danger'}>
                      {u.isActive ? 'Active' : 'Deactivated'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {u.role !== 'admin' && (
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleToggleStatus(u)}
                          title={u.isActive ? 'Deactivate Account' : 'Activate Account'}
                          className="p-1.5 text-neutral-500 hover:text-amber-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
                        >
                          {u.isActive ? <FiToggleRight size={20} className="text-emerald-500" /> : <FiToggleLeft size={20} className="text-neutral-400" />}
                        </button>
                        <button
                          onClick={() => handleDelete(u)}
                          title="Delete User"
                          className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
