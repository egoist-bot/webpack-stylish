'use strict';

const plur = require('plur');

module.exports = {
  assets(stats) {
    const result = [];

    //   ['49.1 kB', 'main', './output.js', 'emitted'],

    for (const asset of stats.assets) {
      result.push([
        asset.size,
        asset.chunkNames.join(', '),
        asset.name,
        [asset.emitted ? 'emitted' : '']
      ]);
    }

    return result;
  },

  files(stats) {
    return [].concat(
      module.exports.header(),
      module.exports.modules(stats),
      [['', '', '', '']],
      module.exports.header('asset'),
      module.exports.assets(stats)
    );
  },

  header(type) {
    return [['size', 'name', type || 'module', 'status']];
  },

  hidden(stats) {
    const result = [];
    const assets = stats.filteredAssets;
    const modules = stats.filteredModules;

    if (assets > 0) {
      result.push(`${assets} ${plur('asset', assets)}`);
    }

    if (modules > 0) {
      result.push(`${modules} ${plur('module', modules)}`);
    }

    return result.length ? `(${result.join(', ')} hidden)` : '';
  },

  status(module) {
    const result = [];

    if (module.cacheable === false) {
      result.push('no-cache');
    }

    if (module.optional) {
      result.push('optional');
    }

    if (module.built) {
      result.push('built');
    }

    if (module.prefetched) {
      result.push('prefetch');
    }

    if (module.failed) {
      result.push('failed');
    }

    if (module.warnings) {
      result.push('warning');
    }

    if (module.errors) {
      result.push('error');
    }

    return result;
  },

  modules(stats) {
    const result = [];
    const { status } = module.exports;

    for (const module of stats.modules) {
      const row = [
        module.size,
        module.id,
        module.name || module.identifier,
        status(module)
      ];

      result.push(row);
    }

    return result;
  }
};
