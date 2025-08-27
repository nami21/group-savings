import React, { useState } from 'react';
import { ArrowLeft, Plus, Users, DollarSign, Trash2, Edit, UserPlus, ChevronDown, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import AddMemberModal from './AddMemberModal';
import AddTransactionModal from './AddTransactionModal';
import EditMemberModal from './EditMemberModal';
import { Member, Transaction } from '../types';

interface GroupDetailsProps {
  groupId: string;
  onBack: () => void;
  onSelectMember: (memberId: string) => void;
}

const GroupDetails: React.FC<GroupDetailsProps> = ({ groupId, onBack, onSelectMember }) => {
  const { 
    groups, 
    getGroupTotal, 
    getGroupMembers, 
    getGroupTransactions,
    getMemberTotal,
    deleteMember,
    members,
    transactions,
    deleteTransaction
  } = useApp();

  const [showAddMember, setShowAddMember] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [membersExpanded, setMembersExpanded] = useState(false);
  const [deleteTransactionConfirm, setDeleteTransactionConfirm] = useState<string | null>(null);

  const group = groups.find(g => g.id === groupId);
  const groupMembers = getGroupMembers(groupId);
  const groupTransactions = getGroupTransactions(groupId);
  const groupTotal = getGroupTotal(groupId);

  if (!group) return null;

  const handleDeleteMember = (memberId: string) => {
    deleteMember(memberId);
    setShowDeleteConfirm(null);
  };

  const handleDeleteTransaction = (transactionId: string) => {
    deleteTransaction(transactionId);
    setDeleteTransactionConfirm(null);
  };

  const getTransactionDetails = (transaction: Transaction) => {
    const member = members.find(m => m.id === transaction.memberId);
    return {
      ...transaction,
      memberName: member?.name || 'Unknown Member'
    };
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/60 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center space-x-4">
            <div className="text-4xl">{group.icon}</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{group.title}</h1>
              {group.description && (
                <p className="text-gray-600 mt-1">{group.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="backdrop-blur-sm bg-gradient-to-r from-mint-100/60 to-mint-200/40 rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-mint-700 text-sm font-medium">Total Savings</p>
              <p className="text-3xl font-bold text-gray-800">{groupTotal.toFixed(2)}</p>
            </div>
            <div className="bg-mint-200/50 p-3 rounded-xl">
              <DollarSign className="w-8 h-8 text-mint-600" />
            </div>
          </div>
        </div>

        <div className="backdrop-blur-sm bg-gradient-to-r from-purple-100/60 to-purple-200/40 rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-700 text-sm font-medium">Members</p>
              <p className="text-3xl font-bold text-gray-800">{groupMembers.length}</p>
            </div>
            <div className="bg-purple-200/50 p-3 rounded-xl">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Members Section */}
      <div className="backdrop-blur-sm bg-white/60 rounded-2xl p-8 border border-white/20 shadow-lg">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setMembersExpanded(!membersExpanded)}
            className="flex items-center space-x-2 text-2xl font-bold text-gray-800 hover:text-purple-600 transition-colors"
          >
            {membersExpanded ? (
              <ChevronDown className="w-6 h-6" />
            ) : (
              <ChevronRight className="w-6 h-6" />
            )}
            <span>Members ({groupMembers.length})</span>
          </button>
          {membersExpanded && (
            <button
              onClick={() => setShowAddMember(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Member</span>
            </button>
          )}
        </div>

        {membersExpanded && (
          <div className="mt-6">
            {groupMembers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No members yet. Add your first member!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupMembers.map(member => (
                  <div
                    key={member.id}
                    className="bg-white/80 hover:bg-white/90 rounded-xl p-4 border border-white/30 transition-all cursor-pointer group"
                    onClick={() => onSelectMember(member.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
                          {member.name}
                        </h3>
                        <p className="text-sm text-gray-600">{member.email}</p>
                        <p className="text-sm text-gray-600">{member.phoneNumber}</p>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingMember(member);
                          }}
                          className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4 text-gray-500" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteConfirm(member.id);
                          }}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total Contributed</p>
                      <p className="text-lg font-bold text-gray-800">
                        {getMemberTotal(member.id).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Transactions Section */}
      <div className="backdrop-blur-sm bg-white/60 rounded-2xl p-8 border border-white/20 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Recent Transactions</h2>
          <button
            onClick={() => setShowAddTransaction(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-mint-500 to-mint-600 hover:from-mint-600 hover:to-mint-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        </div>

        {groupTransactions.length === 0 ? (
          <div className="text-center py-8">
            <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No transactions yet. Add your first transaction!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-200">
                  <th className="py-3 px-4 font-semibold text-gray-700">Member</th>
                  <th className="py-3 px-4 font-semibold text-gray-700">Amount</th>
                  <th className="py-3 px-4 font-semibold text-gray-700">Date</th>
                  <th className="py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {groupTransactions
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 10)
                  .map(transaction => {
                    const details = getTransactionDetails(transaction);
                    return (
                      <tr key={transaction.id} className="hover:bg-white/50 transition-colors">
                        <td className="py-3 px-4">
                          <button
                            onClick={() => onSelectMember(transaction.memberId)}
                            className="text-purple-600 hover:text-purple-700 font-medium"
                          >
                            {details.memberName}
                          </button>
                        </td>
                        <td className="py-3 px-4 font-semibold text-mint-600">
                          +{transaction.amount.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => setDeleteTransactionConfirm(transaction.id)}
                            className="p-1 hover:bg-red-100 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddMember && (
        <AddMemberModal
          groupId={groupId}
          onClose={() => setShowAddMember(false)}
        />
      )}

      {showAddTransaction && (
        <AddTransactionModal
          groupId={groupId}
          onClose={() => setShowAddTransaction(false)}
        />
      )}

      {editingMember && (
        <EditMemberModal
          member={editingMember}
          onClose={() => setEditingMember(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full border border-white/20 shadow-xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Delete Member</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this member? This will also remove all their transactions from the group.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteMember(showDeleteConfirm)}
                className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Transaction Confirmation Modal */}
      {deleteTransactionConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full border border-white/20 shadow-xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Delete Transaction</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this transaction? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setDeleteTransactionConfirm(null)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteTransaction(deleteTransactionConfirm)}
                className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDetails;