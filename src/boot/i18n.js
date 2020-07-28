import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from 'src/i18n'
import { Quasar } from 'quasar'

Vue.use(VueI18n)
const locale = localStorage.getItem('language')

const i18n = new VueI18n({
    fallbackLocale: 'en-us',
    locale,
    messages
})
if (locale == "en-us") {
    import( /* webpackInclude: /(en-us)\.js$/ */ "quasar/lang/en-us").then(
        (lang) => {
            Quasar.lang.set(lang.default);
        }
    );
} else {
    import( /* webpackInclude: /(ar)\.js$/ */ "quasar/lang/ar").then(
        (lang) => {
            Quasar.lang.set(lang.default);
        }
    );
}

export default ({ app }) => {
    // Set i18n instance on app
    app.i18n = i18n
}

export { i18n }
