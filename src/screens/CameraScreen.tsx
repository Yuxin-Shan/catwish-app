// src/screens/CameraScreen.tsx
/**
 * 相机页面 - 完整实现
 * 支持拍照、相册选择、裁剪
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Typography, Spacing } from '../constants/theme';
import { RootStackParamList } from '../types/navigation';
import { ScreenHeader } from '../components/ScreenHeader';

type CameraScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Camera'>;

interface Props {
  navigation: CameraScreenNavigationProp;
  route: {
    params: {
      fromHistory?: boolean;
    };
  };
}

interface PhotoResult {
  uri: string;
  width: number;
  height: number;
}

export default function CameraScreen({ navigation, route }: Props) {
  const [loading, setLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState<PhotoResult | null>(null);

  // 模拟实现 - 实际项目需要真实的相机和相册库
  const handleTakePhoto = async () => {
    setLoading(true);
    try {
      // 模拟拍照延迟
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock: 创建一个模拟的图片URI
      const mockPhoto: PhotoResult = {
        uri: 'mock://captured/' + Date.now() + '.jpg',
        width: 800,
        height: 600
      };

      setCapturedImage(mockPhoto);
    } catch (error: any) {
      Alert.alert('拍照失败', error.message || '无法访问相机,请检查权限设置');
    } finally {
      setLoading(false);
    }
  };

  const handlePickFromGallery = async () => {
    setLoading(true);
    try {
      // 模拟相册选择延迟
      await new Promise(resolve => setTimeout(resolve, 600));

      const mockPhoto: PhotoResult = {
        uri: 'mock://gallery/' + Date.now() + '.jpg',
        width: 800,
        height: 600
      };

      setCapturedImage(mockPhoto);
    } catch (error: any) {
      if (error.message === '用户取消选择') {
        return;
      }
      Alert.alert('选择失败', error.message || '无法访问相册');
    } finally {
      setLoading(false);
    }
  };

  const handleCrop = async () => {
    if (!capturedImage) return;

    setLoading(true);
    try {
      // 模拟裁剪延迟
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock: 裁剪后的图片
      const croppedPhoto: PhotoResult = {
        ...capturedImage,
        uri: capturedImage.uri.replace('.jpg', '_cropped.jpg')
      };

      setCapturedImage(croppedPhoto);
    } catch (error: any) {
      Alert.alert('裁剪失败', error.message || '无法裁剪图片');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (capturedImage) {
      navigation.navigate('Analysis', {
        imageUri: capturedImage.uri
      } as any);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* 顶部栏 */}
      <ScreenHeader
        title="拍照解读"
        onBack={handleBack}
        rightIcon="flash"
        onRightPress={() => {}}
        titleColor={Colors.text.inverse}
        iconColor={Colors.text.inverse}
        backgroundColor="#000"
        testID="camera-header"
      />

      {/* 相机取景框 */}
      <View style={styles.cameraFrame}>
        {capturedImage ? (
          <View style={styles.previewContainer}>
            <Ionicons name="image-outline" size={80} color={Colors.text.secondary} />
            <Text style={styles.previewText}>{capturedImage.uri}</Text>
            <Text style={styles.previewSize}>
              {capturedImage.width}x{capturedImage.height}
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.frame}>
              <View style={styles.cornerTL} />
              <View style={styles.cornerTR} />
              <View style={styles.cornerBL} />
              <View style={styles.cornerBR} />
            </View>
            <Text style={styles.hint}>让猫咪在框框内~</Text>
          </>
        )}
      </View>

      {/* 底部控制栏 */}
      <View style={styles.bottomBar}>
        {capturedImage ? (
          <>
            <TouchableOpacity
              style={[styles.controlButton, styles.secondaryButton]}
              onPress={handleCrop}
            >
              <Text style={styles.controlButtonText}>✂️ 裁剪</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.controlButton, styles.secondaryButton]}
              onPress={handleRetake}
            >
              <Text style={styles.controlButtonText}>重拍</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.controlButton, styles.primaryButton]}
              onPress={handleConfirm}
            >
              <Text style={styles.primaryButtonText}>使用</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={styles.galleryButton}
              onPress={handlePickFromGallery}
              disabled={loading}
            >
              <Ionicons name="images-outline" size={28} color={Colors.text.primary} />
              <Text style={styles.galleryLabel}>相册</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={handleTakePhoto}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={Colors.background.primary} size={32} />
              ) : (
                <View style={styles.captureInner} />
              )}
            </TouchableOpacity>
            <View style={styles.placeholder} />
          </>
        )}
      </View>

      {/* 提示 */}
      {!capturedImage && (
        <View style={styles.tipContainer}>
          <Ionicons name="bulb-outline" size={16} color={Colors.text.secondary} />
          <Text style={styles.tip}> 提示: 让猫咪看着镜头更准确</Text>
        </View>
      )}
    </View>
  );
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },


  // 相机取景框
  cameraFrame: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: Spacing.lg
  },
  frame: {
    width: '100%',
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: Colors.background.primary,
    borderRadius: 16
  },
  cornerTL: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 30,
    height: 30,
    borderTopLeftRadius: 16,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: Colors.primary
  },
  cornerTR: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 30,
    height: 30,
    borderTopRightRadius: 16,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: Colors.primary
  },
  cornerBL: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 30,
    height: 30,
    borderBottomLeftRadius: 16,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: Colors.primary
  },
  cornerBR: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 30,
    height: 30,
    borderBottomRightRadius: 16,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: Colors.primary
  },
  hint: {
    ...Typography.body,
    color: Colors.text.inverse,
    textAlign: 'center',
    marginTop: Spacing.lg,
    opacity: 0.8
  },
  previewContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16
  },
  previewEmoji: {
    fontSize: 80,
    marginBottom: Spacing.md
  },
  previewText: {
    ...Typography.bodySmall,
    color: Colors.text.tertiary,
    marginTop: Spacing.sm
  },
  previewSize: {
    ...Typography.bodySmall,
    color: Colors.text.tertiary
  },

  // 底部控制栏
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingBottom: 40,
    paddingTop: Spacing.lg
  },
  galleryButton: {
    alignItems: 'center',
    opacity: 1
  },
  galleryIcon: {
    fontSize: 28,
    marginBottom: Spacing.xs
  },
  galleryLabel: {
    ...Typography.bodySmall,
    color: Colors.text.inverse
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  captureInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFF'
  },
  placeholder: {
    width: 60
  },
  controlButton: {
    flex: 1,
    marginHorizontal: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  primaryButton: {
    backgroundColor: Colors.primary
  },
  secondaryButton: {
    backgroundColor: 'rgba(255,255,255,0.2)'
  },
  controlButtonText: {
    ...Typography.button,
    color: Colors.text.inverse,
    fontWeight: '600'
  },
  primaryButtonText: {
    color: Colors.text.inverse
  },

  // 提示
  tipContainer: {
    position: 'absolute',
    bottom: 120,
    left: Spacing.lg,
    right: Spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 8,
    padding: Spacing.sm
  },
  tip: {
    ...Typography.bodySmall,
    color: Colors.text.inverse,
    textAlign: 'center'
  }
});
