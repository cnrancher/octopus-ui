import VueRouter from 'vue-router';

const _resolve = VueRouter.prototype.resolve;

// Resolve returns URLs that include the base URL, which then gets added again
// by router.replace or router.push.  So don't do that.
VueRouter.prototype.resolve = function() {
  const out = _resolve.apply(this, arguments);

  if ( this.options.base ) {
    out.href = out.href.substr(this.options.base.length).replace(/^\/*/, '/');
  }

  return out;
};

VueRouter.prototype.applyQuery = function(qp, defaults = {}) {
  const query = queryParamsFor(this.currentRoute.query, qp, defaults);

  this.replace({ query });
};

export function queryParamsFor(current, qp, defaults = {}) {
  const query = Object.assign({}, current || {});

  for ( const key of Object.keys(qp) ) {
    const val = qp[key];

    if ( typeof defaults[key] === 'undefined' ) {
      // There is no default
      query[key] = qp[key];
    } else if ( defaults[key] === false ) {
      // Value-less boolean flags
      if ( val ) {
        query[key] = null;
      } else {
        delete query[key];
      }
    } else if ( val === defaults[key] ) {
      // The value is the default
      delete query[key];
    } else {
      // The value is not the default
      query[key] = val;
    }
  }

  return query;
}
