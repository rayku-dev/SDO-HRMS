import { Account } from '@prisma/client';

/**
 * A "safe" version of the Account type that excludes sensitive fields
 * such as the password. This type is intended for API responses where
 * you want to expose account information without leaking private data.
 */
export type SafeUser = Omit<Account, 'password'> & {
  firstName: string | null;
  lastName: string | null;
}; // remove password field, add profile fields

/**
 * Maps a full Prisma Account object to a SafeUser by removing sensitive fields.
 *
 * @param account - The full Account object returned from Prisma queries.
 * @returns A SafeUser object with sensitive fields omitted.
 *
 * @example
 * ```ts
 * const account = await prisma.account.findUnique({ where: { id: '123' } });
 * const safeUser = toSafeUser(account);
 * console.log(safeUser); // { id: '123', email: 'test@example.com', ... }
 * ```
 */
export function toSafeUser(account: Account & { firstName?: string | null; lastName?: string | null }): SafeUser {
  const { password, ...safeUser } = account;
  return safeUser as SafeUser;
}
