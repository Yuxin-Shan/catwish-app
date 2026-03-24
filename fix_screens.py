#!/usr/bin/env python3
"""
修复 ResultScreen.tsx 和 CameraScreen.tsx 以使用 ScreenHeader 组件
"""

import re

def fix_result_screen():
    """修复 ResultScreen.tsx"""
    file_path = "src/screens/ResultScreen.tsx"

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. 添加 ScreenHeader 导入
    content = content.replace(
        "import { Button } from '../components/Button';\n",
        "import { Button } from '../components/Button';\nimport { ScreenHeader } from '../components/ScreenHeader';\n"
    )

    # 2. 替换导航栏 JSX
    old_navbar = '''      {/* 顶部导航 */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} testID="back-button">
          <Ionicons name="arrow-back" size={28} color={Colors.text.primary} testID="back-icon" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>解读结果</Text>
        <TouchableOpacity style={styles.moreButton} onPress={handleReanalyze} testID="reanalyze-button">
          <Ionicons name="refresh" size={24} color={Colors.text.secondary} testID="refresh-icon" />
        </TouchableOpacity>
      </View>'''

    new_navbar = '''      {/* 顶部导航 */}
      <ScreenHeader
        title="解读结果"
        onBack={() => navigation.goBack()}
        rightIcon="refresh"
        onRightPress={handleReanalyze}
        testID="result-header"
      />'''

    content = content.replace(old_navbar, new_navbar)

    # 3. 删除导航栏样式
    styles_to_remove = '''
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
  moreButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center'
  },'''

    content = content.replace(styles_to_remove, '')

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"✓ 修复完成: {file_path}")

def fix_camera_screen():
    """修复 CameraScreen.tsx"""
    file_path = "src/screens/CameraScreen.tsx"

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. 添加 ScreenHeader 导入
    # 找到最后一个 import 语句并在其后添加
    import_pattern = r"(import .* from .*;\n)"
    imports = list(re.finditer(import_pattern, content))

    if imports:
        last_import_end = imports[-1].end()
        content = content[:last_import_end] + f"import {{ ScreenHeader }} from '../components/ScreenHeader';\n" + content[last_import_end:]

    # 2. 替换导航栏 JSX
    old_navbar = '''      {/* 顶部栏 */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color={Colors.text.inverse} />
        </TouchableOpacity>
        <Text style={styles.title}>拍照解读</Text>
        <TouchableOpacity style={styles.flashButton}>
          <Ionicons name="flash" size={24} color={Colors.text.inverse} />
        </TouchableOpacity>
      </View>'''

    new_navbar = '''      {/* 顶部栏 */}
      <ScreenHeader
        title="拍照解读"
        onBack={handleBack}
        rightIcon="flash"
        onRightPress={() => {}}
        titleColor={Colors.text.inverse}
        iconColor={Colors.text.inverse}
        backgroundColor="#000"
        testID="camera-header"
      />'''

    content = content.replace(old_navbar, new_navbar)

    # 3. 删除导航栏样式
    styles_to_remove = '''
  // 顶部栏
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: 60,
    paddingBottom: Spacing.md
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  title: {
    ...Typography.bodyLarge,
    color: Colors.text.inverse,
    fontWeight: '600'
  },
  flashButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center'
  },'''

    content = content.replace(styles_to_remove, '')

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"✓ 修复完成: {file_path}")

if __name__ == "__main__":
    print("开始修复屏幕文件...")
    fix_result_screen()
    fix_camera_screen()
    print("\n所有文件修复完成！")
