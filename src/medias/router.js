const express = require('express');

const {getAllMedias, updateFollows, updateComicChapter} = require('./comick/application/comick');

const router = express.Router();

router.get('/', async (_, res) => {
  const follows = await getAllMedias();
  res.status(200).json({
    status: true,
    data: follows,
  });
});

router.post('/refresh/comic', async (_, res) => {
  let status = 204;

  try {
    await updateFollows();
  } catch (e) {
    status = 500;
  }

  res.status(status).send();
});

router.post('/refresh/:id/chapters', async (req, res) => {
  let status = 204;

  const id = req.params['id'];

  if (!id || isNaN(id)) {
    res.status(400).send({status: false, msg: 'Param id mandatory and a number'});
    return;
  }

  try {
    await updateComicChapter();
  } catch (e) {
    status = 500;
  }

  res.status(status).send();
});

module.exports = router;
