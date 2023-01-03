import {
  __commonJS
} from "./chunk-F4AF7QOS.js";

// node_modules/raphael/raphael.min.js
var require_raphael_min = __commonJS({
  "node_modules/raphael/raphael.min.js"(exports, module) {
    !function(t, e) {
      "object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? exports.Raphael = e() : t.Raphael = e();
    }(window, function() {
      return function(t) {
        var e = {};
        function r(i) {
          if (e[i])
            return e[i].exports;
          var n = e[i] = { i, l: false, exports: {} };
          return t[i].call(n.exports, n, n.exports, r), n.l = true, n.exports;
        }
        return r.m = t, r.c = e, r.d = function(t2, e2, i) {
          r.o(t2, e2) || Object.defineProperty(t2, e2, { enumerable: true, get: i });
        }, r.r = function(t2) {
          "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(t2, "__esModule", { value: true });
        }, r.t = function(t2, e2) {
          if (1 & e2 && (t2 = r(t2)), 8 & e2)
            return t2;
          if (4 & e2 && "object" == typeof t2 && t2 && t2.__esModule)
            return t2;
          var i = /* @__PURE__ */ Object.create(null);
          if (r.r(i), Object.defineProperty(i, "default", { enumerable: true, value: t2 }), 2 & e2 && "string" != typeof t2)
            for (var n in t2)
              r.d(i, n, function(e3) {
                return t2[e3];
              }.bind(null, n));
          return i;
        }, r.n = function(t2) {
          var e2 = t2 && t2.__esModule ? function() {
            return t2.default;
          } : function() {
            return t2;
          };
          return r.d(e2, "a", e2), e2;
        }, r.o = function(t2, e2) {
          return Object.prototype.hasOwnProperty.call(t2, e2);
        }, r.p = "", r(r.s = 1);
      }([function(t, e, r) {
        var i, n;
        i = [r(2)], void 0 === (n = function(t2) {
          function e2(i3) {
            if (e2.is(i3, "function"))
              return r2 ? i3() : t2.on("raphael.DOMload", i3);
            if (e2.is(i3, A))
              return e2._engine.create[c](e2, i3.splice(0, 3 + e2.is(i3[0], T))).add(i3);
            var n3 = Array.prototype.slice.call(arguments, 0);
            if (e2.is(n3[n3.length - 1], "function")) {
              var a2 = n3.pop();
              return r2 ? a2.call(e2._engine.create[c](e2, n3)) : t2.on("raphael.DOMload", function() {
                a2.call(e2._engine.create[c](e2, n3));
              });
            }
            return e2._engine.create[c](e2, arguments);
          }
          e2.version = "2.3.0", e2.eve = t2;
          var r2, i2, n2 = /[, ]+/, a = { circle: 1, rect: 1, path: 1, ellipse: 1, text: 1, image: 1 }, s = /\{(\d+)\}/g, o = "hasOwnProperty", l = { doc: document, win: window }, h = { was: Object.prototype[o].call(l.win, "Raphael"), is: l.win.Raphael }, u = function() {
            this.ca = this.customAttributes = {};
          }, c = "apply", f = "concat", p = "ontouchstart" in window || window.TouchEvent || window.DocumentTouch && document instanceof DocumentTouch, d = "", g = " ", x = String, v = "split", y = "click dblclick mousedown mousemove mouseout mouseover mouseup touchstart touchmove touchend touchcancel"[v](g), m = { mousedown: "touchstart", mousemove: "touchmove", mouseup: "touchend" }, b = x.prototype.toLowerCase, _ = Math, w = _.max, k = _.min, B = _.abs, C = _.pow, S = _.PI, T = "number", A = "array", M = Object.prototype.toString, E = (e2._ISURL = /^url\(['"]?(.+?)['"]?\)$/i, /^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+%?)?)\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\))\s*$/i), N = { NaN: 1, Infinity: 1, "-Infinity": 1 }, L = /^(?:cubic-)?bezier\(([^,]+),([^,]+),([^,]+),([^\)]+)\)/, P = _.round, z = parseFloat, F = parseInt, R = x.prototype.toUpperCase, j = e2._availableAttrs = { "arrow-end": "none", "arrow-start": "none", blur: 0, "clip-rect": "0 0 1e9 1e9", cursor: "default", cx: 0, cy: 0, fill: "#fff", "fill-opacity": 1, font: '10px "Arial"', "font-family": '"Arial"', "font-size": "10", "font-style": "normal", "font-weight": 400, gradient: 0, height: 0, href: "http://raphaeljs.com/", "letter-spacing": 0, opacity: 1, path: "M0,0", r: 0, rx: 0, ry: 0, src: "", stroke: "#000", "stroke-dasharray": "", "stroke-linecap": "butt", "stroke-linejoin": "butt", "stroke-miterlimit": 0, "stroke-opacity": 1, "stroke-width": 1, target: "_blank", "text-anchor": "middle", title: "Raphael", transform: "", width: 0, x: 0, y: 0, class: "" }, I = e2._availableAnimAttrs = { blur: T, "clip-rect": "csv", cx: T, cy: T, fill: "colour", "fill-opacity": T, "font-size": T, height: T, opacity: T, path: "path", r: T, rx: T, ry: T, stroke: "colour", "stroke-opacity": T, "stroke-width": T, transform: "transform", width: T, x: T, y: T }, D = /[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/, q = { hs: 1, rg: 1 }, O = /,?([achlmqrstvxz]),?/gi, V = /([achlmrqstvz])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/gi, W = /([rstm])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/gi, Y = /(-?\d*\.?\d*(?:e[\-+]?\d+)?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/gi, G = (e2._radial_gradient = /^r(?:\(([^,]+?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*([^\)]+?)\))?/, {}), H = function(t3, e3) {
            return z(t3) - z(e3);
          }, X = function(t3) {
            return t3;
          }, U = e2._rectPath = function(t3, e3, r3, i3, n3) {
            return n3 ? [["M", t3 + n3, e3], ["l", r3 - 2 * n3, 0], ["a", n3, n3, 0, 0, 1, n3, n3], ["l", 0, i3 - 2 * n3], ["a", n3, n3, 0, 0, 1, -n3, n3], ["l", 2 * n3 - r3, 0], ["a", n3, n3, 0, 0, 1, -n3, -n3], ["l", 0, 2 * n3 - i3], ["a", n3, n3, 0, 0, 1, n3, -n3], ["z"]] : [["M", t3, e3], ["l", r3, 0], ["l", 0, i3], ["l", -r3, 0], ["z"]];
          }, $ = function(t3, e3, r3, i3) {
            return null == i3 && (i3 = r3), [["M", t3, e3], ["m", 0, -i3], ["a", r3, i3, 0, 1, 1, 0, 2 * i3], ["a", r3, i3, 0, 1, 1, 0, -2 * i3], ["z"]];
          }, Z = e2._getPath = { path: function(t3) {
            return t3.attr("path");
          }, circle: function(t3) {
            var e3 = t3.attrs;
            return $(e3.cx, e3.cy, e3.r);
          }, ellipse: function(t3) {
            var e3 = t3.attrs;
            return $(e3.cx, e3.cy, e3.rx, e3.ry);
          }, rect: function(t3) {
            var e3 = t3.attrs;
            return U(e3.x, e3.y, e3.width, e3.height, e3.r);
          }, image: function(t3) {
            var e3 = t3.attrs;
            return U(e3.x, e3.y, e3.width, e3.height);
          }, text: function(t3) {
            var e3 = t3._getBBox();
            return U(e3.x, e3.y, e3.width, e3.height);
          }, set: function(t3) {
            var e3 = t3._getBBox();
            return U(e3.x, e3.y, e3.width, e3.height);
          } }, Q = e2.mapPath = function(t3, e3) {
            if (!e3)
              return t3;
            var r3, i3, n3, a2, s2, o2, l2;
            for (n3 = 0, s2 = (t3 = Tt(t3)).length; n3 < s2; n3++)
              for (a2 = 1, o2 = (l2 = t3[n3]).length; a2 < o2; a2 += 2)
                r3 = e3.x(l2[a2], l2[a2 + 1]), i3 = e3.y(l2[a2], l2[a2 + 1]), l2[a2] = r3, l2[a2 + 1] = i3;
            return t3;
          };
          if (e2._g = l, e2.type = l.win.SVGAngle || l.doc.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") ? "SVG" : "VML", "VML" == e2.type) {
            var J, K = l.doc.createElement("div");
            if (K.innerHTML = '<v:shape adj="1"/>', (J = K.firstChild).style.behavior = "url(#default#VML)", !J || "object" != typeof J.adj)
              return e2.type = d;
            K = null;
          }
          function tt(t3) {
            if ("function" == typeof t3 || Object(t3) !== t3)
              return t3;
            var e3 = new t3.constructor();
            for (var r3 in t3)
              t3[o](r3) && (e3[r3] = tt(t3[r3]));
            return e3;
          }
          e2.svg = !(e2.vml = "VML" == e2.type), e2._Paper = u, e2.fn = i2 = u.prototype = e2.prototype, e2._id = 0, e2.is = function(t3, e3) {
            return "finite" == (e3 = b.call(e3)) ? !N[o](+t3) : "array" == e3 ? t3 instanceof Array : "null" == e3 && null === t3 || e3 == typeof t3 && null !== t3 || "object" == e3 && t3 === Object(t3) || "array" == e3 && Array.isArray && Array.isArray(t3) || M.call(t3).slice(8, -1).toLowerCase() == e3;
          }, e2.angle = function(t3, r3, i3, n3, a2, s2) {
            if (null == a2) {
              var o2 = t3 - i3, l2 = r3 - n3;
              return o2 || l2 ? (180 + 180 * _.atan2(-l2, -o2) / S + 360) % 360 : 0;
            }
            return e2.angle(t3, r3, a2, s2) - e2.angle(i3, n3, a2, s2);
          }, e2.rad = function(t3) {
            return t3 % 360 * S / 180;
          }, e2.deg = function(t3) {
            return Math.round(180 * t3 / S % 360 * 1e3) / 1e3;
          }, e2.snapTo = function(t3, r3, i3) {
            if (i3 = e2.is(i3, "finite") ? i3 : 10, e2.is(t3, A)) {
              for (var n3 = t3.length; n3--; )
                if (B(t3[n3] - r3) <= i3)
                  return t3[n3];
            } else {
              var a2 = r3 % (t3 = +t3);
              if (a2 < i3)
                return r3 - a2;
              if (a2 > t3 - i3)
                return r3 - a2 + t3;
            }
            return r3;
          };
          var et, rt;
          e2.createUUID = (et = /[xy]/g, rt = function(t3) {
            var e3 = 16 * _.random() | 0;
            return ("x" == t3 ? e3 : 3 & e3 | 8).toString(16);
          }, function() {
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(et, rt).toUpperCase();
          });
          e2.setWindow = function(r3) {
            t2("raphael.setWindow", e2, l.win, r3), l.win = r3, l.doc = l.win.document, e2._engine.initWin && e2._engine.initWin(l.win);
          };
          var it = function(t3) {
            if (e2.vml) {
              var r3, i3 = /^\s+|\s+$/g;
              try {
                var n3 = new ActiveXObject("htmlfile");
                n3.write("<body>"), n3.close(), r3 = n3.body;
              } catch (t4) {
                r3 = createPopup().document.body;
              }
              var a2 = r3.createTextRange();
              it = ht(function(t4) {
                try {
                  r3.style.color = x(t4).replace(i3, d);
                  var e3 = a2.queryCommandValue("ForeColor");
                  return "#" + ("000000" + (e3 = (255 & e3) << 16 | 65280 & e3 | (16711680 & e3) >>> 16).toString(16)).slice(-6);
                } catch (t5) {
                  return "none";
                }
              });
            } else {
              var s2 = l.doc.createElement("i");
              s2.title = "Raphaël Colour Picker", s2.style.display = "none", l.doc.body.appendChild(s2), it = ht(function(t4) {
                return s2.style.color = t4, l.doc.defaultView.getComputedStyle(s2, d).getPropertyValue("color");
              });
            }
            return it(t3);
          }, nt = function() {
            return "hsb(" + [this.h, this.s, this.b] + ")";
          }, at = function() {
            return "hsl(" + [this.h, this.s, this.l] + ")";
          }, st = function() {
            return this.hex;
          }, ot = function(t3, r3, i3) {
            if (null == r3 && e2.is(t3, "object") && "r" in t3 && "g" in t3 && "b" in t3 && (i3 = t3.b, r3 = t3.g, t3 = t3.r), null == r3 && e2.is(t3, "string")) {
              var n3 = e2.getRGB(t3);
              t3 = n3.r, r3 = n3.g, i3 = n3.b;
            }
            return (t3 > 1 || r3 > 1 || i3 > 1) && (t3 /= 255, r3 /= 255, i3 /= 255), [t3, r3, i3];
          }, lt = function(t3, r3, i3, n3) {
            var a2 = { r: t3 *= 255, g: r3 *= 255, b: i3 *= 255, hex: e2.rgb(t3, r3, i3), toString: st };
            return e2.is(n3, "finite") && (a2.opacity = n3), a2;
          };
          function ht(t3, e3, r3) {
            return function i3() {
              var n3 = Array.prototype.slice.call(arguments, 0), a2 = n3.join("␀"), s2 = i3.cache = i3.cache || {}, l2 = i3.count = i3.count || [];
              return s2[o](a2) ? (function(t4, e4) {
                for (var r4 = 0, i4 = t4.length; r4 < i4; r4++)
                  if (t4[r4] === e4)
                    return t4.push(t4.splice(r4, 1)[0]);
              }(l2, a2), r3 ? r3(s2[a2]) : s2[a2]) : (l2.length >= 1e3 && delete s2[l2.shift()], l2.push(a2), s2[a2] = t3[c](e3, n3), r3 ? r3(s2[a2]) : s2[a2]);
            };
          }
          e2.color = function(t3) {
            var r3;
            return e2.is(t3, "object") && "h" in t3 && "s" in t3 && "b" in t3 ? (r3 = e2.hsb2rgb(t3), t3.r = r3.r, t3.g = r3.g, t3.b = r3.b, t3.hex = r3.hex) : e2.is(t3, "object") && "h" in t3 && "s" in t3 && "l" in t3 ? (r3 = e2.hsl2rgb(t3), t3.r = r3.r, t3.g = r3.g, t3.b = r3.b, t3.hex = r3.hex) : (e2.is(t3, "string") && (t3 = e2.getRGB(t3)), e2.is(t3, "object") && "r" in t3 && "g" in t3 && "b" in t3 ? (r3 = e2.rgb2hsl(t3), t3.h = r3.h, t3.s = r3.s, t3.l = r3.l, r3 = e2.rgb2hsb(t3), t3.v = r3.b) : (t3 = { hex: "none" }).r = t3.g = t3.b = t3.h = t3.s = t3.v = t3.l = -1), t3.toString = st, t3;
          }, e2.hsb2rgb = function(t3, e3, r3, i3) {
            var n3, a2, s2, o2, l2;
            return this.is(t3, "object") && "h" in t3 && "s" in t3 && "b" in t3 && (r3 = t3.b, e3 = t3.s, i3 = t3.o, t3 = t3.h), o2 = (l2 = r3 * e3) * (1 - B((t3 = (t3 *= 360) % 360 / 60) % 2 - 1)), n3 = a2 = s2 = r3 - l2, lt(n3 += [l2, o2, 0, 0, o2, l2][t3 = ~~t3], a2 += [o2, l2, l2, o2, 0, 0][t3], s2 += [0, 0, o2, l2, l2, o2][t3], i3);
          }, e2.hsl2rgb = function(t3, e3, r3, i3) {
            var n3, a2, s2, o2, l2;
            return this.is(t3, "object") && "h" in t3 && "s" in t3 && "l" in t3 && (r3 = t3.l, e3 = t3.s, t3 = t3.h), (t3 > 1 || e3 > 1 || r3 > 1) && (t3 /= 360, e3 /= 100, r3 /= 100), o2 = (l2 = 2 * e3 * (r3 < 0.5 ? r3 : 1 - r3)) * (1 - B((t3 = (t3 *= 360) % 360 / 60) % 2 - 1)), n3 = a2 = s2 = r3 - l2 / 2, lt(n3 += [l2, o2, 0, 0, o2, l2][t3 = ~~t3], a2 += [o2, l2, l2, o2, 0, 0][t3], s2 += [0, 0, o2, l2, l2, o2][t3], i3);
          }, e2.rgb2hsb = function(t3, e3, r3) {
            var i3, n3;
            return t3 = (r3 = ot(t3, e3, r3))[0], e3 = r3[1], r3 = r3[2], { h: ((0 == (n3 = (i3 = w(t3, e3, r3)) - k(t3, e3, r3)) ? null : i3 == t3 ? (e3 - r3) / n3 : i3 == e3 ? (r3 - t3) / n3 + 2 : (t3 - e3) / n3 + 4) + 360) % 6 * 60 / 360, s: 0 == n3 ? 0 : n3 / i3, b: i3, toString: nt };
          }, e2.rgb2hsl = function(t3, e3, r3) {
            var i3, n3, a2, s2;
            return t3 = (r3 = ot(t3, e3, r3))[0], e3 = r3[1], r3 = r3[2], i3 = ((n3 = w(t3, e3, r3)) + (a2 = k(t3, e3, r3))) / 2, { h: ((0 == (s2 = n3 - a2) ? null : n3 == t3 ? (e3 - r3) / s2 : n3 == e3 ? (r3 - t3) / s2 + 2 : (t3 - e3) / s2 + 4) + 360) % 6 * 60 / 360, s: 0 == s2 ? 0 : i3 < 0.5 ? s2 / (2 * i3) : s2 / (2 - 2 * i3), l: i3, toString: at };
          }, e2._path2string = function() {
            return this.join(",").replace(O, "$1");
          };
          e2._preload = function(t3, e3) {
            var r3 = l.doc.createElement("img");
            r3.style.cssText = "position:absolute;left:-9999em;top:-9999em", r3.onload = function() {
              e3.call(this), this.onload = null, l.doc.body.removeChild(this);
            }, r3.onerror = function() {
              l.doc.body.removeChild(this);
            }, l.doc.body.appendChild(r3), r3.src = t3;
          };
          function ut() {
            return this.hex;
          }
          function ct(t3, e3) {
            for (var r3 = [], i3 = 0, n3 = t3.length; n3 - 2 * !e3 > i3; i3 += 2) {
              var a2 = [{ x: +t3[i3 - 2], y: +t3[i3 - 1] }, { x: +t3[i3], y: +t3[i3 + 1] }, { x: +t3[i3 + 2], y: +t3[i3 + 3] }, { x: +t3[i3 + 4], y: +t3[i3 + 5] }];
              e3 ? i3 ? n3 - 4 == i3 ? a2[3] = { x: +t3[0], y: +t3[1] } : n3 - 2 == i3 && (a2[2] = { x: +t3[0], y: +t3[1] }, a2[3] = { x: +t3[2], y: +t3[3] }) : a2[0] = { x: +t3[n3 - 2], y: +t3[n3 - 1] } : n3 - 4 == i3 ? a2[3] = a2[2] : i3 || (a2[0] = { x: +t3[i3], y: +t3[i3 + 1] }), r3.push(["C", (-a2[0].x + 6 * a2[1].x + a2[2].x) / 6, (-a2[0].y + 6 * a2[1].y + a2[2].y) / 6, (a2[1].x + 6 * a2[2].x - a2[3].x) / 6, (a2[1].y + 6 * a2[2].y - a2[3].y) / 6, a2[2].x, a2[2].y]);
            }
            return r3;
          }
          e2.getRGB = ht(function(t3) {
            if (!t3 || (t3 = x(t3)).indexOf("-") + 1)
              return { r: -1, g: -1, b: -1, hex: "none", error: 1, toString: ut };
            if ("none" == t3)
              return { r: -1, g: -1, b: -1, hex: "none", toString: ut };
            !q[o](t3.toLowerCase().substring(0, 2)) && "#" != t3.charAt() && (t3 = it(t3));
            var r3, i3, n3, a2, s2, l2, h2 = t3.match(E);
            return h2 ? (h2[2] && (n3 = F(h2[2].substring(5), 16), i3 = F(h2[2].substring(3, 5), 16), r3 = F(h2[2].substring(1, 3), 16)), h2[3] && (n3 = F((s2 = h2[3].charAt(3)) + s2, 16), i3 = F((s2 = h2[3].charAt(2)) + s2, 16), r3 = F((s2 = h2[3].charAt(1)) + s2, 16)), h2[4] && (l2 = h2[4][v](D), r3 = z(l2[0]), "%" == l2[0].slice(-1) && (r3 *= 2.55), i3 = z(l2[1]), "%" == l2[1].slice(-1) && (i3 *= 2.55), n3 = z(l2[2]), "%" == l2[2].slice(-1) && (n3 *= 2.55), "rgba" == h2[1].toLowerCase().slice(0, 4) && (a2 = z(l2[3])), l2[3] && "%" == l2[3].slice(-1) && (a2 /= 100)), h2[5] ? (l2 = h2[5][v](D), r3 = z(l2[0]), "%" == l2[0].slice(-1) && (r3 *= 2.55), i3 = z(l2[1]), "%" == l2[1].slice(-1) && (i3 *= 2.55), n3 = z(l2[2]), "%" == l2[2].slice(-1) && (n3 *= 2.55), ("deg" == l2[0].slice(-3) || "°" == l2[0].slice(-1)) && (r3 /= 360), "hsba" == h2[1].toLowerCase().slice(0, 4) && (a2 = z(l2[3])), l2[3] && "%" == l2[3].slice(-1) && (a2 /= 100), e2.hsb2rgb(r3, i3, n3, a2)) : h2[6] ? (l2 = h2[6][v](D), r3 = z(l2[0]), "%" == l2[0].slice(-1) && (r3 *= 2.55), i3 = z(l2[1]), "%" == l2[1].slice(-1) && (i3 *= 2.55), n3 = z(l2[2]), "%" == l2[2].slice(-1) && (n3 *= 2.55), ("deg" == l2[0].slice(-3) || "°" == l2[0].slice(-1)) && (r3 /= 360), "hsla" == h2[1].toLowerCase().slice(0, 4) && (a2 = z(l2[3])), l2[3] && "%" == l2[3].slice(-1) && (a2 /= 100), e2.hsl2rgb(r3, i3, n3, a2)) : ((h2 = { r: r3, g: i3, b: n3, toString: ut }).hex = "#" + (16777216 | n3 | i3 << 8 | r3 << 16).toString(16).slice(1), e2.is(a2, "finite") && (h2.opacity = a2), h2)) : { r: -1, g: -1, b: -1, hex: "none", error: 1, toString: ut };
          }, e2), e2.hsb = ht(function(t3, r3, i3) {
            return e2.hsb2rgb(t3, r3, i3).hex;
          }), e2.hsl = ht(function(t3, r3, i3) {
            return e2.hsl2rgb(t3, r3, i3).hex;
          }), e2.rgb = ht(function(t3, e3, r3) {
            function i3(t4) {
              return t4 + 0.5 | 0;
            }
            return "#" + (16777216 | i3(r3) | i3(e3) << 8 | i3(t3) << 16).toString(16).slice(1);
          }), e2.getColor = function(t3) {
            var e3 = this.getColor.start = this.getColor.start || { h: 0, s: 1, b: t3 || 0.75 }, r3 = this.hsb2rgb(e3.h, e3.s, e3.b);
            return e3.h += 0.075, e3.h > 1 && (e3.h = 0, e3.s -= 0.2, e3.s <= 0 && (this.getColor.start = { h: 0, s: 1, b: e3.b })), r3.hex;
          }, e2.getColor.reset = function() {
            delete this.start;
          }, e2.parsePathString = function(t3) {
            if (!t3)
              return null;
            var r3 = ft(t3);
            if (r3.arr)
              return mt(r3.arr);
            var i3 = { a: 7, c: 6, h: 1, l: 2, m: 2, r: 4, q: 4, s: 4, t: 2, v: 1, z: 0 }, n3 = [];
            return e2.is(t3, A) && e2.is(t3[0], A) && (n3 = mt(t3)), n3.length || x(t3).replace(V, function(t4, e3, r4) {
              var a2 = [], s2 = e3.toLowerCase();
              if (r4.replace(Y, function(t5, e4) {
                e4 && a2.push(+e4);
              }), "m" == s2 && a2.length > 2 && (n3.push([e3][f](a2.splice(0, 2))), s2 = "l", e3 = "m" == e3 ? "l" : "L"), "r" == s2)
                n3.push([e3][f](a2));
              else
                for (; a2.length >= i3[s2] && (n3.push([e3][f](a2.splice(0, i3[s2]))), i3[s2]); )
                  ;
            }), n3.toString = e2._path2string, r3.arr = mt(n3), n3;
          }, e2.parseTransformString = ht(function(t3) {
            if (!t3)
              return null;
            var r3 = [];
            return e2.is(t3, A) && e2.is(t3[0], A) && (r3 = mt(t3)), r3.length || x(t3).replace(W, function(t4, e3, i3) {
              var n3 = [];
              b.call(e3);
              i3.replace(Y, function(t5, e4) {
                e4 && n3.push(+e4);
              }), r3.push([e3][f](n3));
            }), r3.toString = e2._path2string, r3;
          }, this, function(t3) {
            if (!t3)
              return t3;
            for (var e3 = [], r3 = 0; r3 < t3.length; r3++) {
              for (var i3 = [], n3 = 0; n3 < t3[r3].length; n3++)
                i3.push(t3[r3][n3]);
              e3.push(i3);
            }
            return e3;
          });
          var ft = function(t3) {
            var e3 = ft.ps = ft.ps || {};
            return e3[t3] ? e3[t3].sleep = 100 : e3[t3] = { sleep: 100 }, setTimeout(function() {
              for (var r3 in e3)
                e3[o](r3) && r3 != t3 && (e3[r3].sleep--, !e3[r3].sleep && delete e3[r3]);
            }), e3[t3];
          };
          function pt(t3, e3, r3, i3, n3) {
            return t3 * (t3 * (-3 * e3 + 9 * r3 - 9 * i3 + 3 * n3) + 6 * e3 - 12 * r3 + 6 * i3) - 3 * e3 + 3 * r3;
          }
          function dt(t3, e3, r3, i3, n3, a2, s2, o2, l2) {
            null == l2 && (l2 = 1);
            for (var h2 = (l2 = l2 > 1 ? 1 : l2 < 0 ? 0 : l2) / 2, u2 = [-0.1252, 0.1252, -0.3678, 0.3678, -0.5873, 0.5873, -0.7699, 0.7699, -0.9041, 0.9041, -0.9816, 0.9816], c2 = [0.2491, 0.2491, 0.2335, 0.2335, 0.2032, 0.2032, 0.1601, 0.1601, 0.1069, 0.1069, 0.0472, 0.0472], f2 = 0, p2 = 0; p2 < 12; p2++) {
              var d2 = h2 * u2[p2] + h2, g2 = pt(d2, t3, r3, n3, s2), x2 = pt(d2, e3, i3, a2, o2), v2 = g2 * g2 + x2 * x2;
              f2 += c2[p2] * _.sqrt(v2);
            }
            return h2 * f2;
          }
          function gt(t3, e3, r3, i3, n3, a2, s2, o2) {
            if (!(w(t3, r3) < k(n3, s2) || k(t3, r3) > w(n3, s2) || w(e3, i3) < k(a2, o2) || k(e3, i3) > w(a2, o2))) {
              var l2 = (t3 - r3) * (a2 - o2) - (e3 - i3) * (n3 - s2);
              if (l2) {
                var h2 = ((t3 * i3 - e3 * r3) * (n3 - s2) - (t3 - r3) * (n3 * o2 - a2 * s2)) / l2, u2 = ((t3 * i3 - e3 * r3) * (a2 - o2) - (e3 - i3) * (n3 * o2 - a2 * s2)) / l2, c2 = +h2.toFixed(2), f2 = +u2.toFixed(2);
                if (!(c2 < +k(t3, r3).toFixed(2) || c2 > +w(t3, r3).toFixed(2) || c2 < +k(n3, s2).toFixed(2) || c2 > +w(n3, s2).toFixed(2) || f2 < +k(e3, i3).toFixed(2) || f2 > +w(e3, i3).toFixed(2) || f2 < +k(a2, o2).toFixed(2) || f2 > +w(a2, o2).toFixed(2)))
                  return { x: h2, y: u2 };
              }
            }
          }
          function xt(t3, r3, i3) {
            var n3 = e2.bezierBBox(t3), a2 = e2.bezierBBox(r3);
            if (!e2.isBBoxIntersect(n3, a2))
              return i3 ? 0 : [];
            for (var s2 = dt.apply(0, t3), o2 = dt.apply(0, r3), l2 = w(~~(s2 / 5), 1), h2 = w(~~(o2 / 5), 1), u2 = [], c2 = [], f2 = {}, p2 = i3 ? 0 : [], d2 = 0; d2 < l2 + 1; d2++) {
              var g2 = e2.findDotsAtSegment.apply(e2, t3.concat(d2 / l2));
              u2.push({ x: g2.x, y: g2.y, t: d2 / l2 });
            }
            for (d2 = 0; d2 < h2 + 1; d2++)
              g2 = e2.findDotsAtSegment.apply(e2, r3.concat(d2 / h2)), c2.push({ x: g2.x, y: g2.y, t: d2 / h2 });
            for (d2 = 0; d2 < l2; d2++)
              for (var x2 = 0; x2 < h2; x2++) {
                var v2 = u2[d2], y2 = u2[d2 + 1], m2 = c2[x2], b2 = c2[x2 + 1], _2 = B(y2.x - v2.x) < 1e-3 ? "y" : "x", C2 = B(b2.x - m2.x) < 1e-3 ? "y" : "x", S2 = gt(v2.x, v2.y, y2.x, y2.y, m2.x, m2.y, b2.x, b2.y);
                if (S2) {
                  if (f2[S2.x.toFixed(4)] == S2.y.toFixed(4))
                    continue;
                  f2[S2.x.toFixed(4)] = S2.y.toFixed(4);
                  var T2 = v2.t + B((S2[_2] - v2[_2]) / (y2[_2] - v2[_2])) * (y2.t - v2.t), A2 = m2.t + B((S2[C2] - m2[C2]) / (b2[C2] - m2[C2])) * (b2.t - m2.t);
                  T2 >= 0 && T2 <= 1.001 && A2 >= 0 && A2 <= 1.001 && (i3 ? p2++ : p2.push({ x: S2.x, y: S2.y, t1: k(T2, 1), t2: k(A2, 1) }));
                }
              }
            return p2;
          }
          function vt(t3, r3, i3) {
            t3 = e2._path2curve(t3), r3 = e2._path2curve(r3);
            for (var n3, a2, s2, o2, l2, h2, u2, c2, f2, p2, d2 = i3 ? 0 : [], g2 = 0, x2 = t3.length; g2 < x2; g2++) {
              var v2 = t3[g2];
              if ("M" == v2[0])
                n3 = l2 = v2[1], a2 = h2 = v2[2];
              else {
                "C" == v2[0] ? (f2 = [n3, a2].concat(v2.slice(1)), n3 = f2[6], a2 = f2[7]) : (f2 = [n3, a2, n3, a2, l2, h2, l2, h2], n3 = l2, a2 = h2);
                for (var y2 = 0, m2 = r3.length; y2 < m2; y2++) {
                  var b2 = r3[y2];
                  if ("M" == b2[0])
                    s2 = u2 = b2[1], o2 = c2 = b2[2];
                  else {
                    "C" == b2[0] ? (p2 = [s2, o2].concat(b2.slice(1)), s2 = p2[6], o2 = p2[7]) : (p2 = [s2, o2, s2, o2, u2, c2, u2, c2], s2 = u2, o2 = c2);
                    var _2 = xt(f2, p2, i3);
                    if (i3)
                      d2 += _2;
                    else {
                      for (var w2 = 0, k2 = _2.length; w2 < k2; w2++)
                        _2[w2].segment1 = g2, _2[w2].segment2 = y2, _2[w2].bez1 = f2, _2[w2].bez2 = p2;
                      d2 = d2.concat(_2);
                    }
                  }
                }
              }
            }
            return d2;
          }
          e2.findDotsAtSegment = function(t3, e3, r3, i3, n3, a2, s2, o2, l2) {
            var h2 = 1 - l2, u2 = C(h2, 3), c2 = C(h2, 2), f2 = l2 * l2, p2 = f2 * l2, d2 = u2 * t3 + 3 * c2 * l2 * r3 + 3 * h2 * l2 * l2 * n3 + p2 * s2, g2 = u2 * e3 + 3 * c2 * l2 * i3 + 3 * h2 * l2 * l2 * a2 + p2 * o2, x2 = t3 + 2 * l2 * (r3 - t3) + f2 * (n3 - 2 * r3 + t3), v2 = e3 + 2 * l2 * (i3 - e3) + f2 * (a2 - 2 * i3 + e3), y2 = r3 + 2 * l2 * (n3 - r3) + f2 * (s2 - 2 * n3 + r3), m2 = i3 + 2 * l2 * (a2 - i3) + f2 * (o2 - 2 * a2 + i3), b2 = h2 * t3 + l2 * r3, w2 = h2 * e3 + l2 * i3, k2 = h2 * n3 + l2 * s2, B2 = h2 * a2 + l2 * o2, T2 = 90 - 180 * _.atan2(x2 - y2, v2 - m2) / S;
            return (x2 > y2 || v2 < m2) && (T2 += 180), { x: d2, y: g2, m: { x: x2, y: v2 }, n: { x: y2, y: m2 }, start: { x: b2, y: w2 }, end: { x: k2, y: B2 }, alpha: T2 };
          }, e2.bezierBBox = function(t3, r3, i3, n3, a2, s2, o2, l2) {
            e2.is(t3, "array") || (t3 = [t3, r3, i3, n3, a2, s2, o2, l2]);
            var h2 = St.apply(null, t3);
            return { x: h2.min.x, y: h2.min.y, x2: h2.max.x, y2: h2.max.y, width: h2.max.x - h2.min.x, height: h2.max.y - h2.min.y };
          }, e2.isPointInsideBBox = function(t3, e3, r3) {
            return e3 >= t3.x && e3 <= t3.x2 && r3 >= t3.y && r3 <= t3.y2;
          }, e2.isBBoxIntersect = function(t3, r3) {
            var i3 = e2.isPointInsideBBox;
            return i3(r3, t3.x, t3.y) || i3(r3, t3.x2, t3.y) || i3(r3, t3.x, t3.y2) || i3(r3, t3.x2, t3.y2) || i3(t3, r3.x, r3.y) || i3(t3, r3.x2, r3.y) || i3(t3, r3.x, r3.y2) || i3(t3, r3.x2, r3.y2) || (t3.x < r3.x2 && t3.x > r3.x || r3.x < t3.x2 && r3.x > t3.x) && (t3.y < r3.y2 && t3.y > r3.y || r3.y < t3.y2 && r3.y > t3.y);
          }, e2.pathIntersection = function(t3, e3) {
            return vt(t3, e3);
          }, e2.pathIntersectionNumber = function(t3, e3) {
            return vt(t3, e3, 1);
          }, e2.isPointInsidePath = function(t3, r3, i3) {
            var n3 = e2.pathBBox(t3);
            return e2.isPointInsideBBox(n3, r3, i3) && vt(t3, [["M", r3, i3], ["H", n3.x2 + 10]], 1) % 2 == 1;
          }, e2._removedFactory = function(e3) {
            return function() {
              t2("raphael.log", null, "Raphaël: you are calling to method “" + e3 + "” of removed object", e3);
            };
          };
          var yt = e2.pathBBox = function(t3) {
            var e3 = ft(t3);
            if (e3.bbox)
              return tt(e3.bbox);
            if (!t3)
              return { x: 0, y: 0, width: 0, height: 0, x2: 0, y2: 0 };
            for (var r3, i3 = 0, n3 = 0, a2 = [], s2 = [], o2 = 0, l2 = (t3 = Tt(t3)).length; o2 < l2; o2++)
              if ("M" == (r3 = t3[o2])[0])
                i3 = r3[1], n3 = r3[2], a2.push(i3), s2.push(n3);
              else {
                var h2 = St(i3, n3, r3[1], r3[2], r3[3], r3[4], r3[5], r3[6]);
                a2 = a2[f](h2.min.x, h2.max.x), s2 = s2[f](h2.min.y, h2.max.y), i3 = r3[5], n3 = r3[6];
              }
            var u2 = k[c](0, a2), p2 = k[c](0, s2), d2 = w[c](0, a2), g2 = w[c](0, s2), x2 = d2 - u2, v2 = g2 - p2, y2 = { x: u2, y: p2, x2: d2, y2: g2, width: x2, height: v2, cx: u2 + x2 / 2, cy: p2 + v2 / 2 };
            return e3.bbox = tt(y2), y2;
          }, mt = function(t3) {
            var r3 = tt(t3);
            return r3.toString = e2._path2string, r3;
          }, bt = e2._pathToRelative = function(t3) {
            var r3 = ft(t3);
            if (r3.rel)
              return mt(r3.rel);
            e2.is(t3, A) && e2.is(t3 && t3[0], A) || (t3 = e2.parsePathString(t3));
            var i3 = [], n3 = 0, a2 = 0, s2 = 0, o2 = 0, l2 = 0;
            "M" == t3[0][0] && (s2 = n3 = t3[0][1], o2 = a2 = t3[0][2], l2++, i3.push(["M", n3, a2]));
            for (var h2 = l2, u2 = t3.length; h2 < u2; h2++) {
              var c2 = i3[h2] = [], f2 = t3[h2];
              if (f2[0] != b.call(f2[0]))
                switch (c2[0] = b.call(f2[0]), c2[0]) {
                  case "a":
                    c2[1] = f2[1], c2[2] = f2[2], c2[3] = f2[3], c2[4] = f2[4], c2[5] = f2[5], c2[6] = +(f2[6] - n3).toFixed(3), c2[7] = +(f2[7] - a2).toFixed(3);
                    break;
                  case "v":
                    c2[1] = +(f2[1] - a2).toFixed(3);
                    break;
                  case "m":
                    s2 = f2[1], o2 = f2[2];
                  default:
                    for (var p2 = 1, d2 = f2.length; p2 < d2; p2++)
                      c2[p2] = +(f2[p2] - (p2 % 2 ? n3 : a2)).toFixed(3);
                }
              else {
                c2 = i3[h2] = [], "m" == f2[0] && (s2 = f2[1] + n3, o2 = f2[2] + a2);
                for (var g2 = 0, x2 = f2.length; g2 < x2; g2++)
                  i3[h2][g2] = f2[g2];
              }
              var v2 = i3[h2].length;
              switch (i3[h2][0]) {
                case "z":
                  n3 = s2, a2 = o2;
                  break;
                case "h":
                  n3 += +i3[h2][v2 - 1];
                  break;
                case "v":
                  a2 += +i3[h2][v2 - 1];
                  break;
                default:
                  n3 += +i3[h2][v2 - 2], a2 += +i3[h2][v2 - 1];
              }
            }
            return i3.toString = e2._path2string, r3.rel = mt(i3), i3;
          }, _t = e2._pathToAbsolute = function(t3) {
            var r3 = ft(t3);
            if (r3.abs)
              return mt(r3.abs);
            if (e2.is(t3, A) && e2.is(t3 && t3[0], A) || (t3 = e2.parsePathString(t3)), !t3 || !t3.length)
              return [["M", 0, 0]];
            var i3 = [], n3 = 0, a2 = 0, s2 = 0, o2 = 0, l2 = 0;
            "M" == t3[0][0] && (s2 = n3 = +t3[0][1], o2 = a2 = +t3[0][2], l2++, i3[0] = ["M", n3, a2]);
            for (var h2, u2, c2 = 3 == t3.length && "M" == t3[0][0] && "R" == t3[1][0].toUpperCase() && "Z" == t3[2][0].toUpperCase(), p2 = l2, d2 = t3.length; p2 < d2; p2++) {
              if (i3.push(h2 = []), (u2 = t3[p2])[0] != R.call(u2[0]))
                switch (h2[0] = R.call(u2[0]), h2[0]) {
                  case "A":
                    h2[1] = u2[1], h2[2] = u2[2], h2[3] = u2[3], h2[4] = u2[4], h2[5] = u2[5], h2[6] = +(u2[6] + n3), h2[7] = +(u2[7] + a2);
                    break;
                  case "V":
                    h2[1] = +u2[1] + a2;
                    break;
                  case "H":
                    h2[1] = +u2[1] + n3;
                    break;
                  case "R":
                    for (var g2 = [n3, a2][f](u2.slice(1)), x2 = 2, v2 = g2.length; x2 < v2; x2++)
                      g2[x2] = +g2[x2] + n3, g2[++x2] = +g2[x2] + a2;
                    i3.pop(), i3 = i3[f](ct(g2, c2));
                    break;
                  case "M":
                    s2 = +u2[1] + n3, o2 = +u2[2] + a2;
                  default:
                    for (x2 = 1, v2 = u2.length; x2 < v2; x2++)
                      h2[x2] = +u2[x2] + (x2 % 2 ? n3 : a2);
                }
              else if ("R" == u2[0])
                g2 = [n3, a2][f](u2.slice(1)), i3.pop(), i3 = i3[f](ct(g2, c2)), h2 = ["R"][f](u2.slice(-2));
              else
                for (var y2 = 0, m2 = u2.length; y2 < m2; y2++)
                  h2[y2] = u2[y2];
              switch (h2[0]) {
                case "Z":
                  n3 = s2, a2 = o2;
                  break;
                case "H":
                  n3 = h2[1];
                  break;
                case "V":
                  a2 = h2[1];
                  break;
                case "M":
                  s2 = h2[h2.length - 2], o2 = h2[h2.length - 1];
                default:
                  n3 = h2[h2.length - 2], a2 = h2[h2.length - 1];
              }
            }
            return i3.toString = e2._path2string, r3.abs = mt(i3), i3;
          }, wt = function(t3, e3, r3, i3) {
            return [t3, e3, r3, i3, r3, i3];
          }, kt = function(t3, e3, r3, i3, n3, a2) {
            return [1 / 3 * t3 + 2 / 3 * r3, 1 / 3 * e3 + 2 / 3 * i3, 1 / 3 * n3 + 2 / 3 * r3, 1 / 3 * a2 + 2 / 3 * i3, n3, a2];
          }, Bt = function(t3, e3, r3, i3, n3, a2, s2, o2, l2, h2) {
            var u2, c2 = 120 * S / 180, p2 = S / 180 * (+n3 || 0), d2 = [], g2 = ht(function(t4, e4, r4) {
              return { x: t4 * _.cos(r4) - e4 * _.sin(r4), y: t4 * _.sin(r4) + e4 * _.cos(r4) };
            });
            if (h2)
              A2 = h2[0], M2 = h2[1], C2 = h2[2], T2 = h2[3];
            else {
              t3 = (u2 = g2(t3, e3, -p2)).x, e3 = u2.y, o2 = (u2 = g2(o2, l2, -p2)).x, l2 = u2.y;
              _.cos(S / 180 * n3), _.sin(S / 180 * n3);
              var x2 = (t3 - o2) / 2, y2 = (e3 - l2) / 2, m2 = x2 * x2 / (r3 * r3) + y2 * y2 / (i3 * i3);
              m2 > 1 && (r3 *= m2 = _.sqrt(m2), i3 *= m2);
              var b2 = r3 * r3, w2 = i3 * i3, k2 = (a2 == s2 ? -1 : 1) * _.sqrt(B((b2 * w2 - b2 * y2 * y2 - w2 * x2 * x2) / (b2 * y2 * y2 + w2 * x2 * x2))), C2 = k2 * r3 * y2 / i3 + (t3 + o2) / 2, T2 = k2 * -i3 * x2 / r3 + (e3 + l2) / 2, A2 = _.asin(((e3 - T2) / i3).toFixed(9)), M2 = _.asin(((l2 - T2) / i3).toFixed(9));
              (A2 = t3 < C2 ? S - A2 : A2) < 0 && (A2 = 2 * S + A2), (M2 = o2 < C2 ? S - M2 : M2) < 0 && (M2 = 2 * S + M2), s2 && A2 > M2 && (A2 -= 2 * S), !s2 && M2 > A2 && (M2 -= 2 * S);
            }
            var E2 = M2 - A2;
            if (B(E2) > c2) {
              var N2 = M2, L2 = o2, P2 = l2;
              M2 = A2 + c2 * (s2 && M2 > A2 ? 1 : -1), o2 = C2 + r3 * _.cos(M2), l2 = T2 + i3 * _.sin(M2), d2 = Bt(o2, l2, r3, i3, n3, 0, s2, L2, P2, [M2, N2, C2, T2]);
            }
            E2 = M2 - A2;
            var z2 = _.cos(A2), F2 = _.sin(A2), R2 = _.cos(M2), j2 = _.sin(M2), I2 = _.tan(E2 / 4), D2 = 4 / 3 * r3 * I2, q2 = 4 / 3 * i3 * I2, O2 = [t3, e3], V2 = [t3 + D2 * F2, e3 - q2 * z2], W2 = [o2 + D2 * j2, l2 - q2 * R2], Y2 = [o2, l2];
            if (V2[0] = 2 * O2[0] - V2[0], V2[1] = 2 * O2[1] - V2[1], h2)
              return [V2, W2, Y2][f](d2);
            for (var G2 = [], H2 = 0, X2 = (d2 = [V2, W2, Y2][f](d2).join()[v](",")).length; H2 < X2; H2++)
              G2[H2] = H2 % 2 ? g2(d2[H2 - 1], d2[H2], p2).y : g2(d2[H2], d2[H2 + 1], p2).x;
            return G2;
          }, Ct = function(t3, e3, r3, i3, n3, a2, s2, o2, l2) {
            var h2 = 1 - l2;
            return { x: C(h2, 3) * t3 + 3 * C(h2, 2) * l2 * r3 + 3 * h2 * l2 * l2 * n3 + C(l2, 3) * s2, y: C(h2, 3) * e3 + 3 * C(h2, 2) * l2 * i3 + 3 * h2 * l2 * l2 * a2 + C(l2, 3) * o2 };
          }, St = ht(function(t3, e3, r3, i3, n3, a2, s2, o2) {
            var l2, h2 = n3 - 2 * r3 + t3 - (s2 - 2 * n3 + r3), u2 = 2 * (r3 - t3) - 2 * (n3 - r3), f2 = t3 - r3, p2 = (-u2 + _.sqrt(u2 * u2 - 4 * h2 * f2)) / 2 / h2, d2 = (-u2 - _.sqrt(u2 * u2 - 4 * h2 * f2)) / 2 / h2, g2 = [e3, o2], x2 = [t3, s2];
            return B(p2) > "1e12" && (p2 = 0.5), B(d2) > "1e12" && (d2 = 0.5), p2 > 0 && p2 < 1 && (l2 = Ct(t3, e3, r3, i3, n3, a2, s2, o2, p2), x2.push(l2.x), g2.push(l2.y)), d2 > 0 && d2 < 1 && (l2 = Ct(t3, e3, r3, i3, n3, a2, s2, o2, d2), x2.push(l2.x), g2.push(l2.y)), h2 = a2 - 2 * i3 + e3 - (o2 - 2 * a2 + i3), f2 = e3 - i3, p2 = (-(u2 = 2 * (i3 - e3) - 2 * (a2 - i3)) + _.sqrt(u2 * u2 - 4 * h2 * f2)) / 2 / h2, d2 = (-u2 - _.sqrt(u2 * u2 - 4 * h2 * f2)) / 2 / h2, B(p2) > "1e12" && (p2 = 0.5), B(d2) > "1e12" && (d2 = 0.5), p2 > 0 && p2 < 1 && (l2 = Ct(t3, e3, r3, i3, n3, a2, s2, o2, p2), x2.push(l2.x), g2.push(l2.y)), d2 > 0 && d2 < 1 && (l2 = Ct(t3, e3, r3, i3, n3, a2, s2, o2, d2), x2.push(l2.x), g2.push(l2.y)), { min: { x: k[c](0, x2), y: k[c](0, g2) }, max: { x: w[c](0, x2), y: w[c](0, g2) } };
          }), Tt = e2._path2curve = ht(function(t3, e3) {
            var r3 = !e3 && ft(t3);
            if (!e3 && r3.curve)
              return mt(r3.curve);
            for (var i3 = _t(t3), n3 = e3 && _t(e3), a2 = { x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null }, s2 = { x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null }, o2 = function(t4, e4, r4) {
              var i4, n4;
              if (!t4)
                return ["C", e4.x, e4.y, e4.x, e4.y, e4.x, e4.y];
              switch (!(t4[0] in { T: 1, Q: 1 }) && (e4.qx = e4.qy = null), t4[0]) {
                case "M":
                  e4.X = t4[1], e4.Y = t4[2];
                  break;
                case "A":
                  t4 = ["C"][f](Bt[c](0, [e4.x, e4.y][f](t4.slice(1))));
                  break;
                case "S":
                  "C" == r4 || "S" == r4 ? (i4 = 2 * e4.x - e4.bx, n4 = 2 * e4.y - e4.by) : (i4 = e4.x, n4 = e4.y), t4 = ["C", i4, n4][f](t4.slice(1));
                  break;
                case "T":
                  "Q" == r4 || "T" == r4 ? (e4.qx = 2 * e4.x - e4.qx, e4.qy = 2 * e4.y - e4.qy) : (e4.qx = e4.x, e4.qy = e4.y), t4 = ["C"][f](kt(e4.x, e4.y, e4.qx, e4.qy, t4[1], t4[2]));
                  break;
                case "Q":
                  e4.qx = t4[1], e4.qy = t4[2], t4 = ["C"][f](kt(e4.x, e4.y, t4[1], t4[2], t4[3], t4[4]));
                  break;
                case "L":
                  t4 = ["C"][f](wt(e4.x, e4.y, t4[1], t4[2]));
                  break;
                case "H":
                  t4 = ["C"][f](wt(e4.x, e4.y, t4[1], e4.y));
                  break;
                case "V":
                  t4 = ["C"][f](wt(e4.x, e4.y, e4.x, t4[1]));
                  break;
                case "Z":
                  t4 = ["C"][f](wt(e4.x, e4.y, e4.X, e4.Y));
              }
              return t4;
            }, l2 = function(t4, e4) {
              if (t4[e4].length > 7) {
                t4[e4].shift();
                for (var r4 = t4[e4]; r4.length; )
                  u2[e4] = "A", n3 && (p2[e4] = "A"), t4.splice(e4++, 0, ["C"][f](r4.splice(0, 6)));
                t4.splice(e4, 1), v2 = w(i3.length, n3 && n3.length || 0);
              }
            }, h2 = function(t4, e4, r4, a3, s3) {
              t4 && e4 && "M" == t4[s3][0] && "M" != e4[s3][0] && (e4.splice(s3, 0, ["M", a3.x, a3.y]), r4.bx = 0, r4.by = 0, r4.x = t4[s3][1], r4.y = t4[s3][2], v2 = w(i3.length, n3 && n3.length || 0));
            }, u2 = [], p2 = [], d2 = "", g2 = "", x2 = 0, v2 = w(i3.length, n3 && n3.length || 0); x2 < v2; x2++) {
              i3[x2] && (d2 = i3[x2][0]), "C" != d2 && (u2[x2] = d2, x2 && (g2 = u2[x2 - 1])), i3[x2] = o2(i3[x2], a2, g2), "A" != u2[x2] && "C" == d2 && (u2[x2] = "C"), l2(i3, x2), n3 && (n3[x2] && (d2 = n3[x2][0]), "C" != d2 && (p2[x2] = d2, x2 && (g2 = p2[x2 - 1])), n3[x2] = o2(n3[x2], s2, g2), "A" != p2[x2] && "C" == d2 && (p2[x2] = "C"), l2(n3, x2)), h2(i3, n3, a2, s2, x2), h2(n3, i3, s2, a2, x2);
              var y2 = i3[x2], m2 = n3 && n3[x2], b2 = y2.length, _2 = n3 && m2.length;
              a2.x = y2[b2 - 2], a2.y = y2[b2 - 1], a2.bx = z(y2[b2 - 4]) || a2.x, a2.by = z(y2[b2 - 3]) || a2.y, s2.bx = n3 && (z(m2[_2 - 4]) || s2.x), s2.by = n3 && (z(m2[_2 - 3]) || s2.y), s2.x = n3 && m2[_2 - 2], s2.y = n3 && m2[_2 - 1];
            }
            return n3 || (r3.curve = mt(i3)), n3 ? [i3, n3] : i3;
          }, null, mt), At = (e2._parseDots = ht(function(t3) {
            for (var r3 = [], i3 = 0, n3 = t3.length; i3 < n3; i3++) {
              var a2 = {}, s2 = t3[i3].match(/^([^:]*):?([\d\.]*)/);
              if (a2.color = e2.getRGB(s2[1]), a2.color.error)
                return null;
              a2.opacity = a2.color.opacity, a2.color = a2.color.hex, s2[2] && (a2.offset = s2[2] + "%"), r3.push(a2);
            }
            for (i3 = 1, n3 = r3.length - 1; i3 < n3; i3++)
              if (!r3[i3].offset) {
                for (var o2 = z(r3[i3 - 1].offset || 0), l2 = 0, h2 = i3 + 1; h2 < n3; h2++)
                  if (r3[h2].offset) {
                    l2 = r3[h2].offset;
                    break;
                  }
                l2 || (l2 = 100, h2 = n3);
                for (var u2 = ((l2 = z(l2)) - o2) / (h2 - i3 + 1); i3 < h2; i3++)
                  o2 += u2, r3[i3].offset = o2 + "%";
              }
            return r3;
          }), e2._tear = function(t3, e3) {
            t3 == e3.top && (e3.top = t3.prev), t3 == e3.bottom && (e3.bottom = t3.next), t3.next && (t3.next.prev = t3.prev), t3.prev && (t3.prev.next = t3.next);
          }), Mt = (e2._tofront = function(t3, e3) {
            e3.top !== t3 && (At(t3, e3), t3.next = null, t3.prev = e3.top, e3.top.next = t3, e3.top = t3);
          }, e2._toback = function(t3, e3) {
            e3.bottom !== t3 && (At(t3, e3), t3.next = e3.bottom, t3.prev = null, e3.bottom.prev = t3, e3.bottom = t3);
          }, e2._insertafter = function(t3, e3, r3) {
            At(t3, r3), e3 == r3.top && (r3.top = t3), e3.next && (e3.next.prev = t3), t3.next = e3.next, t3.prev = e3, e3.next = t3;
          }, e2._insertbefore = function(t3, e3, r3) {
            At(t3, r3), e3 == r3.bottom && (r3.bottom = t3), e3.prev && (e3.prev.next = t3), t3.prev = e3.prev, e3.prev = t3, t3.next = e3;
          }, e2.toMatrix = function(t3, e3) {
            var r3 = yt(t3), i3 = { _: { transform: d }, getBBox: function() {
              return r3;
            } };
            return Et(i3, e3), i3.matrix;
          }), Et = (e2.transformPath = function(t3, e3) {
            return Q(t3, Mt(t3, e3));
          }, e2._extractTransform = function(t3, r3) {
            if (null == r3)
              return t3._.transform;
            r3 = x(r3).replace(/\.{3}|\u2026/g, t3._.transform || d);
            var i3, n3, a2 = e2.parseTransformString(r3), s2 = 0, o2 = 1, l2 = 1, h2 = t3._, u2 = new Pt();
            if (h2.transform = a2 || [], a2)
              for (var c2 = 0, f2 = a2.length; c2 < f2; c2++) {
                var p2, g2, v2, y2, m2, b2 = a2[c2], _2 = b2.length, w2 = x(b2[0]).toLowerCase(), k2 = b2[0] != w2, B2 = k2 ? u2.invert() : 0;
                "t" == w2 && 3 == _2 ? k2 ? (p2 = B2.x(0, 0), g2 = B2.y(0, 0), v2 = B2.x(b2[1], b2[2]), y2 = B2.y(b2[1], b2[2]), u2.translate(v2 - p2, y2 - g2)) : u2.translate(b2[1], b2[2]) : "r" == w2 ? 2 == _2 ? (m2 = m2 || t3.getBBox(1), u2.rotate(b2[1], m2.x + m2.width / 2, m2.y + m2.height / 2), s2 += b2[1]) : 4 == _2 && (k2 ? (v2 = B2.x(b2[2], b2[3]), y2 = B2.y(b2[2], b2[3]), u2.rotate(b2[1], v2, y2)) : u2.rotate(b2[1], b2[2], b2[3]), s2 += b2[1]) : "s" == w2 ? 2 == _2 || 3 == _2 ? (m2 = m2 || t3.getBBox(1), u2.scale(b2[1], b2[_2 - 1], m2.x + m2.width / 2, m2.y + m2.height / 2), o2 *= b2[1], l2 *= b2[_2 - 1]) : 5 == _2 && (k2 ? (v2 = B2.x(b2[3], b2[4]), y2 = B2.y(b2[3], b2[4]), u2.scale(b2[1], b2[2], v2, y2)) : u2.scale(b2[1], b2[2], b2[3], b2[4]), o2 *= b2[1], l2 *= b2[2]) : "m" == w2 && 7 == _2 && u2.add(b2[1], b2[2], b2[3], b2[4], b2[5], b2[6]), h2.dirtyT = 1, t3.matrix = u2;
              }
            t3.matrix = u2, h2.sx = o2, h2.sy = l2, h2.deg = s2, h2.dx = i3 = u2.e, h2.dy = n3 = u2.f, 1 == o2 && 1 == l2 && !s2 && h2.bbox ? (h2.bbox.x += +i3, h2.bbox.y += +n3) : h2.dirtyT = 1;
          }), Nt = function(t3) {
            var e3 = t3[0];
            switch (e3.toLowerCase()) {
              case "t":
                return [e3, 0, 0];
              case "m":
                return [e3, 1, 0, 0, 1, 0, 0];
              case "r":
                return 4 == t3.length ? [e3, 0, t3[2], t3[3]] : [e3, 0];
              case "s":
                return 5 == t3.length ? [e3, 1, 1, t3[3], t3[4]] : 3 == t3.length ? [e3, 1, 1] : [e3, 1];
            }
          }, Lt = e2._equaliseTransform = function(t3, r3) {
            r3 = x(r3).replace(/\.{3}|\u2026/g, t3), t3 = e2.parseTransformString(t3) || [], r3 = e2.parseTransformString(r3) || [];
            for (var i3, n3, a2, s2, o2 = w(t3.length, r3.length), l2 = [], h2 = [], u2 = 0; u2 < o2; u2++) {
              if (a2 = t3[u2] || Nt(r3[u2]), s2 = r3[u2] || Nt(a2), a2[0] != s2[0] || "r" == a2[0].toLowerCase() && (a2[2] != s2[2] || a2[3] != s2[3]) || "s" == a2[0].toLowerCase() && (a2[3] != s2[3] || a2[4] != s2[4]))
                return;
              for (l2[u2] = [], h2[u2] = [], i3 = 0, n3 = w(a2.length, s2.length); i3 < n3; i3++)
                i3 in a2 && (l2[u2][i3] = a2[i3]), i3 in s2 && (h2[u2][i3] = s2[i3]);
            }
            return { from: l2, to: h2 };
          };
          function Pt(t3, e3, r3, i3, n3, a2) {
            null != t3 ? (this.a = +t3, this.b = +e3, this.c = +r3, this.d = +i3, this.e = +n3, this.f = +a2) : (this.a = 1, this.b = 0, this.c = 0, this.d = 1, this.e = 0, this.f = 0);
          }
          e2._getContainer = function(t3, r3, i3, n3) {
            var a2;
            if (null != (a2 = null != n3 || e2.is(t3, "object") ? t3 : l.doc.getElementById(t3)))
              return a2.tagName ? null == r3 ? { container: a2, width: a2.style.pixelWidth || a2.offsetWidth, height: a2.style.pixelHeight || a2.offsetHeight } : { container: a2, width: r3, height: i3 } : { container: 1, x: t3, y: r3, width: i3, height: n3 };
          }, e2.pathToRelative = bt, e2._engine = {}, e2.path2curve = Tt, e2.matrix = function(t3, e3, r3, i3, n3, a2) {
            return new Pt(t3, e3, r3, i3, n3, a2);
          }, function(t3) {
            function r3(t4) {
              return t4[0] * t4[0] + t4[1] * t4[1];
            }
            function i3(t4) {
              var e3 = _.sqrt(r3(t4));
              t4[0] && (t4[0] /= e3), t4[1] && (t4[1] /= e3);
            }
            t3.add = function(t4, e3, r4, i4, n3, a2) {
              var s2, o2, l2, h2, u2 = [[], [], []], c2 = [[this.a, this.c, this.e], [this.b, this.d, this.f], [0, 0, 1]], f2 = [[t4, r4, n3], [e3, i4, a2], [0, 0, 1]];
              for (t4 && t4 instanceof Pt && (f2 = [[t4.a, t4.c, t4.e], [t4.b, t4.d, t4.f], [0, 0, 1]]), s2 = 0; s2 < 3; s2++)
                for (o2 = 0; o2 < 3; o2++) {
                  for (h2 = 0, l2 = 0; l2 < 3; l2++)
                    h2 += c2[s2][l2] * f2[l2][o2];
                  u2[s2][o2] = h2;
                }
              this.a = u2[0][0], this.b = u2[1][0], this.c = u2[0][1], this.d = u2[1][1], this.e = u2[0][2], this.f = u2[1][2];
            }, t3.invert = function() {
              var t4 = this, e3 = t4.a * t4.d - t4.b * t4.c;
              return new Pt(t4.d / e3, -t4.b / e3, -t4.c / e3, t4.a / e3, (t4.c * t4.f - t4.d * t4.e) / e3, (t4.b * t4.e - t4.a * t4.f) / e3);
            }, t3.clone = function() {
              return new Pt(this.a, this.b, this.c, this.d, this.e, this.f);
            }, t3.translate = function(t4, e3) {
              this.add(1, 0, 0, 1, t4, e3);
            }, t3.scale = function(t4, e3, r4, i4) {
              null == e3 && (e3 = t4), (r4 || i4) && this.add(1, 0, 0, 1, r4, i4), this.add(t4, 0, 0, e3, 0, 0), (r4 || i4) && this.add(1, 0, 0, 1, -r4, -i4);
            }, t3.rotate = function(t4, r4, i4) {
              t4 = e2.rad(t4), r4 = r4 || 0, i4 = i4 || 0;
              var n3 = +_.cos(t4).toFixed(9), a2 = +_.sin(t4).toFixed(9);
              this.add(n3, a2, -a2, n3, r4, i4), this.add(1, 0, 0, 1, -r4, -i4);
            }, t3.x = function(t4, e3) {
              return t4 * this.a + e3 * this.c + this.e;
            }, t3.y = function(t4, e3) {
              return t4 * this.b + e3 * this.d + this.f;
            }, t3.get = function(t4) {
              return +this[x.fromCharCode(97 + t4)].toFixed(4);
            }, t3.toString = function() {
              return e2.svg ? "matrix(" + [this.get(0), this.get(1), this.get(2), this.get(3), this.get(4), this.get(5)].join() + ")" : [this.get(0), this.get(2), this.get(1), this.get(3), 0, 0].join();
            }, t3.toFilter = function() {
              return "progid:DXImageTransform.Microsoft.Matrix(M11=" + this.get(0) + ", M12=" + this.get(2) + ", M21=" + this.get(1) + ", M22=" + this.get(3) + ", Dx=" + this.get(4) + ", Dy=" + this.get(5) + ", sizingmethod='auto expand')";
            }, t3.offset = function() {
              return [this.e.toFixed(4), this.f.toFixed(4)];
            }, t3.split = function() {
              var t4 = {};
              t4.dx = this.e, t4.dy = this.f;
              var n3 = [[this.a, this.c], [this.b, this.d]];
              t4.scalex = _.sqrt(r3(n3[0])), i3(n3[0]), t4.shear = n3[0][0] * n3[1][0] + n3[0][1] * n3[1][1], n3[1] = [n3[1][0] - n3[0][0] * t4.shear, n3[1][1] - n3[0][1] * t4.shear], t4.scaley = _.sqrt(r3(n3[1])), i3(n3[1]), t4.shear /= t4.scaley;
              var a2 = -n3[0][1], s2 = n3[1][1];
              return s2 < 0 ? (t4.rotate = e2.deg(_.acos(s2)), a2 < 0 && (t4.rotate = 360 - t4.rotate)) : t4.rotate = e2.deg(_.asin(a2)), t4.isSimple = !(+t4.shear.toFixed(9) || t4.scalex.toFixed(9) != t4.scaley.toFixed(9) && t4.rotate), t4.isSuperSimple = !+t4.shear.toFixed(9) && t4.scalex.toFixed(9) == t4.scaley.toFixed(9) && !t4.rotate, t4.noRotation = !+t4.shear.toFixed(9) && !t4.rotate, t4;
            }, t3.toTransformString = function(t4) {
              var e3 = t4 || this[v]();
              return e3.isSimple ? (e3.scalex = +e3.scalex.toFixed(4), e3.scaley = +e3.scaley.toFixed(4), e3.rotate = +e3.rotate.toFixed(4), (e3.dx || e3.dy ? "t" + [e3.dx, e3.dy] : d) + (1 != e3.scalex || 1 != e3.scaley ? "s" + [e3.scalex, e3.scaley, 0, 0] : d) + (e3.rotate ? "r" + [e3.rotate, 0, 0] : d)) : "m" + [this.get(0), this.get(1), this.get(2), this.get(3), this.get(4), this.get(5)];
            };
          }(Pt.prototype);
          for (var zt = function() {
            this.returnValue = false;
          }, Ft = function() {
            return this.originalEvent.preventDefault();
          }, Rt = function() {
            this.cancelBubble = true;
          }, jt = function() {
            return this.originalEvent.stopPropagation();
          }, It = function(t3) {
            var e3 = l.doc.documentElement.scrollTop || l.doc.body.scrollTop, r3 = l.doc.documentElement.scrollLeft || l.doc.body.scrollLeft;
            return { x: t3.clientX + r3, y: t3.clientY + e3 };
          }, Dt = l.doc.addEventListener ? function(t3, e3, r3, i3) {
            var n3 = function(t4) {
              var e4 = It(t4);
              return r3.call(i3, t4, e4.x, e4.y);
            };
            if (t3.addEventListener(e3, n3, false), p && m[e3]) {
              var a2 = function(e4) {
                for (var n4 = It(e4), a3 = e4, s2 = 0, o2 = e4.targetTouches && e4.targetTouches.length; s2 < o2; s2++)
                  if (e4.targetTouches[s2].target == t3) {
                    (e4 = e4.targetTouches[s2]).originalEvent = a3, e4.preventDefault = Ft, e4.stopPropagation = jt;
                    break;
                  }
                return r3.call(i3, e4, n4.x, n4.y);
              };
              t3.addEventListener(m[e3], a2, false);
            }
            return function() {
              return t3.removeEventListener(e3, n3, false), p && m[e3] && t3.removeEventListener(m[e3], a2, false), true;
            };
          } : l.doc.attachEvent ? function(t3, e3, r3, i3) {
            var n3 = function(t4) {
              t4 = t4 || l.win.event;
              var e4 = l.doc.documentElement.scrollTop || l.doc.body.scrollTop, n4 = l.doc.documentElement.scrollLeft || l.doc.body.scrollLeft, a2 = t4.clientX + n4, s2 = t4.clientY + e4;
              return t4.preventDefault = t4.preventDefault || zt, t4.stopPropagation = t4.stopPropagation || Rt, r3.call(i3, t4, a2, s2);
            };
            return t3.attachEvent("on" + e3, n3), function() {
              return t3.detachEvent("on" + e3, n3), true;
            };
          } : void 0, qt = [], Ot = function(e3) {
            for (var r3, i3 = e3.clientX, n3 = e3.clientY, a2 = l.doc.documentElement.scrollTop || l.doc.body.scrollTop, s2 = l.doc.documentElement.scrollLeft || l.doc.body.scrollLeft, o2 = qt.length; o2--; ) {
              if (r3 = qt[o2], p && e3.touches) {
                for (var h2, u2 = e3.touches.length; u2--; )
                  if ((h2 = e3.touches[u2]).identifier == r3.el._drag.id) {
                    i3 = h2.clientX, n3 = h2.clientY, (e3.originalEvent ? e3.originalEvent : e3).preventDefault();
                    break;
                  }
              } else
                e3.preventDefault();
              var c2, f2 = r3.el.node, d2 = f2.nextSibling, g2 = f2.parentNode, x2 = f2.style.display;
              l.win.opera && g2.removeChild(f2), f2.style.display = "none", c2 = r3.el.paper.getElementByPoint(i3, n3), f2.style.display = x2, l.win.opera && (d2 ? g2.insertBefore(f2, d2) : g2.appendChild(f2)), c2 && t2("raphael.drag.over." + r3.el.id, r3.el, c2), i3 += s2, n3 += a2, t2("raphael.drag.move." + r3.el.id, r3.move_scope || r3.el, i3 - r3.el._drag.x, n3 - r3.el._drag.y, i3, n3, e3);
            }
          }, Vt = function(r3) {
            e2.unmousemove(Ot).unmouseup(Vt);
            for (var i3, n3 = qt.length; n3--; )
              (i3 = qt[n3]).el._drag = {}, t2("raphael.drag.end." + i3.el.id, i3.end_scope || i3.start_scope || i3.move_scope || i3.el, r3);
            qt = [];
          }, Wt = e2.el = {}, Yt = y.length; Yt--; )
            !function(t3) {
              e2[t3] = Wt[t3] = function(r3, i3) {
                return e2.is(r3, "function") && (this.events = this.events || [], this.events.push({ name: t3, f: r3, unbind: Dt(this.shape || this.node || l.doc, t3, r3, i3 || this) })), this;
              }, e2["un" + t3] = Wt["un" + t3] = function(r3) {
                for (var i3 = this.events || [], n3 = i3.length; n3--; )
                  i3[n3].name != t3 || !e2.is(r3, "undefined") && i3[n3].f != r3 || (i3[n3].unbind(), i3.splice(n3, 1), !i3.length && delete this.events);
                return this;
              };
            }(y[Yt]);
          Wt.data = function(r3, i3) {
            var n3 = G[this.id] = G[this.id] || {};
            if (0 == arguments.length)
              return n3;
            if (1 == arguments.length) {
              if (e2.is(r3, "object")) {
                for (var a2 in r3)
                  r3[o](a2) && this.data(a2, r3[a2]);
                return this;
              }
              return t2("raphael.data.get." + this.id, this, n3[r3], r3), n3[r3];
            }
            return n3[r3] = i3, t2("raphael.data.set." + this.id, this, i3, r3), this;
          }, Wt.removeData = function(t3) {
            return null == t3 ? delete G[this.id] : G[this.id] && delete G[this.id][t3], this;
          }, Wt.getData = function() {
            return tt(G[this.id] || {});
          }, Wt.hover = function(t3, e3, r3, i3) {
            return this.mouseover(t3, r3).mouseout(e3, i3 || r3);
          }, Wt.unhover = function(t3, e3) {
            return this.unmouseover(t3).unmouseout(e3);
          };
          var Gt = [];
          Wt.drag = function(r3, i3, n3, a2, s2, o2) {
            function h2(h3) {
              (h3.originalEvent || h3).preventDefault();
              var u2 = h3.clientX, c2 = h3.clientY, f2 = l.doc.documentElement.scrollTop || l.doc.body.scrollTop, d2 = l.doc.documentElement.scrollLeft || l.doc.body.scrollLeft;
              if (this._drag.id = h3.identifier, p && h3.touches) {
                for (var g2, x2 = h3.touches.length; x2--; )
                  if (g2 = h3.touches[x2], this._drag.id = g2.identifier, g2.identifier == this._drag.id) {
                    u2 = g2.clientX, c2 = g2.clientY;
                    break;
                  }
              }
              this._drag.x = u2 + d2, this._drag.y = c2 + f2, !qt.length && e2.mousemove(Ot).mouseup(Vt), qt.push({ el: this, move_scope: a2, start_scope: s2, end_scope: o2 }), i3 && t2.on("raphael.drag.start." + this.id, i3), r3 && t2.on("raphael.drag.move." + this.id, r3), n3 && t2.on("raphael.drag.end." + this.id, n3), t2("raphael.drag.start." + this.id, s2 || a2 || this, this._drag.x, this._drag.y, h3);
            }
            return this._drag = {}, Gt.push({ el: this, start: h2 }), this.mousedown(h2), this;
          }, Wt.onDragOver = function(e3) {
            e3 ? t2.on("raphael.drag.over." + this.id, e3) : t2.unbind("raphael.drag.over." + this.id);
          }, Wt.undrag = function() {
            for (var r3 = Gt.length; r3--; )
              Gt[r3].el == this && (this.unmousedown(Gt[r3].start), Gt.splice(r3, 1), t2.unbind("raphael.drag.*." + this.id));
            !Gt.length && e2.unmousemove(Ot).unmouseup(Vt), qt = [];
          }, i2.circle = function(t3, r3, i3) {
            var n3 = e2._engine.circle(this, t3 || 0, r3 || 0, i3 || 0);
            return this.__set__ && this.__set__.push(n3), n3;
          }, i2.rect = function(t3, r3, i3, n3, a2) {
            var s2 = e2._engine.rect(this, t3 || 0, r3 || 0, i3 || 0, n3 || 0, a2 || 0);
            return this.__set__ && this.__set__.push(s2), s2;
          }, i2.ellipse = function(t3, r3, i3, n3) {
            var a2 = e2._engine.ellipse(this, t3 || 0, r3 || 0, i3 || 0, n3 || 0);
            return this.__set__ && this.__set__.push(a2), a2;
          }, i2.path = function(t3) {
            t3 && !e2.is(t3, "string") && !e2.is(t3[0], A) && (t3 += d);
            var r3 = e2._engine.path(e2.format[c](e2, arguments), this);
            return this.__set__ && this.__set__.push(r3), r3;
          }, i2.image = function(t3, r3, i3, n3, a2) {
            var s2 = e2._engine.image(this, t3 || "about:blank", r3 || 0, i3 || 0, n3 || 0, a2 || 0);
            return this.__set__ && this.__set__.push(s2), s2;
          }, i2.text = function(t3, r3, i3) {
            var n3 = e2._engine.text(this, t3 || 0, r3 || 0, x(i3));
            return this.__set__ && this.__set__.push(n3), n3;
          }, i2.set = function(t3) {
            !e2.is(t3, "array") && (t3 = Array.prototype.splice.call(arguments, 0, arguments.length));
            var r3 = new ce(t3);
            return this.__set__ && this.__set__.push(r3), r3.paper = this, r3.type = "set", r3;
          }, i2.setStart = function(t3) {
            this.__set__ = t3 || this.set();
          }, i2.setFinish = function(t3) {
            var e3 = this.__set__;
            return delete this.__set__, e3;
          }, i2.getSize = function() {
            var t3 = this.canvas.parentNode;
            return { width: t3.offsetWidth, height: t3.offsetHeight };
          }, i2.setSize = function(t3, r3) {
            return e2._engine.setSize.call(this, t3, r3);
          }, i2.setViewBox = function(t3, r3, i3, n3, a2) {
            return e2._engine.setViewBox.call(this, t3, r3, i3, n3, a2);
          }, i2.top = i2.bottom = null, i2.raphael = e2;
          function Ht() {
            return this.x + g + this.y + g + this.width + " × " + this.height;
          }
          i2.getElementByPoint = function(t3, e3) {
            var r3, i3, n3, a2, s2, o2, h2, u2 = this.canvas, c2 = l.doc.elementFromPoint(t3, e3);
            if (l.win.opera && "svg" == c2.tagName) {
              var f2 = (i3 = (r3 = u2).getBoundingClientRect(), n3 = r3.ownerDocument, a2 = n3.body, s2 = n3.documentElement, o2 = s2.clientTop || a2.clientTop || 0, h2 = s2.clientLeft || a2.clientLeft || 0, { y: i3.top + (l.win.pageYOffset || s2.scrollTop || a2.scrollTop) - o2, x: i3.left + (l.win.pageXOffset || s2.scrollLeft || a2.scrollLeft) - h2 }), p2 = u2.createSVGRect();
              p2.x = t3 - f2.x, p2.y = e3 - f2.y, p2.width = p2.height = 1;
              var d2 = u2.getIntersectionList(p2, null);
              d2.length && (c2 = d2[d2.length - 1]);
            }
            if (!c2)
              return null;
            for (; c2.parentNode && c2 != u2.parentNode && !c2.raphael; )
              c2 = c2.parentNode;
            return c2 == this.canvas.parentNode && (c2 = u2), c2 = c2 && c2.raphael ? this.getById(c2.raphaelid) : null;
          }, i2.getElementsByBBox = function(t3) {
            var r3 = this.set();
            return this.forEach(function(i3) {
              e2.isBBoxIntersect(i3.getBBox(), t3) && r3.push(i3);
            }), r3;
          }, i2.getById = function(t3) {
            for (var e3 = this.bottom; e3; ) {
              if (e3.id == t3)
                return e3;
              e3 = e3.next;
            }
            return null;
          }, i2.forEach = function(t3, e3) {
            for (var r3 = this.bottom; r3; ) {
              if (false === t3.call(e3, r3))
                return this;
              r3 = r3.next;
            }
            return this;
          }, i2.getElementsByPoint = function(t3, e3) {
            var r3 = this.set();
            return this.forEach(function(i3) {
              i3.isPointInside(t3, e3) && r3.push(i3);
            }), r3;
          }, Wt.isPointInside = function(t3, r3) {
            var i3 = this.realPath = Z[this.type](this);
            return this.attr("transform") && this.attr("transform").length && (i3 = e2.transformPath(i3, this.attr("transform"))), e2.isPointInsidePath(i3, t3, r3);
          }, Wt.getBBox = function(t3) {
            if (this.removed)
              return {};
            var e3 = this._;
            return t3 ? (!e3.dirty && e3.bboxwt || (this.realPath = Z[this.type](this), e3.bboxwt = yt(this.realPath), e3.bboxwt.toString = Ht, e3.dirty = 0), e3.bboxwt) : ((e3.dirty || e3.dirtyT || !e3.bbox) && (!e3.dirty && this.realPath || (e3.bboxwt = 0, this.realPath = Z[this.type](this)), e3.bbox = yt(Q(this.realPath, this.matrix)), e3.bbox.toString = Ht, e3.dirty = e3.dirtyT = 0), e3.bbox);
          }, Wt.clone = function() {
            if (this.removed)
              return null;
            var t3 = this.paper[this.type]().attr(this.attr());
            return this.__set__ && this.__set__.push(t3), t3;
          }, Wt.glow = function(t3) {
            if ("text" == this.type)
              return null;
            var e3 = { width: ((t3 = t3 || {}).width || 10) + (+this.attr("stroke-width") || 1), fill: t3.fill || false, opacity: null == t3.opacity ? 0.5 : t3.opacity, offsetx: t3.offsetx || 0, offsety: t3.offsety || 0, color: t3.color || "#000" }, r3 = e3.width / 2, i3 = this.paper, n3 = i3.set(), a2 = this.realPath || Z[this.type](this);
            a2 = this.matrix ? Q(a2, this.matrix) : a2;
            for (var s2 = 1; s2 < r3 + 1; s2++)
              n3.push(i3.path(a2).attr({ stroke: e3.color, fill: e3.fill ? e3.color : "none", "stroke-linejoin": "round", "stroke-linecap": "round", "stroke-width": +(e3.width / r3 * s2).toFixed(3), opacity: +(e3.opacity / r3).toFixed(3) }));
            return n3.insertBefore(this).translate(e3.offsetx, e3.offsety);
          };
          var Xt = function(t3, r3, i3, n3, a2, s2, o2, l2, h2) {
            return null == h2 ? dt(t3, r3, i3, n3, a2, s2, o2, l2) : e2.findDotsAtSegment(t3, r3, i3, n3, a2, s2, o2, l2, function(t4, e3, r4, i4, n4, a3, s3, o3, l3) {
              if (!(l3 < 0 || dt(t4, e3, r4, i4, n4, a3, s3, o3) < l3)) {
                var h3, u2 = 0.5, c2 = 1 - u2;
                for (h3 = dt(t4, e3, r4, i4, n4, a3, s3, o3, c2); B(h3 - l3) > 0.01; )
                  h3 = dt(t4, e3, r4, i4, n4, a3, s3, o3, c2 += (h3 < l3 ? 1 : -1) * (u2 /= 2));
                return c2;
              }
            }(t3, r3, i3, n3, a2, s2, o2, l2, h2));
          }, Ut = function(t3, r3) {
            return function(i3, n3, a2) {
              for (var s2, o2, l2, h2, u2, c2 = "", f2 = {}, p2 = 0, d2 = 0, g2 = (i3 = Tt(i3)).length; d2 < g2; d2++) {
                if ("M" == (l2 = i3[d2])[0])
                  s2 = +l2[1], o2 = +l2[2];
                else {
                  if (p2 + (h2 = Xt(s2, o2, l2[1], l2[2], l2[3], l2[4], l2[5], l2[6])) > n3) {
                    if (r3 && !f2.start) {
                      if (c2 += ["C" + (u2 = Xt(s2, o2, l2[1], l2[2], l2[3], l2[4], l2[5], l2[6], n3 - p2)).start.x, u2.start.y, u2.m.x, u2.m.y, u2.x, u2.y], a2)
                        return c2;
                      f2.start = c2, c2 = ["M" + u2.x, u2.y + "C" + u2.n.x, u2.n.y, u2.end.x, u2.end.y, l2[5], l2[6]].join(), p2 += h2, s2 = +l2[5], o2 = +l2[6];
                      continue;
                    }
                    if (!t3 && !r3)
                      return { x: (u2 = Xt(s2, o2, l2[1], l2[2], l2[3], l2[4], l2[5], l2[6], n3 - p2)).x, y: u2.y, alpha: u2.alpha };
                  }
                  p2 += h2, s2 = +l2[5], o2 = +l2[6];
                }
                c2 += l2.shift() + l2;
              }
              return f2.end = c2, (u2 = t3 ? p2 : r3 ? f2 : e2.findDotsAtSegment(s2, o2, l2[0], l2[1], l2[2], l2[3], l2[4], l2[5], 1)).alpha && (u2 = { x: u2.x, y: u2.y, alpha: u2.alpha }), u2;
            };
          }, $t = Ut(1), Zt = Ut(), Qt = Ut(0, 1);
          e2.getTotalLength = $t, e2.getPointAtLength = Zt, e2.getSubpath = function(t3, e3, r3) {
            if (this.getTotalLength(t3) - r3 < 1e-6)
              return Qt(t3, e3).end;
            var i3 = Qt(t3, r3, 1);
            return e3 ? Qt(i3, e3).end : i3;
          }, Wt.getTotalLength = function() {
            var t3 = this.getPath();
            if (t3)
              return this.node.getTotalLength ? this.node.getTotalLength() : $t(t3);
          }, Wt.getPointAtLength = function(t3) {
            var e3 = this.getPath();
            if (e3)
              return Zt(e3, t3);
          }, Wt.getPath = function() {
            var t3, r3 = e2._getPath[this.type];
            if ("text" != this.type && "set" != this.type)
              return r3 && (t3 = r3(this)), t3;
          }, Wt.getSubpath = function(t3, r3) {
            var i3 = this.getPath();
            if (i3)
              return e2.getSubpath(i3, t3, r3);
          };
          var Jt = e2.easing_formulas = { linear: function(t3) {
            return t3;
          }, "<": function(t3) {
            return C(t3, 1.7);
          }, ">": function(t3) {
            return C(t3, 0.48);
          }, "<>": function(t3) {
            var e3 = 0.48 - t3 / 1.04, r3 = _.sqrt(0.1734 + e3 * e3), i3 = r3 - e3, n3 = -r3 - e3, a2 = C(B(i3), 1 / 3) * (i3 < 0 ? -1 : 1) + C(B(n3), 1 / 3) * (n3 < 0 ? -1 : 1) + 0.5;
            return 3 * (1 - a2) * a2 * a2 + a2 * a2 * a2;
          }, backIn: function(t3) {
            var e3 = 1.70158;
            return t3 * t3 * ((e3 + 1) * t3 - e3);
          }, backOut: function(t3) {
            var e3 = 1.70158;
            return (t3 -= 1) * t3 * ((e3 + 1) * t3 + e3) + 1;
          }, elastic: function(t3) {
            return t3 == !!t3 ? t3 : C(2, -10 * t3) * _.sin(2 * S * (t3 - 0.075) / 0.3) + 1;
          }, bounce: function(t3) {
            var e3 = 7.5625, r3 = 2.75;
            return t3 < 1 / r3 ? e3 * t3 * t3 : t3 < 2 / r3 ? e3 * (t3 -= 1.5 / r3) * t3 + 0.75 : t3 < 2.5 / r3 ? e3 * (t3 -= 2.25 / r3) * t3 + 0.9375 : e3 * (t3 -= 2.625 / r3) * t3 + 0.984375;
          } };
          Jt.easeIn = Jt["ease-in"] = Jt["<"], Jt.easeOut = Jt["ease-out"] = Jt[">"], Jt.easeInOut = Jt["ease-in-out"] = Jt["<>"], Jt["back-in"] = Jt.backIn, Jt["back-out"] = Jt.backOut;
          var Kt = [], te = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(t3) {
            setTimeout(t3, 16);
          }, ee = function() {
            for (var r3 = +new Date(), i3 = 0; i3 < Kt.length; i3++) {
              var n3 = Kt[i3];
              if (!n3.el.removed && !n3.paused) {
                var a2, s2, l2 = r3 - n3.start, h2 = n3.ms, u2 = n3.easing, c2 = n3.from, p2 = n3.diff, d2 = n3.to, x2 = (n3.t, n3.el), v2 = {}, y2 = {};
                if (n3.initstatus ? (l2 = (n3.initstatus * n3.anim.top - n3.prev) / (n3.percent - n3.prev) * h2, n3.status = n3.initstatus, delete n3.initstatus, n3.stop && Kt.splice(i3--, 1)) : n3.status = (n3.prev + (n3.percent - n3.prev) * (l2 / h2)) / n3.anim.top, !(l2 < 0))
                  if (l2 < h2) {
                    var m2 = u2(l2 / h2);
                    for (var b2 in c2)
                      if (c2[o](b2)) {
                        switch (I[b2]) {
                          case T:
                            a2 = +c2[b2] + m2 * h2 * p2[b2];
                            break;
                          case "colour":
                            a2 = "rgb(" + [re(P(c2[b2].r + m2 * h2 * p2[b2].r)), re(P(c2[b2].g + m2 * h2 * p2[b2].g)), re(P(c2[b2].b + m2 * h2 * p2[b2].b))].join(",") + ")";
                            break;
                          case "path":
                            a2 = [];
                            for (var _2 = 0, w2 = c2[b2].length; _2 < w2; _2++) {
                              a2[_2] = [c2[b2][_2][0]];
                              for (var k2 = 1, B2 = c2[b2][_2].length; k2 < B2; k2++)
                                a2[_2][k2] = +c2[b2][_2][k2] + m2 * h2 * p2[b2][_2][k2];
                              a2[_2] = a2[_2].join(g);
                            }
                            a2 = a2.join(g);
                            break;
                          case "transform":
                            if (p2[b2].real)
                              for (a2 = [], _2 = 0, w2 = c2[b2].length; _2 < w2; _2++)
                                for (a2[_2] = [c2[b2][_2][0]], k2 = 1, B2 = c2[b2][_2].length; k2 < B2; k2++)
                                  a2[_2][k2] = c2[b2][_2][k2] + m2 * h2 * p2[b2][_2][k2];
                            else {
                              var C2 = function(t3) {
                                return +c2[b2][t3] + m2 * h2 * p2[b2][t3];
                              };
                              a2 = [["m", C2(0), C2(1), C2(2), C2(3), C2(4), C2(5)]];
                            }
                            break;
                          case "csv":
                            if ("clip-rect" == b2)
                              for (a2 = [], _2 = 4; _2--; )
                                a2[_2] = +c2[b2][_2] + m2 * h2 * p2[b2][_2];
                            break;
                          default:
                            var S2 = [][f](c2[b2]);
                            for (a2 = [], _2 = x2.paper.customAttributes[b2].length; _2--; )
                              a2[_2] = +S2[_2] + m2 * h2 * p2[b2][_2];
                        }
                        v2[b2] = a2;
                      }
                    x2.attr(v2), function(e3, r4, i4) {
                      setTimeout(function() {
                        t2("raphael.anim.frame." + e3, r4, i4);
                      });
                    }(x2.id, x2, n3.anim);
                  } else {
                    if (function(r4, i4, n4) {
                      setTimeout(function() {
                        t2("raphael.anim.frame." + i4.id, i4, n4), t2("raphael.anim.finish." + i4.id, i4, n4), e2.is(r4, "function") && r4.call(i4);
                      });
                    }(n3.callback, x2, n3.anim), x2.attr(d2), Kt.splice(i3--, 1), n3.repeat > 1 && !n3.next) {
                      for (s2 in d2)
                        d2[o](s2) && (y2[s2] = n3.totalOrigin[s2]);
                      n3.el.attr(y2), ae(n3.anim, n3.el, n3.anim.percents[0], null, n3.totalOrigin, n3.repeat - 1);
                    }
                    n3.next && !n3.stop && ae(n3.anim, n3.el, n3.next, null, n3.totalOrigin, n3.repeat);
                  }
              }
            }
            Kt.length && te(ee);
          }, re = function(t3) {
            return t3 > 255 ? 255 : t3 < 0 ? 0 : t3;
          };
          function ie(t3, e3, r3, i3, n3, a2) {
            var s2 = 3 * e3, o2 = 3 * (i3 - e3) - s2, l2 = 1 - s2 - o2, h2 = 3 * r3, u2 = 3 * (n3 - r3) - h2, c2 = 1 - h2 - u2;
            function f2(t4) {
              return ((l2 * t4 + o2) * t4 + s2) * t4;
            }
            return function(t4, e4) {
              var r4 = function(t5, e5) {
                var r5, i4, n4, a3, h3, u3;
                for (n4 = t5, u3 = 0; u3 < 8; u3++) {
                  if (a3 = f2(n4) - t5, B(a3) < e5)
                    return n4;
                  if (B(h3 = (3 * l2 * n4 + 2 * o2) * n4 + s2) < 1e-6)
                    break;
                  n4 -= a3 / h3;
                }
                if (i4 = 1, (n4 = t5) < (r5 = 0))
                  return r5;
                if (n4 > i4)
                  return i4;
                for (; r5 < i4; ) {
                  if (a3 = f2(n4), B(a3 - t5) < e5)
                    return n4;
                  t5 > a3 ? r5 = n4 : i4 = n4, n4 = (i4 - r5) / 2 + r5;
                }
                return n4;
              }(t4, e4);
              return ((c2 * r4 + u2) * r4 + h2) * r4;
            }(t3, 1 / (200 * a2));
          }
          function ne(t3, e3) {
            var r3 = [], i3 = {};
            if (this.ms = e3, this.times = 1, t3) {
              for (var n3 in t3)
                t3[o](n3) && (i3[z(n3)] = t3[n3], r3.push(z(n3)));
              r3.sort(H);
            }
            this.anim = i3, this.top = r3[r3.length - 1], this.percents = r3;
          }
          function ae(r3, i3, a2, s2, l2, h2) {
            a2 = z(a2);
            var u2, c2, p2, d2, g2, y2, m2 = r3.ms, b2 = {}, _2 = {}, w2 = {};
            if (s2)
              for (B2 = 0, C2 = Kt.length; B2 < C2; B2++) {
                var k2 = Kt[B2];
                if (k2.el.id == i3.id && k2.anim == r3) {
                  k2.percent != a2 ? (Kt.splice(B2, 1), p2 = 1) : c2 = k2, i3.attr(k2.totalOrigin);
                  break;
                }
              }
            else
              s2 = +_2;
            for (var B2 = 0, C2 = r3.percents.length; B2 < C2; B2++) {
              if (r3.percents[B2] == a2 || r3.percents[B2] > s2 * r3.top) {
                a2 = r3.percents[B2], g2 = r3.percents[B2 - 1] || 0, m2 = m2 / r3.top * (a2 - g2), d2 = r3.percents[B2 + 1], u2 = r3.anim[a2];
                break;
              }
              s2 && i3.attr(r3.anim[r3.percents[B2]]);
            }
            if (u2) {
              if (c2)
                c2.initstatus = s2, c2.start = new Date() - c2.ms * s2;
              else {
                for (var S2 in u2)
                  if (u2[o](S2) && (I[o](S2) || i3.paper.customAttributes[o](S2)))
                    switch (b2[S2] = i3.attr(S2), null == b2[S2] && (b2[S2] = j[S2]), _2[S2] = u2[S2], I[S2]) {
                      case T:
                        w2[S2] = (_2[S2] - b2[S2]) / m2;
                        break;
                      case "colour":
                        b2[S2] = e2.getRGB(b2[S2]);
                        var A2 = e2.getRGB(_2[S2]);
                        w2[S2] = { r: (A2.r - b2[S2].r) / m2, g: (A2.g - b2[S2].g) / m2, b: (A2.b - b2[S2].b) / m2 };
                        break;
                      case "path":
                        var M2 = Tt(b2[S2], _2[S2]), E2 = M2[1];
                        for (b2[S2] = M2[0], w2[S2] = [], B2 = 0, C2 = b2[S2].length; B2 < C2; B2++) {
                          w2[S2][B2] = [0];
                          for (var N2 = 1, P2 = b2[S2][B2].length; N2 < P2; N2++)
                            w2[S2][B2][N2] = (E2[B2][N2] - b2[S2][B2][N2]) / m2;
                        }
                        break;
                      case "transform":
                        var F2 = i3._, R2 = Lt(F2[S2], _2[S2]);
                        if (R2)
                          for (b2[S2] = R2.from, _2[S2] = R2.to, w2[S2] = [], w2[S2].real = true, B2 = 0, C2 = b2[S2].length; B2 < C2; B2++)
                            for (w2[S2][B2] = [b2[S2][B2][0]], N2 = 1, P2 = b2[S2][B2].length; N2 < P2; N2++)
                              w2[S2][B2][N2] = (_2[S2][B2][N2] - b2[S2][B2][N2]) / m2;
                        else {
                          var D2 = i3.matrix || new Pt(), q2 = { _: { transform: F2.transform }, getBBox: function() {
                            return i3.getBBox(1);
                          } };
                          b2[S2] = [D2.a, D2.b, D2.c, D2.d, D2.e, D2.f], Et(q2, _2[S2]), _2[S2] = q2._.transform, w2[S2] = [(q2.matrix.a - D2.a) / m2, (q2.matrix.b - D2.b) / m2, (q2.matrix.c - D2.c) / m2, (q2.matrix.d - D2.d) / m2, (q2.matrix.e - D2.e) / m2, (q2.matrix.f - D2.f) / m2];
                        }
                        break;
                      case "csv":
                        var O2 = x(u2[S2])[v](n2), V2 = x(b2[S2])[v](n2);
                        if ("clip-rect" == S2)
                          for (b2[S2] = V2, w2[S2] = [], B2 = V2.length; B2--; )
                            w2[S2][B2] = (O2[B2] - b2[S2][B2]) / m2;
                        _2[S2] = O2;
                        break;
                      default:
                        for (O2 = [][f](u2[S2]), V2 = [][f](b2[S2]), w2[S2] = [], B2 = i3.paper.customAttributes[S2].length; B2--; )
                          w2[S2][B2] = ((O2[B2] || 0) - (V2[B2] || 0)) / m2;
                    }
                var W2 = u2.easing, Y2 = e2.easing_formulas[W2];
                if (!Y2)
                  if ((Y2 = x(W2).match(L)) && 5 == Y2.length) {
                    var G2 = Y2;
                    Y2 = function(t3) {
                      return ie(t3, +G2[1], +G2[2], +G2[3], +G2[4], m2);
                    };
                  } else
                    Y2 = X;
                if (k2 = { anim: r3, percent: a2, timestamp: y2 = u2.start || r3.start || +new Date(), start: y2 + (r3.del || 0), status: 0, initstatus: s2 || 0, stop: false, ms: m2, easing: Y2, from: b2, diff: w2, to: _2, el: i3, callback: u2.callback, prev: g2, next: d2, repeat: h2 || r3.times, origin: i3.attr(), totalOrigin: l2 }, Kt.push(k2), s2 && !c2 && !p2 && (k2.stop = true, k2.start = new Date() - m2 * s2, 1 == Kt.length))
                  return ee();
                p2 && (k2.start = new Date() - k2.ms * s2), 1 == Kt.length && te(ee);
              }
              t2("raphael.anim.start." + i3.id, i3, r3);
            }
          }
          function se(t3) {
            for (var e3 = 0; e3 < Kt.length; e3++)
              Kt[e3].el.paper == t3 && Kt.splice(e3--, 1);
          }
          Wt.animateWith = function(t3, r3, i3, n3, a2, s2) {
            if (this.removed)
              return s2 && s2.call(this), this;
            var o2 = i3 instanceof ne ? i3 : e2.animation(i3, n3, a2, s2);
            ae(o2, this, o2.percents[0], null, this.attr());
            for (var l2 = 0, h2 = Kt.length; l2 < h2; l2++)
              if (Kt[l2].anim == r3 && Kt[l2].el == t3) {
                Kt[h2 - 1].start = Kt[l2].start;
                break;
              }
            return this;
          }, Wt.onAnimation = function(e3) {
            return e3 ? t2.on("raphael.anim.frame." + this.id, e3) : t2.unbind("raphael.anim.frame." + this.id), this;
          }, ne.prototype.delay = function(t3) {
            var e3 = new ne(this.anim, this.ms);
            return e3.times = this.times, e3.del = +t3 || 0, e3;
          }, ne.prototype.repeat = function(t3) {
            var e3 = new ne(this.anim, this.ms);
            return e3.del = this.del, e3.times = _.floor(w(t3, 0)) || 1, e3;
          }, e2.animation = function(t3, r3, i3, n3) {
            if (t3 instanceof ne)
              return t3;
            !e2.is(i3, "function") && i3 || (n3 = n3 || i3 || null, i3 = null), t3 = Object(t3), r3 = +r3 || 0;
            var a2, s2, l2 = {};
            for (s2 in t3)
              t3[o](s2) && z(s2) != s2 && z(s2) + "%" != s2 && (a2 = true, l2[s2] = t3[s2]);
            if (a2)
              return i3 && (l2.easing = i3), n3 && (l2.callback = n3), new ne({ 100: l2 }, r3);
            if (n3) {
              var h2 = 0;
              for (var u2 in t3) {
                var c2 = F(u2);
                t3[o](u2) && c2 > h2 && (h2 = c2);
              }
              !t3[h2 += "%"].callback && (t3[h2].callback = n3);
            }
            return new ne(t3, r3);
          }, Wt.animate = function(t3, r3, i3, n3) {
            if (this.removed)
              return n3 && n3.call(this), this;
            var a2 = t3 instanceof ne ? t3 : e2.animation(t3, r3, i3, n3);
            return ae(a2, this, a2.percents[0], null, this.attr()), this;
          }, Wt.setTime = function(t3, e3) {
            return t3 && null != e3 && this.status(t3, k(e3, t3.ms) / t3.ms), this;
          }, Wt.status = function(t3, e3) {
            var r3, i3, n3 = [], a2 = 0;
            if (null != e3)
              return ae(t3, this, -1, k(e3, 1)), this;
            for (r3 = Kt.length; a2 < r3; a2++)
              if ((i3 = Kt[a2]).el.id == this.id && (!t3 || i3.anim == t3)) {
                if (t3)
                  return i3.status;
                n3.push({ anim: i3.anim, status: i3.status });
              }
            return t3 ? 0 : n3;
          }, Wt.pause = function(e3) {
            for (var r3 = 0; r3 < Kt.length; r3++)
              Kt[r3].el.id != this.id || e3 && Kt[r3].anim != e3 || false !== t2("raphael.anim.pause." + this.id, this, Kt[r3].anim) && (Kt[r3].paused = true);
            return this;
          }, Wt.resume = function(e3) {
            for (var r3 = 0; r3 < Kt.length; r3++)
              if (Kt[r3].el.id == this.id && (!e3 || Kt[r3].anim == e3)) {
                var i3 = Kt[r3];
                false !== t2("raphael.anim.resume." + this.id, this, i3.anim) && (delete i3.paused, this.status(i3.anim, i3.status));
              }
            return this;
          }, Wt.stop = function(e3) {
            for (var r3 = 0; r3 < Kt.length; r3++)
              Kt[r3].el.id != this.id || e3 && Kt[r3].anim != e3 || false !== t2("raphael.anim.stop." + this.id, this, Kt[r3].anim) && Kt.splice(r3--, 1);
            return this;
          }, t2.on("raphael.remove", se), t2.on("raphael.clear", se), Wt.toString = function() {
            return "Raphaël’s object";
          };
          var oe, le, he, ue, ce = function(t3) {
            if (this.items = [], this.length = 0, this.type = "set", t3)
              for (var e3 = 0, r3 = t3.length; e3 < r3; e3++)
                !t3[e3] || t3[e3].constructor != Wt.constructor && t3[e3].constructor != ce || (this[this.items.length] = this.items[this.items.length] = t3[e3], this.length++);
          }, fe = ce.prototype;
          for (var pe in fe.push = function() {
            for (var t3, e3, r3 = 0, i3 = arguments.length; r3 < i3; r3++)
              !(t3 = arguments[r3]) || t3.constructor != Wt.constructor && t3.constructor != ce || (this[e3 = this.items.length] = this.items[e3] = t3, this.length++);
            return this;
          }, fe.pop = function() {
            return this.length && delete this[this.length--], this.items.pop();
          }, fe.forEach = function(t3, e3) {
            for (var r3 = 0, i3 = this.items.length; r3 < i3; r3++)
              if (false === t3.call(e3, this.items[r3], r3))
                return this;
            return this;
          }, Wt)
            Wt[o](pe) && (fe[pe] = function(t3) {
              return function() {
                var e3 = arguments;
                return this.forEach(function(r3) {
                  r3[t3][c](r3, e3);
                });
              };
            }(pe));
          return fe.attr = function(t3, r3) {
            if (t3 && e2.is(t3, A) && e2.is(t3[0], "object"))
              for (var i3 = 0, n3 = t3.length; i3 < n3; i3++)
                this.items[i3].attr(t3[i3]);
            else
              for (var a2 = 0, s2 = this.items.length; a2 < s2; a2++)
                this.items[a2].attr(t3, r3);
            return this;
          }, fe.clear = function() {
            for (; this.length; )
              this.pop();
          }, fe.splice = function(t3, e3, r3) {
            t3 = t3 < 0 ? w(this.length + t3, 0) : t3, e3 = w(0, k(this.length - t3, e3));
            var i3, n3 = [], a2 = [], s2 = [];
            for (i3 = 2; i3 < arguments.length; i3++)
              s2.push(arguments[i3]);
            for (i3 = 0; i3 < e3; i3++)
              a2.push(this[t3 + i3]);
            for (; i3 < this.length - t3; i3++)
              n3.push(this[t3 + i3]);
            var o2 = s2.length;
            for (i3 = 0; i3 < o2 + n3.length; i3++)
              this.items[t3 + i3] = this[t3 + i3] = i3 < o2 ? s2[i3] : n3[i3 - o2];
            for (i3 = this.items.length = this.length -= e3 - o2; this[i3]; )
              delete this[i3++];
            return new ce(a2);
          }, fe.exclude = function(t3) {
            for (var e3 = 0, r3 = this.length; e3 < r3; e3++)
              if (this[e3] == t3)
                return this.splice(e3, 1), true;
          }, fe.animate = function(t3, r3, i3, n3) {
            (e2.is(i3, "function") || !i3) && (n3 = i3 || null);
            var a2, s2, o2 = this.items.length, l2 = o2, h2 = this;
            if (!o2)
              return this;
            n3 && (s2 = function() {
              !--o2 && n3.call(h2);
            }), i3 = e2.is(i3, "string") ? i3 : s2;
            var u2 = e2.animation(t3, r3, i3, s2);
            for (a2 = this.items[--l2].animate(u2); l2--; )
              this.items[l2] && !this.items[l2].removed && this.items[l2].animateWith(a2, u2, u2), this.items[l2] && !this.items[l2].removed || o2--;
            return this;
          }, fe.insertAfter = function(t3) {
            for (var e3 = this.items.length; e3--; )
              this.items[e3].insertAfter(t3);
            return this;
          }, fe.getBBox = function() {
            for (var t3 = [], e3 = [], r3 = [], i3 = [], n3 = this.items.length; n3--; )
              if (!this.items[n3].removed) {
                var a2 = this.items[n3].getBBox();
                t3.push(a2.x), e3.push(a2.y), r3.push(a2.x + a2.width), i3.push(a2.y + a2.height);
              }
            return { x: t3 = k[c](0, t3), y: e3 = k[c](0, e3), x2: r3 = w[c](0, r3), y2: i3 = w[c](0, i3), width: r3 - t3, height: i3 - e3 };
          }, fe.clone = function(t3) {
            t3 = this.paper.set();
            for (var e3 = 0, r3 = this.items.length; e3 < r3; e3++)
              t3.push(this.items[e3].clone());
            return t3;
          }, fe.toString = function() {
            return "Raphaël‘s set";
          }, fe.glow = function(t3) {
            var e3 = this.paper.set();
            return this.forEach(function(r3, i3) {
              var n3 = r3.glow(t3);
              null != n3 && n3.forEach(function(t4, r4) {
                e3.push(t4);
              });
            }), e3;
          }, fe.isPointInside = function(t3, e3) {
            var r3 = false;
            return this.forEach(function(i3) {
              if (i3.isPointInside(t3, e3))
                return r3 = true, false;
            }), r3;
          }, e2.registerFont = function(t3) {
            if (!t3.face)
              return t3;
            this.fonts = this.fonts || {};
            var e3 = { w: t3.w, face: {}, glyphs: {} }, r3 = t3.face["font-family"];
            for (var i3 in t3.face)
              t3.face[o](i3) && (e3.face[i3] = t3.face[i3]);
            if (this.fonts[r3] ? this.fonts[r3].push(e3) : this.fonts[r3] = [e3], !t3.svg) {
              for (var n3 in e3.face["units-per-em"] = F(t3.face["units-per-em"], 10), t3.glyphs)
                if (t3.glyphs[o](n3)) {
                  var a2 = t3.glyphs[n3];
                  if (e3.glyphs[n3] = { w: a2.w, k: {}, d: a2.d && "M" + a2.d.replace(/[mlcxtrv]/g, function(t4) {
                    return { l: "L", c: "C", x: "z", t: "m", r: "l", v: "c" }[t4] || "M";
                  }) + "z" }, a2.k)
                    for (var s2 in a2.k)
                      a2[o](s2) && (e3.glyphs[n3].k[s2] = a2.k[s2]);
                }
            }
            return t3;
          }, i2.getFont = function(t3, r3, i3, n3) {
            if (n3 = n3 || "normal", i3 = i3 || "normal", r3 = +r3 || { normal: 400, bold: 700, lighter: 300, bolder: 800 }[r3] || 400, e2.fonts) {
              var a2, s2 = e2.fonts[t3];
              if (!s2) {
                var l2 = new RegExp("(^|\\s)" + t3.replace(/[^\w\d\s+!~.:_-]/g, d) + "(\\s|$)", "i");
                for (var h2 in e2.fonts)
                  if (e2.fonts[o](h2) && l2.test(h2)) {
                    s2 = e2.fonts[h2];
                    break;
                  }
              }
              if (s2)
                for (var u2 = 0, c2 = s2.length; u2 < c2 && ((a2 = s2[u2]).face["font-weight"] != r3 || a2.face["font-style"] != i3 && a2.face["font-style"] || a2.face["font-stretch"] != n3); u2++)
                  ;
              return a2;
            }
          }, i2.print = function(t3, r3, i3, a2, s2, o2, l2, h2) {
            o2 = o2 || "middle", l2 = w(k(l2 || 0, 1), -1), h2 = w(k(h2 || 1, 3), 1);
            var u2, c2 = x(i3)[v](d), f2 = 0, p2 = 0, g2 = d;
            if (e2.is(a2, "string") && (a2 = this.getFont(a2)), a2) {
              u2 = (s2 || 16) / a2.face["units-per-em"];
              for (var y2 = a2.face.bbox[v](n2), m2 = +y2[0], b2 = y2[3] - y2[1], _2 = 0, B2 = +y2[1] + ("baseline" == o2 ? b2 + +a2.face.descent : b2 / 2), C2 = 0, S2 = c2.length; C2 < S2; C2++) {
                if ("\n" == c2[C2])
                  f2 = 0, A2 = 0, p2 = 0, _2 += b2 * h2;
                else {
                  var T2 = p2 && a2.glyphs[c2[C2 - 1]] || {}, A2 = a2.glyphs[c2[C2]];
                  f2 += p2 ? (T2.w || a2.w) + (T2.k && T2.k[c2[C2]] || 0) + a2.w * l2 : 0, p2 = 1;
                }
                A2 && A2.d && (g2 += e2.transformPath(A2.d, ["t", f2 * u2, _2 * u2, "s", u2, u2, m2, B2, "t", (t3 - m2) / u2, (r3 - B2) / u2]));
              }
            }
            return this.path(g2).attr({ fill: "#000", stroke: "none" });
          }, i2.add = function(t3) {
            if (e2.is(t3, "array"))
              for (var r3, i3 = this.set(), n3 = 0, s2 = t3.length; n3 < s2; n3++)
                r3 = t3[n3] || {}, a[o](r3.type) && i3.push(this[r3.type]().attr(r3));
            return i3;
          }, e2.format = function(t3, r3) {
            var i3 = e2.is(r3, A) ? [0][f](r3) : arguments;
            return t3 && e2.is(t3, "string") && i3.length - 1 && (t3 = t3.replace(s, function(t4, e3) {
              return null == i3[++e3] ? d : i3[e3];
            })), t3 || d;
          }, e2.fullfill = (oe = /\{([^\}]+)\}/g, le = /(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g, function(t3, e3) {
            return String(t3).replace(oe, function(t4, r3) {
              return function(t5, e4, r4) {
                var i3 = r4;
                return e4.replace(le, function(t6, e5, r5, n3, a2) {
                  e5 = e5 || n3, i3 && (e5 in i3 && (i3 = i3[e5]), "function" == typeof i3 && a2 && (i3 = i3()));
                }), i3 = (null == i3 || i3 == r4 ? t5 : i3) + "";
              }(t4, r3, e3);
            });
          }), e2.ninja = function() {
            if (h.was)
              l.win.Raphael = h.is;
            else {
              window.Raphael = void 0;
              try {
                delete window.Raphael;
              } catch (t3) {
              }
            }
            return e2;
          }, e2.st = fe, t2.on("raphael.DOMload", function() {
            r2 = true;
          }), null == (he = document).readyState && he.addEventListener && (he.addEventListener("DOMContentLoaded", ue = function() {
            he.removeEventListener("DOMContentLoaded", ue, false), he.readyState = "complete";
          }, false), he.readyState = "loading"), function t3() {
            /in/.test(he.readyState) ? setTimeout(t3, 9) : e2.eve("raphael.DOMload");
          }(), e2;
        }.apply(e, i)) || (t.exports = n);
      }, function(t, e, r) {
        var i, n;
        i = [r(0), r(3), r(4)], void 0 === (n = function(t2) {
          return t2;
        }.apply(e, i)) || (t.exports = n);
      }, function(t, e, r) {
        var i, n, a, s, o, l, h, u, c, f, p, d, g, x;
        s = "hasOwnProperty", o = /[\.\/]/, l = /\s*,\s*/, h = function(t2, e2) {
          return t2 - e2;
        }, u = { n: {} }, c = function() {
          for (var t2 = 0, e2 = this.length; t2 < e2; t2++)
            if (void 0 !== this[t2])
              return this[t2];
        }, f = function() {
          for (var t2 = this.length; --t2; )
            if (void 0 !== this[t2])
              return this[t2];
        }, p = Object.prototype.toString, d = String, g = Array.isArray || function(t2) {
          return t2 instanceof Array || "[object Array]" == p.call(t2);
        }, (x = function(t2, e2) {
          var r2, i2 = a, s2 = Array.prototype.slice.call(arguments, 2), o2 = x.listeners(t2), l2 = 0, u2 = [], p2 = {}, d2 = [], g2 = n;
          d2.firstDefined = c, d2.lastDefined = f, n = t2, a = 0;
          for (var v = 0, y = o2.length; v < y; v++)
            "zIndex" in o2[v] && (u2.push(o2[v].zIndex), o2[v].zIndex < 0 && (p2[o2[v].zIndex] = o2[v]));
          for (u2.sort(h); u2[l2] < 0; )
            if (r2 = p2[u2[l2++]], d2.push(r2.apply(e2, s2)), a)
              return a = i2, d2;
          for (v = 0; v < y; v++)
            if ("zIndex" in (r2 = o2[v]))
              if (r2.zIndex == u2[l2]) {
                if (d2.push(r2.apply(e2, s2)), a)
                  break;
                do {
                  if ((r2 = p2[u2[++l2]]) && d2.push(r2.apply(e2, s2)), a)
                    break;
                } while (r2);
              } else
                p2[r2.zIndex] = r2;
            else if (d2.push(r2.apply(e2, s2)), a)
              break;
          return a = i2, n = g2, d2;
        })._events = u, x.listeners = function(t2) {
          var e2, r2, i2, n2, a2, s2, l2, h2, c2 = g(t2) ? t2 : t2.split(o), f2 = u, p2 = [f2], d2 = [];
          for (n2 = 0, a2 = c2.length; n2 < a2; n2++) {
            for (h2 = [], s2 = 0, l2 = p2.length; s2 < l2; s2++)
              for (r2 = [(f2 = p2[s2].n)[c2[n2]], f2["*"]], i2 = 2; i2--; )
                (e2 = r2[i2]) && (h2.push(e2), d2 = d2.concat(e2.f || []));
            p2 = h2;
          }
          return d2;
        }, x.separator = function(t2) {
          t2 ? (t2 = "[" + (t2 = d(t2).replace(/(?=[\.\^\]\[\-])/g, "\\")) + "]", o = new RegExp(t2)) : o = /[\.\/]/;
        }, x.on = function(t2, e2) {
          if ("function" != typeof e2)
            return function() {
            };
          for (var r2 = g(t2) ? g(t2[0]) ? t2 : [t2] : d(t2).split(l), i2 = 0, n2 = r2.length; i2 < n2; i2++)
            !function(t3) {
              for (var r3, i3 = g(t3) ? t3 : d(t3).split(o), n3 = u, a2 = 0, s2 = i3.length; a2 < s2; a2++)
                n3 = (n3 = n3.n).hasOwnProperty(i3[a2]) && n3[i3[a2]] || (n3[i3[a2]] = { n: {} });
              for (n3.f = n3.f || [], a2 = 0, s2 = n3.f.length; a2 < s2; a2++)
                if (n3.f[a2] == e2) {
                  r3 = true;
                  break;
                }
              !r3 && n3.f.push(e2);
            }(r2[i2]);
          return function(t3) {
            +t3 == +t3 && (e2.zIndex = +t3);
          };
        }, x.f = function(t2) {
          var e2 = [].slice.call(arguments, 1);
          return function() {
            x.apply(null, [t2, null].concat(e2).concat([].slice.call(arguments, 0)));
          };
        }, x.stop = function() {
          a = 1;
        }, x.nt = function(t2) {
          var e2 = g(n) ? n.join(".") : n;
          return t2 ? new RegExp("(?:\\.|\\/|^)" + t2 + "(?:\\.|\\/|$)").test(e2) : e2;
        }, x.nts = function() {
          return g(n) ? n : n.split(o);
        }, x.off = x.unbind = function(t2, e2) {
          if (t2) {
            var r2 = g(t2) ? g(t2[0]) ? t2 : [t2] : d(t2).split(l);
            if (r2.length > 1)
              for (var i2 = 0, n2 = r2.length; i2 < n2; i2++)
                x.off(r2[i2], e2);
            else {
              r2 = g(t2) ? t2 : d(t2).split(o);
              var a2, h2, c2, f2, p2, v = [u];
              for (i2 = 0, n2 = r2.length; i2 < n2; i2++)
                for (f2 = 0; f2 < v.length; f2 += c2.length - 2) {
                  if (c2 = [f2, 1], a2 = v[f2].n, "*" != r2[i2])
                    a2[r2[i2]] && c2.push(a2[r2[i2]]);
                  else
                    for (h2 in a2)
                      a2[s](h2) && c2.push(a2[h2]);
                  v.splice.apply(v, c2);
                }
              for (i2 = 0, n2 = v.length; i2 < n2; i2++)
                for (a2 = v[i2]; a2.n; ) {
                  if (e2) {
                    if (a2.f) {
                      for (f2 = 0, p2 = a2.f.length; f2 < p2; f2++)
                        if (a2.f[f2] == e2) {
                          a2.f.splice(f2, 1);
                          break;
                        }
                      !a2.f.length && delete a2.f;
                    }
                    for (h2 in a2.n)
                      if (a2.n[s](h2) && a2.n[h2].f) {
                        var y = a2.n[h2].f;
                        for (f2 = 0, p2 = y.length; f2 < p2; f2++)
                          if (y[f2] == e2) {
                            y.splice(f2, 1);
                            break;
                          }
                        !y.length && delete a2.n[h2].f;
                      }
                  } else
                    for (h2 in delete a2.f, a2.n)
                      a2.n[s](h2) && a2.n[h2].f && delete a2.n[h2].f;
                  a2 = a2.n;
                }
            }
          } else
            x._events = u = { n: {} };
        }, x.once = function(t2, e2) {
          var r2 = function() {
            return x.off(t2, r2), e2.apply(this, arguments);
          };
          return x.on(t2, r2);
        }, x.version = "0.5.0", x.toString = function() {
          return "You are running Eve 0.5.0";
        }, t.exports ? t.exports = x : void 0 === (i = function() {
          return x;
        }.apply(e, [])) || (t.exports = i);
      }, function(t, e, r) {
        var i, n;
        i = [r(0)], void 0 === (n = function(t2) {
          if (!t2 || t2.svg) {
            var e2 = "hasOwnProperty", r2 = String, i2 = parseFloat, n2 = parseInt, a = Math, s = a.max, o = a.abs, l = a.pow, h = /[, ]+/, u = t2.eve, c = "", f = " ", p = "http://www.w3.org/1999/xlink", d = { block: "M5,0 0,2.5 5,5z", classic: "M5,0 0,2.5 5,5 3.5,3 3.5,2z", diamond: "M2.5,0 5,2.5 2.5,5 0,2.5z", open: "M6,1 1,3.5 6,6", oval: "M2.5,0A2.5,2.5,0,0,1,2.5,5 2.5,2.5,0,0,1,2.5,0z" }, g = {};
            t2.toString = function() {
              return "Your browser supports SVG.\nYou are running Raphaël " + this.version;
            };
            var x = function(i3, n3) {
              if (n3)
                for (var a2 in "string" == typeof i3 && (i3 = x(i3)), n3)
                  n3[e2](a2) && ("xlink:" == a2.substring(0, 6) ? i3.setAttributeNS(p, a2.substring(6), r2(n3[a2])) : i3.setAttribute(a2, r2(n3[a2])));
              else
                (i3 = t2._g.doc.createElementNS("http://www.w3.org/2000/svg", i3)).style && (i3.style.webkitTapHighlightColor = "rgba(0,0,0,0)");
              return i3;
            }, v = function(e3, n3) {
              var h2 = "linear", u2 = e3.id + n3, f2 = 0.5, p2 = 0.5, d2 = e3.node, g2 = e3.paper, v2 = d2.style, m2 = t2._g.doc.getElementById(u2);
              if (!m2) {
                if (n3 = (n3 = r2(n3).replace(t2._radial_gradient, function(t3, e4, r3) {
                  if (h2 = "radial", e4 && r3) {
                    f2 = i2(e4);
                    var n4 = 2 * ((p2 = i2(r3)) > 0.5) - 1;
                    l(f2 - 0.5, 2) + l(p2 - 0.5, 2) > 0.25 && (p2 = a.sqrt(0.25 - l(f2 - 0.5, 2)) * n4 + 0.5) && 0.5 != p2 && (p2 = p2.toFixed(5) - 1e-5 * n4);
                  }
                  return c;
                })).split(/\s*\-\s*/), "linear" == h2) {
                  var b2 = n3.shift();
                  if (b2 = -i2(b2), isNaN(b2))
                    return null;
                  var _2 = [0, 0, a.cos(t2.rad(b2)), a.sin(t2.rad(b2))], w2 = 1 / (s(o(_2[2]), o(_2[3])) || 1);
                  _2[2] *= w2, _2[3] *= w2, _2[2] < 0 && (_2[0] = -_2[2], _2[2] = 0), _2[3] < 0 && (_2[1] = -_2[3], _2[3] = 0);
                }
                var k2 = t2._parseDots(n3);
                if (!k2)
                  return null;
                if (u2 = u2.replace(/[\(\)\s,\xb0#]/g, "_"), e3.gradient && u2 != e3.gradient.id && (g2.defs.removeChild(e3.gradient), delete e3.gradient), !e3.gradient) {
                  m2 = x(h2 + "Gradient", { id: u2 }), e3.gradient = m2, x(m2, "radial" == h2 ? { fx: f2, fy: p2 } : { x1: _2[0], y1: _2[1], x2: _2[2], y2: _2[3], gradientTransform: e3.matrix.invert() }), g2.defs.appendChild(m2);
                  for (var B2 = 0, C2 = k2.length; B2 < C2; B2++)
                    m2.appendChild(x("stop", { offset: k2[B2].offset ? k2[B2].offset : B2 ? "100%" : "0%", "stop-color": k2[B2].color || "#fff", "stop-opacity": isFinite(k2[B2].opacity) ? k2[B2].opacity : 1 }));
                }
              }
              return x(d2, { fill: y(u2), opacity: 1, "fill-opacity": 1 }), v2.fill = c, v2.opacity = 1, v2.fillOpacity = 1, 1;
            }, y = function(t3) {
              if ((e3 = document.documentMode) && (9 === e3 || 10 === e3))
                return "url('#" + t3 + "')";
              var e3, r3 = document.location;
              return "url('" + (r3.protocol + "//" + r3.host + r3.pathname + r3.search) + "#" + t3 + "')";
            }, m = function(t3) {
              var e3 = t3.getBBox(1);
              x(t3.pattern, { patternTransform: t3.matrix.invert() + " translate(" + e3.x + "," + e3.y + ")" });
            }, b = function(i3, n3, a2) {
              if ("path" == i3.type) {
                for (var s2, o2, l2, h2, u2, f2 = r2(n3).toLowerCase().split("-"), p2 = i3.paper, v2 = a2 ? "end" : "start", y2 = i3.node, m2 = i3.attrs, b2 = m2["stroke-width"], _2 = f2.length, w2 = "classic", k2 = 3, B2 = 3, C2 = 5; _2--; )
                  switch (f2[_2]) {
                    case "block":
                    case "classic":
                    case "oval":
                    case "diamond":
                    case "open":
                    case "none":
                      w2 = f2[_2];
                      break;
                    case "wide":
                      B2 = 5;
                      break;
                    case "narrow":
                      B2 = 2;
                      break;
                    case "long":
                      k2 = 5;
                      break;
                    case "short":
                      k2 = 2;
                  }
                if ("open" == w2 ? (k2 += 2, B2 += 2, C2 += 2, l2 = 1, h2 = a2 ? 4 : 1, u2 = { fill: "none", stroke: m2.stroke }) : (h2 = l2 = k2 / 2, u2 = { fill: m2.stroke, stroke: "none" }), i3._.arrows ? a2 ? (i3._.arrows.endPath && g[i3._.arrows.endPath]--, i3._.arrows.endMarker && g[i3._.arrows.endMarker]--) : (i3._.arrows.startPath && g[i3._.arrows.startPath]--, i3._.arrows.startMarker && g[i3._.arrows.startMarker]--) : i3._.arrows = {}, "none" != w2) {
                  var S2 = "raphael-marker-" + w2, T2 = "raphael-marker-" + v2 + w2 + k2 + B2 + "-obj" + i3.id;
                  t2._g.doc.getElementById(S2) ? g[S2]++ : (p2.defs.appendChild(x(x("path"), { "stroke-linecap": "round", d: d[w2], id: S2 })), g[S2] = 1);
                  var A2, M2 = t2._g.doc.getElementById(T2);
                  M2 ? (g[T2]++, A2 = M2.getElementsByTagName("use")[0]) : (M2 = x(x("marker"), { id: T2, markerHeight: B2, markerWidth: k2, orient: "auto", refX: h2, refY: B2 / 2 }), A2 = x(x("use"), { "xlink:href": "#" + S2, transform: (a2 ? "rotate(180 " + k2 / 2 + " " + B2 / 2 + ") " : c) + "scale(" + k2 / C2 + "," + B2 / C2 + ")", "stroke-width": (1 / ((k2 / C2 + B2 / C2) / 2)).toFixed(4) }), M2.appendChild(A2), p2.defs.appendChild(M2), g[T2] = 1), x(A2, u2);
                  var E = l2 * ("diamond" != w2 && "oval" != w2);
                  a2 ? (s2 = i3._.arrows.startdx * b2 || 0, o2 = t2.getTotalLength(m2.path) - E * b2) : (s2 = E * b2, o2 = t2.getTotalLength(m2.path) - (i3._.arrows.enddx * b2 || 0)), (u2 = {})["marker-" + v2] = "url(#" + T2 + ")", (o2 || s2) && (u2.d = t2.getSubpath(m2.path, s2, o2)), x(y2, u2), i3._.arrows[v2 + "Path"] = S2, i3._.arrows[v2 + "Marker"] = T2, i3._.arrows[v2 + "dx"] = E, i3._.arrows[v2 + "Type"] = w2, i3._.arrows[v2 + "String"] = n3;
                } else
                  a2 ? (s2 = i3._.arrows.startdx * b2 || 0, o2 = t2.getTotalLength(m2.path) - s2) : (s2 = 0, o2 = t2.getTotalLength(m2.path) - (i3._.arrows.enddx * b2 || 0)), i3._.arrows[v2 + "Path"] && x(y2, { d: t2.getSubpath(m2.path, s2, o2) }), delete i3._.arrows[v2 + "Path"], delete i3._.arrows[v2 + "Marker"], delete i3._.arrows[v2 + "dx"], delete i3._.arrows[v2 + "Type"], delete i3._.arrows[v2 + "String"];
                for (u2 in g)
                  if (g[e2](u2) && !g[u2]) {
                    var N = t2._g.doc.getElementById(u2);
                    N && N.parentNode.removeChild(N);
                  }
              }
            }, _ = { "-": [3, 1], ".": [1, 1], "-.": [3, 1, 1, 1], "-..": [3, 1, 1, 1, 1, 1], ". ": [1, 3], "- ": [4, 3], "--": [8, 3], "- .": [4, 3, 1, 3], "--.": [8, 3, 1, 3], "--..": [8, 3, 1, 3, 1, 3] }, w = function(t3, e3, i3) {
              if (e3 = _[r2(e3).toLowerCase()]) {
                for (var n3 = t3.attrs["stroke-width"] || "1", a2 = { round: n3, square: n3, butt: 0 }[t3.attrs["stroke-linecap"] || i3["stroke-linecap"]] || 0, s2 = [], o2 = e3.length; o2--; )
                  s2[o2] = e3[o2] * n3 + (o2 % 2 ? 1 : -1) * a2;
                x(t3.node, { "stroke-dasharray": s2.join(",") });
              } else
                x(t3.node, { "stroke-dasharray": "none" });
            }, k = function(i3, a2) {
              var l2 = i3.node, u2 = i3.attrs, f2 = l2.style.visibility;
              for (var d2 in l2.style.visibility = "hidden", a2)
                if (a2[e2](d2)) {
                  if (!t2._availableAttrs[e2](d2))
                    continue;
                  var g2 = a2[d2];
                  switch (u2[d2] = g2, d2) {
                    case "blur":
                      i3.blur(g2);
                      break;
                    case "title":
                      var y2 = l2.getElementsByTagName("title");
                      if (y2.length && (y2 = y2[0]))
                        y2.firstChild.nodeValue = g2;
                      else {
                        y2 = x("title");
                        var _2 = t2._g.doc.createTextNode(g2);
                        y2.appendChild(_2), l2.appendChild(y2);
                      }
                      break;
                    case "href":
                    case "target":
                      var k2 = l2.parentNode;
                      if ("a" != k2.tagName.toLowerCase()) {
                        var C2 = x("a");
                        k2.insertBefore(C2, l2), C2.appendChild(l2), k2 = C2;
                      }
                      "target" == d2 ? k2.setAttributeNS(p, "show", "blank" == g2 ? "new" : g2) : k2.setAttributeNS(p, d2, g2);
                      break;
                    case "cursor":
                      l2.style.cursor = g2;
                      break;
                    case "transform":
                      i3.transform(g2);
                      break;
                    case "arrow-start":
                      b(i3, g2);
                      break;
                    case "arrow-end":
                      b(i3, g2, 1);
                      break;
                    case "clip-rect":
                      var S2 = r2(g2).split(h);
                      if (4 == S2.length) {
                        i3.clip && i3.clip.parentNode.parentNode.removeChild(i3.clip.parentNode);
                        var T2 = x("clipPath"), A2 = x("rect");
                        T2.id = t2.createUUID(), x(A2, { x: S2[0], y: S2[1], width: S2[2], height: S2[3] }), T2.appendChild(A2), i3.paper.defs.appendChild(T2), x(l2, { "clip-path": "url(#" + T2.id + ")" }), i3.clip = A2;
                      }
                      if (!g2) {
                        var M2 = l2.getAttribute("clip-path");
                        if (M2) {
                          var E = t2._g.doc.getElementById(M2.replace(/(^url\(#|\)$)/g, c));
                          E && E.parentNode.removeChild(E), x(l2, { "clip-path": c }), delete i3.clip;
                        }
                      }
                      break;
                    case "path":
                      "path" == i3.type && (x(l2, { d: g2 ? u2.path = t2._pathToAbsolute(g2) : "M0,0" }), i3._.dirty = 1, i3._.arrows && ("startString" in i3._.arrows && b(i3, i3._.arrows.startString), "endString" in i3._.arrows && b(i3, i3._.arrows.endString, 1)));
                      break;
                    case "width":
                      if (l2.setAttribute(d2, g2), i3._.dirty = 1, !u2.fx)
                        break;
                      d2 = "x", g2 = u2.x;
                    case "x":
                      u2.fx && (g2 = -u2.x - (u2.width || 0));
                    case "rx":
                      if ("rx" == d2 && "rect" == i3.type)
                        break;
                    case "cx":
                      l2.setAttribute(d2, g2), i3.pattern && m(i3), i3._.dirty = 1;
                      break;
                    case "height":
                      if (l2.setAttribute(d2, g2), i3._.dirty = 1, !u2.fy)
                        break;
                      d2 = "y", g2 = u2.y;
                    case "y":
                      u2.fy && (g2 = -u2.y - (u2.height || 0));
                    case "ry":
                      if ("ry" == d2 && "rect" == i3.type)
                        break;
                    case "cy":
                      l2.setAttribute(d2, g2), i3.pattern && m(i3), i3._.dirty = 1;
                      break;
                    case "r":
                      "rect" == i3.type ? x(l2, { rx: g2, ry: g2 }) : l2.setAttribute(d2, g2), i3._.dirty = 1;
                      break;
                    case "src":
                      "image" == i3.type && l2.setAttributeNS(p, "href", g2);
                      break;
                    case "stroke-width":
                      1 == i3._.sx && 1 == i3._.sy || (g2 /= s(o(i3._.sx), o(i3._.sy)) || 1), l2.setAttribute(d2, g2), u2["stroke-dasharray"] && w(i3, u2["stroke-dasharray"], a2), i3._.arrows && ("startString" in i3._.arrows && b(i3, i3._.arrows.startString), "endString" in i3._.arrows && b(i3, i3._.arrows.endString, 1));
                      break;
                    case "stroke-dasharray":
                      w(i3, g2, a2);
                      break;
                    case "fill":
                      var N = r2(g2).match(t2._ISURL);
                      if (N) {
                        T2 = x("pattern");
                        var L = x("image");
                        T2.id = t2.createUUID(), x(T2, { x: 0, y: 0, patternUnits: "userSpaceOnUse", height: 1, width: 1 }), x(L, { x: 0, y: 0, "xlink:href": N[1] }), T2.appendChild(L), function(e3) {
                          t2._preload(N[1], function() {
                            var t3 = this.offsetWidth, r3 = this.offsetHeight;
                            x(e3, { width: t3, height: r3 }), x(L, { width: t3, height: r3 });
                          });
                        }(T2), i3.paper.defs.appendChild(T2), x(l2, { fill: "url(#" + T2.id + ")" }), i3.pattern = T2, i3.pattern && m(i3);
                        break;
                      }
                      var P = t2.getRGB(g2);
                      if (P.error) {
                        if (("circle" == i3.type || "ellipse" == i3.type || "r" != r2(g2).charAt()) && v(i3, g2)) {
                          if ("opacity" in u2 || "fill-opacity" in u2) {
                            var z = t2._g.doc.getElementById(l2.getAttribute("fill").replace(/^url\(#|\)$/g, c));
                            if (z) {
                              var F = z.getElementsByTagName("stop");
                              x(F[F.length - 1], { "stop-opacity": ("opacity" in u2 ? u2.opacity : 1) * ("fill-opacity" in u2 ? u2["fill-opacity"] : 1) });
                            }
                          }
                          u2.gradient = g2, u2.fill = "none";
                          break;
                        }
                      } else
                        delete a2.gradient, delete u2.gradient, !t2.is(u2.opacity, "undefined") && t2.is(a2.opacity, "undefined") && x(l2, { opacity: u2.opacity }), !t2.is(u2["fill-opacity"], "undefined") && t2.is(a2["fill-opacity"], "undefined") && x(l2, { "fill-opacity": u2["fill-opacity"] });
                      P[e2]("opacity") && x(l2, { "fill-opacity": P.opacity > 1 ? P.opacity / 100 : P.opacity });
                    case "stroke":
                      P = t2.getRGB(g2), l2.setAttribute(d2, P.hex), "stroke" == d2 && P[e2]("opacity") && x(l2, { "stroke-opacity": P.opacity > 1 ? P.opacity / 100 : P.opacity }), "stroke" == d2 && i3._.arrows && ("startString" in i3._.arrows && b(i3, i3._.arrows.startString), "endString" in i3._.arrows && b(i3, i3._.arrows.endString, 1));
                      break;
                    case "gradient":
                      ("circle" == i3.type || "ellipse" == i3.type || "r" != r2(g2).charAt()) && v(i3, g2);
                      break;
                    case "opacity":
                      u2.gradient && !u2[e2]("stroke-opacity") && x(l2, { "stroke-opacity": g2 > 1 ? g2 / 100 : g2 });
                    case "fill-opacity":
                      if (u2.gradient) {
                        (z = t2._g.doc.getElementById(l2.getAttribute("fill").replace(/^url\(#|\)$/g, c))) && (F = z.getElementsByTagName("stop"), x(F[F.length - 1], { "stop-opacity": g2 }));
                        break;
                      }
                    default:
                      "font-size" == d2 && (g2 = n2(g2, 10) + "px");
                      var R = d2.replace(/(\-.)/g, function(t3) {
                        return t3.substring(1).toUpperCase();
                      });
                      l2.style[R] = g2, i3._.dirty = 1, l2.setAttribute(d2, g2);
                  }
                }
              B(i3, a2), l2.style.visibility = f2;
            }, B = function(i3, a2) {
              if ("text" == i3.type && (a2[e2]("text") || a2[e2]("font") || a2[e2]("font-size") || a2[e2]("x") || a2[e2]("y"))) {
                var s2 = i3.attrs, o2 = i3.node, l2 = o2.firstChild ? n2(t2._g.doc.defaultView.getComputedStyle(o2.firstChild, c).getPropertyValue("font-size"), 10) : 10;
                if (a2[e2]("text")) {
                  for (s2.text = a2.text; o2.firstChild; )
                    o2.removeChild(o2.firstChild);
                  for (var h2, u2 = r2(a2.text).split("\n"), f2 = [], p2 = 0, d2 = u2.length; p2 < d2; p2++)
                    h2 = x("tspan"), p2 && x(h2, { dy: 1.2 * l2, x: s2.x }), h2.appendChild(t2._g.doc.createTextNode(u2[p2])), o2.appendChild(h2), f2[p2] = h2;
                } else
                  for (p2 = 0, d2 = (f2 = o2.getElementsByTagName("tspan")).length; p2 < d2; p2++)
                    p2 ? x(f2[p2], { dy: 1.2 * l2, x: s2.x }) : x(f2[0], { dy: 0 });
                x(o2, { x: s2.x, y: s2.y }), i3._.dirty = 1;
                var g2 = i3._getBBox(), v2 = s2.y - (g2.y + g2.height / 2);
                v2 && t2.is(v2, "finite") && x(f2[0], { dy: v2 });
              }
            }, C = function(t3) {
              return t3.parentNode && "a" === t3.parentNode.tagName.toLowerCase() ? t3.parentNode : t3;
            }, S = function(e3, r3) {
              this[0] = this.node = e3, e3.raphael = true, this.id = ("0000" + (Math.random() * Math.pow(36, 5) << 0).toString(36)).slice(-5), e3.raphaelid = this.id, this.matrix = t2.matrix(), this.realPath = null, this.paper = r3, this.attrs = this.attrs || {}, this._ = { transform: [], sx: 1, sy: 1, deg: 0, dx: 0, dy: 0, dirty: 1 }, !r3.bottom && (r3.bottom = this), this.prev = r3.top, r3.top && (r3.top.next = this), r3.top = this, this.next = null;
            }, T = t2.el;
            S.prototype = T, T.constructor = S, t2._engine.path = function(t3, e3) {
              var r3 = x("path");
              e3.canvas && e3.canvas.appendChild(r3);
              var i3 = new S(r3, e3);
              return i3.type = "path", k(i3, { fill: "none", stroke: "#000", path: t3 }), i3;
            }, T.rotate = function(t3, e3, n3) {
              if (this.removed)
                return this;
              if ((t3 = r2(t3).split(h)).length - 1 && (e3 = i2(t3[1]), n3 = i2(t3[2])), t3 = i2(t3[0]), null == n3 && (e3 = n3), null == e3 || null == n3) {
                var a2 = this.getBBox(1);
                e3 = a2.x + a2.width / 2, n3 = a2.y + a2.height / 2;
              }
              return this.transform(this._.transform.concat([["r", t3, e3, n3]])), this;
            }, T.scale = function(t3, e3, n3, a2) {
              if (this.removed)
                return this;
              if ((t3 = r2(t3).split(h)).length - 1 && (e3 = i2(t3[1]), n3 = i2(t3[2]), a2 = i2(t3[3])), t3 = i2(t3[0]), null == e3 && (e3 = t3), null == a2 && (n3 = a2), null == n3 || null == a2)
                var s2 = this.getBBox(1);
              return n3 = null == n3 ? s2.x + s2.width / 2 : n3, a2 = null == a2 ? s2.y + s2.height / 2 : a2, this.transform(this._.transform.concat([["s", t3, e3, n3, a2]])), this;
            }, T.translate = function(t3, e3) {
              return this.removed ? this : ((t3 = r2(t3).split(h)).length - 1 && (e3 = i2(t3[1])), t3 = i2(t3[0]) || 0, e3 = +e3 || 0, this.transform(this._.transform.concat([["t", t3, e3]])), this);
            }, T.transform = function(r3) {
              var i3 = this._;
              if (null == r3)
                return i3.transform;
              if (t2._extractTransform(this, r3), this.clip && x(this.clip, { transform: this.matrix.invert() }), this.pattern && m(this), this.node && x(this.node, { transform: this.matrix }), 1 != i3.sx || 1 != i3.sy) {
                var n3 = this.attrs[e2]("stroke-width") ? this.attrs["stroke-width"] : 1;
                this.attr({ "stroke-width": n3 });
              }
              return this;
            }, T.hide = function() {
              return this.removed || (this.node.style.display = "none"), this;
            }, T.show = function() {
              return this.removed || (this.node.style.display = ""), this;
            }, T.remove = function() {
              var e3 = C(this.node);
              if (!this.removed && e3.parentNode) {
                var r3 = this.paper;
                for (var i3 in r3.__set__ && r3.__set__.exclude(this), u.unbind("raphael.*.*." + this.id), this.gradient && r3.defs.removeChild(this.gradient), t2._tear(this, r3), e3.parentNode.removeChild(e3), this.removeData(), this)
                  this[i3] = "function" == typeof this[i3] ? t2._removedFactory(i3) : null;
                this.removed = true;
              }
            }, T._getBBox = function() {
              if ("none" == this.node.style.display) {
                this.show();
                var t3 = true;
              }
              var e3, r3 = false;
              this.paper.canvas.parentElement ? e3 = this.paper.canvas.parentElement.style : this.paper.canvas.parentNode && (e3 = this.paper.canvas.parentNode.style), e3 && "none" == e3.display && (r3 = true, e3.display = "");
              var i3 = {};
              try {
                i3 = this.node.getBBox();
              } catch (t4) {
                i3 = { x: this.node.clientLeft, y: this.node.clientTop, width: this.node.clientWidth, height: this.node.clientHeight };
              } finally {
                i3 = i3 || {}, r3 && (e3.display = "none");
              }
              return t3 && this.hide(), i3;
            }, T.attr = function(r3, i3) {
              if (this.removed)
                return this;
              if (null == r3) {
                var n3 = {};
                for (var a2 in this.attrs)
                  this.attrs[e2](a2) && (n3[a2] = this.attrs[a2]);
                return n3.gradient && "none" == n3.fill && (n3.fill = n3.gradient) && delete n3.gradient, n3.transform = this._.transform, n3;
              }
              if (null == i3 && t2.is(r3, "string")) {
                if ("fill" == r3 && "none" == this.attrs.fill && this.attrs.gradient)
                  return this.attrs.gradient;
                if ("transform" == r3)
                  return this._.transform;
                for (var s2 = r3.split(h), o2 = {}, l2 = 0, c2 = s2.length; l2 < c2; l2++)
                  (r3 = s2[l2]) in this.attrs ? o2[r3] = this.attrs[r3] : t2.is(this.paper.customAttributes[r3], "function") ? o2[r3] = this.paper.customAttributes[r3].def : o2[r3] = t2._availableAttrs[r3];
                return c2 - 1 ? o2 : o2[s2[0]];
              }
              if (null == i3 && t2.is(r3, "array")) {
                for (o2 = {}, l2 = 0, c2 = r3.length; l2 < c2; l2++)
                  o2[r3[l2]] = this.attr(r3[l2]);
                return o2;
              }
              if (null != i3) {
                var f2 = {};
                f2[r3] = i3;
              } else
                null != r3 && t2.is(r3, "object") && (f2 = r3);
              for (var p2 in f2)
                u("raphael.attr." + p2 + "." + this.id, this, f2[p2]);
              for (p2 in this.paper.customAttributes)
                if (this.paper.customAttributes[e2](p2) && f2[e2](p2) && t2.is(this.paper.customAttributes[p2], "function")) {
                  var d2 = this.paper.customAttributes[p2].apply(this, [].concat(f2[p2]));
                  for (var g2 in this.attrs[p2] = f2[p2], d2)
                    d2[e2](g2) && (f2[g2] = d2[g2]);
                }
              return k(this, f2), this;
            }, T.toFront = function() {
              if (this.removed)
                return this;
              var e3 = C(this.node);
              e3.parentNode.appendChild(e3);
              var r3 = this.paper;
              return r3.top != this && t2._tofront(this, r3), this;
            }, T.toBack = function() {
              if (this.removed)
                return this;
              var e3 = C(this.node), r3 = e3.parentNode;
              r3.insertBefore(e3, r3.firstChild), t2._toback(this, this.paper);
              this.paper;
              return this;
            }, T.insertAfter = function(e3) {
              if (this.removed || !e3)
                return this;
              var r3 = C(this.node), i3 = C(e3.node || e3[e3.length - 1].node);
              return i3.nextSibling ? i3.parentNode.insertBefore(r3, i3.nextSibling) : i3.parentNode.appendChild(r3), t2._insertafter(this, e3, this.paper), this;
            }, T.insertBefore = function(e3) {
              if (this.removed || !e3)
                return this;
              var r3 = C(this.node), i3 = C(e3.node || e3[0].node);
              return i3.parentNode.insertBefore(r3, i3), t2._insertbefore(this, e3, this.paper), this;
            }, T.blur = function(e3) {
              var r3 = this;
              if (0 != +e3) {
                var i3 = x("filter"), n3 = x("feGaussianBlur");
                r3.attrs.blur = e3, i3.id = t2.createUUID(), x(n3, { stdDeviation: +e3 || 1.5 }), i3.appendChild(n3), r3.paper.defs.appendChild(i3), r3._blur = i3, x(r3.node, { filter: "url(#" + i3.id + ")" });
              } else
                r3._blur && (r3._blur.parentNode.removeChild(r3._blur), delete r3._blur, delete r3.attrs.blur), r3.node.removeAttribute("filter");
              return r3;
            }, t2._engine.circle = function(t3, e3, r3, i3) {
              var n3 = x("circle");
              t3.canvas && t3.canvas.appendChild(n3);
              var a2 = new S(n3, t3);
              return a2.attrs = { cx: e3, cy: r3, r: i3, fill: "none", stroke: "#000" }, a2.type = "circle", x(n3, a2.attrs), a2;
            }, t2._engine.rect = function(t3, e3, r3, i3, n3, a2) {
              var s2 = x("rect");
              t3.canvas && t3.canvas.appendChild(s2);
              var o2 = new S(s2, t3);
              return o2.attrs = { x: e3, y: r3, width: i3, height: n3, rx: a2 || 0, ry: a2 || 0, fill: "none", stroke: "#000" }, o2.type = "rect", x(s2, o2.attrs), o2;
            }, t2._engine.ellipse = function(t3, e3, r3, i3, n3) {
              var a2 = x("ellipse");
              t3.canvas && t3.canvas.appendChild(a2);
              var s2 = new S(a2, t3);
              return s2.attrs = { cx: e3, cy: r3, rx: i3, ry: n3, fill: "none", stroke: "#000" }, s2.type = "ellipse", x(a2, s2.attrs), s2;
            }, t2._engine.image = function(t3, e3, r3, i3, n3, a2) {
              var s2 = x("image");
              x(s2, { x: r3, y: i3, width: n3, height: a2, preserveAspectRatio: "none" }), s2.setAttributeNS(p, "href", e3), t3.canvas && t3.canvas.appendChild(s2);
              var o2 = new S(s2, t3);
              return o2.attrs = { x: r3, y: i3, width: n3, height: a2, src: e3 }, o2.type = "image", o2;
            }, t2._engine.text = function(e3, r3, i3, n3) {
              var a2 = x("text");
              e3.canvas && e3.canvas.appendChild(a2);
              var s2 = new S(a2, e3);
              return s2.attrs = { x: r3, y: i3, "text-anchor": "middle", text: n3, "font-family": t2._availableAttrs["font-family"], "font-size": t2._availableAttrs["font-size"], stroke: "none", fill: "#000" }, s2.type = "text", k(s2, s2.attrs), s2;
            }, t2._engine.setSize = function(t3, e3) {
              return this.width = t3 || this.width, this.height = e3 || this.height, this.canvas.setAttribute("width", this.width), this.canvas.setAttribute("height", this.height), this._viewBox && this.setViewBox.apply(this, this._viewBox), this;
            }, t2._engine.create = function() {
              var e3 = t2._getContainer.apply(0, arguments), r3 = e3 && e3.container;
              if (!r3)
                throw new Error("SVG container not found.");
              var i3, n3 = e3.x, a2 = e3.y, s2 = e3.width, o2 = e3.height, l2 = x("svg"), h2 = "overflow:hidden;";
              return n3 = n3 || 0, a2 = a2 || 0, x(l2, { height: o2 = o2 || 342, version: 1.1, width: s2 = s2 || 512, xmlns: "http://www.w3.org/2000/svg", "xmlns:xlink": "http://www.w3.org/1999/xlink" }), 1 == r3 ? (l2.style.cssText = h2 + "position:absolute;left:" + n3 + "px;top:" + a2 + "px", t2._g.doc.body.appendChild(l2), i3 = 1) : (l2.style.cssText = h2 + "position:relative", r3.firstChild ? r3.insertBefore(l2, r3.firstChild) : r3.appendChild(l2)), (r3 = new t2._Paper()).width = s2, r3.height = o2, r3.canvas = l2, r3.clear(), r3._left = r3._top = 0, i3 && (r3.renderfix = function() {
              }), r3.renderfix(), r3;
            }, t2._engine.setViewBox = function(t3, e3, r3, i3, n3) {
              u("raphael.setViewBox", this, this._viewBox, [t3, e3, r3, i3, n3]);
              var a2, o2, l2 = this.getSize(), h2 = s(r3 / l2.width, i3 / l2.height), c2 = this.top, p2 = n3 ? "xMidYMid meet" : "xMinYMin";
              for (null == t3 ? (this._vbSize && (h2 = 1), delete this._vbSize, a2 = "0 0 " + this.width + f + this.height) : (this._vbSize = h2, a2 = t3 + f + e3 + f + r3 + f + i3), x(this.canvas, { viewBox: a2, preserveAspectRatio: p2 }); h2 && c2; )
                o2 = "stroke-width" in c2.attrs ? c2.attrs["stroke-width"] : 1, c2.attr({ "stroke-width": o2 }), c2._.dirty = 1, c2._.dirtyT = 1, c2 = c2.prev;
              return this._viewBox = [t3, e3, r3, i3, !!n3], this;
            }, t2.prototype.renderfix = function() {
              var t3, e3 = this.canvas, r3 = e3.style;
              try {
                t3 = e3.getScreenCTM() || e3.createSVGMatrix();
              } catch (r4) {
                t3 = e3.createSVGMatrix();
              }
              var i3 = -t3.e % 1, n3 = -t3.f % 1;
              (i3 || n3) && (i3 && (this._left = (this._left + i3) % 1, r3.left = this._left + "px"), n3 && (this._top = (this._top + n3) % 1, r3.top = this._top + "px"));
            }, t2.prototype.clear = function() {
              t2.eve("raphael.clear", this);
              for (var e3 = this.canvas; e3.firstChild; )
                e3.removeChild(e3.firstChild);
              this.bottom = this.top = null, (this.desc = x("desc")).appendChild(t2._g.doc.createTextNode("Created with Raphaël " + t2.version)), e3.appendChild(this.desc), e3.appendChild(this.defs = x("defs"));
            }, t2.prototype.remove = function() {
              for (var e3 in u("raphael.remove", this), this.canvas.parentNode && this.canvas.parentNode.removeChild(this.canvas), this)
                this[e3] = "function" == typeof this[e3] ? t2._removedFactory(e3) : null;
            };
            var A = t2.st;
            for (var M in T)
              T[e2](M) && !A[e2](M) && (A[M] = function(t3) {
                return function() {
                  var e3 = arguments;
                  return this.forEach(function(r3) {
                    r3[t3].apply(r3, e3);
                  });
                };
              }(M));
          }
        }.apply(e, i)) || (t.exports = n);
      }, function(t, e, r) {
        var i, n;
        i = [r(0)], void 0 === (n = function(t2) {
          if (!t2 || t2.vml) {
            var e2 = "hasOwnProperty", r2 = String, i2 = parseFloat, n2 = Math, a = n2.round, s = n2.max, o = n2.min, l = n2.abs, h = /[, ]+/, u = t2.eve, c = " ", f = "", p = { M: "m", L: "l", C: "c", Z: "x", m: "t", l: "r", c: "v", z: "x" }, d = /([clmz]),?([^clmz]*)/gi, g = / progid:\S+Blur\([^\)]+\)/g, x = /-?[^,\s-]+/g, v = "position:absolute;left:0;top:0;width:1px;height:1px;behavior:url(#default#VML)", y = 21600, m = { path: 1, rect: 1, image: 1 }, b = { circle: 1, ellipse: 1 }, _ = function(e3, r3, i3) {
              var n3 = t2.matrix();
              return n3.rotate(-e3, 0.5, 0.5), { dx: n3.x(r3, i3), dy: n3.y(r3, i3) };
            }, w = function(t3, e3, r3, i3, n3, a2) {
              var s2 = t3._, o2 = t3.matrix, h2 = s2.fillpos, u2 = t3.node, f2 = u2.style, p2 = 1, d2 = "", g2 = y / e3, x2 = y / r3;
              if (f2.visibility = "hidden", e3 && r3) {
                if (u2.coordsize = l(g2) + c + l(x2), f2.rotation = a2 * (e3 * r3 < 0 ? -1 : 1), a2) {
                  var v2 = _(a2, i3, n3);
                  i3 = v2.dx, n3 = v2.dy;
                }
                if (e3 < 0 && (d2 += "x"), r3 < 0 && (d2 += " y") && (p2 = -1), f2.flip = d2, u2.coordorigin = i3 * -g2 + c + n3 * -x2, h2 || s2.fillsize) {
                  var m2 = u2.getElementsByTagName("fill");
                  m2 = m2 && m2[0], u2.removeChild(m2), h2 && (v2 = _(a2, o2.x(h2[0], h2[1]), o2.y(h2[0], h2[1])), m2.position = v2.dx * p2 + c + v2.dy * p2), s2.fillsize && (m2.size = s2.fillsize[0] * l(e3) + c + s2.fillsize[1] * l(r3)), u2.appendChild(m2);
                }
                f2.visibility = "visible";
              }
            };
            t2.toString = function() {
              return "Your browser doesn’t support SVG. Falling down to VML.\nYou are running Raphaël " + this.version;
            };
            var k, B = function(t3, e3, i3) {
              for (var n3 = r2(e3).toLowerCase().split("-"), a2 = i3 ? "end" : "start", s2 = n3.length, o2 = "classic", l2 = "medium", h2 = "medium"; s2--; )
                switch (n3[s2]) {
                  case "block":
                  case "classic":
                  case "oval":
                  case "diamond":
                  case "open":
                  case "none":
                    o2 = n3[s2];
                    break;
                  case "wide":
                  case "narrow":
                    h2 = n3[s2];
                    break;
                  case "long":
                  case "short":
                    l2 = n3[s2];
                }
              var u2 = t3.node.getElementsByTagName("stroke")[0];
              u2[a2 + "arrow"] = o2, u2[a2 + "arrowlength"] = l2, u2[a2 + "arrowwidth"] = h2;
            }, C = function(n3, l2) {
              n3.attrs = n3.attrs || {};
              var u2 = n3.node, g2 = n3.attrs, v2 = u2.style, _2 = m[n3.type] && (l2.x != g2.x || l2.y != g2.y || l2.width != g2.width || l2.height != g2.height || l2.cx != g2.cx || l2.cy != g2.cy || l2.rx != g2.rx || l2.ry != g2.ry || l2.r != g2.r), C2 = b[n3.type] && (g2.cx != l2.cx || g2.cy != l2.cy || g2.r != l2.r || g2.rx != l2.rx || g2.ry != l2.ry), T2 = n3;
              for (var A2 in l2)
                l2[e2](A2) && (g2[A2] = l2[A2]);
              if (_2 && (g2.path = t2._getPath[n3.type](n3), n3._.dirty = 1), l2.href && (u2.href = l2.href), l2.title && (u2.title = l2.title), l2.target && (u2.target = l2.target), l2.cursor && (v2.cursor = l2.cursor), "blur" in l2 && n3.blur(l2.blur), (l2.path && "path" == n3.type || _2) && (u2.path = function(e3) {
                var i3 = /[ahqstv]/gi, n4 = t2._pathToAbsolute;
                if (r2(e3).match(i3) && (n4 = t2._path2curve), i3 = /[clmz]/g, n4 == t2._pathToAbsolute && !r2(e3).match(i3)) {
                  var s2 = r2(e3).replace(d, function(t3, e4, r3) {
                    var i4 = [], n5 = "m" == e4.toLowerCase(), s3 = p[e4];
                    return r3.replace(x, function(t4) {
                      n5 && 2 == i4.length && (s3 += i4 + p["m" == e4 ? "l" : "L"], i4 = []), i4.push(a(t4 * y));
                    }), s3 + i4;
                  });
                  return s2;
                }
                var o2, l3, h2 = n4(e3);
                s2 = [];
                for (var u3 = 0, g3 = h2.length; u3 < g3; u3++) {
                  o2 = h2[u3], "z" == (l3 = h2[u3][0].toLowerCase()) && (l3 = "x");
                  for (var v3 = 1, m2 = o2.length; v3 < m2; v3++)
                    l3 += a(o2[v3] * y) + (v3 != m2 - 1 ? "," : f);
                  s2.push(l3);
                }
                return s2.join(c);
              }(~r2(g2.path).toLowerCase().indexOf("r") ? t2._pathToAbsolute(g2.path) : g2.path), n3._.dirty = 1, "image" == n3.type && (n3._.fillpos = [g2.x, g2.y], n3._.fillsize = [g2.width, g2.height], w(n3, 1, 1, 0, 0, 0))), "transform" in l2 && n3.transform(l2.transform), C2) {
                var M2 = +g2.cx, E2 = +g2.cy, N = +g2.rx || +g2.r || 0, L = +g2.ry || +g2.r || 0;
                u2.path = t2.format("ar{0},{1},{2},{3},{4},{1},{4},{1}x", a((M2 - N) * y), a((E2 - L) * y), a((M2 + N) * y), a((E2 + L) * y), a(M2 * y)), n3._.dirty = 1;
              }
              if ("clip-rect" in l2) {
                var P = r2(l2["clip-rect"]).split(h);
                if (4 == P.length) {
                  P[2] = +P[2] + +P[0], P[3] = +P[3] + +P[1];
                  var z = u2.clipRect || t2._g.doc.createElement("div"), F = z.style;
                  F.clip = t2.format("rect({1}px {2}px {3}px {0}px)", P), u2.clipRect || (F.position = "absolute", F.top = 0, F.left = 0, F.width = n3.paper.width + "px", F.height = n3.paper.height + "px", u2.parentNode.insertBefore(z, u2), z.appendChild(u2), u2.clipRect = z);
                }
                l2["clip-rect"] || u2.clipRect && (u2.clipRect.style.clip = "auto");
              }
              if (n3.textpath) {
                var R = n3.textpath.style;
                l2.font && (R.font = l2.font), l2["font-family"] && (R.fontFamily = '"' + l2["font-family"].split(",")[0].replace(/^['"]+|['"]+$/g, f) + '"'), l2["font-size"] && (R.fontSize = l2["font-size"]), l2["font-weight"] && (R.fontWeight = l2["font-weight"]), l2["font-style"] && (R.fontStyle = l2["font-style"]);
              }
              if ("arrow-start" in l2 && B(T2, l2["arrow-start"]), "arrow-end" in l2 && B(T2, l2["arrow-end"], 1), null != l2.opacity || null != l2.fill || null != l2.src || null != l2.stroke || null != l2["stroke-width"] || null != l2["stroke-opacity"] || null != l2["fill-opacity"] || null != l2["stroke-dasharray"] || null != l2["stroke-miterlimit"] || null != l2["stroke-linejoin"] || null != l2["stroke-linecap"]) {
                var j = u2.getElementsByTagName("fill");
                if (!(j = j && j[0]) && (j = k("fill")), "image" == n3.type && l2.src && (j.src = l2.src), l2.fill && (j.on = true), null != j.on && "none" != l2.fill && null !== l2.fill || (j.on = false), j.on && l2.fill) {
                  var I = r2(l2.fill).match(t2._ISURL);
                  if (I) {
                    j.parentNode == u2 && u2.removeChild(j), j.rotate = true, j.src = I[1], j.type = "tile";
                    var D = n3.getBBox(1);
                    j.position = D.x + c + D.y, n3._.fillpos = [D.x, D.y], t2._preload(I[1], function() {
                      n3._.fillsize = [this.offsetWidth, this.offsetHeight];
                    });
                  } else
                    j.color = t2.getRGB(l2.fill).hex, j.src = f, j.type = "solid", t2.getRGB(l2.fill).error && (T2.type in { circle: 1, ellipse: 1 } || "r" != r2(l2.fill).charAt()) && S(T2, l2.fill, j) && (g2.fill = "none", g2.gradient = l2.fill, j.rotate = false);
                }
                if ("fill-opacity" in l2 || "opacity" in l2) {
                  var q = ((+g2["fill-opacity"] + 1 || 2) - 1) * ((+g2.opacity + 1 || 2) - 1) * ((+t2.getRGB(l2.fill).o + 1 || 2) - 1);
                  q = o(s(q, 0), 1), j.opacity = q, j.src && (j.color = "none");
                }
                u2.appendChild(j);
                var O = u2.getElementsByTagName("stroke") && u2.getElementsByTagName("stroke")[0], V = false;
                !O && (V = O = k("stroke")), (l2.stroke && "none" != l2.stroke || l2["stroke-width"] || null != l2["stroke-opacity"] || l2["stroke-dasharray"] || l2["stroke-miterlimit"] || l2["stroke-linejoin"] || l2["stroke-linecap"]) && (O.on = true), ("none" == l2.stroke || null === l2.stroke || null == O.on || 0 == l2.stroke || 0 == l2["stroke-width"]) && (O.on = false);
                var W = t2.getRGB(l2.stroke);
                O.on && l2.stroke && (O.color = W.hex), q = ((+g2["stroke-opacity"] + 1 || 2) - 1) * ((+g2.opacity + 1 || 2) - 1) * ((+W.o + 1 || 2) - 1);
                var Y = 0.75 * (i2(l2["stroke-width"]) || 1);
                if (q = o(s(q, 0), 1), null == l2["stroke-width"] && (Y = g2["stroke-width"]), l2["stroke-width"] && (O.weight = Y), Y && Y < 1 && (q *= Y) && (O.weight = 1), O.opacity = q, l2["stroke-linejoin"] && (O.joinstyle = l2["stroke-linejoin"] || "miter"), O.miterlimit = l2["stroke-miterlimit"] || 8, l2["stroke-linecap"] && (O.endcap = "butt" == l2["stroke-linecap"] ? "flat" : "square" == l2["stroke-linecap"] ? "square" : "round"), "stroke-dasharray" in l2) {
                  var G = { "-": "shortdash", ".": "shortdot", "-.": "shortdashdot", "-..": "shortdashdotdot", ". ": "dot", "- ": "dash", "--": "longdash", "- .": "dashdot", "--.": "longdashdot", "--..": "longdashdotdot" };
                  O.dashstyle = G[e2](l2["stroke-dasharray"]) ? G[l2["stroke-dasharray"]] : f;
                }
                V && u2.appendChild(O);
              }
              if ("text" == T2.type) {
                T2.paper.canvas.style.display = f;
                var H = T2.paper.span, X = g2.font && g2.font.match(/\d+(?:\.\d*)?(?=px)/);
                v2 = H.style, g2.font && (v2.font = g2.font), g2["font-family"] && (v2.fontFamily = g2["font-family"]), g2["font-weight"] && (v2.fontWeight = g2["font-weight"]), g2["font-style"] && (v2.fontStyle = g2["font-style"]), X = i2(g2["font-size"] || X && X[0]) || 10, v2.fontSize = 100 * X + "px", T2.textpath.string && (H.innerHTML = r2(T2.textpath.string).replace(/</g, "&#60;").replace(/&/g, "&#38;").replace(/\n/g, "<br>"));
                var U = H.getBoundingClientRect();
                T2.W = g2.w = (U.right - U.left) / 100, T2.H = g2.h = (U.bottom - U.top) / 100, T2.X = g2.x, T2.Y = g2.y + T2.H / 2, ("x" in l2 || "y" in l2) && (T2.path.v = t2.format("m{0},{1}l{2},{1}", a(g2.x * y), a(g2.y * y), a(g2.x * y) + 1));
                for (var $ = ["x", "y", "text", "font", "font-family", "font-weight", "font-style", "font-size"], Z = 0, Q = $.length; Z < Q; Z++)
                  if ($[Z] in l2) {
                    T2._.dirty = 1;
                    break;
                  }
                switch (g2["text-anchor"]) {
                  case "start":
                    T2.textpath.style["v-text-align"] = "left", T2.bbx = T2.W / 2;
                    break;
                  case "end":
                    T2.textpath.style["v-text-align"] = "right", T2.bbx = -T2.W / 2;
                    break;
                  default:
                    T2.textpath.style["v-text-align"] = "center", T2.bbx = 0;
                }
                T2.textpath.style["v-text-kern"] = true;
              }
            }, S = function(e3, a2, s2) {
              e3.attrs = e3.attrs || {};
              e3.attrs;
              var o2 = Math.pow, l2 = "linear", h2 = ".5 .5";
              if (e3.attrs.gradient = a2, a2 = (a2 = r2(a2).replace(t2._radial_gradient, function(t3, e4, r3) {
                return l2 = "radial", e4 && r3 && (e4 = i2(e4), r3 = i2(r3), o2(e4 - 0.5, 2) + o2(r3 - 0.5, 2) > 0.25 && (r3 = n2.sqrt(0.25 - o2(e4 - 0.5, 2)) * (2 * (r3 > 0.5) - 1) + 0.5), h2 = e4 + c + r3), f;
              })).split(/\s*\-\s*/), "linear" == l2) {
                var u2 = a2.shift();
                if (u2 = -i2(u2), isNaN(u2))
                  return null;
              }
              var p2 = t2._parseDots(a2);
              if (!p2)
                return null;
              if (e3 = e3.shape || e3.node, p2.length) {
                e3.removeChild(s2), s2.on = true, s2.method = "none", s2.color = p2[0].color, s2.color2 = p2[p2.length - 1].color;
                for (var d2 = [], g2 = 0, x2 = p2.length; g2 < x2; g2++)
                  p2[g2].offset && d2.push(p2[g2].offset + c + p2[g2].color);
                s2.colors = d2.length ? d2.join() : "0% " + s2.color, "radial" == l2 ? (s2.type = "gradientTitle", s2.focus = "100%", s2.focussize = "0 0", s2.focusposition = h2, s2.angle = 0) : (s2.type = "gradient", s2.angle = (270 - u2) % 360), e3.appendChild(s2);
              }
              return 1;
            }, T = function(e3, r3) {
              this[0] = this.node = e3, e3.raphael = true, this.id = t2._oid++, e3.raphaelid = this.id, this.X = 0, this.Y = 0, this.attrs = {}, this.paper = r3, this.matrix = t2.matrix(), this._ = { transform: [], sx: 1, sy: 1, dx: 0, dy: 0, deg: 0, dirty: 1, dirtyT: 1 }, !r3.bottom && (r3.bottom = this), this.prev = r3.top, r3.top && (r3.top.next = this), r3.top = this, this.next = null;
            }, A = t2.el;
            T.prototype = A, A.constructor = T, A.transform = function(e3) {
              if (null == e3)
                return this._.transform;
              var i3, n3 = this.paper._viewBoxShift, a2 = n3 ? "s" + [n3.scale, n3.scale] + "-1-1t" + [n3.dx, n3.dy] : f;
              n3 && (i3 = e3 = r2(e3).replace(/\.{3}|\u2026/g, this._.transform || f)), t2._extractTransform(this, a2 + e3);
              var s2, o2 = this.matrix.clone(), l2 = this.skew, h2 = this.node, u2 = ~r2(this.attrs.fill).indexOf("-"), p2 = !r2(this.attrs.fill).indexOf("url(");
              if (o2.translate(1, 1), p2 || u2 || "image" == this.type)
                if (l2.matrix = "1 0 0 1", l2.offset = "0 0", s2 = o2.split(), u2 && s2.noRotation || !s2.isSimple) {
                  h2.style.filter = o2.toFilter();
                  var d2 = this.getBBox(), g2 = this.getBBox(1), x2 = d2.x - g2.x, v2 = d2.y - g2.y;
                  h2.coordorigin = x2 * -y + c + v2 * -y, w(this, 1, 1, x2, v2, 0);
                } else
                  h2.style.filter = f, w(this, s2.scalex, s2.scaley, s2.dx, s2.dy, s2.rotate);
              else
                h2.style.filter = f, l2.matrix = r2(o2), l2.offset = o2.offset();
              return null !== i3 && (this._.transform = i3, t2._extractTransform(this, i3)), this;
            }, A.rotate = function(t3, e3, n3) {
              if (this.removed)
                return this;
              if (null != t3) {
                if ((t3 = r2(t3).split(h)).length - 1 && (e3 = i2(t3[1]), n3 = i2(t3[2])), t3 = i2(t3[0]), null == n3 && (e3 = n3), null == e3 || null == n3) {
                  var a2 = this.getBBox(1);
                  e3 = a2.x + a2.width / 2, n3 = a2.y + a2.height / 2;
                }
                return this._.dirtyT = 1, this.transform(this._.transform.concat([["r", t3, e3, n3]])), this;
              }
            }, A.translate = function(t3, e3) {
              return this.removed ? this : ((t3 = r2(t3).split(h)).length - 1 && (e3 = i2(t3[1])), t3 = i2(t3[0]) || 0, e3 = +e3 || 0, this._.bbox && (this._.bbox.x += t3, this._.bbox.y += e3), this.transform(this._.transform.concat([["t", t3, e3]])), this);
            }, A.scale = function(t3, e3, n3, a2) {
              if (this.removed)
                return this;
              if ((t3 = r2(t3).split(h)).length - 1 && (e3 = i2(t3[1]), n3 = i2(t3[2]), a2 = i2(t3[3]), isNaN(n3) && (n3 = null), isNaN(a2) && (a2 = null)), t3 = i2(t3[0]), null == e3 && (e3 = t3), null == a2 && (n3 = a2), null == n3 || null == a2)
                var s2 = this.getBBox(1);
              return n3 = null == n3 ? s2.x + s2.width / 2 : n3, a2 = null == a2 ? s2.y + s2.height / 2 : a2, this.transform(this._.transform.concat([["s", t3, e3, n3, a2]])), this._.dirtyT = 1, this;
            }, A.hide = function() {
              return !this.removed && (this.node.style.display = "none"), this;
            }, A.show = function() {
              return !this.removed && (this.node.style.display = f), this;
            }, A.auxGetBBox = t2.el.getBBox, A.getBBox = function() {
              var t3 = this.auxGetBBox();
              if (this.paper && this.paper._viewBoxShift) {
                var e3 = {}, r3 = 1 / this.paper._viewBoxShift.scale;
                return e3.x = t3.x - this.paper._viewBoxShift.dx, e3.x *= r3, e3.y = t3.y - this.paper._viewBoxShift.dy, e3.y *= r3, e3.width = t3.width * r3, e3.height = t3.height * r3, e3.x2 = e3.x + e3.width, e3.y2 = e3.y + e3.height, e3;
              }
              return t3;
            }, A._getBBox = function() {
              return this.removed ? {} : { x: this.X + (this.bbx || 0) - this.W / 2, y: this.Y - this.H, width: this.W, height: this.H };
            }, A.remove = function() {
              if (!this.removed && this.node.parentNode) {
                for (var e3 in this.paper.__set__ && this.paper.__set__.exclude(this), t2.eve.unbind("raphael.*.*." + this.id), t2._tear(this, this.paper), this.node.parentNode.removeChild(this.node), this.shape && this.shape.parentNode.removeChild(this.shape), this)
                  this[e3] = "function" == typeof this[e3] ? t2._removedFactory(e3) : null;
                this.removed = true;
              }
            }, A.attr = function(r3, i3) {
              if (this.removed)
                return this;
              if (null == r3) {
                var n3 = {};
                for (var a2 in this.attrs)
                  this.attrs[e2](a2) && (n3[a2] = this.attrs[a2]);
                return n3.gradient && "none" == n3.fill && (n3.fill = n3.gradient) && delete n3.gradient, n3.transform = this._.transform, n3;
              }
              if (null == i3 && t2.is(r3, "string")) {
                if ("fill" == r3 && "none" == this.attrs.fill && this.attrs.gradient)
                  return this.attrs.gradient;
                for (var s2 = r3.split(h), o2 = {}, l2 = 0, c2 = s2.length; l2 < c2; l2++)
                  (r3 = s2[l2]) in this.attrs ? o2[r3] = this.attrs[r3] : t2.is(this.paper.customAttributes[r3], "function") ? o2[r3] = this.paper.customAttributes[r3].def : o2[r3] = t2._availableAttrs[r3];
                return c2 - 1 ? o2 : o2[s2[0]];
              }
              if (this.attrs && null == i3 && t2.is(r3, "array")) {
                for (o2 = {}, l2 = 0, c2 = r3.length; l2 < c2; l2++)
                  o2[r3[l2]] = this.attr(r3[l2]);
                return o2;
              }
              var f2;
              for (var p2 in null != i3 && ((f2 = {})[r3] = i3), null == i3 && t2.is(r3, "object") && (f2 = r3), f2)
                u("raphael.attr." + p2 + "." + this.id, this, f2[p2]);
              if (f2) {
                for (p2 in this.paper.customAttributes)
                  if (this.paper.customAttributes[e2](p2) && f2[e2](p2) && t2.is(this.paper.customAttributes[p2], "function")) {
                    var d2 = this.paper.customAttributes[p2].apply(this, [].concat(f2[p2]));
                    for (var g2 in this.attrs[p2] = f2[p2], d2)
                      d2[e2](g2) && (f2[g2] = d2[g2]);
                  }
                f2.text && "text" == this.type && (this.textpath.string = f2.text), C(this, f2);
              }
              return this;
            }, A.toFront = function() {
              return !this.removed && this.node.parentNode.appendChild(this.node), this.paper && this.paper.top != this && t2._tofront(this, this.paper), this;
            }, A.toBack = function() {
              return this.removed ? this : (this.node.parentNode.firstChild != this.node && (this.node.parentNode.insertBefore(this.node, this.node.parentNode.firstChild), t2._toback(this, this.paper)), this);
            }, A.insertAfter = function(e3) {
              return this.removed ? this : (e3.constructor == t2.st.constructor && (e3 = e3[e3.length - 1]), e3.node.nextSibling ? e3.node.parentNode.insertBefore(this.node, e3.node.nextSibling) : e3.node.parentNode.appendChild(this.node), t2._insertafter(this, e3, this.paper), this);
            }, A.insertBefore = function(e3) {
              return this.removed ? this : (e3.constructor == t2.st.constructor && (e3 = e3[0]), e3.node.parentNode.insertBefore(this.node, e3.node), t2._insertbefore(this, e3, this.paper), this);
            }, A.blur = function(e3) {
              var r3 = this.node.runtimeStyle, i3 = r3.filter;
              return i3 = i3.replace(g, f), 0 != +e3 ? (this.attrs.blur = e3, r3.filter = i3 + c + " progid:DXImageTransform.Microsoft.Blur(pixelradius=" + (+e3 || 1.5) + ")", r3.margin = t2.format("-{0}px 0 0 -{0}px", a(+e3 || 1.5))) : (r3.filter = i3, r3.margin = 0, delete this.attrs.blur), this;
            }, t2._engine.path = function(t3, e3) {
              var r3 = k("shape");
              r3.style.cssText = v, r3.coordsize = y + c + y, r3.coordorigin = e3.coordorigin;
              var i3 = new T(r3, e3), n3 = { fill: "none", stroke: "#000" };
              t3 && (n3.path = t3), i3.type = "path", i3.path = [], i3.Path = f, C(i3, n3), e3.canvas && e3.canvas.appendChild(r3);
              var a2 = k("skew");
              return a2.on = true, r3.appendChild(a2), i3.skew = a2, i3.transform(f), i3;
            }, t2._engine.rect = function(e3, r3, i3, n3, a2, s2) {
              var o2 = t2._rectPath(r3, i3, n3, a2, s2), l2 = e3.path(o2), h2 = l2.attrs;
              return l2.X = h2.x = r3, l2.Y = h2.y = i3, l2.W = h2.width = n3, l2.H = h2.height = a2, h2.r = s2, h2.path = o2, l2.type = "rect", l2;
            }, t2._engine.ellipse = function(t3, e3, r3, i3, n3) {
              var a2 = t3.path();
              a2.attrs;
              return a2.X = e3 - i3, a2.Y = r3 - n3, a2.W = 2 * i3, a2.H = 2 * n3, a2.type = "ellipse", C(a2, { cx: e3, cy: r3, rx: i3, ry: n3 }), a2;
            }, t2._engine.circle = function(t3, e3, r3, i3) {
              var n3 = t3.path();
              n3.attrs;
              return n3.X = e3 - i3, n3.Y = r3 - i3, n3.W = n3.H = 2 * i3, n3.type = "circle", C(n3, { cx: e3, cy: r3, r: i3 }), n3;
            }, t2._engine.image = function(e3, r3, i3, n3, a2, s2) {
              var o2 = t2._rectPath(i3, n3, a2, s2), l2 = e3.path(o2).attr({ stroke: "none" }), h2 = l2.attrs, u2 = l2.node, c2 = u2.getElementsByTagName("fill")[0];
              return h2.src = r3, l2.X = h2.x = i3, l2.Y = h2.y = n3, l2.W = h2.width = a2, l2.H = h2.height = s2, h2.path = o2, l2.type = "image", c2.parentNode == u2 && u2.removeChild(c2), c2.rotate = true, c2.src = r3, c2.type = "tile", l2._.fillpos = [i3, n3], l2._.fillsize = [a2, s2], u2.appendChild(c2), w(l2, 1, 1, 0, 0, 0), l2;
            }, t2._engine.text = function(e3, i3, n3, s2) {
              var o2 = k("shape"), l2 = k("path"), h2 = k("textpath");
              i3 = i3 || 0, n3 = n3 || 0, s2 = s2 || "", l2.v = t2.format("m{0},{1}l{2},{1}", a(i3 * y), a(n3 * y), a(i3 * y) + 1), l2.textpathok = true, h2.string = r2(s2), h2.on = true, o2.style.cssText = v, o2.coordsize = y + c + y, o2.coordorigin = "0 0";
              var u2 = new T(o2, e3), p2 = { fill: "#000", stroke: "none", font: t2._availableAttrs.font, text: s2 };
              u2.shape = o2, u2.path = l2, u2.textpath = h2, u2.type = "text", u2.attrs.text = r2(s2), u2.attrs.x = i3, u2.attrs.y = n3, u2.attrs.w = 1, u2.attrs.h = 1, C(u2, p2), o2.appendChild(h2), o2.appendChild(l2), e3.canvas.appendChild(o2);
              var d2 = k("skew");
              return d2.on = true, o2.appendChild(d2), u2.skew = d2, u2.transform(f), u2;
            }, t2._engine.setSize = function(e3, r3) {
              var i3 = this.canvas.style;
              return this.width = e3, this.height = r3, e3 == +e3 && (e3 += "px"), r3 == +r3 && (r3 += "px"), i3.width = e3, i3.height = r3, i3.clip = "rect(0 " + e3 + " " + r3 + " 0)", this._viewBox && t2._engine.setViewBox.apply(this, this._viewBox), this;
            }, t2._engine.setViewBox = function(e3, r3, i3, n3, a2) {
              t2.eve("raphael.setViewBox", this, this._viewBox, [e3, r3, i3, n3, a2]);
              var s2, o2, l2 = this.getSize(), h2 = l2.width, u2 = l2.height;
              return a2 && (i3 * (s2 = u2 / n3) < h2 && (e3 -= (h2 - i3 * s2) / 2 / s2), n3 * (o2 = h2 / i3) < u2 && (r3 -= (u2 - n3 * o2) / 2 / o2)), this._viewBox = [e3, r3, i3, n3, !!a2], this._viewBoxShift = { dx: -e3, dy: -r3, scale: l2 }, this.forEach(function(t3) {
                t3.transform("...");
              }), this;
            }, t2._engine.initWin = function(t3) {
              var e3 = t3.document;
              e3.styleSheets.length < 31 ? e3.createStyleSheet().addRule(".rvml", "behavior:url(#default#VML)") : e3.styleSheets[0].addRule(".rvml", "behavior:url(#default#VML)");
              try {
                !e3.namespaces.rvml && e3.namespaces.add("rvml", "urn:schemas-microsoft-com:vml"), k = function(t4) {
                  return e3.createElement("<rvml:" + t4 + ' class="rvml">');
                };
              } catch (t4) {
                k = function(t5) {
                  return e3.createElement("<" + t5 + ' xmlns="urn:schemas-microsoft.com:vml" class="rvml">');
                };
              }
            }, t2._engine.initWin(t2._g.win), t2._engine.create = function() {
              var e3 = t2._getContainer.apply(0, arguments), r3 = e3.container, i3 = e3.height, n3 = e3.width, a2 = e3.x, s2 = e3.y;
              if (!r3)
                throw new Error("VML container not found.");
              var o2 = new t2._Paper(), l2 = o2.canvas = t2._g.doc.createElement("div"), h2 = l2.style;
              return a2 = a2 || 0, s2 = s2 || 0, n3 = n3 || 512, i3 = i3 || 342, o2.width = n3, o2.height = i3, n3 == +n3 && (n3 += "px"), i3 == +i3 && (i3 += "px"), o2.coordsize = 216e5 + c + 216e5, o2.coordorigin = "0 0", o2.span = t2._g.doc.createElement("span"), o2.span.style.cssText = "position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;", l2.appendChild(o2.span), h2.cssText = t2.format("top:0;left:0;width:{0};height:{1};display:inline-block;position:relative;clip:rect(0 {0} {1} 0);overflow:hidden", n3, i3), 1 == r3 ? (t2._g.doc.body.appendChild(l2), h2.left = a2 + "px", h2.top = s2 + "px", h2.position = "absolute") : r3.firstChild ? r3.insertBefore(l2, r3.firstChild) : r3.appendChild(l2), o2.renderfix = function() {
              }, o2;
            }, t2.prototype.clear = function() {
              t2.eve("raphael.clear", this), this.canvas.innerHTML = f, this.span = t2._g.doc.createElement("span"), this.span.style.cssText = "position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;display:inline;", this.canvas.appendChild(this.span), this.bottom = this.top = null;
            }, t2.prototype.remove = function() {
              for (var e3 in t2.eve("raphael.remove", this), this.canvas.parentNode.removeChild(this.canvas), this)
                this[e3] = "function" == typeof this[e3] ? t2._removedFactory(e3) : null;
              return true;
            };
            var M = t2.st;
            for (var E in A)
              A[e2](E) && !M[e2](E) && (M[E] = function(t3) {
                return function() {
                  var e3 = arguments;
                  return this.forEach(function(r3) {
                    r3[t3].apply(r3, e3);
                  });
                };
              }(E));
          }
        }.apply(e, i)) || (t.exports = n);
      }]);
    });
  }
});

// node_modules/flowchart.js/src/flowchart.helpers.js
var require_flowchart_helpers = __commonJS({
  "node_modules/flowchart.js/src/flowchart.helpers.js"(exports, module) {
    function _defaults(options, defaultOptions) {
      if (!options || typeof options === "function") {
        return defaultOptions;
      }
      var merged = {};
      for (var attrname in defaultOptions) {
        merged[attrname] = defaultOptions[attrname];
      }
      for (attrname in options) {
        if (options[attrname]) {
          if (typeof merged[attrname] === "object") {
            merged[attrname] = _defaults(merged[attrname], options[attrname]);
          } else {
            merged[attrname] = options[attrname];
          }
        }
      }
      return merged;
    }
    function _inherits(ctor, superCtor) {
      if (typeof Object.create === "function") {
        ctor.super_ = superCtor;
        ctor.prototype = Object.create(superCtor.prototype, {
          constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
          }
        });
      } else {
        ctor.super_ = superCtor;
        var TempCtor = function() {
        };
        TempCtor.prototype = superCtor.prototype;
        ctor.prototype = new TempCtor();
        ctor.prototype.constructor = ctor;
      }
    }
    module.exports = {
      defaults: _defaults,
      inherits: _inherits
    };
  }
});

// node_modules/flowchart.js/src/flowchart.defaults.js
var require_flowchart_defaults = __commonJS({
  "node_modules/flowchart.js/src/flowchart.defaults.js"(exports, module) {
    module.exports = {
      "x": 0,
      "y": 0,
      "line-width": 3,
      "line-length": 50,
      "text-margin": 10,
      "font-size": 14,
      "font-color": "black",
      "line-color": "black",
      "element-color": "black",
      "fill": "white",
      "yes-text": "yes",
      "no-text": "no",
      "arrow-end": "block",
      "class": "flowchart",
      "scale": 1,
      "symbols": {
        "start": {},
        "end": {},
        "condition": {},
        "inputoutput": {},
        "operation": {},
        "subroutine": {},
        "parallel": {}
      }
    };
  }
});

// node_modules/flowchart.js/src/flowchart.functions.js
var require_flowchart_functions = __commonJS({
  "node_modules/flowchart.js/src/flowchart.functions.js"(exports, module) {
    function drawPath(chart, location, points) {
      var i, len;
      var path = "M{0},{1}";
      for (i = 2, len = 2 * points.length + 2; i < len; i += 2) {
        path += " L{" + i + "},{" + (i + 1) + "}";
      }
      var pathValues = [location.x, location.y];
      for (i = 0, len = points.length; i < len; i++) {
        pathValues.push(points[i].x);
        pathValues.push(points[i].y);
      }
      var symbol = chart.paper.path(path, pathValues);
      symbol.attr("stroke", chart.options["element-color"]);
      symbol.attr("stroke-width", chart.options["line-width"]);
      var font = chart.options.font;
      var fontF = chart.options["font-family"];
      var fontW = chart.options["font-weight"];
      if (font)
        symbol.attr({ "font": font });
      if (fontF)
        symbol.attr({ "font-family": fontF });
      if (fontW)
        symbol.attr({ "font-weight": fontW });
      return symbol;
    }
    function drawLine(chart, from, to, text) {
      var i, len;
      if (Object.prototype.toString.call(to) !== "[object Array]") {
        to = [to];
      }
      var path = "M{0},{1}";
      for (i = 2, len = 2 * to.length + 2; i < len; i += 2) {
        path += " L{" + i + "},{" + (i + 1) + "}";
      }
      var pathValues = [from.x, from.y];
      for (i = 0, len = to.length; i < len; i++) {
        pathValues.push(to[i].x);
        pathValues.push(to[i].y);
      }
      var line = chart.paper.path(path, pathValues);
      line.attr({
        stroke: chart.options["line-color"],
        "stroke-width": chart.options["line-width"],
        "arrow-end": chart.options["arrow-end"]
      });
      var font = chart.options.font;
      var fontF = chart.options["font-family"];
      var fontW = chart.options["font-weight"];
      if (font)
        line.attr({ "font": font });
      if (fontF)
        line.attr({ "font-family": fontF });
      if (fontW)
        line.attr({ "font-weight": fontW });
      if (text) {
        var centerText = false;
        var textPath = chart.paper.text(0, 0, text);
        var textAnchor = "start";
        var isHorizontal = false;
        var firstTo = to[0];
        if (from.y === firstTo.y) {
          isHorizontal = true;
        }
        var x = 0, y = 0;
        if (centerText) {
          if (from.x > firstTo.x) {
            x = from.x - (from.x - firstTo.x) / 2;
          } else {
            x = firstTo.x - (firstTo.x - from.x) / 2;
          }
          if (from.y > firstTo.y) {
            y = from.y - (from.y - firstTo.y) / 2;
          } else {
            y = firstTo.y - (firstTo.y - from.y) / 2;
          }
          if (isHorizontal) {
            x -= textPath.getBBox().width / 2;
            y -= chart.options["text-margin"];
          } else {
            x += chart.options["text-margin"];
            y -= textPath.getBBox().height / 2;
          }
        } else {
          x = from.x;
          y = from.y;
          if (isHorizontal) {
            if (from.x > firstTo.x) {
              x -= chart.options["text-margin"] / 2;
              textAnchor = "end";
            } else {
              x += chart.options["text-margin"] / 2;
            }
            y -= chart.options["text-margin"];
          } else {
            x += chart.options["text-margin"] / 2;
            y += chart.options["text-margin"];
            if (from.y > firstTo.y) {
              y -= chart.options["text-margin"] * 2;
            }
          }
        }
        textPath.attr({
          "text-anchor": textAnchor,
          "font-size": chart.options["font-size"],
          "fill": chart.options["font-color"],
          x,
          y
        });
        if (font)
          textPath.attr({ "font": font });
        if (fontF)
          textPath.attr({ "font-family": fontF });
        if (fontW)
          textPath.attr({ "font-weight": fontW });
      }
      return line;
    }
    function checkLineIntersection(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
      var denominator, a, b, numerator1, numerator2, result = {
        x: null,
        y: null,
        onLine1: false,
        onLine2: false
      };
      denominator = (line2EndY - line2StartY) * (line1EndX - line1StartX) - (line2EndX - line2StartX) * (line1EndY - line1StartY);
      if (denominator === 0) {
        return result;
      }
      a = line1StartY - line2StartY;
      b = line1StartX - line2StartX;
      numerator1 = (line2EndX - line2StartX) * a - (line2EndY - line2StartY) * b;
      numerator2 = (line1EndX - line1StartX) * a - (line1EndY - line1StartY) * b;
      a = numerator1 / denominator;
      b = numerator2 / denominator;
      result.x = line1StartX + a * (line1EndX - line1StartX);
      result.y = line1StartY + a * (line1EndY - line1StartY);
      if (a > 0 && a < 1) {
        result.onLine1 = true;
      }
      if (b > 0 && b < 1) {
        result.onLine2 = true;
      }
      return result;
    }
    module.exports = {
      drawPath,
      drawLine,
      checkLineIntersection
    };
  }
});

// node_modules/flowchart.js/src/flowchart.symbol.js
var require_flowchart_symbol = __commonJS({
  "node_modules/flowchart.js/src/flowchart.symbol.js"(exports, module) {
    var drawAPI = require_flowchart_functions();
    var drawLine = drawAPI.drawLine;
    var checkLineIntersection = drawAPI.checkLineIntersection;
    function Symbol2(chart, options, symbol) {
      this.chart = chart;
      this.group = this.chart.paper.set();
      this.symbol = symbol;
      this.connectedTo = [];
      this.symbolType = options.symbolType;
      this.flowstate = options.flowstate || "future";
      this.lineStyle = options.lineStyle || {};
      this.key = options.key || "";
      this.leftLines = [];
      this.rightLines = [];
      this.topLines = [];
      this.bottomLines = [];
      this.params = options.params;
      this.next_direction = options.next && options["direction_next"] ? options["direction_next"] : void 0;
      this.text = this.chart.paper.text(0, 0, options.text);
      if (options.key) {
        this.text.node.id = options.key + "t";
      }
      this.text.node.setAttribute("class", this.getAttr("class") + "t");
      this.text.attr({
        "text-anchor": "start",
        "x": this.getAttr("text-margin"),
        "fill": this.getAttr("font-color"),
        "font-size": this.getAttr("font-size")
      });
      var font = this.getAttr("font");
      var fontF = this.getAttr("font-family");
      var fontW = this.getAttr("font-weight");
      if (font)
        this.text.attr({ "font": font });
      if (fontF)
        this.text.attr({ "font-family": fontF });
      if (fontW)
        this.text.attr({ "font-weight": fontW });
      if (options.link) {
        this.text.attr("href", options.link);
      }
      if (options.function) {
        this.text.attr({ "cursor": "pointer" });
        this.text.node.addEventListener("click", function(evt) {
          window[options.function](evt, options);
        }, false);
      }
      if (options.target) {
        this.text.attr("target", options.target);
      }
      var maxWidth = this.getAttr("maxWidth");
      if (maxWidth) {
        var words = options.text.split(" ");
        var tempText = "";
        for (var i = 0, ii = words.length; i < ii; i++) {
          var word = words[i];
          this.text.attr("text", tempText + " " + word);
          if (this.text.getBBox().width > maxWidth) {
            tempText += "\n" + word;
          } else {
            tempText += " " + word;
          }
        }
        this.text.attr("text", tempText.substring(1));
      }
      this.group.push(this.text);
      if (symbol) {
        var tmpMargin = this.getAttr("text-margin");
        symbol.attr({
          "fill": this.getAttr("fill"),
          "stroke": this.getAttr("element-color"),
          "stroke-width": this.getAttr("line-width"),
          "width": this.text.getBBox().width + 2 * tmpMargin,
          "height": this.text.getBBox().height + 2 * tmpMargin
        });
        symbol.node.setAttribute("class", this.getAttr("class"));
        var roundness = this.getAttr("roundness");
        if (!isNaN(roundness)) {
          symbol.node.setAttribute("ry", roundness);
          symbol.node.setAttribute("rx", roundness);
        }
        if (options.link) {
          symbol.attr("href", options.link);
        }
        if (options.target) {
          symbol.attr("target", options.target);
        }
        if (options.function) {
          symbol.node.addEventListener("click", function(evt) {
            window[options.function](evt, options);
          }, false);
          symbol.attr({ "cursor": "pointer" });
        }
        if (options.key) {
          symbol.node.id = options.key;
        }
        this.group.push(symbol);
        symbol.insertBefore(this.text);
        this.text.attr({
          "y": symbol.getBBox().height / 2
        });
        this.initialize();
      }
    }
    Symbol2.prototype.getAttr = function(attName) {
      if (!this.chart) {
        return void 0;
      }
      var opt3 = this.chart.options ? this.chart.options[attName] : void 0;
      var opt2 = this.chart.options.symbols ? this.chart.options.symbols[this.symbolType][attName] : void 0;
      var opt1;
      if (this.chart.options.flowstate && this.chart.options.flowstate[this.flowstate]) {
        opt1 = this.chart.options.flowstate[this.flowstate][attName];
      }
      return opt1 || opt2 || opt3;
    };
    Symbol2.prototype.initialize = function() {
      this.group.transform("t" + this.getAttr("line-width") + "," + this.getAttr("line-width"));
      this.width = this.group.getBBox().width;
      this.height = this.group.getBBox().height;
    };
    Symbol2.prototype.getCenter = function() {
      return {
        x: this.getX() + this.width / 2,
        y: this.getY() + this.height / 2
      };
    };
    Symbol2.prototype.getX = function() {
      return this.group.getBBox().x;
    };
    Symbol2.prototype.getY = function() {
      return this.group.getBBox().y;
    };
    Symbol2.prototype.shiftX = function(x) {
      this.group.transform("t" + (this.getX() + x) + "," + this.getY());
    };
    Symbol2.prototype.setX = function(x) {
      this.group.transform("t" + x + "," + this.getY());
    };
    Symbol2.prototype.shiftY = function(y) {
      this.group.transform("t" + this.getX() + "," + (this.getY() + y));
    };
    Symbol2.prototype.setY = function(y) {
      this.group.transform("t" + this.getX() + "," + y);
    };
    Symbol2.prototype.getTop = function() {
      var y = this.getY();
      var x = this.getX() + this.width / 2;
      return { x, y };
    };
    Symbol2.prototype.getBottom = function() {
      var y = this.getY() + this.height;
      var x = this.getX() + this.width / 2;
      return { x, y };
    };
    Symbol2.prototype.getLeft = function() {
      var y = this.getY() + this.group.getBBox().height / 2;
      var x = this.getX();
      return { x, y };
    };
    Symbol2.prototype.getRight = function() {
      var y = this.getY() + this.group.getBBox().height / 2;
      var x = this.getX() + this.group.getBBox().width;
      return { x, y };
    };
    Symbol2.prototype.render = function() {
      if (this.next) {
        var self = this;
        var lineLength = this.getAttr("line-length");
        if (this.next_direction === "right") {
          var rightPoint = this.getRight();
          if (!this.next.isPositioned) {
            this.next.setY(rightPoint.y - this.next.height / 2);
            this.next.shiftX(this.group.getBBox().x + this.width + lineLength);
            (function shift() {
              var hasSymbolUnder = false;
              var symb;
              for (var i = 0, len = self.chart.symbols.length; i < len; i++) {
                symb = self.chart.symbols[i];
                var diff = Math.abs(symb.getCenter().x - self.next.getCenter().x);
                if (symb.getCenter().y > self.next.getCenter().y && diff <= self.next.width / 2) {
                  hasSymbolUnder = true;
                  break;
                }
              }
              if (hasSymbolUnder) {
                if (self.next.symbolType === "end")
                  return;
                self.next.setX(symb.getX() + symb.width + lineLength);
                shift();
              }
            })();
            this.next.isPositioned = true;
            this.next.render();
          }
        } else if (this.next_direction === "left") {
          var leftPoint = this.getLeft();
          if (!this.next.isPositioned) {
            this.next.setY(leftPoint.y - this.next.height / 2);
            this.next.shiftX(-(this.group.getBBox().x + this.width + lineLength));
            (function shift() {
              var hasSymbolUnder = false;
              var symb;
              for (var i = 0, len = self.chart.symbols.length; i < len; i++) {
                symb = self.chart.symbols[i];
                var diff = Math.abs(symb.getCenter().x - self.next.getCenter().x);
                if (symb.getCenter().y > self.next.getCenter().y && diff <= self.next.width / 2) {
                  hasSymbolUnder = true;
                  break;
                }
              }
              if (hasSymbolUnder) {
                if (self.next.symbolType === "end")
                  return;
                self.next.setX(symb.getX() + symb.width + lineLength);
                shift();
              }
            })();
            this.next.isPositioned = true;
            this.next.render();
          }
        } else {
          var bottomPoint = this.getBottom();
          if (!this.next.isPositioned) {
            this.next.shiftY(this.getY() + this.height + lineLength);
            this.next.setX(bottomPoint.x - this.next.width / 2);
            this.next.isPositioned = true;
            this.next.render();
          }
        }
      }
    };
    Symbol2.prototype.renderLines = function() {
      if (this.next) {
        if (this.next_direction) {
          this.drawLineTo(this.next, this.getAttr("arrow-text") || "", this.next_direction);
        } else {
          this.drawLineTo(this.next, this.getAttr("arrow-text") || "");
        }
      }
    };
    Symbol2.prototype.drawLineTo = function(symbol, text, origin) {
      if (this.connectedTo.indexOf(symbol) < 0) {
        this.connectedTo.push(symbol);
      }
      var x = this.getCenter().x, y = this.getCenter().y, right = this.getRight(), bottom = this.getBottom(), top = this.getTop(), left = this.getLeft();
      var symbolX = symbol.getCenter().x, symbolY = symbol.getCenter().y, symbolTop = symbol.getTop(), symbolRight = symbol.getRight(), symbolLeft = symbol.getLeft();
      var isOnSameColumn = x === symbolX, isOnSameLine = y === symbolY, isUnder = y < symbolY, isUpper = y > symbolY || this === symbol, isLeft = x > symbolX, isRight = x < symbolX;
      var maxX = 0, line, yOffset, lineLength = this.getAttr("line-length"), lineWith = this.getAttr("line-width");
      if ((!origin || origin === "bottom") && isOnSameColumn && isUnder) {
        if (symbol.topLines.length === 0 && this.bottomLines.length === 0) {
          line = drawLine(this.chart, bottom, symbolTop, text);
        } else {
          yOffset = Math.max(symbol.topLines.length, this.bottomLines.length) * 10;
          line = drawLine(this.chart, bottom, [
            { x: symbolTop.x, y: symbolTop.y - yOffset },
            { x: symbolTop.x, y: symbolTop.y }
          ], text);
        }
        this.bottomLines.push(line);
        symbol.topLines.push(line);
        this.bottomStart = true;
        symbol.topEnd = true;
        maxX = bottom.x;
      } else if ((!origin || origin === "right") && isOnSameLine && isRight) {
        if (symbol.leftLines.length === 0 && this.rightLines.length === 0) {
          line = drawLine(this.chart, right, symbolLeft, text);
        } else {
          yOffset = Math.max(symbol.leftLines.length, this.rightLines.length) * 10;
          line = drawLine(this.chart, right, [
            { x: right.x, y: right.y - yOffset },
            { x: right.x, y: symbolLeft.y - yOffset },
            { x: symbolLeft.x, y: symbolLeft.y - yOffset },
            { x: symbolLeft.x, y: symbolLeft.y }
          ], text);
        }
        this.rightLines.push(line);
        symbol.leftLines.push(line);
        this.rightStart = true;
        symbol.leftEnd = true;
        maxX = symbolLeft.x;
      } else if ((!origin || origin === "left") && isOnSameLine && isLeft) {
        if (symbol.rightLines.length === 0 && this.leftLines.length === 0) {
          line = drawLine(this.chart, left, symbolRight, text);
        } else {
          yOffset = Math.max(symbol.rightLines.length, this.leftLines.length) * 10;
          line = drawLine(this.chart, right, [
            { x: right.x, y: right.y - yOffset },
            { x: right.x, y: symbolRight.y - yOffset },
            { x: symbolRight.x, y: symbolRight.y - yOffset },
            { x: symbolRight.x, y: symbolRight.y }
          ], text);
        }
        this.leftLines.push(line);
        symbol.rightLines.push(line);
        this.leftStart = true;
        symbol.rightEnd = true;
        maxX = symbolRight.x;
      } else if ((!origin || origin === "right") && isOnSameColumn && isUpper) {
        yOffset = Math.max(symbol.topLines.length, this.rightLines.length) * 10;
        line = drawLine(this.chart, right, [
          { x: right.x + lineLength / 2, y: right.y - yOffset },
          { x: right.x + lineLength / 2, y: symbolTop.y - lineLength / 2 - yOffset },
          { x: symbolTop.x, y: symbolTop.y - lineLength / 2 - yOffset },
          { x: symbolTop.x, y: symbolTop.y }
        ], text);
        this.rightLines.push(line);
        symbol.topLines.push(line);
        this.rightStart = true;
        symbol.topEnd = true;
        maxX = right.x + lineLength / 2;
      } else if ((!origin || origin === "right") && isOnSameColumn && isUnder) {
        yOffset = Math.max(symbol.topLines.length, this.rightLines.length) * 10;
        line = drawLine(this.chart, right, [
          { x: right.x + lineLength / 2, y: right.y - yOffset },
          { x: right.x + lineLength / 2, y: symbolTop.y - lineLength / 2 - yOffset },
          { x: symbolTop.x, y: symbolTop.y - lineLength / 2 - yOffset },
          { x: symbolTop.x, y: symbolTop.y }
        ], text);
        this.rightLines.push(line);
        symbol.topLines.push(line);
        this.rightStart = true;
        symbol.topEnd = true;
        maxX = right.x + lineLength / 2;
      } else if ((!origin || origin === "bottom") && isLeft) {
        yOffset = Math.max(symbol.topLines.length, this.bottomLines.length) * 10;
        if (this.leftEnd && isUpper) {
          line = drawLine(this.chart, bottom, [
            { x: bottom.x, y: bottom.y + lineLength / 2 - yOffset },
            { x: bottom.x + (bottom.x - symbolTop.x) / 2, y: bottom.y + lineLength / 2 - yOffset },
            { x: bottom.x + (bottom.x - symbolTop.x) / 2, y: symbolTop.y - lineLength / 2 - yOffset },
            { x: symbolTop.x, y: symbolTop.y - lineLength / 2 - yOffset },
            { x: symbolTop.x, y: symbolTop.y }
          ], text);
        } else {
          line = drawLine(this.chart, bottom, [
            { x: bottom.x, y: symbolTop.y - lineLength / 2 - yOffset },
            { x: symbolTop.x, y: symbolTop.y - lineLength / 2 - yOffset },
            { x: symbolTop.x, y: symbolTop.y }
          ], text);
        }
        this.bottomLines.push(line);
        symbol.topLines.push(line);
        this.bottomStart = true;
        symbol.topEnd = true;
        maxX = bottom.x + (bottom.x - symbolTop.x) / 2;
      } else if ((!origin || origin === "bottom") && isRight && isUnder) {
        yOffset = Math.max(symbol.topLines.length, this.bottomLines.length) * 10;
        line = drawLine(this.chart, bottom, [
          { x: bottom.x, y: symbolTop.y - lineLength / 2 - yOffset },
          { x: symbolTop.x, y: symbolTop.y - lineLength / 2 - yOffset },
          { x: symbolTop.x, y: symbolTop.y }
        ], text);
        this.bottomLines.push(line);
        symbol.topLines.push(line);
        this.bottomStart = true;
        symbol.topEnd = true;
        maxX = bottom.x;
        if (symbolTop.x > maxX)
          maxX = symbolTop.x;
      } else if ((!origin || origin === "bottom") && isRight) {
        yOffset = Math.max(symbol.topLines.length, this.bottomLines.length) * 10;
        line = drawLine(this.chart, bottom, [
          { x: bottom.x, y: bottom.y + lineLength / 2 - yOffset },
          { x: bottom.x + (bottom.x - symbolTop.x) / 2, y: bottom.y + lineLength / 2 - yOffset },
          { x: bottom.x + (bottom.x - symbolTop.x) / 2, y: symbolTop.y - lineLength / 2 - yOffset },
          { x: symbolTop.x, y: symbolTop.y - lineLength / 2 - yOffset },
          { x: symbolTop.x, y: symbolTop.y }
        ], text);
        this.bottomLines.push(line);
        symbol.topLines.push(line);
        this.bottomStart = true;
        symbol.topEnd = true;
        maxX = bottom.x + (bottom.x - symbolTop.x) / 2;
      } else if (origin && origin === "right" && isLeft) {
        yOffset = Math.max(symbol.topLines.length, this.rightLines.length) * 10;
        line = drawLine(this.chart, right, [
          { x: right.x + lineLength / 2, y: right.y },
          { x: right.x + lineLength / 2, y: symbolTop.y - lineLength / 2 - yOffset },
          { x: symbolTop.x, y: symbolTop.y - lineLength / 2 - yOffset },
          { x: symbolTop.x, y: symbolTop.y }
        ], text);
        this.rightLines.push(line);
        symbol.topLines.push(line);
        this.rightStart = true;
        symbol.topEnd = true;
        maxX = right.x + lineLength / 2;
      } else if (origin && origin === "right" && isRight) {
        yOffset = Math.max(symbol.topLines.length, this.rightLines.length) * 10;
        line = drawLine(this.chart, right, [
          { x: symbolTop.x, y: right.y - yOffset },
          { x: symbolTop.x, y: symbolTop.y - yOffset }
        ], text);
        this.rightLines.push(line);
        symbol.topLines.push(line);
        this.rightStart = true;
        symbol.topEnd = true;
        maxX = right.x + lineLength / 2;
      } else if (origin && origin === "bottom" && isOnSameColumn && isUpper) {
        yOffset = Math.max(symbol.topLines.length, this.bottomLines.length) * 10;
        line = drawLine(this.chart, bottom, [
          { x: bottom.x, y: bottom.y + lineLength / 2 - yOffset },
          { x: right.x + lineLength / 2, y: bottom.y + lineLength / 2 - yOffset },
          { x: right.x + lineLength / 2, y: symbolTop.y - lineLength / 2 - yOffset },
          { x: symbolTop.x, y: symbolTop.y - lineLength / 2 - yOffset },
          { x: symbolTop.x, y: symbolTop.y }
        ], text);
        this.bottomLines.push(line);
        symbol.topLines.push(line);
        this.bottomStart = true;
        symbol.topEnd = true;
        maxX = bottom.x + lineLength / 2;
      } else if (origin === "left" && isOnSameColumn && isUpper) {
        var diffX = left.x - lineLength / 2;
        if (symbolLeft.x < left.x) {
          diffX = symbolLeft.x - lineLength / 2;
        }
        yOffset = Math.max(symbol.topLines.length, this.leftLines.length) * 10;
        line = drawLine(this.chart, left, [
          { x: diffX, y: left.y - yOffset },
          { x: diffX, y: symbolTop.y - lineLength / 2 - yOffset },
          { x: symbolTop.x, y: symbolTop.y - lineLength / 2 - yOffset },
          { x: symbolTop.x, y: symbolTop.y }
        ], text);
        this.leftLines.push(line);
        symbol.topLines.push(line);
        this.leftStart = true;
        symbol.topEnd = true;
        maxX = left.x;
      } else if (origin === "left") {
        yOffset = Math.max(symbol.topLines.length, this.leftLines.length) * 10;
        line = drawLine(this.chart, left, [
          { x: symbolTop.x + (left.x - symbolTop.x) / 2, y: left.y },
          { x: symbolTop.x + (left.x - symbolTop.x) / 2, y: symbolTop.y - lineLength / 2 - yOffset },
          { x: symbolTop.x, y: symbolTop.y - lineLength / 2 - yOffset },
          { x: symbolTop.x, y: symbolTop.y }
        ], text);
        this.leftLines.push(line);
        symbol.topLines.push(line);
        this.leftStart = true;
        symbol.topEnd = true;
        maxX = left.x;
      } else if (origin === "top") {
        yOffset = Math.max(symbol.topLines.length, this.topLines.length) * 10;
        line = drawLine(this.chart, top, [
          { x: top.x, y: symbolTop.y - lineLength / 2 - yOffset },
          { x: symbolTop.x, y: symbolTop.y - lineLength / 2 - yOffset },
          { x: symbolTop.x, y: symbolTop.y }
        ], text);
        this.topLines.push(line);
        symbol.topLines.push(line);
        this.topStart = true;
        symbol.topEnd = true;
        maxX = top.x;
      }
      if (this.lineStyle[symbol.key] && line) {
        line.attr(this.lineStyle[symbol.key]);
      }
      if (line) {
        for (var l = 0, llen = this.chart.lines.length; l < llen; l++) {
          var otherLine = this.chart.lines[l];
          var ePath = otherLine.attr("path"), lPath = line.attr("path");
          for (var iP = 0, lenP = ePath.length - 1; iP < lenP; iP++) {
            var newPath = [];
            newPath.push(["M", ePath[iP][1], ePath[iP][2]]);
            newPath.push(["L", ePath[iP + 1][1], ePath[iP + 1][2]]);
            var line1_from_x = newPath[0][1];
            var line1_from_y = newPath[0][2];
            var line1_to_x = newPath[1][1];
            var line1_to_y = newPath[1][2];
            for (var lP = 0, lenlP = lPath.length - 1; lP < lenlP; lP++) {
              var newLinePath = [];
              newLinePath.push(["M", lPath[lP][1], lPath[lP][2]]);
              newLinePath.push(["L", lPath[lP + 1][1], lPath[lP + 1][2]]);
              var line2_from_x = newLinePath[0][1];
              var line2_from_y = newLinePath[0][2];
              var line2_to_x = newLinePath[1][1];
              var line2_to_y = newLinePath[1][2];
              var res = checkLineIntersection(line1_from_x, line1_from_y, line1_to_x, line1_to_y, line2_from_x, line2_from_y, line2_to_x, line2_to_y);
              if (res.onLine1 && res.onLine2) {
                var newSegment;
                if (line2_from_y === line2_to_y) {
                  if (line2_from_x > line2_to_x) {
                    newSegment = ["L", res.x + lineWith * 2, line2_from_y];
                    lPath.splice(lP + 1, 0, newSegment);
                    newSegment = ["C", res.x + lineWith * 2, line2_from_y, res.x, line2_from_y - lineWith * 4, res.x - lineWith * 2, line2_from_y];
                    lPath.splice(lP + 2, 0, newSegment);
                    line.attr("path", lPath);
                  } else {
                    newSegment = ["L", res.x - lineWith * 2, line2_from_y];
                    lPath.splice(lP + 1, 0, newSegment);
                    newSegment = ["C", res.x - lineWith * 2, line2_from_y, res.x, line2_from_y - lineWith * 4, res.x + lineWith * 2, line2_from_y];
                    lPath.splice(lP + 2, 0, newSegment);
                    line.attr("path", lPath);
                  }
                } else {
                  if (line2_from_y > line2_to_y) {
                    newSegment = ["L", line2_from_x, res.y + lineWith * 2];
                    lPath.splice(lP + 1, 0, newSegment);
                    newSegment = ["C", line2_from_x, res.y + lineWith * 2, line2_from_x + lineWith * 4, res.y, line2_from_x, res.y - lineWith * 2];
                    lPath.splice(lP + 2, 0, newSegment);
                    line.attr("path", lPath);
                  } else {
                    newSegment = ["L", line2_from_x, res.y - lineWith * 2];
                    lPath.splice(lP + 1, 0, newSegment);
                    newSegment = ["C", line2_from_x, res.y - lineWith * 2, line2_from_x + lineWith * 4, res.y, line2_from_x, res.y + lineWith * 2];
                    lPath.splice(lP + 2, 0, newSegment);
                    line.attr("path", lPath);
                  }
                }
                lP += 2;
              }
            }
          }
        }
        this.chart.lines.push(line);
        if (this.chart.minXFromSymbols === void 0 || this.chart.minXFromSymbols > left.x) {
          this.chart.minXFromSymbols = left.x;
        }
      }
      if (!this.chart.maxXFromLine || this.chart.maxXFromLine && maxX > this.chart.maxXFromLine) {
        this.chart.maxXFromLine = maxX;
      }
    };
    module.exports = Symbol2;
  }
});

// node_modules/flowchart.js/src/flowchart.symbol.condition.js
var require_flowchart_symbol_condition = __commonJS({
  "node_modules/flowchart.js/src/flowchart.symbol.condition.js"(exports, module) {
    var Symbol2 = require_flowchart_symbol();
    var inherits = require_flowchart_helpers().inherits;
    var drawAPI = require_flowchart_functions();
    var drawPath = drawAPI.drawPath;
    function Condition(chart, options) {
      options = options || {};
      Symbol2.call(this, chart, options);
      this.yes_annotation = options.yes_annotation;
      this.no_annotation = options.no_annotation;
      this.textMargin = this.getAttr("text-margin");
      this.yes_direction = options.direction_yes;
      this.no_direction = options.direction_no;
      if (!this.no_direction && this.yes_direction === "right") {
        this.no_direction = "bottom";
      } else if (!this.yes_direction && this.no_direction === "bottom") {
        this.yes_direction = "right";
      }
      this.yes_direction = this.yes_direction || "bottom";
      this.no_direction = this.no_direction || "right";
      this.text.attr({
        x: this.textMargin * 2
      });
      var width = this.text.getBBox().width + 3 * this.textMargin;
      width += width / 2;
      var height = this.text.getBBox().height + 2 * this.textMargin;
      height += height / 2;
      height = Math.max(width * 0.5, height);
      var startX = width / 4;
      var startY = height / 4;
      this.text.attr({
        x: startX + this.textMargin / 2
      });
      var start = { x: startX, y: startY };
      var points = [
        { x: startX - width / 4, y: startY + height / 4 },
        { x: startX - width / 4 + width / 2, y: startY + height / 4 + height / 2 },
        { x: startX - width / 4 + width, y: startY + height / 4 },
        { x: startX - width / 4 + width / 2, y: startY + height / 4 - height / 2 },
        { x: startX - width / 4, y: startY + height / 4 }
      ];
      var symbol = drawPath(chart, start, points);
      symbol.attr({
        stroke: this.getAttr("element-color"),
        "stroke-width": this.getAttr("line-width"),
        fill: this.getAttr("fill")
      });
      if (options.link) {
        symbol.attr("href", options.link);
      }
      if (options.target) {
        symbol.attr("target", options.target);
      }
      if (options.key) {
        symbol.node.id = options.key;
      }
      symbol.node.setAttribute("class", this.getAttr("class"));
      this.text.attr({
        y: symbol.getBBox().height / 2
      });
      this.group.push(symbol);
      symbol.insertBefore(this.text);
      this.symbol = symbol;
      this.initialize();
    }
    inherits(Condition, Symbol2);
    Condition.prototype.render = function() {
      var self = this;
      if (this.yes_direction) {
        this[this.yes_direction + "_symbol"] = this.yes_symbol;
      }
      if (this.no_direction) {
        this[this.no_direction + "_symbol"] = this.no_symbol;
      }
      var lineLength = this.getAttr("line-length");
      if (this.bottom_symbol) {
        var bottomPoint = this.getBottom();
        if (!this.bottom_symbol.isPositioned) {
          this.bottom_symbol.shiftY(this.getY() + this.height + lineLength);
          this.bottom_symbol.setX(bottomPoint.x - this.bottom_symbol.width / 2);
          this.bottom_symbol.isPositioned = true;
          this.bottom_symbol.render();
        }
      }
      if (this.right_symbol) {
        var rightPoint = this.getRight();
        if (!this.right_symbol.isPositioned) {
          this.right_symbol.setY(rightPoint.y - this.right_symbol.height / 2);
          this.right_symbol.shiftX(this.group.getBBox().x + this.width + lineLength);
          (function shift() {
            var hasSymbolUnder = false;
            var symb;
            for (var i = 0, len = self.chart.symbols.length; i < len; i++) {
              symb = self.chart.symbols[i];
              if (!self.params["align-next"] || self.params["align-next"] !== "no") {
                var diff = Math.abs(symb.getCenter().x - self.right_symbol.getCenter().x);
                if (symb.getCenter().y > self.right_symbol.getCenter().y && diff <= self.right_symbol.width / 2) {
                  hasSymbolUnder = true;
                  break;
                }
              }
            }
            if (hasSymbolUnder) {
              if (self.right_symbol.symbolType === "end")
                return;
              self.right_symbol.setX(symb.getX() + symb.width + lineLength);
              shift();
            }
          })();
          this.right_symbol.isPositioned = true;
          this.right_symbol.render();
        }
      }
      if (this.left_symbol) {
        var leftPoint = this.getLeft();
        if (!this.left_symbol.isPositioned) {
          this.left_symbol.setY(leftPoint.y - this.left_symbol.height / 2);
          this.left_symbol.shiftX(-(this.group.getBBox().x + this.width + lineLength));
          (function shift() {
            var hasSymbolUnder = false;
            var symb;
            for (var i = 0, len = self.chart.symbols.length; i < len; i++) {
              symb = self.chart.symbols[i];
              if (!self.params["align-next"] || self.params["align-next"] !== "no") {
                var diff = Math.abs(symb.getCenter().x - self.left_symbol.getCenter().x);
                if (symb.getCenter().y > self.left_symbol.getCenter().y && diff <= self.left_symbol.width / 2) {
                  hasSymbolUnder = true;
                  break;
                }
              }
            }
            if (hasSymbolUnder) {
              if (self.left_symbol.symbolType === "end")
                return;
              self.left_symbol.setX(symb.getX() + symb.width + lineLength);
              shift();
            }
          })();
          this.left_symbol.isPositioned = true;
          this.left_symbol.render();
        }
      }
    };
    Condition.prototype.renderLines = function() {
      if (this.yes_symbol) {
        this.drawLineTo(this.yes_symbol, this.yes_annotation ? this.yes_annotation : this.getAttr("yes-text"), this.yes_direction);
      }
      if (this.no_symbol) {
        this.drawLineTo(this.no_symbol, this.no_annotation ? this.no_annotation : this.getAttr("no-text"), this.no_direction);
      }
    };
    module.exports = Condition;
  }
});

// node_modules/flowchart.js/src/flowchart.symbol.parallel.js
var require_flowchart_symbol_parallel = __commonJS({
  "node_modules/flowchart.js/src/flowchart.symbol.parallel.js"(exports, module) {
    var Symbol2 = require_flowchart_symbol();
    var inherits = require_flowchart_helpers().inherits;
    function Parallel(chart, options) {
      var symbol = chart.paper.rect(0, 0, 0, 0);
      options = options || {};
      Symbol2.call(this, chart, options, symbol);
      this.path1_annotation = options.path1_annotation || "";
      this.path2_annotation = options.path2_annotation || "";
      this.path3_annotation = options.path3_annotation || "";
      this.textMargin = this.getAttr("text-margin");
      this.path1_direction = "bottom";
      this.path2_direction = "right";
      this.path3_direction = "top";
      this.params = options.params;
      if (options.direction_next === "path1" && !options[options.direction_next] && options.next) {
        options[options.direction_next] = options.next;
      }
      if (options.direction_next === "path2" && !options[options.direction_next] && options.next) {
        options[options.direction_next] = options.next;
      }
      if (options.direction_next === "path3" && !options[options.direction_next] && options.next) {
        options[options.direction_next] = options.next;
      }
      if (options.path1 && options.direction_path1 && options.path2 && !options.direction_path2 && options.path3 && !options.direction_path3) {
        if (options.direction_path1 === "right") {
          this.path2_direction = "bottom";
          this.path1_direction = "right";
          this.path3_direction = "top";
        } else if (options.direction_path1 === "top") {
          this.path2_direction = "right";
          this.path1_direction = "top";
          this.path3_direction = "bottom";
        } else if (options.direction_path1 === "left") {
          this.path2_direction = "right";
          this.path1_direction = "left";
          this.path3_direction = "bottom";
        } else {
          this.path2_direction = "right";
          this.path1_direction = "bottom";
          this.path3_direction = "top";
        }
      } else if (options.path1 && !options.direction_path1 && options.path2 && options.direction_path2 && options.path3 && !options.direction_path3) {
        if (options.direction_path2 === "right") {
          this.path1_direction = "bottom";
          this.path2_direction = "right";
          this.path3_direction = "top";
        } else if (options.direction_path2 === "left") {
          this.path1_direction = "bottom";
          this.path2_direction = "left";
          this.path3_direction = "right";
        } else {
          this.path1_direction = "right";
          this.path2_direction = "bottom";
          this.path3_direction = "top";
        }
      } else if (options.path1 && !options.direction_path1 && options.path2 && !options.direction_path2 && options.path3 && options.direction_path3) {
        if (options.direction_path2 === "right") {
          this.path1_direction = "bottom";
          this.path2_direction = "top";
          this.path3_direction = "right";
        } else if (options.direction_path2 === "left") {
          this.path1_direction = "bottom";
          this.path2_direction = "right";
          this.path3_direction = "left";
        } else {
          this.path1_direction = "right";
          this.path2_direction = "bottom";
          this.path3_direction = "top";
        }
      } else {
        this.path1_direction = options.direction_path1;
        this.path2_direction = options.direction_path2;
        this.path3_direction = options.direction_path3;
      }
      this.path1_direction = this.path1_direction || "bottom";
      this.path2_direction = this.path2_direction || "right";
      this.path3_direction = this.path3_direction || "top";
      this.initialize();
    }
    inherits(Parallel, Symbol2);
    Parallel.prototype.render = function() {
      if (this.path1_direction) {
        this[this.path1_direction + "_symbol"] = this.path1_symbol;
      }
      if (this.path2_direction) {
        this[this.path2_direction + "_symbol"] = this.path2_symbol;
      }
      if (this.path3_direction) {
        this[this.path3_direction + "_symbol"] = this.path3_symbol;
      }
      var lineLength = this.getAttr("line-length");
      if (this.bottom_symbol) {
        var bottomPoint = this.getBottom();
        if (!this.bottom_symbol.isPositioned) {
          this.bottom_symbol.shiftY(this.getY() + this.height + lineLength);
          this.bottom_symbol.setX(bottomPoint.x - this.bottom_symbol.width / 2);
          this.bottom_symbol.isPositioned = true;
          this.bottom_symbol.render();
        }
      }
      if (this.top_symbol) {
        var topPoint = this.getTop();
        if (!this.top_symbol.isPositioned) {
          this.top_symbol.shiftY(this.getY() - this.top_symbol.height - lineLength);
          this.top_symbol.setX(topPoint.x + this.top_symbol.width);
          this.top_symbol.isPositioned = true;
          this.top_symbol.render();
        }
      }
      var self = this;
      if (this.left_symbol) {
        var leftPoint = this.getLeft();
        if (!this.left_symbol.isPositioned) {
          this.left_symbol.setY(leftPoint.y - this.left_symbol.height / 2);
          this.left_symbol.shiftX(-(this.group.getBBox().x + this.width + lineLength));
          (function shift() {
            var hasSymbolUnder = false;
            var symb;
            for (var i = 0, len = self.chart.symbols.length; i < len; i++) {
              symb = self.chart.symbols[i];
              if (!self.params["align-next"] || self.params["align-next"] !== "no") {
                var diff = Math.abs(symb.getCenter().x - self.left_symbol.getCenter().x);
                if (symb.getCenter().y > self.left_symbol.getCenter().y && diff <= self.left_symbol.width / 2) {
                  hasSymbolUnder = true;
                  break;
                }
              }
            }
            if (hasSymbolUnder) {
              if (self.left_symbol.symbolType === "end")
                return;
              self.left_symbol.setX(symb.getX() + symb.width + lineLength);
              shift();
            }
          })();
          this.left_symbol.isPositioned = true;
          this.left_symbol.render();
        }
      }
      if (this.right_symbol) {
        var rightPoint = this.getRight();
        if (!this.right_symbol.isPositioned) {
          this.right_symbol.setY(rightPoint.y - this.right_symbol.height / 2);
          this.right_symbol.shiftX(this.group.getBBox().x + this.width + lineLength);
          (function shift() {
            var hasSymbolUnder = false;
            var symb;
            for (var i = 0, len = self.chart.symbols.length; i < len; i++) {
              symb = self.chart.symbols[i];
              if (!self.params["align-next"] || self.params["align-next"] !== "no") {
                var diff = Math.abs(symb.getCenter().x - self.right_symbol.getCenter().x);
                if (symb.getCenter().y > self.right_symbol.getCenter().y && diff <= self.right_symbol.width / 2) {
                  hasSymbolUnder = true;
                  break;
                }
              }
            }
            if (hasSymbolUnder) {
              if (self.right_symbol.symbolType === "end")
                return;
              self.right_symbol.setX(symb.getX() + symb.width + lineLength);
              shift();
            }
          })();
          this.right_symbol.isPositioned = true;
          this.right_symbol.render();
        }
      }
    };
    Parallel.prototype.renderLines = function() {
      if (this.path1_symbol) {
        this.drawLineTo(this.path1_symbol, this.path1_annotation, this.path1_direction);
      }
      if (this.path2_symbol) {
        this.drawLineTo(this.path2_symbol, this.path2_annotation, this.path2_direction);
      }
      if (this.path3_symbol) {
        this.drawLineTo(this.path3_symbol, this.path3_annotation, this.path3_direction);
      }
    };
    module.exports = Parallel;
  }
});

// node_modules/flowchart.js/src/flowchart.chart.js
var require_flowchart_chart = __commonJS({
  "node_modules/flowchart.js/src/flowchart.chart.js"(exports, module) {
    var Raphael = require_raphael_min();
    var defaults = require_flowchart_helpers().defaults;
    var defaultOptions = require_flowchart_defaults();
    var Condition = require_flowchart_symbol_condition();
    var Parallel = require_flowchart_symbol_parallel();
    function FlowChart(container, options) {
      options = options || {};
      this.paper = new Raphael(container);
      this.options = defaults(options, defaultOptions);
      this.symbols = [];
      this.lines = [];
      this.start = null;
    }
    FlowChart.prototype.handle = function(symbol) {
      if (this.symbols.indexOf(symbol) <= -1) {
        this.symbols.push(symbol);
      }
      var flowChart = this;
      if (symbol instanceof Condition) {
        symbol.yes = function(nextSymbol) {
          symbol.yes_symbol = nextSymbol;
          if (symbol.no_symbol) {
            symbol.pathOk = true;
          }
          return flowChart.handle(nextSymbol);
        };
        symbol.no = function(nextSymbol) {
          symbol.no_symbol = nextSymbol;
          if (symbol.yes_symbol) {
            symbol.pathOk = true;
          }
          return flowChart.handle(nextSymbol);
        };
      } else if (symbol instanceof Parallel) {
        symbol.path1 = function(nextSymbol) {
          symbol.path1_symbol = nextSymbol;
          if (symbol.path2_symbol) {
            symbol.pathOk = true;
          }
          return flowChart.handle(nextSymbol);
        };
        symbol.path2 = function(nextSymbol) {
          symbol.path2_symbol = nextSymbol;
          if (symbol.path3_symbol) {
            symbol.pathOk = true;
          }
          return flowChart.handle(nextSymbol);
        };
        symbol.path3 = function(nextSymbol) {
          symbol.path3_symbol = nextSymbol;
          if (symbol.path1_symbol) {
            symbol.pathOk = true;
          }
          return flowChart.handle(nextSymbol);
        };
      } else {
        symbol.then = function(nextSymbol) {
          symbol.next = nextSymbol;
          symbol.pathOk = true;
          return flowChart.handle(nextSymbol);
        };
      }
      return symbol;
    };
    FlowChart.prototype.startWith = function(symbol) {
      this.start = symbol;
      return this.handle(symbol);
    };
    FlowChart.prototype.render = function() {
      var maxWidth = 0, maxHeight = 0, i = 0, len = 0, maxX = 0, maxY = 0, minX = 0, minY = 0, symbol, line;
      for (i = 0, len = this.symbols.length; i < len; i++) {
        symbol = this.symbols[i];
        if (symbol.width > maxWidth) {
          maxWidth = symbol.width;
        }
        if (symbol.height > maxHeight) {
          maxHeight = symbol.height;
        }
      }
      for (i = 0, len = this.symbols.length; i < len; i++) {
        symbol = this.symbols[i];
        symbol.shiftX(this.options.x + (maxWidth - symbol.width) / 2 + this.options["line-width"]);
        symbol.shiftY(this.options.y + (maxHeight - symbol.height) / 2 + this.options["line-width"]);
      }
      this.start.render();
      for (i = 0, len = this.symbols.length; i < len; i++) {
        symbol = this.symbols[i];
        symbol.renderLines();
      }
      maxX = this.maxXFromLine;
      var x;
      var y;
      for (i = 0, len = this.symbols.length; i < len; i++) {
        symbol = this.symbols[i];
        var leftX = symbol.getX();
        x = leftX + symbol.width;
        y = symbol.getY() + symbol.height;
        if (leftX < minX) {
          minX = leftX;
        }
        if (x > maxX) {
          maxX = x;
        }
        if (y > maxY) {
          maxY = y;
        }
      }
      for (i = 0, len = this.lines.length; i < len; i++) {
        line = this.lines[i].getBBox();
        x = line.x;
        y = line.y;
        var x2 = line.x2;
        var y2 = line.y2;
        if (x < minX) {
          minX = x;
        }
        if (y < minY) {
          minY = y;
        }
        if (x2 > maxX) {
          maxX = x2;
        }
        if (y2 > maxY) {
          maxY = y2;
        }
      }
      var scale = this.options["scale"];
      var lineWidth = this.options["line-width"];
      if (this.minXFromSymbols < minX)
        minX = this.minXFromSymbols;
      if (minX < 0)
        minX -= lineWidth;
      if (minY < 0)
        minY -= lineWidth;
      var width = maxX + lineWidth - minX;
      var height = maxY + lineWidth - minY;
      this.paper.setSize(width * scale, height * scale);
      this.paper.setViewBox(minX, minY, width, height, true);
    };
    FlowChart.prototype.clean = function() {
      if (this.paper) {
        var paperDom = this.paper.canvas;
        paperDom.parentNode && paperDom.parentNode.removeChild(paperDom);
      }
    };
    module.exports = FlowChart;
  }
});

// node_modules/flowchart.js/src/flowchart.symbol.start.js
var require_flowchart_symbol_start = __commonJS({
  "node_modules/flowchart.js/src/flowchart.symbol.start.js"(exports, module) {
    var Symbol2 = require_flowchart_symbol();
    var inherits = require_flowchart_helpers().inherits;
    function Start(chart, options) {
      var symbol = chart.paper.rect(0, 0, 0, 0, 20);
      options = options || {};
      options.text = options.text || "Start";
      Symbol2.call(this, chart, options, symbol);
    }
    inherits(Start, Symbol2);
    module.exports = Start;
  }
});

// node_modules/flowchart.js/src/flowchart.symbol.end.js
var require_flowchart_symbol_end = __commonJS({
  "node_modules/flowchart.js/src/flowchart.symbol.end.js"(exports, module) {
    var Symbol2 = require_flowchart_symbol();
    var inherits = require_flowchart_helpers().inherits;
    function End(chart, options) {
      var symbol = chart.paper.rect(0, 0, 0, 0, 20);
      options = options || {};
      options.text = options.text || "End";
      Symbol2.call(this, chart, options, symbol);
    }
    inherits(End, Symbol2);
    module.exports = End;
  }
});

// node_modules/flowchart.js/src/flowchart.symbol.operation.js
var require_flowchart_symbol_operation = __commonJS({
  "node_modules/flowchart.js/src/flowchart.symbol.operation.js"(exports, module) {
    var Symbol2 = require_flowchart_symbol();
    var inherits = require_flowchart_helpers().inherits;
    function Operation(chart, options) {
      var symbol = chart.paper.rect(0, 0, 0, 0);
      options = options || {};
      Symbol2.call(this, chart, options, symbol);
    }
    inherits(Operation, Symbol2);
    module.exports = Operation;
  }
});

// node_modules/flowchart.js/src/flowchart.symbol.inputoutput.js
var require_flowchart_symbol_inputoutput = __commonJS({
  "node_modules/flowchart.js/src/flowchart.symbol.inputoutput.js"(exports, module) {
    var Symbol2 = require_flowchart_symbol();
    var inherits = require_flowchart_helpers().inherits;
    var drawAPI = require_flowchart_functions();
    var drawPath = drawAPI.drawPath;
    function InputOutput(chart, options) {
      options = options || {};
      Symbol2.call(this, chart, options);
      this.textMargin = this.getAttr("text-margin");
      this.text.attr({
        x: this.textMargin * 3
      });
      var width = this.text.getBBox().width + 4 * this.textMargin;
      var height = this.text.getBBox().height + 2 * this.textMargin;
      var startX = this.textMargin;
      var startY = height / 2;
      var start = { x: startX, y: startY };
      var points = [
        { x: startX - this.textMargin, y: height },
        { x: startX - this.textMargin + width, y: height },
        { x: startX - this.textMargin + width + 2 * this.textMargin, y: 0 },
        { x: startX - this.textMargin + 2 * this.textMargin, y: 0 },
        { x: startX, y: startY }
      ];
      var symbol = drawPath(chart, start, points);
      symbol.attr({
        stroke: this.getAttr("element-color"),
        "stroke-width": this.getAttr("line-width"),
        fill: this.getAttr("fill")
      });
      if (options.link) {
        symbol.attr("href", options.link);
      }
      if (options.target) {
        symbol.attr("target", options.target);
      }
      if (options.key) {
        symbol.node.id = options.key;
      }
      symbol.node.setAttribute("class", this.getAttr("class"));
      this.text.attr({
        y: symbol.getBBox().height / 2
      });
      this.group.push(symbol);
      symbol.insertBefore(this.text);
      this.symbol = symbol;
      this.initialize();
    }
    inherits(InputOutput, Symbol2);
    InputOutput.prototype.getLeft = function() {
      var y = this.getY() + this.group.getBBox().height / 2;
      var x = this.getX() + this.textMargin;
      return { x, y };
    };
    InputOutput.prototype.getRight = function() {
      var y = this.getY() + this.group.getBBox().height / 2;
      var x = this.getX() + this.group.getBBox().width - this.textMargin;
      return { x, y };
    };
    module.exports = InputOutput;
  }
});

// node_modules/flowchart.js/src/flowchart.symbol.subroutine.js
var require_flowchart_symbol_subroutine = __commonJS({
  "node_modules/flowchart.js/src/flowchart.symbol.subroutine.js"(exports, module) {
    var Symbol2 = require_flowchart_symbol();
    var inherits = require_flowchart_helpers().inherits;
    function Subroutine(chart, options) {
      var symbol = chart.paper.rect(0, 0, 0, 0);
      options = options || {};
      Symbol2.call(this, chart, options, symbol);
      symbol.attr({
        width: this.text.getBBox().width + 4 * this.getAttr("text-margin")
      });
      this.text.attr({
        "x": 2 * this.getAttr("text-margin")
      });
      var innerWrap = chart.paper.rect(0, 0, 0, 0);
      innerWrap.attr({
        x: this.getAttr("text-margin"),
        stroke: this.getAttr("element-color"),
        "stroke-width": this.getAttr("line-width"),
        width: this.text.getBBox().width + 2 * this.getAttr("text-margin"),
        height: this.text.getBBox().height + 2 * this.getAttr("text-margin"),
        fill: this.getAttr("fill")
      });
      if (options.key) {
        innerWrap.node.id = options.key + "i";
      }
      var font = this.getAttr("font");
      var fontF = this.getAttr("font-family");
      var fontW = this.getAttr("font-weight");
      if (font)
        innerWrap.attr({ "font": font });
      if (fontF)
        innerWrap.attr({ "font-family": fontF });
      if (fontW)
        innerWrap.attr({ "font-weight": fontW });
      if (options.link) {
        innerWrap.attr("href", options.link);
      }
      if (options.target) {
        innerWrap.attr("target", options.target);
      }
      this.group.push(innerWrap);
      innerWrap.insertBefore(this.text);
      this.initialize();
    }
    inherits(Subroutine, Symbol2);
    module.exports = Subroutine;
  }
});

// node_modules/flowchart.js/src/flowchart.parse.js
var require_flowchart_parse = __commonJS({
  "node_modules/flowchart.js/src/flowchart.parse.js"(exports, module) {
    var FlowChart = require_flowchart_chart();
    var Start = require_flowchart_symbol_start();
    var End = require_flowchart_symbol_end();
    var Operation = require_flowchart_symbol_operation();
    var InputOutput = require_flowchart_symbol_inputoutput();
    var Subroutine = require_flowchart_symbol_subroutine();
    var Condition = require_flowchart_symbol_condition();
    var Parallel = require_flowchart_symbol_parallel();
    function parse(input) {
      input = input || "";
      input = input.trim();
      var chart = {
        symbols: {},
        start: null,
        drawSVG: function(container, options) {
          var self = this;
          if (this.diagram) {
            this.diagram.clean();
          }
          var diagram = new FlowChart(container, options);
          this.diagram = diagram;
          var dispSymbols = {};
          function getDisplaySymbol(s) {
            if (dispSymbols[s.key]) {
              return dispSymbols[s.key];
            }
            switch (s.symbolType) {
              case "start":
                dispSymbols[s.key] = new Start(diagram, s);
                break;
              case "end":
                dispSymbols[s.key] = new End(diagram, s);
                break;
              case "operation":
                dispSymbols[s.key] = new Operation(diagram, s);
                break;
              case "inputoutput":
                dispSymbols[s.key] = new InputOutput(diagram, s);
                break;
              case "subroutine":
                dispSymbols[s.key] = new Subroutine(diagram, s);
                break;
              case "condition":
                dispSymbols[s.key] = new Condition(diagram, s);
                break;
              case "parallel":
                dispSymbols[s.key] = new Parallel(diagram, s);
                break;
              default:
                return new Error("Wrong symbol type!");
            }
            return dispSymbols[s.key];
          }
          (function constructChart(s, prevDisp, prev) {
            var dispSymb = getDisplaySymbol(s);
            if (self.start === s) {
              diagram.startWith(dispSymb);
            } else if (prevDisp && prev && !prevDisp.pathOk) {
              if (prevDisp instanceof Condition) {
                if (prev.yes === s) {
                  prevDisp.yes(dispSymb);
                }
                if (prev.no === s) {
                  prevDisp.no(dispSymb);
                }
              } else if (prevDisp instanceof Parallel) {
                if (prev.path1 === s) {
                  prevDisp.path1(dispSymb);
                }
                if (prev.path2 === s) {
                  prevDisp.path2(dispSymb);
                }
                if (prev.path3 === s) {
                  prevDisp.path3(dispSymb);
                }
              } else {
                prevDisp.then(dispSymb);
              }
            }
            if (dispSymb.pathOk) {
              return dispSymb;
            }
            if (dispSymb instanceof Condition) {
              if (s.yes) {
                constructChart(s.yes, dispSymb, s);
              }
              if (s.no) {
                constructChart(s.no, dispSymb, s);
              }
            } else if (dispSymb instanceof Parallel) {
              if (s.path1) {
                constructChart(s.path1, dispSymb, s);
              }
              if (s.path2) {
                constructChart(s.path2, dispSymb, s);
              }
              if (s.path3) {
                constructChart(s.path3, dispSymb, s);
              }
            } else if (s.next) {
              constructChart(s.next, dispSymb, s);
            }
            return dispSymb;
          })(this.start);
          diagram.render();
        },
        clean: function() {
          this.diagram.clean();
        },
        options: function() {
          return this.diagram.options;
        }
      };
      var lines = [];
      var prevBreak = 0;
      for (var i0 = 1, i0len = input.length; i0 < i0len; i0++) {
        if (input[i0] === "\n" && input[i0 - 1] !== "\\") {
          var line0 = input.substring(prevBreak, i0);
          prevBreak = i0 + 1;
          lines.push(line0.replace(/\\\n/g, "\n"));
        }
      }
      if (prevBreak < input.length) {
        lines.push(input.substr(prevBreak));
      }
      for (var l = 1, len = lines.length; l < len; ) {
        var currentLine = lines[l];
        if (currentLine.indexOf("->") < 0 && currentLine.indexOf("=>") < 0 && currentLine.indexOf("@>") < 0) {
          lines[l - 1] += "\n" + currentLine;
          lines.splice(l, 1);
          len--;
        } else {
          l++;
        }
      }
      function getStyle(s) {
        var startIndex2 = s.indexOf("(") + 1;
        var endIndex2 = s.indexOf(")");
        if (startIndex2 >= 0 && endIndex2 >= 0) {
          return s.substring(startIndex2, endIndex2);
        }
        return "{}";
      }
      function getSymbValue(s) {
        var startIndex2 = s.indexOf("(") + 1;
        var endIndex2 = s.indexOf(")");
        if (startIndex2 >= 0 && endIndex2 >= 0) {
          return s.substring(startIndex2, endIndex2);
        }
        return "";
      }
      function getSymbol(s) {
        var startIndex2 = s.indexOf("(") + 1;
        var endIndex2 = s.indexOf(")");
        if (startIndex2 >= 0 && endIndex2 >= 0) {
          return chart.symbols[s.substring(0, startIndex2 - 1)];
        }
        return chart.symbols[s];
      }
      function getNextPath(s) {
        var next2 = "next";
        var startIndex2 = s.indexOf("(") + 1;
        var endIndex2 = s.indexOf(")");
        if (startIndex2 >= 0 && endIndex2 >= 0) {
          next2 = flowSymb.substring(startIndex2, endIndex2);
          if (next2.indexOf(",") < 0) {
            if (next2 !== "yes" && next2 !== "no") {
              next2 = "next, " + next2;
            }
          }
        }
        return next2;
      }
      function getAnnotation(s) {
        var startIndex2 = s.indexOf("(") + 1, endIndex2 = s.indexOf(")");
        var tmp = s.substring(startIndex2, endIndex2);
        if (tmp.indexOf(",") > 0) {
          tmp = tmp.substring(0, tmp.indexOf(","));
        }
        var tmp_split = tmp.split("@");
        if (tmp_split.length > 1)
          return startIndex2 >= 0 && endIndex2 >= 0 ? tmp_split[1] : "";
      }
      while (lines.length > 0) {
        var line = lines.splice(0, 1)[0].trim();
        if (line.indexOf("=>") >= 0) {
          var parts = line.split("=>");
          var symbol = {
            key: parts[0].replace(/\(.*\)/, ""),
            symbolType: parts[1],
            text: null,
            link: null,
            target: null,
            flowstate: null,
            function: null,
            lineStyle: {},
            params: {}
          };
          var params = parts[0].match(/\((.*)\)/);
          if (params && params.length > 1) {
            var entries = params[1].split(",");
            for (var i = 0; i < entries.length; i++) {
              var entry = entries[i].split("=");
              if (entry.length == 2) {
                symbol.params[entry[0]] = entry[1];
              }
            }
          }
          var sub;
          if (symbol.symbolType.indexOf(": ") >= 0) {
            sub = symbol.symbolType.split(": ");
            symbol.symbolType = sub.shift();
            symbol.text = sub.join(": ");
          }
          if (symbol.text && symbol.text.indexOf(":$") >= 0) {
            sub = symbol.text.split(":$");
            symbol.text = sub.shift();
            symbol.function = sub.join(":$");
          } else if (symbol.symbolType.indexOf(":$") >= 0) {
            sub = symbol.symbolType.split(":$");
            symbol.symbolType = sub.shift();
            symbol.function = sub.join(":$");
          } else if (symbol.text && symbol.text.indexOf(":>") >= 0) {
            sub = symbol.text.split(":>");
            symbol.text = sub.shift();
            symbol.link = sub.join(":>");
          } else if (symbol.symbolType.indexOf(":>") >= 0) {
            sub = symbol.symbolType.split(":>");
            symbol.symbolType = sub.shift();
            symbol.link = sub.join(":>");
          }
          if (symbol.symbolType.indexOf("\n") >= 0) {
            symbol.symbolType = symbol.symbolType.split("\n")[0];
          }
          if (symbol.link) {
            var startIndex = symbol.link.indexOf("[") + 1;
            var endIndex = symbol.link.indexOf("]");
            if (startIndex >= 0 && endIndex >= 0) {
              symbol.target = symbol.link.substring(startIndex, endIndex);
              symbol.link = symbol.link.substring(0, startIndex - 1);
            }
          }
          if (symbol.text) {
            if (symbol.text.indexOf("|") >= 0) {
              var txtAndState = symbol.text.split("|");
              symbol.flowstate = txtAndState.pop().trim();
              symbol.text = txtAndState.join("|");
            }
          }
          chart.symbols[symbol.key] = symbol;
        } else if (line.indexOf("->") >= 0) {
          var ann = getAnnotation(line);
          if (ann) {
            line = line.replace("@" + ann, "");
          }
          var flowSymbols = line.split("->");
          for (var iS = 0, lenS = flowSymbols.length; iS < lenS; iS++) {
            var flowSymb = flowSymbols[iS];
            var symbVal = getSymbValue(flowSymb);
            if (symbVal === "true" || symbVal === "false") {
              flowSymb = flowSymb.replace("true", "yes");
              flowSymb = flowSymb.replace("false", "no");
            }
            var next = getNextPath(flowSymb);
            var realSymb = getSymbol(flowSymb);
            var direction = null;
            if (next.indexOf(",") >= 0) {
              var condOpt = next.split(",");
              next = condOpt[0];
              direction = condOpt[1].trim();
            }
            if (ann) {
              if (realSymb.symbolType === "condition") {
                if (next === "yes" || next === "true") {
                  realSymb.yes_annotation = ann;
                } else {
                  realSymb.no_annotation = ann;
                }
              } else if (realSymb.symbolType === "parallel") {
                if (next === "path1") {
                  realSymb.path1_annotation = ann;
                } else if (next === "path2") {
                  realSymb.path2_annotation = ann;
                } else if (next === "path3") {
                  realSymb.path3_annotation = ann;
                }
              }
              ann = null;
            }
            if (!chart.start) {
              chart.start = realSymb;
            }
            if (iS + 1 < lenS) {
              var nextSymb = flowSymbols[iS + 1];
              realSymb[next] = getSymbol(nextSymb);
              realSymb["direction_" + next] = direction;
              direction = null;
            }
          }
        } else if (line.indexOf("@>") >= 0) {
          var lineStyleSymbols = line.split("@>");
          for (var iSS = 0, lenSS = lineStyleSymbols.length; iSS < lenSS; iSS++) {
            if (iSS + 1 !== lenSS) {
              var curSymb = getSymbol(lineStyleSymbols[iSS]);
              var nextSymbol = getSymbol(lineStyleSymbols[iSS + 1]);
              curSymb["lineStyle"][nextSymbol.key] = JSON.parse(getStyle(lineStyleSymbols[iSS + 1]));
            }
          }
        }
      }
      return chart;
    }
    module.exports = parse;
  }
});
export default require_flowchart_parse();
//# sourceMappingURL=flowchart__js_src_flowchart__parse__js.js.map
