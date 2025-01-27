import '@/app/_ui/globals.css';
import { roboto } from '@/app/_ui/fonts';
import { Toaster } from 'react-hot-toast';
import { NextUIProvider } from '@nextui-org/react';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={`${roboto.className} antialiased`}>
        <NextUIProvider>{children}</NextUIProvider>
        <Toaster
          position='top-center'
          toastOptions={{
            success: {
              style: {
                backgroundColor: '#16a34a',
                color: 'white',
              },
              icon: '👍',
            },
            error: {
              style: {
                backgroundColor: '#dc2626',
                color: 'white',
              },
              icon: '👎',
            },
          }}
        />
      </body>
    </html>
  );
}
