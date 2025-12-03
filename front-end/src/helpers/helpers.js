import axios from 'axios';
import Vue from 'vue';
import VueFlashMessage from 'vue-flash-message';
import 'vue-flash-message/dist/vue-flash-message.min.css';

Vue.use(VueFlashMessage, {
    messageOptions: {
        timeout: 5000,
        pauseOnInteract: true
    }
});

const vm = new Vue();
const baseURL = 'http://localhost:3000/words/';

const handleError = fn => async (...params) => {
    try {
        return await fn(...params);
    } catch (error) {
        let message = 'Unexpected error';
        if (error && error.response) {
            const data = error.response.data || {};
            const detail = data.error || data.message;
            message = detail ? `${detail}` : `Error: ${error.response.status}: ${error.response.statusText}`;
        } else if (error && error.request) {
            message = 'Network error: cannot reach API';
        } else if (error && error.message) {
            message = error.message;
        }
        vm.flash(message, 'error');
    }
};

export const api = {
    getWord: handleError(async id => {
        const res = await axios.get(baseURL + id);
        return res.data;
    }),
    getWords: handleError(async () => {
        const res = await axios.get(baseURL);
        return res.data;
    }),
    deleteWord: handleError(async id => {
        const res = await axios.delete(baseURL + id);
        return res.data;
    }),
    createWord: handleError(async payload => {
        const res = await axios.post(baseURL, payload);
        return res.data;
    }),
    updateWord: handleError(async payload => {
        const res = await axios.put(baseURL + payload._id, payload);
        return res.data;
    })
};
