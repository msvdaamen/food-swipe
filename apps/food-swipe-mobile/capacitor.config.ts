import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.foodswipe.app',
  appName: 'food-swipe',
  webDir: 'dist/food-swipe/browser',
  server: {
    url: 'http://192.168.2.49::4200',
    cleartext: true,
  },
};

export default config;
