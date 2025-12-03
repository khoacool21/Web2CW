<template>
  <div>
    <h1>New Word</h1>
    <word-form @createOrUpdate="createOrUpdate" :word="word"></word-form>
  </div>
</template>

<script>
import WordForm from '../components/WordForm.vue';
import { api } from '../helpers/helpers';

export default {
  name: 'new-word',
  components: {
    'word-form': WordForm
  },
  data() {
    return {
      word: { english: '', german: '', spanish: '' }
    };
  },
  methods: {
    createOrUpdate: async function(word) {
      const res = await api.createWord(word);
      this.flash('Word created', 'success');
      this.$router.push(`/words/${res._id}`);
    }
  }
};
</script>

<style scoped>
</style>
