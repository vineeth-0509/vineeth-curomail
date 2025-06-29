"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
var axios_1 = require("axios");
var db_1 = require("@/server/db");
var sync_to_database_1 = require("./sync-to-database");
var Account = /** @class */ (function () {
    function Account(token) {
        this.token = token;
    }
    Account.prototype.startSync = function (daysWithin) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.post("https://api.aurinko.io/v1/email/sync", {}, {
                            headers: {
                                Authorization: "Bearer ".concat(this.token),
                            },
                            params: {
                                daysWithin: 2,
                                bodyType: "html",
                            },
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    Account.prototype.getUpdatedEmails = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var params, response;
            var deltaToken = _b.deltaToken, pageToken = _b.pageToken;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        params = {};
                        if (deltaToken)
                            params.deltaToken = deltaToken;
                        if (pageToken)
                            params.pageToken = pageToken;
                        return [4 /*yield*/, axios_1.default.get("https://api.aurinko.io/v1/email/sync/updated", {
                                params: params,
                                headers: { Authorization: "Bearer ".concat(this.token) },
                            })];
                    case 1:
                        response = _c.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    Account.prototype.performEmailSync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var daysWithin, syncResponse, storeDeltaToken, updatedResponse, allEmails, error_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 10, , 11]);
                        daysWithin = 3;
                        return [4 /*yield*/, this.startSync(daysWithin)];
                    case 1:
                        syncResponse = _b.sent();
                        _b.label = 2;
                    case 2:
                        if (!!syncResponse.ready) return [3 /*break*/, 5];
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 10000); })];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, this.startSync(daysWithin)];
                    case 4:
                        syncResponse = _b.sent();
                        return [3 /*break*/, 2];
                    case 5:
                        storeDeltaToken = syncResponse.syncUpdatedToken;
                        return [4 /*yield*/, this.getUpdatedEmails({
                                deltaToken: storeDeltaToken,
                            })];
                    case 6:
                        updatedResponse = _b.sent();
                        if (updatedResponse.nextDeltaToken) {
                            //sync has completed
                            storeDeltaToken = updatedResponse.nextDeltaToken;
                        }
                        allEmails = updatedResponse.records;
                        _b.label = 7;
                    case 7:
                        if (!updatedResponse.nextPageToken) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.getUpdatedEmails({
                                pageToken: updatedResponse.nextPageToken,
                            })];
                    case 8:
                        updatedResponse = _b.sent();
                        allEmails = allEmails.concat(updatedResponse.records);
                        if (updatedResponse.nextDeltaToken) {
                            //sync has ended
                            storeDeltaToken = updatedResponse.nextDeltaToken;
                        }
                        return [3 /*break*/, 7];
                    case 9:
                        console.log("intial sync completed, we have synced", allEmails.length, "emails");
                        //store the latest delta token for the future incremental syncs.
                        return [2 /*return*/, {
                                emails: allEmails,
                                deltaToken: storeDeltaToken,
                            }];
                    case 10:
                        error_1 = _b.sent();
                        if (axios_1.default.isAxiosError(error_1)) {
                            console.error("Error during sync:", JSON.stringify((_a = error_1.response) === null || _a === void 0 ? void 0 : _a.data, null, 2));
                        }
                        else {
                            console.error("Error during sync:", error_1);
                        }
                        return [3 /*break*/, 11];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    Account.prototype.syncEmails = function () {
        return __awaiter(this, void 0, void 0, function () {
            var account, response, storedDeltaToken, allEmails;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.account.findUnique({
                            where: {
                                accessToken: this.token,
                            },
                        })];
                    case 1:
                        account = _a.sent();
                        if (!account)
                            throw new Error("Account not found");
                        if (!account.nextDeltaToken)
                            throw new Error("Account not ready for sync");
                        return [4 /*yield*/, this.getUpdatedEmails({
                                deltaToken: account.nextDeltaToken,
                            })];
                    case 2:
                        response = _a.sent();
                        storedDeltaToken = account.nextDeltaToken;
                        allEmails = response.records;
                        if (response.nextDeltaToken) {
                            storedDeltaToken = response.nextDeltaToken;
                        }
                        _a.label = 3;
                    case 3:
                        if (!response.nextPageToken) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.getUpdatedEmails({
                                pageToken: response.nextPageToken,
                            })];
                    case 4:
                        response = _a.sent();
                        allEmails = allEmails.concat(response.records);
                        if (response.nextDeltaToken) {
                            storedDeltaToken = response.nextDeltaToken;
                        }
                        return [3 /*break*/, 3];
                    case 5:
                        try {
                            (0, sync_to_database_1.syncEmailsToDatabase)(allEmails, account.id);
                        }
                        catch (error) {
                            console.error("Error during sync:", error);
                        }
                        return [4 /*yield*/, db_1.db.account.update({
                                where: {
                                    id: account.id,
                                },
                                data: {
                                    nextDeltaToken: storedDeltaToken,
                                },
                            })];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, {
                                email: allEmails,
                                deltaToken: storedDeltaToken,
                            }];
                }
            });
        });
    };
    Account.prototype.sendEmail = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var response, error_2;
            var _c;
            var from = _b.from, subject = _b.subject, body = _b.body, inReplyTo = _b.inReplyTo, references = _b.references, to = _b.to, cc = _b.cc, bcc = _b.bcc, replyTo = _b.replyTo, threadId = _b.threadId;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.post("https://api.aurinko.io/v1/email/messages", {
                                from: from,
                                subject: subject,
                                body: body,
                                inReplyTo: inReplyTo,
                                references: references,
                                to: to,
                                cc: cc,
                                threadId: threadId,
                                bcc: bcc,
                                replyTo: [replyTo],
                            }, {
                                params: {
                                    returnIds: true,
                                },
                                headers: {
                                    Authorization: "Bearer ".concat(this.token),
                                },
                            })];
                    case 1:
                        response = _d.sent();
                        console.log("email sent", response.data);
                        return [2 /*return*/, response.data];
                    case 2:
                        error_2 = _d.sent();
                        if (axios_1.default.isAxiosError(error_2)) {
                            console.error("Error sendin email:", JSON.stringify((_c = error_2.response) === null || _c === void 0 ? void 0 : _c.data, null, 2));
                        }
                        else {
                            console.error("Error sending email:", error_2);
                        }
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return Account;
}());
exports.Account = Account;
