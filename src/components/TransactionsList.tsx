import React, { useState } from 'react';
import { Plus, Filter, Trash2, Search, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';
import AddTransactionModal from './AddTransactionModal';

const TransactionsList: React.FC = () => {
  const { transactions, groups, members, deleteTransaction } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterGroup, setFilterGroup] = useState('');
  const [filterMember, setFilterMember] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Reset member filter when group filter changes
  const handleGroupFilterChange = (groupId: string) => {
    setFilterGroup(groupId);
    setFilterMember(''); // Reset member filter when group changes
  };

  // Get available members based on group filter
  const getAvailableMembers = () => {
    if (!filterGroup) {
      // All Groups: show unique members across all groups (deduplicated by ID)
      const uniqueMembers = members.reduce((acc, member) => {
        if (!acc.find(m => m.id === member.id)) {
          acc.push(member);
        }
        return acc;
      }, [] as typeof members);
      return uniqueMembers.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Specific Group: show only members in that group
      return members
        .filter(member => member.groupId === filterGroup)
        .sort((a, b) => a.name.localeCompare(b.name));
    }
  };

  const availableMembers = getAvailableMembers();

  const getTransactionDetails = (transaction: any) => {
    const group = groups.find(g => g.id === transaction.groupId);
    const member = members.find(m => m.id === transaction.memberId);
    return {
      ...transaction,
      groupName: group?.title || 'Unknown Group',
      groupIcon: group?.icon || '💰',
      memberName: member?.name || 'Unknown Member'
    };
  };

  const filteredTransactions = transactions
    .map(getTransactionDetails)
    .filter(transaction => {
      const matchesGroup = !filterGroup || transaction.groupId === filterGroup;
      const matchesMember = !filterMember || transaction.memberId === filterMember;
      const matchesSearch = !searchTerm || 
        transaction.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (transaction.description && transaction.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesGroup && matchesMember && matchesSearch;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);

  const handleDeleteTransaction = (transactionId: string) => {
    deleteTransaction(transactionId);
    setDeleteConfirm(null);
  };

  const downloadTransactions = () => {
    const csvContent = [
      ['Group', 'Member', 'Amount', 'Date', 'Description'].join(','),
      ...filteredTransactions.map(t => [
        `"${t.groupName}"`,
        `"${t.memberName}"`,
        t.amount.toFixed(2),
        new Date(t.date).toLocaleDateString(),
        `"${t.description || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">All Transactions</h1>
          <p className="text-gray-600 mt-1">
            Total: {totalAmount.toFixed(2)} ({filteredTransactions.length} transactions)
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={downloadTransactions}
            disabled={filteredTransactions.length === 0}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-mint-500 to-mint-600 hover:from-mint-600 hover:to-mint-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="backdrop-blur-sm bg-white/60 rounded-2xl p-6 border border-white/20 shadow-lg">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-mint-500 focus:border-transparent transition-all"
                placeholder="Search transactions..."
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Group
            </label>
            <select
              value={filterGroup}
              onChange={(e) => handleGroupFilterChange(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-mint-500 focus:border-transparent transition-all"
            >
              <option value="">All Groups</option>
              {groups.map(group => (
                <option key={group.id} value={group.id}>
                  {group.icon} {group.title}
                </option>
              ))}
            </select>
          </div>
          
          {filterGroup && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Member
              </label>
              <select
                value={filterMember}
                onChange={(e) => setFilterMember(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-mint-500 focus:border-transparent transition-all"
              >
                <option value="">
                  All Members in {groups.find(g => g.id === filterGroup)?.title || 'Group'}
                </option>
                {availableMembers.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.name} ({member.email})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="backdrop-blur-sm bg-white/60 rounded-2xl p-8 border border-white/20 shadow-lg">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💸</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Transactions Found</h3>
            <p className="text-gray-600 mb-6">
              {transactions.length === 0 
                ? "Start by adding your first transaction!" 
                : "Try adjusting your filters or search terms."}
            </p>
            {transactions.length === 0 && (
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-mint-500 to-mint-600 hover:from-mint-600 hover:to-mint-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Add Your First Transaction
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-200">
                  <th className="py-4 px-4 font-semibold text-gray-700">Group</th>
                  <th className="py-4 px-4 font-semibold text-gray-700">Member</th>
                  <th className="py-4 px-4 font-semibold text-gray-700">Amount</th>
                  <th className="py-4 px-4 font-semibold text-gray-700">Date</th>
                  <th className="py-4 px-4 font-semibold text-gray-700">Description</th>
                  <th className="py-4 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map(transaction => (
                  <tr key={transaction.id} className="hover:bg-white/50 transition-colors border-b border-gray-100/50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{transaction.groupIcon}</span>
                        <span className="font-medium text-gray-800">{transaction.groupName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-purple-600">{transaction.memberName}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-mint-600 text-lg">
                        +{transaction.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-gray-600 max-w-xs truncate">
                      {transaction.description || '-'}
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => setDeleteConfirm(transaction.id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete transaction"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddTransactionModal onClose={() => setShowAddModal(false)} />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full border border-white/20 shadow-xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Delete Transaction</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this transaction? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteTransaction(deleteConfirm)}
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

export default TransactionsList;