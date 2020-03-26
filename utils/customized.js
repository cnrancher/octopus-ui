// This file has 2 sections that control getting and using specializatinos of particular types
// over the generic info that is specified or generated from schemas.
//
// 1) Getting info about types
//
// singularLabelFor(schema)   Get the singular form of this schema's type
// pluralLabelFor(schema)     Get the plural form of this schema's type
// groupLabelFor(schema)      Get the label for the API group of this schema's type
// isIgnored(schema)          Returns true if this type should be hidden from the tree
// isBasic(schema)            Returns true if this type should be included in basic view
// typeWeightFor(type)        Get the weight value for a particular type label
// groupWeightFor(group)      Get the weight value for a particular group
// virtualTypes()             Returns a list of the virtual pages to add to the treee
// headersFor(schema)         Returns the column definitions for a type to give to SortableTable
//
// 2) Detecting and usign custom list/detail/edit/header components
//
// hasCustomList(type)        Does type have a custom list implementation?
// hasCustomDetail(type)      Does type have a custom detail implementation?
// hasCustomEdit(type)        Does type have a custom edit implementation?
// importList(type)           Returns a promise that resolves to the list component for type
// importDetail(type)         Returns a promise that resolves to the detail component for type
// importEdit(type)           Returns a promise that resolves to the edit component for type
//
// 3) Changing specialization info about a type
//
// virtualType(obj)           Add an item to the tree that goes to a route instead of an actual type.
//                            --  obj can contain anything in the objects getTree returns.
//                            --  obj must have a `name` that is unique among all virtual types.
//                            -- `cluster` is automatically added to route.params if it exists.
// basicType(type)            Mark type as one shown in basic view
// ignoreType(type)           Never show type
// weightType(                Set the weight (sorting) order of one or more types
//   typeOrArrayOfTypes,
//   weight                   -- Higher numbers are shown first/higher up on the nav tree
// )
// mapType(                   Remap a type id to a display name
//   matchRegexOrString,      -- Type to match, or regex that matches types
//   replacementStringOrFn,   -- String to replace the type with, or
//                            -- sync function: (type, capturedString, schemaObj => { return 'new-type'; }
//   mapWeight,               -- Priority for apply this mapping (higher numbers applied first)
//   continueOnMatch          -- If true, continue applying to hit other rules that might match the new type.
// )
// mapTypeToComponentName( Map matching types to a single component name (this is helpful if multiple types should be rendered by a single component)
// (
//   matchRegexOrString,      -- Type to match, or regex that matches types
//   replacementString        -- String to replace the type with
// )
// labelType(                 Remap the displayed label for a type
//   type,
//   singular,
//   plural
// )
//
// ignoreGroup(group):        Never show group or any types in it
// weightGroup(               Set the weight (sort) order of one or more groups
//   groupOrArrayOfGroups,    -- see weightType...
//   weight
// )
// mapGroup(                  Remap a group name to a display name
//   matchRegexOrString,      -- see mapType...
//   replacementString,
//   mapWeight,
//   continueOnMatch
// )

import { escapeRegex } from '@/utils/string';
import { isArray, findBy, addObject, removeObject } from '@/utils/array';
import { get } from '@/utils/object';

import { STATE, NAMESPACE_NAME, NAME, AGE } from '@/config/table-headers';

// ----------------------------------------------------------------------------
// 1 ) Getting info
// ----------------------------------------------------------------------------
// Turns a type name into a display label (e.g. management.cattle.io.v3.cluster -> Cluster)
export function singularLabelFor(schema) {
  return _applyMapping(schema, _typeMappings, 'id', _cache.typeLabel);
}

export function pluralLabelFor(schema) {
  if ( _pluralLabels[schema.id] ) {
    return _pluralLabels[schema.id];
  }

  const singular = singularLabelFor(schema);

  if ( singular.endsWith('s') ) {
    return `${ singular }es`;
  }

  return `${ singular }s`;
}

// Turns a group name into a display label (e.g. management.cattle.io.v3.cluster -> Cluster)
export function groupLabelFor(schema) {
  return _applyMapping(schema, _groupMappings, 'attributes.group', _cache.groupLabel);
}

export function isIgnored(schema) {
  if ( typeof _cache.ignore[schema.id] === 'undefined' ) {
    let ignore = false;

    for ( const rule of _groupIgnore ) {
      if ( schema.attributes.group.match(rule) ) {
        ignore = true;
        break;
      }
    }

    if ( !ignore ) {
      for ( const rule of _typeIgnore ) {
        if ( schema.id.match(rule) ) {
          ignore = true;
          break;
        }
      }
    }

    _cache.ignore[schema.id] = ignore;
  }

  return _cache.ignore[schema.id];
}

export function isBasic(schema) {
  return _basicTypes[schema.id] || false;
}

export function typeWeightFor(type) {
  return _typeWeights[type.toLowerCase()] || 0;
}

export function groupWeightFor(group) {
  return _groupWeights[group.toLowerCase()] || 0;
}

export function virtualTypes() {
  return _virtualTypes.slice();
}

export function headersFor(schema) {
  if ( _headers[schema.id] ) {
    return _headers[schema.id];
  }

  const out = [STATE]; // Everybody gets a state

  const attributes = schema.attributes || {};
  const columns = attributes.columns;
  const namespaced = attributes.namespaced;

  let hasName = false;

  for ( const col of columns ) {
    if ( col.format === 'name' ) {
      hasName = true;
      out.push(namespaced ? NAMESPACE_NAME : NAME);
    } else {
      let formatter, width;

      if ( col.format === '' && col.name === 'Age' ) {
        out.push(AGE);
        continue;
      }

      if ( col.format === 'date' || col.type === 'date' ) {
        formatter = 'Date';
        width = 120;
      }

      out.push({
        name:  col.name.toLowerCase(),
        label: col.name,
        value: col.field.startsWith('.') ? `$${ col.field }` : col.field,
        sort:  [col.field],
        formatter,
        width,
      });
    }
  }

  if ( !hasName ) {
    out.unshift(namespaced ? NAMESPACE_NAME : NAME);
  }

  // Age always goes last
  if ( out.includes(AGE) ) {
    removeObject(out, AGE);
    out.push(AGE);
  }

  return out;
}

// ------------------------------------
// Custom list/detail/edit/header component detection
//
// Note: you can't refactor these into one function that does `@/${kind}/${type}`,
// because babel needs some hardcoded idea where to look for the dependency.
// ------------------------------------
export function hasCustomList(rawType) {
  const type = _normalizeType(rawType);
  const cache = _cache.list;

  if ( cache[type] !== undefined ) {
    return cache[type];
  }

  try {
    require.resolve(`@/list/${ type }`);
    cache[type] = true;

    return true;
  } catch (e) {
    cache[type] = false;

    return false;
  }
}

export function hasCustomDetail(rawType) {
  const type = _normalizeType(rawType);
  const cache = _cache.detail;

  if ( cache[type] !== undefined ) {
    return cache[type];
  }

  try {
    require.resolve(`@/detail/${ type }`);
    cache[type] = true;

    return true;
  } catch (e) {
    cache[type] = false;

    return false;
  }
}

export function hasCustomEdit(rawType) {
  const type = _normalizeType(rawType);
  const cache = _cache.edit;

  if ( cache[type] !== undefined ) {
    return cache[type];
  }

  try {
    require.resolve(`@/edit/${ type }`);
    cache[type] = true;

    return true;
  } catch (e) {
    cache[type] = false;

    return false;
  }
}

export function importList(rawType) {
  const type = _normalizeType(rawType);

  return () => import(`@/list/${ type }`);
}

export function importDetail(rawType) {
  const type = _normalizeType(rawType);

  return () => import(`@/detail/${ type }`);
}

export function importEdit(rawType) {
  const type = _normalizeType(rawType);

  return () => import(`@/edit/${ type }`);
}

// ----------------------------------------------------------------------------
// 3) Changing info
// ----------------------------------------------------------------------------
export function virtualType(obj) {
  if ( !findBy(_virtualTypes, 'name', obj.name) ) {
    addObject(_virtualTypes, obj);
  }
}

export function basicType(types) {
  if ( !isArray(types) ) {
    types = [types];
  }

  for ( const t of types ) {
    _basicTypes[t] = true;
  }
}

export function ignoreGroup(match) {
  if ( typeof match === 'string' ) {
    match = new RegExp(`^${ escapeRegex(match) }$`, 'i');
  }

  _groupIgnore.push(match);
}

export function ignoreType(match) {
  if ( typeof match === 'string' ) {
    match = new RegExp(`^${ escapeRegex(match) }$`, 'i');
  }

  _typeIgnore.push(match);
}

export function headers(type, headers) {
  _headers[type] = headers;
}

// setGroupWeight('core' 99); -- higher groups are shown first
// These operate on *displayed* group names, after mapping
export function weightGroup(groupOrGroups, weight) {
  if ( !isArray(groupOrGroups) ) {
    groupOrGroups = [groupOrGroups];
  }

  for ( const g of groupOrGroups ) {
    _groupWeights[g.toLowerCase()] = weight;
  }
}

// setTypeWeight('Cluster' 99); -- higher groups are shown first
// These operate on *displayed* type names, after mapping
export function weightType(typeOrTypes, weight) {
  if ( !isArray(typeOrTypes) ) {
    typeOrTypes = [typeOrTypes];
  }

  for ( const e of typeOrTypes ) {
    _typeWeights[e.toLowerCase()] = weight;
  }
}

// addGroupMapping('ugly.thing', 'Nice Thing', 1);
// addGroupMapping(/ugly.thing.(stuff)', '$1', 2);
// addGroupMapping(/ugly.thing.(stuff)', function(groupStr, ruleObj, regexMatch, typeObj) { return ucFirst(group.id) } , 2);
export function mapGroup(match, replace, weight = 5, continueOnMatch = false) {
  _addMapping(_groupMappings, match, replace, weight, continueOnMatch);
}

export function mapType(match, replace, weight = 5, continueOnMatch = false) {
  _addMapping(_typeMappings, match, replace, weight, continueOnMatch);
}

export function mapTypeToComponentName(match, replace, weight = 5, continueOnMatch = false) {
  _typeToComponentMappings.push({ match, replace });
}

export function pluralizeType(type, plural) {
  _pluralLabels[type] = plural;
}

// ----------------------------------------------------------------------------
// 4) Internals
// ----------------------------------------------------------------------------
const _virtualTypes = [];
const _basicTypes = {};
const _groupIgnore = [];
const _groupWeights = {};
const _groupMappings = [];
const _typeIgnore = [];
const _typeWeights = {};
const _typeMappings = [];
const _typeToComponentMappings = [];
const _pluralLabels = {};
const _headers = {};
const _cache = {
  typeLabel:  {},
  groupLabel: {},
  ignore:     {},
  list:       {},
  detail:     {},
  edit:       {},
};

function _applyMapping(obj, mappings, keyField, cache) {
  if ( typeof obj !== 'object' ) {
    return obj;
  }

  const key = get(obj, keyField);

  if ( typeof key !== 'string' ) {
    return null;
  }

  if ( cache[key] ) {
    return cache[key];
  }

  let out = `${ key }`;

  for ( const rule of mappings ) {
    const captured = out.match(rule.match);

    if ( captured && rule.replace ) {
      if ( typeof rule.replace === 'function' ) {
        out = rule['replace'](out, captured, obj);
      } else {
        out = out.replace(rule.match, rule.replace);
      }

      if ( !rule.continueOnMatch ) {
        break;
      }
    }
  }

  cache[key] = out;

  return out;
}

function _normalizeType(type) {
  const mapping = _typeToComponentMappings.find(mapping => mapping.match.test(type));

  return mapping ? mapping.replace : type;
}

// --------------------------------------------

function _addMapping(mappings, match, replace, weight, continueOnMatch) {
  if ( typeof match === 'string' ) {
    match = new RegExp(`^${ escapeRegex(match) }$`, 'i');
  }

  mappings.push({
    match,
    replace,
    weight,
    continueOnMatch,
    insertIndex: mappings.length,
  });

  // Re-sort the list by weight (highest first) and insert time (oldest first)
  mappings.sort((a, b) => {
    const pri = b.weight - a.weight;

    if ( pri ) {
      return pri;
    }

    return a.insertIndex - b.insertIndex;
  });
}
