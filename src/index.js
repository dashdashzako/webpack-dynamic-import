const getLocale = async (locale) => {
  return await import(`./${locale}.json`)
}
