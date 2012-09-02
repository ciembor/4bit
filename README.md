[4bit](http://ciembor.github.com/4bit) Terminal Color Scheme Designer
=========

For users
---------

1. Go to http://ciembor.github.com/4bit.
2. Design your terminal look.
3. Click `Get Scheme` button and select the format of configuration file.

* __ATerm, Urxvt, Rxvt, XTerm and other libXt terminals:__
Copy the generated text to `~/.Xresources` file (you may have to create it) and run `xrdb ~/.Xresources`.

* __Konsole and Yakuake:__
Put the generated file to `~/.kde/share/apps/konsole/NAME-OF-SCHEME.colorscheme` and restart the terminal.

* __XFCE4 Terminal:__
Backup `~/.config/Terminal/terminalrc` file and replace it with generated text. Take into account that this file contains all XFCE4 Terminal settings, not only color scheme.

* __iTerm2 for Mac:__
Create a file `~/NAME-OF-SCHEME.itermcolors` with the generated xml
content and load it with the `Load Presets ...` button under
`iTerm2 / Preferences / Profiles / <Your Profile> / Colors`.

* __Other terminals:__
Generate one of the supported formats and copy hex values into the configuration file (or tool) of your terminal.

For developers
---------

I pushed to this repository all fonts, images and most of third-party libraries. The only missed JavaScript dependency is [Google Closure Library](https://developers.google.com/closure/library/).
You will also need some system tools to run the build script:
* [GNU Bash](http://www.gnu.org/software/bash/)
* [Python 2](http://www.python.org/download/releases/2.7.2/)
* [LESS compiler (lessc)](http://lesscss.org/)
* [Google Closure Compiler](https://developers.google.com/closure/compiler/)

After `git clone` please edit `build.sh` and make sure that paths are correct. After that run `./build.sh`. It generates compiled JavaScript, compiled LESS, and merged CSS.

Author
---------

__Maciej Ciemborowicz__

* http://ciemborowicz.pl
* http://twitter.com/ciembor

Contributors
---------

__Stefan Wienert__

* http://stefanwienert.net
* http://github.com/zealot128

Resources
---------

* [ArchLinux Wiki - X resources](https://wiki.archlinux.org/index.php/X_resources)
* [original colors.sh](http://code.google.com/p/iterm2/source/browse/trunk/tests/colors.sh)
