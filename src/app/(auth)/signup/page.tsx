import SignUpForm from '@/components/auth/SignUpForm';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Logo/Brand */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-brand-500">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">OnStock CBD</h1>
          <p className="text-lg opacity-90">Create your account</p>
        </div>
      </div>

      {/* Right side - Sign Up Form */}
      <SignUpForm />
    </div>
  );
}
