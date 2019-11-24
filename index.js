const BLUEPRINT = getBlueprint();

function convert(lottie) {
  // lottie = isJson(lottie) ? JSON.parse(lottie) : lottie;
  let result = {};
  result["compData"] = generateCompData(lottie);
  result["name"] = lottie.nm;
  result["layers"] = convertLayers(lottie.layers);

  return result;
}

function getBlueprint() {
  return {
    LAYER: {
      ty: "Type",
      ks: "Transform",
      ind: "Index",
      cl: "Class",
      nm: "name",
      ef: "Effects",
      parent: "Parent",
      it: "Contents",
      xtras: {
        ao: "Auto-Orient",
        bm: "Blend Mode",
        ln: "Layer HTML ID",
        ip: "InPoint",
        st: "Start Time",
        hasMask: "hasMask",
        masksProperties: "maskProperties",
        sr: "Stretch"
      }
    },
    TRANSFORM: {
      o: "Opacity",
      p: "Position",
      a: "AnchorPoint",
      s: "Scale",
      r: "Rotation",
      xtras: {}
    },
    PROP: {
      k: "value",
      x: "expression",
      xtras: {}
    }
  };
}

function convertLayers(list) {
  let layerList = [];
  list.forEach((item, i) => {
    let layer = {};
    layer["name"] = item.nm;
    layer["Transform"] = convertTransform(item.ks, BLUEPRINT.TRANSFORM);
    layerList.push(layer);
  });
  return layerList;
}

function generateCompData(lottie) {
  return {
    version: lottie.v,
    frameRate: lottie.fr,
    width: lottie.w,
    height: lottie.h
  };
}

export default convert;

function convertLayer(propList, schema, reversed = false) {
  let funcs = {
    TRANSFORM: convertTransform
  };
  let result = {};
}

function convertTransform(propList, schema, reversed = false) {
  let result = {};
  Object.keys(propList).forEach((key, i) => {
    if (schema[key])
      result[schema[key]] = !reversed
        ? readablePropertyGroup(propList[key], BLUEPRINT.PROP)
        : readablePropertyGroup(propList[key], reversify(BLUEPRINT.PROP));
  });
  return result;
}

function reversify(schema) {
  let result = {};
  Object.keys(schema).forEach((key, i) => {
    result[schema[key]] = key;
  });
  return result;
}

function convertPropertyGroupProps(prop) {
  let result = {};
}

function readablePropertyGroup(propList, schema) {
  let result = {};
  Object.keys(propList).forEach((key, i) => {
    if (schema[key]) {
      result[schema[key]] = propList[key];
    }
  });
  return result;
}

// Determine if the current String is JSON notation
function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
