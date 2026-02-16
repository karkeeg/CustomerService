import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import colors from '../../constants/colors';
import AppHeader from '../../components/AppHeader';
import TabBar from '../../components/TabBar';
import DashboardTab from './tabs/DashboardTab';
import UsersTab from './tabs/UsersTab';
import ServicesTab from './tabs/ServicesTab';
import ApprovalsTab from './tabs/ApprovalsTab';
import ProfileTab from './tabs/ProfileTab';
import CategoriesTab from './tabs/CategoriesTab';

export default function AdminDashboardScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('home');
  const [activeTabParams, setActiveTabParams] = useState({});

  const handleTabChange = (tabId, params = {}) => {
    setActiveTab(tabId);
    setActiveTabParams(params);
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'home':
        return 'Admin Portal';
      case 'users':
        return 'Manage Users';
      case 'services':
        return 'Manage Services';
      case 'categories':
        return 'Service Categories';
      case 'approvals':
        return 'Pending Approvals';
      case 'profile':
        return 'Admin Profile';
      default:
        return 'Admin Portal';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardTab navigation={navigation} onTabChange={handleTabChange} />;
      case 'users':
        return <UsersTab navigation={navigation} params={activeTabParams} />;
      case 'services':
        return <ServicesTab navigation={navigation} params={activeTabParams} />;
      case 'categories':
        return <CategoriesTab navigation={navigation} params={activeTabParams} />;
      case 'approvals':
        return <ApprovalsTab navigation={navigation} params={activeTabParams} />;
      case 'profile':
        return <ProfileTab navigation={navigation} params={activeTabParams} />;
      default:
        return <DashboardTab navigation={navigation} onTabChange={handleTabChange} />;
    }
  };



  return (
    <View style={styles.container}>
      <AppHeader
        title={getTabTitle()}
      />
      
      <View style={styles.content}>
        {renderTabContent()}
      </View>

      <TabBar activeTab={activeTab} onTabChange={(tabId) => handleTabChange(tabId, {})} role="admin" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
});
