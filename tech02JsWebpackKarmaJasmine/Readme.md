# 了解 Karma

前個練習 ts webpack
https://github.com/snowray712000/TechTsJs/tree/main/tech01TsWebpackHelloWorld 

難  
成功建立 ts 與 webpack 後，想要有 unit test，選用 karma + jasmine 但是一次要到位，把 ts webpack karma jasmine 一切建立好，一直失敗，所以先了解 '更小單元' karma

體會 karma 先  
更小單元, 就是 沒有 babel (也就是用 es5 語法), 再結合 webpack 試試.

## 方法

### 先能執行 webpack

安裝 webpack karma jasmine

```bash
npm i webpack webpack-cli karma karma-cli jasmine -D
```

檔案結構  
正如之前說的, 輸出通常放 dist 資料夾, 輸入放 src 資料夾, 有一個進入點 index.js.

```bash
mkdir dist src
touch src/index.js webpack.config.js karma.conf.js
```

webpack設定  
先讓 webpack 可以運作起來, 這也是我第一次用 webpack + js. module.exports 這種語法, 應該是 Node.js 的標準 export 語法.

```js
module.exports = {
    entry: './src/index.js'
}
```

執行  
目前可以執行第一次, 產生出一個檔案.

其它  
過程會跳出一個 WARNING, 你可以加 --mode development 就會沒有, 也可以加個 -w , 像之前一樣. 只要 index.ts 有變更就會自動執行. (若 -w 要中斷, 按 ctrl + c)

```bash
npx wepback
```

### webpack import

import  
當初要用 webpack, 最主就是要處理 import 的問題, 所以一定要有能夠 import.

es5  
在 Node.js 好像要用 require 方式作為 import 手段.

程式如下  
aaa.js 就像 export 一個 { }, 然後裡面有個 aaa 可以給人用.

```js
/// ./src/aaa.js
module.exports = {
    aaa: function (aaa) {
        return 5
    }
}

/// ./src/index.js
var fileAAA = require('./aaa')
console.log ( fileAAA.aaa () + 35)
```

執行  
同樣, 再執行 npx webpack

html驗證  
在 dist 中會產生一個 main.js, 你在 dist 資料夾中, 新增一個 index.html, 然後引用 main.js, 然後去看 index.html, 就會成功

### karma

建立測試檔案 .spec.js  
假設 aaa.js 對應的測試, 通常叫 aaa.spec.js 或 aaa.test.js. 建立完成後, 內容大概下面那樣. 下面故意錯, 等流程建立起來後, 再真的引用 aaa.js 的內容來測試.

```js
describe ( 'test1' , () => {
    it ('aaa', () => {
        expect(1).toBe(2) // 故意錯
    })
} )
```

執行 karma start  
當我們用 npx karma start 執行時, 應該會出現錯誤訊息, 它告訴我們, 設定檔要的長相.

錯誤訊息

```bash
littlesnow@mini-2021 tech09 % npx karma start
01 01 2022 22:13:40.502:ERROR [config]: Config file must export a function!
  module.exports = function(config) {
    config.set({
      // your config
    });
  };
```

karma 設定  
將錯誤訊息的內容， copy paste 到 karma.conf.js 中. 執行後, 似乎可行!!

```js
module.exports = function(config) {
    config.set({
        // your config
    });
}
```

```bash
littlesnow@mini-2021 tech09 % npx karma start
01 01 2022 22:15:55.603:WARN [karma]: No captured browser, open http://localhost:9876/
01 01 2022 22:15:56.478:INFO [karma-server]: Karma v6.3.9 server started at http://localhost:9876/
```

打開連結  
用 cmd + 點擊，用 browser 打開連結後, 才是真正的執行 test. 這時候出現了一個錯誤訊息. 過了 30 秒後, 又接著出現另一個錯誤訊息

```bash
01 01 2022 22:17:47.109:INFO [Safari 14.1.1 (Mac OS 10.15.7)]: Connected on socket zCD0TIIwLadIs9AdAAAB with id manual-3464
Safari 14.1.1 (Mac OS 10.15.7) ERROR
  You need to include some adapter that implements __karma__.start method!

01 01 2022 22:18:17.129:WARN [Safari 14.1.1 (Mac OS 10.15.7)]: Disconnected (0 times) , because no message in 30000 ms.
Safari 14.1.1 (Mac OS 10.15.7) ERROR
  Disconnected , because no message in 30000 ms.
```

關鍵字 adapter  
上面錯誤訊息中，some adapter 來實作 __karma__.start，似乎 adapter 就是指 jasmine 或 mocha 這些東西, 這些東西就是描述測試檔的

jasmine  
雖然我們已經安裝 jasmine 在一開始, 又怎麼會說我們沒有 jasmine 呢? 我是這樣理解 jasmine 是個函式庫, 是定義 describe it expect 那些用來測試的函式 (將會寫在 .spec.js 中的), 但 adapter 是 karma-jasmine 是一個較接用的. 不太一樣. 同樣的, 若使用 mocha 而不使用 jasmine, 就會有對應的 karma-mocha.

karma-jasmine  
npm i karma-jasmine 安裝 adapter 後, 再設定 karma.conf.js, 新增一個 frameworks, 

```js
module.exports = function(config) {
    config.set({
        frameworks: ['jasmine']
    });
}
```

錯誤訊息  
若只有指定 frameworks 是 jasmine, 但沒安裝 karma-jasmine 就會出現下面這串錯誤

```js
littlesnow@mini-2021 tech09 % npx karma start         
01 01 2022 22:33:57.764:ERROR [karma-server]: Server start failed on port 9876: Error: No provider for "framework:jasmine"! (Resolving: framework:jasmine)
```

正確訊息  
(但 TOTAL 應該是1，而且應該有一個錯誤)

```js
01 01 2022 22:49:04.343:WARN [karma]: No captured browser, open http://localhost:9876/
01 01 2022 22:49:04.352:INFO [karma-server]: Karma v6.3.9 server started at http://localhost:9876/
01 01 2022 22:49:04.596:INFO [Safari 14.1.1 (Mac OS 10.15.7)]: Connected on socket 5BciBIadwe4Bt71zAAAB with id manual-8027
Safari 14.1.1 (Mac OS 10.15.7): Executed 0 of 0 SUCCESS (0.005 secs / 0 secs)
TOTAL: 0 SUCCESS
```

設定 files  

```js
module.exports = function(config) {
    config.set({
        files: ['./src/**/*.spec.js'],
        frameworks: ['jasmine']
    });
}
```

正確 (發現一個測試不通過)

```js
ittlesnow@mini-2021 tech09 % npx karma start
01 01 2022 22:55:15.439:WARN [karma]: No captured browser, open http://localhost:9876/
01 01 2022 22:55:15.449:INFO [karma-server]: Karma v6.3.9 server started at http://localhost:9876/
01 01 2022 22:55:16.118:INFO [Safari 14.1.1 (Mac OS 10.15.7)]: Connected on socket RUUHIHYetuZx0uc-AAAB with id manual-8027
Safari 14.1.1 (Mac OS 10.15.7) test1 aaa FAILED
        Expected 1 to be 2.
        <Jasmine>
        src/aaa.spec.js:5:24
        <Jasmine>
Safari 14.1.1 (Mac OS 10.15.7): Executed 1 of 1 (1 FAILED) (0.006 secs / 0.002 secs)
TOTAL: 1 FAILED, 0 SUCCESS
```

把 aaa.spec.js 改正確  
expect(1).toBe(2) 改為 expect(2).toBe(2)，存檔，就正確了。

```js
01 01 2022 22:57:43.761:INFO [filelist]: Changed file "/Users/Shared/coding/TechWebpack/tech09/src/aaa.spec.js".
Safari 14.1.1 (Mac OS 10.15.7): Executed 1 of 1 SUCCESS (0.011 secs / 0.001 secs)
TOTAL: 1 SUCCESS
```

### aaa.spec.js 測 aaa.js

真正的測試, 應該是如下.

```js
var aaaM = require('./aaa')

describe ( 'test1' , () => {
    it ('aaa', () => {
        expect ( aaaM.aaa() ).toBe( 4 ) // 故意錯
    })
} )
```

錯誤訊息  
不認識 require, 因為目前沒有經過 webpack, 而是直接測 spec 唷.

```js
Safari 14.1.1 (Mac OS 10.15.7) ERROR
  An error was thrown in afterAll
  ReferenceError: Can't find variable: require
  global code@src/aaa.spec.js:1:19
Safari 14.1.1 (Mac OS 10.15.7): Executed 0 of 0 ERROR (0.007 secs / 0 secs)
```

preprocessors  
前處理, 再測試. 如下圖, 在 karma.conf.js 中加入前處理. 然後就會出現錯誤.

```js
module.exports = function(config) {
    config.set({
        files: ['./src/**/*.spec.js'],
        frameworks: ['jasmine','webpack'],
        preprocessors: {
            './src/*.spec.js': ['webpack']
        }
    });
}
```

錯誤訊息  

```js
01 01 2022 23:04:27.840:ERROR [plugin]: Cannot load "webpack", it is not registered!
  Perhaps you are missing some plugin?
```

安裝 karma-webpack  

```bash
npm i karma-webpack -D
```

新錯誤  
要在 karma 設定檔加入 preprocessors 要用的設定檔.

```bash
webpack was not included as a framework in karma configuration, setting this automatically...
01 01 2022 23:14:14.437:ERROR [plugin]: Cannot load "webpack"!
  TypeError: Cannot read properties of undefined (reading 'entry')
```

加入 webpack

```js
module.exports = function(config) {
    config.set({
        files: ['./src/**/*.spec.js'],
        frameworks: ['jasmine'],
        preprocessors: {
            './src/*.spec.js': ['webpack']
        },
        webpack: {
        }
    });
}
```

成功

```js
Safari 14.1.1 (Mac OS 10.15.7) test1 aaa FAILED
        Expected 5 to be 52.
        <Jasmine>
Safari 14.1.1 (Mac OS 10.15.7): Executed 1 of 1 (1 FAILED) (0.003 secs / 0.001 secs)
TOTAL: 1 FAILED, 0 SUCCESS
```

多個 spec  
直接將 aaa.spec.js copy 為 aaa2.spec.js ，就會發現，是 2 個 ERROR，
若把一個改正確，一個錯誤，也可以正確為 1 SUCCESS 1 ERROR

## 總結

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