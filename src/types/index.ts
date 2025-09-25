export interface GrowthMeasurement {
  id: string;
  date: string;               // ISO date string (UTC 00:00)
  ageInDays: number;          // derived from birthDate -> date
  weightKg: number;           // stored in SI units
  heightCm: number;           // stored in SI units
  headCm: number;             // stored in SI units
  weightPercentile?: number;  // 0–100
  heightPercentile?: number;
  headPercentile?: number;
  notes?: string;
}

export interface BabyProfile {
  id: string;
  name: string;
  birthDate: string;          // ISO date string
  gender: 'male' | 'female';
  birthWeight?: number;       // kg
  birthHeight?: number;       // cm
  birthHead?: number;         // cm
}

export interface StorageData {
  version: string;
  babyProfile?: BabyProfile;
  measurements: GrowthMeasurement[];
  lastUpdated: string;
}

export interface WHOGrowthData {
  ageInDays: number;
  L: number;  // Lambda (power transformation)
  M: number;  // Mu (median)
  S: number;  // Sigma (coefficient of variation)
}

export interface WHOReference {
  male: {
    weight: WHOGrowthData[];
    height: WHOGrowthData[];
    head: WHOGrowthData[];
  };
  female: {
    weight: WHOGrowthData[];
    height: WHOGrowthData[];
    head: WHOGrowthData[];
  };
}

export type MeasurementType = 'weight' | 'height' | 'head';
export type Unit = 'metric' | 'imperial';

export interface FormData {
  date: string;
  weightKg: string;
  weightLb: string;
  heightCm: string;
  heightIn: string;
  headCm: string;
  headIn: string;
  notes: string;
  unit: Unit;
}

