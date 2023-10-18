/**
 * @param {{
 *   userService: UserService,
 *   method: string,
 *   path: string,
 *   request: {
 *     body: {
 *       users: [{nickname: string, email:string}],
 *     },
 *   },
 * }} ctx
 * @returns {Promise<void>}
 * @constructor
 */
export const PostUsersController = async (ctx) => {
  const { method, path } = ctx;
  const { users } = ctx.request.body;
  if (method !== 'POST' || path !== '/users') {
    return;
  }

  const results = users.map((user) => ctx.userService.add(user));

  ctx.body = {
    results: await Promise.all(results),
  };
};
