# web-digital-signage

## About

Webベースのサイネージシステムです。

iframeを用いて、登録してあるページを順番に指定秒数ごとに表示することを繰り返します。

APIを用いて、割り込みで、指定のページを指定秒数だけ表示することも可能です。

### スクリーン割り込みAPIの使い方

```
curl --location --request POST 'https://us-central1-web-digital-signage.cloudfunctions.net/addInterruptPage' \
--header 'Content-Type: application/json' \
--data-raw '{
    "url": "https://example.com?hoge=1",
    "durationMillisecond": "5000"
}'
```
クエリパラメーターを用いると、動的なページの表示も可能です。

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
