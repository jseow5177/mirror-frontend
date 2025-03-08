import '@/app/_ui/globals.css';
import { roboto } from '@/app/_ui/fonts';
import { Toaster } from 'react-hot-toast';
import { HeroUIProvider } from '@heroui/react';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning={true}>
      <body
        className={`${roboto.className} antialiased`}
        suppressHydrationWarning={true}
      >
        <HeroUIProvider>{children}</HeroUIProvider>
        <Toaster
          position='top-right'
          toastOptions={{
            duration: 5000,
            removeDelay: 1000,
          }}
        />
      </body>
    </html>
  );
}
