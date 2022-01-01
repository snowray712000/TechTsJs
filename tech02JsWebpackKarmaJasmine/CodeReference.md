安裝

```bash
npm i webpack webpack-cli karma karma-cli jasmine karma-jasmine karma-webpack -D
```

建立資料結構

```bash
mkdir dist src
touch src/index.js webpack.config.js karma.conf.js
touch src/aaa.js src/aaa.spec.js
```

```js
// index.js
var fileAAA = require('./aaa')

console.log ( fileAAA.aaa () + 35)

// aaa.js
module.exports = {
    aaa: function (aaa) {
        return 5
    }
}

// aaa.spec.js
var aaaM = require('./aaa')

describe ( 'test1' , () => {
    it ('aaa', () => {
        expect(2).toBe(2)
        expect ( aaaM.aaa() ).toBe( 52 ) // 故意錯
    })
} )

```

karma.conf.js

```js
module.exports = function(config) {
    config.set({
        files: ['./src/**/*.spec.js'],
        frameworks: ['jasmine'],
        preprocessors: {
            './src/*.spec.js': ['webpack']
        },
        webpack: {}
    });
}
```

執行 測試

```
npx karma start
```