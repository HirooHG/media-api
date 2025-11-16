const express = require('express');

const {
  getAllComics,
  getComicImage,
  getComickComicChapter,
  refreshComickFollows,
  getComic,
} = require('./comick/features/features');

const router = express.Router();

router.get('/', async (req, res) => {
  const {page, per_page} = req.query;

  if ((page && isNaN(Number(page))) || (per_page && isNaN(Number(per_page)))) {
    res.status(400).json({
      error: 'Page or per page query parameter is not a number',
    });
    return;
  }

  const p = Number(page);
  const pp = Number(per_page);

  const follows = await getAllComics(p, pp);

  res.status(200).json({
    data: follows,
    error: null,
  });
});

router.get('/comic/:id', async (req, res) => {
  let status = 200;
  let result = null;
  let error = null;

  const {id} = req.params;

  if (!id || isNaN(Number(id))) {
    res.status(400).send({
      status: false,
      data: null,
      error: 'Param id mandatory and a number',
    });
    return;
  }

  const comic_id = Number(id);

  try {
    const comic = await getComic(comic_id);
    if (comic.error) {
      status = comic.status;
      error = comic.error;
    } else result = comic;
  } catch (e) {
    console.error(e);
    status = 500;
  }

  res.status(status).send({
    data: result,
    error,
  });
});

router.post('/refresh/comic', async (_, res) => {
  let status = 204;

  try {
    await refreshComickFollows();
  } catch (e) {
    console.error(e);
    status = 500;
  }

  res.status(status).send();
});

router.post('/:id/chapters', async (req, res) => {
  let status = 200;
  let result = null;
  let error = null;

  const {id} = req.params;

  if (!id || isNaN(Number(id))) {
    res.status(400).send({
      status: false,
      data: null,
      error: 'Param id mandatory and a number',
    });
    return;
  }

  const comic_id = Number(id);

  try {
    const chapters = await getComickComicChapter(comic_id);
    if (chapters.error) {
      status = chapters.status;
      error = chapters.error;
    } else result = chapters;
  } catch (e) {
    console.error(e);
    status = 500;
  }

  res.status(status).send({
    data: result,
    error,
  });
});

router.post('/comic/image/:id', async (req, res) => {
  let status = 200;
  let result = null;
  let error = null;

  const {id} = req.params;

  if (!id || isNaN(Number(id))) {
    res.status(400).send({
      status: false,
      data: null,
      error: 'Param id mandatory and a number',
    });
    return;
  }

  const comic_id = Number(id);

  try {
    const res = await getComicImage(comic_id);
    if (res.error) {
      error = res.error;
      status = res.status;
    } else {
      result = res;
    }
  } catch (e) {
    console.error(e);
    status = 500;
  }

  res.status(status).send({
    data: result,
    error,
  });
});

module.exports = router;
