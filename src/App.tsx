import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import GroupDetails from './components/GroupDetails';
import MemberDetails from './components/MemberDetails';
import TransactionsList from './components/TransactionsList';
import { AppProvider } from './context/AppContext';

type ViewState = 
  | { type: 'dashboard' }
  | { type: 'group'; groupId: string }
  | { type: 'member'; memberId: string }
  | { type: 'transactions' };

function App() {
  const [currentView, setCurrentView] = useState<ViewState>({ type: 'dashboard' });

  const handleViewChange = (view: 'dashboard' | 'groups' | 'members' | 'transactions') => {
    switch (view) {
      case 'dashboard':
        setCurrentView({ type: 'dashboard' });
        break;
      case 'transactions':
        setCurrentView({ type: 'transactions' });
        break;
      default:
        setCurrentView({ type: 'dashboard' });
    }
  };

  const handleSelectGroup = (groupId: string) => {
    setCurrentView({ type: 'group', groupId });
  };

  const handleSelectMember = (memberId: string) => {
    setCurrentView({ type: 'member', memberId });
  };

  const handleBack = () => {
    setCurrentView({ type: 'dashboard' });
  };

  const getCurrentViewType = () => {
    switch (currentView.type) {
      case 'dashboard':
        return 'dashboard';
      case 'group':
        return 'groups';
      case 'member':
        return 'groups';
      case 'transactions':
        return 'transactions';
      default:
        return 'dashboard';
    }
  };

  const renderCurrentView = () => {
    switch (currentView.type) {
      case 'dashboard':
        return <Dashboard onSelectGroup={handleSelectGroup} />;
      case 'group':
        return (
          <GroupDetails
            groupId={currentView.groupId}
            onBack={handleBack}
            onSelectMember={handleSelectMember}
          />
        );
      case 'member':
        return (
          <MemberDetails
            memberId={currentView.memberId}
            onBack={handleBack}
          />
        );
      case 'transactions':
        return <TransactionsList />;
      default:
        return <Dashboard onSelectGroup={handleSelectGroup} />;
    }
  };

  return (
    <AppProvider>
      <Layout
        currentView={getCurrentViewType()}
        onViewChange={handleViewChange}
      >
        {renderCurrentView()}
      </Layout>
    </AppProvider>
  );
}

export default App;