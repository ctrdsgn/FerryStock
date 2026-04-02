import SignInForm from '@/components/auth/SignInForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Masuk - OnStock CBD',
  description: 'Masuk ke akun OnStock CBD Anda',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen min-h-dvh flex">
      {/* Left side - Logo/Brand */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-brand-500">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">OnStock CBD</h1>
          <p className="text-lg opacity-90">Inventory Management System</p>
        </div>
      </div>

      {/* Right side - Sign In Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <SignInForm />
      </div>
    </div>
  );
}
