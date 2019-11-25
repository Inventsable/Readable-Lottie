# readable-lottie

Convert a Lottie file to a dev-friendly, near 1:1 parallel of an After Effects file.

## Usage

```bash
# coming soon
```

## Goals

- Convert any Lottie file to a more verbose, easier to debug, and human-readable version
- Allow conversion from Lottie => Readable-Lottie and Readable-Lottie => Lottie
- Create a library of methods for crawling through or modifying a Readable-Lottie file, similar to the After Effects Scripting API.
- Generate `lottiePath` string for every readable prop/attribute, so devs can know the direct route to access any readable prop within the original Lottie file
- Use Readable-Lottie as the foundation of browser Lottie file editors
- Use Readable-Lottie as the foundation for a Reverse-Lottie panel, allowing you to drag and drop a Lottie file and construct it from scratch at the click of a button in After Effects

## Example

A basic Lottie file with a single group, 3 shapes, and 3 keyframes is very esoteric and hard to understand:

```json
{
  "v": "5.5.9",
  "fr": 30,
  "ip": 0,
  "op": 41,
  "w": 960,
  "h": 560,
  "nm": "Comp 2",
  "ddd": 0,
  "assets": [],
  "layers": [
    {
      "ddd": 0,
      "ind": 1,
      "ty": 4,
      "nm": "groupTest",
      "sr": 1,
      "ks": {
        "o": {
          "a": 0,
          "k": 100,
          "ix": 11
        },
        "r": {
          "a": 0,
          "k": 0,
          "ix": 10
        },
        "p": {
          "a": 1,
          "k": [
            {
              "i": {
                "x": 0.833,
                "y": 0.833
              },
              "o": {
                "x": 0.167,
                "y": 0.167
              },
              "t": 0,
              "s": [300, 219, 0],
              "to": null,
              "ti": null
            },
            {
              "i": {
                "x": 0.833,
                "y": 0.833
              },
              "o": {
                "x": 0.167,
                "y": 0.167
              },
              "t": 20,
              "s": [300, 115, 0],
              "to": null,
              "ti": null
            },
            {
              "t": 40,
              "s": [300, 219, 0]
            }
          ],
          "ix": 2
        },
        "a": {
          "a": 0,
          "k": [86, -182, 0],
          "ix": 1
        },
        "s": {
          "a": 0,
          "k": [100, 100, 100],
          "ix": 6
        }
      },
      "ao": 0,
      "shapes": [
        {
          "ty": "gr",
          "it": [
            {
              "ty": "rc",
              "d": 1,
              "s": {
                "a": 0,
                "k": [23.531, 23.531],
                "ix": 2
              },
              "p": {
                "a": 0,
                "k": [86, -182],
                "ix": 3
              },
              "r": {
                "a": 0,
                "k": 0,
                "ix": 4
              },
              "nm": "Rectangle Path 1",
              "mn": "ADBE Vector Shape - Rect",
              "hd": false,
              "_render": true
            },
            {
              "ty": "fl",
              "c": {
                "a": 0,
                "k": [0.698039233685, 0.698039233685, 0.278431385756, 1],
                "ix": 4
              },
              "o": {
                "a": 0,
                "k": 100,
                "ix": 5
              },
              "r": 1,
              "bm": 0,
              "nm": "Fill 1",
              "mn": "ADBE Vector Graphic - Fill",
              "hd": false,
              "_render": true
            }
          ],
          "nm": "Group 1",
          "np": 2,
          "cix": 2,
          "bm": 0,
          "ix": 1,
          "mn": "ADBE Vector Group",
          "hd": false,
          "_render": true
        },
        {
          "ty": "gr",
          "it": [
            {
              "ty": "rc",
              "d": 1,
              "s": {
                "a": 0,
                "k": [51.564, 51.564],
                "ix": 2
              },
              "p": {
                "a": 0,
                "k": [86, -182],
                "ix": 3
              },
              "r": {
                "a": 0,
                "k": 0,
                "ix": 4
              },
              "nm": "Rectangle Path 1",
              "mn": "ADBE Vector Shape - Rect",
              "hd": false,
              "_render": true
            },
            {
              "ty": "fl",
              "c": {
                "a": 0,
                "k": [0.525490224361, 0.262745112181, 0.262745112181, 1],
                "ix": 4
              },
              "o": {
                "a": 0,
                "k": 100,
                "ix": 5
              },
              "r": 1,
              "bm": 0,
              "nm": "Fill 1",
              "mn": "ADBE Vector Graphic - Fill",
              "hd": false,
              "_render": true
            }
          ],
          "nm": "Group 2",
          "np": 2,
          "cix": 2,
          "bm": 0,
          "ix": 2,
          "mn": "ADBE Vector Group",
          "hd": false,
          "_render": true
        },
        {
          "ty": "gr",
          "it": [
            {
              "ty": "rc",
              "d": 1,
              "s": {
                "a": 0,
                "k": [94, 94],
                "ix": 2
              },
              "p": {
                "a": 0,
                "k": [86, -182],
                "ix": 3
              },
              "r": {
                "a": 0,
                "k": 0,
                "ix": 4
              },
              "nm": "Rectangle Path 1",
              "mn": "ADBE Vector Shape - Rect",
              "hd": false,
              "_render": true
            },
            {
              "ty": "fl",
              "c": {
                "a": 0,
                "k": [0.698039233685, 0.698039233685, 0.278431385756, 1],
                "ix": 4
              },
              "o": {
                "a": 0,
                "k": 100,
                "ix": 5
              },
              "r": 1,
              "bm": 0,
              "nm": "Fill 1",
              "mn": "ADBE Vector Graphic - Fill",
              "hd": false,
              "_render": true
            }
          ],
          "nm": "Group 3",
          "np": 2,
          "cix": 2,
          "bm": 0,
          "ix": 3,
          "mn": "ADBE Vector Group",
          "hd": false,
          "_render": true
        }
      ],
      "ip": 0,
      "op": 41,
      "st": 0,
      "bm": 0,
      "completed": true
    }
  ],
  "markers": [],
  "__complete": true
}
```

The Readable-Lottie version of this same file, though far more verbose and consequently larger, is meant to be much more easily understood by whoever needs to look at this code:

```json
{
  "name": "Comp 2",
  "lottieVersion": "5.5.9",
  "width": 960,
  "height": 560,
  "frameRate": 30,
  "firstFrame": 0,
  "lastFrame": 41,
  "assets": [],
  "duration": "1:10",
  "layers": [
    {
      "name": "groupTest",
      "Contents": {
        "Group 1": {
          "type": "Group",
          "children": {
            "Rectangle Path 1": {
              "type": "Rectangle",
              "name": "Rectangle Path 1",
              "matchName": "ADBE Vector Shape - Rect",
              "hidden": false
            },
            "Fill 1": {
              "type": "Fill",
              "color": {
                "animated": 0,
                "propertyIndex": 4,
                "value": "#b2b247"
              },
              "opacity": {
                "animated": 0,
                "propertyIndex": 5,
                "value": 100
              },
              "blendMode": 0,
              "name": "Fill 1",
              "matchName": "ADBE Vector Graphic - Fill",
              "hidden": false
            }
          },
          "name": "Group 1",
          "numProps": 2,
          "propertyIndexAlt": 2,
          "blendMode": 0,
          "propertyIndex": 1,
          "matchName": "ADBE Vector Group",
          "hidden": false,
          "Transform": {
            "position": {
              "value": [0, 0]
            },
            "anchorPoint": {
              "value": [0, 0]
            },
            "scale": {
              "value": [100, 100]
            },
            "rotation": {
              "value": 0
            },
            "opacity": {
              "value": 100
            }
          }
        },
        "Group 2": {
          "type": "Group",
          "children": {
            "Rectangle Path 1": {
              "type": "Rectangle",
              "name": "Rectangle Path 1",
              "matchName": "ADBE Vector Shape - Rect",
              "hidden": false
            },
            "Fill 1": {
              "type": "Fill",
              "color": {
                "animated": 0,
                "propertyIndex": 4,
                "value": "#864343"
              },
              "opacity": {
                "animated": 0,
                "propertyIndex": 5,
                "value": 100
              },
              "blendMode": 0,
              "name": "Fill 1",
              "matchName": "ADBE Vector Graphic - Fill",
              "hidden": false
            }
          },
          "name": "Group 2",
          "numProps": 2,
          "propertyIndexAlt": 2,
          "blendMode": 0,
          "propertyIndex": 2,
          "matchName": "ADBE Vector Group",
          "hidden": false,
          "Transform": {
            "position": {
              "value": [0, 0]
            },
            "anchorPoint": {
              "value": [0, 0]
            },
            "scale": {
              "value": [100, 100]
            },
            "rotation": {
              "value": 0
            },
            "opacity": {
              "value": 100
            }
          }
        },
        "Group 3": {
          "type": "Group",
          "children": {
            "Rectangle Path 1": {
              "type": "Rectangle",
              "name": "Rectangle Path 1",
              "matchName": "ADBE Vector Shape - Rect",
              "hidden": false
            },
            "Fill 1": {
              "type": "Fill",
              "color": {
                "animated": 0,
                "propertyIndex": 4,
                "value": "#b2b247"
              },
              "opacity": {
                "animated": 0,
                "propertyIndex": 5,
                "value": 100
              },
              "blendMode": 0,
              "name": "Fill 1",
              "matchName": "ADBE Vector Graphic - Fill",
              "hidden": false
            }
          },
          "name": "Group 3",
          "numProps": 2,
          "propertyIndexAlt": 2,
          "blendMode": 0,
          "propertyIndex": 3,
          "matchName": "ADBE Vector Group",
          "hidden": false,
          "Transform": {
            "position": {
              "value": [0, 0]
            },
            "anchorPoint": {
              "value": [0, 0]
            },
            "scale": {
              "value": [100, 100]
            },
            "rotation": {
              "value": 0
            },
            "opacity": {
              "value": 100
            }
          }
        }
      },
      "Transform": {
        "opacity": {
          "value": 100
        },
        "rotation": {
          "value": 0
        },
        "position": {
          //
          // KEYFRAMES NOT YET SUPPORTED
          //
          "value": [
            {
              "i": {
                "x": 0.833,
                "y": 0.833
              },
              "o": {
                "x": 0.167,
                "y": 0.167
              },
              "t": 0,
              "s": [300, 219, 0],
              "to": null,
              "ti": null
            },
            {
              "i": {
                "x": 0.833,
                "y": 0.833
              },
              "o": {
                "x": 0.167,
                "y": 0.167
              },
              "t": 20,
              "s": [300, 115, 0],
              "to": null,
              "ti": null
            },
            {
              "t": 40,
              "s": [300, 219, 0]
            }
          ]
        },
        "anchorPoint": {
          "value": [86, -182, 0]
        },
        "scale": {
          "value": [100, 100, 100]
        }
      }
    }
  ]
}
```
