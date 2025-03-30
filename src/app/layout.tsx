import '@/app/_ui/globals.css';
import { roboto } from '@/app/_ui/fonts';
import { HeroUIProvider } from '@heroui/react';
import { ToastProvider } from '@heroui/toast';

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
        <HeroUIProvider>
          <ToastProvider placement='top-right' toastOffset={10} />
          {children}
        </HeroUIProvider>
      </body>
    </html>
  );
}
