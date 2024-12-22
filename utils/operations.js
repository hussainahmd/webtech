const fs = require('fs');
const path = require('path');
const usersFile = path.join(__dirname, '../data/users.json');

const getUsers = () => JSON.parse(fs.readFileSync(usersFile, 'utf8') || '[]');
const saveUsers = (users) => fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

module.exports = {
    add(user) {
        const users = getUsers();
        users.push(user);
        saveUsers(users);
    },
    update(userId, userObj) {
        const users = getUsers().map((user) => (user.id === userId ? { ...user, ...userObj } : user));
        saveUsers(users);
    },
    delete(userId) {
        const users = getUsers().filter((user) => user.id !== userId);
        saveUsers(users);
    },
    get(userId) {
        return getUsers().find((user) => user.id === userId);
    },
    getAll() {
        return getUsers();
    },
};
