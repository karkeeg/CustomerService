import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import colors from '../../constants/colors';
import AppHeader from '../../components/AppHeader';
import TabBar from '../../components/TabBar';
import HomeTab from './tabs/HomeTab';
import ExploreTab from './tabs/ExploreTab';
import DashboardTab from './tabs/DashboardTab';
import RequestsTab from './tabs/RequestsTab';
import ProfileTab from './tabs/ProfileTab';

export default function ConsumerDashboardScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('home');

  const getTabTitle = () => {
    switch (activeTab) {
      case 'home':
        return 'Customer Home';
      case 'explore':
        return 'Explore Services';
      case 'dashboard':
        return 'My Summary';
      case 'requests':
        return 'My Requests';
      case 'profile':
        return 'My Profile';
      default:
        return 'Customer Portal';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab navigation={navigation} />;
      case 'explore':
        return <ExploreTab navigation={navigation} />;
      case 'dashboard':
        return <DashboardTab navigation={navigation} />;
      case 'requests':
        return <RequestsTab navigation={navigation} />;
      case 'profile':
        return <ProfileTab navigation={navigation} />;
      default:
        return <HomeTab navigation={navigation} />;
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

      <TabBar activeTab={activeTab} onTabChange={setActiveTab} role="consumer" />
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
