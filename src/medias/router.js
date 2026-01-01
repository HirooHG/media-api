const express = require('express');

const {
  getAllComics,
  getComicImage,
  getComicChapters,
  refreshComickFollows,
  getComic,
  getComicChapterDetails,
  refreshComicChapters,
} = require('./features/features');

const router = express.Router();

router.get('/', async (req, res) => {
  const {page, per_page, status} = req.query;
  let result = null;
  let error = null;
  let reqStatus = 200;

  if (
    (page && isNaN(Number(page))) ||
    (per_page && isNaN(Number(per_page))) ||
    (status && isNaN(Number(status)))
  ) {
    res.status(400).json({
      error: 'Page or per page query parameter is not a number',
    });
    return;
  }

  const p = Number(page);
  const pp = Number(per_page);
  const st = status ? Number(status) : null;

  try {
    const res = await getAllComics(p, pp, st);
    if (res.error) {
      reqStatus = 400;
      error = result.error;
    } else result = res;
  } catch (e) {
    console.error(e);
    reqStatus = 500;
    error = "Couldn't load comics";
  }

  res.status(reqStatus).json({
    data: result,
    error,
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
    error = "Couldn't load comic " + id;
  }

  res.status(status).send({
    data: result,
    error,
  });
});

router.get('/refresh', async (req, res) => {
  let reqStatus = 200;
  let error = null;
  let result = null;

  const {page, per_page, status} = req.query;

  if (
    (page && isNaN(Number(page))) ||
    (per_page && isNaN(Number(per_page))) ||
    (status && isNaN(Number(status)))
  ) {
    res.status(400).json({
      error: 'Page or per page query parameter is not a number',
    });
    return;
  }

  const p = Number(page);
  const pp = Number(per_page);
  const st = Number(status);

  try {
    const comics = await refreshComickFollows(p, pp, status);
    if (comics.error) {
      reqStatus = comics.status;
      error = comics.error;
    } else result = comics;
  } catch (e) {
    console.error(e);
    reqStatus = 500;
    error = "Couldn't refresh comics";
  }

  res.status(reqStatus).send({
    data: result,
    error,
  });
});

router.get('/comic/:id/chapters', async (req, res) => {
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
    const chapters = await getComicChapters(comic_id);
    if (chapters.error) {
      status = chapters.status;
      error = chapters.error;
    } else result = chapters;
  } catch (e) {
    console.error(e);
    status = 500;
    error = "Couldn't load chapters";
  }

  res.status(status).send({
    data: result,
    error,
  });
});

router.get('/refresh/comic/:id/chapters', async (req, res) => {
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
    const chapters = await refreshComicChapters(comic_id);
    if (chapters.error) {
      status = chapters.status;
      error = chapters.error;
    } else result = chapters;
  } catch (e) {
    console.error(e);
    status = 500;
    error = "Couldn't load chapters";
  }

  res.status(status).send({
    data: result,
    error,
  });
});

router.get('/comic/:comic_id/chapter/:chapter_id', async (req, res) => {
  let status = 200;
  let result = null;
  let error = null;

  const {comic_id, chapter_id} = req.params;

  if (!comic_id || !chapter_id || isNaN(Number(comic_id)) || isNaN(Number(chapter_id))) {
    res.status(400).send({
      status: false,
      data: null,
      error: 'Param comic id or chapter id mandatory and a number',
    });
    return;
  }

  const parsedComicId = Number(comic_id);
  const parsedChapterId = Number(chapter_id);

  try {
    const chapter = await getComicChapterDetails(parsedComicId, parsedChapterId);
    if (chapter.error) {
      status = chapter.status;
      error = chapter.error;
    } else result = chapter;
  } catch (e) {
    console.error(e);
    status = 500;
    error = "Couldn't load chapter";
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
    error = "Couldn't load comic image " + id;
  }

  res.status(status).send({
    data: result,
    error,
  });
});

module.exports = router;
