<template>
  <section id="terminal-display">
    <div ref="terminalElement" class="terminal-display__xterm" aria-label="Terminal color preview"></div>
  </section>
</template>

<script>
import { watch } from 'vue';
import { buildTerminalPreviewSequence } from '../../../application/terminal-preview/build-terminal-preview-sequence';
import {
  renderTerminalPreviewPrompt,
  runTerminalPreviewCommand,
} from '../../../application/terminal-preview/terminal-preview-shell';
import { useCalculatedSchemeStore } from '../../shared/stores/calculated-scheme';
import { createXtermTerminalPreview } from '../terminal-preview/xterm-terminal-preview';
import { xtermThemeFromScheme } from '../terminal-preview/xterm-theme';

export default {
  name: 'TerminalDisplay',
  setup() {
    const calculatedSchemeStore = useCalculatedSchemeStore();

    return { calculatedSchemeStore };
  },
  mounted() {
    this.previewSequence = buildTerminalPreviewSequence();
    this.terminalPreview = createXtermTerminalPreview(this.$refs.terminalElement, {
      prompt: renderTerminalPreviewPrompt(),
      runCommand: runTerminalPreviewCommand,
    });
    this.stopThemeWatcher = watch(
      () => this.calculatedSchemeStore.calculatedScheme,
      (colors) => {
        this.renderTerminalPreview(colors);
      },
      { immediate: true }
    );
  },
  beforeUnmount() {
    this.stopThemeWatcher?.();
    this.terminalPreview?.dispose();
  },
  methods: {
    renderTerminalPreview(colors) {
      this.terminalPreview?.render(this.previewSequence, xtermThemeFromScheme(colors));
    },
  },
};
</script>

<style lang="less" scoped>
#terminal-display {
  visibility: visible;
  display: inline-block;
  margin: 26px 0 0 20px;
  width: 800px;
  height: 500px;
  padding: 1px 2px;
  box-shadow: 0 0 10px #666;
  background-color: var(--color-background);
}
</style>
