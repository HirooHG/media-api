import express from 'express';

import {getAllComics, getComicImage, refreshComickFollows, getComic} from './features/medias';

import {getComicChapters, getComicChapterDetails, refreshComicChapters} from './features/chapters';

import type {Media} from './models/domain/media';
import type {MediaImage} from './models/domain/media-image';
import type {Chapter} from './models/domain/chapter';

const router = express.Router();

router.get('/', async (req, res) => {
  const {page, per_page, status} = req.query;
  let data: Media[] | null = null;
  let error: string | null = null;
  let reqStatus = 200;

  if (
    (page && isNaN(Number(page))) ||
    (per_page && isNaN(Number(per_page))) ||
    (status && isNaN(Number(status)))
  ) {
    res.status(400).json({
      error: 'Page, per page or status query parameter is not a number',
    });
    return;
  }

  const p = page ? Number(page) : 1;
  const pp = per_page ? Number(per_page) : 5;
  const st = status ? Number(status) : null;

  try {
    data = await getAllComics(p, pp, st);
  } catch (e) {
    console.error(e);
    reqStatus = 500;
    error = "Couldn't load comics";
  }

  res.status(reqStatus).json({
    data,
    error,
  });
});

router.get('/comic/:id', async (req, res) => {
  let status = 200;
  let data: Media | null = null;
  let error: string | null = null;

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
    if ('error' in comic) {
      status = comic.status;
      error = comic.error;
    } else data = comic;
  } catch (e) {
    console.error(e);
    status = 500;
    error = "Couldn't load comic " + id;
  }

  res.status(status).send({
    data,
    error,
  });
});

router.get('/refresh', async (req, res) => {
  let reqStatus = 200;
  let data: Media[] | null = null;
  let error: string | null = null;

  const {page, per_page, status} = req.query;

  if (
    (page && isNaN(Number(page))) ||
    (per_page && isNaN(Number(per_page))) ||
    (status && isNaN(Number(status)))
  ) {
    res.status(400).json({
      error: 'Page, per page or status query parameter is not a number',
    });
    return;
  }

  const p = page ? Number(page) : 1;
  const pp = per_page ? Number(per_page) : 5;
  const st = status ? Number(status) : null;

  try {
    const comics = await refreshComickFollows(p, pp, st);
    if ('error' in comics) {
      reqStatus = comics.status;
      error = comics.error;
    } else data = comics;
  } catch (e) {
    console.error(e);
    reqStatus = 500;
    error = "Couldn't refresh comics";
  }

  res.status(reqStatus).send({
    data,
    error,
  });
});

router.get('/comic/:id/chapters', async (req, res) => {
  let status = 200;
  let data: Chapter[] | null = null;
  let error: string | null = null;

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
    if ('error' in chapters) {
      status = chapters.status;
      error = chapters.error;
    } else data = chapters;
  } catch (e) {
    console.error(e);
    status = 500;
    error = "Couldn't load chapters";
  }

  res.status(status).send({
    data,
    error,
  });
});

router.get('/refresh/comic/:id/chapters', async (req, res) => {
  let status = 200;
  let data: Chapter[] | null = null;
  let error: string | null = null;

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
    if ('error' in chapters) {
      status = chapters.status;
      error = chapters.error;
    } else data = chapters;
  } catch (e) {
    console.error(e);
    status = 500;
    error = "Couldn't load chapters";
  }

  res.status(status).send({
    data,
    error,
  });
});

router.get('/comic/:comic_id/chapter/:chapter_id', async (req, res) => {
  let status = 200;
  let data: Chapter | null = null;
  let error: string | null = null;

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
    if ('error' in chapter) {
      status = chapter.status;
      error = chapter.error;
    } else data = chapter;
  } catch (e) {
    console.error(e);
    status = 500;
    error = "Couldn't load chapter";
  }

  res.status(status).send({
    data,
    error,
  });
});

router.post('/comic/image/:id', async (req, res) => {
  let status = 200;
  let data: MediaImage | null = null;
  let error: string | null = null;

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
    if ('error' in res) {
      error = res.error;
      status = res.status;
    } else data = res;
  } catch (e) {
    console.error(e);
    status = 500;
    error = "Couldn't load comic image " + id;
  }

  res.status(status).send({
    data,
    error,
  });
});

export default router;
