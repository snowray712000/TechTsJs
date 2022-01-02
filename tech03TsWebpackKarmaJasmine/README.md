# ts webpack karma jasmine

感謝主  
前面終於試出了 webpack js karma jasmine 了. 現在對 karma 的設定比較有認識了. 接著要試著換成 ts 了.

安裝基本  
webpack karma jasmine typescript 等

```bash
npm i webpack webpack-cli karma karma-cli jasmine karma-jasmine karma-webpack typescript ts-loader -D
```

建立檔案結構  
dist src public 資料夾, webpack karma 設定檔 index 檔

```bash
mkdir dist src public
touch webpack.config.js karma.conf.js src/index.ts 
touch src/index.spec.ts src/aaa.ts src/aaa.spec.ts
```

tsconfig  
用 tsc --init 建立後, 並修改內容

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

webpack  
也用標準的加入即可

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

```ts
/// aaa.ts
export function aaa(){return 5}

/// idnex.ts
import { aaa } from "./aaa";

console.log('aaa');
aaa()
```

webpack 執行  
執要 npx webpack --mode development 後, 可正確產生資料, 用 index.html 去測試也是可用的.

```html
<script src="./bundle.js"></script>
```

警告  
下面這個警告是當我們 tsconfig 中使用 umd、amd 的時候, 會出現, 但還是可用. 用 es6 不會出現.

```js
WARNING in ./src/aaa.ts 3:24-31
Critical dependency: require function is used in a way in which dependencies cannot be statically extracted
 @ ./src/index.ts
```

## karma

測試內容  
測試內容如下。但是，ts可不認識 describe it expect 這些東西, 在寫之前, 應該先安裝 @types/jasmine

```ts
// index.spec.ts
describe ( 'aaa' , () => {
    it ('bbb', () => {
        expect( 5 ).toBe( 3 )
    })
})

// aaa.spec.ts
import { aaa } from "./aaa"

describe ( 'aaa' , () => {
    it ('bbb', () => {
        expect( 5 ).toBe( 5 )
        expect( aaa() ).toBe( 5 ) 
    })
})
```

```bash
npm i @types/jasmine -D
```

karma config  
直接執行 npx karma start, 會出現錯誤, 因為我們還沒有設定值

```js
ERROR [config]: Config file must export a function!
  module.exports = function(config) {
    config.set({
      // your config
    });
  };
```

adapter  
將上述加入 karma.conf.js 後, 會出現第2個錯誤, 按上個練習, 此時要加入的是 jasmine 相關設定.

```js
ERROR
  You need to include some adapter that implements __karma__.start method!
```

```js
module.exports = function(config) {
    config.set({
      frameworks: ['jasmine'],
    });
  };
```

files  
再執行 npx karma start 會發現, 成功了, 但卻是 0 SUCCESS, 表示它還沒有撈 .sepc.ts 檔案.  要加入 files 設定.

```js
module.exports = function(config) {
    config.set({
      frameworks: ['jasmine'],
      files: ['./src/**/*.spec.ts']
    });
  };
```

執行後, 出現 WARN, 雖然 files 生效, 但它沒有正確方式處理 .js

```js
WARN [middleware:karma]: Unable to determine file type from the file extension, defaulting to js.
```

preprocessors  
看到上面的 WRN 可能會想加 mime，但我沒這麼作，我腦中想的是 ts 最終就是要被 webpack 去處理，所以加上前處理的設定 preprocessors. 當時, 加了 webpack 就要加入 webpack 設定值 (它不會自動去撈 webpack.config.js 的值, 也就是它們是 2份 設定值)

```js
module.exports = function(config) {
    config.set({
      frameworks: ['jasmine'],
      files: ['./src/**/*.spec.ts'],
      preprocessors: {
        './src/**/*.spec.ts': ['webpack']
      },
      webpack: {}
    });
  };
```

執行後, 數量正確了, 但其中 aaa.spec.ts 錯誤, (如下), 它找不到 aaa.ts 這個檔案. 那這個就是與 webpack 中的 resolve 有關了

```js
ERROR
  An error was thrown in afterAll
  Error: Cannot find module './aaa'
  webpackMissingModule
  eval code
  eval@[native code] ........
```

karma.conf.js 中 webpack 設定  
將設定從 { } 中 加入 resolve 如下.

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
      }
    });
  };
```

npx karma start 成功.

## 小結

與 js webpack karma jasmine (上個練習), 差異在於 @types/jasmine typescript ts-loader 要多裝, 然後 karma.conf.js 中的 webpack 設定, 要加入 resolve. 好像就這樣而已. 

### CodeReference

安裝

```bash
npm i webpack webpack-cli karma karma-cli jasmine @types/jasmine karma-jasmine karma-webpack typescript ts-loader -D
```

檔案結構

```bash
mkdir dist src public
touch webpack.config.js karma.conf.js src/index.ts 
touch src/index.spec.ts src/aaa.ts src/aaa.spec.ts
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
    }
  });
};
```