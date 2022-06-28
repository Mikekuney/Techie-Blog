const router = require('express').Router();
const { Post } = require('../models/');
const withAuth = require('../utils/auth');

router.get('/', withAuth, async (req, res) => {
  try {
    // store the results of the db query in a variable called postData. should use something that "finds all" from the Post model. may need a where clause!
    const postData = await Post.findAll({
      where: {
        userId: req.session.userId,
      }
    });
      
    // this sanitizes the data we just got from the db above (you have to create the above)
    const posts = postData.map((post) => post.get({ plain: true }));

    // fill in the view to be rendered
    res.render('all-posts-admin', {
      // this is how we specify a different layout other than main! no change needed
      layout: 'dashboard',
      
      posts,
    });

  } catch (err) {
    res.redirect('login');
  }
});

router.get('/new', withAuth, (req, res) => {
  
  res.render('new-post', {
    // again, rendering with a different layout than main! no change needed
    layout: 'dashboard',
  });
});

router.get('/edit/:id', withAuth, async (req, res) => {
  try {
    
    const postData = await Post.findByPk(req.params.id);

    if (postData) {
      // serializing the data
      const post = postData.get({ plain: true });
      // which view should we render if we want to edit a post?
      res.render('edit-post', {
        layout: 'dashboard',
        post,
      });
    } else {
      res.status(404).end();
    }
  } catch (err) {
    res.redirect('login');
  }
});

module.exports = router;
