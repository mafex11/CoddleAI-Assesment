import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// DateTimePicker removed for web compatibility
import { BabyProfile } from '../types';
import { saveBabyProfile } from '../utils/storage';

// Helper function to format date for input (YYYY-MM-DD)
const formatDateForInput = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

interface BabyProfileEditProps {
  babyProfile: BabyProfile;
  visible: boolean;
  onSave: (profile: BabyProfile) => void;
  onCancel: () => void;
}

const BabyProfileEdit: React.FC<BabyProfileEditProps> = ({
  babyProfile,
  visible,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState(babyProfile.name);
  const [gender, setGender] = useState<'male' | 'female'>(babyProfile.gender);
  const [birthDate, setBirthDate] = useState(new Date(babyProfile.birthDate));
  const [dateInput, setDateInput] = useState(formatDateForInput(new Date(babyProfile.birthDate)));
  const [saving, setSaving] = useState(false);

  // formatDateForInput function moved outside component

  const handleDateInputChange = (dateString: string) => {
    setDateInput(dateString);
    if (dateString && dateString.length === 10) { // YYYY-MM-DD format
      const newDate = new Date(dateString);
      if (!isNaN(newDate.getTime())) {
        setBirthDate(newDate);
      }
    }
  };

  const handleSave = async () => {
    // Validation
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a name for your baby');
      return;
    }

    if (birthDate > new Date()) {
      Alert.alert('Error', 'Birth date cannot be in the future');
      return;
    }

    setSaving(true);
    try {
      const updatedProfile: BabyProfile = {
        ...babyProfile,
        name: name.trim(),
        gender,
        birthDate: birthDate.toISOString(),
      };

      await saveBabyProfile(updatedProfile);
      onSave(updatedProfile);
      Alert.alert('Success', 'Baby profile updated successfully!');
    } catch (error) {
      console.error('Error saving baby profile:', error);
      Alert.alert('Error', 'Failed to save baby profile');
    } finally {
      setSaving(false);
    }
  };

  // Date change handler removed - using text input instead

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onCancel}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
            <Ionicons name="close" size={24} color="#667eea" />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Baby Profile</Text>
          <TouchableOpacity
            onPress={handleSave}
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            disabled={saving}
          >
            <Text style={[styles.saveButtonText, saving && styles.saveButtonTextDisabled]}>
              {saving ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Baby's Name</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Enter baby's name"
              placeholderTextColor="#999"
            />
          </View>

          {/* Gender Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === 'male' && styles.genderButtonSelected,
                ]}
                onPress={() => setGender('male')}
              >
                <Ionicons
                  name="male"
                  size={24}
                  color={gender === 'male' ? '#fff' : '#667eea'}
                />
                <Text
                  style={[
                    styles.genderButtonText,
                    gender === 'male' && styles.genderButtonTextSelected,
                  ]}
                >
                  Boy
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === 'female' && styles.genderButtonSelected,
                ]}
                onPress={() => setGender('female')}
              >
                <Ionicons
                  name="female"
                  size={24}
                  color={gender === 'female' ? '#fff' : '#f472b6'}
                />
                <Text
                  style={[
                    styles.genderButtonText,
                    gender === 'female' && styles.genderButtonTextSelected,
                  ]}
                >
                  Girl
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Birth Date */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Birth Date</Text>
            <View style={styles.dateInputContainer}>
              <Ionicons name="calendar" size={20} color="#667eea" />
              <TextInput
                style={styles.dateInput}
                value={dateInput}
                onChangeText={handleDateInputChange}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#999"
                maxLength={10}
              />
            </View>
            <Text style={styles.datePreview}>
              Preview: {formatDate(birthDate)}
            </Text>
          </View>

          {/* Current Age Display */}
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={20} color="#10b981" />
            <Text style={styles.infoText}>
              Current age: {Math.floor((Date.now() - birthDate.getTime()) / (1000 * 60 * 60 * 24))} days old
            </Text>
          </View>
        </ScrollView>

        {/* Date picker removed for web compatibility */}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  cancelButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonTextDisabled: {
    color: '#d1d5db',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    color: '#333',
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  genderButtonSelected: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  genderButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  genderButtonTextSelected: {
    color: '#fff',
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  dateInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  datePreview: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#d1fae5',
  },
  infoText: {
    fontSize: 14,
    color: '#065f46',
    marginLeft: 8,
    fontWeight: '500',
  },
});

export default BabyProfileEdit;
