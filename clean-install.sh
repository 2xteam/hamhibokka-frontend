#!/bin/bash

echo "🧹 React Native 프로젝트 정리 및 설치 실행 스크립트"
echo "=================================================="

# 현재 디렉토리 확인
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json 파일을 찾을 수 없습니다. 프로젝트 루트 디렉토리에서 실행해주세요."
    exit 1
fi

echo "🧽 1) 정리(clean) 스크립트 실행..."
./clean.sh || { echo "❌ clean.sh 실행 중 오류"; exit 1; }

echo "📥 2) 설치(install) 스크립트 실행..."
./install.sh || { echo "❌ install.sh 실행 중 오류"; exit 1; }

echo "🎉 모든 정리 및 설치가 완료되었습니다!"
echo "=================================================="