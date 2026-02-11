const algo = process.env.HASH_ALGO as 'argon2id' | 'bcrypt' | 'argon2d';
if (!algo) throw new Error('Algo not specified');

export const encryptPassword = (str: string): string => {
  return Bun.password.hashSync(str, {
    algorithm: algo,
  });
};

export const verifyPassword = (plain: string, hash: string): boolean => {
  return Bun.password.verifySync(plain, hash, algo);
};
