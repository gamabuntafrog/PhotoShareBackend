const formatTagsFromQuery = (query) => {
  const parsedTags = JSON.parse(query.tags || '[]')

  return parsedTags.map((tag) => new RegExp('^' + tag.toLowerCase(), 'i'))
}

module.exports = formatTagsFromQuery;
