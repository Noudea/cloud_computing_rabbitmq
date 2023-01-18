db = db.getSiblingDB('admin')
db.auth('root', 'password')

db = db.getSiblingDB('ampq')

db.createUser({
  user: 'ampq',
  pwd: 'password',
  roles: [
    {
      role: 'dbOwner',
      db: 'ampq',
    },
  ],
});