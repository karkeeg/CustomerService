import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import useAuthStore from '../../store/authStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../constants/colors';
import ProviderHeader from '../../components/ProviderHeader';
import TabBar from '../../components/TabBar';
import HomeTab from './tabs/HomeTab';
import ServicesTab from './tabs/ServicesTab';
import RequestsTab from './tabs/RequestsTab';
import AnalyticsTab from './tabs/AnalyticsTab';
import ProfileTab from './tabs/ProfileTab';

export default function ProviderDashboardScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('home');
  const [notificationCount] = useState(3); // TODO: Connect to real notification system

  const getTabTitle = () => {
    switch (activeTab) {
      case 'home':
        return 'Dashboard';
      case 'services':
        return 'My Services';
      case 'requests':
        return 'Service Requests';
      case 'analytics':
        return 'Analytics';
      case 'profile':
        return 'Profile';
      default:
        return 'Dashboard';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab navigation={navigation} />;
      case 'services':
        return <ServicesTab navigation={navigation} />;
      case 'requests':
        return <RequestsTab navigation={navigation} />;
      case 'analytics':
        return <AnalyticsTab navigation={navigation} />;
      case 'profile':
        return <ProfileTab navigation={navigation} />;
      default:
        return <HomeTab navigation={navigation} />;
    }
  };

  const handleNotificationPress = () => {
    // TODO: Navigate to notifications screen
    console.log('Notifications pressed');
  };

  return (

    <View style={styles.container}>
      <ProviderHeader
        title={getTabTitle()}
        onNotificationPress={handleNotificationPress}
        notificationCount={notificationCount}
      />
      
      <View style={styles.content}>
        {renderTabContent()}
      </View>

      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
     </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    // paddingTop: 20,
  },
  content: {
    flex: 1,
  },
});
