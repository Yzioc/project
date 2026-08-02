import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import AuthProviderWrapper from '@/components/AuthProviderWrapper';
import './globals.css';

export const metadata: Metadata = {
  title: '哄哄模拟器',
  description: 'TA 生气了，你能在 10 轮内哄好吗？情侣互动小游戏。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.COZE_PROJECT_ENV === 'DEV';

  return (
    <html lang="en">
      <body className={`antialiased`}>
        {isDev && <Inspector />}
        <AuthProviderWrapper>{children}</AuthProviderWrapper>
      </body>
    </html>
  );
}
