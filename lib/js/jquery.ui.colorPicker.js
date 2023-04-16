/*
 * jQuery UI Color Picker Widget
 *
 * Copyright 2012, Olav Andreas Lindekleiv (http://lindekleiv.com/)
 * Available under the BSD License
 * See the LICENSE file or http://opensource.org/licenses/BSD-3-Clause
 *
 * Available on BitBucket at
 * https://bitbucket.org/lindekleiv/jquery-ui-colorpicker
 */

var __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

$.widget('oal.colorPicker', {
  options: {
    size: 250,
    format: 'hsla'
  },
  _create: function() {
    var alpha, lightness,
      _this = this;
    this.lightness = 0.0;
    this.alpha = 1.0;
    this.fromCenter = 0.0;
    this.pickerPos = [0, 0];
    this.parent = $('<div class="colorpicker"></div>');
    this.parent.css({
      width: this.options.size + 36
    });
    this.element.addClass('colorInput');
    this.element.css({
      width: this.options.size + 36
    });
    this.element.wrap(this.parent);
    this.canvasId = "colorpicker" + (parseInt(Math.random() * 9999));
    this.wheel = $("<canvas id='" + this.canvasId + "' width='" + this.options.size + "' height='" + this.options.size + "'></canvas>");
    this.element.before(this.wheel);
    this._draw();
    lightness = $('<div class="circle lightness"></div>').css({
      width: this.options.size,
      height: this.options.size
    });
    this.element.before(lightness);
    alpha = $('<div class="circle alpha"></div>').css({
      width: this.options.size,
      height: this.options.size
    });
    this.element.before(alpha);
    this.lightnessSlider = $('<div class="lightness slider"><span class="handle"></span></div>').css({
      height: this.options.size
    });
    this.element.before(this.lightnessSlider);
    this.lightnessSlider.find('span.handle').draggable({
      containment: 'parent',
      drag: function(e, ui) {
        return _this._setLightness(ui.position.top, true);
      }
    });
    this.alphaSlider = $('<div class="alpha slider"><span class="handle"></span></div>').css({
      height: this.options.size
    });
    this.element.before(this.alphaSlider);
    this.alphaSlider.find('span.handle').draggable({
      containment: 'parent',
      drag: function(e, ui) {
        return _this._setAlpha(ui.position.top, true);
      }
    });
    this.picker = $('<span class="picker"></span>').css({
      top: this.options.size / 2,
      left: this.options.size / 2
    });
    this.element.before(this.picker);
    this.picker.draggable({
      drag: function(e, ui) {
        var x, y;
        x = ui.position.left - _this.options.size / 2;
        y = ui.position.top - _this.options.size / 2;
        return _this._setHue(x, y, true);
      }
    });
    this.element.on('change', function() {
      var a, b, color, g, h, hsla, l, pattern, r, rgb, rgba, s, _ref, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8;
      color = _this.element.val();
      if (color.indexOf('hsla(') === 0) {
        pattern = /^hsla\((\d+),\s+(\d+(?:.\d+)?)%,\s+(\d+(?:.\d+)?)%,\s+(\d+(?:.\d+)?)\)$/;
        _ref = pattern.exec(color), hsla = _ref[0], h = _ref[1], s = _ref[2], l = _ref[3], a = _ref[4];
        return _this.setColor(h, s, l, a);
      } else if (color.indexOf('hsl(') === 0) {
        pattern = /^hsl\((\d+),\s+(\d+(?:.\d+)?)%,\s+(\d+(?:.\d+)?)%\)$/;
        _ref2 = pattern.exec(color), hsla = _ref2[0], h = _ref2[1], s = _ref2[2], l = _ref2[3];
        return _this.setColor(h, s, l);
      } else if (color.indexOf('rgba(') === 0) {
        pattern = /^rgba\((\d{1,3}),[ ]?(\d{1,3}),[ ]?(\d{1,3}),[ ]?(\d?.\d{1,2})\)$/;
        _ref3 = pattern.exec(color), rgba = _ref3[0], r = _ref3[1], g = _ref3[2], b = _ref3[3], a = _ref3[4];
        _ref4 = _this._toHsla(r, g, b, a), h = _ref4[0], s = _ref4[1], l = _ref4[2], a = _ref4[3];
        return _this.setColor(h, s, l, a);
      } else if (color.indexOf('rgb(') === 0) {
        pattern = /^rgb\((\d{1,3}),[ ]?(\d{1,3}),[ ]?(\d{1,3})\)$/;
        _ref5 = pattern.exec(color), rgb = _ref5[0], r = _ref5[1], g = _ref5[2], b = _ref5[3];
        _ref6 = _this._toHsla(r, g, b), h = _ref6[0], s = _ref6[1], l = _ref6[2], a = _ref6[3];
        return _this.setColor(h, s, l, a);
      } else if (color.indexOf('#') === 0 && color.length === 4) {
        r = parseInt(color[1] + color[1], 16);
        g = parseInt(color[2] + color[2], 16);
        b = parseInt(color[3] + color[3], 16);
        _ref7 = _this._toHsla(r, g, b), h = _ref7[0], s = _ref7[1], l = _ref7[2], a = _ref7[3];
        return _this.setColor(h, s, l, a);
      } else if (color.indexOf('#') === 0 && color.length === 7) {
        r = parseInt(color[1] + color[2], 16);
        g = parseInt(color[3] + color[4], 16);
        b = parseInt(color[5] + color[6], 16);
        _ref8 = _this._toHsla(r, g, b), h = _ref8[0], s = _ref8[1], l = _ref8[2], a = _ref8[3];
        return _this.setColor(h, s, l, a);
      }
    });
    alpha.on('click', function(e) {
      var offset, x, y;
      offset = $(e.target).offset();
      x = e.clientX - offset.left - (_this.options.size / 2);
      y = e.clientY - offset.top - (_this.options.size / 2);
      _this._setHue(x, y);
      return _this._update();
    });
    this.lightnessSlider.on('click', function(e) {
      var offset;
      offset = $(e.target).offset();
      lightness = Math.abs(1 - (e.clientY - offset.top) / _this.options.size) * 100;
      _this._setLightness(lightness, false);
      return _this._update();
    });
    return this.alphaSlider.on('click', function(e) {
      var offset;
      offset = $(e.target).offset();
      alpha = Math.abs(1 - (e.clientY - offset.top) / _this.options.size);
      _this._setAlpha(alpha, false);
      return _this._update();
    });
  },
  _draw: function() {
    var c, canvas, color, half, i, max, radialGradient, size;
    canvas = document.getElementById(this.canvasId);
    c = canvas.getContext('2d');
    size = this.options.size;
    half = size / 2;
    max = size * 1.25;
    for (i = 0; 0 <= max ? i <= max : i >= max; 0 <= max ? i++ : i--) {
      c.save();
      color = i / max;
      c.strokeStyle = "hsl(" + (color * 360) + ",100%,50%)";
      c.translate(half, half);
      c.rotate(Math.PI * 2 * i / max);
      c.beginPath();
      c.lineWidth = 3;
      c.moveTo(0, 0);
      c.lineTo(0, half);
      c.stroke();
      c.restore();
    }
    radialGradient = c.createRadialGradient(half, half, 0, half, half, half);
    radialGradient.addColorStop(0, 'hsl(0, 0%, 50%)');
    radialGradient.addColorStop(1, 'hsla(0, 0%, 50%, 0)');
    c.fillStyle = radialGradient;
    return c.fillRect(0, 0, this.options.size, this.options.size);
  },
  _setHue: function(x, y, pos) {
    if (pos == null) pos = false;
    this.fromCenter = Math.sqrt(x * x + y * y);
    this.pickerPos = [x, y];
    if (pos) {
      this._update();
      if (this.fromCenter >= this.options.size / 2) return false;
    } else {
      return this.picker.css({
        top: y + this.options.size / 2,
        left: x + this.options.size / 2
      });
    }
  },
  _setLightness: function(l, pos) {
    var color;
    if (pos == null) pos = false;
    if (pos) {
      this.lightness = (l / this.options.size) - 0.5;
      this._update();
    } else {
      this.lightness = 0.5 - (l / 100);
      this.lightnessSlider.find('span.handle').css({
        top: (this.lightness + 0.5) * this.options.size
      });
    }
    if (this.lightness < 0) {
      color = "rgba(255,255,255," + (Math.abs(this.lightness * 2)) + ")";
    } else {
      color = "rgba(0,0,0," + (this.lightness * 2) + ")";
    }
    return this.wheel.next().css({
      backgroundColor: color
    });
  },
  _setAlpha: function(a, pos) {
    if (pos == null) pos = false;
    if (pos) {
      this.alpha = Math.abs(1 - a / this.options.size);
      this._update();
    } else {
      this.alpha = a;
      this.alphaSlider.find('span.handle').css({
        top: Math.abs(1 - this.alpha) * this.options.size
      });
    }
    return this.wheel.next().next().css({
      opacity: Math.abs(1 - this.alpha)
    });
  },
  _generateColor: function() {
    var a, h, l, s;
    h = parseInt(180 - (Math.atan2(this.pickerPos[0], this.pickerPos[1]) + Math.PI) / (Math.PI * 2) * 360);
    if (h < 0) h += 360;
    s = this.fromCenter / this.options.size * 100 * 2;
    l = Math.abs(this.lightness - 0.5) * 100;
    a = this.alpha;
    if (h > 360) h = 360;
    if (s > 100) s = 100;
    if (l > 100) l = 100;
    if (a > 1.0) a = 1.0;
    s = Math.round(s * 100) / 100;
    l = Math.round(l * 100) / 100;
    a = Math.round(a * 100) / 100;
    return [h, s, l, a];
  },
  _update: function() {
    var a, b, bs, colorString, g, gs, h, l, r, response, rs, s, _ref, _ref2, _ref3, _ref4, _ref5;
    _ref = this._generateColor(), h = _ref[0], s = _ref[1], l = _ref[2], a = _ref[3];
    switch (this.options.format) {
      case 'hsla':
        colorString = "hsla(" + h + ", " + s + "%, " + l + "%, " + a + ")";
        break;
      case 'hsl':
        colorString = "hsl(" + h + ", " + s + "%, " + l + "%)";
        break;
      case 'rgba':
        _ref2 = this._toRgba(h, s, l, a), r = _ref2[0], g = _ref2[1], b = _ref2[2], a = _ref2[3];
        colorString = "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
        break;
      case 'rgb':
        _ref3 = this._toRgba(h, s, l), r = _ref3[0], g = _ref3[1], b = _ref3[2], a = _ref3[3];
        colorString = "rgb(" + r + ", " + g + ", " + b + ")";
        break;
      case 'hex':
        _ref4 = this._toRgba(h, s, l), r = _ref4[0], g = _ref4[1], b = _ref4[2], a = _ref4[3];
        rs = r.toString(16);
        gs = g.toString(16);
        bs = b.toString(16);
        if (rs.length === 1) rs = '0' + rs;
        if (gs.length === 1) gs = '0' + gs;
        if (bs.length === 1) bs = '0' + bs;
        colorString = "#" + rs + gs + bs;
        break;
      default:
        console.error('Color format not supported!');
    }
    this.element.val(colorString);
    this.picker.css({
      background: colorString
    });
    if ((_ref5 = this.options.format) === 'hsl' || _ref5 === 'hsla') {
      response = {
        hue: h,
        saturation: s,
        lightness: l
      };
    } else {
      response = {
        red: r,
        green: g,
        blue: b
      };
    }
    if (__indexOf.call(this.options.format, 'a') >= 0) response.alpha = a;
    response.color = colorString;
    return this._trigger('colorChange', null, response);
  },
  _toRgba: function(h, s, l, a) {
    var b, g, hue2rgb, p, q, r;
    if (a == null) a = 1.0;
    h = h / 360;
    s = s / 100;
    l = l / 100;
    if (s === 0.0) {
      r = l;
      g = l;
      b = l;
    } else {
      hue2rgb = function(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      if (l < 0.5) {
        q = l * (1 + s);
      } else {
        q = l + s - l * s;
      }
      p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return [parseInt(r * 255), parseInt(g * 255), parseInt(b * 255), a];
  },
  _toHsla: function(r, g, b, a) {
    var add, d, h, l, max, min, s;
    if (a == null) a = 1.0;
    r /= 255;
    g /= 255;
    b /= 255;
    max = Math.max(r, g, b);
    min = Math.min(r, g, b);
    h = (max + min) / 2;
    s = h;
    l = h;
    if (max === min) {
      h = 0;
      s = 0;
    } else {
      d = max - min;
      if (l > 0.5) {
        s = d / (2 - max - min);
      } else {
        s = d / (max + min);
      }
      switch (max) {
        case r:
          if (g < b) {
            add = 6;
          } else {
            add = 0;
          }
          h = (g - b) / d + add;
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
      }
      h /= 6;
    }
    return [parseInt(h * 360), Math.round(s * 1000) / 10, Math.round(l * 1000) / 10, a];
  },
  setColor: function(h, s, l, a) {
    var dist, x, y;
    if (a == null) a = 1.0;
    if (typeof h === 'string' && (h.indexOf('hsl') === 0 || h.indexOf('rgb') === 0 || h.indexOf('#') === 0)) {
      this.element.val(h);
      this.element.trigger('change');
      return true;
    }
    h = parseInt(h);
    h += 90;
    if (h > 360) h %= 360;
    if (h > 0) {
      dist = s / 100 * (this.options.size / 2);
      x = Math.cos(h / 360 * (Math.PI * 2)) * dist;
      y = Math.sin(h / 360 * (Math.PI * 2)) * dist;
      this._setHue(x, y);
    }
    if (s >= 0 && s <= 100) {
      this.saturation = s;
    } else if (s > 100) {
      this.saturation = 100;
    } else {
      this.saturation = 0;
    }
    if (l > 100) {
      l = 100;
    } else if (l < 0) {
      l = 0;
    }
    this._setLightness(l);
    if (a > 1.0) {
      a = 1.0;
    } else if (a < 0.0) {
      a = 0.0;
    }
    this._setAlpha(a);
    return this._update();
  },
  _setOption: function(key, value) {
    if (key === 'format' && (value === 'hsla' || value === 'hsl' || value === 'rgba' || value === 'rgb' || value === 'hex')) {
      this.options.format = value;
      this._update();
    }
    return $.Widget.prototype._setOption.apply(this, arguments);
  }
});