# Webpack Dynamic Import

Simple project to figure how webpack handles dynamic imports.

## Why

I was wondering why webpack was able to resolve some modules paths with a variable
in their path, even though those modules weren't explicitely declared as modules.

## How

Let's take a project with the following file tree:

```
src
├── index.js
└── locales
    ├── en.json
    ├── fr.json
    └── note.txt
```

We want to consume files under `locales` using a dynamic import, because you know,
optimisation.

```js
const getLocale = async (locale) => {
  return await import(`./locales/${locale}.json`)
}
```

What's haunting me is how can webpack process the files given so few context.

## Answer

Webpack creates a bundle for each file matching a regexp created from the dynamic path.

For `./locales/${locale}.json`, it creates a module for each JSON file located
in `./locales`.

The `note.txt` file, even though it's in `locales` folder, doesn't match the regexp
and is simply ignored. No module is created from it.

Just to be sure, let's build our files. This is what webpack generates in the `main.js`
file to dynamically import our locales:

```js
eval("const getLocale = async (locale) => {\n  return await __webpack_require__(\"./src/locales lazy recursive ^\\\\.\\\\/.*\\\\.json$\")(`./${locale}.json`)
```

## Takeaways and more questions

### Other bundlers

What are other bundlers behaviours?

ESbuild should have no problem to import a file with a dynamic path segment,
but what about rollup?

This could be a problem when using Vite.

### Dynamic paths format

A dynamic path should have some static segment.

The following will yield an error:

```js
const getLocale = async (locale) => {
  return await import(locale)
}
```

However, the following just works fine:

```js
const getLocale = async (locale) => {
  return await import(`./${locale}.json`)
}
```

Webpack recursively parses the `./` folder for JSON files, and creates
as bundle for each of them.
