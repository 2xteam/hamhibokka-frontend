#!/bin/bash

echo "🧹 React Native 프로젝트 의존성 완전 정리 및 재설치 스크립트"
echo "=================================================="

# 현재 디렉토리 확인
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json 파일을 찾을 수 없습니다. 프로젝트 루트 디렉토리에서 실행해주세요."
    exit 1
fi

echo "📦 1. node_modules 삭제 중..."
rm -rf node_modules
echo "✅ node_modules 삭제 완료"

echo "📄 2. lock 파일들 삭제 중..."
rm -f package-lock.json
rm -f yarn.lock
echo "✅ lock 파일들 삭제 완료"

echo "📱 3. iOS 관련 캐시 정리 중..."
cd ios
rm -rf Pods
rm -f Podfile.lock
rm -rf ~/Library/Developer/Xcode/DerivedData
echo "✅ iOS 캐시 정리 완료"
cd ..

echo "🤖 4. Android 관련 캐시 정리 중..."
cd android
./gradlew clean
cd ..
echo "✅ Android 캐시 정리 완료"

echo "📋 5. Metro 캐시 정리 중..."
npx react-native start --reset-cache &
METRO_PID=$!
sleep 3
kill $METRO_PID 2>/dev/null
echo "✅ Metro 캐시 정리 완료"

echo "📦 6. npm 캐시 정리 중..."
npm cache clean --force
echo "✅ npm 캐시 정리 완료"

echo "🔄 7. 의존성 재설치 중..."
npm install
echo "✅ 의존성 재설치 완료"

echo "📱 8. iOS Pod 재설치 중..."
cd ios
pod install --repo-update
cd ..
echo "✅ iOS Pod 재설치 완료"

echo "🧪 9. TypeScript 타입 체크 중..."
npx tsc --noEmit
echo "✅ TypeScript 타입 체크 완료"

echo "🔍 10. ESLint 검사 중..."
npx eslint . --ext .js,.jsx,.ts,.tsx
echo "✅ ESLint 검사 완료"

echo ""
echo "🎉 모든 정리 및 재설치가 완료되었습니다!"
echo "=================================================="
echo "다음 명령어로 앱을 실행할 수 있습니다:"
echo "  iOS: npx react-native run-ios"
echo "  Android: npx react-native run-android"
echo ""
echo "💡 추가 팁:"
echo "  - iOS 빌드 문제 시: cd ios && pod install && cd .."
echo "  - Android 빌드 문제 시: cd android && ./gradlew clean && cd .."
echo "  - Metro 캐시 초기화: npx react-native start --reset-cache"
echo "" 