import './globals.css';
import "flatpickr/dist/flatpickr.css";
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { NotificationProvider } from '@/context/NotificationContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="dark:bg-gray-900">
        <ThemeProvider>
          <SidebarProvider>
            <NotificationProvider>{children}</NotificationProvider>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
