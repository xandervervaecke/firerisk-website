<template>
  <div class="contact-form-wrap">
    <div v-if="status === 'sent'" class="done" role="status">
      <Icon name="check" :size="28" />
      <h3>Thank you, your message has been sent.</h3>
      <p>We will get back to you as soon as possible.</p>
      <button type="button" class="btn btn-outline" @click="reset">Send another message</button>
    </div>

    <form v-else class="contact-form" novalidate @submit.prevent="submit">
      <p v-if="!endpoint" class="placeholder-note">The form is activated once the project e-mail address is set</p>

      <div class="row">
        <label class="field">
          <span>Name</span>
          <input v-model.trim="form.name" type="text" name="name" autocomplete="name" required />
        </label>
        <label class="field">
          <span>E-mail</span>
          <input v-model.trim="form.email" type="email" name="email" autocomplete="email" required />
        </label>
      </div>

      <div class="row">
        <label class="field">
          <span>Organisation <em>(optional)</em></span>
          <input v-model.trim="form.organisation" type="text" name="organisation" autocomplete="organization" />
        </label>
        <label class="field">
          <span>Topic</span>
          <select v-model="form.topic" name="topic">
            <option v-for="t in topics" :key="t">{{ t }}</option>
          </select>
        </label>
      </div>

      <label class="field">
        <span>Message</span>
        <textarea v-model.trim="form.message" name="message" rows="6" required></textarea>
      </label>

      <!-- Spam trap: hidden from people, bots fill it in. -->
      <input v-model="form.honey" type="text" name="_honey" class="honey" tabindex="-1" autocomplete="off" aria-hidden="true" />

      <p v-if="error" class="error" role="alert">{{ error }}</p>

      <div class="actions">
        <button type="submit" class="btn" :disabled="!endpoint || status === 'sending'">
          {{ status === 'sending' ? 'Sending…' : 'Send message' }}
        </button>
        <p class="note">Your details are only used to answer your message.</p>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { site } from '@/content'
import Icon from '@/components/Icon.vue'

const topics = ['General question', 'Research collaboration', 'End-user involvement', 'Press and media', 'Other']

// Where messages go: "contact_form" in site.yaml, or formsubmit.co with "email".
function resolveEndpoint() {
  const custom = (site.contact_form || '').trim()
  if (custom) {
    return custom.includes('formsubmit.co/') && !custom.includes('/ajax/')
      ? custom.replace('formsubmit.co/', 'formsubmit.co/ajax/')
      : custom
  }
  return site.email ? `https://formsubmit.co/ajax/${site.email}` : ''
}
const endpoint = resolveEndpoint()

const empty = () => ({ name: '', email: '', organisation: '', topic: topics[0], message: '', honey: '' })
const form = reactive(empty())
const status = ref('idle')
const error = ref('')

function validate() {
  if (!form.name) return 'Please fill in your name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Please fill in a valid e-mail address.'
  if (form.message.length < 10) return 'Please write a message of at least a few words.'
  return ''
}

async function submit() {
  error.value = validate()
  if (error.value || !endpoint) return
  if (form.honey) {
    status.value = 'sent'
    return
  }
  status.value = 'sending'
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        organisation: form.organisation || '-',
        topic: form.topic,
        message: form.message,
        _subject: `FireRisk website: ${form.topic}`,
        _replyto: form.email,
        _template: 'table',
        _captcha: 'false',
      }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || data.success === false || data.success === 'false') throw new Error(data.message)
    status.value = 'sent'
  } catch {
    status.value = 'idle'
    error.value = site.email
      ? `Something went wrong. Please try again, or e-mail us at ${site.email}.`
      : 'Something went wrong. Please try again later.'
  }
}

function reset() {
  Object.assign(form, empty())
  status.value = 'idle'
  error.value = ''
}
</script>

<style scoped>
.contact-form {
  display: grid;
  gap: 1.25rem;
}
.contact-form > .placeholder-note {
  justify-self: start;
}
.row {
  display: grid;
  gap: 1.25rem;
}
@media (min-width: 640px) {
  .row {
    grid-template-columns: 1fr 1fr;
  }
}
.field {
  display: grid;
  gap: 0.45rem;
}
.field > span {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-muted);
}
.field em {
  font-style: normal;
  text-transform: none;
  letter-spacing: 0;
  color: var(--ink-soft);
}
input,
select,
textarea {
  width: 100%;
  padding: 0.85rem 1rem;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: #fff;
  color: var(--ink);
  font: inherit;
  font-size: 1rem;
  transition:
    border-color 0.2s var(--ease),
    box-shadow 0.2s var(--ease);
}
textarea {
  resize: vertical;
  min-height: 9rem;
}
input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: var(--fire);
  box-shadow: 0 0 0 3px rgba(230, 107, 53, 0.18);
}
.honey {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  opacity: 0;
}
.error {
  margin: 0;
  color: var(--fire-ink);
  font-weight: 500;
}
.actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem 1.5rem;
}
.actions .btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.note {
  margin: 0;
  font-size: 0.85rem;
  color: var(--ink-soft);
}
.done {
  display: grid;
  justify-items: start;
  gap: 0.5rem;
  padding: clamp(1.75rem, 3vw, 2.5rem);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: #fff;
}
.done .icon {
  color: var(--fire-ink);
}
.done h3 {
  font-size: 1.3rem;
  letter-spacing: -0.02em;
}
.done p {
  margin: 0 0 1rem;
  color: var(--ink-muted);
}
</style>
