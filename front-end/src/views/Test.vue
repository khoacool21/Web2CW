<template>
  <div>
    <h1>Vocabulary Test</h1>

    <div class="ui form">
      <div class="fields">
        <div class="field">
          <label>From</label>
          <select class="ui dropdown" v-model="from">
            <option value="english">English</option>
            <option value="german">German</option>
            <option value="spanish">Spanish</option>
          </select>
        </div>
        <div class="field">
          <label>To</label>
          <select class="ui dropdown" v-model="to">
            <option value="english">English</option>
            <option value="german">German</option>
            <option value="spanish">Spanish</option>
          </select>
        </div>
        <div class="field">
          <label>&nbsp;</label>
          <button class="ui button" @click="reset">Reset</button>
        </div>
      </div>

      <div v-if="current">
        <div class="ui labeled input fluid">
          <div class="ui label">{{ fromLabel }}</div>
          <input type="text" readonly :value="current[from]" />
        </div>

        <div class="ui labeled input fluid">
          <div class="ui label">{{ toLabel }}</div>
          <input type="text" v-model="answer" @keyup.enter="submit" placeholder="Type translation" />
        </div>

        <button class="positive ui button" @click="submit">Submit</button>
        <button class="ui button" @click="next">Next</button>
      </div>

      <div class="ui segment">
        <div>Score: {{ score }} / {{ attempts }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from '../helpers/helpers';

export default {
  name: 'test',
  data() {
    return {
      words: [],
      order: [],
      index: 0,
      current: null,
      from: 'english',
      to: 'german',
      answer: '',
      score: 0,
      attempts: 0
    };
  },
  computed: {
    fromLabel() {
      return this.capitalize(this.from);
    },
    toLabel() {
      return this.capitalize(this.to);
    }
  },
  watch: {
    from() {
      this.reset();
    },
    to() {
      this.reset();
    }
  },
  async mounted() {
    this.words = await api.getWords();
    this.reset();
  },
  methods: {
    capitalize(s) {
      return String(s || '').charAt(0).toUpperCase() + String(s || '').slice(1);
    },
    shuffle(a) {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
    reset() {
      const valid = this.words.filter(w => w[this.from] && w[this.to]);
      this.order = this.shuffle(valid.map(w => this.words.indexOf(w)));
      this.index = 0;
      this.score = 0;
      this.attempts = 0;
      this.answer = '';
      this.next();
    },
    next() {
      if (this.order.length === 0) {
        this.current = null;
        return;
      }
      if (this.index >= this.order.length) {
        this.index = 0;
        this.shuffle(this.order);
      }
      this.current = this.words[this.order[this.index]];
      this.index++;
      this.answer = '';
    },
    submit() {
      if (!this.current) return;
      const correct = String(this.current[this.to] || '').trim().toLowerCase();
      const given = String(this.answer || '').trim().toLowerCase();
      this.attempts++;
      if (given === correct) {
        this.score++;
        this.flash('Correct!', 'success');
        this.next();
      } else {
        this.flash(`Incorrect. Correct: ${this.current[this.to]}`, 'error');
      }
    }
  }
};
</script>

<style scoped>
.ui.form .fields .field { margin-right: 1em; } td.center.aligned .ui.button { margin: 0 !important; }
</style>
<style scoped>
#test td.center.aligned .ui.button { margin: 0 !important; }
</style>
