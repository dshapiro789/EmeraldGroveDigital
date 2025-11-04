import './globals.css';
import { Analytics } from '@vercel/analytics/next';

export const metadata = {
  title: "Emerald Grove Digital",
  description: "Where AI meets organic imagination.",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
        <Analytics />
      </body>
    </html>
  );
}