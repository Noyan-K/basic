import { BaseListRepo } from './base-list.repo.js';

export class UserListRepo extends BaseListRepo {
  static name = 'userList';
  static table = 'users';

  /**
   * @param {{nickname: string}} user
   * @returns {Promise<number>}
   */
  async insert(user) {
    const [{ insertId: userId }] = await super.insert(user);
    return userId;
  }
}
