import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BabyProfile } from '../types';
import { saveBabyProfile } from '../utils/storage';
import { generateId } from '../utils/calculations';

interface BabySetupProps {
  onBabyCreated: (baby: BabyProfile) => void;
}

const BabySetup: React.FC<BabySetupProps> = ({ onBabyCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    gender: 'male' as 'male' | 'female',
    birthWeight: '',
    birthHeight: '',
    birthHead: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Baby name is required';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'Birth date is required';
    } else {
      const date = new Date(formData.birthDate);
      const today = new Date();
      if (date > today) {
        newErrors.birthDate = 'Birth date cannot be in the future';
      }
    }

    if (formData.birthWeight) {
      const weight = parseFloat(formData.birthWeight);
      if (isNaN(weight) || weight <= 0 || weight > 10) {
        newErrors.birthWeight = 'Please enter a valid birth weight (0.5-10 kg)';
      }
    }

    if (formData.birthHeight) {
      const height = parseFloat(formData.birthHeight);
      if (isNaN(height) || height <= 0 || height > 80) {
        newErrors.birthHeight = 'Please enter a valid birth height (20-80 cm)';
      }
    }

    if (formData.birthHead) {
      const head = parseFloat(formData.birthHead);
      if (isNaN(head) || head <= 0 || head > 50) {
        newErrors.birthHead = 'Please enter a valid head circumference (20-50 cm)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const babyProfile: BabyProfile = {
        id: generateId(),
        name: formData.name.trim(),
        birthDate: formData.birthDate,
        gender: formData.gender,
        birthWeight: formData.birthWeight ? parseFloat(formData.birthWeight) : undefined,
        birthHeight: formData.birthHeight ? parseFloat(formData.birthHeight) : undefined,
        birthHead: formData.birthHead ? parseFloat(formData.birthHead) : undefined,
      };

      await saveBabyProfile(babyProfile);
      onBabyCreated(babyProfile);
    } catch (error) {
      console.error('Error saving baby profile:', error);
      Alert.alert('Error', 'Failed to save baby profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDateForInput = (date: string) => {
    // Convert to YYYY-MM-DD format for TextInput
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return date;
    return d.toISOString().split('T')[0];
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          {/* <Ionicons name="baby" size={48} color="#fff" /> */}
          <Text style={styles.title}>Welcome!</Text>
          <Text style={styles.subtitle}>Let's set up your baby's profile</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        <View style={styles.formContent}>
          {/* Baby Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Baby's Name *</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={formData.name}
              onChangeText={(text) => {
                setFormData({ ...formData, name: text });
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
              placeholder="Enter baby's name"
              autoCapitalize="words"
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          {/* Birth Date */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Birth Date *</Text>
            <TextInput
              style={[styles.input, errors.birthDate && styles.inputError]}
              value={formatDateForInput(formData.birthDate)}
              onChangeText={(text) => {
                setFormData({ ...formData, birthDate: text });
                if (errors.birthDate) setErrors({ ...errors, birthDate: '' });
              }}
              placeholder="YYYY-MM-DD"
              keyboardType="numeric"
            />
            {errors.birthDate && <Text style={styles.errorText}>{errors.birthDate}</Text>}
          </View>

          {/* Gender Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  formData.gender === 'male' && styles.genderButtonActive,
                ]}
                onPress={() => setFormData({ ...formData, gender: 'male' })}
              >
                <Ionicons
                  name="male"
                  size={24}
                  color={formData.gender === 'male' ? '#fff' : '#667eea'}
                />
                <Text
                  style={[
                    styles.genderText,
                    formData.gender === 'male' && styles.genderTextActive,
                  ]}
                >
                  Male
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.genderButton,
                  formData.gender === 'female' && styles.genderButtonActive,
                ]}
                onPress={() => setFormData({ ...formData, gender: 'female' })}
              >
                <Ionicons
                  name="female"
                  size={24}
                  color={formData.gender === 'female' ? '#fff' : '#e91e63'}
                />
                <Text
                  style={[
                    styles.genderText,
                    formData.gender === 'female' && styles.genderTextActive,
                  ]}
                >
                  Female
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Birth Measurements */}
          <Text style={styles.sectionTitle}>Birth Measurements (Optional)</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Birth Weight (kg)</Text>
            <TextInput
              style={[styles.input, errors.birthWeight && styles.inputError]}
              value={formData.birthWeight}
              onChangeText={(text) => {
                setFormData({ ...formData, birthWeight: text });
                if (errors.birthWeight) setErrors({ ...errors, birthWeight: '' });
              }}
              placeholder="e.g., 3.2"
              keyboardType="decimal-pad"
            />
            {errors.birthWeight && <Text style={styles.errorText}>{errors.birthWeight}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Birth Height (cm)</Text>
            <TextInput
              style={[styles.input, errors.birthHeight && styles.inputError]}
              value={formData.birthHeight}
              onChangeText={(text) => {
                setFormData({ ...formData, birthHeight: text });
                if (errors.birthHeight) setErrors({ ...errors, birthHeight: '' });
              }}
              placeholder="e.g., 50"
              keyboardType="decimal-pad"
            />
            {errors.birthHeight && <Text style={styles.errorText}>{errors.birthHeight}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Head Circumference (cm)</Text>
            <TextInput
              style={[styles.input, errors.birthHead && styles.inputError]}
              value={formData.birthHead}
              onChangeText={(text) => {
                setFormData({ ...formData, birthHead: text });
                if (errors.birthHead) setErrors({ ...errors, birthHead: '' });
              }}
              placeholder="e.g., 35"
              keyboardType="decimal-pad"
            />
            {errors.birthHead && <Text style={styles.errorText}>{errors.birthHead}</Text>}
          </View>

          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Creating Profile...' : 'Create Profile'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  formContent: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    marginTop: 10,
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
    padding: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  genderButtonActive: {
    borderColor: '#667eea',
    backgroundColor: '#667eea',
  },
  genderText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: '#333',
  },
  genderTextActive: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#667eea',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default BabySetup;

