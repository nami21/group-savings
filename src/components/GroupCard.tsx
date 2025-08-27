import React from 'react';
import { Users, DollarSign, Calendar, Edit, Trash2 } from 'lucide-react';
import { Group } from '../types';
import { useApp } from '../context/AppContext';

interface GroupCardProps {
  group: Group;
  onSelect: (groupId: string) => void;
  onEdit: (group: Group) => void;
  onDelete: (groupId: string) => void;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, onSelect, onEdit, onDelete }) => {
  const { getGroupTotal, getGroupMembers } = useApp();
  
  const total = getGroupTotal(group.id);
  const memberCount = getGroupMembers(group.id).length;

  return (
    <div
      className="backdrop-blur-sm bg-white/60 hover:bg-white/80 rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 group relative"
    >
      {/* Action buttons */}
      <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(group);
          }}
          className="p-2 bg-white/80 hover:bg-white rounded-lg shadow-md transition-colors"
          title="Edit group"
        >
          <Edit className="w-4 h-4 text-gray-600" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(group.id);
          }}
          className="p-2 bg-white/80 hover:bg-red-50 rounded-lg shadow-md transition-colors"
          title="Delete group"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </button>
      </div>

      <div className="flex items-start justify-between mb-4">
        <div className="text-4xl mb-3">{group.icon}</div>
        <div className="text-right">
          <p className="text-sm text-gray-500 mb-1">Total Savings</p>
          <p className="text-2xl font-bold text-gray-800">{total.toFixed(2)}</p>
        </div>
      </div>
      
      <h3 
        onClick={() => onSelect(group.id)}
        className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-mint-600 transition-colors cursor-pointer"
      >
        {group.title}
      </h3>
      
      {group.description && (
        <p 
          onClick={() => onSelect(group.id)}
          className="text-gray-600 text-sm mb-4 line-clamp-2 cursor-pointer"
        >
          {group.description}
        </p>
      )}

      <div 
        onClick={() => onSelect(group.id)}
        className="flex items-center justify-between text-sm text-gray-500 cursor-pointer"
      >
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{memberCount} members</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(group.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupCard;