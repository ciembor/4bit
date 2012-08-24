[4bit](http://ciembor.github.com/4bit) Terminal Color Scheme Designer
=========

For users
---------

1. Go to http://ciembor.github.com/4bit.
2. Design your terminal look.
3. Click `.Xresources` button and save it to `~/.Xresources`.
4. Run `xrdb ~/.Xresources`.
5. Get back to work (or to the first step).

__Note:__ Only __libXt__ based terminals uses `.Xresources` file. This includes at least __aterm__, __eterm__, __urxvt__ and __xterm__. If you use another one, you must copy hex codes into it's configuration file or tool.

For developers
---------

I pushed to this repository all fonts, images and most of third-party libraries. The only missed dependency is [Google Closure Library](https://developers.google.com/closure/library/).

After `git clone` please edit `build.sh` and make sure that paths are correct. After that run `./build.sh`. It generates compiled JavaScript, compiled LESS, and merged CSS.

Resources
--------
* [ArchLinux Wiki - X resources](https://wiki.archlinux.org/index.php/X_resources)
* [original colors.sh](http://code.google.com/p/iterm2/source/browse/trunk/tests/colors.sh)


Konsole/Yakuake
---------------
similiar to the Xresources, there is a button for generating Konsole/Yakuake colorschemes.
Put the generated file to ``~/.kde/share/apps/konsole/NAME-OF-SCHEME.colorscheme``  and restart the terminal.
