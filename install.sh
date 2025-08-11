#!/bin/bash

echo "📥 React Native 프로젝트 설치(install)"
echo "===================================="

if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json 파일을 찾을 수 없습니다. 프로젝트 루트에서 실행하세요."
  exit 1
fi

echo "🔄 yarn install"
yarn install || { echo "❌ npm install 실패"; exit 1; }

echo "📱 iOS Pods 설치"
(
  cd ios && pod install --repo-update
) || { echo "❌ pod install 실패"; exit 1; }

echo "🧪 TypeScript 타입 체크"
npx tsc --noEmit || echo "⚠️ TypeScript 오류가 있습니다."

echo "🔍 ESLint 검사"
if npx eslint . --ext .js,.jsx,.ts,.tsx; then
  echo "✅ ESLint 통과"
else
  echo "⚠️ ESLint 오류가 있습니다. 필요 시: npm i -D eslint-plugin-prettier"
fi

echo "✅ install 완료"

