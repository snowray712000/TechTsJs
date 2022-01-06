/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function() {

eval("\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nvar __generator = (this && this.__generator) || function (thisArg, body) {\n    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;\n    return g = { next: verb(0), \"throw\": verb(1), \"return\": verb(2) }, typeof Symbol === \"function\" && (g[Symbol.iterator] = function() { return this; }), g;\n    function verb(n) { return function (v) { return step([n, v]); }; }\n    function step(op) {\n        if (f) throw new TypeError(\"Generator is already executing.\");\n        while (_) try {\n            if (f = 1, y && (t = op[0] & 2 ? y[\"return\"] : op[0] ? y[\"throw\"] || ((t = y[\"return\"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;\n            if (y = 0, t) op = [op[0] & 2, t.value];\n            switch (op[0]) {\n                case 0: case 1: t = op; break;\n                case 4: _.label++; return { value: op[1], done: false };\n                case 5: _.label++; y = op[1]; op = [0]; continue;\n                case 7: op = _.ops.pop(); _.trys.pop(); continue;\n                default:\n                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }\n                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }\n                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }\n                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }\n                    if (t[2]) _.ops.pop();\n                    _.trys.pop(); continue;\n            }\n            op = body.call(thisArg, _);\n        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }\n        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };\n    }\n};\nvar wgslVertex = \"[[stage(vertex)]]\\nfn main() -> [[builtin(position)]] vec4<f32> {\\n    return vec4<f32>(0.0, 0.0, 0.0, 1.0);\\n}\";\nvar wgslFragment = \"[[stage(fragment)]]\\nfn main() -> [[location(0)]] vec4<f32> {\\n    return vec4<f32>(0.4, 0.4, 0.8, 1.0);\\n}\";\nfunction aaa(domCanvas) {\n    return __awaiter(this, void 0, void 0, function () {\n        function initDevice() {\n            return __awaiter(this, void 0, void 0, function () {\n                var adapter;\n                return __generator(this, function (_a) {\n                    switch (_a.label) {\n                        case 0:\n                            if (!navigator.gpu) {\n                                throw new Error(\"navigator.gpu is null. Browser maybe not support or setting error, try use Chrome Canary.\");\n                            }\n                            return [4 /*yield*/, navigator.gpu.requestAdapter()];\n                        case 1:\n                            adapter = _a.sent();\n                            if (adapter == null) {\n                                throw new Error(\"navigator.gpu.requestAdapter null. Browser maybe not support or setting error, try use Chrome Canary.\");\n                            }\n                            return [4 /*yield*/, adapter.requestDevice()];\n                        case 2: return [2 /*return*/, _a.sent()];\n                    }\n                });\n            });\n        }\n        function gCommand() {\n            var cmd = device.createCommandEncoder();\n            // 1. 設定最終畫圖的目標 color buffer 與 depth buffer (作為 pass 的參數, 記得 pass 屬於 command)\n            var conf = gRenderPassDescriptor();\n            var pass = cmd.beginRenderPass(conf); // 在 beginPass 與 endPass 之間加入其它流程 (目前只有 pipeline 設定)\n            // 2. 設定 pipeline (layout, Shader Code 之類的)\n            var pipe = gPipeline();\n            pass.setPipeline(pipe);\n            pass.endPass();\n            var cmdbuf = cmd.finish();\n            return [cmdbuf];\n            function gRenderPassDescriptor() {\n                var context = gContextOfCanvas();\n                var viewCanvas = context.getCurrentTexture().createView();\n                var colorAttach = {\n                    view: viewCanvas,\n                    loadValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },\n                    storeOp: 'store'\n                };\n                var re = {\n                    colorAttachments: [colorAttach]\n                };\n                // re.depthStencilAttachment // 一開始不要太複雜\n                return re;\n                function gContextOfCanvas() {\n                    var r1 = domCanvas.getContext(\"webgpu\");\n                    if (r1 == null) {\n                        throw new Error(\"canvas.getContext webgpu null\");\n                    }\n                    var confCanvas = {\n                        device: device,\n                        format: \"bgra8unorm\",\n                    };\n                    confCanvas.usage = GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC;\n                    r1.configure(confCanvas);\n                    return r1;\n                }\n            }\n            function gPipeline() {\n                var pipeConf = {\n                    vertex: gVertexState(),\n                    fragment: gFragmentState(),\n                };\n                var pipe = device.createRenderPipeline(pipeConf);\n                return pipe;\n                function gFragmentState() {\n                    var module = device.createShaderModule({ code: wgslFragment });\n                    var colorConf = {\n                        format: \"bgra8unorm\"\n                    };\n                    var colorState = {\n                        module: module,\n                        entryPoint: \"main\",\n                        targets: [colorConf]\n                    };\n                    return colorState;\n                }\n                function gVertexState() {\n                    var module = device.createShaderModule({ code: wgslVertex });\n                    var vstate = {\n                        module: module,\n                        entryPoint: 'main',\n                    };\n                    vstate.buffers = [gVStateBuffer()]; // 因為 shader code 裡有用到 vertex buffer, 所以沒設時會 error \n                    return vstate;\n                    function gVStateBuffer() {\n                        var posAttrConf = {\n                            shaderLocation: 0,\n                            offset: 0,\n                            format: 'float32x3'\n                        };\n                        var posBuf = {\n                            attributes: [posAttrConf],\n                            arrayStride: 4 * 3 // sizeof(float) * 3\n                        };\n                        posBuf.stepMode = 'vertex'; // instance 是另一個，但還不知道差別 \n                        return posBuf;\n                    }\n                }\n            }\n        }\n        var device, commandBuf;\n        return __generator(this, function (_a) {\n            switch (_a.label) {\n                case 0: return [4 /*yield*/, initDevice()]; // 很重要的 Interface  (若不支援, 則會丟出例外)\n                case 1:\n                    device = _a.sent() // 很重要的 Interface  (若不支援, 則會丟出例外)\n                    ;\n                    commandBuf = gCommand();\n                    device.queue.submit(commandBuf);\n                    return [2 /*return*/];\n            }\n        });\n    });\n}\n$(function () {\n    try {\n        var r1 = $('#canvas-container > canvas');\n        var r2 = r1[0];\n        aaa(r2);\n    }\n    catch (error) {\n        console.log(error);\n        $('#not-supported').show();\n    }\n});\n\n\n//# sourceURL=webpack:///./src/index.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/index.ts"]();
/******/ 	
/******/ })()
;