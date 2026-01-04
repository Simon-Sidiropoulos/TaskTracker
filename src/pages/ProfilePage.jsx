import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Profile</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your account settings
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
            {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {user?.name || 'User'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {user?.email}
            </p>
          </div>
        </div>

        {!isEditing ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <User className="text-gray-400" size={20} />
              <div className="flex-1">
                <div className="text-sm text-gray-600 dark:text-gray-400">Name</div>
                <div className="font-medium text-gray-800 dark:text-white">
                  {user?.name || 'Not set'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <Mail className="text-gray-400" size={20} />
              <div className="flex-1">
                <div className="text-sm text-gray-600 dark:text-gray-400">Email</div>
                <div className="font-medium text-gray-800 dark:text-white">
                  {user?.email}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <Calendar className="text-gray-400" size={20} />
              <div className="flex-1">
                <div className="text-sm text-gray-600 dark:text-gray-400">Member since</div>
                <div className="font-medium text-gray-800 dark:text-white">
                  {user?.createdAt ? format(new Date(user.createdAt), 'MMMM dd, yyyy') : 'Unknown'}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="w-full mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
