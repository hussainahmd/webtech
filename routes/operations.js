const express = require('express');
const operations = require('../utils/operations');
const router = express.Router();

//just a demo to show how operations work, not dynamic
router.get('/operations-demo', (req, res) => {
    operations.add({ id: 1, name: 'User1', age: 25 });
    operations.update(1, { name: 'Updated User', age: 26 });
    operations.delete(1);

    for (let i = 1; i <= 10; i++) {
        operations.add({ id: i, name: `User${i}`, age: 20 + i });
    }
    const users = operations.getAll();
    console.log('Users:', users);
    res.render('operations-demo', { users, recentPages: req.session.recentPages });
});

module.exports = router;
