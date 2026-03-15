import {ObjectId} from 'mongodb';
import {getUserByName, setUser} from '../infrastructure';
import {encryptPassword} from '../utils/crypto';
import type {User} from '../models/domain/user';

export const initAuth = async () => {
  const admin = process.env.ADMIN_NAME;
  const adminPwd = process.env.ADMIN_PWD;

  if (!admin || !adminPwd) {
    console.error('Admin name or pwd missing');
    process.exit(1);
  }

  const existingAdmin = await getUserByName(admin);

  if (!existingAdmin) {
    const hashedPwd = encryptPassword(adminPwd);
    const user: User = {
      _id: new ObjectId(),
      username: admin,
      hashedPwd,
      role: 'admin',
    };
    const res = await setUser(user);

    if (!res.acknowledged) {
      console.error("Couldn't insert admin");
      process.exit(1);
    }
  }
};
