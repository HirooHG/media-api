const getObj = (fields, obj) => {
  const obs = {};
  fields.forEach((f) => {
    obs[f] = obj[f];
  });

  return obs;
};

const selectComicDetailsProps = (comic) => {
  const fields = [
    'hid',
    'country',
    'origination',
    'last_chapter',
    'chapter_count',
    'demographic_name',
    'desc',
    'content_rating',
  ];
  return getObj(fields, obj);
};

const selectComicChapterProps = (chapter) => {
  const fields = ['id', 'hid', 'chap', 'title', 'vol', 'is_the_last_chapter'];

  return getObj(fields, chapter);
};

const selectComicChapterDetailsProps = (images) => {
  const fields = ['name', 'url'];

  const props = images.map((i) => {
    return getObj(fields, i);
  });

  return props;
};

module.exports = {
  selectComicDetailsProps,
  selectComicChapterProps,
  selectComicChapterDetailsProps,
};
