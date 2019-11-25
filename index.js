// The master schema used to determine proper name equivalents of Lottie's minified keys
const BLUEPRINT = {
  COMP: {
    v: "version",
    fr: "frameRate",
    w: "width",
    h: "height",
    extra: {
      ip: "inPoint",
      op: "outPoint",
      ddd: "3D Layer",
      assets: "assets"
    }
  },
  LAYER: {
    ty: "Type",
    ks: "Transform",
    ind: "Index",
    cl: "Class",
    nm: "name",
    ef: "Effects",
    parent: "Parent",
    it: "Contents",
    markers: "markers",
    extra: {
      t: "Text Data",
      ao: "Auto-Orient",
      bm: "Blend Mode",
      ln: "Layer HTML ID",
      ip: "InPoint",
      st: "Start Time",
      hasMask: "hasMask",
      masksProperties: "maskProperties",
      sr: "Stretch",
      refId: "Reference ID",
      tm: "Time Remapping"
    }
  },
  TRANSFORM: {
    childRef: "PROP",
    o: "Opacity",
    p: "Position",
    a: "AnchorPoint",
    s: "Scale",
    r: "Rotation",
    extra: {
      px: "PositionX",
      py: "PositionY",
      pz: "PositionZ",
      sk: "Skew",
      sa: "Skew Axis"
    }
  },
  PROP: {
    k: "value",
    x: "expression",
    extra: {
      ix: "Property Index",
      a: "Animated"
    }
  }
};

/**
 * Creates a deep remap of a Lottie file
 *
 * @param {object} lottie         The JSON of or parsed Lottie instance.
 * @param {boolean} includeExtra  If false, skip lottie-specific values and provide bare minimum AE equivalent
 *
 * @return a new Lottie-Readable [OBJECT].
 */
function convert(lottie, includeExtra = false) {
  lottie = isJson(lottie) ? JSON.parse(lottie) : lottie;
  let result = {};
  result["compData"] = generateCompData(lottie);
  result["name"] = lottie.nm;
  result["layers"] = convertLayers(lottie.layers, includeExtra);
  return result;
}

/**
 * Creates a deep remap of lottie's native layer prop according to BLUEPRINT
 *
 * @param {array} list            Layer objects to remap.
 * @param {boolean} includeExtra  if false, skip lottie-specific values and provide bare minimum AE equivalent
 *
 * @return {array} A new remapped Layer object with human-readable key/values.
 */
function convertLayers(list, includeExtra) {
  let layerList = [];
  list.forEach((item, i) => {
    let layer = {};
    layer["name"] = item.nm;
    Object.keys(BLUEPRINT.LAYER).forEach((key, i) => {
      if (item[key] && BLUEPRINT[BLUEPRINT.LAYER[key].toUpperCase()]) {
        // If this needs deep remapping and a BLUEPRINT exists for target key
        layer[BLUEPRINT.LAYER[key]] = convertPropertyGroup(
          item[key],
          BLUEPRINT[BLUEPRINT.LAYER[key].toUpperCase()],
          includeExtra,
          BLUEPRINT[BLUEPRINT.LAYER[key].toUpperCase()].childRef
        );
      } else {
        // This needs shallow remapping
      }
    });
    layerList.push(layer);
  });
  return layerList;
}

/**
 * Creates a deep remap of lottie's native property group according to BLUEPRINT
 *
 * @param {array}   propList      The list of Lottie properties to remap.
 * @param {object}  schema        The BLUEPRINT[key] used to map the parent object
 * @param {boolean} includeExtra  If false, skip lottie-specific values and provide bare minimum AE equivalent
 * @param {string}  childRef      The key to root BLUEPRINT used to map children
 * @param {boolean} reversed      If false, convert from Lottie > Lottie-Readable, else otherwise if true
 *
 * @return {object} A new remapped PropGroup object with human-readable key/values.
 */
function convertPropertyGroup(
  propList,
  schema,
  includeExtra,
  childRef,
  reversed = false
) {
  let result = {};
  if (includeExtra) result["extra"] = {};
  Object.keys(propList).forEach((key, i) => {
    if (schema[key])
      result[schema[key]] = !reversed
        ? readablePropertyGroup(
            propList[key],
            BLUEPRINT[childRef],
            includeExtra
          )
        : readablePropertyGroup(
            propList[key],
            reversify(BLUEPRINT[childRef]),
            includeExtra
          );
  });
  return result;
}

/**
 * Switches the key/values of a given object to allow for two-way mapping
 *
 * @param {object}  schema        The BLUEPRINT[key] schema object to reverse.
 * @param {boolean} includeExtra  If false, skip lottie-specific values and provide bare minimum AE equivalent
 *
 * @return {object} A new remapped object with reversed key/values.
 */
function reversify(schema, includeExtra) {
  let result = {};
  if (includeExtra) result["extra"] = {};
  Object.keys(schema).forEach((key, i) => {
    result[schema[key]] = key;
  });
  return result;
}

/**
 * Remaps the children of a property group according to BLUEPRINT
 *
 * @param {array}   propList      The list of Lottie properties to remap.
 * @param {object}  schema        The BLUEPRINT[key] used to map this object
 * @param {boolean} includeExtra  If false, skip lottie-specific values and provide bare minimum AE equivalent
 *
 * @return {object} A new remapped PropGroup object with human-readable key/values.
 */
function readablePropertyGroup(propList, schema, includeExtra) {
  let result = {};
  if (includeExtra) result["extra"] = {};
  Object.keys(propList).forEach((key, i) => {
    if (schema[key]) {
      result[schema[key]] = propList[key];
    } else if (includeExtra) {
      result.extra[schema.extra[key]] = propList[key];
    }
  });
  return result;
}

/**
 * Determines if the Lottie file is a JSON or native JS object
 *
 * @param {(string|object)} data  The Lottie instance, either as JSON or JS object.
 *
 * @return {object} A native JS object of the Lottie instance.
 */
function isJson(data) {
  try {
    JSON.parse(data);
  } catch (e) {
    return false;
  }
  return true;
}

function generateCompData(lottie) {
  return {
    version: lottie.v,
    frameRate: lottie.fr,
    width: lottie.w,
    height: lottie.h
  };
}

function convertLayer(propList, schema, reversed = false) {
  let funcs = {
    TRANSFORM: convertTransform
  };
  let result = {};
}

export default convert;
