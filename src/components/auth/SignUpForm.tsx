"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import { signUp } from "@/actions/auth";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const result = await signUp(formData);
      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        setSuccess(result.message);
      }
    } catch (err) {
      setError('Terjadi kesalahan yang tidak diharapkan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Kembali ke dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Daftar
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Buat akun Anda untuk memulai!
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-error-50 p-3 text-sm text-error-500 dark:bg-error-500/10">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-lg bg-success-50 p-3 text-sm text-success-500 dark:bg-success-500/10">
              {success}
            </div>
          )}

          <div>
            <div className="relative py-3 sm:py-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">
                  Daftar dengan email
                </span>
              </div>
            </div>
            <form action={handleSubmit}>
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <Label>
                      Nama Depan<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      name="firstName"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <Label>
                      Nama Belakang<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      name="lastName"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>
                    Email<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="nama@perusahaan.com"
                    required
                  />
                </div>

                <div>
                  <Label>
                    Password<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimal 8 karakter"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2 text-gray-500"
                    >
                      {showPassword ? <EyeCloseIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox
                    id="terms"
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                  />
                  <Label htmlFor="terms" className="text-sm font-normal cursor-pointer select-none text-gray-700 dark:text-gray-400">
                    Saya setuju dengan{" "}
                    <Link href="/terms" className="text-brand-500 hover:underline">
                      Syarat & Ketentuan
                    </Link>{" "}
                    dan{" "}
                    <Link href="/privacy" className="text-brand-500 hover:underline">
                      Kebijakan Privasi
                    </Link>
                  </Label>
                </div>

                <div>
                  <Button
                    type="submit"
                    size="sm"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? "Memproses..." : "Buat Akun"}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-6">
              <p className="text-sm font-medium text-gray-500 text-center dark:text-gray-400">
                Sudah punya akun?{" "}
                <Link
                  href="/login"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Masuk
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
