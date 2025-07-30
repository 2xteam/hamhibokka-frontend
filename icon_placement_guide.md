# 📱 앱 아이콘 파일 배치 가이드

## 🍎 iOS 아이콘 배치 위치

### 📁 폴더 위치

```
ios/HamhibokkaApp/Images.xcassets/AppIcon.appiconset/
```

### 📋 필요한 파일들 (9개)

```
AppIcon.appiconset/
├── 20@2x.png     (40x40px)
├── 20@3x.png     (60x60px)
├── 29@2x.png     (58x58px)
├── 29@3x.png     (87x87px)
├── 40@2x.png     (80x80px)
├── 40@3x.png     (120x120px)
├── 60@2x.png     (120x120px)
├── 60@3x.png     (180x180px)
└── AppStore.png  (1024x1024px)
```

### 🔧 배치 방법

1. **파일 복사**: 준비한 아이콘 파일들을 위 폴더에 복사
2. **기존 파일 교체**: 기존 파일이 있다면 새 파일로 교체
3. **파일명 확인**: 정확한 파일명으로 저장되었는지 확인

---

## 🤖 Android 아이콘 배치 위치

### 📁 폴더 위치들

```
android/app/src/main/res/
├── mipmap-mdpi/ic_launcher.png     (48x48px)
├── mipmap-hdpi/ic_launcher.png     (72x72px)
├── mipmap-xhdpi/ic_launcher.png    (96x96px)
├── mipmap-xxhdpi/ic_launcher.png   (144x144px)
└── mipmap-xxxhdpi/ic_launcher.png  (192x192px)
```

### 🔧 배치 방법

1. **각 폴더별로 파일 복사**:

   - `mipmap-mdpi/` → 48x48 크기 파일
   - `mipmap-hdpi/` → 72x72 크기 파일
   - `mipmap-xhdpi/` → 96x96 크기 파일
   - `mipmap-xxhdpi/` → 144x144 크기 파일
   - `mipmap-xxxhdpi/` → 192x192 크기 파일

2. **파일명**: 모든 파일은 `ic_launcher.png`로 저장

---

## ✅ 배치 완료 후 확인사항

### 📋 파일 확인

- [ ] iOS: 9개 파일이 모두 배치되었는지 확인
- [ ] Android: 5개 폴더에 각각 파일이 배치되었는지 확인
- [ ] 파일명이 정확한지 확인

### 🔄 앱 재빌드

```bash
# iOS 재빌드
cd ios
pod install
npx react-native run-ios

# Android 재빌드
npx react-native run-android
```

### 🎯 최종 확인

- [ ] 홈 화면에서 "함히보까" 앱 아이콘 확인
- [ ] 아이콘이 귀엽고 명확하게 보이는지 확인
- [ ] 기존 앱 제거 후 재설치 (아이콘 변경 확실히 확인)

---

## 💡 주의사항

### ⚠️ iOS

- 파일명이 정확해야 함 (대소문자 구분)
- PNG 형식이어야 함
- 투명 배경이 아닌 완전한 정사각형이어야 함

### ⚠️ Android

- 모든 파일명이 `ic_launcher.png`여야 함
- 각 폴더에 맞는 크기 파일을 배치해야 함
- PNG 형식이어야 함

### 🚀 팁

- 기존 앱을 완전히 제거 후 재설치하면 아이콘이 확실히 변경됩니다
- 시뮬레이터/에뮬레이터에서도 아이콘 변경을 확인할 수 있습니다
