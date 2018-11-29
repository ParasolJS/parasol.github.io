import { union } from 'lodash-es';
import as_float from '../util/as_float';

/**
 * Update data displayed in grid.
 * @param {array}  data:    array of objects.
 * @param {array} columns:  column definitions.
 **/
const gridUpdate = (config, ps, flags) =>
  function({ data = null, columns = null } = {}) {
    if (columns !== null) {
      config.grid.setColumns(columns);
      config.grid.render();
    }
    if (data === null) {
      data = config.selections();
      if (data.length === 0) {
        // if selections empty, use full dataset
        data = config.data;
      }
    }
    // if marked data exists, keep in grid
    if (config.marked.length) {
      data = union(data, config.marked);
    }

    const comparer = (a, b) => {
      const x = as_float(a['id']);
      const y = as_float(b['id']);
      return x == y ? 0 : x > y ? 1 : -1;
    };

    config.dataView.beginUpdate();
    config.dataView.setItems(data);
    config.dataView.sort(comparer, true);
    config.dataView.endUpdate();

    return this;
  };

export default gridUpdate;
