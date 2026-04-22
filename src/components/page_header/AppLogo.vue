<template>
  <h1 id="logo">
    <a href="http://ciembor.github.io/4bit">
      <span class="blue">4</span><span class="cyan">b</span><span class="magenta">i</span><span class="red">t</span>
    </a>
    Terminal Color Scheme Designer
  </h1>
</template>

<script>
export default {
  name: 'AppLogo',
};
</script>

<style lang="less" scoped>
.blue {
  color: var(--color-blue);
}

.cyan {
  color: var(--color-cyan);
}

.magenta {
  color: var(--color-magenta);
}

.red {
  color: var(--color-red);
}
</style>
