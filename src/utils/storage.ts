import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageData, BabyProfile, GrowthMeasurement } from '../types';

const STORAGE_KEY = 'growth/v1/data';
const STORAGE_VERSION = '1.0.0';

/**
 * Initialize default storage data
 */
const createDefaultStorageData = (): StorageData => ({
  version: STORAGE_VERSION,
  measurements: [],
  lastUpdated: new Date().toISOString(),
});

/**
 * Load data from AsyncStorage with error handling
 */
export const loadData = async (): Promise<StorageData> => {
  try {
    const jsonData = await AsyncStorage.getItem(STORAGE_KEY);
    
    if (!jsonData) {
      return createDefaultStorageData();
    }
    
    const parsedData = JSON.parse(jsonData) as StorageData;
    
    // Version migration (if needed in future)
    if (parsedData.version !== STORAGE_VERSION) {
      console.log('Storage version mismatch, migrating...');
      return migrateData(parsedData);
    }
    
    // Validate data structure
    if (!Array.isArray(parsedData.measurements)) {
      console.warn('Invalid measurements array, resetting...');
      return createDefaultStorageData();
    }
    
    return parsedData;
  } catch (error) {
    console.error('Error loading data from storage:', error);
    // Show recovery dialog in real app
    return createDefaultStorageData();
  }
};

/**
 * Save data to AsyncStorage
 */
export const saveData = async (data: StorageData): Promise<void> => {
  try {
    const dataToSave: StorageData = {
      ...data,
      version: STORAGE_VERSION,
      lastUpdated: new Date().toISOString(),
    };
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (error) {
    console.error('Error saving data to storage:', error);
    throw new Error('Failed to save data. Please try again.');
  }
};

/**
 * Save baby profile
 */
export const saveBabyProfile = async (profile: BabyProfile): Promise<void> => {
  const data = await loadData();
  data.babyProfile = profile;
  await saveData(data);
};

/**
 * Load baby profile
 */
export const loadBabyProfile = async (): Promise<BabyProfile | null> => {
  const data = await loadData();
  return data.babyProfile || null;
};

/**
 * Save measurement
 */
export const saveMeasurement = async (measurement: GrowthMeasurement): Promise<void> => {
  const data = await loadData();
  
  // Check if measurement already exists (update) or is new (add)
  const existingIndex = data.measurements.findIndex(m => m.id === measurement.id);
  
  if (existingIndex >= 0) {
    data.measurements[existingIndex] = measurement;
  } else {
    data.measurements.push(measurement);
  }
  
  // Sort measurements by date (newest first)
  data.measurements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  await saveData(data);
};

/**
 * Load all measurements
 */
export const loadMeasurements = async (): Promise<GrowthMeasurement[]> => {
  const data = await loadData();
  return data.measurements;
};

/**
 * Delete measurement
 */
export const deleteMeasurement = async (id: string): Promise<void> => {
  const data = await loadData();
  data.measurements = data.measurements.filter(m => m.id !== id);
  await saveData(data);
};

// Duplicate functions removed - using the original implementations above

/**
 * Clear all data (for testing or reset)
 */
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing data:', error);
    throw new Error('Failed to clear data');
  }
};

/**
 * Export data as JSON string
 */
export const exportData = async (): Promise<string> => {
  const data = await loadData();
  return JSON.stringify(data, null, 2);
};

/**
 * Import data from JSON string
 */
export const importData = async (jsonString: string): Promise<void> => {
  try {
    const importedData = JSON.parse(jsonString) as StorageData;
    
    // Basic validation
    if (!importedData.measurements || !Array.isArray(importedData.measurements)) {
      throw new Error('Invalid data format');
    }
    
    await saveData(importedData);
  } catch (error) {
    console.error('Error importing data:', error);
    throw new Error('Invalid data format or corrupted file');
  }
};

/**
 * Data migration for future versions
 */
const migrateData = (oldData: any): StorageData => {
  // For now, just return default data
  // In future versions, implement proper migration logic
  console.log('Migrating data from version:', oldData.version);
  return createDefaultStorageData();
};

/**
 * Check storage health and available space
 */
export const getStorageInfo = async (): Promise<{
  hasData: boolean;
  measurementCount: number;
  lastUpdated: string | null;
}> => {
  try {
    const data = await loadData();
    return {
      hasData: data.measurements.length > 0 || !!data.babyProfile,
      measurementCount: data.measurements.length,
      lastUpdated: data.lastUpdated,
    };
  } catch (error) {
    return {
      hasData: false,
      measurementCount: 0,
      lastUpdated: null,
    };
  }
};

