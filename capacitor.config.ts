import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ph.sciexplore.app',
  appName: 'SciExplorePH',
  webDir: 'www',
  backgroundColor: '#f8f9fb',
  ios: { contentInset: 'never' },
  plugins: {
    SystemBars: {
      insetsHandling: 'native',
      initialViewportFitValueHint: 'cover',
      style: 'LIGHT',
    },
    Keyboard: { resize: 'native' },
  },
};

export default config;
