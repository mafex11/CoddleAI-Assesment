import {
  calculateAgeInDays,
  formatAge,
  convertWeight,
  convertHeight,
  calculatePercentile,
  validateMeasurement,
  getMeasurementTrend,
} from '../utils/calculations';
import { WHO_GROWTH_DATA } from '../data/whoGrowthData';

describe('Calculations', () => {
  describe('calculateAgeInDays', () => {
    it('should calculate age in days correctly', () => {
      const birthDate = '2023-01-01';
      const measurementDate = '2023-01-31';
      const ageInDays = calculateAgeInDays(birthDate, measurementDate);
      expect(ageInDays).toBe(30);
    });

    it('should handle leap years correctly', () => {
      const birthDate = '2020-02-28';
      const measurementDate = '2020-03-01';
      const ageInDays = calculateAgeInDays(birthDate, measurementDate);
      expect(ageInDays).toBe(2); // 2020 is a leap year
    });

    it('should return 0 for invalid dates', () => {
      const ageInDays = calculateAgeInDays('invalid', 'invalid');
      expect(ageInDays).toBe(0);
    });
  });

  describe('formatAge', () => {
    it('should format days correctly', () => {
      expect(formatAge(1)).toBe('1 day');
      expect(formatAge(15)).toBe('15 days');
    });

    it('should format months correctly', () => {
      expect(formatAge(30)).toBe('1m 0d');
      expect(formatAge(45)).toBe('1m 15d');
      expect(formatAge(90)).toBe('2m 29d');
    });

    it('should format years correctly', () => {
      expect(formatAge(365)).toBe('1y 0m');
      expect(formatAge(395)).toBe('1y 1m');
    });

    it('should handle negative values', () => {
      expect(formatAge(-5)).toBe('0 days');
    });
  });

  describe('convertWeight', () => {
    it('should convert kg to lbs correctly', () => {
      expect(convertWeight.kgToLb(1)).toBeCloseTo(2.2, 1);
      expect(convertWeight.kgToLb(4.5)).toBeCloseTo(9.92, 1);
    });

    it('should convert lbs to kg correctly', () => {
      expect(convertWeight.lbToKg(2.2)).toBeCloseTo(1, 1);
      expect(convertWeight.lbToKg(10)).toBeCloseTo(4.54, 1);
    });

    it('should be reversible', () => {
      const originalKg = 3.5;
      const lbs = convertWeight.kgToLb(originalKg);
      const backToKg = convertWeight.lbToKg(lbs);
      expect(backToKg).toBeCloseTo(originalKg, 2);
    });
  });

  describe('convertHeight', () => {
    it('should convert cm to inches correctly', () => {
      expect(convertHeight.cmToIn(2.54)).toBeCloseTo(1, 1);
      expect(convertHeight.cmToIn(50)).toBeCloseTo(19.7, 1);
    });

    it('should convert inches to cm correctly', () => {
      expect(convertHeight.inToCm(1)).toBeCloseTo(2.54, 1);
      expect(convertHeight.inToCm(20)).toBeCloseTo(50.8, 1);
    });

    it('should be reversible', () => {
      const originalCm = 55.5;
      const inches = convertHeight.cmToIn(originalCm);
      const backToCm = convertHeight.inToCm(inches);
      expect(backToCm).toBeCloseTo(originalCm, 1);
    });
  });

  describe('calculatePercentile', () => {
    const maleWeightData = WHO_GROWTH_DATA.male.weight;

    it('should calculate percentile for exact age match', () => {
      // Use birth data (age 0)
      const percentile = calculatePercentile(3.3464, 0, 'weight', 'male', maleWeightData);
      expect(percentile).toBeCloseTo(50, 0); // Should be close to 50th percentile
    });

    it('should handle interpolation between ages', () => {
      // Test age between 0 and 30 days
      const percentile = calculatePercentile(4.0, 15, 'weight', 'male', maleWeightData);
      expect(percentile).toBeGreaterThan(0);
      expect(percentile).toBeLessThan(100);
    });

    it('should return reasonable percentiles for edge cases', () => {
      const lowPercentile = calculatePercentile(2.5, 0, 'weight', 'male', maleWeightData);
      const highPercentile = calculatePercentile(4.5, 0, 'weight', 'male', maleWeightData);
      
      expect(lowPercentile).toBeLessThan(50);
      expect(highPercentile).toBeGreaterThan(50);
    });

    it('should handle errors gracefully', () => {
      const percentile = calculatePercentile(0, 0, 'weight', 'male', []);
      expect(percentile).toBe(50); // Should return median as fallback
    });
  });

  describe('validateMeasurement', () => {
    it('should validate weight correctly', () => {
      expect(validateMeasurement.weight(3.5)).toBe(true);
      expect(validateMeasurement.weight(0)).toBe(false);
      expect(validateMeasurement.weight(-1)).toBe(false);
      expect(validateMeasurement.weight(100)).toBe(false);
    });

    it('should validate height correctly', () => {
      expect(validateMeasurement.height(50)).toBe(true);
      expect(validateMeasurement.height(0)).toBe(false);
      expect(validateMeasurement.height(-1)).toBe(false);
      expect(validateMeasurement.height(300)).toBe(false);
    });

    it('should validate head circumference correctly', () => {
      expect(validateMeasurement.head(35)).toBe(true);
      expect(validateMeasurement.head(0)).toBe(false);
      expect(validateMeasurement.head(-1)).toBe(false);
      expect(validateMeasurement.head(100)).toBe(false);
    });
  });

  describe('getMeasurementTrend', () => {
    it('should return "none" when no previous measurement', () => {
      expect(getMeasurementTrend(5, undefined)).toBe('none');
    });

    it('should return "up" for significant increase', () => {
      expect(getMeasurementTrend(5, 4.5)).toBe('up'); // > 2% increase
    });

    it('should return "down" for significant decrease', () => {
      expect(getMeasurementTrend(4.5, 5)).toBe('down'); // > 2% decrease
    });

    it('should return "stable" for small changes', () => {
      expect(getMeasurementTrend(5, 4.99)).toBe('stable'); // < 2% change
      expect(getMeasurementTrend(5, 5.01)).toBe('stable'); // < 2% change
    });
  });
});

