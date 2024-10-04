import '@/app/ui/globals.css';
import { roboto } from '@/app/ui/fonts';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={`${roboto.className} antialiased`}>{children}</body>
    </html>
  );
}
