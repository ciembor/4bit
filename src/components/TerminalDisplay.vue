<template>
  <section id="terminal-display">
    <p>Welcome to fish, the friendly interactive shell</p>
    <p>
      Type <span class="green">help</span> for instructions on how to use fish
    </p>
    <p>
      <span class="cyan">ciembor</span>@browser 
      <span class="cyan">~</span>> 
      <span class="blue">./colors.sh</span>
    </p>
    <br />

    <table id="colors">
      <tr>
        <th v-for="(th, index) in columnsTh" :key="`column-${index}`">{{ th }}</th>
      </tr>
      <tr v-for="(fontColorName, rowIndex) in fontColorNames" :key="`row-${rowIndex}`">
        <th class="row-th">{{ rowsTh[rowIndex] }}</th>
        <td
          v-for="(backgroundColorName, colIndex) in backgroundColorNames"
          :key="`cell-${rowIndex}-${colIndex}`"
          :class="getCellClass(fontColorName, backgroundColorName)"
        >
          gYw
        </td>
      </tr>
    </table>

    <br />
    <p><span class="cyan">ciembor</span>@browser <span class="cyan">~</span>></p>
  </section>
</template>

<script>
export default {
  name: 'TerminalDisplay',
  data() {
    return {
      columnsTh: [' ', ' ', '40m', '41m', '42m', '43m', '44m', '45m', '46m', '47m'],
      rowsTh: ['m', '1m', '30m', '1;30m', '31m', '1;31m', '32m', '1;32m', '33m', '1;33m', '34m', '1;34m', '35m', '1;35m', '36m', '1;36m', '37m', '1;37m'
      ],
      backgroundColorNames: [
        'background',
        'black',
        'red',
        'green',
        'yellow',
        'blue',
        'magenta',
        'cyan',
        'white',
      ],
      fontColorNames: [
        'foreground',
        'brightForeground',
        'black',
        'brightBlack',
        'red',
        'brightRed',
        'green',
        'brightGreen',
        'yellow',
        'brightYellow',
        'blue',
        'brightBlue',
        'magenta',
        'brightMagenta',
        'cyan',
        'brightCyan',
        'white',
        'brightWhite'
      ]
    };
  },
  methods: {
    getCellClass(name, bgName) {
      let classes = '';
      if (name.startsWith('bright')) {
        classes += 'bold ';
      }
      classes += `${name} ${bgName}Bg`;
      return classes;
    }
  }
};
</script>

<style lang="less">
#terminal-display {
  visibility: visible;
  display: inline-block;
  font-family: Inconsolata;
  font-size: 20px;
  margin: 26px 0 0 20px;
  width: auto;
  height: auto;
  padding: 1px 2px;
  box-shadow: 0 0 10px #666;
  color: var(--color-foreground);
  background-color: var(--color-background);

  table {
    border-collapse: separate;
    border-spacing: 0.5em 0;
    margin-right: 0.5em;
  }

  td {
    margin-left: 1em;
    padding: 0 1em;
  }

  .bold {
	  font-weight: bold; // opera sux
  }

  .row-th {
    text-align: right;
  }
}

.foreground,
.brightForeground {
  color: var(--color-foreground);
}

.backgroundBg {
  background-color: var(--color-background);
}

.black { color: var(--color-black); }
.brightBlack { color: var(--color-bright-black); }
.red { color: var(--color-red); }
.brightRed { color: var(--color-bright-red); }
.green { color: var(--color-green); }
.brightGreen { color: var(--color-bright-green); }
.yellow { color: var(--color-yellow); }
.brightYellow { color: var(--color-bright-yellow); }
.blue { color: var(--color-blue); }
.brightBlue { color: var(--color-bright-blue); }
.magenta { color: var(--color-magenta); }
.brightMagenta { color: var(--color-bright-magenta); }
.cyan { color: var(--color-cyan); }
.brightCyan { color: var(--color-bright-cyan); }
.white { color: var(--color-white); }
.brightWhite { color: var(--color-bright-white); }

.blackBg { background-color: var(--color-black); }
.brightBlackBg { background-color: var(--color-bright-black); }
.redBg { background-color: var(--color-red); }
.brightRedBg { background-color: var(--color-bright-red); }
.greenBg { background-color: var(--color-green); }
.brightGreenBg { background-color: var(--color-bright-green); }
.yellowBg { background-color: var(--color-yellow); }
.brightYellowBg { background-color: var(--color-bright-yellow); }
.blueBg { background-color: var(--color-blue); }
.brightBlueBg { background-color: var(--color-bright-blue); }
.magentaBg { background-color: var(--color-magenta); }
.brightMagentaBg { background-color: var(--color-bright-magenta); }
.cyanBg { background-color: var(--color-cyan); }
.brightCyanBg { background-color: var(--color-bright-cyan); }
.whiteBg { background-color: var(--color-white); }
.brightWhiteBg { background-color: var(--color-bright-white); }
</style>
