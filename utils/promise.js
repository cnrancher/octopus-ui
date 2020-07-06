import Queue from './queue';

export function allHash(hash) {
  const keys = Object.keys(hash);
  const promises = Object.values(hash);

  return Promise.all(promises).then((res) => {
    const out = {};

    for ( let i = 0 ; i < keys.length ; i++ ) {
      out[keys[i]] = res[i];
    }

    return out;
  });
}

export function allSettled(hash) {
  const keys = Object.keys(hash);
  const promises = Object.values(hash);

  return Promise.allSettled(promises).then((res) => {
    const out = {};

    for ( let i = 0 ; i < keys.length ; i++ ) {
      if (res[i].status === 'fulfilled') {
        out[keys[i]] = res[i].value;
      } else {
        out[keys[i]] = [];
      }
    }

    return out;
  });
}

export function eachLimit(items, limit, iterator, debug = false) {
  if (debug) {
    console.log('eachLimit of', items.length, ' items', limit, 'at a time'); // eslint-disable-line no-console
  }

  return new Promise((resolve, reject) => {
    const queue = new Queue();
    let pending = 0;
    let failed = false;
    const out = [];

    for (let i = 0; i < items.length; i++) {
      queue.enqueue({ item: items[i], idx: i });
    }

    process();

    function process() {
      if (debug) {
        console.log(`process, queue=${ queue.getLength() }, pending=${ pending }, failed=${ failed }`); // eslint-disable-line no-console
      }

      if (failed) {
        return;
      }

      if (queue.isEmpty() && pending === 0) {
        return resolve(out);
      }

      while (!queue.isEmpty() && pending < limit && !failed) {
        const { item, idx } = queue.dequeue();

        if (debug) {
          console.log('Running', item); // eslint-disable-line no-console
        }

        pending++;

        iterator(item, idx).then((res) => {
          if (debug) {
            console.log('Done', item); // eslint-disable-line no-console
          }

          out[idx] = res;

          pending--;
          process();
        }).catch((err) => {
          if (debug) {
            console.log('Failed', err, item); // eslint-disable-line no-console
          }

          failed = true;
          reject(err);
        });
      }
    }
  });
}
