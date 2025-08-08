#!/bin/bash

echo "🧽 React Native 프로젝트 정리(clean)"
echo "===================================="

if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json 파일을 찾을 수 없습니다. 프로젝트 루트에서 실행하세요."
  exit 1
fi

echo "📦 node_modules 삭제"
rm -rf node_modules

echo "📄 lock 파일 삭제 (package-lock.json, yarn.lock)"
rm -f package-lock.json
rm -f yarn.lock

echo "📱 iOS 캐시 정리 (Pods, Podfile.lock, DerivedData)"
(
  cd ios && rm -rf Pods && rm -f Podfile.lock && rm -rf ~/Library/Developer/Xcode/DerivedData
) || true

echo "🤖 Android 캐시 정리 (gradle clean)"
if [ -f "android/gradlew" ]; then
  (
    cd android && ./gradlew clean
  ) || echo "⚠️ Gradle clean 중 오류가 있었지만 계속 진행합니다."
else
  echo "ℹ️ android/gradlew 미존재: Android 정리 건너뜀"
fi

echo "📋 Metro 캐시 정리"
watchman watch-del-all >/dev/null 2>&1 || true
rm -rf "$TMPDIR"/metro-* 2>/dev/null || true
rm -rf "$TMPDIR"/haste-* 2>/dev/null || true
rm -rf node_modules/.cache/metro 2>/dev/null || true

echo "📦 npm 캐시 정리"
npm cache clean --force

echo "✅ clean 완료"

