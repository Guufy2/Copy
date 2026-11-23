import withNuxt from './.nuxt/eslint.config.mjs'
import prettier from 'eslint-config-prettier'

export default withNuxt(
  { ignores: ['design/**', 'node_modules/**', '.nuxt/**', '.output/**', '*.html', '*.css'] },
  prettier,
)
