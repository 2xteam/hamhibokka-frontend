import React from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface ImageModalProps {
  visible: boolean;
  imageUri: string | null;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  visible,
  imageUri,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1}
          onPress={onClose}>
          <TouchableOpacity
            style={styles.modalContent}
            activeOpacity={1}
            onPress={() => {}}>
            {imageUri && (
              <Image
                source={{uri: imageUri}}
                style={styles.expandedImage}
                resizeMode="contain"
              />
            )}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandedImage: {
    width: 300,
    height: 300,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  closeButton: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ImageModal;
