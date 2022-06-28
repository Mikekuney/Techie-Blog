const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// router.get('/', withAuth, async (req, res) => {
//   await User.findAll({
//     attributes: {exclude: ['[password]']}
//   })
//   .then(userData => res.json(userData))
//   .catch(err => {
//     console.log(err);
//     res.status(500).json(err);
//   })
// })

// router.get('/:id', withAuth, async (req, res) => {
//   await User.findOne({
//     attributes: { exclude: ['password'] },
//     where: {
//         id: req.params.id
//     },
//     include: [{
//             model: Post,
//             attributes: [
//                 'id',
//                 'post-title',
//                 'post_text',
//                 'created_at'
//             ]
//         },

//         {
//             model: Comment,
//             attributes: ['id', 'comment_text', 'created_at'],
//             include: {
//                 model: Post,
//                 attributes: ['post_title']
//             }
//         },
//         {
//             model: Post,
//             attributes: ['post_title'],
//         }
//     ]
//   })
//   .then(dbUserData => {
//     if (!dbUserData) {
//         res.status(404).json({ message: 'User with this ID not found' });
//         return;
//     }
//     res.json(dbUserData);
//   })
//   .catch(err => {
//     console.log(err);
//     res.status(500).json(err);
//   });
// });

router.post('/', async (req, res) => {
  try {
    const newUser = await User.create({
      username: req.body.username,
      password: req.body.password,
    });

    req.session.save(() => {
      req.session.userId = newUser.id;
      req.session.username = newUser.username;
      req.session.loggedIn = true;

      res.json(newUser);
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      res.status(400).json({ message: 'No user account found!' });
      return;
    }

    const validPassword = user.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({ message: 'No user account found!' });
      return;
    }

    req.session.save(() => {
      req.session.userId = user.id;
      req.session.username = user.username;
      req.session.loggedIn = true;

      res.json({ user, message: 'You are now logged in!' });
    });
  } catch (err) {
    res.status(400).json({ message: 'No user account found!' });
  }
});

router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
