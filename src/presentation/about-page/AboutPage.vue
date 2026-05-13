<template>
  <div class="wrapper about-page-wrapper">
    <header>
      <AppLogo />
      <MainMenu
        primary-button-href="../"
        primary-button-label="Editor"
      />
    </header>

    <main class="about-content">
      <section class="hero" aria-labelledby="page-title">
        <div>
          <h1 id="page-title">About 4bit</h1>
          <p class="lead">
            4bit is a terminal color scheme designer. It helps you build a 16-color terminal palette
            without editing every ANSI color by hand.
          </p>
          <p>
            Pick a hue, saturation, brightness, color mode, background, and dye scope. 4bit calculates the
            normal and bright colors, then exports the result as terminal schemes for common terminal emulators.
          </p>
          <div class="hero-actions">
            <PageHeaderButton class="cta" href="../">
              Create a Terminal Color Scheme
            </PageHeaderButton>
            <PageHeaderButton
              class="cta"
              href="https://github.com/ciembor/4bit"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span class="source-button-content">
                <img class="source-button-icon" src="/images/github.png" alt="">
                <span>View Source</span>
              </span>
            </PageHeaderButton>
          </div>
        </div>

        <a class="project-preview" href="../" aria-label="Open 4bit Terminal Color Scheme Designer">
          <img
            src="../../../4bit-terminal-color-scheme-designer.webp"
            alt="4bit Terminal Color Scheme Designer interface preview"
            width="1280"
            height="712"
          >
        </a>
      </section>

      <section class="section" aria-labelledby="why">
        <h2 id="why">Why 4bit Exists</h2>
        <div class="grid">
          <article class="card terminal-card terminal-card--red">
            <h3>Terminal Colors</h3>
            <p>
              A useful terminal theme needs more than a few nice hex values. The foreground, background,
              normal colors, and bright colors should work together when real command output fills the screen.
            </p>
          </article>
          <article class="card terminal-card terminal-card--blue">
            <h3>Terminal Schemes</h3>
            <p>
              4bit turns a small set of controls into a complete terminal scheme. It is useful when you want
              your own palette instead of another downloaded theme.
            </p>
          </article>
          <article class="card terminal-card terminal-card--green">
            <h3>Terminal Themes</h3>
            <p>
              The same palette can be exported for several terminal apps. That matters if you move between
              Linux, macOS, Windows, SSH sessions, or different terminal emulators.
            </p>
          </article>
        </div>
      </section>

      <section class="section" aria-labelledby="formats">
        <h2 id="formats">Supported Terminal Themes and Schemes</h2>
        <p>
          4bit exports terminal color themes and configuration snippets for these terminals:
        </p>
        <ul class="supported-list">
          <li><a href="https://alacritty.org/">Alacritty</a></li>
          <li><a href="http://www.afterstep.org/aterm.php">Aterm</a></li>
          <li><a href="http://rxvt.sourceforge.net/">rxvt</a></li>
          <li><a href="http://software.schmorp.de/pkg/rxvt-unicode.html">urxvt</a></li>
          <li><a href="https://invisible-island.net/xterm/">xterm</a></li>
          <li><a href="https://apps.gnome.org/Ptyxis/">GNOME Terminal</a></li>
          <li><a href="https://guake.github.io/">Guake</a></li>
          <li><a href="https://iterm2.com/">iTerm2</a></li>
          <li><a href="https://konsole.kde.org/">Konsole</a></li>
          <li><a href="https://apps.kde.org/yakuake/">Yakuake</a></li>
          <li><a href="https://mintty.github.io/">mintty</a></li>
          <li><a href="https://www.chiark.greenend.org.uk/~sgtatham/putty/">PuTTY</a></li>
          <li><a href="https://github.com/thestinger/termite">Termite</a></li>
          <li><a href="https://gnome-terminator.org/">Terminator</a></li>
          <li><a href="https://docs.xfce.org/apps/xfce4-terminal/start">Xfce4-terminal</a></li>
          <li><a href="https://wiki.archlinux.org/title/X_resources">Xresources-compatible terminals</a></li>
        </ul>
      </section>

      <section class="section" aria-labelledby="how-it-works">
        <h2 id="how-it-works">How it Works</h2>
        <p>
          Terminal colors are usually easier to read when they come from one palette system. 4bit starts with
          hue, saturation, and lightness instead of unrelated hex values, then calculates the ANSI colors from
          those settings. That keeps red, yellow, green, cyan, blue, and magenta related to each other, and keeps
          the bright variants lighter without turning the whole theme into a random set of colors.
        </p>
        <p>
          The color modes decide how the six chromatic terminal colors are spaced around the color wheel:
          monochrome keeps them close to one hue, duotone uses two sides of the wheel, tricolor uses three,
          and hexachrome follows the standard six-color spacing. Hue distance, saturation range, and lightness
          range let you loosen that structure when a terminal theme needs more contrast or more variation.
        </p>
        <p>
          Black, bright black, white, and bright white are handled separately as achromatic colors, because they
          carry most of the text/background contrast in a terminal. Foreground and background can reuse calculated
          colors or use custom HSL values. The dye option can blend one color into chromatic colors, achromatic
          colors, or the full scheme when you want the whole terminal color theme to share a visible tint.
        </p>
      </section>

      <section class="section" aria-labelledby="history">
        <h2 id="history">Project History and Community Use</h2>
        <p>
          I created 4bit in 2012. I shared it on Hacker News and Reddit, and it later showed up in references from
          other terminal color projects. Mintty also integrated 4bit into its options dialog: the Color Scheme
          Designer button in the theme/color settings opens 4bit, so mintty users can design a scheme and bring it
          back as a mintty theme.
        </p>
        <p>
          The project still has the same job: make terminal color scheme design visual enough to adjust quickly,
          but concrete enough to export into real config files.
        </p>
      </section>

      <section class="section" aria-labelledby="sources">
        <h2 id="sources">Sources and References</h2>
        <ul class="source-list">
          <li><a href="https://maciej-ciemborowicz.eu/#4bit">Maciej Ciemborowicz: 4bit Terminal Color Scheme Designer</a></li>
          <li><a href="https://github.com/ciembor/4bit">4bit source code on GitHub</a></li>
          <li><a href="https://mintty.github.io/mintty.1.html">mintty manual: Theme field and Color Scheme Designer import</a></li>
          <li><a href="https://github.com/mintty/mintty/wiki/Tips#using-colour-schemes-themes">mintty tips: Color Scheme Designer button and drag-and-drop themes</a></li>
          <li><a href="https://terminal.sexy/">terminal.sexy</a></li>
          <li><a href="https://gogh-co.github.io/Gogh/">Gogh terminal color scheme collection</a></li>
        </ul>
      </section>
    </main>
  </div>

  <PageFooter :show-twitter-follow="false" />
</template>

<script>
import AppLogo from '../shared/components/page-header/AppLogo.vue';
import MainMenu from '../shared/components/page-header/MainMenu.vue';
import PageFooter from '../shared/components/PageFooter.vue';
import PageHeaderButton from '../shared/components/page-header/PageHeaderButton.vue';

export default {
  name: 'AboutPage',
  components: {
    AppLogo,
    MainMenu,
    PageFooter,
    PageHeaderButton,
  },
};
</script>

<style lang="less" scoped>
.about-page-wrapper {
  min-height: 655px;
  height: 100%;
}

.about-content {
  width: min(1040px, calc(100% - 32px));
  margin: 62px auto 74px;
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.55;
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(320px, 0.92fr);
  gap: 34px;
  align-items: center;
  margin-bottom: 44px;
}

.about-content h1,
.about-content h2,
.about-content h3 {
  margin: 0 0 14px;
  line-height: 1.08;
  letter-spacing: 0;
}

.about-content h1 {
  font-family: Rationale, sans-serif;
  font-weight: normal;
  font-style: normal;
  max-width: 820px;
  font-size: 44px;
  line-height: 0.96;
}

.about-content h2 {
  font-family: Rationale, sans-serif;
  font-weight: normal;
  font-style: normal;
  font-size: 34px;
  line-height: 1.08;
}

.about-content h3 {
  font-family: Rationale, sans-serif;
  font-size: 22px;
  font-weight: normal;
}

.about-content p {
  margin: 0 0 16px;
}

.about-content a:not(.page-header-button) {
  color: var(--color-blue);
}

.about-content a:not(.page-header-button):visited {
  color: var(--color-magenta);
}

.about-content a:not(.page-header-button):hover {
  color: var(--color-cyan);
}

.lead {
  max-width: 760px;
  color: #333;
  font-size: 24px;
  line-height: 1.35;
}

.hero-actions {
  margin-top: 24px;
  font-size: 0;
}

.source-button-content {
  display: inline-flex;
  align-items: center;
  height: 20px;
}

.source-button-icon {
  width: 20px;
  height: 20px;
  margin: 0 6px 0 0;
  object-fit: contain;
}

.project-preview {
  display: block;
  overflow: hidden;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #fefefe;
  box-shadow: 0 18px 36px rgb(0 0 0 / 18%);
}

.project-preview img {
  display: block;
  width: 100%;
  height: auto;
}

.section {
  padding: 34px 0;
  border-top: 1px solid var(--line);
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.card {
  box-sizing: border-box;
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: var(--paper);
}

.terminal-card {
  border-color: var(--color-bright-black);
  background: var(--color-background);
  box-shadow:
    inset 0 0 0 1px rgb(255 255 255 / 6%),
    0 18px 36px rgb(0 0 0 / 18%);
}

.terminal-card h3 {
  color: var(--terminal-card-heading-color);
}

.terminal-card p {
  color: var(--color-foreground);
  font-family: Inconsolata, monospace;
}

.terminal-card--red {
  --terminal-card-heading-color: var(--color-red);
}

.terminal-card--blue {
  --terminal-card-heading-color: var(--color-blue);
}

.terminal-card--green {
  --terminal-card-heading-color: var(--color-green);
}

.card:not(.terminal-card) p,
.about-content li {
  color: var(--muted);
}

.supported-list {
  columns: 3 190px;
  margin: 0;
  padding-left: 0;
  list-style: none;
}

.supported-list li {
  margin: 0 0 6px;
}

.source-list {
  margin: 0;
  padding-left: 0;
  list-style: none;
}

.source-list li {
  margin: 0 0 6px;
}

@media (max-width: 820px) {
  .hero {
    display: block;
  }

  .about-content {
    margin-top: 74px;
  }

  .about-content h1 {
    font-size: 34px;
  }

  .lead {
    font-size: 21px;
  }

  .project-preview {
    margin-top: 28px;
  }

  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
