import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BabyProfile, GrowthMeasurement } from '../types';
import { deleteMeasurement } from '../utils/storage';
import { formatAge, formatDate, getMeasurementTrend } from '../utils/calculations';
import MeasurementForm from './MeasurementForm';

interface MeasurementHistoryProps {
  measurements: GrowthMeasurement[];
  babyProfile: BabyProfile;
  onMeasurementsUpdated: () => void;
}

const MeasurementHistory: React.FC<MeasurementHistoryProps> = ({
  measurements,
  babyProfile,
  onMeasurementsUpdated,
}) => {
  const [editingMeasurement, setEditingMeasurement] = useState<GrowthMeasurement | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sortedMeasurements = [...measurements].sort((a, b) => {
    const aTime = new Date(a.date).getTime();
    const bTime = new Date(b.date).getTime();
    return sortOrder === 'desc' ? bTime - aTime : aTime - bTime;
  });

  const handleDeleteMeasurement = (measurement: GrowthMeasurement) => {
    Alert.alert(
      'Delete Measurement',
      `Are you sure you want to delete the measurement from ${formatDate(measurement.date)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Deleting measurement with ID:', measurement.id);
              await deleteMeasurement(measurement.id);
              console.log('Measurement deleted successfully');
              onMeasurementsUpdated();
              console.log('Calling onMeasurementsUpdated...');
              Alert.alert('Success', 'Measurement deleted successfully');
            } catch (error) {
              console.error('Error deleting measurement:', error);
              Alert.alert('Error', 'Failed to delete measurement: ' + error.message);
            }
          },
        },
      ]
    );
  };

  const handleEditMeasurement = (measurement: GrowthMeasurement) => {
    setEditingMeasurement(measurement);
  };

  const handleMeasurementSaved = () => {
    setEditingMeasurement(null);
    onMeasurementsUpdated();
  };

  const getTrendIcon = (current: number, previous: number | undefined, type: string) => {
    if (!previous) return null;
    
    const trend = getMeasurementTrend(current, previous);
    const color = trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : '#6b7280';
    const iconName = trend === 'up' ? 'trending-up' : trend === 'down' ? 'trending-down' : 'remove';
    
    return <Ionicons name={iconName} size={16} color={color} />;
  };

  const renderMeasurementItem = ({ item, index }: { item: GrowthMeasurement; index: number }) => {
    const previousMeasurement = index < sortedMeasurements.length - 1 ? sortedMeasurements[index + 1] : undefined;
    
    return (
      <View style={styles.measurementCard}>
        <View style={styles.measurementHeader}>
          <View>
            <Text style={styles.measurementDate}>{formatDate(item.date)}</Text>
            <Text style={styles.measurementAge}>
              Age: {formatAge(item.ageInDays)}
            </Text>
          </View>
          <View style={styles.measurementActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleEditMeasurement(item)}
            >
              <Ionicons name="pencil" size={18} color="#667eea" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDeleteMeasurement(item)}
            >
              <Ionicons name="trash" size={18} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.measurementData}>
          {/* Weight */}
          <View style={styles.measurementRow}>
            <View style={styles.measurementInfo}>
              <Ionicons name="fitness" size={16} color="#10b981" />
              <Text style={styles.measurementLabel}>Weight</Text>
            </View>
            <View style={styles.measurementValueContainer}>
              <Text style={styles.measurementValue}>
                {item.weightKg.toFixed(2)} kg
              </Text>
              {getTrendIcon(
                item.weightKg,
                previousMeasurement?.weightKg,
                'weight'
              )}
            </View>
            {item.weightPercentile && (
              <Text style={styles.percentile}>
                {item.weightPercentile.toFixed(1)}th
              </Text>
            )}
          </View>

          {/* Height */}
          <View style={styles.measurementRow}>
            <View style={styles.measurementInfo}>
              <Ionicons name="resize" size={16} color="#8b5cf6" />
              <Text style={styles.measurementLabel}>Height</Text>
            </View>
            <View style={styles.measurementValueContainer}>
              <Text style={styles.measurementValue}>
                {item.heightCm.toFixed(1)} cm
              </Text>
              {getTrendIcon(
                item.heightCm,
                previousMeasurement?.heightCm,
                'height'
              )}
            </View>
            {item.heightPercentile && (
              <Text style={styles.percentile}>
                {item.heightPercentile.toFixed(1)}th
              </Text>
            )}
          </View>

          {/* Head Circumference */}
          <View style={styles.measurementRow}>
            <View style={styles.measurementInfo}>
              <Ionicons name="ellipse-outline" size={16} color="#f59e0b" />
              <Text style={styles.measurementLabel}>Head</Text>
            </View>
            <View style={styles.measurementValueContainer}>
              <Text style={styles.measurementValue}>
                {item.headCm.toFixed(1)} cm
              </Text>
              {getTrendIcon(
                item.headCm,
                previousMeasurement?.headCm,
                'head'
              )}
            </View>
            {item.headPercentile && (
              <Text style={styles.percentile}>
                {item.headPercentile.toFixed(1)}th
              </Text>
            )}
          </View>
        </View>

        {item.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>Notes:</Text>
            <Text style={styles.notesText}>{item.notes}</Text>
          </View>
        )}
      </View>
    );
  };

  if (measurements.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="document-text-outline" size={64} color="#ccc" />
        <Text style={styles.emptyTitle}>No measurements yet</Text>
        <Text style={styles.emptyText}>
          Measurements will appear here once you start tracking {babyProfile.name}'s growth.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Measurement History ({measurements.length} records)
        </Text>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
        >
          <Ionicons
            name={sortOrder === 'desc' ? 'arrow-down' : 'arrow-up'}
            size={16}
            color="#667eea"
          />
          <Text style={styles.sortText}>
            {sortOrder === 'desc' ? 'Newest first' : 'Oldest first'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={sortedMeasurements}
        renderItem={renderMeasurementItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

      {editingMeasurement && (
        <MeasurementForm
          babyProfile={babyProfile}
          measurement={editingMeasurement}
          onSave={handleMeasurementSaved}
          onCancel={() => setEditingMeasurement(null)}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortText: {
    fontSize: 14,
    color: '#667eea',
    marginLeft: 4,
  },
  listContent: {
    padding: 16,
  },
  measurementCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  measurementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  measurementDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  measurementAge: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  measurementActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  measurementData: {
    gap: 8,
  },
  measurementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  measurementInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  measurementLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  measurementValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  measurementValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginRight: 4,
  },
  percentile: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '500',
    width: 40,
    textAlign: 'right',
  },
  notesContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default MeasurementHistory;

