<template>
    <div>
        <h1>Words</h1>
        <table id="words" class="ui celled compact table">
            <thead>
                <tr>
                    <th><i class="united kingdom flag"></i> English</th>
                    <th><i class="germany flag"></i> German</th>
                    <th><i class="spain flag"></i> Spanish</th>
                    <th colspan="3"></th>
                </tr>
            </thead>

            <tr v-for="(word, i) in words" :key="i">
                <td>{{ word.english }}</td>
                <td>{{ word.german }}</td>
                <td>{{ word.spanish }}</td>
                <td width="75" class="center aligned">
                <router-link class="ui blue mini button" :to="{ name: 'show', params: { id: word._id } }">Show</router-link></td>
                <td width="75" class="center aligned">
                <router-link class="ui teal mini button" :to="{ name: 'edit', params: { id: word._id } }">Edit</router-link></td>
                <td width="75" class="center aligned">
                  <button class="ui red mini button" @click.prevent="onDestroy(word._id)">Destroy</button>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
import { api } from '../helpers/helpers';

export default {
    name: 'words',

    data() {
        return {
            words: []
        }
    },

    methods: {
        async onDestroy(id) {
            const sure = window.confirm('Are you sure you want to destroy this word?');
            if (sure) {
                await api.deleteWord(id);
                this.flash('Word deleted successfully!', 'success');
                this.words = this.words.filter(word => word._id !== id);
            }
        }
    },

    async mounted() {
        this.words = await api.getWords();
    }
}
</script>
<style scoped>
#words td.center.aligned .ui.button { margin: 0 !important; }
</style>
