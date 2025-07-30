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
        <ActivityIndicator size="large" color="#4ECDC4" />
        <Text style={styles.loadingText}>잠깐만 기다려주세요... 💫</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8F8', // 민트 계열 배경
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
    color: '#4ECDC4', // 민트 계열 제목
    marginBottom: 8,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: '#2C3E50', // 진한 회색 텍스트
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#2C3E50', // 진한 회색 텍스트
    marginTop: 16,
    fontWeight: '500',
  },
});

export default LoadingScreen;
