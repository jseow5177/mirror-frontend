import '@/app/ui/globals.css';
import { roboto } from '@/app/ui/fonts';
import { Toaster } from 'react-hot-toast';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={`${roboto.className} antialiased`}>
        {children}
        <Toaster
          position='top-center'
          toastOptions={{
            success: {
              style: {
                backgroundColor: 'green',
                color: 'white',
              },
              icon: '👍',
            },
            error: {
              style: {
                backgroundColor: 'red',
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
