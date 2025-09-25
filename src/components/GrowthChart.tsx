import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { BabyProfile, GrowthMeasurement, MeasurementType } from '../types';
import { WHO_GROWTH_DATA } from '../data/whoGrowthData';
import { formatAge, calculatePercentile } from '../utils/calculations';

interface GrowthChartProps {
  measurements: GrowthMeasurement[];
  babyProfile: BabyProfile;
  type: MeasurementType;
  height?: number;
  showPercentiles?: boolean;
}

const GrowthChart: React.FC<GrowthChartProps> = ({
  measurements,
  babyProfile,
  type,
  height = 300,
  showPercentiles = false,
}) => {
  const [screenData, setScreenData] = useState(Dimensions.get('window'));

  useEffect(() => {
    const onChange = (result: any) => {
      setScreenData(result.window);
    };

    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription?.remove();
  }, []);
  const getChartConfig = () => {
    switch (type) {
      case 'weight':
        return {
          title: 'Weight',
          unit: 'kg',
          color: '#10b981',
          getValue: (m: GrowthMeasurement) => m.weightKg,
          whoData: WHO_GROWTH_DATA[babyProfile.gender].weight,
        };
      case 'height':
        return {
          title: 'Height',
          unit: 'cm',
          color: '#8b5cf6',
          getValue: (m: GrowthMeasurement) => m.heightCm,
          whoData: WHO_GROWTH_DATA[babyProfile.gender].height,
        };
      case 'head':
        return {
          title: 'Head Circumference',
          unit: 'cm',
          color: '#f59e0b',
          getValue: (m: GrowthMeasurement) => m.headCm,
          whoData: WHO_GROWTH_DATA[babyProfile.gender].head,
        };
    }
  };

  const config = getChartConfig();

  // Prepare measurement data for chart
  const sortedMeasurements = measurements
    .filter(m => config.getValue(m) > 0)
    .sort((a, b) => a.ageInDays - b.ageInDays);

  if (sortedMeasurements.length === 0) {
    return (
      <View style={[styles.container, { height }]}>
        <Text style={styles.title}>{config.title}</Text>
        <View style={styles.emptyChart}>
          <Text style={styles.emptyText}>No data available</Text>
        </View>
      </View>
    );
  }

  // Determine if this is an overview chart (needs to be defined early)
  const isOverviewHeight = height < 300; // Consider it overview if height is less than 300

  // Generate percenutile data for the same age points as measurements
  const generatePercentileData = () => {
    if (!showPercentiles || sortedMeasurements.length === 0) return [];
    
    const whoData = config.whoData.sort((a, b) => a.ageInDays - b.ageInDays);
    const percentileValues: number[] = [];
    
    sortedMeasurements.forEach(measurement => {
      const age = measurement.ageInDays;
      
      // Find WHO data for interpolation
      let lowerIndex = 0;
      let upperIndex = whoData.length - 1;
      
      for (let i = 0; i < whoData.length - 1; i++) {
        if (age >= whoData[i].ageInDays && age <= whoData[i + 1].ageInDays) {
          lowerIndex = i;
          upperIndex = i + 1;
          break;
        }
      }
      
      if (age <= whoData[0].ageInDays) {
        upperIndex = lowerIndex = 0;
      } else if (age >= whoData[whoData.length - 1].ageInDays) {
        upperIndex = lowerIndex = whoData.length - 1;
      }
      
      const lower = whoData[lowerIndex];
      const upper = whoData[upperIndex];
      
      let M;
      if (lowerIndex === upperIndex) {
        M = lower.M;
      } else {
        const ratio = (age - lower.ageInDays) / (upper.ageInDays - lower.ageInDays);
        M = lower.M + ratio * (upper.M - lower.M);
      }
      
      percentileValues.push(M);
    });
    
    return percentileValues;
  };

  const percentileData = generatePercentileData();

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
      // Add percentile curve first (background)
      ...(showPercentiles && percentileData.length > 0 ? [
        {
          data: percentileData,
          color: (opacity = 1) => `rgba(128, 128, 128, ${opacity * 0.6})`,
          strokeWidth: 2,
          withDots: false,
          strokeDashArray: [5, 5], // Dashed line
        }
      ] : []),
      // Main measurement data (foreground)
      {
        data: sortedMeasurements.map(m => config.getValue(m)),
        color: (opacity = 1) => config.color + Math.round(opacity * 255).toString(16).padStart(2, '0'),
        strokeWidth: 3,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: type === 'weight' ? 2 : 1,
    color: (opacity = 1) => `rgba(102, 126, 234, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: isOverviewHeight ? '3' : '4',
      strokeWidth: '2',
      stroke: config.color,
    },
    formatYLabel: (yValue: string) => {
      const value = parseFloat(yValue);
      if (screenData.width < 350) {
        return type === 'weight' ? value.toFixed(1) : Math.round(value).toString();
      }
      return type === 'weight' ? value.toFixed(2) : value.toFixed(1);
    },
  };

  // Chart width calculation
  const chartPadding = 32;
  const availableWidth = screenData.width - chartPadding;
  const minChartWidth = Math.max(availableWidth, isOverviewHeight ? 250 : 280);
  const spacingPerPoint = isOverviewHeight ? 40 : 50;
  const optimalWidth = Math.max(minChartWidth, chartData.labels.length * spacingPerPoint);
  const latestValue = sortedMeasurements[sortedMeasurements.length - 1];

  return (
    <View style={[styles.container, { height }]}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{config.title}</Text>
        <View style={styles.latestValue}>
          <Text style={[styles.latestValueText, { color: config.color }]}>
            {config.getValue(latestValue).toFixed(type === 'weight' ? 2 : 1)} {config.unit}
          </Text>
          {latestValue.weightPercentile && type === 'weight' && (
            <Text style={styles.percentileText}>
              {latestValue.weightPercentile.toFixed(1)}th percentile
            </Text>
          )}
          {latestValue.heightPercentile && type === 'height' && (
            <Text style={styles.percentileText}>
              {latestValue.heightPercentile.toFixed(1)}th percentile
            </Text>
          )}
          {latestValue.headPercentile && type === 'head' && (
            <Text style={styles.percentileText}>
              {latestValue.headPercentile.toFixed(1)}th percentile
            </Text>
          )}
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
          height={Math.max(height - 60, 160)}
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
          segments={isOverviewHeight ? 3 : (screenData.width < 350 ? 3 : 4)}
        />
      </ScrollView>

      {showPercentiles && (
        <View style={styles.legend}>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendLine, { backgroundColor: '#808080' }]} />
              <Text style={styles.legendText}>50th percentile (WHO median)</Text>
            </View>
          </View>
          <Text style={styles.legendNote}>
            WHO Growth Standards (0-24 months){'\n'}
            Normal range: 10th-90th percentile
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 8,
    padding: 12, // Reduced padding for small screens
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 200, // Flexible minimum height
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Changed to flex-start for better alignment
    marginBottom: 8,
    flexWrap: 'wrap', // Allow wrapping on very small screens
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    minWidth: 100, // Ensure minimum width
  },
  latestValue: {
    alignItems: 'flex-end',
    flex: 1,
    minWidth: 120, // Ensure minimum width for values
  },
  latestValueText: {
    fontSize: 16, // Slightly smaller for mobile
    fontWeight: 'bold',
    textAlign: 'right',
  },
  percentileText: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
    textAlign: 'right',
  },
  scrollViewContent: {
    paddingRight: 16, // Add padding to the right for better scrolling
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
    alignItems: 'center',
    marginVertical: 2,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  legendLine: {
    width: 20,
    height: 2,
    marginRight: 6,
  },
  legendText: {
    fontSize: 10,
    color: '#666',
  },
  legendNote: {
    fontSize: 9,
    color: '#888',
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
  },
});

export default GrowthChart;

