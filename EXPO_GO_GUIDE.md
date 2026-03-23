# 📱 Expo Go 连接指南

## ✅ 服务器准备就绪

### 🖥️ 在电脑上运行以下命令：

```bash
cd /Users/test/project_for_agency/cat-mood-app/CatWishExpo
./start-expo.sh
```

或者直接运行：
```bash
npx expo start
```

---

## 📱 在手机上（Expo Go APP）

### 方法1: 使用本地网络（推荐）

1. **确保手机和电脑在同一WiFi网络**

2. **打开Expo Go APP**

3. **点击 "Enter URL manually" 或 "输入URL"**

4. **输入以下地址**：
   ```
   exp://192.168.1.13:8081
   ```

5. **等待加载完成**

---

### 方法2: 使用Tunnel模式（无需同一WiFi）

如果方法1不工作，使用这个：

**在电脑上按 `t` 键**（启动tunnel模式）

然后在Expo Go中输入显示的URL，类似：
```
exp://xxx.xxx.xxx.xxx:19000
```

---

### 方法3: 扫描二维码（需要旧版Expo Go）

如果您的Expo Go有扫码功能：

1. 在电脑终端会看到QR码
2. 在Expo Go中点击 "Scan QR Code"
3. 扫描二维码

---

## 🔧 故障排除

### 问题1: "Connection refused"

**解决**:
```bash
# 确保服务器正在运行
npx expo start

# 如果显示端口被占用
# 按Ctrl+C停止，然后重新运行
```

### 问题2: "Unable to load app"

**解决**:
1. 确保手机和电脑在同一WiFi
2. 检查防火墙设置
3. 尝试使用tunnel模式（按`t`键）

### 问题3: 找不到"Enter URL manually"选项

**Expo Go界面说明**：
- 打开APP后应该看到Projects（项目）列表
- 在右上角或底部应该有输入URL的选项
- 如果没有，尝试更新Expo Go到最新版本

### 问题4: 连接超时

**解决**:
```bash
# 使用tunnel模式
npx expo start --tunnel

# 这会生成一个公网可访问的URL
```

---

## 🎯 连接成功的标志

当连接成功时，您会看到：
1. 加载条显示
2. "猫语心愿"APP界面
3. 底部有3个Tab（首页/历史/我的）

---

## 💡 快速测试

连接成功后：
1. 点击"拍照解读猫咪心情"
2. 点击拍照按钮
3. 查看AI分析过程
4. 查看结果页面

---

## 🔄 热重载

修改代码后：
- **摇一摇手机**
- 或点击Expo Go的菜单
- 选择 "Reload" 或 "重新加载"

---

## 📞 需要帮助？

如果以上方法都不工作：

1. **检查服务器日志**：
   - 查看终端输出
   - 确认没有错误信息

2. **尝试Web版本**：
   ```
   http://192.168.1.13:8081
   ```
   在手机浏览器中访问

3. **重启所有设备**：
   - 重启Expo Go APP
   - 重启开发服务器（Ctrl+C，然后npx expo start）

---

**现在就开始吧！运行 `./start-expo.sh` 然后在手机输入 `exp://192.168.1.13:8081`** 🚀
