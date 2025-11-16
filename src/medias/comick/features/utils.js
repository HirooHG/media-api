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

  const obs = {};
  fields.forEach((f) => {
    obs[f] = comic[f];
  });

  return obs;
};

module.exports = {
  selectComicDetailsProps,
};
