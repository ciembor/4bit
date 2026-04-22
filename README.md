[4bit](https://ciembor.github.io/4bit) Terminal Color Scheme Designer
=========

[![Tests and build](https://img.shields.io/github/actions/workflow/status/ciembor/4bit/pages.yml?branch=master&label=tests%20%26%20build&style=flat-square)](https://github.com/ciembor/4bit/actions/workflows/pages.yml)
[![Live site](https://img.shields.io/badge/live%20site-ciembor.github.io%2F4bit-2ea44f?style=flat-square)](https://ciembor.github.io/4bit/)
[![License: GPL v3](https://img.shields.io/badge/license-GPLv3-blue.svg?style=flat-square)](LICENSE.md)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/ciembor/4bit/pulls)

[![4bit Terminal Color Scheme Designer](4bit-terminal-color-scheme-designer.webp)](https://ciembor.github.io/4bit)

For users
---------

1. Go to https://ciembor.github.io/4bit.
2. Design your terminal look.
3. Click `Download Scheme` button and select the format of configuration file.

* __ATerm, Urxvt, Rxvt, XTerm and other libXt terminals:__
Copy the generated text to `~/.Xresources` file (you may have to create it) and run `xrdb ~/.Xresources`.

* __Gnome Terminal, Guake:__
Save the generated script into `set_colors.sh`, make this file executable with `chmod +x set_colors.sh`, and run it with `./set_colors.sh`. Alternatively copy generated lines directly into your shell.

* __XFCE4 Terminal:__
Save file as `~/.local/share/xfce4/terminal/colorschemes/4bit.scheme` and choose it in terminal preferences.

* __Konsole and Yakuake:__
Put the generated file to `~/.kde/share/apps/konsole/NAME-OF-SCHEME.colorscheme` and restart the terminal.

* __iTerm2 for Mac:__
Create a file `~/NAME-OF-SCHEME.itermcolors` with the generated XML content and load it with the `Load Presets...` button under `iTerm2 / Preferences / Profiles / <Your Profile> / Colors`.

* __Putty:__
Save the generated file with `.reg` extension and double click it.

* __Terminator:__
Copy lines within the `[profiles]` section of the generated configuration file to `~/.config/terminator/config`.

* __Alacritty:__
Put the generated file to `~/.config/alacritty/alacritty.yml`.

* __Mintty:__
Copy the colors and save them in `~/.minttyrc`.

* __Other terminals:__
Generate one of the supported formats and copy hex values into the configuration file, preferences panel, or import tool of your terminal.

For developers
---------

This app is built with Vue 3, Vite and Pinia.

Most of the UI is now regular Vue components. The remaining legacy part is the color wheel used in `Advanced`, which is wrapped in Vue but still powered by the old jQuery plugin.

GitHub Pages deployments now run from GitHub Actions after `npm test` and `npm run build` pass on `master`.

Useful commands:

1. Install dependencies with `npm install`
2. Start the dev server with `npm run dev`
3. Build production assets with `npm run build`
4. Preview the production build with `npm run preview`
5. Run the test suite with `npm test`
6. Run lint fixes with `npm run lint`

Project structure:

* `src/components` - UI components
* `src/stores` - Pinia stores for editable scheme state and calculated colors
* `src/services` - color calculation and export logic
* `src/lib/jquery.ui.colorPicker.js` - wrapped legacy color picker plugin
* `src/assets/styles` - global base styles and imported third-party CSS
* `public` - static assets copied to the final build, including images and SEO files

Author
---------

__Maciej Ciemborowicz__

* https://maciej-ciemborowicz.eu
* https://twitter.com/ciembor
* https://linkedin.com/in/maciej-ciemborowicz

Contributors
---------

__Stefan Wienert__

* https://github.com/zealot128

__Victor Hugo Borja__

* https://github.com/vic
* https://twitter.com/vborja

__David 'vidister' Weber__

* https://github.com/vidister
* https://twitter.com/vidister

Resources
---------

* [ArchLinux Wiki - X resources](https://wiki.archlinux.org/index.php/X_resources)
* [original colors.sh](https://github.com/gnachman/iTerm2/blob/master/tests/colors.sh)
