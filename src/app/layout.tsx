import { Inter } from 'next/font/google';
import './globals.css';
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
import 'react-calendar/dist/Calendar.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <title>The Advertisers Admin</title>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
