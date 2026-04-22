[4bit](https://ciembor.github.io/4bit) Terminal Color Scheme Designer
=========

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

This branch is the Vue/Vite version of the app.

1. Run `npm install`
2. Start development with `npm run dev`
3. Build production assets with `npm run build`

Author
---------

__Maciej Ciemborowicz__

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
