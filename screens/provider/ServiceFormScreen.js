import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  Image,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import useServicesStore from '../../store/servicesStore';

import * as ImagePicker from 'expo-image-picker';
import mediaService from '../../services/mediaService';

export default function ServiceFormScreen({ route, navigation }) {
  const { service } = route.params || {};
  const isEditing = !!service;

  const { createService, updateService, fetchCategories, categories } = useServicesStore();

  const [formData, setFormData] = useState({
    title: service?.title || '',
    description: service?.description || '',
    price: service?.price?.toString() || '',
    category: service?.category || '',
  });

  const [images, setImages] = useState(service?.images || []);
  const [newImageUris, setNewImageUris] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [selectedCategoryData, setSelectedCategoryData] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleImagePick = async () => {
    try {
      if (images.length + newImageUris.length >= 5) {
        Alert.alert('Limit Reached', 'You can only upload up to 5 images per service.');
        return;
      }

      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera roll permissions to upload images.');
        return;
      }

      console.log('Launching Image Picker...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsMultipleSelection: true,
        selectionLimit: 5 - (images.length + newImageUris.length),
        quality: 0.6,
      });
      console.log('Image Picker Result:', result ? 'Success' : 'Failed');

      if (!result.canceled) {
        const selectedUris = result.assets.map(asset => asset.uri);
        setNewImageUris([...newImageUris, ...selectedUris]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image: ' + error.message);
    }
  };

  const removeImage = (index, isNew = false) => {
    if (isNew) {
      setNewImageUris(newImageUris.filter((_, i) => i !== index));
    } else {
      setImages(images.filter((_, i) => i !== index));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    const priceValue = Number(formData.price);
    if (!formData.price || isNaN(formData.price) || priceValue <= 0) {
      newErrors.price = 'Valid price is required';
    } else if (selectedCategoryData) {
      if (priceValue < selectedCategoryData.minPrice || priceValue > selectedCategoryData.maxPrice) {
        newErrors.price = `Price must be between Rs.${selectedCategoryData.minPrice} and Rs.${selectedCategoryData.maxPrice}`;
      }
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    setIsUploading(true);
    let finalImages = [...images];

    try {
      // Upload new images if any
      if (newImageUris.length > 0) {
        const uploadResult = await mediaService.uploadMultiple(newImageUris);
        finalImages = [...finalImages, ...uploadResult.images.map(img => img.url)];
      }

      const serviceData = {
        ...formData,
        price: Number(formData.price),
        images: finalImages,
      };

      let result;
      if (isEditing) {
        result = await updateService(service._id, serviceData);
      } else {
        result = await createService(serviceData);
      }

      if (result.success) {
        Alert.alert(
          'Success',
          `Service ${isEditing ? 'updated' : 'created'} successfully`,
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        const errorObj = result.error;
        const errorMessage = errorObj?.error || errorObj?.message || (typeof errorObj === 'string' ? errorObj : 'Failed to save service');
        
        if (errorMessage.toLowerCase().includes('pending approval')) {
          Alert.alert(
            'Account Pending',
            'Your provider account is currently pending approval. You cannot create services until your account is approved.',
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert('Error', errorMessage);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload images. Please try again.');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const selectCategory = (cat) => {
    setFormData({ ...formData, category: cat.category_name });
    setSelectedCategoryData(cat);
    setShowCategoryDropdown(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.surface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isEditing ? 'Edit Service' : 'Add Service'}
          </Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Service Title *</Text>
            <TextInput
              style={[styles.input, errors.title && styles.inputError]}
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              placeholder="e.g., Home Cleaning Service"
              placeholderTextColor={colors.textSecondary}
            />
            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea, errors.description && styles.inputError]}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholder="Describe your service..."
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={4}
            />
            {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Price (NPR) *</Text>
            <TextInput
              style={[styles.input, errors.price && styles.inputError]}
              value={formData.price}
              onChangeText={(text) => setFormData({ ...formData, price: text })}
              placeholder="e.g. 1500"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />
            {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Service Images (Max 5)</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageGallery}>
              {images.map((uri, index) => (
                <View key={`old-${index}`} style={styles.imageWrapper}>
                  <Image source={{ uri }} style={styles.previewImage} />
                  <TouchableOpacity style={styles.removeImage} onPress={() => removeImage(index, false)}>
                    <MaterialCommunityIcons name="close-circle" size={24} color={colors.error} />
                  </TouchableOpacity>
                </View>
              ))}
              {newImageUris.map((uri, index) => (
                <View key={`new-${index}`} style={styles.imageWrapper}>
                  <Image source={{ uri }} style={styles.previewImage} />
                  <TouchableOpacity style={styles.removeImage} onPress={() => removeImage(index, true)}>
                    <MaterialCommunityIcons name="close-circle" size={24} color={colors.error} />
                  </TouchableOpacity>
                </View>
              ))}
              {(images.length + newImageUris.length < 5) && (
                <TouchableOpacity style={styles.addImage} onPress={handleImagePick}>
                  <MaterialCommunityIcons name="camera-plus" size={32} color={colors.primary} />
                  <Text style={styles.addImageText}>Add</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>

          <View style={[styles.inputGroup, { zIndex: 10 }]}>
            <Text style={styles.label}>Category *</Text>
            <View>
              <TextInput
                style={[styles.input, errors.category && styles.inputError]}
                value={formData.category}
                onChangeText={(text) => {
                  setFormData({ ...formData, category: text });
                  setShowCategoryDropdown(true);
                }}
                onFocus={() => setShowCategoryDropdown(true)}
                placeholder="Select or type new category"
                placeholderTextColor={colors.textSecondary}
              />
              {showCategoryDropdown && (formData.category.length > 0 || categories.length > 0) && (
                <View style={styles.dropdown}>
                  <ScrollView keyboardShouldPersistTaps="handled" style={{ maxHeight: 150 }}>
                    {filteredCategories.map((item) => (
                      <TouchableOpacity
                        key={item._id}
                        style={styles.dropdownItem}
                        onPress={() => selectCategory(item)}
                      >
                        <View>
                          <Text style={styles.dropdownText}>{item.category_name}</Text>
                          <Text style={styles.dropdownHint}>
                            (Rs.{item.minPrice} - Rs.{item.maxPrice})
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                    {formData.category.length > 0 && !filteredCategories.find(c => c.category_name.toLowerCase() === formData.category.toLowerCase()) && (
                      <TouchableOpacity
                        style={styles.dropdownItem}
                        onPress={() => selectCategory({ category_name: formData.category, minPrice: 0, maxPrice: 1000000 })}
                      >
                        <Text style={[styles.dropdownText, { color: colors.primary, fontWeight: 'bold' }]}>
                          Create "{formData.category}"
                        </Text>
                      </TouchableOpacity>
                    )}
                  </ScrollView>
                </View>
              )}
            </View>
            {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
          </View>

          <TouchableOpacity 
            style={[styles.submitButton, isUploading && styles.submitButtonDisabled]} 
            onPress={handleSubmit}
            disabled={isUploading}
          >
            <LinearGradient
              colors={isUploading ? [colors.textLight, colors.textLight] : [colors.primary, colors.secondary]}
              style={styles.submitGradient}
            >
              {isUploading ? (
                <ActivityIndicator color={colors.surface} size="small" />
              ) : null}
              <Text style={styles.submitText}>
                {isUploading ? 'Processing...' : (isEditing ? 'Update Service' : 'Create Service')}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.surface,
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
  },
  imageGallery: {
    flexDirection: 'row',
    marginTop: 8,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: colors.border,
  },
  removeImage: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  addImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary + '10',
  },
  addImageText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 4,
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 12,
  },
  submitGradient: {
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 4,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border + '40',
  },
  dropdownText: {
    fontSize: 16,
    color: colors.text,
  },
  dropdownHint: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  hintText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    fontStyle: 'italic',
  },
});
