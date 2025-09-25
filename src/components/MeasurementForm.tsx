import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { BabyProfile, GrowthMeasurement, FormData, Unit } from '../types';
import { saveMeasurement } from '../utils/storage';
import { generateId, calculateAgeInDays, convertWeight, convertHeight, calculatePercentile } from '../utils/calculations';
import { WHO_GROWTH_DATA } from '../data/whoGrowthData';

interface MeasurementFormProps {
  babyProfile: BabyProfile;
  measurement?: GrowthMeasurement;
  onSave: () => void;
  onCancel: () => void;
}

const MeasurementForm: React.FC<MeasurementFormProps> = ({
  babyProfile,
  measurement,
  onSave,
  onCancel,
}) => {
  const [unit, setUnit] = useState<Unit>('metric');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      date: measurement?.date || new Date().toISOString().split('T')[0],
      weightKg: measurement?.weightKg?.toString() || '',
      weightLb: measurement ? convertWeight.kgToLb(measurement.weightKg).toString() : '',
      heightCm: measurement?.heightCm?.toString() || '',
      heightIn: measurement ? convertHeight.cmToIn(measurement.heightCm).toString() : '',
      headCm: measurement?.headCm?.toString() || '',
      headIn: measurement ? convertHeight.cmToIn(measurement.headCm).toString() : '',
      notes: measurement?.notes || '',
      unit: 'metric',
    },
  });

  const watchedValues = watch();

  // Real-time unit conversion
  React.useEffect(() => {
    if (unit === 'metric' && watchedValues.weightLb) {
      const kg = convertWeight.lbToKg(parseFloat(watchedValues.weightLb) || 0);
      setValue('weightKg', kg.toString());
    }
    if (unit === 'imperial' && watchedValues.weightKg) {
      const lb = convertWeight.kgToLb(parseFloat(watchedValues.weightKg) || 0);
      setValue('weightLb', lb.toString());
    }
  }, [watchedValues.weightLb, watchedValues.weightKg, unit, setValue]);

  React.useEffect(() => {
    if (unit === 'metric' && watchedValues.heightIn) {
      const cm = convertHeight.inToCm(parseFloat(watchedValues.heightIn) || 0);
      setValue('heightCm', cm.toString());
    }
    if (unit === 'imperial' && watchedValues.heightCm) {
      const inches = convertHeight.cmToIn(parseFloat(watchedValues.heightCm) || 0);
      setValue('heightIn', inches.toString());
    }
  }, [watchedValues.heightIn, watchedValues.heightCm, unit, setValue]);

  React.useEffect(() => {
    if (unit === 'metric' && watchedValues.headIn) {
      const cm = convertHeight.inToCm(parseFloat(watchedValues.headIn) || 0);
      setValue('headCm', cm.toString());
    }
    if (unit === 'imperial' && watchedValues.headCm) {
      const inches = convertHeight.cmToIn(parseFloat(watchedValues.headCm) || 0);
      setValue('headIn', inches.toString());
    }
  }, [watchedValues.headIn, watchedValues.headCm, unit, setValue]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      const ageInDays = calculateAgeInDays(babyProfile.birthDate, data.date);
      
      // Convert to SI units for storage
      const weightKg = parseFloat(unit === 'metric' ? data.weightKg : data.weightLb ? convertWeight.lbToKg(parseFloat(data.weightLb)).toString() : data.weightKg);
      const heightCm = parseFloat(unit === 'metric' ? data.heightCm : data.heightIn ? convertHeight.inToCm(parseFloat(data.heightIn)).toString() : data.heightCm);
      const headCm = parseFloat(unit === 'metric' ? data.headCm : data.headIn ? convertHeight.inToCm(parseFloat(data.headIn)).toString() : data.headCm);

      // Calculate percentiles
      const whoData = WHO_GROWTH_DATA[babyProfile.gender];
      const weightPercentile = calculatePercentile(weightKg, ageInDays, 'weight', babyProfile.gender, whoData.weight);
      const heightPercentile = calculatePercentile(heightCm, ageInDays, 'height', babyProfile.gender, whoData.height);
      const headPercentile = calculatePercentile(headCm, ageInDays, 'head', babyProfile.gender, whoData.head);

      const measurementData: GrowthMeasurement = {
        id: measurement?.id || generateId(),
        date: data.date,
        ageInDays,
        weightKg,
        heightCm,
        headCm,
        weightPercentile,
        heightPercentile,
        headPercentile,
        notes: data.notes.trim() || undefined,
      };

      await saveMeasurement(measurementData);
      onSave();
    } catch (error) {
      console.error('Error saving measurement:', error);
      Alert.alert('Error', 'Failed to save measurement. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateWeight = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) return 'Please enter a valid weight';
    if (unit === 'metric' && (num < 0.5 || num > 50)) return 'Weight should be between 0.5-50 kg';
    if (unit === 'imperial' && (num < 1 || num > 110)) return 'Weight should be between 1-110 lbs';
    return true;
  };

  const validateHeight = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) return 'Please enter a valid height';
    if (unit === 'metric' && (num < 20 || num > 200)) return 'Height should be between 20-200 cm';
    if (unit === 'imperial' && (num < 8 || num > 79)) return 'Height should be between 8-79 inches';
    return true;
  };

  const validateHead = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) return 'Please enter a valid head circumference';
    if (unit === 'metric' && (num < 20 || num > 80)) return 'Head circumference should be between 20-80 cm';
    if (unit === 'imperial' && (num < 8 || num > 31)) return 'Head circumference should be between 8-31 inches';
    return true;
  };

  const validateDate = (value: string) => {
    const measurementDate = new Date(value);
    const birthDate = new Date(babyProfile.birthDate);
    const today = new Date();
    
    if (measurementDate < birthDate) return 'Date cannot be before birth date';
    if (measurementDate > today) return 'Date cannot be in the future';
    return true;
  };

  return (
    <Modal visible={true} animationType="slide" presentationStyle="pageSheet">
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onCancel}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>
            {measurement ? 'Edit Measurement' : 'Add Measurement'}
          </Text>
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            style={[styles.saveButton, isSubmitting && styles.saveButtonDisabled]}
          >
            <Text style={styles.saveButtonText}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          <View style={styles.formContent}>
            {/* Date Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Measurement Date</Text>
              <Controller
                control={control}
                name="date"
                rules={{ required: 'Date is required', validate: validateDate }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[styles.input, errors.date && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    placeholder="YYYY-MM-DD"
                    keyboardType="numeric"
                  />
                )}
              />
              {errors.date && <Text style={styles.errorText}>{errors.date.message}</Text>}
            </View>

            {/* Unit Toggle */}
            <View style={styles.unitToggle}>
              <TouchableOpacity
                style={[styles.unitButton, unit === 'metric' && styles.unitButtonActive]}
                onPress={() => setUnit('metric')}
              >
                <Text style={[styles.unitText, unit === 'metric' && styles.unitTextActive]}>
                  Metric
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.unitButton, unit === 'imperial' && styles.unitButtonActive]}
                onPress={() => setUnit('imperial')}
              >
                <Text style={[styles.unitText, unit === 'imperial' && styles.unitTextActive]}>
                  Imperial
                </Text>
              </TouchableOpacity>
            </View>

            {/* Weight Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Weight ({unit === 'metric' ? 'kg' : 'lbs'})
              </Text>
              <Controller
                control={control}
                name={unit === 'metric' ? 'weightKg' : 'weightLb'}
                rules={{ 
                  required: 'Weight is required',
                  validate: validateWeight
                }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[styles.input, errors[unit === 'metric' ? 'weightKg' : 'weightLb'] && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    placeholder={unit === 'metric' ? 'e.g., 4.2' : 'e.g., 9.3'}
                    keyboardType="decimal-pad"
                  />
                )}
              />
              {errors[unit === 'metric' ? 'weightKg' : 'weightLb'] && (
                <Text style={styles.errorText}>
                  {errors[unit === 'metric' ? 'weightKg' : 'weightLb']?.message}
                </Text>
              )}
            </View>

            {/* Height Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Height ({unit === 'metric' ? 'cm' : 'in'})
              </Text>
              <Controller
                control={control}
                name={unit === 'metric' ? 'heightCm' : 'heightIn'}
                rules={{ 
                  required: 'Height is required',
                  validate: validateHeight
                }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[styles.input, errors[unit === 'metric' ? 'heightCm' : 'heightIn'] && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    placeholder={unit === 'metric' ? 'e.g., 55.5' : 'e.g., 21.9'}
                    keyboardType="decimal-pad"
                  />
                )}
              />
              {errors[unit === 'metric' ? 'heightCm' : 'heightIn'] && (
                <Text style={styles.errorText}>
                  {errors[unit === 'metric' ? 'heightCm' : 'heightIn']?.message}
                </Text>
              )}
            </View>

            {/* Head Circumference Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Head Circumference ({unit === 'metric' ? 'cm' : 'in'})
              </Text>
              <Controller
                control={control}
                name={unit === 'metric' ? 'headCm' : 'headIn'}
                rules={{ 
                  required: 'Head circumference is required',
                  validate: validateHead
                }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[styles.input, errors[unit === 'metric' ? 'headCm' : 'headIn'] && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    placeholder={unit === 'metric' ? 'e.g., 38.5' : 'e.g., 15.2'}
                    keyboardType="decimal-pad"
                  />
                )}
              />
              {errors[unit === 'metric' ? 'headCm' : 'headIn'] && (
                <Text style={styles.errorText}>
                  {errors[unit === 'metric' ? 'headCm' : 'headIn']?.message}
                </Text>
              )}
            </View>

            {/* Notes Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Notes (Optional)</Text>
              <Controller
                control={control}
                name="notes"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[styles.input, styles.notesInput]}
                    value={value}
                    onChangeText={onChange}
                    placeholder="Any additional notes..."
                    multiline
                    numberOfLines={3}
                  />
                )}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
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
    borderRadius: 6,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  form: {
    flex: 1,
  },
  formContent: {
    padding: 16,
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
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 4,
  },
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  unitButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  unitButtonActive: {
    backgroundColor: '#667eea',
  },
  unitText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  unitTextActive: {
    color: '#fff',
  },
});

export default MeasurementForm;

