module.exports = {
  hooks: {
    'commit-msg': 'commitlint --format -E HUSKY_GIT_PARAMS',
    'pre-commit': 'lint-staged',
    'pre-push': 'lint-fix'
  }
}