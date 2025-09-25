import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { BabyProfile, GrowthMeasurement } from '../types';

interface CombinedGrowthChartProps {
  measurements: GrowthMeasurement[];
  babyProfile: BabyProfile;
  height?: number;
}

const CombinedGrowthChart: React.FC<CombinedGrowthChartProps> = ({
  measurements,
  babyProfile,
  height = 300,
}) => {
  const [screenData, setScreenData] = useState(Dimensions.get('window'));

  useEffect(() => {
    const onChange = (result: any) => {
      setScreenData(result.window);
    };

    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription?.remove();
  }, []);

  // Chart configurations for each measurement type
  const chartConfigs = {
    weight: {
      title: 'Weight',
      unit: 'kg',
      color: '#10b981',
      getValue: (m: GrowthMeasurement) => m.weightKg,
    },
    height: {
      title: 'Height',
      unit: 'cm',
      color: '#8b5cf6',
      getValue: (m: GrowthMeasurement) => m.heightCm,
    },
    head: {
      title: 'Head Circumference',
      unit: 'cm',
      color: '#f59e0b',
      getValue: (m: GrowthMeasurement) => m.headCm,
    },
  };

  // Prepare measurement data for chart
  const sortedMeasurements = measurements
    .filter(m => m.weightKg > 0 || m.heightCm > 0 || m.headCm > 0)
    .sort((a, b) => a.ageInDays - b.ageInDays);

  if (sortedMeasurements.length === 0) {
    return (
      <View style={[styles.container, { height }]}>
        <Text style={styles.title}>Growth Overview</Text>
        <View style={styles.emptyChart}>
          <Text style={styles.emptyText}>No data available</Text>
        </View>
      </View>
    );
  }

  // Normalize data for combined display
  const normalizeData = (values: number[]) => {
    const min = Math.min(...values.filter(v => v > 0));
    const max = Math.max(...values.filter(v => v > 0));
    const range = max - min;
    
    if (range === 0) return values.map(() => 50); // If all values are the same
    
    return values.map(v => v > 0 ? ((v - min) / range) * 100 : 0);
  };

  // Get data for each measurement type
  const weightData = sortedMeasurements.map(m => chartConfigs.weight.getValue(m));
  const heightData = sortedMeasurements.map(m => chartConfigs.height.getValue(m));
  const headData = sortedMeasurements.map(m => chartConfigs.head.getValue(m));

  // Normalize all data to 0-100 scale for display
  const normalizedWeight = normalizeData(weightData);
  const normalizedHeight = normalizeData(heightData);
  const normalizedHead = normalizeData(headData);

  // Prepare chart data
  const chartData = {
    labels: sortedMeasurements.map((m, index) => {
      const months = Math.floor(m.ageInDays / 30.44);
      // For small screens or many points, show fewer labels
      if (screenData.width < 350 && sortedMeasurements.length > 6) {
        return index % 2 === 0 ? (months < 12 ? `${months}m` : `${Math.floor(months / 12)}y`) : '';
      }
      return months < 12 ? `${months}m` : `${Math.floor(months / 12)}y`;
    }),
    datasets: [
      // Weight dataset
      {
        data: normalizedWeight,
        color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`, // Green
        strokeWidth: 3,
        withDots: true,
      },
      // Height dataset
      {
        data: normalizedHeight,
        color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`, // Purple
        strokeWidth: 3,
        withDots: true,
      },
      // Head circumference dataset
      {
        data: normalizedHead,
        color: (opacity = 1) => `rgba(245, 158, 11, ${opacity})`, // Orange
        strokeWidth: 3,
        withDots: true,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(102, 126, 234, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
    },
    formatYLabel: (yValue: string) => {
      // Since we're using normalized data, we'll show relative scale
      return Math.round(parseFloat(yValue)).toString();
    },
  };

  // Chart width calculation
  const chartPadding = 32;
  const availableWidth = screenData.width - chartPadding;
  const minChartWidth = Math.max(availableWidth, 280);
  const spacingPerPoint = 50;
  const optimalWidth = Math.max(minChartWidth, chartData.labels.length * spacingPerPoint);

  // Get latest values for display
  const latestMeasurement = sortedMeasurements[sortedMeasurements.length - 1];

  return (
    <View style={[styles.container, { height }]}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Growth Overview</Text>
        <View style={styles.latestValues}>
          <View style={styles.valueRow}>
            <View style={[styles.colorDot, { backgroundColor: '#10b981' }]} />
            <Text style={styles.valueText}>
              {latestMeasurement.weightKg.toFixed(2)} kg
            </Text>
          </View>
          <View style={styles.valueRow}>
            <View style={[styles.colorDot, { backgroundColor: '#8b5cf6' }]} />
            <Text style={styles.valueText}>
              {latestMeasurement.heightCm.toFixed(1)} cm
            </Text>
          </View>
          <View style={styles.valueRow}>
            <View style={[styles.colorDot, { backgroundColor: '#f59e0b' }]} />
            <Text style={styles.valueText}>
              {latestMeasurement.headCm.toFixed(1)} cm
            </Text>
          </View>
        </View>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <LineChart
          data={chartData}
          width={optimalWidth}
          height={Math.max(height - 100, 160)}
          chartConfig={chartConfig}
          bezier
          style={{
            marginVertical: 4,
            borderRadius: 16,
          }}
          withInnerLines={false}
          withOuterLines={true}
          withVerticalLines={chartData.labels.length <= 8}
          withHorizontalLines={true}
          withDots={true}
          withShadow={false}
          fromZero={false}
          yAxisInterval={1}
          segments={3}
        />
      </ScrollView>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendLine, { backgroundColor: '#10b981' }]} />
            <Text style={styles.legendText}>Weight (kg)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendLine, { backgroundColor: '#8b5cf6' }]} />
            <Text style={styles.legendText}>Height (cm)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendLine, { backgroundColor: '#f59e0b' }]} />
            <Text style={styles.legendText}>Head (cm)</Text>
          </View>
        </View>
        <Text style={styles.legendNote}>
          Note: Values are normalized for combined display
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 200,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    minWidth: 100,
  },
  latestValues: {
    alignItems: 'flex-end',
    flex: 1,
    minWidth: 120,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  valueText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  scrollViewContent: {
    paddingRight: 16,
  },
  emptyChart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  legend: {
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 8,
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 2,
  },
  legendLine: {
    width: 16,
    height: 3,
    marginRight: 4,
    borderRadius: 1.5,
  },
  legendText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  legendNote: {
    fontSize: 9,
    color: '#888',
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
  },
});

export default CombinedGrowthChart;
