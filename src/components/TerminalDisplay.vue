<template>
  <section id="terminal-display">
    <p>Welcome to fish, the friendly interactive shell</p>
    <p>Type <span class="green">help</span> for instructions on how to use fish</p>
    <p>
      <span class="cyan">ciembor</span>@browser <span class="cyan">~</span>> <span class="blue">./colors.sh</span>
    </p>
    <br />

    <table id="colors">
      <tr>
        <th v-for="(th, index) in columnsTh" :key="`column-${index}`">{{ th }}</th>
      </tr>
      <tr v-for="(name, rowIndex) in colorNames" :key="`row-${rowIndex}`">
        <th class="row-th">{{ rowsTh[rowIndex] }}</th>
        <td
          v-for="(bgName, colIndex) in bgNames"
          :key="`cell-${rowIndex}-${colIndex}`"
          :class="getCellClass(name, bgName)"
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
      rowsTh: [
        'm',
        '1m',
        '30m',
        '1;30m',
        '31m',
        '1;31m',
        '32m',
        '1;32m',
        '33m',
        '1;33m',
        '34m',
        '1;34m',
        '35m',
        '1;35m',
        '36m',
        '1;36m',
        '37m',
        '1;37m'
      ],
      colorNames: ['foreground', 'bright_foreground'],
      bgNames: ['background'],
      COLOR_NAMES: [
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
    };
  },
  created() {
    this.populateColorNames();
  },
  methods: {
    populateColorNames() {
      this.COLOR_NAMES.forEach(name => {
        if (!name.startsWith('bright_')) {
          this.bgNames.push(name);
        }
        this.colorNames.push(name);
      });
    },
    getCellClass(name, bgName) {
      let classes = '';
      if (name.startsWith('bright_')) {
        classes += 'bold ';
      }
      if (name === 'bright_foreground') {
        classes += 'foreground';
      } else {
        classes += name;
      }
      classes += ` bg-${bgName}`;
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
</style>