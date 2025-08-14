import React from 'react';
import { CheckCircle2Icon } from 'lucide-react';

export default function PasswordValidation({ password }) {
  // Password validation checks
  const passwordChecks = {
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /\d/.test(password),
    hasMinLength: password.length >= 8,
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const getPasswordStrength = () => {
    const checks = Object.values(passwordChecks);
    const passedChecks = checks.filter(Boolean).length;

    if (passedChecks === 0) return 'weak';
    if (passedChecks <= 2) return 'weak';
    if (passedChecks === 3) return 'medium';
    return 'strong';
  };

  const strength = getPasswordStrength();

  return (
    <div className="mt-1 space-y-3">
      {/* Password Strength Bars */}
      <div className="flex space-x-1">
        <div
          className={`h-1 w-full rounded ${
            strength === 'weak' ||
            strength === 'medium' ||
            strength === 'strong'
              ? 'bg-red-500'
              : 'bg-gray-200'
          }`}
        />
        <div
          className={`h-1 w-full rounded ${
            strength === 'medium' || strength === 'strong'
              ? 'bg-yellow-500'
              : 'bg-gray-200'
          }`}
        />
        <div
          className={`h-1 w-full rounded ${
            strength === 'strong' ? 'bg-green-500' : 'bg-gray-200'
          }`}
        />
      </div>

      {/* Validation Text */}
      <div className="text-sm text-gray-600">
        <p className="mb-2 font-medium">
          {strength === 'weak' && 'Weak password. Must contain:'}
          {strength === 'medium' && 'Medium password. Must contain:'}
          {strength === 'strong' && 'Strong password!'}
        </p>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <CheckCircle2Icon
              className={`h-5 w-5 ${
                passwordChecks.hasUppercase ? 'text-green-500' : 'text-red-500'
              }`}
            />
            <span
              className={
                passwordChecks.hasUppercase ? 'text-green-600' : 'text-gray-500'
              }
            >
              At least 1 uppercase
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <CheckCircle2Icon
              className={`h-5 w-5 ${
                passwordChecks.hasNumber ? 'text-green-500' : 'text-red-500'
              }`}
            />
            <span
              className={
                passwordChecks.hasNumber ? 'text-green-600' : 'text-gray-500'
              }
            >
              At least 1 number
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <CheckCircle2Icon
              className={`h-5 w-5 ${
                passwordChecks.hasMinLength ? 'text-green-500' : 'text-red-500'
              }`}
            />
            <span
              className={
                passwordChecks.hasMinLength ? 'text-green-600' : 'text-gray-500'
              }
            >
              At least 8 characters
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <CheckCircle2Icon
              className={`h-5 w-5 ${
                passwordChecks.hasSpecialChar
                  ? 'text-green-500'
                  : 'text-red-500'
              }`}
            />
            <span
              className={
                passwordChecks.hasSpecialChar
                  ? 'text-green-600'
                  : 'text-gray-500'
              }
            >
              1 special character
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
