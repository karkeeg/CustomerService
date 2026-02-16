import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {
  List,
  IconButton,
  FAB,
  Portal,
  Modal,
  TextInput,
  Button,
  ActivityIndicator,
  Surface,
} from 'react-native-paper';
import colors from '../../../constants/colors';
import adminService from '../../../services/adminService';
import servicesService from '../../../services/servicesService';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CategoriesTab = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    category_name: '',
    minPrice: '',
    maxPrice: '',
  });

  const fetchCategories = async () => {
    try {
      const data = await servicesService.getCategories();
      setCategories(data);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCategories();
  }, []);

  const handleOpenModal = (category = null) => {
    if (category) {
      setSelectedCategory(category);
      setFormData({
        category_name: category.category_name,
        minPrice: category.minPrice?.toString() || '0',
        maxPrice: category.maxPrice?.toString() || '1000000',
      });
    } else {
      setSelectedCategory(null);
      setFormData({
        category_name: '',
        minPrice: '0',
        maxPrice: '1000000',
      });
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!formData.category_name || formData.minPrice === '' || formData.maxPrice === '') {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      const payload = {
        category_name: formData.category_name,
        minPrice: Number(formData.minPrice),
        maxPrice: Number(formData.maxPrice),
      };

      if (selectedCategory) {
        await adminService.updateCategory(selectedCategory._id, payload);
      } else {
        await adminService.createCategory(payload);
      }
      
      setModalVisible(false);
      fetchCategories();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to save category');
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Category',
      'Are you sure? All services in this category might be affected.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: async () => {
            try {
              await adminService.deleteCategory(id);
              fetchCategories();
            } catch (error) {
              Alert.alert('Error', error.message || 'Failed to delete category');
            }
          }
        }
      ]
    );
  };

  const renderCategoryItem = ({ item }) => (
    <Surface style={styles.categoryCard}>
      <List.Item
        title={item.category_name}
        description={`Price Range: Rs.${item.minPrice} - Rs.${item.maxPrice}`}
        left={props => <List.Icon {...props} icon="folder-outline" color={colors.primary} />}
        right={props => (
          <View style={styles.actions}>
            <IconButton icon="pencil-outline" onPress={() => handleOpenModal(item)} />
            <IconButton icon="delete-outline" iconColor={colors.error} onPress={() => handleDelete(item._id)} />
          </View>
        )}
      />
    </Surface>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={item => item._id}
        renderItem={renderCategoryItem}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="folder-open-outline" size={64} color={colors.textLight} />
            <Text style={styles.emptyText}>No categories found</Text>
          </View>
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => handleOpenModal()}
        label="Add Category"
      />

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text style={styles.modalTitle}>
            {selectedCategory ? 'Edit Category' : 'New Category'}
          </Text>
          
          <TextInput
            label="Category Name"
            value={formData.category_name}
            onChangeText={text => setFormData({ ...formData, category_name: text })}
            mode="outlined"
            style={styles.input}
          />
          
          <View style={styles.priceRow}>
            <TextInput
              label="Min Price (Rs.)"
              value={formData.minPrice}
              onChangeText={text => setFormData({ ...formData, minPrice: text })}
              keyboardType="numeric"
              mode="outlined"
              style={[styles.input, { flex: 1, marginRight: 8 }]}
            />
            <TextInput
              label="Max Price (Rs.)"
              value={formData.maxPrice}
              onChangeText={text => setFormData({ ...formData, maxPrice: text })}
              keyboardType="numeric"
              mode="outlined"
              style={[styles.input, { flex: 1 }]}
            />
          </View>

          <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
            Save Category
          </Button>
          <Button mode="text" onPress={() => setModalVisible(false)}>
            Cancel
          </Button>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 15,
    paddingBottom: 100,
  },
  categoryCard: {
    backgroundColor: colors.surface,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  actions: {
    flexDirection: 'row',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
  modalContent: {
    backgroundColor: colors.surface,
    padding: 20,
    margin: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
  },
  priceRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  saveButton: {
    marginTop: 10,
    marginBottom: 5,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.textSecondary,
  },
});

export default CategoriesTab;
