import { User } from './User';
import { des } from './des';
import router from 'umi/router';

declare const localStorage: any;
const key = '*5&,4&%4_-;klujnm?Nt4321';

export function set<T>(field: string, value: T) {
  if (typeof value === 'object') {
    (value as any).a = new Date().getTime() % 10000; // 为了让每次加密的结果都不同
  }
  const ciphertext = des.encryptStr(JSON.stringify(value), key);
  localStorage.setItem(field, ciphertext);
}

export function get<T>(field: string): T {
  const ciphertext = localStorage.getItem(field);

  if (!ciphertext) {
    return null;
  }
  const json = des.decryptStr(ciphertext, key);

  return JSON.parse(json) as T;
}

export function remove(key: string) {
  localStorage.removeItem(key);
}

export function setUser(user: User) {
  set('User', user);
}

export function getUser() {
  return get<User>('User');
}
// 获取当前用户信息，如果不存在，跳至登录页面
export function getUserIfNullLogout() {
  const user = getUser();
  if (!user) {
    router.push('/login');
  }
  return user;
}
export function removeUser() {
  remove('User');
}
