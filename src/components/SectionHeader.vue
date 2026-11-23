<template>
  <header class="section-header" :class="{ split: $slots.aside }">
    <div>
      <p v-if="label" class="eyebrow" v-reveal>
        <span v-if="index">{{ index }} /</span>{{ label }}
      </p>
      <h2 class="h2" v-reveal="60"><slot name="title">{{ title }}</slot></h2>
      <p v-if="lead" class="lead" v-reveal="120">{{ lead }}</p>
    </div>
    <div v-if="$slots.aside" class="aside" v-reveal="160"><slot name="aside" /></div>
  </header>
</template>

<script setup>
defineProps({
  index: String,
  label: String,
  title: String,
  lead: String,
})
</script>

<style scoped>
.section-header {
  margin-bottom: clamp(2.5rem, 5vw, 4rem);
}
.section-header .eyebrow {
  margin-bottom: 1.25rem;
}
.section-header .eyebrow span {
  margin-right: 0.35em;
}
.section-header h2 {
  max-width: 20ch;
}
.section-header .lead {
  margin-top: 1.25rem;
  margin-bottom: 0;
}
.split {
  display: grid;
  gap: 2rem;
  align-items: end;
}
@media (min-width: 900px) {
  .split {
    grid-template-columns: 1fr auto;
  }
}
</style>
