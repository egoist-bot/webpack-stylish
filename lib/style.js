'use strict';

const chalk = require('chalk');
const prettyBytes = require('pretty-bytes');
const strip = require('strip-ansi');
const symbols = require('log-symbols');
const table = require('text-table');

module.exports = {
  files(rows, opts) {
    const max = opts.performance.maxAssetSize;
    const options = {
      align: ['', 'l', 'l', 'l', 'l'],
      stringLength(str) {
        return strip(str).length;
      }
    };

    rows = rows.map((row) => {
      row.unshift('');

      const [, size, name, file, status] = row;
      const filePath = file.substring(0, file.lastIndexOf('/') + 1);
      const namePath = name.substring(0, name.lastIndexOf('/') + 1);
      const sizeStyle = size > max ? chalk.yellow : chalk.green;

      if (size === 'size') {
        row = module.exports.header(row);
      } else if (name) {
        row[1] = sizeStyle(prettyBytes(size));
        row[2] = chalk.blue(name.replace(namePath, ''));
        row[3] = chalk.blue.dim(filePath) + file.replace(filePath, '');
        row[4] = module.exports.status(status);
      }

      return row;
    });

    return table(rows, options);
  },

  header(row) {
    return row.map(h => chalk.gray(h));
  },

  hidden(text) {
    return chalk.dim(text);
  },

  status(statuses) {
    return statuses.map((status) => {
      if (status === 'emitted' || status === 'built') {
        return chalk.green(status);
      } else if (status === 'error') {
        status = symbols.error;
      } else if (status === 'warning') {
        status = symbols.warning;
      } else if (status === 'optional' || status === 'no-cache') {
        return chalk.yellow(status);
      } else if (status === 'prefetch') {
        return chalk.cyan(status);
      }

      return status;
    });
  },

  time(ms) {
    const out = `${ms.toString()}ms`;
    const ubound = 1600;
    const lbound = 200;

    if (ms > ubound) {
      return chalk.bgRed(out);
    } else if (ms <= lbound) {
      return chalk.green.bold(out);
    }

    const styles = [chalk.red.bold, chalk.red, chalk.yellow, chalk.green];
    const values = [ubound, ubound / 2, lbound * 2, lbound];
    const closest = Math.max.apply(null, values.filter(v => v <= ms));
    const style = styles[values.indexOf(closest)];

    return style(out);
  }
};
