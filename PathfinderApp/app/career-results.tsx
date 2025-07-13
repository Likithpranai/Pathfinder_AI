import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { VictoryArea, VictoryChart, VictoryPolarAxis, VictoryTheme } from 'victory-native';
import { G, Polygon } from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');

const PolygonGrid = (props) => {
  const { cx, cy, r, tickCount } = props;
  const levelCount = 5; // Number of grid rings (20%, 40%, etc.)
  const angularGap = 360 / tickCount;
  const grids = [];

  for (let level = 1; level <= levelCount; level++) {
    const scale = level / levelCount;
    const levelRadius = r * scale;
    const pts = [];
    for (let i = 0; i < tickCount; i++) {
      const angle_deg = angularGap * i - 90; // Adjust to start from top
      const angle_rad = (Math.PI / 180) * angle_deg;
      const pointX = cx + levelRadius * Math.cos(angle_rad);
      const pointY = cy + levelRadius * Math.sin(angle_rad);
      pts.push(`${pointX},${pointY}`);
    }
    grids.push(
      <Polygon
        key={level}
        points={pts.join(' ')}
        fill="none"
        stroke="lightgrey"
        strokeWidth={1}
      />
    );
  }

  return <G>{grids}</G>;
};

const PersonalityScreen = () => {
  const radarData = [
    { x: 'E', y: 20 },
    { x: 'N', y: 60 },
    { x: 'J', y: 40 },
    { x: 'S', y: 20 },
    { x: 'F', y: 40 },
    { x: 'P', y: 80 },
    { x: 'E', y: 20 }, // Close the polygon
  ];

  const labels = ['E', 'N', 'J', 'S', 'F', 'P'];

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.greeting}>Hello Lucia Limonti</Text>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }} // Replace with actual photo URI
          style={styles.profilePic}
        />
        <Text style={styles.typeLabel}>You are an:</Text>
        <Text style={styles.type}>INFP</Text>
        <View style={styles.tagsContainer}>
          <View style={styles.tag}><Text style={styles.tagText}>The Philosopher</Text></View>
          <View style={styles.tag}><Text style={styles.tagText}>Idealist</Text></View>
          <View style={styles.tag}><Text style={styles.tagText}>Healer</Text></View>
        </View>
        <Text style={styles.description}>
          INFPs are introspective, creative individuals who value deep connections and meaningful relationships. They are compassionate, open-minded, and have a strong sense of personal values.
        </Text>
      </View>
      <Text style={styles.traitsTitle}>Your Traits</Text>
      <View style={styles.chartContainer}>
        <View style={styles.scale}>
          <Text style={styles.scaleText}>100%</Text>
          <Text style={styles.scaleText}>80%</Text>
          <Text style={styles.scaleText}>60%</Text>
          <Text style={styles.scaleText}>40%</Text>
          <Text style={styles.scaleText}>20%</Text>
        </View>
        <VictoryChart
          polar
          theme={VictoryTheme.material}
          domain={{ y: [0, 100] }}
          width={screenWidth - 80}
          height={250}
          style={{ parent: { marginLeft: 20 } }}
        >
          <VictoryPolarAxis
            tickValues={labels}
            tickCount={6}
            style={{
              axis: { stroke: 'none' },
              grid: { stroke: 'grey', strokeWidth: 0.5 },
              tickLabels: { fontSize: 10, padding: 16 },
            }}
            circularAxisComponent={<PolygonGrid />}
          />
          <VictoryArea
            data={radarData}
            polar
            interpolation="linear"
            style={{
              data: { fill: '#add8e6', opacity: 0.7, stroke: '#add8e6', strokeWidth: 2 },
            }}
          />
        </VictoryChart>
      </View>
      <View style={styles.bottomNav}>
        <Text style={styles.navItem}>🏠</Text>
        <Text style={styles.navItem}>👤</Text>
        <Text style={styles.navItem}>👥</Text>
        <Text style={styles.navItem}>⚙️</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 50 },
  card: { backgroundColor: '#e0f7fa', padding: 20, marginHorizontal: 10, borderRadius: 10, alignItems: 'center' },
  greeting: { fontSize: 18, fontWeight: 'bold' },
  profilePic: { width: 80, height: 80, borderRadius: 40, marginVertical: 10 },
  typeLabel: { fontSize: 16 },
  type: { fontSize: 32, color: '#00bfff', fontWeight: 'bold' },
  tagsContainer: { flexDirection: 'row', marginVertical: 10 },
  tag: { backgroundColor: '#f0f0f0', padding: 5, borderRadius: 5, marginHorizontal: 5 },
  tagText: { fontSize: 14 },
  description: { fontSize: 14, textAlign: 'center', marginVertical: 10 },
  traitsTitle: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
  chartContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  scale: { alignItems: 'flex-end', marginRight: 5 },
  scaleText: { fontSize: 12, marginBottom: 10 },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', padding: 10, borderTopWidth: 1, borderTopColor: '#ccc', position: 'absolute', bottom: 0, width: '100%' },
  navItem: { fontSize: 24 },
});

export default PersonalityScreen;
