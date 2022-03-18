# typescript webpack karma jasmine

安裝

```bash
npm i webpack webpack-cli karma karma-cli jasmine @types/jasmine karma-jasmine karma-webpack typescript ts-loader -D
```

檔案結構

(mac)
```bash
mkdir dist src public
touch webpack.config.js karma.conf.js src/index.ts 
touch src/index.spec.ts src/aaa.ts src/aaa.spec.ts
```
(win)
```bash
mkdir dist2
mkdir src2
mkdir public2
fsutil file createnew webpack.config.js 0
fsutil file createnew karma.conf.js 0
fsutil file createnew src/index.ts 0
fsutil file createnew src/index.spec.ts 0
fsutil file createnew src/aaa.ts 0
fsutil file createnew src/aaa.spec.ts 0
fsutil file createnew tsconfig.json 0
```

程式碼

```ts
// aaa.ts
export function aaa(){return 5}

// aaa.spec.ts
import { aaa } from "./aaa"

describe ( 'aaa' , () => {
    it ('bbb', () => {
        expect( 5 ).toBe( 5 )
        expect( aaa() ).toBe( 5 ) 
    })
})

// index.ts
import { aaa } from "./aaa";

console.log('aaa');
aaa()

// index.spec.ts
describe ( 'aaa' , () => {
    it ('bbb', () => {
        expect( 5 ).toBe( 3 )
    })
})
```

tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "es6",
    "rootDir": "./src/",
    "sourceMap": true,  
    "outDir": "./dist/",
  }
}
```

webpack.config.js

```js
const path = require('path')

module.exports = {
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts','.js']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
}
```

karma.conf.js

```js
module.exports = function(config) {
    config.set({
      frameworks: ['jasmine'],
      files: ['./src/**/*.spec.ts'],
      preprocessors: {
        './src/**/*.spec.ts': ['webpack']
      },
      webpack: {
        resolve: {
            extensions: ['.ts','.js']
        },
        module: {
          rules: [
              {
                  test: /\.ts$/,
                  use: 'ts-loader',
                  exclude: /node_modules/
              }
          ]
        },
      }
    });
  };
```
