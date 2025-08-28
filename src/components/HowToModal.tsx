import React, {useMemo, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface HowToModalProps {
  visible: boolean;
  imagesPersonal: string[];
  imagesFriendSearch: string[];
  imagesParticipation: string[];
  onClose: () => void;
}

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const HowToModal: React.FC<HowToModalProps> = ({
  visible,
  imagesPersonal,
  imagesFriendSearch,
  imagesParticipation,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTab, setCurrentTab] = useState<0 | 1 | 2>(0);
  const listRef = useRef<FlatList<string>>(null);

  const tabs = useMemo(
    () => [
      {key: 'personal', label: '개인목표', images: imagesPersonal || []},
      {key: 'friend', label: '친구찾기', images: imagesFriendSearch || []},
      {
        key: 'participation',
        label: '목표참여',
        images: imagesParticipation || [],
      },
    ],
    [imagesPersonal, imagesFriendSearch, imagesParticipation],
  );

  const currentImages = tabs[currentTab].images;

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const index = Math.round(x / (screenWidth * 0.9));
    if (index !== currentIndex) setCurrentIndex(index);
  };

  const scrollToIndex = (index: number) => {
    if (!listRef.current) return;
    const clamped = Math.max(0, Math.min(index, currentImages.length - 1));
    listRef.current.scrollToIndex({index: clamped, animated: true});
    setCurrentIndex(clamped);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.card}>
          {/* 탭 바 */}
          <View style={styles.tabBar}>
            {tabs.map((t, i) => (
              <TouchableOpacity
                key={t.key}
                style={[
                  styles.tabItem,
                  i === currentTab && styles.tabItemActive,
                ]}
                onPress={() => {
                  setCurrentTab(i as 0 | 1 | 2);
                  setCurrentIndex(0);
                  requestAnimationFrame(() => scrollToIndex(0));
                }}>
                <Text
                  style={[
                    styles.tabText,
                    i === currentTab && styles.tabTextActive,
                  ]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          {currentImages && currentImages.length > 0 ? (
            <>
              <FlatList
                ref={listRef}
                data={currentImages}
                keyExtractor={(uri, idx) => `${uri}-${idx}`}
                renderItem={({item}) => (
                  <View style={styles.slide}>
                    <Image
                      source={{uri: item}}
                      style={styles.image}
                      resizeMode="contain"
                    />
                  </View>
                )}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
              />

              <View style={styles.controls}>
                <TouchableOpacity
                  style={[
                    styles.navButton,
                    currentIndex === 0 && styles.navButtonDisabled,
                  ]}
                  onPress={() => scrollToIndex(currentIndex - 1)}
                  disabled={currentIndex === 0}>
                  <Text style={styles.navButtonText}>{'‹'}</Text>
                </TouchableOpacity>
                <View style={styles.dots}>
                  {currentImages.map((_, i) => (
                    <View
                      key={`dot-${i}`}
                      style={[
                        styles.dot,
                        i === currentIndex && styles.dotActive,
                      ]}
                    />
                  ))}
                </View>
                <TouchableOpacity
                  style={[
                    styles.navButton,
                    currentIndex === currentImages.length - 1 &&
                      styles.navButtonDisabled,
                  ]}
                  onPress={() => scrollToIndex(currentIndex + 1)}
                  disabled={currentIndex === currentImages.length - 1}>
                  <Text style={styles.navButtonText}>{'›'}</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {tabs[currentTab].label} 이미지를 준비 중입니다.
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const CARD_WIDTH = screenWidth * 0.9;
const CARD_HEIGHT = Math.min(screenHeight * 0.96, 744);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...(StyleSheet.absoluteFillObject as any),
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#111',
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  tabBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 52,
    backgroundColor: '#0F0F0F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    zIndex: 2,
  },
  tabItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  tabItemActive: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  tabText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 2,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  slide: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111',
    paddingTop: 52,
  },
  image: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  controls: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonDisabled: {
    opacity: 0.4,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 24,
    marginTop: -2,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6 as any,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dotActive: {
    backgroundColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default HowToModal;
