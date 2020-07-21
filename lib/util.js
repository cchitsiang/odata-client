"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAuthorizationPair = exports.FormatODataDateTimedate = exports.ConvertDateFromODataTime = void 0;
const base64_1 = require("./base64");
/**
 * ConvertDateFromODataTime
 *
 * @param dateString date string, format is /Date(1512691200000)/
 */
function ConvertDateFromODataTime(dateString = '0') {
    return new Date(parseInt(dateString.replace(/[^\d.]/g, ''), 10));
}
exports.ConvertDateFromODataTime = ConvertDateFromODataTime;
/**
 * FormatODataDateTimedate
 *
 * format date to /Date(1512691200000)/ format
 */
function FormatODataDateTimedate(date = new Date()) {
    return `/Date(${date.getTime()})/`;
}
exports.FormatODataDateTimedate = FormatODataDateTimedate;
function GetAuthorizationPair(user, password) {
    return { Authorization: `Basic ${base64_1.encode(`${user}:${password}`)}` };
}
exports.GetAuthorizationPair = GetAuthorizationPair;
