import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BabyProfile, GrowthMeasurement } from '../types';
import { formatAge, calculateAgeInDays } from '../utils/calculations';
import Header from './Header';
import MeasurementForm from './MeasurementForm';
import GrowthChart from './GrowthChart';
import CombinedGrowthChart from './CombinedGrowthChart';
import MeasurementHistory from './MeasurementHistory';

interface MainScreenProps {
  babyProfile: BabyProfile;
  measurements: GrowthMeasurement[];
  onMeasurementsUpdated: () => void;
  onBabyProfileUpdated: (profile: BabyProfile) => void;
}

type TabType = 'overview' | 'charts' | 'history';

const MainScreen: React.FC<MainScreenProps> = ({
  babyProfile,
  measurements,
  onMeasurementsUpdated,
  onBabyProfileUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showMeasurementForm, setShowMeasurementForm] = useState(false);

  const currentAge = formatAge(
    calculateAgeInDays(babyProfile.birthDate, new Date().toISOString())
  );

  const latestMeasurement = measurements.length > 0 ? measurements[0] : null;

  const handleAddMeasurement = () => {
    setShowMeasurementForm(true);
  };

  const handleMeasurementSaved = () => {
    setShowMeasurementForm(false);
    onMeasurementsUpdated();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
            {/* Stats Cards */}
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Ionicons name="calendar" size={24} color="#667eea" />
                <Text style={styles.statLabel}>Current Age</Text>
                <Text style={styles.statValue}>{currentAge}</Text>
              </View>

              <View style={styles.statCard}>
                <Ionicons name="fitness" size={24} color="#10b981" />
                <Text style={styles.statLabel}>Measurements</Text>
                <Text style={styles.statValue}>{measurements.length}</Text>
              </View>
            </View>

            {/* Latest Measurement */}
            {latestMeasurement && (
              <View style={styles.latestMeasurement}>
                <Text style={styles.sectionTitle}>Latest Measurement</Text>
                <View style={styles.measurementCard}>
                  <View style={styles.measurementRow}>
                    <Text style={styles.measurementLabel}>Weight:</Text>
                    <Text style={styles.measurementValue}>
                      {latestMeasurement.weightKg.toFixed(2)} kg
                    </Text>
                    {latestMeasurement.weightPercentile && (
                      <Text style={styles.percentile}>
                        {latestMeasurement.weightPercentile.toFixed(1)}th percentile
                      </Text>
                    )}
                  </View>
                  <View style={styles.measurementRow}>
                    <Text style={styles.measurementLabel}>Height:</Text>
                    <Text style={styles.measurementValue}>
                      {latestMeasurement.heightCm.toFixed(1)} cm
                    </Text>
                    {latestMeasurement.heightPercentile && (
                      <Text style={styles.percentile}>
                        {latestMeasurement.heightPercentile.toFixed(1)}th percentile
                      </Text>
                    )}
                  </View>
                  <View style={styles.measurementRow}>
                    <Text style={styles.measurementLabel}>Head:</Text>
                    <Text style={styles.measurementValue}>
                      {latestMeasurement.headCm.toFixed(1)} cm
                    </Text>
                    {latestMeasurement.headPercentile && (
                      <Text style={styles.percentile}>
                        {latestMeasurement.headPercentile.toFixed(1)}th percentile
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            )}

            {/* Quick Charts */}
            {measurements.length > 0 && (
              <View style={styles.quickCharts}>
                <View style={styles.overviewChartContainer}>
                  <CombinedGrowthChart
                    measurements={measurements}
                    babyProfile={babyProfile}
                    height={320}
                  />
                </View>
              </View>
            )}

            {/* Empty State */}
            {measurements.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="bar-chart" size={64} color="#ccc" />
                <Text style={styles.emptyStateTitle}>No measurements yet</Text>
                <Text style={styles.emptyStateText}>
                  Start tracking {babyProfile.name}'s growth by adding their first measurement.
                </Text>
                <TouchableOpacity style={styles.emptyStateButton} onPress={handleAddMeasurement}>
                  <Text style={styles.emptyStateButtonText}>Add First Measurement</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        );

      case 'charts':
        return (
          <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
            {measurements.length > 0 ? (
              <>
                <GrowthChart
                  measurements={measurements}
                  babyProfile={babyProfile}
                  type="weight"
                  height={320} // Increased height for better chart visibility
                  showPercentiles={true}
                />
                <GrowthChart
                  measurements={measurements}
                  babyProfile={babyProfile}
                  type="height"
                  height={320}
                  showPercentiles={true}
                />
                <GrowthChart
                  measurements={measurements}
                  babyProfile={babyProfile}
                  type="head"
                  height={320}
                  showPercentiles={true}
                />
              </>
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="bar-chart" size={64} color="#ccc" />
                <Text style={styles.emptyStateTitle}>No data to chart</Text>
                <Text style={styles.emptyStateText}>
                  Add some measurements to see beautiful growth charts.
                </Text>
              </View>
            )}
          </ScrollView>
        );

      case 'history':
        return (
          <MeasurementHistory
            measurements={measurements}
            babyProfile={babyProfile}
            onMeasurementsUpdated={onMeasurementsUpdated}
          />
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Header
        babyProfile={babyProfile}
        onAddMeasurement={handleAddMeasurement}
        onProfileUpdated={onBabyProfileUpdated}
      />

      {/* Tab Navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Ionicons
            name="home"
            size={20}
            color={activeTab === 'overview' ? '#667eea' : '#666'}
          />
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
            Overview
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'charts' && styles.activeTab]}
          onPress={() => setActiveTab('charts')}
        >
          <Ionicons
            name="bar-chart"
            size={20}
            color={activeTab === 'charts' ? '#667eea' : '#666'}
          />
          <Text style={[styles.tabText, activeTab === 'charts' && styles.activeTabText]}>
            Charts
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Ionicons
            name="list"
            size={20}
            color={activeTab === 'history' ? '#667eea' : '#666'}
          />
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            History
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {renderTabContent()}

      {/* Measurement Form Modal */}
      {showMeasurementForm && (
        <MeasurementForm
          babyProfile={babyProfile}
          onSave={handleMeasurementSaved}
          onCancel={() => setShowMeasurementForm(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#667eea',
  },
  tabText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#667eea',
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  latestMeasurement: {
    padding: 16,
  },
  measurementCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  measurementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  measurementLabel: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  measurementValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  percentile: {
    fontSize: 14,
    color: '#667eea',
    flex: 1,
    textAlign: 'right',
  },
  quickCharts: {
    padding: 12, // Reduced padding for mobile
  },
  overviewChartContainer: {
    marginHorizontal: 4,
    
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  emptyStateButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MainScreen;

