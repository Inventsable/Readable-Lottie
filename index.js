/*
    ||  TODO  ||
    - Treat each assets entry as it's own comp. Call convert() on each entry if possible
    - Test deeply nested recursion for all layer types and properties
    - Clean up BLUEPRINT
    - Ensure support for extra values
    - Test reversal process, write in reversals for rearrangments like nested Transform
    - Test all layer types, precomps, deeply nested groups/layers
    - Add dynamic "path" attribute to all propGroups for their direct Lottie path
*/

// The master schema used to determine proper name equivalents of Lottie's minified keys
const BLUEPRINT = {
  COMP: {
    nm: "name",
    v: "lottieVersion",
    w: "width",
    h: "height",
    fr: "frameRate",
    ip: "firstFrame",
    op: "lastFrame",
    assets: "assets",
    extra: {
      ddd: "3DLayer"
    }
  },
  LAYER: {
    ty: "type",
    shapes: "Contents",
    ks: "Transform",
    ind: "index",
    cl: "class",
    nm: "name",
    ef: "effects",
    parent: "parent",
    it: "content",
    markers: "markers",
    extra: {
      t: "textData",
      ao: "autoOrient",
      bm: "blendMode",
      ln: "layerID",
      ip: "inPoint",
      st: "startTime",
      hasMask: "hasMask",
      masksProperties: "maskProperties",
      sr: "stretch",
      refId: "referenceID",
      tm: "timeRemapping"
    }
  },
  CONTENTS: {
    childRef: "CONTENTS",
    ty: "type",
    it: "children",
    ks: "Transform",
    nm: "name",
    np: "numProps",
    cix: "propertyIndexAlt",
    ix: "propertyIndex",
    bm: "blendMode",
    mn: "matchName",
    c: "color",
    o: "opacity",
    hd: "hidden",
    k: "value",
    x: "expression",
    ix: "propIndex",
    extra: {
      _render: "renderFlag",
      a: "animated"
    }
  },
  TRANSFORM: {
    childRef: "PROP",
    o: "opacity",
    p: "position",
    a: "anchorPoint",
    s: "scale",
    r: "rotation",
    extra: {
      px: "positionX",
      py: "positionY",
      pz: "positionZ",
      sk: "skew",
      sa: "skewAxis"
    }
  },
  KEYFRAME: {
    k: "propValue",
    x: "propExpression",
    ix: "propIndex",
    a: "animated",
    to: "inTangent",
    ti: "outTangent",
    s: "startValue",
    t: "startTime",
    i: "bezierIn",
    o: "bezierOut",
    x: "bezierX",
    y: "bezierY"
  },
  PROP: {
    k: "value",
    x: "expression",
    extra: {
      ix: "propertyIndex",
      a: "animated"
    }
  }
};

/**
 * Creates a deep remap of a Lottie file
 *
 * @param {object} lottie         The JSON of or parsed Lottie instance.
 * @param {boolean} includeExtra  If false, skip lottie-specific values and provide bare minimum AE equivalent
 *
 * @return {object} a new Readable-Lottie instance.
 */
function convert(lottie, includeExtra = false) {
  // Ensure lottie is parsed
  lottie = isJson(lottie) ? JSON.parse(lottie) : lottie;
  let result = {};

  // Assign top-level comp data
  Object.keys(BLUEPRINT.COMP).forEach(key => {
    result[BLUEPRINT.COMP[key]] = lottie[key];
  });
  result["duration"] = `${((lottie.op - 1) / lottie.fr)
    .toFixed(2)
    .replace(/\.\d*/, "")}:${(lottie.op - 1) % lottie.fr}`;
  // Begin layer chaining, which will trigger other nested remapping to occur
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
      // If this needs deep remapping and a BLUEPRINT exists for target key
      if (item[key] && BLUEPRINT[BLUEPRINT.LAYER[key].toUpperCase()]) {
        // Divert it's contents to convertPropertyGroup()
        layer[BLUEPRINT.LAYER[key]] = convertPropertyGroup(
          item[key],
          BLUEPRINT[BLUEPRINT.LAYER[key].toUpperCase()],
          includeExtra,
          BLUEPRINT[BLUEPRINT.LAYER[key].toUpperCase()].childRef
        );
      } else {
        // TODO
        // This needs shallow remapping, and currently skips things like [markers].
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
 * @param {boolean} reversed      If false, convert from Lottie > Readable-Lottie, else otherwise if true
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
  // If this is an Array of objects instead of an object, recurse this function until objects are met
  if (typeof propList === "object" && propList instanceof Array) {
    propList.forEach((propGroup, i) => {
      // Transcribe each propGroup entry to be readable
      let child = readablePropertyGroup(
        propGroup,
        BLUEPRINT[childRef],
        includeExtra
      );
      // Determine if propGroup needs rearranging, in instance of having Transform or Contents
      if (propGroup.it) {
        let transformProp = propGroup.it.find(obj => {
          return obj.ty == "tr";
        });
        // If this has a Transform child, remove it and place it as an attribute of the parent
        if (transformProp) {
          propGroup.it = propGroup.it.filter(item => {
            return item.ty !== "tr";
          });
          child["Transform"] = convertPropertyGroup(
            transformProp,
            BLUEPRINT.TRANSFORM,
            includeExtra,
            BLUEPRINT.TRANSFORM.childRef,
            reversed
          );
        }
        // Otherwise call this same function on any children
        child.children = convertPropertyGroup(
          propGroup.it,
          schema,
          includeExtra,
          childRef,
          reversed
        );
      }
      result[propGroup.nm] = child;
    });
  } else {
    // If this isn't an Array, transcribe it normally according to BLUEPRINT
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
  }
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

  // If this is an array of propGroups, specifically from a 'value' parent for keyframes
  if (typeof propList === "object" && propList instanceof Array) {
    propList.forEach((propGroup, num) => {
      // And this value is an object with keys
      if (typeof propGroup === "object" && Object.keys(propGroup).length) {
        // Transcribe the Readable key/values
        Object.keys(propGroup).forEach((key, i) => {
          if (schema[key]) {
            result[schema[key]] =
              key == "ty"
                ? decodeType(propGroup[key], includeExtra)
                : propGroup[key];
          } else if (includeExtra) {
            result.extra[schema.extra[key]] = propGroup[key];
          }
        });
      } else {
        console.log(`Near a keyframe but not matching:`);
        console.log(propGroup);
      }
    });
  } else {
    // Otherwise if this is a normal propList, and nesting is likely taken care of by parent function,
    // Assign readable values to this tier only
    //
    Object.keys(propList).forEach((key, i) => {
      if (schema[key]) {
        result[schema[key]] =
          key == "ty" ? decodeType(propList[key], includeExtra) : propList[key];

        // However this may still need a fallback in case it has nested contents the parent function doesn't catch
        if (
          typeof propList[key] === "object" &&
          !(result["value"] instanceof Array) &&
          schema[key] !== "children"
        ) {
          //
          // This may be a Fill's color or opacity prop, call the function again if it isn't a children collection
          result[schema[key]] = readablePropertyGroup(
            propList[key],
            schema,
            includeExtra
          );
          // If it happens to be a color, replace AE's RGB format with web-friendly hex value
          if (schema[key] == "color") {
            result.color.value = rgbaToHex(result.color.value);
          }
        }
      } else if (includeExtra) {
        result.extra[schema.extra[key]] = propList[key];
      }
    });
  }
  // If this normal Readable prop is a 'value' and could have keyframes, call this function again on it's contents
  if (
    result["value"] &&
    typeof result["value"] === "object" &&
    result["value"] instanceof Array
  ) {
    // If this is an Array, but of objects rather than numeric values (as in [x,y,z] values), we know it's a keyframe
    let isKeyframe =
      result["value"].filter(val => {
        return typeof val === "object";
      }).length > 0;
    if (isKeyframe) {
      result["value"] = readablePropertyGroup(
        result.value,
        BLUEPRINT.KEYFRAME,
        includeExtra
      );
    }
  }
  return result;
}

/**
 * Converts an After Effects RGB color array to hexadecimal format
 *
 * @param {array} val          The array of floating values (eg. from shapes.c.k, like below:
 *                                      [ 0.525490224361, 0.262745112181, 0.262745112181, 1 ]
 * @param {boolean} hashed     If false, don't prepend # to result
 * @return {string} .
 */
function rgbaToHex(val, hashed = true) {
  while (val.length > 3) val.pop();
  return `${hashed ? "#" : ""}${val
    .map(c => {
      return (c * 255).toFixed(0);
    })
    .map(c => {
      c = c < 256 ? Math.abs(c).toString(16) : 0;
      return c.length < 2 ? `0${c}` : c;
    })
    .join("")}`;
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

// TODO
// Additional support for things like gradient strokes, get a final list of these values
// Can't seem to find this in the JSON schema. Ask hernan about this directly?
function decodeType(str, includeExtra = false, reversed = false) {
  let types = {
    0: "PrecompLayer",
    1: "SolidLayer",
    2: "ImageLayer",
    3: "NullLayer",
    4: "ShapeLayer",
    5: "TextLayer",
    gr: "Group",
    sh: "Shape",
    fl: "Fill",
    st: "Stroke",
    tr: "Transform",
    rc: "Rectangle",
    el: "Ellipse"
  };
  let match = null;
  let typeList = reversed ? reversify(types, includeExtra) : types;
  Object.keys(typeList).forEach(type => {
    if (str == type) match = typeList[type];
  });
  return match;
}

export default convert;
