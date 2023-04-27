const en = require('./languages/en')
const ua = require('./languages/ua')

const languages = {
  'en-US': en,
  uk: ua
}

const translate = (lang = 'en-US') => {
  return (ref) => (languages[lang] ? languages[lang][ref] : ref)
}

module.exports = translate
