import jQuery from 'jquery';

const $ = jQuery;

window.jQuery = window.$ = jQuery;

const __indexOf = Array.prototype.indexOf || function(item) {
  for (let i = 0, length = this.length; i < length; i += 1) {
    if (i in this && this[i] === item) {
      return i;
    }
  }

  return -1;
};

$.widget('oal.colorPicker', {
  options: {
    size: 250,
    format: 'hsla'
  },

  _create() {
    let lightness;
    let alpha;

    this.lightness = 0;
    this.alpha = 1;
    this.fromCenter = 0;
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
    this.canvasId = `colorpicker${parseInt(Math.random() * 9999, 10)}`;
    this.wheel = $(
      `<canvas id='${this.canvasId}' width='${this.options.size}' height='${this.options.size}'></canvas>`
    );
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
      drag: (event, ui) => this._setLightness(ui.position.top, true)
    });

    this.alphaSlider = $('<div class="alpha slider"><span class="handle"></span></div>').css({
      height: this.options.size
    });
    this.element.before(this.alphaSlider);
    this.alphaSlider.find('span.handle').draggable({
      containment: 'parent',
      drag: (event, ui) => this._setAlpha(ui.position.top, true)
    });

    this.picker = $('<span class="picker"></span>').css({
      top: this.options.size / 2,
      left: this.options.size / 2
    });
    this.element.before(this.picker);
    this.picker.draggable({
      drag: (event, ui) => {
        const x = ui.position.left - this.options.size / 2;
        const y = ui.position.top - this.options.size / 2;

        return this._setHue(x, y, true);
      }
    });

    this.element.on('change', () => {
      const color = this.element.val();
      let pattern;
      let h;
      let s;
      let l;
      let a;
      let r;
      let g;
      let b;
      let match;

      if (color.indexOf('hsla(') === 0) {
        pattern = /^hsla\((\d+),\s+(\d+(?:.\d+)?)%,\s+(\d+(?:.\d+)?)%,\s+(\d+(?:.\d+)?)\)$/;
        match = pattern.exec(color);
        [, h, s, l, a] = match;
        this.setColor(h, s, l, a);
        return;
      }

      if (color.indexOf('hsl(') === 0) {
        pattern = /^hsl\((\d+),\s+(\d+(?:.\d+)?)%,\s+(\d+(?:.\d+)?)%\)$/;
        match = pattern.exec(color);
        [, h, s, l] = match;
        this.setColor(h, s, l);
        return;
      }

      if (color.indexOf('rgba(') === 0) {
        pattern = /^rgba\((\d{1,3}),[ ]?(\d{1,3}),[ ]?(\d{1,3}),[ ]?(\d?.\d{1,2})\)$/;
        match = pattern.exec(color);
        [, r, g, b, a] = match;
        [h, s, l, a] = this._toHsla(r, g, b, a);
        this.setColor(h, s, l, a);
        return;
      }

      if (color.indexOf('rgb(') === 0) {
        pattern = /^rgb\((\d{1,3}),[ ]?(\d{1,3}),[ ]?(\d{1,3})\)$/;
        match = pattern.exec(color);
        [, r, g, b] = match;
        [h, s, l, a] = this._toHsla(r, g, b);
        this.setColor(h, s, l, a);
        return;
      }

      if (color.indexOf('#') === 0 && color.length === 4) {
        r = parseInt(color[1] + color[1], 16);
        g = parseInt(color[2] + color[2], 16);
        b = parseInt(color[3] + color[3], 16);
        [h, s, l, a] = this._toHsla(r, g, b);
        this.setColor(h, s, l, a);
        return;
      }

      if (color.indexOf('#') === 0 && color.length === 7) {
        r = parseInt(color[1] + color[2], 16);
        g = parseInt(color[3] + color[4], 16);
        b = parseInt(color[5] + color[6], 16);
        [h, s, l, a] = this._toHsla(r, g, b);
        this.setColor(h, s, l, a);
      }
    });

    alpha.on('click', (event) => {
      const offset = $(event.target).offset();
      const x = event.clientX - offset.left - (this.options.size / 2);
      const y = event.clientY - offset.top - (this.options.size / 2);

      this._setHue(x, y);
      this._update();
    });

    this.lightnessSlider.on('click', (event) => {
      const offset = $(event.target).offset();
      lightness = Math.abs(1 - (event.clientY - offset.top) / this.options.size) * 100;
      this._setLightness(lightness, false);
      this._update();
    });

    this.alphaSlider.on('click', (event) => {
      const offset = $(event.target).offset();
      alpha = Math.abs(1 - (event.clientY - offset.top) / this.options.size);
      this._setAlpha(alpha, false);
      this._update();
    });
  },

  _draw() {
    const canvas = document.getElementById(this.canvasId);
    const context = canvas.getContext('2d');
    const size = this.options.size;
    const half = size / 2;
    const max = size * 1.25;

    for (let i = 0; i <= max; i += 1) {
      context.save();
      context.strokeStyle = `hsl(${(i / max) * 360},100%,50%)`;
      context.translate(half, half);
      context.rotate((Math.PI * 2 * i) / max);
      context.beginPath();
      context.lineWidth = 3;
      context.moveTo(0, 0);
      context.lineTo(0, half);
      context.stroke();
      context.restore();
    }

    const radialGradient = context.createRadialGradient(half, half, 0, half, half, half);
    radialGradient.addColorStop(0, 'hsl(0, 0%, 50%)');
    radialGradient.addColorStop(1, 'hsla(0, 0%, 50%, 0)');
    context.fillStyle = radialGradient;
    context.fillRect(0, 0, size, size);
  },

  _setHue(x, y, pos = false) {
    this.fromCenter = Math.sqrt((x * x) + (y * y));
    this.pickerPos = [x, y];

    if (pos) {
      this._update();

      if (this.fromCenter >= this.options.size / 2) {
        return false;
      }

      return undefined;
    }

    return this.picker.css({
      top: y + this.options.size / 2,
      left: x + this.options.size / 2
    });
  },

  _setLightness(lightness, pos = false) {
    let color;

    if (pos) {
      this.lightness = (lightness / this.options.size) - 0.5;
      this._update();
    } else {
      this.lightness = 0.5 - (lightness / 100);
      this.lightnessSlider.find('span.handle').css({
        top: (this.lightness + 0.5) * this.options.size
      });
    }

    if (this.lightness < 0) {
      color = `rgba(255,255,255,${Math.abs(this.lightness * 2)})`;
    } else {
      color = `rgba(0,0,0,${this.lightness * 2})`;
    }

    return this.wheel.next().css({
      backgroundColor: color
    });
  },

  _setAlpha(alpha, pos = false) {
    if (pos) {
      this.alpha = Math.abs(1 - alpha / this.options.size);
      this._update();
    } else {
      this.alpha = alpha;
      this.alphaSlider.find('span.handle').css({
        top: Math.abs(1 - this.alpha) * this.options.size
      });
    }

    return this.wheel.next().next().css({
      opacity: Math.abs(1 - this.alpha)
    });
  },

  _generateColor() {
    let hue = parseInt(
      180 - ((Math.atan2(this.pickerPos[0], this.pickerPos[1]) + Math.PI) / (Math.PI * 2) * 360),
      10
    );
    let saturation = (this.fromCenter / this.options.size) * 100 * 2;
    let lightness = Math.abs(this.lightness - 0.5) * 100;
    let alpha = this.alpha;

    if (hue < 0) {
      hue += 360;
    }

    if (hue > 360) {
      hue = 360;
    }

    if (saturation > 100) {
      saturation = 100;
    }

    if (lightness > 100) {
      lightness = 100;
    }

    if (alpha > 1) {
      alpha = 1;
    }

    saturation = Math.round(saturation * 100) / 100;
    lightness = Math.round(lightness * 100) / 100;
    alpha = Math.round(alpha * 100) / 100;

    return [hue, saturation, lightness, alpha];
  },

  _update() {
    let colorString;
    let r;
    let g;
    let b;
    let a;
    let response;
    let redString;
    let greenString;
    let blueString;
    const [hue, saturation, lightness, alpha] = this._generateColor();

    switch (this.options.format) {
      case 'hsla':
        colorString = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
        break;
      case 'hsl':
        colorString = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        break;
      case 'rgba':
        [r, g, b, a] = this._toRgba(hue, saturation, lightness, alpha);
        colorString = `rgba(${r}, ${g}, ${b}, ${a})`;
        break;
      case 'rgb':
        [r, g, b] = this._toRgba(hue, saturation, lightness);
        colorString = `rgb(${r}, ${g}, ${b})`;
        break;
      case 'hex':
        [r, g, b] = this._toRgba(hue, saturation, lightness);
        redString = r.toString(16);
        greenString = g.toString(16);
        blueString = b.toString(16);
        if (redString.length === 1) {
          redString = `0${redString}`;
        }
        if (greenString.length === 1) {
          greenString = `0${greenString}`;
        }
        if (blueString.length === 1) {
          blueString = `0${blueString}`;
        }
        colorString = `#${redString}${greenString}${blueString}`;
        break;
      default:
        console.error('Color format not supported!');
    }

    this.element.val(colorString);
    this.picker.css({
      background: colorString
    });

    if (__indexOf.call(this.options.format, 'a') >= 0) {
      response = {
        hue,
        saturation,
        lightness,
        alpha,
        color: colorString
      };
    } else {
      response = {
        hue,
        saturation,
        lightness,
        color: colorString
      };
    }

    return this._trigger('colorChange', null, response);
  },

  _toRgba(h, s, l, a = 1) {
    let r;
    let g;
    let b;
    let p;
    let q;

    const hueToRgb = (innerP, innerQ, t) => {
      let normalizedT = t;

      if (normalizedT < 0) {
        normalizedT += 1;
      }
      if (normalizedT > 1) {
        normalizedT -= 1;
      }
      if (normalizedT < 1 / 6) {
        return innerP + ((innerQ - innerP) * 6 * normalizedT);
      }
      if (normalizedT < 1 / 2) {
        return innerQ;
      }
      if (normalizedT < 2 / 3) {
        return innerP + ((innerQ - innerP) * (2 / 3 - normalizedT) * 6);
      }

      return innerP;
    };

    h /= 360;
    s /= 100;
    l /= 100;

    if (s === 0) {
      r = l;
      g = l;
      b = l;
    } else {
      q = l < 0.5 ? l * (1 + s) : l + s - (l * s);
      p = (2 * l) - q;
      r = hueToRgb(p, q, h + (1 / 3));
      g = hueToRgb(p, q, h);
      b = hueToRgb(p, q, h - (1 / 3));
    }

    return [parseInt(r * 255, 10), parseInt(g * 255, 10), parseInt(b * 255, 10), a];
  },

  _toHsla(r, g, b, a = 1) {
    let h;
    let s;
    const red = r / 255;
    const green = g / 255;
    const blue = b / 255;
    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const lightness = (max + min) / 2;

    if (max === min) {
      h = 0;
      s = 0;
    } else {
      const diff = max - min;
      s = lightness > 0.5 ? diff / (2 - max - min) : diff / (max + min);

      switch (max) {
        case red:
          h = ((green - blue) / diff) + (green < blue ? 6 : 0);
          break;
        case green:
          h = ((blue - red) / diff) + 2;
          break;
        default:
          h = ((red - green) / diff) + 4;
          break;
      }

      h /= 6;
    }

    return [
      parseInt(h * 360, 10),
      Math.round(s * 1000) / 10,
      Math.round(lightness * 1000) / 10,
      a
    ];
  },

  setColor(h, s, l, a = 1) {
    let dist;
    let x;
    let y;

    if (typeof h === 'string' && (
      h.indexOf('hsl') === 0 ||
      h.indexOf('rgb') === 0 ||
      h.indexOf('#') === 0
    )) {
      this.element.val(h);
      this.element.trigger('change');
      return true;
    }

    h = parseInt(h, 10);
    h += 90;
    if (h > 360) {
      h %= 360;
    }

    if (h > 0) {
      dist = (s / 100) * (this.options.size / 2);
      x = Math.cos((h / 360) * (Math.PI * 2)) * dist;
      y = Math.sin((h / 360) * (Math.PI * 2)) * dist;
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

    if (a > 1) {
      a = 1;
    } else if (a < 0) {
      a = 0;
    }
    this._setAlpha(a);

    return this._update();
  },

  _setOption(key, value) {
    if (
      key === 'format' &&
      ['hsla', 'hsl', 'rgba', 'rgb', 'hex'].includes(value)
    ) {
      this.options.format = value;
      this._update();
    }

    return $.Widget.prototype._setOption.apply(this, arguments);
  }
});

export default $;
