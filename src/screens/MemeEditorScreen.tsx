// src/screens/MemeEditorScreen.tsx
/**
 * 表情包编辑器
 * 核心差异化功能
 * 完整实现: UI + 真实生成 + 保存 + 分享
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
  Image
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ViewShot from 'react-native-view-shot';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../constants/theme';
import { RootStackParamList } from '../types/navigation';
import { AnalysisResult } from '../services/ai/types';
import { memeGenerator, MemeConfig } from '../services/MemeGenerator';

type MemeEditorScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MemeEditor'>;

interface Props {
  navigation: MemeEditorScreenNavigationProp;
  route: {
    params: {
      imageUri: string;
      analysisResult: AnalysisResult;
    };
  };
}

export default function MemeEditorScreen({ navigation, route }: Props) {
  const { imageUri, analysisResult } = route.params;

  // ViewShot引用
  const viewShotRef = useRef<any>(null);

  // 状态
  const [selectedFilter, setSelectedFilter] = useState<'cute' | 'funny' | 'healing'>('cute');
  const [selectedStickers, setSelectedStickers] = useState<string[]>([]);
  const [memeText, setMemeText] = useState(analysisResult.memeText || analysisResult.catSays.slice(0, 20) || '');
  const [loading, setLoading] = useState(false);
  const [generatedMeme, setGeneratedMeme] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const filters = [
    { id: 'cute' as const, label: '可爱', emoji: '🌸' },
    { id: 'funny' as const, label: '搞笑', emoji: '😂' },
    { id: 'healing' as const, label: '治愈', emoji: '💫' }
  ];

  const stickers = {
    cute: ['❤️', '🥺', '✨', '🌸', '☁️'],
    funny: ['😂', '💀', '🤡', '😈', '🔥'],
    healing: ['🌈', '🌙', '⭐', '💫', '🍀']
  };

  const toggleSticker = (sticker: string) => {
    if (selectedStickers.includes(sticker)) {
      setSelectedStickers(selectedStickers.filter(s => s !== sticker));
    } else if (selectedStickers.length < 5) {
      setSelectedStickers([...selectedStickers, sticker]);
    }
  };

  // 生成表情包（使用ViewShot）
  const handleGenerate = async () => {
    if (!memeText.trim()) {
      Alert.alert('提示', '请输入表情包文字');
      return;
    }

    setLoading(true);
    try {
      const config: MemeConfig = {
        imageUri,
        text: memeText,
        stickers: selectedStickers,
        filter: selectedFilter
      };

      // 使用ViewShot生成真实图片
      const result = await memeGenerator.generateMeme(config, viewShotRef);
      setGeneratedMeme(result.uri);
      setShowSuccessModal(true);
    } catch (error: any) {
      console.error('❌ 生成失败:', error);
      Alert.alert('生成失败', error.message || '无法生成表情包，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 保存到相册
  const handleSaveToGallery = async () => {
    if (!generatedMeme) return;

    try {
      const success = await memeGenerator.saveToGallery(generatedMeme);
      if (success) {
        Alert.alert('保存成功', '表情包已保存到相册');
      } else {
        Alert.alert('保存失败', '无法保存到相册');
      }
    } catch (error) {
      console.error('保存失败:', error);
      Alert.alert('保存失败', '无法保存到相册');
    }
  };

  // 分享表情包
  const handleShare = async () => {
    if (!generatedMeme) return;

    try {
      await memeGenerator.shareMeme(
        generatedMeme,
        `我家的猫咪说: "${memeText}" 🐱\n\n用猫语心愿APP看看你的猫咪在想什么~`
      );
    } catch (error) {
      console.error('分享失败:', error);
    }
  };

  // 返回并使用表情包
  const handleDone = () => {
    if (generatedMeme) {
      Alert.alert('完成', '表情包已制作完成');
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* 顶部导航 */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>表情包制作</Text>
        <TouchableOpacity onPress={handleDone} style={styles.doneButton}>
          <Ionicons name="checkmark" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 预览区域 - 使用ViewShot包裹 */}
        <View style={styles.previewContainer}>
          <ViewShot
            ref={viewShotRef}
            options={{
              format: 'png',
              quality: 1.0,
              width: 640,
              height: 640
            }}
            style={styles.viewShotContainer}
          >
            <View style={[styles.preview, generatedMeme && styles.previewGenerated]}>
              {/* 猫咪图片 */}
              <Image
                source={{ uri: imageUri }}
                style={styles.catImage}
                resizeMode="cover"
              />

              {/* 滤镜叠加层 */}
              <View style={[
                styles.filterOverlay,
                { backgroundColor: memeGenerator.getFilterStyle(selectedFilter).overlay }
              ]} />

              {/* 贴纸层 */}
              {selectedStickers.map((sticker, index) => (
                <Text
                  key={index}
                  style={[
                    styles.sticker,
                    {
                      top: 80 + index * 70,
                      left: 40 + (index % 3) * 80
                    }
                  ]}
                >
                  {sticker}
                </Text>
              ))}

              {/* 文字层 */}
              {memeText && (
                <View style={styles.textOverlay}>
                  <Text style={styles.memeText}>{memeText}</Text>
                </View>
              )}

              {/* 已生成标记（截图时会被包含） */}
              {generatedMeme && (
                <View style={styles.watermark}>
                  <Text style={styles.watermarkText}>猫语心愿</Text>
                </View>
              )}
            </View>
          </ViewShot>

          {/* 生成成功标记（UI显示，不包含在截图中） */}
          {generatedMeme && (
            <View style={styles.generatedBadge}>
              <Text style={styles.generatedBadgeText}>✓ 已生成</Text>
            </View>
          )}
        </View>

        {/* 滤镜选择 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>滤镜风格</Text>
          <View style={styles.filterOptions}>
            {filters.map(filter => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterOption,
                  selectedFilter === filter.id && styles.activeFilter
                ]}
                onPress={() => setSelectedFilter(filter.id)}
                disabled={loading}
              >
                <Text style={styles.filterEmoji}>{filter.emoji}</Text>
                <Text
                  style={[
                    styles.filterLabel,
                    selectedFilter === filter.id && styles.activeFilterLabel
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 贴纸选择 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            贴纸 ({selectedStickers.length}/5)
          </Text>
          <View style={styles.stickerOptions}>
            {stickers[selectedFilter].map(sticker => (
              <TouchableOpacity
                key={sticker}
                style={[
                  styles.stickerOption,
                  selectedStickers.includes(sticker) && styles.selectedSticker
                ]}
                onPress={() => toggleSticker(sticker)}
                disabled={loading}
              >
                <Text style={styles.stickerEmoji}>{sticker}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 文字输入 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>表情包文字</Text>
          <TextInput
            style={styles.textInput}
            value={memeText}
            onChangeText={setMemeText}
            placeholder="输入可爱的文案..."
            placeholderTextColor={Colors.text.tertiary}
            maxLength={20}
            editable={!loading}
          />
          <Text style={styles.charCount}>{memeText.length}/20</Text>
        </View>

        {/* 生成按钮 */}
        <TouchableOpacity
          style={[styles.generateButton, loading && styles.generateButtonDisabled]}
          onPress={handleGenerate}
          disabled={loading || generatedMeme !== null}
        >
          {loading ? (
            <ActivityIndicator color={Colors.text.inverse} size="small" />
          ) : (
            <Text style={styles.generateButtonText}>
              {generatedMeme ? '✓ 已生成' : '✨ 生成表情包'}
            </Text>
          )}
        </TouchableOpacity>

        {/* 生成后的操作按钮 */}
        {generatedMeme && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleSaveToGallery}
            >
              <Ionicons name="download-outline" size={24} color={Colors.text.primary} />
              <Text style={styles.actionButtonText}>保存</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleShare}
            >
              <Ionicons name="share-social-outline" size={24} color={Colors.text.primary} />
              <Text style={styles.actionButtonText}>分享</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                setGeneratedMeme(null);
                setShowSuccessModal(false);
              }}
            >
              <Ionicons name="refresh-outline" size={24} color={Colors.text.primary} />
              <Text style={styles.actionButtonText}>重新制作</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* 成功模态框 */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="checkmark-circle" size={64} color={Colors.success} />
            <Text style={styles.modalTitle}>表情包生成成功!</Text>
            <Text style={styles.modalText}>
              已经为你制作了专属表情包
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={() => setShowSuccessModal(false)}
              >
                <Text style={styles.modalButtonTextSecondary}>继续编辑</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleSaveToGallery}
              >
                <Text style={styles.modalButtonTextPrimary}>保存到相册</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary
  },

  // 导航栏
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: 60,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.background.primary
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  navTitle: {
    ...Typography.bodyLarge,
    color: Colors.text.primary,
    fontWeight: '600'
  },
  doneButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center'
  },

  // 滚动内容
  scrollContent: {
    padding: Spacing.lg
  },

  // 预览区域
  previewContainer: {
    marginBottom: Spacing.lg,
    position: 'relative'
  },
  viewShotContainer: {
    alignSelf: 'center'
  },
  preview: {
    width: 320,
    height: 320,
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    position: 'relative'
  },
  catImage: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  filterOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  sticker: {
    position: 'absolute',
    fontSize: 36,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  textOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3
  },
  memeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    textAlign: 'center'
  },
  watermark: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10
  },
  watermarkText: {
    fontSize: 10,
    color: Colors.text.secondary
  },
  previewEmoji: {
    fontSize: 80
  },
  stickerPreview: {
    position: 'absolute',
    top: Spacing.lg,
    right: Spacing.lg,
    flexDirection: 'row',
    gap: Spacing.sm
  },
  previewSticker: {
    fontSize: 24
  },
  textPreview: {
    position: 'absolute',
    bottom: Spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm
  },
  previewText: {
    fontSize: 16,
    color: Colors.text.primary,
    fontWeight: '600'
  },
  previewGenerated: {
    borderWidth: 3,
    borderColor: Colors.primary
  },
  generatedBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20
  },
  generatedBadgeText: {
    color: Colors.text.inverse,
    fontSize: 12,
    fontWeight: 'bold'
  },

  // 区块
  section: {
    marginBottom: Spacing.lg
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.text.primary,
    marginBottom: Spacing.md
  },

  // 滤镜选择
  filterOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  filterOption: {
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  activeFilter: {
    backgroundColor: Colors.background.primary,
    borderColor: Colors.primary
  },
  filterEmoji: {
    fontSize: 28,
    marginBottom: Spacing.xs
  },
  filterLabel: {
    ...Typography.bodySmall,
    color: Colors.text.secondary
  },
  activeFilterLabel: {
    color: Colors.primary,
    fontWeight: '600'
  },

  // 贴纸选择
  stickerOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm
  },
  stickerOption: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent'
  },
  selectedSticker: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryDark
  },
  stickerEmoji: {
    fontSize: 24
  },

  // 文字输入
  textInput: {
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    ...Typography.body,
    color: Colors.text.primary,
    borderWidth: 1,
    borderColor: Colors.border.light
  },

  // 生成按钮
  generateButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
    marginTop: Spacing.lg,
    ...Shadow.sm
  },
  generateButtonDisabled: {
    backgroundColor: Colors.border.light
  },
  generateButtonText: {
    ...Typography.buttonLarge,
    color: Colors.text.inverse,
    fontWeight: '600'
  },

  // 操作按钮组
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light
  },
  actionButton: {
    alignItems: 'center'
  },
  actionButtonIcon: {
    fontSize: 28,
    marginBottom: Spacing.xs
  },
  actionButtonText: {
    ...Typography.bodySmall,
    color: Colors.text.secondary
  },

  // 字符计数
  charCount: {
    ...Typography.bodySmall,
    color: Colors.text.tertiary,
    textAlign: 'right',
    marginTop: Spacing.xs
  },

  // 生成后的预览
  previewGenerated: {
    borderWidth: 3,
    borderColor: Colors.primary
  },
  generatedBadge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm
  },
  generatedBadgeText: {
    ...Typography.bodySmall,
    color: Colors.text.inverse,
    fontWeight: '600'
  },

  // 模态框
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl
  },
  modalContent: {
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xxl,
    width: '100%',
    alignItems: 'center'
  },
  modalIcon: {
    fontSize: 60,
    marginBottom: Spacing.lg
  },
  modalTitle: {
    ...Typography.h2,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
    textAlign: 'center'
  },
  modalText: {
    ...Typography.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.xl
  },
  modalButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    width: '100%'
  },
  modalButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center'
  },
  modalButtonSecondary: {
    backgroundColor: Colors.background.secondary
  },
  modalButtonPrimary: {
    backgroundColor: Colors.primary
  },
  modalButtonTextSecondary: {
    ...Typography.button,
    color: Colors.text.primary
  },
  modalButtonTextPrimary: {
    ...Typography.button,
    color: Colors.text.inverse,
    fontWeight: '600'
  }
});
