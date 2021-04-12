// // sets necesarry dependencies
const path = require('path');
const router = require('express').Router();
const { Image, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');
// const uploadPath = __basedir + "/assets/uploads";


router.get('/', (req, res) => {
  Image.findAll({
      attributes: [
        'id', 
        'name', 
        'data',
        'url',
        'user_id',
        'created_at'
      ],
      order: [
        ['created_at', 'DESC']
      ],
      include: [
        {
          model: User,
          attributes: ['username']
        }
    ]
  })
    .then(dbPostData => res.json(dbPostData.reverse()))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});


router.post('/', withAuth, (req, res) => {
  let profilePicture;

  if(!req.files || Object.keys(req.files).length === 0){
    return res.status(400).send('No files were uploaded.');
  }

  profilePicture = req.files.file;
  uploadPath = "./assets/upload/" + profilePicture.name;
  // console.log(profilePicture);

  profilePicture.mv(uploadPath, function(err) {
    if(err) return res.status(500).send(err);
  })

  console.log("====================================================");
  console.log("req.files.file: " + req.files);

  Image.create({
    name: profilePicture.name,
    data: profilePicture.data,
    url: uploadPath,
    user_id: req.session.user_id
  })
    .then(dbPostData => {
      res.redirect('../user-profile');
      // res.json(dbPostData)
    })
    .catch(err => {
      console.log(err);
      // res.status(500).json(err);
    });
});




module.exports = router;
