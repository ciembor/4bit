/**
 * This is the main script of Terminal Color Scheme Designer
 * author: Maciej Ciemborowicz
 */

// social media ///////////////////////////////////////////////////////////////////////////////////

(function() {

	// facebook button
	(function(d, s, id) {
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) return;
		js = d.createElement(s); js.id = id;
		js.src = "//connect.facebook.net/en_US/all.js#xfbml=1";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));

	// twitter button
	!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");

	// google plus button
	(function() {
		var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
		po.src = 'https://apis.google.com/js/plusone.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
	})();

})();

// jquery ui vertial radio ////////////////////////////////////////////////////////////////////////

(function( $ ){
	//plugin buttonset vertical
	$.fn.buttonsetv = function() {
		$(':radio, :checkbox', this).wrap('<div style="margin: 1px"/>');
		$(this).buttonset();
		$('label:first', this).removeClass('ui-corner-left').addClass('ui-corner-top');
		$('label:last', this).removeClass('ui-corner-right').addClass('ui-corner-bottom');
		mw = 0; // max witdh
		$('label', this).each(function(index){
			 w = $(this).width();
			 if (w > mw) mw = w;
		})
		$('label', this).each(function(index){
			$(this).width(mw);
		})
	};
})( jQuery );

// Backbone app ///////////////////////////////////////////////////////////////////////////////////

_4bit = function() {

	goog.require('goog.color');

	/**
	 * Creates HSL color objects
	 *
	 * @param {Number} h	Hue between 0 and 360
	 * @param {Number} s	Saturation between 0 and 1
	 * @param {Number} l	Lightness between 0 and 1
	 *
	 * @return {Object}	HSL color
	 */
	function HSL(h, s, l) {
		var color = [h, s, l];
		var dye = [0, 0, 0, 0];	// hsla tint

		getHue = function() {
			return color[0];
		}

		getSaturation = function() {
			return color[1];
		}

		getLightness = function() {
			return color[2];
		}

		setHue = function(h) {
			color[0] = h;
		}

		setSaturation = function(s) {
			color[1] = s;
		}

		setLightness = function(l) {
			color[2] = l;
		}

		setDye = function(hsla) {
			dye = hsla;
		}

		setHsl = function(h, s, l) {
			color = [h, s, l];
		}

		stringify = function() {
			var blended = goog.color.hslArrayToRgb(color);
			var blender = goog.color.hslToRgb(dye[0], dye[1], dye[2]);
			var factor = dye[3];
			var rgb = goog.color.blend(blender, blended, factor);
			return goog.color.rgbArrayToHex(rgb);
		}

		toRgb = function() {
			return goog.color.hslArrayToRgb(color);
		}

		return {
			getHue: getHue,
			getSaturation: getSaturation,
			getLightness: getLightness,
			setHue: setHue,
			setSaturation: setSaturation,
			setLightness: setLightness,
			setDye: setDye,
			setHsl: setHsl,
			toString: stringify,
			toRgb: toRgb
		}
	}

	var COLOR_NAMES = [
		'black',
		'bright_black',
		'red',
		'bright_red',
		'green',
		'bright_green',
		'yellow',
		'bright_yellow',
		'blue',
		'bright_blue',
		'magenta',
		'bright_magenta',
		'cyan',
		'bright_cyan',
		'white',
		'bright_white'
	]

	var Scheme = Backbone.Model.extend({

		defaults: {
			hue: 0,
			saturation: 0.3,
			normal_lightness: 0.6,
			bright_lightness: 0.8,
			black: [HSL(0, 0, 0), HSL(0, 0, 0.15)],
			white: [HSL(0, 0, 0.85), HSL(0, 0, 1)],
			background: HSL(0, 0, 0),
			foreground: HSL(0, 0, 1)
		},

		initialize: function() {
			var that = this
			var degrees = [0, 60, 120, 180, 240, 300];
			var normal_array = _.map(degrees, function(degree) {
				return HSL(that.get('hue') + degree, that.get('saturation'), that.get('normal_lightness'));
			});
			var bright_array = _.map(degrees, function(degree) {
				return HSL(that.get('hue') + degree, that.get('saturation'), that.get('bright_lightness'));
			});

			this.set({
				bright: bright_array,
				normal: normal_array
			});

			this.set({
				colors: {
					background: this.get('background'),
					foreground: this.get('foreground'),
					black: this.get('black')[0],
					bright_black: this.get('black')[1],
					red: this.get('normal')[0],
					bright_red: this.get('bright')[0],
					green: this.get('normal')[2],
					bright_green: this.get('bright')[2],
					yellow: this.get('normal')[1],
					bright_yellow: this.get('bright')[1],
					blue: this.get('normal')[4],
					bright_blue: this.get('bright')[4],
					magenta: this.get('normal')[5],
					bright_magenta: this.get('bright')[5],
					cyan: this.get('normal')[3],
					bright_cyan: this.get('bright')[3],
					white: this.get('white')[0],
					bright_white: this.get('white')[1]
				}
			});
		},

		setHue: function(hue) {
			this.set('hue', this.get('hue') + hue)
			_.each([this.get('bright'), this.get('normal')], function(colors) {
				_.each(colors, function(color) {
					color.setHue(hue + color.getHue());
				});
			});
			this.trigger('change');
		},

		setSaturation: function(saturation) {
			this.set('saturation', saturation)
			_.each([this.get('bright'), this.get('normal')], function(colors) {
				_.each(colors, function(color) {
					color.setSaturation(saturation);
				});
			});
			this.trigger('change');
		},

		setLightness: function(type, lightness) {

			switch(type) {
				case 'normal':
					this.set('normal_lightness', lightness)
					_.each(this.get('normal'), function(color) {
						color.setLightness(lightness);
					});
					break;
				case 'bright':
					this.set('bright_lightness', lightness)
					_.each(this.get('bright'), function(color) {
						color.setLightness(lightness);
					});
					break;
				default:
					this.get('colors')[type].setLightness(lightness);
			}

			this.trigger('change');
		},

		dye: function(h, s, l, a, type) {
			var colors = this.get('colors');
			var achromatic = [
				colors.black,
				colors.bright_black,
				colors.white,
				colors.bright_white
			];
			var colors_array = [];

			if ('achromatic' === type) {
				colors_array.push(achromatic);
			} else if ('color' === type) {
				colors_array.push(this.get('bright'));
				colors_array.push(this.get('normal'));
			} else {
				colors_array.push(achromatic);
				colors_array.push(this.get('bright'));
				colors_array.push(this.get('normal'));
			}

			this.set('dye', [h, s, l, a]);

			_.each(colors_array, function(colors) {
				_.each(colors, function(color) {
					color.setDye([h, s, l, a]);
				});
			});

			this.trigger('change');
		},

		setBackground: function(h, s, l, option) {
			var background = this.get('background');

			if ('custom' === option) {
				background.setHsl(h, s, l);
				this.get('colors')['background'] = background;
			} else {
				this.get('colors')['background'] = this.get('colors')[option];
			}

			this.trigger('change');
		},

		setForeground: function(h, s, l, option) {
			var foreground = this.get('foreground');

			if ('custom' === option) {
				foreground.setHsl(h, s, l);
				this.get('colors')['foreground'] = foreground;
			} else {
				this.get('colors')['foreground'] = this.get('colors')[option];
			}

			this.trigger('change');
		}

	});

	var scheme = new Scheme();

	var SchemeView = Backbone.View.extend({

		el: $('#display'),

		model: scheme,

		initialize: function() {
			_.bindAll(this, 'render');
			this.render();

			$("#advanced").tabs();
		},

		render: function() {
			var string = '';
			var color_names = ['foreground', 'bright_foreground'];
			var bg_names = ['background'];
			var columns_th = [' ', ' ', '40m', '41m', '42m', '43m', '44m', '45m', '46m', '47m'];
			var rows_th =['m','1m','30m','1;30m','31m','1;31m','32m','1;32m','33m','1;33m','34m','1;34m','35m','1;35m','36m','1;36m','37m','1;37m'];
			var row_index = 0;

			string += '<p>Welcome to fish, the friendly interactive shell</p>';
			string += '<p>Type <span class="green">help</span> for instructions on how to use fish</p>'
			string += '<p><span class="cyan">ciembor</span>@browser <span class="cyan">~</span>> <span class="blue">./colors.sh</span></p>'
			string += '<br />';

			/* table with colors */
			string += '<table id="colors">';

			string += '<tr>';
			_.each(columns_th, function(th) {
				string += '<th>' + th + '</th>';
			});
			string += '</tr>';

			_.each(COLOR_NAMES, function(name) {
				if (0 !== name.indexOf('bright_')) {
					bg_names.push(name);
				}
				color_names.push(name);
			});

			_.each(color_names, function(name) {
				string += '<tr>';
				string += '<th class="row-th">' + rows_th[row_index] + '</th>';
				row_index += 1;

				_.each(bg_names, function(bg_name) {
					string += '<td class="';
					if (0 === name.indexOf('bright_')) {
						string += 'bold ';
					}
					if ('bright_foreground' === name) {
						string += 'foreground';
					} else {
						string += name;
					}
					string += ' bg-' + bg_name;
					string += '">gYw</td>';
				})

				string += '</tr>';
			})
			string += '</table>';

			string += '<br />';
			string += '<p><span class="cyan">ciembor</span>@browser <span class="cyan">~</span>></p>';

			$(this.el).html(string);
		}

	});

	var SchemeCSSView = Backbone.View.extend({

		model: scheme,

		initialize: function() {
			_.bindAll(this, 'render');
			this.model.bind('change', _.bind(this.render, this));
			this.render();
		},

		render: function() {
			var that = this;
			$('#display').css('color', that.model.get('colors')['foreground']);
			$('#display').css('background-color', that.model.get('colors')['background']);
			_.each(COLOR_NAMES, function(name) {
				$('.' + name).css('color', that.model.get('colors')[name]);
				$('.bg-' + name).css('background-color', that.model.get('colors')[name]);
			});
		}

	});

	var SchemeGuakeView = Backbone.View.extend({

		model: scheme,

		initialize: function() {
			_.bindAll(this, 'render');
			var that = this;
			$('#guake-button').hover(function() {
				that.render();
			});
			$('#guake-button').focus(function() {
				that.render();
			});
		},

		render: function() {
			var that = this;
			var palette = [];
			var colors = that.model.get("colors");

			// Duplicate: #ab1224 -> #abab12122424, which is the expected format
			function gnomeColor(color) {
				return color.toString().replace(/#(.{2})(.{2})(.{2})/, '#$1$1$2$2$3$3');
			}

			_.each(COLOR_NAMES, function(name) {
				palette.push( gnomeColor(colors[name]) )
			});

			out = '#!/bin/bash \n\n';
			out += '# Save this script into set_colors.sh, make this file executable and run it: \n';
			out += '# \n';
			out += '# $ chmod +x set_colors.sh \n';
			out += '# $ ./set_colors.sh \n';
			out += '# \n';
			out += '# Alternatively copy lines below directly into your shell. \n\n';

			out += "gconftool-2 -s -t string /apps/guake/style/background/color '" + gnomeColor(colors["background"]) + "'" +'\n';
			out += "gconftool-2 -s -t string /apps/guake/style/font/color '" + gnomeColor(colors["foreground"]) + "'" + '\n';
			out += "gconftool-2 -s -t string /apps/guake/style/font/palette '" + palette.join(":") + "'" + '\n';

			$('#guake-button').attr('href', 'data:text/plain,' + encodeURIComponent(out));
		}

	});

	var SchemeKonsoleView = Backbone.View.extend({

		model: scheme,

		initialize: function() {
			_.bindAll(this, 'render');
			var that = this;
			$('#konsole-button').hover(function() {
				that.render();
			});
			$('#konsole-button').focus(function() {
				that.render();
			});
		},

		colorRgb: function(context, color) {
			var rgbArray = context.model.get("colors")[color].toRgb();
			return rgbArray[0] + ',' + rgbArray[1] + ',' + rgbArray[2];
		},

		render: function() {
			var that = this;
			var out = '';
			var counter = 0;
			var tpf = "Transparency=false" + '\n' + '\n';
			var name = '4bit-' + that.model.get("colors")["foreground"] + "-on-" + that.model.get("colors")["background"];
			name = name.replace(/#/g,'');

			out += '# --- ~/.kde/share/apps/konsole/NAME.colorscheme -------------------------------\n';
			out += '# ------------------------------------------------------------------------------\n';
			out += '# --- generated with 4bit Terminal Color Scheme Designer -----------------------\n';
			out += '# ------------------------------------------------------------------------------\n';
			out += '# --- http://ciembor.github.com/4bit -------------------------------------------\n';
			out += '# ------------------------------------------------------------------------------\n\n';

			out += '# --- special colors ---\n\n';
			out += '[Background]\n';
			out += 'Color='	+ that.colorRgb(that, "background") + '\n';
			out += tpf;
			out += '[BackgroundIntense]\n';
			out += 'color='	+ that.colorRgb(that, "background") + '\n';
			out += tpf;
			out += '[Foreground]\n';
			out += 'Color='	+ that.colorRgb(that, "foreground") + '\n';
			out += tpf;
			out += '[ForegroundIntense]\n';
			out += 'Color='	+ that.colorRgb(that, "foreground") + '\n';
			out += 'Bold=true\n';
			out += tpf;

			out += '# --- standard colors ---\n\n';
			_.each(COLOR_NAMES, function(name) {
				var number = counter / 2;

				if (0 === name.indexOf('bright_')) {
					number += 7.5;
				}
				if (number > 7) {
					colorsuffix = number % 8 + "Intense";
				} else {
					colorsuffix = number % 8;
				}
				out += '[Color' + colorsuffix + ']\n';
				out += 'Color=' + that.colorRgb(that, name) + '\n';
				out += tpf;
				counter++;
			});

			out += '# --- general options ---\n\n';
			out += '[General]\nDescription=' + name + '\nOpacity=1\n';

			$('#konsole-button').attr('href', 'data:text/plain,' + encodeURIComponent(out));
		}

	});

	var SchemeITerm2View = Backbone.View.extend({

		model: scheme,

		initialize: function() {
			_.bindAll(this, 'render');
			var that = this;
			$('#iterm2-button').hover(function() {
				that.render();
			});
			$('#iterm2-button').focus(function() {
				that.render();
			});
		},

		colorRgb: function(context, color) {
			var rgbArray = context.model.get("colors")[color].toRgb();
			return rgbArray[0] + ',' + rgbArray[1] + ',' + rgbArray[2];
		},

		colorKeyDict: function(context, color, name) {
			var rgbArray = context.model.get("colors")[color].toRgb();
			var out = '';
			out += '	<key>'+name+' Color</key>\n';
			out += '	<dict>\n';
			out += '		<key>Blue Component</key>\n';
			out += '		<real>'+rgbArray[2]+'</real>\n';
			out += '		<key>Green Component</key>\n';
			out += '		<real>'+rgbArray[1]+'</real>\n';
			out += '		<key>Red Component</key>\n';
			out += '		<real>'+rgbArray[0]+'</real>\n';
			out += '	</dict>\n';
			return out;
		},

		render: function() {
			var that = this;
			var out = '';
			var counter = 0;
			var name = '4bit-' + that.model.get("colors")["foreground"] + "-on-" + that.model.get("colors")["background"];
			name = name.replace(/#/g,'');

			out += '<?xml version="1.0" encoding="UTF-8"?>\n';
			out += '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n';
			out += '\n<!--\n';
			out += '      NAME.itermcolors                                                          \n';
			out += '      Load it with iTerm2 Preferences panel                                     \n';
			out += '                                                                                \n';
			out += '      generated with 4bit Terminal Color Scheme Designer                        \n';
			out += '                                                                                \n';
			out += '      http://ciembor.github.com/4bit                                            \n';
			out += '                                                                                \n';
			out += '-->\n\n';

			out += '<plist version="1.0">\n';
			out += '<dict>\n';

			out += '<!-- special colors -->\n';
			out += that.colorKeyDict(that, "background", "Background");
			out += that.colorKeyDict(that, "foreground", "Foreground");
			out += that.colorKeyDict(that, "foreground", "Cursor");
			out += that.colorKeyDict(that, "background", "Cursor Text");

			out += '<!-- standard colors -->\n';

			_.each(COLOR_NAMES, function(name) {
				var number = counter / 2;

				if (0 === name.indexOf('bright_')) {
					number += 7.5;
				}

				out += '<!-- ' + name + ' -->\n';
				out += that.colorKeyDict(that, name, "Ansi "+number);

				counter += 1;
			});

			out += '</dict>\n';
			out += '</plist>\n';
			out += '\n';

			$('#iterm2-button').attr('href', 'data:text/plain,' + encodeURIComponent(out));
		}

	});

	var SchemeXresourcesView = Backbone.View.extend({

		model: scheme,

		initialize: function() {
			_.bindAll(this, 'render');
			var that = this;
			$('#xresources-button').hover(function() {
				that.render();
			});
			$('#xresources-button').focus(function() {
				that.render();
			});
		},

		render: function() {
			var that = this;
			var xresources = '';
			var counter = 0;

			xresources += '! --- ~/.Xresources ------------------------------------------------------------\n';
			xresources += '! ------------------------------------------------------------------------------\n';
			xresources += '! --- generated with 4bit Terminal Color Scheme Designer -----------------------\n';
			xresources += '! ------------------------------------------------------------------------------\n';
			xresources += '! --- http://ciembor.github.com/4bit -------------------------------------------\n';
			xresources += '! ------------------------------------------------------------------------------\n\n';

			xresources += '! --- special colors ---\n\n';
			xresources += '*background: ' + that.model.get('colors')['background'] + '\n';
			xresources += '*foreground: ' + that.model.get('colors')['foreground'] + '\n\n';

			xresources += '! --- standard colors ---\n\n';
			_.each(COLOR_NAMES, function(name) {
				var number = counter / 2;

				if (0 === name.indexOf('bright_')) {
					number += 7.5;
				}

				xresources += '! ' + name + '\n';
				xresources += '*color' + number + ': ' + that.model.get('colors')[name] + '\n\n';
				counter += 1;
			});

			xresources += '\n! ------------------------------------------------------------------------------\n';
			xresources += '! --- end of terminal colors section -------------------------------------------\n';
			xresources += '! ------------------------------------------------------------------------------\n\n';

			$('#xresources-button').attr('href', 'data:text/plain,' + encodeURIComponent(xresources));
		}

	});

	var SchemeXfceTerminalView = Backbone.View.extend({

		model: scheme,

		initialize: function() {
			_.bindAll(this, 'render');
			var that = this;
			$('#xfce-terminal-button').hover(function() {
				that.render();
			});
			$('#xfce-terminal-button').focus(function() {
				that.render();
			});
		},

		render: function() {
			var that = this;
			var terminalrc = '[Configuration]\n';
			var counter = 1;

			// special colors
			terminalrc += 'ColorBackground=' + that.model.get('colors')['background'] + '\n';
			terminalrc += 'ColorForeground=' + that.model.get('colors')['foreground'] + '\n';
			terminalrc += 'ColorCursor=' + that.model.get('colors')['foreground'] + '\n';

			// standard colors
			_.each(COLOR_NAMES, function(name) {
				var number = counter / 2 + 0.5;

				if (0 === name.indexOf('bright_')) {
					number += 7.5;
				}

				terminalrc += 'ColorPalette' + number + '=' + that.model.get('colors')[name] + '\n';
				counter += 1;
			});

			$('#xfce-terminal-button').attr('href', 'data:text/plain,' + encodeURIComponent(terminalrc));
		}

	});

	var ControlsView = Backbone.View.extend({

		el: $('#controls'),

		model: scheme,

		initialize: function() {
			_.bindAll(this, 'render');

			var that = this;

			$("#hue-slider").slider({
				value: that.model.get('hue') + 30,
				min: 0,
				max: 60,
				step: 1,
				slide: function( event, ui ) {
					that.model.setHue((ui.value - 30) - that.model.get('hue'));
				}
			});

			$("#saturation-slider").slider({
				value: that.model.get('saturation') * 256,
				min: 0,
				max: 256,
				step: 1,
				slide: function( event, ui ) {
					that.model.setSaturation(ui.value / 256);
				}
			});

			$("#lightness-slider").slider({
				range: true,
				values: [that.model.get('normal_lightness') * 256, that.model.get('bright_lightness') * 256],
				min: 0,
				max: 256,
				step: 1,
				slide: function( event, ui ) {
					that.model.setLightness('normal', ui.values[0] / 256);
					that.model.setLightness('bright', ui.values[1] / 256);
				}
			});

			$("#black-slider").slider({
				range: true,
				values: [
					that.model.get('colors').black.getLightness() * 256,
					that.model.get('colors').bright_black.getLightness() * 256
				],
				min: 0,
				max: 128,
				step: 1,
				slide: function( event, ui ) {
					that.model.setLightness('black', ui.values[0] / 256);
					that.model.setLightness('bright_black', ui.values[1] / 256);
				}
			});

			$("#white-slider").slider({
				range: true,
				values: [
					that.model.get('colors').white.getLightness() * 256,
					that.model.get('colors').bright_white.getLightness() * 256
				],
				min: 128,
				max: 256,
				step: 1,
				slide: function( event, ui ) {
					that.model.setLightness('white', ui.values[0] / 256);
					that.model.setLightness('bright_white', ui.values[1] / 256);
				}
			});

			$('#dye-colorpicker').colorPicker({
				format: 'hsla',
				size: 90,
				colorChange: function(e, ui) {
					var pattern, _ref, h, s, l, a;
					var type = $('input[name=dye]:checked').val()
					pattern = /^hsla\((\d+),\s+(\d+(?:.\d+)?)%,\s+(\d+(?:.\d+)?)%,\s+(\d+(?:.\d+)?)\)$/;
					_ref = pattern.exec(ui.color), h = _ref[1], s = _ref[2] / 100, l = _ref[3] / 100, a = _ref[4];

					switch(type) {
						case 'none':
							that.model.dye(0, 0, 0, 0, 'all');
							break;
						case 'color':
							that.model.dye(0, 0, 0, 0, 'achromatic');
							that.model.dye(h, s, l, a, 'color');
							break;
						case 'achromatic':
							that.model.dye(0, 0, 0, 0, 'color');
							that.model.dye(h, s, l, a, 'achromatic');
							break;
						case 'all':
							that.model.dye(h, s, l, a, 'all');
							break;
					}
				}
			});

			$('#dye-colorpicker').colorPicker('setColor', 210, 50, 50, 0.2);

			$("input[name=dye]").change(function() {
				$('#dye-colorpicker').change();
			});

			$('#background-colorpicker').colorPicker({
				format: 'hsl',
				size: 90,
				colorChange: function(e, ui) {
					var pattern, _ref, h, s, l;
					var option = $('input[name=background]:checked').val()
					pattern = /^hsl\((\d+),\s+(\d+(?:.\d+)?)%,\s+(\d+(?:.\d+)?)%\)$/;
					_ref = pattern.exec(ui.color), h = _ref[1], s = _ref[2] / 100, l = _ref[3] / 100;
					that.model.setBackground(h, s, l, option);
				}
			});

			$('#background-colorpicker').colorPicker('setColor', 210, 50, 10);

			$("input[name=background]").change(function() {
				$('#background-colorpicker').change();
			});

			$('#background .alpha .ui-draggable').removeClass('ui-draggable handle');

			$('#foreground-colorpicker').colorPicker({
				format: 'hsl',
				size: 90,
				colorChange: function(e, ui) {
					var pattern, _ref, h, s, l;
					var option = $('input[name=foreground]:checked').val()
					pattern = /^hsl\((\d+),\s+(\d+(?:.\d+)?)%,\s+(\d+(?:.\d+)?)%\)$/;
					_ref = pattern.exec(ui.color), h = _ref[1], s = _ref[2] / 100, l = _ref[3] / 100;
					that.model.setForeground(h, s, l, option);
				}
			});

			$('#foreground-colorpicker').colorPicker('setColor', 210, 50, 90);

			$("input[name=foreground]").change(function() {
				$('#foreground-colorpicker').change();
			});

			$('#foreground .alpha .ui-draggable').removeClass('ui-draggable handle');

			$(".radio-group").buttonsetv();

		}

	});

	var schemeView = new SchemeView();
	var schemeCSSView = new SchemeCSSView();
	var schemeXresourcesView = new SchemeXresourcesView();
	var schemeKonsoleView = new SchemeKonsoleView();
	var schemeITerm2View = new SchemeITerm2View();
	var schemeGuakeView = new SchemeGuakeView();
	var schemeXfceTerminalView = new SchemeXfceTerminalView();
	var controlsView = new ControlsView();

	// basic layout behaviour /////////////////////////////

	$('footer p').hover(
		function() {
			$(this).find('a').addClass('blue');
			schemeCSSView.render();
		},
		function() {
			$(this).find('a').removeClass('blue');
			$(this).find('a').removeAttr("style");
		}
	);

	$(window).bind("load", function() {
		$('#display').css('visibility', 'visible');
		$('#controls').css('visibility', 'visible');
		$('#skews').fadeIn(700);
		$('#app').animate({opacity: 1}, 700);
		$("#get-scheme-button").click(function(button) {
			$("#dialog-modal").dialog({
				height: 90 + 50 * $('.get-scheme-link').length,
				width: 450,
				modal: true,
				draggable: false,
				resizable: false
			});
		});
	});

}

