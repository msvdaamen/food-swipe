import type { Kysely } from 'kysely'

export async function seed(db: Kysely<any>): Promise<void> {
	// seed code goes here...
	// note: this function is mandatory. you must implement this function.
  await db.insertInto('users').values({
    email: 'test@test.com',
    username: 'test',
    password: '$argon2i$v=19$m=16,t=2,p=1$c2RmZ2ZzZGZnc2RmZ3NkZ3NkZmc$egA9cq/0hNG9zs2WE7ZiEw',
    first_name: 'test',
    last_name: 'test',
    is_admin: true
  }).execute();
}
