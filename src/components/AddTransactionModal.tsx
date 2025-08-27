import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AddTransactionModalProps {
  groupId?: string;
  onClose: () => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ groupId, onClose }) => {
  const { addTransaction, groups, getGroupMembers } = useApp();
  const [formData, setFormData] = useState({
    groupId: groupId || '',
    memberId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  const availableMembers = formData.groupId ? getGroupMembers(formData.groupId) : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.groupId && formData.memberId && formData.amount) {
      addTransaction({
        groupId: formData.groupId,
        memberId: formData.memberId,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date),
        description: formData.description,
      });
      onClose();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full border border-white/20 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add Transaction</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!groupId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Group *
              </label>
              <select
                name="groupId"
                value={formData.groupId}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-mint-500 focus:border-transparent transition-all"
                required
              >
                <option value="">Choose a group</option>
                {groups.map(group => (
                  <option key={group.id} value={group.id}>
                    {group.icon} {group.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Member *
            </label>
            <select
              name="memberId"
              value={formData.memberId}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-mint-500 focus:border-transparent transition-all"
              required
              disabled={!formData.groupId}
            >
              <option value="">Choose a member</option>
              {availableMembers.map(member => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount *
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-mint-500 focus:border-transparent transition-all"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-mint-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-mint-500 focus:border-transparent transition-all resize-none"
              placeholder="Optional transaction description"
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-mint-500 to-mint-600 hover:from-mint-600 hover:to-mint-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
            >
              Add Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;