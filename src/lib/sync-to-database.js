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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncEmailsToDatabase = syncEmailsToDatabase;
var p_limit_1 = require("p-limit");
var client_1 = require("@prisma/client");
var db_1 = require("@/server/db");
function syncEmailsToDatabase(emails, accountId) {
    return __awaiter(this, void 0, void 0, function () {
        var limit, _i, emails_1, email, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("attempting to sync emails to database", emails.length);
                    limit = (0, p_limit_1.default)(5);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    _i = 0, emails_1 = emails;
                    _a.label = 2;
                case 2:
                    if (!(_i < emails_1.length)) return [3 /*break*/, 5];
                    email = emails_1[_i];
                    return [4 /*yield*/, upsertEmail(email, accountId, 0)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_1 = _a.sent();
                    console.log("oopsies", error_1);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function upsertEmail(email, accountId, index) {
    return __awaiter(this, void 0, void 0, function () {
        var emailLabelType, addressesToUpsert, _i, _a, address, upsertedAddresses, _b, _c, address, upsertedAddress, addressMap_1, fromAddress, toAddresses, ccAddresses, bccAddresses, replyToAddresses, thread, threadEmails, threadFolderType, _d, threadEmails_1, threadEmail, _e, _f, attachment, error_2;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    console.log('upserting email', index);
                    _g.label = 1;
                case 1:
                    _g.trys.push([1, 14, , 15]);
                    emailLabelType = 'inbox';
                    if (email.sysLabels.includes('inbox') || email.sysLabels.includes('important')) {
                        emailLabelType = 'inbox';
                    }
                    else if (email.sysLabels.includes('sent')) {
                        emailLabelType = 'sent';
                    }
                    else if (email.sysLabels.includes('draft')) {
                        emailLabelType = 'draft';
                    }
                    addressesToUpsert = new Map();
                    for (_i = 0, _a = __spreadArray(__spreadArray(__spreadArray(__spreadArray([email.from], email.to, true), email.cc, true), email.bcc, true), email.replyTo, true); _i < _a.length; _i++) {
                        address = _a[_i];
                        addressesToUpsert.set(address.address, address);
                    }
                    upsertedAddresses = [];
                    _b = 0, _c = addressesToUpsert.values();
                    _g.label = 2;
                case 2:
                    if (!(_b < _c.length)) return [3 /*break*/, 5];
                    address = _c[_b];
                    return [4 /*yield*/, upsertEmailAddress(address, accountId)];
                case 3:
                    upsertedAddress = _g.sent();
                    upsertedAddresses.push(upsertedAddress);
                    _g.label = 4;
                case 4:
                    _b++;
                    return [3 /*break*/, 2];
                case 5:
                    addressMap_1 = new Map(upsertedAddresses.filter(Boolean).map(function (address) { return [address.address, address]; }));
                    fromAddress = addressMap_1.get(email.from.address);
                    if (!fromAddress) {
                        console.log("Failed to upsert from addres for email ".concat(email.bodySnippet));
                        return [2 /*return*/];
                    }
                    toAddresses = email.to.map(function (addr) { return addressMap_1.get(addr.address); }).filter(Boolean);
                    ccAddresses = email.cc.map(function (addr) { return addressMap_1.get(addr.address); }).filter(Boolean);
                    bccAddresses = email.bcc.map(function (addr) { return addressMap_1.get(addr.address); }).filter(Boolean);
                    replyToAddresses = email.replyTo.map(function (addr) { return addressMap_1.get(addr.address); }).filter(Boolean);
                    return [4 /*yield*/, db_1.db.thread.upsert({
                            where: { id: email.threadId },
                            update: {
                                subject: email.subject,
                                accountId: accountId,
                                lastMessageDate: new Date(email.sentAt),
                                done: false,
                                participantIds: __spreadArray([], new Set(__spreadArray(__spreadArray(__spreadArray([
                                    fromAddress.id
                                ], toAddresses.map(function (a) { return a.id; }), true), ccAddresses.map(function (a) { return a.id; }), true), bccAddresses.map(function (a) { return a.id; }), true)), true)
                            },
                            create: {
                                id: email.threadId,
                                accountId: accountId,
                                subject: email.subject,
                                done: false,
                                draftStatus: emailLabelType === 'draft',
                                inboxStatus: emailLabelType === 'inbox',
                                sentStatus: emailLabelType === 'sent',
                                lastMessageDate: new Date(email.sentAt),
                                participantIds: __spreadArray([], new Set(__spreadArray(__spreadArray(__spreadArray([
                                    fromAddress.id
                                ], toAddresses.map(function (a) { return a.id; }), true), ccAddresses.map(function (a) { return a.id; }), true), bccAddresses.map(function (a) { return a.id; }), true)), true)
                            }
                        })];
                case 6:
                    thread = _g.sent();
                    //upsert the email
                    return [4 /*yield*/, db_1.db.email.upsert({
                            where: { id: email.id },
                            update: {
                                threadId: thread.id,
                                createdTime: new Date(email.createdTime),
                                lastModifiedTime: new Date(),
                                sentAt: new Date(email.sentAt),
                                receivedAt: new Date(email.receivedAt),
                                internetMessageId: email.internetMessageId,
                                subject: email.subject,
                                sysLabels: email.sysLabels,
                                keywords: email.keywords,
                                sysClassifications: email.sysClassifications,
                                sensitivity: email.sensitivity,
                                meetingMessageMethod: email.meetingMessageMethod,
                                fromId: fromAddress.id,
                                to: { set: toAddresses.map(function (a) { return ({ id: a.id }); }) },
                                cc: { set: ccAddresses.map(function (a) { return ({ id: a.id }); }) },
                                bcc: { set: bccAddresses.map(function (a) { return ({ id: a.id }); }) },
                                replyTo: { set: replyToAddresses.map(function (a) { return ({ id: a.id }); }) },
                                hasAttachments: email.hasAttachments,
                                internetHeaders: email.internetHeaders,
                                body: email.body,
                                bodySnippet: email.bodySnippet,
                                inReplyTo: email.inReplyTo,
                                references: email.references,
                                threadIndex: email.threadIndex,
                                nativeProperties: email.nativeProperties,
                                folderId: email.folderId,
                                omitted: email.omitted,
                                emailLabel: emailLabelType,
                            },
                            create: {
                                id: email.id,
                                emailLabel: emailLabelType,
                                threadId: thread.id,
                                createdTime: new Date(email.createdTime),
                                lastModifiedTime: new Date(),
                                sentAt: new Date(email.sentAt),
                                receivedAt: new Date(email.receivedAt),
                                internetMessageId: email.internetMessageId,
                                subject: email.subject,
                                sysLabels: email.sysLabels,
                                internetHeaders: email.internetHeaders,
                                keywords: email.keywords,
                                sysClassifications: email.sysClassifications,
                                sensitivity: email.sensitivity,
                                meetingMessageMethod: email.meetingMessageMethod,
                                fromId: fromAddress.id,
                                to: { connect: toAddresses.map(function (a) { return ({ id: a.id }); }) },
                                cc: { connect: ccAddresses.map(function (a) { return ({ id: a.id }); }) },
                                bcc: { connect: bccAddresses.map(function (a) { return ({ id: a.id }); }) },
                                replyTo: { connect: replyToAddresses.map(function (a) { return ({ id: a.id }); }) },
                                hasAttachments: email.hasAttachments,
                                body: email.body,
                                bodySnippet: email.bodySnippet,
                                inReplyTo: email.inReplyTo,
                                references: email.references,
                                threadIndex: email.threadIndex,
                                nativeProperties: email.nativeProperties,
                                folderId: email.folderId,
                                omitted: email.omitted,
                            }
                        })];
                case 7:
                    //upsert the email
                    _g.sent();
                    return [4 /*yield*/, db_1.db.email.findMany({
                            where: { threadId: thread.id },
                            orderBy: { receivedAt: 'asc' }
                        })];
                case 8:
                    threadEmails = _g.sent();
                    threadFolderType = 'sent';
                    for (_d = 0, threadEmails_1 = threadEmails; _d < threadEmails_1.length; _d++) {
                        threadEmail = threadEmails_1[_d];
                        if (threadEmail.emailLabel === 'inbox') {
                            threadFolderType = 'inbox';
                            break;
                        }
                        else if (threadEmail.emailLabel === 'draft') {
                            threadFolderType = 'draft';
                        }
                    }
                    return [4 /*yield*/, db_1.db.thread.update({
                            where: { id: thread.id },
                            data: {
                                draftStatus: threadFolderType === 'draft',
                                inboxStatus: threadFolderType === 'inbox',
                                sentStatus: threadFolderType === 'sent',
                            }
                        })];
                case 9:
                    _g.sent();
                    _e = 0, _f = email.attachments;
                    _g.label = 10;
                case 10:
                    if (!(_e < _f.length)) return [3 /*break*/, 13];
                    attachment = _f[_e];
                    return [4 /*yield*/, upsertAttachment(email.id, attachment)];
                case 11:
                    _g.sent();
                    _g.label = 12;
                case 12:
                    _e++;
                    return [3 /*break*/, 10];
                case 13: return [3 /*break*/, 15];
                case 14:
                    error_2 = _g.sent();
                    if (error_2 instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                        console.log("Prisma error for email ".concat(email.id, ": ").concat(error_2.message));
                    }
                    else {
                        console.log('Unknown error for email ${email.id}:', error_2);
                    }
                    return [3 /*break*/, 15];
                case 15: return [2 /*return*/];
            }
        });
    });
}
function upsertAttachment(emailId, attachment) {
    return __awaiter(this, void 0, void 0, function () {
        var error_3;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, db_1.db.emailAttachment.upsert({
                            where: { id: (_a = attachment.id) !== null && _a !== void 0 ? _a : "" },
                            update: {
                                name: attachment.name,
                                mimeType: attachment.mimeType,
                                size: attachment.size,
                                inline: attachment.inline,
                                contentId: attachment.contentId,
                                content: attachment.content,
                                contentLocation: attachment.contentLocation,
                            },
                            create: {
                                id: attachment.id,
                                emailId: emailId,
                                name: attachment.name,
                                mimeType: attachment.mimeType,
                                size: attachment.size,
                                inline: attachment.inline,
                                contentId: attachment.contentId,
                                content: attachment.content,
                                contentLocation: attachment.contentLocation
                            }
                        })];
                case 1:
                    _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _b.sent();
                    console.log("Failed to upsert attachment for email ".concat(emailId, ":"), error_3);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function upsertEmailAddress(address, accountId) {
    return __awaiter(this, void 0, void 0, function () {
        var existingAddress, error_4;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, db_1.db.emailAddress.findUnique({
                            where: { accountId_address: { accountId: accountId, address: (_a = address.address) !== null && _a !== void 0 ? _a : "" } },
                        })];
                case 1:
                    existingAddress = _c.sent();
                    if (!existingAddress) return [3 /*break*/, 3];
                    return [4 /*yield*/, db_1.db.emailAddress.update({
                            where: { id: existingAddress.id },
                            data: { name: address.name, raw: address.raw },
                        })];
                case 2: return [2 /*return*/, _c.sent()];
                case 3: return [4 /*yield*/, db_1.db.emailAddress.create({
                        data: { address: (_b = address.address) !== null && _b !== void 0 ? _b : "", name: address.name, raw: address.raw, accountId: accountId },
                    })];
                case 4: return [2 /*return*/, _c.sent()];
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_4 = _c.sent();
                    console.log('Failed to upsert email address:', error_4);
                    return [2 /*return*/, null];
                case 7: return [2 /*return*/];
            }
        });
    });
}
