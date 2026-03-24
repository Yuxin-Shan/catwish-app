# ViewShot 能实现的效果展示

## 效果1: 简单组件截图

### 代码:
```typescript
<ViewShot ref={ref}>
  <View style={{ backgroundColor: 'pink', padding: 20 }}>
    <Text>Hello</Text>
  </View>
</ViewShot>
```

### 效果:
```
生成一张粉色背景、白色文字"Hello"的PNG图片
```

---

## 效果2: 复杂布局截图

### 代码:
```typescript
<ViewShot ref={ref}>
  <Card style={{ shadow: true }}>
    <Avatar source={user.avatar} />
    <Text>{user.name}</Text>
    <Button>关注</Button>
  </Card>
</ViewShot>
```

### 效果:
```
整个卡片被截图:
- 圆角 ✓
- 阴影 ✓
- 图片 ✓
- 文字 ✓
- 按钮样式 ✓

所有样式都会保留！
```

---

## 效果3: 表情包生成（你的项目）

### 原始组件:
```
<View style={{ width: 640, height: 640 }}>
  <Image source={{ uri: 'cat.jpg' }} />
  <View style={{ backgroundColor: 'rgba(255,182,193,0.2)' }} />
  <Text>❤️</Text>
  <Text>喵~好开心</Text>
</View>
```

### 生成的图片:
```
┌──────────────────────┐
│                      │
│    [猫咪照片]         │ ← 底图
│    [粉色滤镜]         │ ← 叠加层
│       ❤️           │ ← 贴纸
│   ┌──────────────┐  │
│   │ 喵~好开心     │  │ ← 文字气泡
│   └──────────────┘  │
│                      │
└──────────────────────┘

所有层都完美合成！
```

---

## 效果4: 列表/滚动视图截图

### 代码:
```typescript
<ViewShot ref={ref}>
  <ScrollView style={{ height: 400 }}>
    {[...Array(20)].map((_, i) => (
      <Text key={i}>Item {i}</Text>
    ))}
  </ScrollView>
</ViewShot>
```

### 效果:
```
截取整个可滚动区域，不仅仅是可见部分！
包括：当前看不到的内容也会被截图
```

---

## 效果5: 图片+滤镜+贴纸+文字组合

### 应用场景:
```
1. 照片编辑APP
   - 添加滤镜
   - 添加贴纸
   - 添加文字
   - 生成新图片

2. 卡片制作
   - 名片
   - 邀请函
   - 证书

3. 内容分享
   - 生成分享卡片
   - 生成宣传图
   - 生成海报
```

---

## 高级选项

### 1. 截图选项
```typescript
await ref.current.capture({
  format: 'png',        // 格式: png 或 jpg
  quality: 0.9,         // 质量: 0.0-1.0 (jpg有效)
  width: 1080,          // 输出宽度
  height: 1920,         // 输出高度
  result: 'tmpfile'     // 输出类型: 'tmpfile'或'base64'
})
```

### 2. 输出类型

#### tmpfile（文件路径）
```typescript
const uri = await ref.current.capture();
// uri = "file:///path/to/image.png"
// 可以直接用于:
// - <Image source={{ uri }} />
// - CameraRoll.save(uri)
// - Share.share({ url: uri })
```

#### base64（数据URL）
```typescript
const base64 = await ref.current.capture({
  result: 'base64'
});
// base64 = "data:image/png;base64,iVBORw0KGgo..."
// 可以直接用于:
// - 上传到服务器
// - 显示在<img>标签
// - 保存到数据库
```

### 3. 尺寸控制
```typescript
// 原始尺寸
await ref.current.capture()  // 保持组件实际大小

// 固定尺寸
await ref.current.capture({
  width: 640,
  height: 640
})  // 强制输出640x640

### 4. 质量控制
```typescript
// PNG（无损，默认）
{ format: 'png', quality: 1 }

// JPEG（有损可调）
{ format: 'jpg', quality: 0.9 }  // 90%质量
{ format: 'jpg', quality: 0.7 }  // 70%质量（文件更小）
```

---

## 实际应用案例

### 案例1: 分享卡片生成
```typescript
// 生成"邀请好友"分享卡片
<ViewShot ref={shareCardRef}>
  <View style={{ padding: 40, backgroundColor: '#FFB6C1' }}>
    <Text>邀请你使用猫语心愿</Text>
    <QRCode value="https://catwish.app" />
    <Text>扫一扫下载APP</Text>
  </View>
</ViewShot>

// 用户点击分享
const handleShare = async () => {
  const uri = await shareCardRef.current.capture();
  await Share.share({
    url: uri,
    message: '快来试试这个APP！'
  });
};
```

### 案例2: 证书生成
```typescript
// 生成课程完成证书
<ViewShot ref={certificateRef}>
  <View style={{ border: '10px solid gold' }}>
    <Text>结业证书</Text>
    <Text>学员: {username}</Text>
    <Text>课程: 猫语解读入门</Text>
    <Date>{new Date().toLocaleDateString()}</Date>
    <Signature />
  </View>
</ViewShot>
```

### 案例3: 表情包生成（你的项目）
```typescript
<ViewShot ref={memeRef} options={{ width: 640, height: 640 }}>
  <View style={{ position: 'relative' }}>
    {/* 1. 底图 */}
    <Image source={{ uri: catImage }} style={{ width: 640, height: 640 }} />

    {/* 2. 滤镜层 */}
    <View style={{
      position: 'absolute',
      width: 640,
      height: 640,
      backgroundColor: 'rgba(255, 182, 193, 0.2)'  // 粉色可爱滤镜
    }} />

    {/* 3. 贴纸层 */}
    {stickers.map((sticker, i) => (
      <Text
        key={i}
        style={{
          position: 'absolute',
          fontSize: 48,
          left: sticker.x,
          top: sticker.y
        }}
      >
        {sticker.emoji}
      </Text>
    ))}

    {/* 4. 文字层 */}
    <View style={{
      position: 'absolute',
      bottom: 80,
      backgroundColor: 'rgba(255,255,255,0.9)',
      padding: 15,
      borderRadius: 20,
      alignSelf: 'center'
    }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold' }}>
        {memeText}
      </Text>
    </View>
  </View>
</ViewShot>

// 生成
const uri = await memeRef.current.capture();

// 保存到相册
await CameraRoll.save(uri);

// 分享
await Share.share({ url: uri });
```

---

## 优势与限制

### ✅ 优势

1. **简单易用**
   - 只需用组件包裹
   - 一个方法调用
   - 无需复杂代码

2. **保留所有样式**
   - 圆角 ✓
   - 阴影 ✓
   - 渐变 ✓
   - 透明度 ✓
   - 字体样式 ✓

3. **跨平台**
   - iOS ✓
   - Android ✓
   - 效果一致

4. **性能良好**
   - 原生实现
   - 速度快
   - 内存占用小

5. **输出灵活**
   - 文件路径
   - Base64
   - 指定尺寸
   - 指定质量

### ⚠️ 限制

1. **只截取可见组件**
   - 必须先渲染组件
   - 不能截取隐藏的组件
   - 需要在视口内（或设置尺寸）

2. **部分样式可能不一致**
   - 复杂阴影
   - 特殊滤镜
   - Web特定样式

3. **需要真实渲染**
   - 不能在后台运行
   - 必须挂载到DOM树

---

## 总结

**ViewShot = 组件 → 图片的转换器**

它能做到：
- ✅ 将任何React Native组件转为图片
- ✅ 保留所有视觉效果
- ✅ 简单易用
- ✅ 适合表情包、卡片、证书等场景

非常适合你的表情包生成需求！
