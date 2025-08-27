import React, { useState } from 'react';
import { Plus, Users, DollarSign, Edit, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import GroupCard from './GroupCard';
import CreateGroupModal from './CreateGroupModal';
import EditGroupModal from './EditGroupModal';

interface DashboardProps {
  onSelectGroup: (groupId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectGroup }) => {
  const { groups, getGroupTotal, getGroupMembers, deleteGroup } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const totalSavings = groups.reduce((total, group) => total + getGroupTotal(group.id), 0);

  const handleDeleteGroup = (groupId: string) => {
    deleteGroup(groupId);
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="backdrop-blur-sm bg-gradient-to-r from-mint-100/60 to-mint-200/40 rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-mint-700 text-sm font-medium">Total Groups</p>
              <p className="text-2xl font-bold text-gray-800">{groups.length}</p>
            </div>
            <div className="bg-mint-200/50 p-3 rounded-xl">
              <Users className="w-6 h-6 text-mint-600" />
            </div>
          </div>
        </div>

        <div className="backdrop-blur-sm bg-gradient-to-r from-blue-100/60 to-blue-200/40 rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-700 text-sm font-medium">Total Savings</p>
              <p className="text-2xl font-bold text-gray-800">{totalSavings.toFixed(2)}</p>
            </div>
            <div className="bg-blue-200/50 p-3 rounded-xl">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="backdrop-blur-sm bg-gradient-to-r from-purple-100/60 to-purple-200/40 rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-700 text-sm font-medium">Active Members</p>
              <p className="text-2xl font-bold text-gray-800">
                {groups.reduce((total, group) => total + getGroupMembers(group.id).length, 0)}
              </p>
            </div>
            <div className="bg-purple-200/50 p-3 rounded-xl">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Groups Section */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Your Groups</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-mint-500 to-mint-600 hover:from-mint-600 hover:to-mint-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-4 h-4" />
          <span>Create Group</span>
        </button>
      </div>

      {groups.length === 0 ? (
        <div className="text-center py-16">
          <div className="backdrop-blur-sm bg-white/40 rounded-2xl p-8 border border-white/20 shadow-lg inline-block">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Groups Yet</h3>
            <p className="text-gray-600 mb-6">Create your first savings group to get started!</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-mint-500 to-mint-600 hover:from-mint-600 hover:to-mint-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Create Your First Group
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map(group => (
            <GroupCard
              key={group.id}
              group={group}
              onSelect={onSelectGroup}
              onEdit={setEditingGroup}
              onDelete={setDeleteConfirm}
            />
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateGroupModal onClose={() => setShowCreateModal(false)} />
      )}

      {editingGroup && (
        <EditGroupModal
          group={editingGroup}
          onClose={() => setEditingGroup(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full border border-white/20 shadow-xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Delete Group</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this group? This will permanently remove the group, all its members, and all transactions. This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteGroup(deleteConfirm)}
                className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
              >
                Delete Group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;