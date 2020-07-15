import IntlMessageFormat from 'intl-messageformat';
import { LOCALE } from '@/config/cookies';
import { get } from '@/utils/object';
import zh from '@/assets/translations/zh-hans.yaml';

const translationContext = require.context('@/assets/translations', true, /.*/);

const NONE = 'none';

// Formatters can't be serialized into state
const intlCache = {};

export const state = function() {
  const available = translationContext.keys().map(path => path.replace(/^.*\/([^\/]+)\.[^.]+$/, '$1'));

  const out = {
    default:      'zh-hans',
    selected:     null,
    previous:     null,
    available,
    translations: { 'zh-hans': zh },
  };

  return out;
};

export const getters = {
  selectedLocaleLabel(state) {
    const key = `locale.${ state.selected }`;

    if ( state.selected === NONE ) {
      return `%${ key }%`;
    } else {
      return get(state.translations[state.default], key);
    }
  },

  availableLocales(state, getters) {
    const out = {};

    for ( const locale of state.available ) {
      const key = `locale.${ locale }`;

      if ( state.selected === NONE ) {
        out[locale] = `%${ key }%`;
      } else {
        out[locale] = get(state.translations[state.default], key);
      }
    }

    return out;
  },

  t: state => (key, args) => {
    if (state.selected === NONE ) {
      return `%${ key }%`;
    }

    const cacheKey = `${ state.selected }/${ key }`;
    let formatter = intlCache[cacheKey];

    if ( !formatter ) {
      let msg = get(state.translations[state.selected], key);

      if ( !msg ) {
        msg = get(state.translations[state.default], key);
      }

      if ( !msg ) {
        return undefined;
      }

      if ( msg.includes('{') ) {
        formatter = new IntlMessageFormat(msg, state.selected);
      } else {
        formatter = msg;
      }

      intlCache[cacheKey] = formatter;
    }

    if ( typeof formatter === 'string' ) {
      return formatter;
    } else if ( formatter && formatter.format ) {
      return formatter.format(args);
    } else {
      return '?';
    }
  },

  exists: state => (key, args) => {
    const cacheKey = `${ state.selected }/${ key }`;

    if ( intlCache[cacheKey] ) {
      return true;
    }

    let msg = get(state.translations[state.default], key);

    if ( !msg && state.selected && state.selected !== NONE ) {
      msg = get(state.translations[state.selected], key);
    }

    if ( msg ) {
      return true;
    }

    return false;
  },
};

export const mutations = {
  loadTranslations(state, { locale, translations }) {
    state.translations[locale] = translations;
  },

  setSelected(state, locale) {
    state.selected = 'zh-hans';
  },
};

export const actions = {
  init({ state, commit, dispatch }) {
    let selected = this.$cookies.get(LOCALE, { parseJSON: false });

    if ( !selected ) {
      selected = state.default;
    }

    return dispatch('switchTo', selected);
  },

  async load({ commit }, locale) {
    const translations = await translationContext(`./${ locale }.yaml`);

    commit('loadTranslations', { locale, translations });

    return true;
  },

  async switchTo({ state, commit, dispatch }, locale) {
    if ( locale === NONE ) {
      commit('setSelected', locale);

      // Don't remember into cookie
      return;
    }

    if ( !state.translations[locale] ) {
      try {
        await dispatch('load', locale);
      } catch (e) {
        if ( locale !== 'zh-hans' ) {
          // Try to show something...

          commit('setSelected', 'zh-hans');

          return;
        }
      }
    }

    commit('setSelected', locale);
    this.$cookies.set(LOCALE, locale, {
      encode: x => x,
      maxAge: 86400 * 365,
      secure: true,
      path:   '/',
    });
  },

  toggleNone({ state, dispatch }) {
    if ( state.selected === NONE ) {
      return dispatch('switchTo', state.previous || state.default);
    } else {
      return dispatch('switchTo', NONE);
    }
  }
};
