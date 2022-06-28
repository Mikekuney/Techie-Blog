const router = require('express').Router();
const { Post, Comment, User } = require('../models/');
const sequelize = require('../config/config');
const withAuth = require('../utils/auth');

// get all posts for homepage
router.get('/', withAuth, async (req, res) => {
  try {
    // we need to get all Posts and include the User for each (change lines 8 and 9)
    const postData = await Post.findAll({
      attributes: [
        'id',
        'post_title',
        'post_text',
        'created_at'
      ],
      include: [{
        model: Comment,
        attributes: ['id', 'comment_text', 'user_id', 'post_id', 'created_at'],
        include: {
          model: User,
          attributes: ['id', 'username']
        }
      }],
    });
    // serialize the data
    const posts = postData.map((post) => post.get({ plain: true }));
    // we should render all the posts here
    res.render('all-posts', { posts });
  } catch (err) {
    res.status(500).json(err);
  }
});

// get single post
router.get('/post/:id', withAuth, async (req, res) => {
  try {
    // what should we pass here? we need to get some data passed via the request body (something.something.id?)
    // change the model below, but not the findByPk method.
    const postData = await Post.findByPk(req.params.id, {
      // helping you out with the include here, no changes necessary
      include: [
        User,
        {
          model: Comment,
          include: [User],
        },
      ],
    });

    if (postData) {
      // serialize the data
      const post = postData.get({ plain: true });
      // which view should we render for a single-post?
      res.render('single-post', { post, loggedIn: req.session.loggedIn });
    } else {
      res.status(404).end();
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/new/:id', async (req, res) => {
  await Post.findOne({
          where: {
              id: req.params.id
          },
          attributes: [
              'id',
              'post_title',
              'post_text',
              'created_at'
          ],
          include: [{
                  model: Comment,
                  attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                  include: {
                      model: User,
                      attributes: ['username']
                  }
              },
              {
                  model: User,
                  attributes: ['username']
              }
          ]
      })
      .then(dbPostData => {
          if (!dbPostData) {
              res.status(404).json({ message: 'No post found with this id' });
              return;
          }
          const post = dbPostData.get({ plain: true });
          console.log(post);
          res.render('single-post', { post, loggedIn: req.session.loggedIn });


      })
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
});
router.get('/new/:id', async (req, res) => {
  await Post.findOne({
    where: {
        id: req.params.id
    },
    attributes: [
        'id',
        'post_title',
        'post_text',
        'created_at'
    ],
    include: [{
            model: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: {
                model: User,
                attributes: ['username']
            }
        },
        {
            model: User,
            attributes: ['username']
        }
    ]
  })
  .then(dbPostData => {
    if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
    }
    const post = dbPostData.get({ plain: true });

    res.render('new-post', { post, loggedIn: req.session.loggedIn });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

// giving you the login and signup route pieces below, no changes needed.
router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return true;
  }

  res.render('login');
});

router.get('/signup', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return true;
  }

  res.render('signup');
});

module.exports = router;
