import parseArabic from 'src/util/parseArabic'

export default ({ Vue }) => {
  Vue.prototype.$parseArabic = parseArabic
}
