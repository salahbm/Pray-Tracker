import { PortalHost } from '@rn-primitives/portal';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import BottomSheet from './bottom-sheet';
import QueryProvider from './query';
import { ThemeProvider } from './theme';
import ToastProvider from './toaster';

const RootProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <GestureHandlerRootView>
        <QueryProvider>
          <BottomSheet>{children}</BottomSheet>
          <ToastProvider />
          <PortalHost />
        </QueryProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
};

export default RootProvider;
