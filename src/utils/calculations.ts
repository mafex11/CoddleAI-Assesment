import { differenceInDays, parseISO, format, isValid } from 'date-fns';
import { WHOGrowthData, MeasurementType } from '../types';

/**
 * Calculate age in days from birth date to measurement date
 */
export const calculateAgeInDays = (birthDate: string, measurementDate: string): number => {
  try {
    const birth = parseISO(birthDate);
    const measurement = parseISO(measurementDate);
    
    if (!isValid(birth) || !isValid(measurement)) {
      throw new Error('Invalid date format');
    }
    
    return differenceInDays(measurement, birth);
  } catch (error) {
    console.error('Error calculating age in days:', error);
    return 0;
  }
};

/**
 * Format age in days to human readable format
 */
export const formatAge = (ageInDays: number): string => {
  if (ageInDays < 0) return '0 days';
  
  if (ageInDays < 30) {
    return `${ageInDays} day${ageInDays === 1 ? '' : 's'}`;
  }
  
  const months = Math.floor(ageInDays / 30.44); // Average days per month
  const remainingDays = Math.floor(ageInDays % 30.44);
  
  if (months < 12) {
    if (remainingDays === 0) {
      return `${months} month${months === 1 ? '' : 's'}`;
    }
    return `${months}m ${remainingDays}d`;
  }
  
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (remainingMonths === 0) {
    return `${years} year${years === 1 ? '' : 's'}`;
  }
  return `${years}y ${remainingMonths}m`;
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return dateString;
    return format(date, 'MMM dd, yyyy');
  } catch (error) {
    return dateString;
  }
};

/**
 * Convert weight between units
 */
export const convertWeight = {
  kgToLb: (kg: number): number => Math.round((kg * 2.20462) * 100) / 100,
  lbToKg: (lb: number): number => Math.round((lb / 2.20462) * 1000) / 1000,
};

/**
 * Convert height between units
 */
export const convertHeight = {
  cmToIn: (cm: number): number => Math.round((cm / 2.54) * 10) / 10,
  inToCm: (inches: number): number => Math.round((inches * 2.54) * 10) / 10,
};

/**
 * Calculate percentile using WHO LMS method
 * Based on WHO growth standards using L (lambda), M (mu), S (sigma) parameters
 */
export const calculatePercentile = (
  value: number,
  ageInDays: number,
  measurementType: MeasurementType,
  gender: 'male' | 'female',
  whoData: WHOGrowthData[]
): number => {
  try {
    // Find the closest age data points for interpolation
    const sortedData = whoData.sort((a, b) => a.ageInDays - b.ageInDays);
    
    let lowerIndex = 0;
    let upperIndex = sortedData.length - 1;
    
    // Find the bracketing indices
    for (let i = 0; i < sortedData.length - 1; i++) {
      if (ageInDays >= sortedData[i].ageInDays && ageInDays <= sortedData[i + 1].ageInDays) {
        lowerIndex = i;
        upperIndex = i + 1;
        break;
      }
    }
    
    // Handle edge cases
    if (ageInDays <= sortedData[0].ageInDays) {
      upperIndex = lowerIndex = 0;
    } else if (ageInDays >= sortedData[sortedData.length - 1].ageInDays) {
      upperIndex = lowerIndex = sortedData.length - 1;
    }
    
    const lower = sortedData[lowerIndex];
    const upper = sortedData[upperIndex];
    
    // Linear interpolation of LMS parameters
    let L, M, S;
    if (lowerIndex === upperIndex) {
      L = lower.L;
      M = lower.M;
      S = lower.S;
    } else {
      const ratio = (ageInDays - lower.ageInDays) / (upper.ageInDays - lower.ageInDays);
      L = lower.L + ratio * (upper.L - lower.L);
      M = lower.M + ratio * (upper.M - lower.M);
      S = lower.S + ratio * (upper.S - lower.S);
    }
    
    // Calculate Z-score using LMS method
    let zScore: number;
    if (L !== 0) {
      zScore = (Math.pow(value / M, L) - 1) / (L * S);
    } else {
      zScore = Math.log(value / M) / S;
    }
    
    // Convert Z-score to percentile using normal distribution approximation
    const percentile = normalCDF(zScore) * 100;
    
    // Clamp to reasonable bounds
    return Math.max(0.1, Math.min(99.9, Math.round(percentile * 10) / 10));
  } catch (error) {
    console.error('Error calculating percentile:', error);
    return 50; // Return median as fallback
  }
};

/**
 * Normal cumulative distribution function approximation
 */
function normalCDF(z: number): number {
  // Abramowitz and Stegun approximation
  const t = 1.0 / (1.0 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2.0);
  let prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  
  if (z > 0.0) {
    prob = 1.0 - prob;
  }
  
  return prob;
}

/**
 * Generate unique ID
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

/**
 * Validate measurement values
 */
export const validateMeasurement = {
  weight: (kg: number): boolean => kg > 0 && kg < 50, // 0-50kg reasonable range
  height: (cm: number): boolean => cm > 0 && cm < 200, // 0-200cm reasonable range
  head: (cm: number): boolean => cm > 0 && cm < 80, // 0-80cm reasonable range
};

/**
 * Get measurement trend
 */
export const getMeasurementTrend = (
  current: number,
  previous: number | undefined
): 'up' | 'down' | 'stable' | 'none' => {
  if (previous === undefined) return 'none';
  
  const percentChange = ((current - previous) / previous) * 100;
  
  if (percentChange > 2) return 'up';
  if (percentChange < -2) return 'down';
  return 'stable';
};

