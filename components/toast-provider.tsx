'use client';

import * as Toast from '@radix-ui/react-toast';

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <Toast.Provider swipeDirection="right">
      {children}
      <Toast.Viewport className="fixed top-0 right-0 flex flex-col p-6 gap-3 w-96 max-w-full m-0 list-none z-[100] outline-none" />
    </Toast.Provider>
  );
}
