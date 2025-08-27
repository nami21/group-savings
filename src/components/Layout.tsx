import React from 'react';
import { Users, DollarSign, Home } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: 'dashboard' | 'groups' | 'members' | 'transactions';
  onViewChange: (view: 'dashboard' | 'groups' | 'members' | 'transactions') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, onViewChange }) => {
  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: Home },
    // { id: 'groups' as const, label: 'Groups', icon: Users },
    { id: 'transactions' as const, label: 'Transactions', icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            FundCircle
          </h1>
          <p className="text-gray-600 text-lg">
            Track your group savings with simplicity and transparency
          </p>
        </header>

        <nav className="flex justify-center mb-8">
          <div className="backdrop-blur-sm bg-white/30 rounded-2xl p-2 border border-white/20 shadow-lg">
            <div className="flex space-x-1">
              {navItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => onViewChange(id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    currentView === id
                      ? 'bg-white/80 text-gray-800 shadow-md'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/40'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>

        <main>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;