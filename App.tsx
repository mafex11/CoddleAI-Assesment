import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  SafeAreaView,
  Alert,
} from 'react-native';
import { BabyProfile, GrowthMeasurement } from './src/types';
import { loadBabyProfile, loadMeasurements } from './src/utils/storage';
import BabySetup from './src/components/BabySetup';
import MainScreen from './src/components/MainScreen';
import LoadingScreen from './src/components/LoadingScreen';

export default function App() {
  const [babyProfile, setBabyProfile] = useState<BabyProfile | null>(null);
  const [measurements, setMeasurements] = useState<GrowthMeasurement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [profile, measurementData] = await Promise.all([
        loadBabyProfile(),
        loadMeasurements(),
      ]);

      setBabyProfile(profile);
      setMeasurements(measurementData);
    } catch (error) {
      console.error('Error loading initial data:', error);
      Alert.alert(
        'Error',
        'Failed to load data. The app will start fresh.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBabyProfileCreated = (profile: BabyProfile) => {
    setBabyProfile(profile);
  };

  const handleMeasurementsUpdated = async () => {
    try {
      console.log('Refreshing measurements...');
      const updatedMeasurements = await loadMeasurements();
      console.log('Loaded measurements count:', updatedMeasurements.length);
      setMeasurements(updatedMeasurements);
      console.log('Measurements state updated');
    } catch (error) {
      console.error('Error reloading measurements:', error);
      Alert.alert('Error', 'Failed to refresh measurements');
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!babyProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <BabySetup onBabyCreated={handleBabyProfileCreated} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <MainScreen
        babyProfile={babyProfile}
        measurements={measurements}
        onMeasurementsUpdated={handleMeasurementsUpdated}
        onBabyProfileUpdated={handleBabyProfileCreated}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

