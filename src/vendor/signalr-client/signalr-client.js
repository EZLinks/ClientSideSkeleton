(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.signalR = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Transports", "./HttpClient"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Transports_1 = require("./Transports");
    var HttpClient_1 = require("./HttpClient");
    var ConnectionState;
    (function (ConnectionState) {
        ConnectionState[ConnectionState["Disconnected"] = 0] = "Disconnected";
        ConnectionState[ConnectionState["Connecting"] = 1] = "Connecting";
        ConnectionState[ConnectionState["Connected"] = 2] = "Connected";
    })(ConnectionState || (ConnectionState = {}));
    var Connection = (function () {
        function Connection(url, queryString, options) {
            if (queryString === void 0) { queryString = ""; }
            if (options === void 0) { options = {}; }
            this.dataReceivedCallback = function (data) { };
            this.connectionClosedCallback = function (error) { };
            this.url = url;
            this.queryString = queryString;
            this.httpClient = options.httpClient || new HttpClient_1.HttpClient();
            this.connectionState = ConnectionState.Disconnected;
        }
        Connection.prototype.start = function (transportName) {
            if (transportName === void 0) { transportName = "webSockets"; }
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var _a, e_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (this.connectionState != ConnectionState.Disconnected) {
                                throw new Error("Cannot start a connection that is not in the 'Disconnected' state");
                            }
                            this.transport = this.createTransport(transportName);
                            this.transport.onDataReceived = this.dataReceivedCallback;
                            this.transport.onError = function (e) { return _this.stopConnection(e); };
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 4, , 5]);
                            _a = this;
                            return [4 /*yield*/, this.httpClient.get(this.url + "/negotiate?" + this.queryString)];
                        case 2:
                            _a.connectionId = _b.sent();
                            this.queryString = "id=" + this.connectionId;
                            return [4 /*yield*/, this.transport.connect(this.url, this.queryString)];
                        case 3:
                            _b.sent();
                            this.connectionState = ConnectionState.Connected;
                            return [3 /*break*/, 5];
                        case 4:
                            e_1 = _b.sent();
                            console.log("Failed to start the connection.");
                            this.connectionState = ConnectionState.Disconnected;
                            this.transport = null;
                            throw e_1;
                        case 5:
                            ;
                            return [2 /*return*/];
                    }
                });
            });
        };
        Connection.prototype.createTransport = function (transportName) {
            if (transportName === "webSockets") {
                return new Transports_1.WebSocketTransport();
            }
            if (transportName === "serverSentEvents") {
                return new Transports_1.ServerSentEventsTransport(this.httpClient);
            }
            if (transportName === "longPolling") {
                return new Transports_1.LongPollingTransport(this.httpClient);
            }
            throw new Error("No valid transports requested.");
        };
        Connection.prototype.send = function (data) {
            if (this.connectionState != ConnectionState.Connected) {
                throw new Error("Cannot send data if the connection is not in the 'Connected' State");
            }
            return this.transport.send(data);
        };
        Connection.prototype.stop = function () {
            if (this.connectionState != ConnectionState.Connected) {
                throw new Error("Cannot stop the connection if it is not in the 'Connected' State");
            }
            this.stopConnection();
        };
        Connection.prototype.stopConnection = function (error) {
            this.transport.stop();
            this.transport = null;
            this.connectionState = ConnectionState.Disconnected;
            this.connectionClosedCallback(error);
        };
        Object.defineProperty(Connection.prototype, "dataReceived", {
            set: function (callback) {
                this.dataReceivedCallback = callback;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Connection.prototype, "connectionClosed", {
            set: function (callback) {
                this.connectionClosedCallback = callback;
            },
            enumerable: true,
            configurable: true
        });
        return Connection;
    }());
    exports.Connection = Connection;
});

},{"./HttpClient":2,"./Transports":4}],2:[function(require,module,exports){
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HttpClient = (function () {
        function HttpClient() {
        }
        HttpClient.prototype.get = function (url) {
            return this.xhr("GET", url);
        };
        HttpClient.prototype.post = function (url, content) {
            return this.xhr("POST", url, content);
        };
        HttpClient.prototype.xhr = function (method, url, content) {
            return new Promise(function (resolve, reject) {
                var xhr = new XMLHttpRequest();
                xhr.withCredentials = true;
                xhr.open(method, url, true);
                if (method === "POST" && content != null) {
                    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                }
                xhr.send(content);
                xhr.onload = function () {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(xhr.response);
                    }
                    else {
                        reject({
                            status: xhr.status,
                            statusText: xhr.statusText
                        });
                    }
                };
                xhr.onerror = function () {
                    reject({
                        status: xhr.status,
                        statusText: xhr.statusText
                    });
                };
            });
        };
        return HttpClient;
    }());
    exports.HttpClient = HttpClient;
});

},{}],3:[function(require,module,exports){
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Connection", "./Connection"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Connection_1 = require("./Connection");
    var Connection_2 = require("./Connection");
    exports.Connection = Connection_2.Connection;
    var HubConnection = (function () {
        function HubConnection(url, queryString, options) {
            var _this = this;
            this.connection = new Connection_1.Connection(url, queryString, options);
            this.connection.dataReceived = function (data) {
                _this.dataReceived(data);
            };
            this.callbacks = new Map();
            this.methods = new Map();
            this.id = 0;
        }
        HubConnection.prototype.dataReceived = function (data) {
            // TODO: separate JSON parsing
            // Can happen if a poll request was cancelled
            if (!data) {
                return;
            }
            var descriptor = JSON.parse(data);
            if (descriptor.Method === undefined) {
                var invocationResult = descriptor;
                var callback = this.callbacks[invocationResult.Id];
                if (callback != null) {
                    callback(invocationResult);
                    this.callbacks.delete(invocationResult.Id);
                }
            }
            else {
                var invocation = descriptor;
                var method = this.methods[invocation.Method];
                if (method != null) {
                    // TODO: bind? args?
                    method.apply(this, invocation.Arguments);
                }
            }
        };
        HubConnection.prototype.start = function (transportName) {
            return this.connection.start(transportName);
        };
        HubConnection.prototype.stop = function () {
            return this.connection.stop();
        };
        HubConnection.prototype.invoke = function (methodName) {
            var _this = this;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var id = this.id;
            this.id++;
            var invocationDescriptor = {
                "Id": id.toString(),
                "Method": methodName,
                "Arguments": args
            };
            var p = new Promise(function (resolve, reject) {
                _this.callbacks[id] = function (invocationResult) {
                    if (invocationResult.Error != null) {
                        reject(new Error(invocationResult.Error));
                    }
                    else {
                        resolve(invocationResult.Result);
                    }
                };
                //TODO: separate conversion to enable different data formats
                _this.connection.send(JSON.stringify(invocationDescriptor))
                    .catch(function (e) {
                    // TODO: remove callback
                    reject(e);
                });
            });
            return p;
        };
        HubConnection.prototype.on = function (methodName, method) {
            this.methods[methodName] = method;
        };
        Object.defineProperty(HubConnection.prototype, "connectionClosed", {
            set: function (callback) {
                this.connection.connectionClosed = callback;
            },
            enumerable: true,
            configurable: true
        });
        return HubConnection;
    }());
    exports.HubConnection = HubConnection;
});

},{"./Connection":1}],4:[function(require,module,exports){
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var WebSocketTransport = (function () {
        function WebSocketTransport() {
        }
        WebSocketTransport.prototype.connect = function (url, queryString) {
            var _this = this;
            if (queryString === void 0) { queryString = ""; }
            return new Promise(function (resolve, reject) {
                url = url.replace(/^http/, "ws");
                var connectUrl = url + "/ws?" + queryString;
                var webSocket = new WebSocket(connectUrl);
                webSocket.onopen = function (event) {
                    console.log("WebSocket connected to " + connectUrl);
                    _this.webSocket = webSocket;
                    resolve();
                };
                webSocket.onerror = function (event) {
                    reject();
                };
                webSocket.onmessage = function (message) {
                    console.log("(WebSockets transport) data received: " + message.data);
                    if (_this.onDataReceived) {
                        _this.onDataReceived(message.data);
                    }
                };
                webSocket.onclose = function (event) {
                    // webSocket will be null if the transport did not start successfully
                    if (_this.webSocket && (event.wasClean === false || event.code !== 1000)) {
                        if (_this.onError) {
                            _this.onError(event);
                        }
                    }
                };
            });
        };
        WebSocketTransport.prototype.send = function (data) {
            if (this.webSocket && this.webSocket.readyState === WebSocket.OPEN) {
                this.webSocket.send(data);
                return Promise.resolve();
            }
            return Promise.reject("WebSocket is not in the OPEN state");
        };
        WebSocketTransport.prototype.stop = function () {
            if (this.webSocket) {
                this.webSocket.close();
                this.webSocket = null;
            }
        };
        return WebSocketTransport;
    }());
    exports.WebSocketTransport = WebSocketTransport;
    var ServerSentEventsTransport = (function () {
        function ServerSentEventsTransport(httpClient) {
            this.httpClient = httpClient;
        }
        ServerSentEventsTransport.prototype.connect = function (url, queryString) {
            var _this = this;
            if (typeof (EventSource) === "undefined") {
                Promise.reject("EventSource not supported by the browser.");
            }
            this.queryString = queryString;
            this.url = url;
            var tmp = this.url + "/sse?" + this.queryString;
            return new Promise(function (resolve, reject) {
                var eventSource = new EventSource(_this.url + "/sse?" + _this.queryString);
                try {
                    eventSource.onmessage = function (e) {
                        if (_this.onDataReceived) {
                            _this.onDataReceived(e.data);
                        }
                    };
                    eventSource.onerror = function (e) {
                        reject();
                        // don't report an error if the transport did not start successfully
                        if (_this.eventSource && _this.onError) {
                            _this.onError(e);
                        }
                    };
                    eventSource.onopen = function () {
                        _this.eventSource = eventSource;
                        resolve();
                    };
                }
                catch (e) {
                    return Promise.reject(e);
                }
            });
        };
        ServerSentEventsTransport.prototype.send = function (data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.httpClient.post(this.url + "/send?" + this.queryString, data)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        ServerSentEventsTransport.prototype.stop = function () {
            if (this.eventSource) {
                this.eventSource.close();
                this.eventSource = null;
            }
        };
        return ServerSentEventsTransport;
    }());
    exports.ServerSentEventsTransport = ServerSentEventsTransport;
    var LongPollingTransport = (function () {
        function LongPollingTransport(httpClient) {
            this.httpClient = httpClient;
        }
        LongPollingTransport.prototype.connect = function (url, queryString) {
            this.url = url;
            this.queryString = queryString;
            this.shouldPoll = true;
            this.poll(url + "/poll?" + this.queryString);
            return Promise.resolve();
        };
        LongPollingTransport.prototype.poll = function (url) {
            var _this = this;
            if (!this.shouldPoll) {
                return;
            }
            var pollXhr = new XMLHttpRequest();
            pollXhr.onload = function () {
                if (pollXhr.status == 200) {
                    if (_this.onDataReceived) {
                        _this.onDataReceived(pollXhr.response);
                    }
                    _this.poll(url);
                }
                else if (_this.pollXhr.status == 204) {
                    // TODO: closed event?
                }
                else {
                    if (_this.onError) {
                        _this.onError({
                            status: pollXhr.status,
                            statusText: pollXhr.statusText
                        });
                    }
                }
            };
            pollXhr.onerror = function () {
                if (_this.onError) {
                    _this.onError({
                        status: pollXhr.status,
                        statusText: pollXhr.statusText
                    });
                }
            };
            pollXhr.ontimeout = function () {
                _this.poll(url);
            };
            this.pollXhr = pollXhr;
            this.pollXhr.open("GET", url, true);
            // TODO: consider making timeout configurable
            this.pollXhr.timeout = 110000;
            this.pollXhr.send();
        };
        LongPollingTransport.prototype.send = function (data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.httpClient.post(this.url + "/send?" + this.queryString, data)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        LongPollingTransport.prototype.stop = function () {
            this.shouldPoll = false;
            if (this.pollXhr) {
                this.pollXhr.abort();
                this.pollXhr = null;
            }
        };
        return LongPollingTransport;
    }());
    exports.LongPollingTransport = LongPollingTransport;
});

},{}]},{},[3])(3)
});