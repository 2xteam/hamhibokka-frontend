import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

class NotificationService {
  private static instance: NotificationService;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async initialize() {
    // 권한 요청
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      await this.getFCMToken();
      this.setupMessageHandlers();
    }
  }

  async getFCMToken(): Promise<string | null> {
    try {
      const token = await messaging().getToken();
      await AsyncStorage.setItem('fcmToken', token);
      return token;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  setupMessageHandlers() {
    // 포그라운드 메시지 처리
    messaging().onMessage(async remoteMessage => {
      console.log('Foreground message:', remoteMessage);
      // 인앱 알림 표시
      this.showInAppNotification(remoteMessage);
    });

    // 백그라운드/종료 상태에서 알림 탭
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Background notification opened:', remoteMessage);
      this.handleNotificationNavigation(remoteMessage);
    });

    // 앱이 종료된 상태에서 알림으로 실행
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('App opened from killed state:', remoteMessage);
          this.handleNotificationNavigation(remoteMessage);
        }
      });
  }

  private showInAppNotification(message: any) {
    // 토스트나 모달을 통한 인앱 알림 표시
    // react-native-toast-message 등의 라이브러리 사용 가능
  }

  private handleNotificationNavigation(message: any) {
    // 알림 타입에 따른 네비게이션 처리
    const {data} = message;

    switch (data?.type) {
      case 'sticker_received':
        // 해당 목표 상세 화면으로 이동
        break;
      case 'follow_request':
        // 팔로우 요청 화면으로 이동
        break;
      case 'goal_invitation':
        // 목표 초대 화면으로 이동
        break;
      default:
        // 기본 홈 화면으로 이동
        break;
    }
  }
}

export default NotificationService.getInstance();
