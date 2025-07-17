import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const {width, height} = Dimensions.get('window');

const LoadingScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.appName}>🥇 함히보까</Text>
        <Text style={styles.subtitle}>
          칭찬 스티커로 목표를 달성해보세요 ✨
        </Text>
      </View>

      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B9D" />
        <Text style={styles.loadingText}>잠깐만 기다려주세요... 💫</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F7',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF6B9D',
    marginBottom: 8,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E44AD',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#8E44AD',
    marginTop: 16,
    fontWeight: '500',
  },
});

export default LoadingScreen;
