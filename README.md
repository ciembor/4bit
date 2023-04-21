[4bit](https://ciembor.github.io/4bit) Terminal Color Scheme Designer
=========

For users
---------

1. Go to https://ciembor.github.io/4bit.
2. Design your terminal look.
3. Click `Get Scheme` button and select the format of configuration file.

* __ATerm, Urxvt, Rxvt, XTerm and other libXt terminals:__
Copy the generated text to `~/.Xresources` file (you may have to create it) and run `xrdb ~/.Xresources`.

* __Gnome Terminal, Guake:__
Save the generated script into set_colors.sh, make this file executable `$ chmod +x set_colors.sh` and run it `$ ./set_colors.sh`. Alternatively copy generated lines directly into your shell.

* __XFCE4 Terminal:__
Backup `~/.config/Terminal/terminalrc` file and replace it with generated text. Take into account that this file contains all XFCE4 Terminal settings, not only color scheme.

* __Konsole and Yakuake:__
Put the generated file to `~/.kde/share/apps/konsole/NAME-OF-SCHEME.colorscheme` and restart the terminal.

* __iTerm2 for Mac:__
Create a file `~/NAME-OF-SCHEME.itermcolors` with the generated xml
content and load it with the `Load Presets ...` button under
`iTerm2 / Preferences / Profiles / <Your Profile> / Colors`.

* __Putty:__
Save the generated file with `.reg` extension and double click it.

* __Terminator:__
Copy lines within the [profiles] section of the generated configuration file to ~/.config/terminator/config file.

* __Other terminals:__
Generate one of the supported formats and copy hex values into the configuration file (or tool) of your terminal.

For developers
---------

You will need some system tools to run the build script:
* [GNU Bash](https://www.gnu.org/software/bash/)
* [Java Runtime Environment 8](https://www.java.com/en/download/manual.jsp)
* [Python 2](https://www.python.org/downloads/release/python-2718/)
* [LESS compiler (lessc)](https://lesscss.org/)
* [NPM](https://www.npmjs.com/)

After `git clone` run `npm install`. After that run `./build.sh`. It generates compiled JavaScript, compiled LESS, and merged CSS. For compiling code for production run `./build.sh production`.

Author
---------

__Maciej Ciemborowicz__

* https://twitter.com/ciembor
* https://pl.linkedin.com/in/maciej-ciemborowicz-57202470

Contributors
---------

__Stefan Wienert__

* https://github.com/zealot128

__Victor Hugo Borja__

* https://github.com/vic
* https://twitter.com/vborja

Resources
---------

* [ArchLinux Wiki - X resources](https://wiki.archlinux.org/index.php/X_resources)
* [original colors.sh](https://github.com/gnachman/iTerm2/blob/master/tests/colors.sh)
