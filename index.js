'use strict';

const chalk = require('chalk');
const webpack = require('webpack');
const parse = require('./lib/parse');
const style = require('./lib/style');
const config = require('./test/fixture/webpack.config.js');

const { log } = console;

const compiler = webpack(config);

compiler.run((err, stats) => {
  const opts = {
    context: '/Users/powella/code/webpack-stylish/test/fixture',
    cached: false,
    cachedAssets: false,
    exclude: ['node_modules', 'bower_components', 'components']
  };

  // TODO: test multi compiler

  const json = stats.toJson(opts, true);

  // errors and warnings go first, to make sure the counts are correct for
  // modules
  const problems = style.problems(parse.problems(json));

  const files = style.files(parse.files(json), compiler.options);
  const hidden = style.hidden(parse.hidden(json));
  const time = style.time(json.time);

  const { hash, version } = json;

  log(chalk`
{cyan webpack v${version}}

{underline ${hash}}
${files}

  {gray Δ{italic t}} ${time} ${hidden}

${problems}
  `);
});
