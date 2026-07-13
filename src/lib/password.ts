import { z } from 'zod';

/**
 * Single source of truth for password rules, mirroring the backend policy:
 * min 8 chars, at least one uppercase, one lowercase, one number and one
 * special character.
 */
export const passwordRequirements: { label: string; test: (value: string) => boolean }[] = [
  { label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { label: 'One uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { label: 'One lowercase letter', test: (v) => /[a-z]/.test(v) },
  { label: 'One number', test: (v) => /[0-9]/.test(v) },
  { label: 'One special character', test: (v) => /[^A-Za-z0-9]/.test(v) },
];

export const passwordSchema = z
  .string()
  .min(8, 'Min 8 characters')
  .regex(/[A-Z]/, 'Need an uppercase letter')
  .regex(/[a-z]/, 'Need a lowercase letter')
  .regex(/[0-9]/, 'Need a number')
  .regex(/[^A-Za-z0-9]/, 'Need a special character');

/**
 * Rough password strength (0–4) based on how many requirements are met beyond
 * the minimum length. Used to drive the live strength meter.
 */
export function passwordStrength(value: string): {
  score: number;
  label: string;
  color: string;
} {
  if (!value) return { score: 0, label: 'Empty', color: 'bg-ink-600' };
  const met = passwordRequirements.filter((r) => r.test(value)).length;
  if (met <= 2) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
  if (met === 3) return { score: 2, label: 'Fair', color: 'bg-amber-500' };
  if (met === 4) return { score: 3, label: 'Good', color: 'bg-sky-500' };
  return { score: 4, label: 'Strong', color: 'bg-sage-500' };
}
