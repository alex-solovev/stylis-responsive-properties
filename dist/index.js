"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var StylisContext;
(function (StylisContext) {
    StylisContext[StylisContext["POST_PROCESS"] = -2] = "POST_PROCESS";
    StylisContext[StylisContext["PREPARATION"] = -1] = "PREPARATION";
    StylisContext[StylisContext["EVERY_NEW_LINE"] = 0] = "EVERY_NEW_LINE";
    StylisContext[StylisContext["PROPERTY_DECLARATION"] = 1] = "PROPERTY_DECLARATION";
    StylisContext[StylisContext["SELECTOR_BLOCK"] = 2] = "SELECTOR_BLOCK";
    StylisContext[StylisContext["MEDIA_RULE"] = 3] = "MEDIA_RULE";
})(StylisContext || (StylisContext = {}));
var mediaListRegex = /([a-z\-]+)*:\s*(\{(.*\n*)[^}]+\})/gm;
var selectorRegex = /.*(?<!\:)\s*\{/gm;
var selectorBlockRegex = /.*(?<!\:)\s*\{((.*\n*)[^}]+)\}/gm;
var bracesRegex = /\{|\}/gm;
function getMediaTuples(value) {
    return value
        .replace(bracesRegex, "")
        .split(";")
        .filter(function (m) { return m.trim(); })
        .map(function (m) {
        var _a = __read(m.split(":"), 2), media = _a[0], value = _a[1];
        return [parseInt(media, 10), value];
    });
}
function getSelectors(startingIndex, content) {
    var _a;
    var selectors = (_a = content
        .slice(0, startingIndex)
        .replace(mediaListRegex, "")
        .replace(selectorBlockRegex, "")
        .match(selectorRegex)) === null || _a === void 0 ? void 0 : _a.map(function (s) { return s.replace(/\{/, "").trim(); });
    return selectors;
}
function getDefaultValue(medias) {
    var found = medias.find(function (m) { return m[0] === 0; });
    return found ? found[1] : "";
}
function mapMediaData(data) {
    var e_1, _a, e_2, _b, _c;
    var mediaMap = {};
    try {
        for (var data_1 = __values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
            var entry = data_1_1.value;
            try {
                for (var _d = (e_2 = void 0, __values(entry.medias)), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var _f = __read(_e.value, 2), mediaValue = _f[0], propValue = _f[1];
                    var css = entry.property + ": " + propValue.trim();
                    mediaMap = __assign(__assign({}, mediaMap), (_c = {}, _c[mediaValue] = __spread((mediaMap[mediaValue] || []), [
                        __spread((entry.selectors || []), [css]),
                    ]), _c));
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_b = _d.return)) _b.call(_d);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (data_1_1 && !data_1_1.done && (_a = data_1.return)) _a.call(data_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return mediaMap;
}
function buildMedias(data) {
    var e_3, _a, e_4, _b;
    var mediaMap = mapMediaData(data);
    var medias = "";
    try {
        for (var _c = __values(Object.keys(mediaMap)), _d = _c.next(); !_d.done; _d = _c.next()) {
            var mediaValue = _d.value;
            var head = "@media screen and (min-width: " + mediaValue.trim() + "px)";
            var body = [];
            try {
                for (var _e = (e_4 = void 0, __values(mediaMap[parseInt(mediaValue, 10)])), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var values = _f.value;
                    var css = values[values.length - 1] + ";";
                    var selectors = values.slice(0, values.length - 1);
                    body.push(selectors
                        ? selectors.reverse().reduce(function (acc, cur) { return cur + " {" + acc + "}"; }, css)
                        : css);
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                }
                finally { if (e_4) throw e_4.error; }
            }
            medias = medias + (head + " {" + body.join("") + "}");
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return medias;
}
function stylisResponsiveValues(context, content, _selectors, _parent, _line, _column, _length) {
    var e_5, _a;
    switch (context) {
        case StylisContext.PREPARATION: {
            var replacedContent = content;
            var data = [];
            var matches = __spread(content.matchAll(mediaListRegex));
            try {
                for (var matches_1 = __values(matches), matches_1_1 = matches_1.next(); !matches_1_1.done; matches_1_1 = matches_1.next()) {
                    var match = matches_1_1.value;
                    var startingIndex = match.index || 0;
                    var endingIndex = startingIndex + match[0].length;
                    var property = match[1];
                    var mediaGroup = match[2];
                    var medias = getMediaTuples(mediaGroup);
                    var propertyWithMedia = {
                        selectors: getSelectors(startingIndex, content),
                        medias: medias.filter(function (m) { return m[0] > 0; }),
                        property: property,
                        startingIndex: startingIndex,
                        endingIndex: endingIndex,
                    };
                    data.push(propertyWithMedia);
                    replacedContent = replacedContent.replace(mediaGroup, getDefaultValue(medias) + ";");
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (matches_1_1 && !matches_1_1.done && (_a = matches_1.return)) _a.call(matches_1);
                }
                finally { if (e_5) throw e_5.error; }
            }
            return replacedContent + buildMedias(data);
        }
    }
    return content;
}
exports.default = stylisResponsiveValues;
