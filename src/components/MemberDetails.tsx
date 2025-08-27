import React from 'react';
import { ArrowLeft, DollarSign, Calendar, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useState } from 'react';

interface MemberDetailsProps {
  memberId: string;
  onBack: () => void;
}

const MemberDetails: React.FC<MemberDetailsProps> = ({ memberId, onBack }) => {
  const { 
    members, 
    groups,
    getMemberTotal, 
    getMemberTransactions,
    deleteTransaction 
  } = useApp();

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const member = members.find(m => m.id === memberId);
  const memberTransactions = getMemberTransactions(memberId);
  const memberTotal = getMemberTotal(memberId);

  if (!member) return null;

  const group = groups.find(g => g.id === member.groupId);

  const getTransactionDetails = (transaction: any) => {
    const transactionGroup = groups.find(g => g.id === transaction.groupId);
    return {
      ...transaction,
      groupName: transactionGroup?.title || 'Unknown Group',
      groupIcon: transactionGroup?.icon || '💰'
    };
  };

  const transactionsWithDetails = memberTransactions
    .map(getTransactionDetails)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleDeleteTransaction = (transactionId: string) => {
    deleteTransaction(transactionId);
    setDeleteConfirm(null);
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
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{member.name}</h1>
            <p className="text-gray-600 mt-1">
              Member of {group?.icon} {group?.title}
            </p>
          </div>
        </div>
      </div>

      {/* Member Info Card */}
      <div className="backdrop-blur-sm bg-white/60 rounded-2xl p-8 border border-white/20 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-800">{member.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-800">{member.phoneNumber}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Contribution Summary</h2>
            <div className="backdrop-blur-sm bg-gradient-to-r from-mint-100/60 to-mint-200/40 rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-mint-700 text-sm font-medium">Total Contributed</p>
                  <p className="text-3xl font-bold text-gray-800">${memberTotal.toFixed(2)}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {memberTransactions.length} transactions
                  </p>
                </div>
                <div className="bg-mint-200/50 p-3 rounded-xl">
                  <DollarSign className="w-8 h-8 text-mint-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="backdrop-blur-sm bg-white/60 rounded-2xl p-8 border border-white/20 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Transaction History</h2>
        </div>

        {transactionsWithDetails.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Transactions Yet</h3>
            <p className="text-gray-600">This member hasn't made any contributions yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactionsWithDetails.map(transaction => (
              <div
                key={transaction.id}
                className="bg-white/80 rounded-xl p-6 border border-white/30 hover:bg-white/90 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{transaction.groupIcon}</div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-800">{transaction.groupName}</h3>
                        <span className="text-sm text-gray-500">
                          • {new Date(transaction.date).toLocaleDateString()}
                        </span>
                      </div>
                      {transaction.description && (
                        <p className="text-sm text-gray-600 mt-1">{transaction.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-mint-600">
                        +{transaction.amount.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => setDeleteConfirm(transaction.id)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      title="Delete transaction"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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

export default MemberDetails;