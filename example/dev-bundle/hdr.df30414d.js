// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"V9FSb":[function(require,module,exports) {
var _three = require("three");
var _gltfloaderJs = require("three/examples/jsm/loaders/GLTFLoader.js");
var _orbitControlsJs = require("three/examples/jsm/controls/OrbitControls.js");
var _rgbeloaderJs = require("three/examples/jsm/loaders/RGBELoader.js");
var _parallelMeshBVHWorkerJs = require("three-mesh-bvh/src/workers/ParallelMeshBVHWorker.js");
var _loaderElementJs = require("./utils/LoaderElement.js");
var _ = require("..");
var _generateRadialFloorTextureJs = require("./utils/generateRadialFloorTexture.js");
var _lilGuiModuleMinJs = require("three/examples/jsm/libs/lil-gui.module.min.js");
var _hdrimageGeneratorJs = require("./utils/HDRImageGenerator.js");
var _meshoptDecoderModuleJs = require("three/examples/jsm/libs/meshopt_decoder.module.js");
var _getScaledSettingsJs = require("./utils/getScaledSettings.js");
const ENV_URL = "https://raw.githubusercontent.com/disini/3d-demo-data/master/hdri/studio_small_05_1k.hdr";
const MODEL_URL = "https://raw.githubusercontent.com/disini/3d-demo-data/main/models/nasa-m2020/MER_static.glb";
const CREDITS = "Model courtesy of NASA/Caltech-JPL";
const DESCRIPTION = window.matchMedia("(dynamic-range: high)").matches ? "HDR display supported" : "HDR display not supported";
const MAX_SAMPLES = 45;
const params = {
    pause: false,
    hdr: true,
    sdrToneMapping: false,
    environmentIntensity: 15,
    tiles: 3,
    bounces: 5,
    renderScale: 1,
    ...(0, _getScaledSettingsJs.getScaledSettings)()
};
let pathTracer, renderer, controls;
let camera, scene;
let loader, hdrGenerator;
let activeImage = false;
init();
async function init() {
    loader = new (0, _loaderElementJs.LoaderElement)();
    loader.attach(document.body);
    // renderer
    renderer = new (0, _three.WebGLRenderer)({
        antialias: true
    });
    document.body.appendChild(renderer.domElement);
    // path tracer
    pathTracer = new (0, _.WebGLPathTracer)(renderer);
    pathTracer.filterGlossyFactor = 0.5;
    pathTracer.bounces = params.bounces;
    pathTracer.minSamples = 1;
    pathTracer.renderScale = params.renderScale;
    pathTracer.tiles.set(params.tiles, params.tiles);
    pathTracer.setBVHWorker(new (0, _parallelMeshBVHWorkerJs.ParallelMeshBVHWorker)());
    // generator
    hdrGenerator = new (0, _hdrimageGeneratorJs.HDRImageGenerator)(renderer, document.querySelector("img"));
    // camera
    camera = new (0, _three.PerspectiveCamera)(50, 1, 0.025, 500);
    camera.position.set(20, 24, 35).multiplyScalar(0.8);
    // scene
    scene = new (0, _three.Scene)();
    scene.backgroundBlurriness = 0.1;
    scene.background = new (0, _three.Color)(0x111111);
    // controls
    controls = new (0, _orbitControlsJs.OrbitControls)(camera, renderer.domElement);
    controls.target.y = 6;
    controls.addEventListener("change", ()=>{
        pathTracer.updateCamera();
        resetHdr();
    });
    controls.update();
    // load the environment map and model
    const [gltf, envTexture] = await Promise.all([
        new (0, _gltfloaderJs.GLTFLoader)().setMeshoptDecoder((0, _meshoptDecoderModuleJs.MeshoptDecoder)).loadAsync(MODEL_URL),
        new (0, _rgbeloaderJs.RGBELoader)().loadAsync(ENV_URL)
    ]);
    envTexture.mapping = (0, _three.EquirectangularReflectionMapping);
    scene.environment = envTexture;
    scene.environmentIntensity = params.environmentIntensity;
    const model = gltf.scene;
    model.scale.setScalar(10);
    scene.add(model);
    const floorTex = (0, _generateRadialFloorTextureJs.generateRadialFloorTexture)(2048);
    const floorPlane = new (0, _three.Mesh)(new (0, _three.PlaneGeometry)(), new (0, _three.MeshStandardMaterial)({
        map: floorTex,
        transparent: true,
        color: 0x111111,
        roughness: 0.1,
        metalness: 0.1,
        side: (0, _three.DoubleSide)
    }));
    floorPlane.scale.setScalar(50);
    floorPlane.rotation.x = -Math.PI / 2;
    scene.add(floorPlane);
    // initialize the path tracer
    await pathTracer.setSceneAsync(scene, camera, {
        onProgress: (v)=>loader.setPercentage(v)
    });
    loader.setCredits(CREDITS);
    loader.setDescription(DESCRIPTION);
    const gui = new (0, _lilGuiModuleMinJs.GUI)();
    gui.add(params, "pause").onChange(()=>{
        resetHdr();
    });
    gui.add(params, "hdr");
    gui.add(params, "sdrToneMapping").onChange((v)=>{
        renderer.toneMapping = v ? (0, _three.ACESFilmicToneMapping) : (0, _three.NoToneMapping);
    });
    gui.add(params, "renderScale", 0.1, 1).onChange((v)=>{
        pathTracer.renderScale = v;
        pathTracer.reset();
        resetHdr();
    });
    gui.add(params, "bounces", 1, 10).onChange((v)=>{
        pathTracer.bounces = v;
        pathTracer.reset();
        resetHdr();
    });
    gui.add(params, "tiles", 1, 6, 1).onChange((v)=>{
        pathTracer.tiles.setScalar(v);
    });
    gui.add(params, "environmentIntensity", 0, 30).onChange((v)=>{
        scene.environmentIntensity = v;
        pathTracer.updateEnvironment();
        resetHdr();
    });
    window.addEventListener("resize", onResize);
    onResize();
    animate();
}
function onResize() {
    // update resolution
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    // update camera
    pathTracer.updateCamera();
    resetHdr();
}
function resetHdr() {
    hdrGenerator.reset();
    activeImage = false;
}
function animate() {
    requestAnimationFrame(animate);
    const doPause = params.pause && pathTracer.samples >= 1;
    pathTracer.pausePathTracing = pathTracer.samples >= MAX_SAMPLES || doPause;
    pathTracer.renderSample();
    if (!hdrGenerator.encoding && params.hdr && (pathTracer.samples === MAX_SAMPLES || doPause) && !activeImage) {
        // NOTE: this can be called repeatedly but takes up to 200 ms
        hdrGenerator.updateFrom(pathTracer.target);
        activeImage = true;
    }
    if (hdrGenerator.completeImage && params.hdr) hdrGenerator.image.classList.add("show");
    else hdrGenerator.image.classList.remove("show");
    loader.setSamples(pathTracer.samples, pathTracer.isCompiling);
}

},{"three":"ktPTu","three/examples/jsm/loaders/GLTFLoader.js":"dVRsF","three/examples/jsm/controls/OrbitControls.js":"7mqRv","three/examples/jsm/loaders/RGBELoader.js":"cfP3d","three-mesh-bvh/src/workers/ParallelMeshBVHWorker.js":"iSl3b","./utils/LoaderElement.js":"h1Zxa","..":"8lqZg","./utils/generateRadialFloorTexture.js":"fyW1M","three/examples/jsm/libs/lil-gui.module.min.js":"dUXFx","./utils/HDRImageGenerator.js":"1LdPD","three/examples/jsm/libs/meshopt_decoder.module.js":"Go3D5","./utils/getScaledSettings.js":"lfwhv"}],"cfP3d":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "RGBELoader", ()=>RGBELoader);
var _three = require("three");
// https://github.com/mrdoob/three.js/issues/5552
// http://en.wikipedia.org/wiki/RGBE_image_format
class RGBELoader extends (0, _three.DataTextureLoader) {
    constructor(manager){
        super(manager);
        this.type = (0, _three.HalfFloatType);
    }
    // adapted from http://www.graphics.cornell.edu/~bjw/rgbe.html
    parse(buffer) {
        const /* default error routine.  change this to change error handling */ rgbe_read_error = 1, rgbe_write_error = 2, rgbe_format_error = 3, rgbe_memory_error = 4, rgbe_error = function(rgbe_error_code, msg) {
            switch(rgbe_error_code){
                case rgbe_read_error:
                    throw new Error("THREE.RGBELoader: Read Error: " + (msg || ""));
                case rgbe_write_error:
                    throw new Error("THREE.RGBELoader: Write Error: " + (msg || ""));
                case rgbe_format_error:
                    throw new Error("THREE.RGBELoader: Bad File Format: " + (msg || ""));
                default:
                case rgbe_memory_error:
                    throw new Error("THREE.RGBELoader: Memory Error: " + (msg || ""));
            }
        }, /* offsets to red, green, and blue components in a data (float) pixel */ //RGBE_DATA_RED = 0,
        //RGBE_DATA_GREEN = 1,
        //RGBE_DATA_BLUE = 2,
        /* number of floats per pixel, use 4 since stored in rgba image format */ //RGBE_DATA_SIZE = 4,
        /* flags indicating which fields in an rgbe_header_info are valid */ RGBE_VALID_PROGRAMTYPE = 1, RGBE_VALID_FORMAT = 2, RGBE_VALID_DIMENSIONS = 4, NEWLINE = "\n", fgets = function(buffer, lineLimit, consume) {
            const chunkSize = 128;
            lineLimit = !lineLimit ? 1024 : lineLimit;
            let p = buffer.pos, i = -1, len = 0, s = "", chunk = String.fromCharCode.apply(null, new Uint16Array(buffer.subarray(p, p + chunkSize)));
            while(0 > (i = chunk.indexOf(NEWLINE)) && len < lineLimit && p < buffer.byteLength){
                s += chunk;
                len += chunk.length;
                p += chunkSize;
                chunk += String.fromCharCode.apply(null, new Uint16Array(buffer.subarray(p, p + chunkSize)));
            }
            if (-1 < i) {
                /*for (i=l-1; i>=0; i--) {
						byteCode = m.charCodeAt(i);
						if (byteCode > 0x7f && byteCode <= 0x7ff) byteLen++;
						else if (byteCode > 0x7ff && byteCode <= 0xffff) byteLen += 2;
						if (byteCode >= 0xDC00 && byteCode <= 0xDFFF) i--; //trail surrogate
					}*/ if (false !== consume) buffer.pos += len + i + 1;
                return s + chunk.slice(0, i);
            }
            return false;
        }, /* minimal header reading.  modify if you want to parse more information */ RGBE_ReadHeader = function(buffer) {
            // regexes to parse header info fields
            const magic_token_re = /^#\?(\S+)/, gamma_re = /^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/, exposure_re = /^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/, format_re = /^\s*FORMAT=(\S+)\s*$/, dimensions_re = /^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/, // RGBE format header struct
            header = {
                valid: 0,
                /* indicate which fields are valid */ string: "",
                /* the actual header string */ comments: "",
                /* comments found in header */ programtype: "RGBE",
                /* listed at beginning of file to identify it after "#?". defaults to "RGBE" */ format: "",
                /* RGBE format, default 32-bit_rle_rgbe */ gamma: 1.0,
                /* image has already been gamma corrected with given gamma. defaults to 1.0 (no correction) */ exposure: 1.0,
                /* a value of 1.0 in an image corresponds to <exposure> watts/steradian/m^2. defaults to 1.0 */ width: 0,
                height: 0 /* image dimensions, width/height */ 
            };
            let line, match;
            if (buffer.pos >= buffer.byteLength || !(line = fgets(buffer))) rgbe_error(rgbe_read_error, "no header found");
            /* if you want to require the magic token then uncomment the next line */ if (!(match = line.match(magic_token_re))) rgbe_error(rgbe_format_error, "bad initial token");
            header.valid |= RGBE_VALID_PROGRAMTYPE;
            header.programtype = match[1];
            header.string += line + "\n";
            while(true){
                line = fgets(buffer);
                if (false === line) break;
                header.string += line + "\n";
                if ("#" === line.charAt(0)) {
                    header.comments += line + "\n";
                    continue; // comment line
                }
                if (match = line.match(gamma_re)) header.gamma = parseFloat(match[1]);
                if (match = line.match(exposure_re)) header.exposure = parseFloat(match[1]);
                if (match = line.match(format_re)) {
                    header.valid |= RGBE_VALID_FORMAT;
                    header.format = match[1]; //'32-bit_rle_rgbe';
                }
                if (match = line.match(dimensions_re)) {
                    header.valid |= RGBE_VALID_DIMENSIONS;
                    header.height = parseInt(match[1], 10);
                    header.width = parseInt(match[2], 10);
                }
                if (header.valid & RGBE_VALID_FORMAT && header.valid & RGBE_VALID_DIMENSIONS) break;
            }
            if (!(header.valid & RGBE_VALID_FORMAT)) rgbe_error(rgbe_format_error, "missing format specifier");
            if (!(header.valid & RGBE_VALID_DIMENSIONS)) rgbe_error(rgbe_format_error, "missing image size specifier");
            return header;
        }, RGBE_ReadPixels_RLE = function(buffer, w, h) {
            const scanline_width = w;
            if (scanline_width < 8 || scanline_width > 0x7fff || // this file is not run length encoded
            2 !== buffer[0] || 2 !== buffer[1] || buffer[2] & 0x80) // return the flat buffer
            return new Uint8Array(buffer);
            if (scanline_width !== (buffer[2] << 8 | buffer[3])) rgbe_error(rgbe_format_error, "wrong scanline width");
            const data_rgba = new Uint8Array(4 * w * h);
            if (!data_rgba.length) rgbe_error(rgbe_memory_error, "unable to allocate buffer space");
            let offset = 0, pos = 0;
            const ptr_end = 4 * scanline_width;
            const rgbeStart = new Uint8Array(4);
            const scanline_buffer = new Uint8Array(ptr_end);
            let num_scanlines = h;
            // read in each successive scanline
            while(num_scanlines > 0 && pos < buffer.byteLength){
                if (pos + 4 > buffer.byteLength) rgbe_error(rgbe_read_error);
                rgbeStart[0] = buffer[pos++];
                rgbeStart[1] = buffer[pos++];
                rgbeStart[2] = buffer[pos++];
                rgbeStart[3] = buffer[pos++];
                if (2 != rgbeStart[0] || 2 != rgbeStart[1] || (rgbeStart[2] << 8 | rgbeStart[3]) != scanline_width) rgbe_error(rgbe_format_error, "bad rgbe scanline format");
                // read each of the four channels for the scanline into the buffer
                // first red, then green, then blue, then exponent
                let ptr = 0, count;
                while(ptr < ptr_end && pos < buffer.byteLength){
                    count = buffer[pos++];
                    const isEncodedRun = count > 128;
                    if (isEncodedRun) count -= 128;
                    if (0 === count || ptr + count > ptr_end) rgbe_error(rgbe_format_error, "bad scanline data");
                    if (isEncodedRun) {
                        // a (encoded) run of the same value
                        const byteValue = buffer[pos++];
                        for(let i = 0; i < count; i++)scanline_buffer[ptr++] = byteValue;
                    //ptr += count;
                    } else {
                        // a literal-run
                        scanline_buffer.set(buffer.subarray(pos, pos + count), ptr);
                        ptr += count;
                        pos += count;
                    }
                }
                // now convert data from buffer into rgba
                // first red, then green, then blue, then exponent (alpha)
                const l = scanline_width; //scanline_buffer.byteLength;
                for(let i = 0; i < l; i++){
                    let off = 0;
                    data_rgba[offset] = scanline_buffer[i + off];
                    off += scanline_width; //1;
                    data_rgba[offset + 1] = scanline_buffer[i + off];
                    off += scanline_width; //1;
                    data_rgba[offset + 2] = scanline_buffer[i + off];
                    off += scanline_width; //1;
                    data_rgba[offset + 3] = scanline_buffer[i + off];
                    offset += 4;
                }
                num_scanlines--;
            }
            return data_rgba;
        };
        const RGBEByteToRGBFloat = function(sourceArray, sourceOffset, destArray, destOffset) {
            const e = sourceArray[sourceOffset + 3];
            const scale = Math.pow(2.0, e - 128.0) / 255.0;
            destArray[destOffset + 0] = sourceArray[sourceOffset + 0] * scale;
            destArray[destOffset + 1] = sourceArray[sourceOffset + 1] * scale;
            destArray[destOffset + 2] = sourceArray[sourceOffset + 2] * scale;
            destArray[destOffset + 3] = 1;
        };
        const RGBEByteToRGBHalf = function(sourceArray, sourceOffset, destArray, destOffset) {
            const e = sourceArray[sourceOffset + 3];
            const scale = Math.pow(2.0, e - 128.0) / 255.0;
            // clamping to 65504, the maximum representable value in float16
            destArray[destOffset + 0] = (0, _three.DataUtils).toHalfFloat(Math.min(sourceArray[sourceOffset + 0] * scale, 65504));
            destArray[destOffset + 1] = (0, _three.DataUtils).toHalfFloat(Math.min(sourceArray[sourceOffset + 1] * scale, 65504));
            destArray[destOffset + 2] = (0, _three.DataUtils).toHalfFloat(Math.min(sourceArray[sourceOffset + 2] * scale, 65504));
            destArray[destOffset + 3] = (0, _three.DataUtils).toHalfFloat(1);
        };
        const byteArray = new Uint8Array(buffer);
        byteArray.pos = 0;
        const rgbe_header_info = RGBE_ReadHeader(byteArray);
        const w = rgbe_header_info.width, h = rgbe_header_info.height, image_rgba_data = RGBE_ReadPixels_RLE(byteArray.subarray(byteArray.pos), w, h);
        let data, type;
        let numElements;
        switch(this.type){
            case 0, _three.FloatType:
                numElements = image_rgba_data.length / 4;
                const floatArray = new Float32Array(numElements * 4);
                for(let j = 0; j < numElements; j++)RGBEByteToRGBFloat(image_rgba_data, j * 4, floatArray, j * 4);
                data = floatArray;
                type = (0, _three.FloatType);
                break;
            case 0, _three.HalfFloatType:
                numElements = image_rgba_data.length / 4;
                const halfArray = new Uint16Array(numElements * 4);
                for(let j = 0; j < numElements; j++)RGBEByteToRGBHalf(image_rgba_data, j * 4, halfArray, j * 4);
                data = halfArray;
                type = (0, _three.HalfFloatType);
                break;
            default:
                throw new Error("THREE.RGBELoader: Unsupported type: " + this.type);
        }
        return {
            width: w,
            height: h,
            data: data,
            header: rgbe_header_info.string,
            gamma: rgbe_header_info.gamma,
            exposure: rgbe_header_info.exposure,
            type: type
        };
    }
    setDataType(value) {
        this.type = value;
        return this;
    }
    load(url, onLoad, onProgress, onError) {
        function onLoadCallback(texture, texData) {
            switch(texture.type){
                case 0, _three.FloatType:
                case 0, _three.HalfFloatType:
                    texture.colorSpace = (0, _three.LinearSRGBColorSpace);
                    texture.minFilter = (0, _three.LinearFilter);
                    texture.magFilter = (0, _three.LinearFilter);
                    texture.generateMipmaps = false;
                    texture.flipY = true;
                    break;
            }
            if (onLoad) onLoad(texture, texData);
        }
        return super.load(url, onLoadCallback, onProgress, onError);
    }
}

},{"three":"ktPTu","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"iSl3b":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "ParallelMeshBVHWorker", ()=>ParallelMeshBVHWorker);
var _three = require("three");
var _meshBVHJs = require("../core/MeshBVH.js");
var _workerBaseJs = require("./utils/WorkerBase.js");
var _bufferUtilsJs = require("../utils/BufferUtils.js");
var _generateMeshBVHWorkerJs = require("./GenerateMeshBVHWorker.js");
var _geometryUtilsJs = require("../core/build/geometryUtils.js");
const DEFAULT_WORKER_COUNT = typeof navigator !== "undefined" ? navigator.hardwareConcurrency : 4;
class _ParallelMeshBVHWorker extends (0, _workerBaseJs.WorkerBase) {
    constructor(){
        const worker = new Worker(require("fcf328a20d6da8f8"));
        super(worker);
        this.name = "ParallelMeshBVHWorker";
        this.maxWorkerCount = Math.max(DEFAULT_WORKER_COUNT, 4);
        if (!(0, _bufferUtilsJs.isSharedArrayBufferSupported)()) throw new Error("ParallelMeshBVHWorker: Shared Array Buffers are not supported.");
    }
    runTask(worker, geometry, options = {}) {
        return new Promise((resolve, reject)=>{
            if (!geometry.index && !options.indirect) (0, _geometryUtilsJs.ensureIndex)(geometry, options);
            if (geometry.getAttribute("position").isInterleavedBufferAttribute || geometry.index && geometry.index.isInterleavedBufferAttribute) throw new Error("ParallelMeshBVHWorker: InterleavedBufferAttribute are not supported for the geometry attributes.");
            worker.onerror = (e)=>{
                reject(new Error(`ParallelMeshBVHWorker: ${e.message}`));
            };
            worker.onmessage = (e)=>{
                const { data } = e;
                if (data.error) {
                    reject(new Error(data.error));
                    worker.onmessage = null;
                } else if (data.serialized) {
                    const { serialized, position } = data;
                    const bvh = (0, _meshBVHJs.MeshBVH).deserialize(serialized, geometry, {
                        setIndex: false
                    });
                    const boundsOptions = {
                        setBoundingBox: true,
                        ...options
                    };
                    // we need to replace the arrays because they're neutered entirely by the
                    // webworker transfer.
                    geometry.attributes.position.array = position;
                    if (serialized.index) {
                        if (geometry.index) geometry.index.array = serialized.index;
                        else {
                            const newIndex = new (0, _three.BufferAttribute)(serialized.index, 1, false);
                            geometry.setIndex(newIndex);
                        }
                    }
                    if (boundsOptions.setBoundingBox) geometry.boundingBox = bvh.getBoundingBox(new (0, _three.Box3)());
                    if (options.onProgress) options.onProgress(data.progress);
                    resolve(bvh);
                    worker.onmessage = null;
                } else if (options.onProgress) options.onProgress(data.progress);
            };
            const index = geometry.index ? geometry.index.array : null;
            const position = geometry.attributes.position.array;
            worker.postMessage({
                operation: "BUILD_BVH",
                maxWorkerCount: this.maxWorkerCount,
                index: (0, _bufferUtilsJs.convertToBufferType)(index, SharedArrayBuffer),
                position: (0, _bufferUtilsJs.convertToBufferType)(position, SharedArrayBuffer),
                options: {
                    ...options,
                    onProgress: null,
                    includedProgressCallback: Boolean(options.onProgress),
                    groups: [
                        ...geometry.groups
                    ]
                }
            });
        });
    }
}
class ParallelMeshBVHWorker {
    constructor(){
        if ((0, _bufferUtilsJs.isSharedArrayBufferSupported)()) return new _ParallelMeshBVHWorker();
        else {
            console.warn("ParallelMeshBVHWorker: SharedArrayBuffers not supported. Falling back to single-threaded GenerateMeshBVHWorker.");
            const object = new (0, _generateMeshBVHWorkerJs.GenerateMeshBVHWorker)();
            object.maxWorkerCount = DEFAULT_WORKER_COUNT;
            return object;
        }
    }
}

},{"three":"ktPTu","../core/MeshBVH.js":"biELs","./utils/WorkerBase.js":"bGfl5","../utils/BufferUtils.js":"gBAF9","./GenerateMeshBVHWorker.js":"3qwBo","../core/build/geometryUtils.js":"ejhro","fcf328a20d6da8f8":"h12D6","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"bGfl5":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "WorkerBase", ()=>WorkerBase);
class WorkerBase {
    constructor(worker){
        this.name = "WorkerBase";
        this.running = false;
        this.worker = worker;
        this.worker.onerror = (e)=>{
            if (e.message) throw new Error(`${this.name}: Could not create Web Worker with error "${e.message}"`);
            else throw new Error(`${this.name}: Could not create Web Worker.`);
        };
    }
    runTask() {}
    generate(...args) {
        if (this.running) throw new Error("GenerateMeshBVHWorker: Already running job.");
        if (this.worker === null) throw new Error("GenerateMeshBVHWorker: Worker has been disposed.");
        this.running = true;
        const promise = this.runTask(this.worker, ...args);
        promise.finally(()=>{
            this.running = false;
        });
        return promise;
    }
    dispose() {
        this.worker.terminate();
        this.worker = null;
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"3qwBo":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "GenerateMeshBVHWorker", ()=>GenerateMeshBVHWorker);
var _three = require("three");
var _meshBVHJs = require("../core/MeshBVH.js");
var _workerBaseJs = require("./utils/WorkerBase.js");
class GenerateMeshBVHWorker extends (0, _workerBaseJs.WorkerBase) {
    constructor(){
        const worker = new Worker(require("a30a60cb1342ab0e"));
        super(worker);
        this.name = "GenerateMeshBVHWorker";
    }
    runTask(worker, geometry, options = {}) {
        return new Promise((resolve, reject)=>{
            if (geometry.getAttribute("position").isInterleavedBufferAttribute || geometry.index && geometry.index.isInterleavedBufferAttribute) throw new Error("GenerateMeshBVHWorker: InterleavedBufferAttribute are not supported for the geometry attributes.");
            worker.onerror = (e)=>{
                reject(new Error(`GenerateMeshBVHWorker: ${e.message}`));
            };
            worker.onmessage = (e)=>{
                const { data } = e;
                if (data.error) {
                    reject(new Error(data.error));
                    worker.onmessage = null;
                } else if (data.serialized) {
                    const { serialized, position } = data;
                    const bvh = (0, _meshBVHJs.MeshBVH).deserialize(serialized, geometry, {
                        setIndex: false
                    });
                    const boundsOptions = Object.assign({
                        setBoundingBox: true
                    }, options);
                    // we need to replace the arrays because they're neutered entirely by the
                    // webworker transfer.
                    geometry.attributes.position.array = position;
                    if (serialized.index) {
                        if (geometry.index) geometry.index.array = serialized.index;
                        else {
                            const newIndex = new (0, _three.BufferAttribute)(serialized.index, 1, false);
                            geometry.setIndex(newIndex);
                        }
                    }
                    if (boundsOptions.setBoundingBox) geometry.boundingBox = bvh.getBoundingBox(new (0, _three.Box3)());
                    if (options.onProgress) options.onProgress(data.progress);
                    resolve(bvh);
                    worker.onmessage = null;
                } else if (options.onProgress) options.onProgress(data.progress);
            };
            const index = geometry.index ? geometry.index.array : null;
            const position = geometry.attributes.position.array;
            const transferable = [
                position
            ];
            if (index) transferable.push(index);
            worker.postMessage({
                index,
                position,
                options: {
                    ...options,
                    onProgress: null,
                    includedProgressCallback: Boolean(options.onProgress),
                    groups: [
                        ...geometry.groups
                    ]
                }
            }, transferable.map((arr)=>arr.buffer).filter((v)=>typeof SharedArrayBuffer === "undefined" || !(v instanceof SharedArrayBuffer)));
        });
    }
}

},{"three":"ktPTu","../core/MeshBVH.js":"biELs","./utils/WorkerBase.js":"bGfl5","a30a60cb1342ab0e":"2PVS9","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"2PVS9":[function(require,module,exports) {
let workerURL = require("bee8852bdb56d2a3");
let bundleURL = require("b6c4a272044c25d1");
let url = bundleURL.getBundleURL("b7Rhu") + "generateMeshBVH.worker.e1a14054.js";
module.exports = workerURL(url, bundleURL.getOrigin(url), false);

},{"bee8852bdb56d2a3":"cn2gM","b6c4a272044c25d1":"lgJ39"}],"cn2gM":[function(require,module,exports) {
"use strict";
module.exports = function(workerUrl, origin, isESM) {
    if (origin === self.location.origin) // If the worker bundle's url is on the same origin as the document,
    // use the worker bundle's own url.
    return workerUrl;
    else {
        // Otherwise, create a blob URL which loads the worker bundle with `importScripts`.
        var source = isESM ? "import " + JSON.stringify(workerUrl) + ";" : "importScripts(" + JSON.stringify(workerUrl) + ");";
        return URL.createObjectURL(new Blob([
            source
        ], {
            type: "application/javascript"
        }));
    }
};

},{}],"lgJ39":[function(require,module,exports) {
"use strict";
var bundleURL = {};
function getBundleURLCached(id) {
    var value = bundleURL[id];
    if (!value) {
        value = getBundleURL();
        bundleURL[id] = value;
    }
    return value;
}
function getBundleURL() {
    try {
        throw new Error();
    } catch (err) {
        var matches = ("" + err.stack).match(/(https?|file|ftp|(chrome|moz|safari-web)-extension):\/\/[^)\n]+/g);
        if (matches) // The first two stack frames will be this function and getBundleURLCached.
        // Use the 3rd one, which will be a runtime in the original bundle.
        return getBaseURL(matches[2]);
    }
    return "/";
}
function getBaseURL(url) {
    return ("" + url).replace(/^((?:https?|file|ftp|(chrome|moz|safari-web)-extension):\/\/.+)\/[^/]+$/, "$1") + "/";
}
// TODO: Replace uses with `new URL(url).origin` when ie11 is no longer supported.
function getOrigin(url) {
    var matches = ("" + url).match(/(https?|file|ftp|(chrome|moz|safari-web)-extension):\/\/[^/]+/);
    if (!matches) throw new Error("Origin not found");
    return matches[0];
}
exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
exports.getOrigin = getOrigin;

},{}],"h12D6":[function(require,module,exports) {
let workerURL = require("f87f0ca30b3358a1");
let bundleURL = require("fe266eb4cea01981");
let url = bundleURL.getBundleURL("b7Rhu") + "parallelMeshBVH.worker.fa7afa10.js";
module.exports = workerURL(url, bundleURL.getOrigin(url), false);

},{"f87f0ca30b3358a1":"cn2gM","fe266eb4cea01981":"lgJ39"}],"h1Zxa":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "LoaderElement", ()=>LoaderElement);
let _styleElement;
function initializeStyles() {
    if (_styleElement) return;
    _styleElement = document.createElement("style");
    _styleElement.textContent = /* css */ `

		.loader-container, .description {
			position: absolute;
			width: 100%;
			font-family: 'Courier New', Courier, monospace;
			color: white;
			font-weight: light;
			align-items: flex-start;
			font-size: 14px;
			pointer-events: none;
			user-select: none;
		}

		.loader-container {
			display: flex;
			flex-direction: column;
			bottom: 0;
		}

		.description {
			top: 0;
			width: 100%;
			text-align: center;
			padding: 5px 0;
		}

		.loader-container .bar {
			height: 2px;
			background: white;
			width: 100%;
		}

		.loader-container .credits,
		.loader-container .samples,
		.loader-container .percentage {
			padding: 5px;
			margin: 0 0 1px 1px;
			background: rgba( 0, 0, 0, 0.2 );
			border-radius: 2px;
			display: inline-block;
		}

		.loader-container:not(.loading) .bar,
		.loader-container:not(.loading) .percentage,
		.loader-container.loading .credits,
		.loader-container.loading .samples,
		.loader-container .credits:empty {
			display: none;
		}

		.loader-container .credits a,
		.loader-container .credits,
		.loader-container .samples {
			color: rgba( 255, 255, 255, 0.75 );
		}
	`;
    document.head.appendChild(_styleElement);
}
class LoaderElement {
    constructor(){
        initializeStyles();
        const container = document.createElement("div");
        container.classList.add("loader-container");
        const percentageEl = document.createElement("div");
        percentageEl.classList.add("percentage");
        container.appendChild(percentageEl);
        const samplesEl = document.createElement("div");
        samplesEl.classList.add("samples");
        container.appendChild(samplesEl);
        const creditsEl = document.createElement("div");
        creditsEl.classList.add("credits");
        container.appendChild(creditsEl);
        const loaderBarEl = document.createElement("div");
        loaderBarEl.classList.add("bar");
        container.appendChild(loaderBarEl);
        const descriptionEl = document.createElement("div");
        descriptionEl.classList.add("description");
        container.appendChild(descriptionEl);
        this._description = descriptionEl;
        this._loaderBar = loaderBarEl;
        this._percentage = percentageEl;
        this._credits = creditsEl;
        this._samples = samplesEl;
        this._container = container;
        this.setPercentage(0);
    }
    attach(container) {
        container.appendChild(this._container);
        container.appendChild(this._description);
    }
    setPercentage(perc) {
        this._loaderBar.style.width = `${perc * 100}%`;
        if (perc === 0) this._percentage.innerText = "Loading...";
        else this._percentage.innerText = `${(perc * 100).toFixed(0)}%`;
        if (perc >= 1) this._container.classList.remove("loading");
        else this._container.classList.add("loading");
    }
    setSamples(count, compiling = false) {
        if (compiling) this._samples.innerText = "compiling shader...";
        else this._samples.innerText = `${Math.floor(count)} samples`;
    }
    setCredits(credits) {
        this._credits.innerHTML = credits;
    }
    setDescription(description) {
        this._description.innerHTML = description;
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"fyW1M":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "generateRadialFloorTexture", ()=>generateRadialFloorTexture);
var _three = require("three");
function generateRadialFloorTexture(dim) {
    const data = new Uint8Array(dim * dim * 4);
    for(let x = 0; x < dim; x++)for(let y = 0; y < dim; y++){
        const xNorm = x / (dim - 1);
        const yNorm = y / (dim - 1);
        const xCent = 2.0 * (xNorm - 0.5);
        const yCent = 2.0 * (yNorm - 0.5);
        let a = Math.max(Math.min(1.0 - Math.sqrt(xCent ** 2 + yCent ** 2), 1.0), 0.0);
        a = a ** 2;
        a = a * 1.5;
        a = Math.min(a, 1.0);
        const i = y * dim + x;
        data[i * 4 + 0] = 255;
        data[i * 4 + 1] = 255;
        data[i * 4 + 2] = 255;
        data[i * 4 + 3] = a * 255;
    }
    const tex = new _three.DataTexture(data, dim, dim);
    tex.format = _three.RGBAFormat;
    tex.type = _three.UnsignedByteType;
    tex.minFilter = _three.LinearFilter;
    tex.magFilter = _three.LinearFilter;
    tex.wrapS = _three.RepeatWrapping;
    tex.wrapT = _three.RepeatWrapping;
    tex.needsUpdate = true;
    return tex;
}

},{"three":"ktPTu","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"1LdPD":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "HDRImageGenerator", ()=>HDRImageGenerator);
var _encodeJs = require("@monogrid/gainmap-js/dist/encode.js");
var _libultrahdrJs = require("../libs/libultrahdr.js");
var _three = require("three");
class HDRImageGenerator {
    get completeImage() {
        return this._lastUrl !== null;
    }
    constructor(renderer, imageElement = new Image()){
        this.renderer = renderer;
        this.image = imageElement;
        this.encoding = false;
        this._lastUrl = null;
        this._encodingId = -1;
    }
    async updateFrom(renderTarget) {
        if (this.encoding) throw new Error("HDRImageGenerator: HDR image already being encoded.");
        const renderer = this.renderer;
        const buffer = new Float32Array(renderTarget.width * renderTarget.height * 4);
        renderer.readRenderTargetPixels(renderTarget, 0, 0, renderTarget.width, renderTarget.height, buffer);
        const imageInformation = {
            header: {},
            width: renderTarget.width,
            height: renderTarget.height,
            data: buffer,
            format: (0, _three.RGBAFormat),
            colorSpace: (0, _three.LinearSRGBColorSpace),
            type: (0, _three.FloatType)
        };
        this._encodingId++;
        this.encoding = true;
        const currentId = this._encodingId;
        const jpegData = await encodeHDR(imageInformation);
        if (this._encodingId === currentId) {
            if (this._lastUrl) URL.revokeObjectURL(this._lastUrl);
            const blob = new Blob([
                jpegData
            ], {
                type: "octet/stream"
            });
            this._lastUrl = URL.createObjectURL(blob);
            this.image.src = this._lastUrl;
            this.encoding = false;
        }
    }
    reset() {
        if (this.encoding) {
            this.encoding = false;
            this._encodingId++;
        }
        if (this._lastUrl) {
            URL.revokeObjectURL(this._lastUrl);
            this.image.src = "";
            this._lastUrl = null;
        }
    }
}
async function encodeHDR(image) {
    // find RAW RGB Max value of a texture
    const textureMax = await (0, _encodeJs.findTextureMinMax)(image);
    // Encode the gainmap
    const encodingResult = (0, _encodeJs.encode)({
        image,
        // this will encode the full HDR range
        maxContentBoost: Math.max.apply(this, textureMax) || 1
    });
    // obtain the RAW RGBA SDR buffer and create an ImageData
    const sdrImageData = new ImageData(encodingResult.sdr.toArray(), encodingResult.sdr.width, encodingResult.sdr.height);
    // obtain the RAW RGBA Gain map buffer and create an ImageData
    const gainMapImageData = new ImageData(encodingResult.gainMap.toArray(), encodingResult.gainMap.width, encodingResult.gainMap.height);
    // parallel compress the RAW buffers into the specified mimeType
    const mimeType = "image/jpeg";
    const quality = 0.9;
    const [sdr, gainMap] = await Promise.all([
        (0, _encodeJs.compress)({
            source: sdrImageData,
            mimeType,
            quality,
            flipY: true // output needs to be flipped
        }),
        (0, _encodeJs.compress)({
            source: gainMapImageData,
            mimeType,
            quality,
            flipY: true // output needs to be flipped
        })
    ]);
    // obtain the metadata which will be embedded into
    // and XMP tag inside the final JPEG file
    const metadata = encodingResult.getMetadata();
    // embed the compressed images + metadata into a single
    // JPEG file
    const jpegBuffer = await (0, _libultrahdrJs.encodeJPEGMetadata)({
        ...encodingResult,
        ...metadata,
        sdr,
        gainMap
    });
    return jpegBuffer;
}

},{"@monogrid/gainmap-js/dist/encode.js":"eM0F3","../libs/libultrahdr.js":"5QSSE","three":"ktPTu","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"eM0F3":[function(require,module,exports) {
/**
 * @monogrid/gainmap-js v3.0.5
 * With ❤️, by MONOGRID <rnd@monogrid.com>
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "GainMapEncoderMaterial", ()=>GainMapEncoderMaterial);
parcelHelpers.export(exports, "SDRMaterial", ()=>SDRMaterial);
parcelHelpers.export(exports, "compress", ()=>(0, _compressD7K92XO0Js.c));
parcelHelpers.export(exports, "encode", ()=>encode);
parcelHelpers.export(exports, "encodeAndCompress", ()=>encodeAndCompress);
parcelHelpers.export(exports, "findTextureMinMax", ()=>findTextureMinMax);
parcelHelpers.export(exports, "getGainMap", ()=>getGainMap);
parcelHelpers.export(exports, "getSDRRendition", ()=>getSDRRendition);
var _compressD7K92XO0Js = require("./compress-D7K92XO0.js");
var _three = require("three");
var _quadRenderer6HrRQdJMJs = require("./QuadRenderer-6HrRQdJM.js");
/**
 * Utility function to obtain a `DataTexture` from various input formats
 *
 * @category Utility
 * @group Utility
 *
 * @param image
 * @returns
 */ const getDataTexture = (image)=>{
    let dataTexture;
    if (image instanceof (0, _three.DataTexture)) {
        if (!(image.image.data instanceof Uint16Array) && !(image.image.data instanceof Float32Array)) throw new Error("Provided image is not HDR");
        dataTexture = image;
    } else {
        dataTexture = new (0, _three.DataTexture)(image.data, image.width, image.height, "format" in image ? image.format : (0, _three.RGBAFormat), image.type, (0, _three.UVMapping), (0, _three.RepeatWrapping), (0, _three.RepeatWrapping), (0, _three.LinearFilter), (0, _three.LinearFilter), 1, "colorSpace" in image && image.colorSpace === "srgb" ? image.colorSpace : (0, _three.LinearSRGBColorSpace));
        // TODO: This tries to detect a raw RGBE and applies flipY
        // see if there's a better way to detect it?
        if ("header" in image && "gamma" in image) dataTexture.flipY = true;
        dataTexture.needsUpdate = true;
    }
    return dataTexture;
};
const vertexShader$2 = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
const fragmentShader$2 = /* glsl */ `
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform sampler2D sdr;
uniform sampler2D hdr;
uniform vec3 gamma;
uniform vec3 offsetSdr;
uniform vec3 offsetHdr;
uniform float minLog2;
uniform float maxLog2;

varying vec2 vUv;

void main() {
  vec3 sdrColor = texture2D(sdr, vUv).rgb;
  vec3 hdrColor = texture2D(hdr, vUv).rgb;

  vec3 pixelGain = (hdrColor + offsetHdr) / (sdrColor + offsetSdr);
  vec3 logRecovery = (log2(pixelGain) - minLog2) / (maxLog2 - minLog2);
  vec3 clampedRecovery = saturate(logRecovery);
  gl_FragColor = vec4(pow(clampedRecovery, gamma), 1.0);
}
`;
/**
 * A Material which is able to encode a gainmap
 *
 * @category Materials
 * @group Materials
 */ class GainMapEncoderMaterial extends (0, _three.ShaderMaterial) {
    /**
     *
     * @param params
     */ constructor({ sdr, hdr, offsetSdr, offsetHdr, maxContentBoost, minContentBoost, gamma }){
        if (!maxContentBoost) throw new Error("maxContentBoost is required");
        if (!sdr) throw new Error("sdr is required");
        if (!hdr) throw new Error("hdr is required");
        const _gamma = gamma || [
            1,
            1,
            1
        ];
        const _offsetSdr = offsetSdr || [
            1 / 64,
            1 / 64,
            1 / 64
        ];
        const _offsetHdr = offsetHdr || [
            1 / 64,
            1 / 64,
            1 / 64
        ];
        const _minContentBoost = minContentBoost || 1;
        const _maxContentBoost = Math.max(maxContentBoost, 1.0001);
        super({
            name: "GainMapEncoderMaterial",
            vertexShader: vertexShader$2,
            fragmentShader: fragmentShader$2,
            uniforms: {
                sdr: {
                    value: sdr
                },
                hdr: {
                    value: hdr
                },
                gamma: {
                    value: new (0, _three.Vector3)().fromArray(_gamma)
                },
                offsetSdr: {
                    value: new (0, _three.Vector3)().fromArray(_offsetSdr)
                },
                offsetHdr: {
                    value: new (0, _three.Vector3)().fromArray(_offsetHdr)
                },
                minLog2: {
                    value: Math.log2(_minContentBoost)
                },
                maxLog2: {
                    value: Math.log2(_maxContentBoost)
                }
            },
            blending: (0, _three.NoBlending),
            depthTest: false,
            depthWrite: false
        });
        this._minContentBoost = _minContentBoost;
        this._maxContentBoost = _maxContentBoost;
        this._offsetSdr = _offsetSdr;
        this._offsetHdr = _offsetHdr;
        this._gamma = _gamma;
        this.needsUpdate = true;
        this.uniformsNeedUpdate = true;
    }
    /**
     * @see {@link GainmapEncodingParameters.gamma}
     */ get gamma() {
        return this._gamma;
    }
    set gamma(value) {
        this._gamma = value;
        this.uniforms.gamma.value = new (0, _three.Vector3)().fromArray(value);
    }
    /**
     * @see {@link GainmapEncodingParameters.offsetHdr}
     */ get offsetHdr() {
        return this._offsetHdr;
    }
    set offsetHdr(value) {
        this._offsetHdr = value;
        this.uniforms.offsetHdr.value = new (0, _three.Vector3)().fromArray(value);
    }
    /**
     * @see {@link GainmapEncodingParameters.offsetSdr}
     */ get offsetSdr() {
        return this._offsetSdr;
    }
    set offsetSdr(value) {
        this._offsetSdr = value;
        this.uniforms.offsetSdr.value = new (0, _three.Vector3)().fromArray(value);
    }
    /**
     * @see {@link GainmapEncodingParameters.minContentBoost}
     * @remarks Non logarithmic space
     */ get minContentBoost() {
        return this._minContentBoost;
    }
    set minContentBoost(value) {
        this._minContentBoost = value;
        this.uniforms.minLog2.value = Math.log2(value);
    }
    /**
     * @see {@link GainmapEncodingParameters.maxContentBoost}
     * @remarks Non logarithmic space
     */ get maxContentBoost() {
        return this._maxContentBoost;
    }
    set maxContentBoost(value) {
        this._maxContentBoost = value;
        this.uniforms.maxLog2.value = Math.log2(value);
    }
    /**
     * @see {@link GainMapMetadata.gainMapMin}
     * @remarks Logarithmic space
     */ get gainMapMin() {
        return [
            Math.log2(this._minContentBoost),
            Math.log2(this._minContentBoost),
            Math.log2(this._minContentBoost)
        ];
    }
    /**
     * @see {@link GainMapMetadata.gainMapMax}
     * @remarks Logarithmic space
     */ get gainMapMax() {
        return [
            Math.log2(this._maxContentBoost),
            Math.log2(this._maxContentBoost),
            Math.log2(this._maxContentBoost)
        ];
    }
    /**
     * @see {@link GainMapMetadata.hdrCapacityMin}
     * @remarks Logarithmic space
     */ get hdrCapacityMin() {
        return Math.min(Math.max(0, this.gainMapMin[0]), Math.max(0, this.gainMapMin[1]), Math.max(0, this.gainMapMin[2]));
    }
    /**
     * @see {@link GainMapMetadata.hdrCapacityMax}
     * @remarks Logarithmic space
     */ get hdrCapacityMax() {
        return Math.max(Math.max(0, this.gainMapMax[0]), Math.max(0, this.gainMapMax[1]), Math.max(0, this.gainMapMax[2]));
    }
}
/**
 *
 * @param params
 * @returns
 * @category Encoding Functions
 * @group Encoding Functions
 */ const getGainMap = (params)=>{
    const { image, sdr, renderer } = params;
    const dataTexture = getDataTexture(image);
    const material = new GainMapEncoderMaterial({
        ...params,
        sdr: sdr.renderTarget.texture,
        hdr: dataTexture
    });
    const quadRenderer = new (0, _quadRenderer6HrRQdJMJs.Q)({
        width: dataTexture.image.width,
        height: dataTexture.image.height,
        type: (0, _three.UnsignedByteType),
        colorSpace: (0, _three.LinearSRGBColorSpace),
        material,
        renderer,
        renderTargetOptions: params.renderTargetOptions
    });
    try {
        quadRenderer.render();
    } catch (e) {
        quadRenderer.disposeOnDemandRenderer();
        throw e;
    }
    return quadRenderer;
};
const vertexShader$1 = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
const fragmentShader$1 = /* glsl */ `
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif

uniform sampler2D map;
uniform float brightness;
uniform float contrast;
uniform float saturation;
uniform float exposure;

varying vec2 vUv;

mat4 brightnessMatrix( float brightness ) {
  return mat4(
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    brightness, brightness, brightness, 1
  );
}

mat4 contrastMatrix( float contrast ) {
  float t = ( 1.0 - contrast ) / 2.0;
  return mat4(
    contrast, 0, 0, 0,
    0, contrast, 0, 0,
    0, 0, contrast, 0,
    t, t, t, 1
  );
}

mat4 saturationMatrix( float saturation ) {
  vec3 luminance = vec3( 0.3086, 0.6094, 0.0820 );
  float oneMinusSat = 1.0 - saturation;
  vec3 red = vec3( luminance.x * oneMinusSat );
  red+= vec3( saturation, 0, 0 );
  vec3 green = vec3( luminance.y * oneMinusSat );
  green += vec3( 0, saturation, 0 );
  vec3 blue = vec3( luminance.z * oneMinusSat );
  blue += vec3( 0, 0, saturation );
  return mat4(
    red,     0,
    green,   0,
    blue,    0,
    0, 0, 0, 1
  );
}

vec3 RRTAndODTFit( vec3 v ) {
  vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
  vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
  return a / b;
}

vec3 ACESFilmicToneMapping( vec3 color ) {
  // sRGB => XYZ => D65_2_D60 => AP1 => RRT_SAT
  const mat3 ACESInputMat = mat3(
    vec3( 0.59719, 0.07600, 0.02840 ), // transposed from source
    vec3( 0.35458, 0.90834, 0.13383 ),
    vec3( 0.04823, 0.01566, 0.83777 )
  );
  // ODT_SAT => XYZ => D60_2_D65 => sRGB
  const mat3 ACESOutputMat = mat3(
    vec3(  1.60475, -0.10208, -0.00327 ), // transposed from source
    vec3( -0.53108,  1.10813, -0.07276 ),
    vec3( -0.07367, -0.00605,  1.07602 )
  );
  color = ACESInputMat * color;
  // Apply RRT and ODT
  color = RRTAndODTFit( color );
  color = ACESOutputMat * color;
  // Clamp to [0, 1]
  return saturate( color );
}

// source: https://www.cs.utah.edu/docs/techreports/2002/pdf/UUCS-02-001.pdf
vec3 ReinhardToneMapping( vec3 color ) {
  return saturate( color / ( vec3( 1.0 ) + color ) );
}

// source: http://filmicworlds.com/blog/filmic-tonemapping-operators/
vec3 CineonToneMapping( vec3 color ) {
  // optimized filmic operator by Jim Hejl and Richard Burgess-Dawson
  color = max( vec3( 0.0 ), color - 0.004 );
  return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}

// nothing
vec3 LinearToneMapping ( vec3 color ) {
  return color;
}


void main() {
  vec4 color = texture2D(map, vUv);

  vec4 exposed = vec4(exposure * color.rgb, color.a);

  vec4 tonemapped = vec4(TONEMAPPING_FUNCTION(exposed.rgb), color.a);

  vec4 adjusted =
    brightnessMatrix( brightness ) *
    contrastMatrix( contrast ) *
    saturationMatrix( saturation ) *
    tonemapped;

  gl_FragColor = adjusted;
}
`;
/**
 * A Material used to adjust the SDR representation of an HDR image
 *
 * @category Materials
 * @group Materials
 */ class SDRMaterial extends (0, _three.ShaderMaterial) {
    /**
     *
     * @param params
     */ constructor({ map, toneMapping }){
        super({
            name: "SDRMaterial",
            vertexShader: vertexShader$1,
            fragmentShader: fragmentShader$1,
            uniforms: {
                map: {
                    value: map
                },
                brightness: {
                    value: 0
                },
                contrast: {
                    value: 1
                },
                saturation: {
                    value: 1
                },
                exposure: {
                    value: 1
                }
            },
            blending: (0, _three.NoBlending),
            depthTest: false,
            depthWrite: false
        });
        this._brightness = 0;
        this._contrast = 1;
        this._saturation = 1;
        this._exposure = 1;
        this._map = map;
        this.toneMapping = this._toneMapping = toneMapping || (0, _three.ACESFilmicToneMapping);
        this.needsUpdate = true;
        this.uniformsNeedUpdate = true;
    }
    get toneMapping() {
        return this._toneMapping;
    }
    set toneMapping(value) {
        let valid = false;
        switch(value){
            case 0, _three.ACESFilmicToneMapping:
                this.defines.TONEMAPPING_FUNCTION = "ACESFilmicToneMapping";
                valid = true;
                break;
            case 0, _three.ReinhardToneMapping:
                this.defines.TONEMAPPING_FUNCTION = "ReinhardToneMapping";
                valid = true;
                break;
            case 0, _three.CineonToneMapping:
                this.defines.TONEMAPPING_FUNCTION = "CineonToneMapping";
                valid = true;
                break;
            case 0, _three.LinearToneMapping:
                this.defines.TONEMAPPING_FUNCTION = "LinearToneMapping";
                valid = true;
                break;
            default:
                console.error(`Unsupported toneMapping: ${value}. Using LinearToneMapping.`);
                this.defines.TONEMAPPING_FUNCTION = "LinearToneMapping";
                this._toneMapping = (0, _three.LinearToneMapping);
        }
        if (valid) this._toneMapping = value;
        this.needsUpdate = true;
    }
    get brightness() {
        return this._brightness;
    }
    set brightness(value) {
        this._brightness = value;
        this.uniforms.brightness.value = value;
    }
    get contrast() {
        return this._contrast;
    }
    set contrast(value) {
        this._contrast = value;
        this.uniforms.contrast.value = value;
    }
    get saturation() {
        return this._saturation;
    }
    set saturation(value) {
        this._saturation = value;
        this.uniforms.saturation.value = value;
    }
    get exposure() {
        return this._exposure;
    }
    set exposure(value) {
        this._exposure = value;
        this.uniforms.exposure.value = value;
    }
    get map() {
        return this._map;
    }
    set map(value) {
        this._map = value;
        this.uniforms.map.value = value;
    }
}
/**
 * Renders an SDR Representation of an HDR Image
 *
 * @category Encoding Functions
 * @group Encoding Functions
 *
 * @param hdrTexture The HDR image to be rendered
 * @param renderer (optional) WebGLRenderer to use during the rendering, a disposable renderer will be create and destroyed if this is not provided.
 * @param toneMapping (optional) Tone mapping to be applied to the SDR Rendition
 * @param renderTargetOptions (optional) Options to use when creating the output renderTarget
 * @throws {Error} if the WebGLRenderer fails to render the SDR image
 */ const getSDRRendition = (hdrTexture, renderer, toneMapping, renderTargetOptions)=>{
    hdrTexture.needsUpdate = true;
    const quadRenderer = new (0, _quadRenderer6HrRQdJMJs.Q)({
        width: hdrTexture.image.width,
        height: hdrTexture.image.height,
        type: (0, _three.UnsignedByteType),
        colorSpace: (0, _three.SRGBColorSpace),
        material: new SDRMaterial({
            map: hdrTexture,
            toneMapping
        }),
        renderer,
        renderTargetOptions
    });
    try {
        quadRenderer.render();
    } catch (e) {
        quadRenderer.disposeOnDemandRenderer();
        throw e;
    }
    return quadRenderer;
};
/**
 * Encodes a Gainmap starting from an HDR file.
 *
 * @remarks
 * if you do not pass a `renderer` parameter
 * you must manually dispose the result
 * ```js
 * const encodingResult = await encode({ ... })
 * // do something with the buffers
 * const sdr = encodingResult.sdr.getArray()
 * const gainMap = encodingResult.gainMap.getArray()
 * // after that
 * encodingResult.sdr.dispose()
 * encodingResult.gainMap.dispose()
 * ```
 *
 * @category Encoding Functions
 * @group Encoding Functions
 *
 * @example
 * import { encode, findTextureMinMax } from '@monogrid/gainmap-js'
 * import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js'
 *
 * // load an HDR file
 * const loader = new EXRLoader()
 * const image = await loader.loadAsync('image.exr')
 *
 * // find RAW RGB Max value of a texture
 * const textureMax = await findTextureMinMax(image)
 *
 * // Encode the gainmap
 * const encodingResult = encode({
 *   image,
 *   // this will encode the full HDR range
 *   maxContentBoost: Math.max.apply(this, textureMax)
 * })
 * // can be re-encoded after changing parameters
 * encodingResult.sdr.material.exposure = 0.9
 * encodingResult.sdr.render()
 * // or
 * encodingResult.gainMap.material.gamma = [1.1, 1.1, 1.1]
 * encodingResult.gainMap.render()
 *
 * // do something with encodingResult.gainMap.toArray()
 * // and encodingResult.sdr.toArray()
 *
 * // renderers must be manually disposed
 * encodingResult.sdr.dispose()
 * encodingResult.gainMap.dispose()
 *
 * @param params Encoding Parameters
 * @returns
 */ const encode = (params)=>{
    const { image, renderer } = params;
    const dataTexture = getDataTexture(image);
    const sdr = getSDRRendition(dataTexture, renderer, params.toneMapping, params.renderTargetOptions);
    const gainMapRenderer = getGainMap({
        ...params,
        image: dataTexture,
        sdr,
        renderer: sdr.renderer // reuse the same (maybe disposable?) renderer
    });
    return {
        sdr,
        gainMap: gainMapRenderer,
        hdr: dataTexture,
        getMetadata: ()=>{
            return {
                gainMapMax: gainMapRenderer.material.gainMapMax,
                gainMapMin: gainMapRenderer.material.gainMapMin,
                gamma: gainMapRenderer.material.gamma,
                hdrCapacityMax: gainMapRenderer.material.hdrCapacityMax,
                hdrCapacityMin: gainMapRenderer.material.hdrCapacityMin,
                offsetHdr: gainMapRenderer.material.offsetHdr,
                offsetSdr: gainMapRenderer.material.offsetSdr
            };
        }
    };
};
/**
 * Encodes a Gainmap starting from an HDR file into compressed file formats (`image/jpeg`, `image/webp` or `image/png`).
 *
 * Uses {@link encode} internally, then pipes the results to {@link compress}.
 *
 * @remarks
 * if a `renderer` parameter is not provided
 * This function will automatically dispose its "disposable"
 * renderer, no need to dispose it manually later
 *
 * @category Encoding Functions
 * @group Encoding Functions
 * @example
 * import { encodeAndCompress, findTextureMinMax } from '@monogrid/gainmap-js'
 * import { encodeJPEGMetadata } from '@monogrid/gainmap-js/libultrahdr'
 * import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js'
 *
 * // load an HDR file
 * const loader = new EXRLoader()
 * const image = await loader.loadAsync('image.exr')
 *
 * // find RAW RGB Max value of a texture
 * const textureMax = await findTextureMinMax(image)
 *
 * // Encode the gainmap
 * const encodingResult = await encodeAndCompress({
 *   image,
 *   maxContentBoost: Math.max.apply(this, textureMax),
 *   mimeType: 'image/jpeg'
 * })
 *
 * // embed the compressed images + metadata into a single
 * // JPEG file
 * const jpeg = await encodeJPEGMetadata({
 *   ...encodingResult,
 *   sdr: encodingResult.sdr,
 *   gainMap: encodingResult.gainMap
 * })
 *
 * // `jpeg` will be an `Uint8Array` which can be saved somewhere
 *
 *
 * @param params Encoding Parameters
 * @throws {Error} if the browser does not support [createImageBitmap](https://caniuse.com/createimagebitmap)
 */ const encodeAndCompress = async (params)=>{
    const encodingResult = encode(params);
    const { mimeType, quality, flipY, withWorker } = params;
    let compressResult;
    let rawSDR;
    let rawGainMap;
    const sdrImageData = new ImageData(encodingResult.sdr.toArray(), encodingResult.sdr.width, encodingResult.sdr.height);
    const gainMapImageData = new ImageData(encodingResult.gainMap.toArray(), encodingResult.gainMap.width, encodingResult.gainMap.height);
    if (withWorker) {
        const workerResult = await Promise.all([
            withWorker.compress({
                source: sdrImageData,
                mimeType,
                quality,
                flipY
            }),
            withWorker.compress({
                source: gainMapImageData,
                mimeType,
                quality,
                flipY
            })
        ]);
        compressResult = workerResult;
        rawSDR = workerResult[0].source;
        rawGainMap = workerResult[1].source;
    } else {
        compressResult = await Promise.all([
            (0, _compressD7K92XO0Js.c)({
                source: sdrImageData,
                mimeType,
                quality,
                flipY
            }),
            (0, _compressD7K92XO0Js.c)({
                source: gainMapImageData,
                mimeType,
                quality,
                flipY
            })
        ]);
        rawSDR = sdrImageData.data;
        rawGainMap = gainMapImageData.data;
    }
    encodingResult.sdr.dispose();
    encodingResult.gainMap.dispose();
    return {
        ...encodingResult,
        ...encodingResult.getMetadata(),
        sdr: compressResult[0],
        gainMap: compressResult[1],
        rawSDR,
        rawGainMap
    };
};
const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
const fragmentShader = /* glsl */ `
precision mediump float;

#ifndef CELL_SIZE
  #define CELL_SIZE 2
#endif

#ifndef COMPARE_FUNCTION
  #define COMPARE_FUNCTION max
#endif

#ifndef INITIAL_VALUE
  #define INITIAL_VALUE 0
#endif

uniform sampler2D map;
uniform vec2 u_srcResolution;

varying vec2 vUv;

void main() {
  // compute the first pixel the source cell
  vec2 srcPixel = floor(gl_FragCoord.xy) * float(CELL_SIZE);

  // one pixel in source
  vec2 onePixel = vec2(1) / u_srcResolution;

  // uv for first pixel in cell. +0.5 for center of pixel
  vec2 uv = (srcPixel + 0.5) * onePixel;

  vec4 resultColor = vec4(INITIAL_VALUE);

  for (int y = 0; y < CELL_SIZE; ++y) {
    for (int x = 0; x < CELL_SIZE; ++x) {
      resultColor = COMPARE_FUNCTION(resultColor, texture2D(map, uv + vec2(x, y) * onePixel));
    }
  }

  gl_FragColor = resultColor;
}
`;
/**
 *
 * @category Utility
 * @group Utility
 *
 * @param srcTex
 * @param mode
 * @param renderer
 * @returns
 */ const findTextureMinMax = (image, mode = "max", renderer)=>{
    const srcTex = getDataTexture(image);
    const cellSize = 2;
    const mat = new (0, _three.ShaderMaterial)({
        vertexShader,
        fragmentShader,
        uniforms: {
            u_srcResolution: {
                value: new (0, _three.Vector2)(srcTex.image.width, srcTex.image.height)
            },
            map: {
                value: srcTex
            }
        },
        defines: {
            CELL_SIZE: cellSize,
            COMPARE_FUNCTION: mode,
            INITIAL_VALUE: mode === "max" ? 0 : 65504 // max half float value
        }
    });
    srcTex.needsUpdate = true;
    mat.needsUpdate = true;
    let w = srcTex.image.width;
    let h = srcTex.image.height;
    const quadRenderer = new (0, _quadRenderer6HrRQdJMJs.Q)({
        width: w,
        height: h,
        type: srcTex.type,
        colorSpace: srcTex.colorSpace,
        material: mat,
        renderer
    });
    const frameBuffers = [];
    while(w > 1 || h > 1){
        w = Math.max(1, (w + cellSize - 1) / cellSize | 0);
        h = Math.max(1, (h + cellSize - 1) / cellSize | 0);
        const fb = new (0, _three.WebGLRenderTarget)(w, h, {
            type: quadRenderer.type,
            format: srcTex.format,
            colorSpace: quadRenderer.colorSpace,
            minFilter: (0, _three.NearestFilter),
            magFilter: (0, _three.NearestFilter),
            wrapS: (0, _three.ClampToEdgeWrapping),
            wrapT: (0, _three.ClampToEdgeWrapping),
            generateMipmaps: false,
            depthBuffer: false,
            stencilBuffer: false
        });
        frameBuffers.push(fb);
    }
    w = srcTex.image.width;
    h = srcTex.image.height;
    frameBuffers.forEach((fbi)=>{
        w = Math.max(1, (w + cellSize - 1) / cellSize | 0);
        h = Math.max(1, (h + cellSize - 1) / cellSize | 0);
        quadRenderer.renderTarget = fbi;
        quadRenderer.render();
        mat.uniforms.map.value = fbi.texture;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        mat.uniforms.u_srcResolution.value.x = w;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        mat.uniforms.u_srcResolution.value.y = h;
    });
    const out = quadRenderer.toArray();
    quadRenderer.dispose();
    frameBuffers.forEach((fb)=>fb.dispose());
    return [
        quadRenderer.type === (0, _three.FloatType) ? out[0] : (0, _three.DataUtils).fromHalfFloat(out[0]),
        quadRenderer.type === (0, _three.FloatType) ? out[1] : (0, _three.DataUtils).fromHalfFloat(out[1]),
        quadRenderer.type === (0, _three.FloatType) ? out[2] : (0, _three.DataUtils).fromHalfFloat(out[2])
    ];
};

},{"./compress-D7K92XO0.js":"4kIsG","three":"ktPTu","./QuadRenderer-6HrRQdJM.js":"9ctRV","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"4kIsG":[function(require,module,exports) {
/**
 * @monogrid/gainmap-js v3.0.5
 * With ❤️, by MONOGRID <rnd@monogrid.com>
 */ /**
 * Used internally
 *
 * @internal
 * @param canvas
 * @param mimeType
 * @param quality
 * @returns
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "c", ()=>compress);
const canvasToBlob = async (canvas, mimeType, quality)=>{
    if (typeof OffscreenCanvas !== "undefined" && canvas instanceof OffscreenCanvas) return canvas.convertToBlob({
        type: mimeType,
        quality: quality || 0.9
    });
    else if (canvas instanceof HTMLCanvasElement) return new Promise((resolve, reject)=>{
        canvas.toBlob((res)=>{
            if (res) resolve(res);
            else reject(new Error("Failed to convert canvas to blob"));
        }, mimeType, quality || 0.9);
    });
    /* istanbul ignore next
      as long as this function is not exported this is only here
      to satisfy TS strict mode internally
    */ throw new Error("Unsupported canvas element");
};
/**
 * Converts a RAW RGBA image buffer into the provided `mimeType` using the provided `quality`
 *
 * @category Compression
 * @group Compression
 * @param params
 * @throws {Error} if the browser does not support [createImageBitmap](https://caniuse.com/createimagebitmap)
 * @throws {Error} if the provided source image cannot be decoded
 * @throws {Error} if the function fails to create a canvas context
 */ const compress = async (params)=>{
    if (typeof createImageBitmap === "undefined") throw new Error("createImageBitmap() not supported.");
    const { source, mimeType, quality, flipY } = params;
    // eslint-disable-next-line no-undef
    let imageBitmapSource;
    if ((source instanceof Uint8Array || source instanceof Uint8ClampedArray) && "sourceMimeType" in params) imageBitmapSource = new Blob([
        source
    ], {
        type: params.sourceMimeType
    });
    else if (source instanceof ImageData) imageBitmapSource = source;
    else throw new Error("Invalid source image");
    const img = await createImageBitmap(imageBitmapSource);
    const width = img.width;
    const height = img.height;
    let canvas;
    if (typeof OffscreenCanvas !== "undefined") canvas = new OffscreenCanvas(width, height);
    else {
        canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to create canvas Context");
    // flip Y
    if (flipY === true) {
        ctx.translate(0, height);
        ctx.scale(1, -1);
    }
    ctx.drawImage(img, 0, 0, width, height);
    const blob = await canvasToBlob(canvas, mimeType, quality || 0.9);
    const data = new Uint8Array(await blob.arrayBuffer());
    return {
        data,
        mimeType,
        width,
        height
    };
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"9ctRV":[function(require,module,exports) {
/**
 * @monogrid/gainmap-js v3.0.5
 * With ❤️, by MONOGRID <rnd@monogrid.com>
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Q", ()=>QuadRenderer);
var _three = require("three");
const getBufferForType = (type, width, height)=>{
    let out;
    switch(type){
        case 0, _three.UnsignedByteType:
            out = new Uint8ClampedArray(width * height * 4);
            break;
        case 0, _three.HalfFloatType:
            out = new Uint16Array(width * height * 4);
            break;
        case 0, _three.UnsignedIntType:
            out = new Uint32Array(width * height * 4);
            break;
        case 0, _three.ByteType:
            out = new Int8Array(width * height * 4);
            break;
        case 0, _three.ShortType:
            out = new Int16Array(width * height * 4);
            break;
        case 0, _three.IntType:
            out = new Int32Array(width * height * 4);
            break;
        case 0, _three.FloatType:
            out = new Float32Array(width * height * 4);
            break;
        default:
            throw new Error("Unsupported data type");
    }
    return out;
};
let _canReadPixelsResult;
/**
 * Test if this browser implementation can correctly read pixels from the specified
 * Render target type.
 *
 * Runs only once
 *
 * @param type
 * @param renderer
 * @param camera
 * @param renderTargetOptions
 * @returns
 */ const canReadPixels = (type, renderer, camera, renderTargetOptions)=>{
    if (_canReadPixelsResult !== undefined) return _canReadPixelsResult;
    const testRT = new (0, _three.WebGLRenderTarget)(1, 1, renderTargetOptions);
    renderer.setRenderTarget(testRT);
    const mesh = new (0, _three.Mesh)(new (0, _three.PlaneGeometry)(), new (0, _three.MeshBasicMaterial)({
        color: 0xffffff
    }));
    renderer.render(mesh, camera);
    renderer.setRenderTarget(null);
    const out = getBufferForType(type, testRT.width, testRT.height);
    renderer.readRenderTargetPixels(testRT, 0, 0, testRT.width, testRT.height, out);
    testRT.dispose();
    mesh.geometry.dispose();
    mesh.material.dispose();
    _canReadPixelsResult = out[0] !== 0;
    return _canReadPixelsResult;
};
/**
 * Utility class used for rendering a texture with a material
 *
 * @category Core
 * @group Core
 */ class QuadRenderer {
    /**
     * Constructs a new QuadRenderer
     *
     * @param options Parameters for this QuadRenderer
     */ constructor(options){
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        this._rendererIsDisposable = false;
        this._supportsReadPixels = true;
        /**
         * Renders the input texture using the specified material
         */ this.render = ()=>{
            this._renderer.setRenderTarget(this._renderTarget);
            try {
                this._renderer.render(this._scene, this._camera);
            } catch (e) {
                this._renderer.setRenderTarget(null);
                throw e;
            }
            this._renderer.setRenderTarget(null);
        };
        this._width = options.width;
        this._height = options.height;
        this._type = options.type;
        this._colorSpace = options.colorSpace;
        const rtOptions = {
            // fixed options
            format: (0, _three.RGBAFormat),
            depthBuffer: false,
            stencilBuffer: false,
            // user options
            type: this._type,
            colorSpace: this._colorSpace,
            anisotropy: ((_a = options.renderTargetOptions) === null || _a === void 0 ? void 0 : _a.anisotropy) !== undefined ? (_b = options.renderTargetOptions) === null || _b === void 0 ? void 0 : _b.anisotropy : 1,
            generateMipmaps: ((_c = options.renderTargetOptions) === null || _c === void 0 ? void 0 : _c.generateMipmaps) !== undefined ? (_d = options.renderTargetOptions) === null || _d === void 0 ? void 0 : _d.generateMipmaps : false,
            magFilter: ((_e = options.renderTargetOptions) === null || _e === void 0 ? void 0 : _e.magFilter) !== undefined ? (_f = options.renderTargetOptions) === null || _f === void 0 ? void 0 : _f.magFilter : (0, _three.LinearFilter),
            minFilter: ((_g = options.renderTargetOptions) === null || _g === void 0 ? void 0 : _g.minFilter) !== undefined ? (_h = options.renderTargetOptions) === null || _h === void 0 ? void 0 : _h.minFilter : (0, _three.LinearFilter),
            samples: ((_j = options.renderTargetOptions) === null || _j === void 0 ? void 0 : _j.samples) !== undefined ? (_k = options.renderTargetOptions) === null || _k === void 0 ? void 0 : _k.samples : undefined,
            wrapS: ((_l = options.renderTargetOptions) === null || _l === void 0 ? void 0 : _l.wrapS) !== undefined ? (_m = options.renderTargetOptions) === null || _m === void 0 ? void 0 : _m.wrapS : (0, _three.ClampToEdgeWrapping),
            wrapT: ((_o = options.renderTargetOptions) === null || _o === void 0 ? void 0 : _o.wrapT) !== undefined ? (_p = options.renderTargetOptions) === null || _p === void 0 ? void 0 : _p.wrapT : (0, _three.ClampToEdgeWrapping)
        };
        this._material = options.material;
        if (options.renderer) this._renderer = options.renderer;
        else {
            this._renderer = QuadRenderer.instantiateRenderer();
            this._rendererIsDisposable = true;
        }
        this._scene = new (0, _three.Scene)();
        this._camera = new (0, _three.OrthographicCamera)();
        this._camera.position.set(0, 0, 10);
        this._camera.left = -0.5;
        this._camera.right = 0.5;
        this._camera.top = 0.5;
        this._camera.bottom = -0.5;
        this._camera.updateProjectionMatrix();
        if (!canReadPixels(this._type, this._renderer, this._camera, rtOptions)) {
            let alternativeType;
            switch(this._type){
                case 0, _three.HalfFloatType:
                    alternativeType = this._renderer.extensions.has("EXT_color_buffer_float") ? (0, _three.FloatType) : undefined;
                    break;
            }
            if (alternativeType !== undefined) {
                console.warn(`This browser does not support reading pixels from ${this._type} RenderTargets, switching to ${(0, _three.FloatType)}`);
                this._type = alternativeType;
            } else {
                this._supportsReadPixels = false;
                console.warn("This browser dos not support toArray or toDataTexture, calls to those methods will result in an error thrown");
            }
        }
        this._quad = new (0, _three.Mesh)(new (0, _three.PlaneGeometry)(), this._material);
        this._quad.geometry.computeBoundingBox();
        this._scene.add(this._quad);
        this._renderTarget = new (0, _three.WebGLRenderTarget)(this.width, this.height, rtOptions);
        this._renderTarget.texture.mapping = ((_q = options.renderTargetOptions) === null || _q === void 0 ? void 0 : _q.mapping) !== undefined ? (_r = options.renderTargetOptions) === null || _r === void 0 ? void 0 : _r.mapping : (0, _three.UVMapping);
    }
    /**
     * Instantiates a temporary renderer
     *
     * @returns
     */ static instantiateRenderer() {
        const renderer = new (0, _three.WebGLRenderer)();
        renderer.setSize(128, 128);
        // renderer.outputColorSpace = SRGBColorSpace
        // renderer.toneMapping = LinearToneMapping
        // renderer.debug.checkShaderErrors = false
        // this._rendererIsDisposable = true
        return renderer;
    }
    /**
     * Obtains a Buffer containing the rendered texture.
     *
     * @throws Error if the browser cannot read pixels from this RenderTarget type.
     * @returns a TypedArray containing RGBA values from this renderer
     */ toArray() {
        if (!this._supportsReadPixels) throw new Error("Can't read pixels in this browser");
        const out = getBufferForType(this._type, this._width, this._height);
        this._renderer.readRenderTargetPixels(this._renderTarget, 0, 0, this._width, this._height, out);
        return out;
    }
    /**
     * Performs a readPixel operation in the renderTarget
     * and returns a DataTexture containing the read data
     *
     * @params options
     * @returns
     */ toDataTexture(options) {
        const returnValue = new (0, _three.DataTexture)(// fixed values
        this.toArray(), this.width, this.height, (0, _three.RGBAFormat), this._type, // user values
        (options === null || options === void 0 ? void 0 : options.mapping) || (0, _three.UVMapping), (options === null || options === void 0 ? void 0 : options.wrapS) || (0, _three.ClampToEdgeWrapping), (options === null || options === void 0 ? void 0 : options.wrapT) || (0, _three.ClampToEdgeWrapping), (options === null || options === void 0 ? void 0 : options.magFilter) || (0, _three.LinearFilter), (options === null || options === void 0 ? void 0 : options.minFilter) || (0, _three.LinearFilter), (options === null || options === void 0 ? void 0 : options.anisotropy) || 1, // fixed value
        (0, _three.LinearSRGBColorSpace));
        // set this afterwards, we can't set it in constructor
        returnValue.generateMipmaps = (options === null || options === void 0 ? void 0 : options.generateMipmaps) !== undefined ? options === null || options === void 0 ? void 0 : options.generateMipmaps : false;
        return returnValue;
    }
    /**
     * If using a disposable renderer, it will dispose it.
     */ disposeOnDemandRenderer() {
        this._renderer.setRenderTarget(null);
        if (this._rendererIsDisposable) {
            this._renderer.dispose();
            this._renderer.forceContextLoss();
        }
    }
    /**
     * Will dispose of **all** assets used by this renderer.
     *
     *
     * @param disposeRenderTarget will dispose of the renderTarget which will not be usable later
     * set this to true if you passed the `renderTarget.texture` to a `PMREMGenerator`
     * or are otherwise done with it.
     *
     * @example
     * ```js
     * const loader = new HDRJPGLoader(renderer)
     * const result = await loader.loadAsync('gainmap.jpeg')
     * const mesh = new Mesh(geometry, new MeshBasicMaterial({ map: result.renderTarget.texture }) )
     * // DO NOT dispose the renderTarget here,
     * // it is used directly in the material
     * result.dispose()
     * ```
     *
     * @example
     * ```js
     * const loader = new HDRJPGLoader(renderer)
     * const pmremGenerator = new PMREMGenerator( renderer );
     * const result = await loader.loadAsync('gainmap.jpeg')
     * const envMap = pmremGenerator.fromEquirectangular(result.renderTarget.texture)
     * const mesh = new Mesh(geometry, new MeshStandardMaterial({ envMap }) )
     * // renderTarget can be disposed here
     * // because it was used to generate a PMREM texture
     * result.dispose(true)
     * ```
     */ dispose(disposeRenderTarget) {
        this.disposeOnDemandRenderer();
        if (disposeRenderTarget) this.renderTarget.dispose();
        // dispose shader material texture uniforms
        if (this.material instanceof (0, _three.ShaderMaterial)) Object.values(this.material.uniforms).forEach((v)=>{
            if (v.value instanceof (0, _three.Texture)) v.value.dispose();
        });
        // dispose other material properties
        Object.values(this.material).forEach((value)=>{
            if (value instanceof (0, _three.Texture)) value.dispose();
        });
        this.material.dispose();
        this._quad.geometry.dispose();
    }
    /**
     * Width of the texture
     */ get width() {
        return this._width;
    }
    set width(value) {
        this._width = value;
        this._renderTarget.setSize(this._width, this._height);
    }
    /**
     * Height of the texture
     */ get height() {
        return this._height;
    }
    set height(value) {
        this._height = value;
        this._renderTarget.setSize(this._width, this._height);
    }
    /**
     * The renderer used
     */ get renderer() {
        return this._renderer;
    }
    /**
     * The `WebGLRenderTarget` used.
     */ get renderTarget() {
        return this._renderTarget;
    }
    set renderTarget(value) {
        this._renderTarget = value;
        this._width = value.width;
        this._height = value.height;
    // this._type = value.texture.type
    }
    /**
     * The `Material` used.
     */ get material() {
        return this._material;
    }
    /**
     *
     */ get type() {
        return this._type;
    }
    get colorSpace() {
        return this._colorSpace;
    }
}

},{"three":"ktPTu","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"5QSSE":[function(require,module,exports) {
/* eslint-disable */ // NOTE: modified version of monogrid source file to patch it
// so it works with parcel
/**
 * @monogrid/gainmap-js v3.0.5
 * With ❤️, by MONOGRID <rnd@monogrid.com>
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "decodeJPEGMetadata", ()=>decodeJPEGMetadata);
parcelHelpers.export(exports, "encodeJPEGMetadata", ()=>encodeJPEGMetadata);
parcelHelpers.export(exports, "getLibrary", ()=>getLibrary);
var process = require("316d73eca7447f1");
var Buffer = require("f7cf485ba21328dc").Buffer;
var Module = (()=>{
    var _scriptDir = "file:///example/libs/libultrahdr.js";
    return async function(moduleArg = {}) {
        // include: shell.js
        // The Module object: Our interface to the outside world. We import
        // and export values on it. There are various ways Module can be used:
        // 1. Not defined. We create it here
        // 2. A function parameter, function(Module) { ..generated code.. }
        // 3. pre-run appended it, var Module = {}; ..generated code..
        // 4. External script tag defines var Module.
        // We need to check if Module already exists (e.g. case 3 above).
        // Substitution will be replaced with actual code on later stage of the build,
        // this way Closure Compiler will not mangle it (e.g. case 4. above).
        // Note that if you want to run closure, and also to use Module
        // after the generated code, you will need to define   var Module = {};
        // before the code. Then that object will be used in the code, and you
        // can continue to use Module afterwards as well.
        var Module = moduleArg;
        // Set up the promise that indicates the Module is initialized
        var readyPromiseResolve, readyPromiseReject;
        Module["ready"] = new Promise((resolve, reject)=>{
            readyPromiseResolve = resolve;
            readyPromiseReject = reject;
        });
        [
            "_main",
            "_memory",
            "___indirect_function_table",
            "__embind_initialize_bindings",
            "_fflush",
            "onRuntimeInitialized"
        ].forEach((prop)=>{
            if (!Object.getOwnPropertyDescriptor(Module["ready"], prop)) Object.defineProperty(Module["ready"], prop, {
                get: ()=>abort("You are getting " + prop + " on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js"),
                set: ()=>abort("You are setting " + prop + " on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")
            });
        });
        // --pre-jses are emitted after the Module integration code, so that they can
        // refer to Module (if they choose; they can also define Module)
        // Sometimes an existing Module object exists with properties
        // meant to overwrite the default module functionality. Here
        // we collect those properties and reapply _after_ we configure
        // the current environment's defaults to avoid having to be so
        // defensive during initialization.
        var moduleOverrides = Object.assign({}, Module);
        var thisProgram = "./this.program";
        var quit_ = (status, toThrow)=>{
            throw toThrow;
        };
        // Determine the runtime environment we are in. You can customize this by
        // setting the ENVIRONMENT setting at compile time (see settings.js).
        // Attempt to auto-detect the environment
        var ENVIRONMENT_IS_WEB = typeof window == "object";
        var ENVIRONMENT_IS_WORKER = typeof importScripts == "function";
        // N.b. Electron.js environment is simultaneously a NODE-environment, but
        // also a web environment.
        var ENVIRONMENT_IS_NODE = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string";
        var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
        if (Module["ENVIRONMENT"]) throw new Error("Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -sENVIRONMENT=web or -sENVIRONMENT=node)");
        // `/` should be present at the end if `scriptDirectory` is not empty
        var scriptDirectory = "";
        function locateFile(path) {
            if (Module["locateFile"]) return Module["locateFile"](path, scriptDirectory);
            return scriptDirectory + path;
        }
        // Hooks that are implemented differently in different runtime environments.
        var read_, readAsync, readBinary;
        if (ENVIRONMENT_IS_NODE) {
            if (typeof process == "undefined" || !process.release || process.release.name !== "node") throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
            var nodeVersion = process.versions.node;
            var numericVersion = nodeVersion.split(".").slice(0, 3);
            numericVersion = numericVersion[0] * 10000 + numericVersion[1] * 100 + numericVersion[2].split("-")[0] * 1;
            if (numericVersion < 160000) throw new Error("This emscripten-generated code requires node v16.0.0 (detected v" + nodeVersion + ")");
            // `require()` is no-op in an ESM module, use `createRequire()` to construct
            // the require()` function.  This is only necessary for multi-environment
            // builds, `-sENVIRONMENT=node` emits a static import declaration instead.
            // TODO: Swap all `require()`'s with `import()`'s?
            const { createRequire } = await require("e052745b6c1d5788");
            /** @suppress{duplicate} */ var require1 = createRequire("file:///example/libs/libultrahdr.js");
            // These modules will usually be used on Node.js. Load them eagerly to avoid
            // the complexity of lazy-loading.
            var fs = require1("fs");
            var nodePath = require1("path");
            if (ENVIRONMENT_IS_WORKER) scriptDirectory = nodePath.dirname(scriptDirectory) + "/";
            // include: node_shell_read.js
            read_ = (filename, binary)=>{
                // We need to re-wrap `file://` strings to URLs. Normalizing isn't
                // necessary in that case, the path should already be absolute.
                filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
                return fs.readFileSync(filename, binary ? undefined : "utf8");
            };
            readBinary = (filename)=>{
                var ret = read_(filename, true);
                if (!ret.buffer) ret = new Uint8Array(ret);
                assert(ret.buffer);
                return ret;
            };
            readAsync = (filename, onload, onerror, binary = true)=>{
                // See the comment in the `read_` function.
                filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
                fs.readFile(filename, binary ? undefined : "utf8", (err, data)=>{
                    if (err) onerror(err);
                    else onload(binary ? data.buffer : data);
                });
            };
            // end include: node_shell_read.js
            if (!Module["thisProgram"] && process.argv.length > 1) thisProgram = process.argv[1].replace(/\\/g, "/");
            process.argv.slice(2);
            // MODULARIZE will export the module in the proper place outside, we don't need to export here
            quit_ = (status, toThrow)=>{
                process.exitCode = status;
                throw toThrow;
            };
            Module["inspect"] = ()=>"[Emscripten Module object]";
        } else if (ENVIRONMENT_IS_SHELL) {
            if (typeof process == "object" && typeof require1 === "function" || typeof window == "object" || typeof importScripts == "function") throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
            if (typeof read != "undefined") read_ = read;
            readBinary = (f)=>{
                if (typeof readbuffer == "function") return new Uint8Array(readbuffer(f));
                let data = read(f, "binary");
                assert(typeof data == "object");
                return data;
            };
            readAsync = (f, onload, onerror)=>{
                setTimeout(()=>onload(readBinary(f)));
            };
            if (typeof clearTimeout == "undefined") globalThis.clearTimeout = (id)=>{};
            if (typeof setTimeout == "undefined") // spidermonkey lacks setTimeout but we use it above in readAsync.
            globalThis.setTimeout = (f)=>typeof f == "function" ? f() : abort();
            if (typeof scriptArgs != "undefined") scriptArgs;
            if (typeof quit == "function") quit_ = (status, toThrow)=>{
                // Unlike node which has process.exitCode, d8 has no such mechanism. So we
                // have no way to set the exit code and then let the program exit with
                // that code when it naturally stops running (say, when all setTimeouts
                // have completed). For that reason, we must call `quit` - the only way to
                // set the exit code - but quit also halts immediately.  To increase
                // consistency with node (and the web) we schedule the actual quit call
                // using a setTimeout to give the current stack and any exception handlers
                // a chance to run.  This enables features such as addOnPostRun (which
                // expected to be able to run code after main returns).
                setTimeout(()=>{
                    if (!(toThrow instanceof ExitStatus)) {
                        let toLog = toThrow;
                        if (toThrow && typeof toThrow == "object" && toThrow.stack) toLog = [
                            toThrow,
                            toThrow.stack
                        ];
                        err(`exiting due to exception: ${toLog}`);
                    }
                    quit(status);
                });
                throw toThrow;
            };
            if (typeof print != "undefined") {
                // Prefer to use print/printErr where they exist, as they usually work better.
                if (typeof console == "undefined") console = /** @type{!Console} */ {};
                console.log = /** @type{!function(this:Console, ...*): undefined} */ print;
                console.warn = console.error = /** @type{!function(this:Console, ...*): undefined} */ typeof printErr != "undefined" ? printErr : print;
            }
        } else // Note that this includes Node.js workers when relevant (pthreads is enabled).
        // Node.js workers are detected as a combination of ENVIRONMENT_IS_WORKER and
        // ENVIRONMENT_IS_NODE.
        if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
            if (ENVIRONMENT_IS_WORKER) scriptDirectory = self.location.href;
            else if (typeof document != "undefined" && document.currentScript) scriptDirectory = document.currentScript.src;
            // When MODULARIZE, this JS may be executed later, after document.currentScript
            // is gone, so we saved it, and we use it here instead of any other info.
            if (_scriptDir) scriptDirectory = _scriptDir;
            // blob urls look like blob:http://site.com/etc/etc and we cannot infer anything from them.
            // otherwise, slice off the final part of the url to find the script directory.
            // if scriptDirectory does not contain a slash, lastIndexOf will return -1,
            // and scriptDirectory will correctly be replaced with an empty string.
            // If scriptDirectory contains a query (starting with ?) or a fragment (starting with #),
            // they are removed because they could contain a slash.
            if (scriptDirectory.indexOf("blob:") !== 0) scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1);
            else scriptDirectory = "";
            if (!(typeof window == "object" || typeof importScripts == "function")) throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
            // include: web_or_worker_shell_read.js
            read_ = (url)=>{
                var xhr = new XMLHttpRequest();
                xhr.open("GET", url, false);
                xhr.send(null);
                return xhr.responseText;
            };
            if (ENVIRONMENT_IS_WORKER) readBinary = (url)=>{
                var xhr = new XMLHttpRequest();
                xhr.open("GET", url, false);
                xhr.responseType = "arraybuffer";
                xhr.send(null);
                return new Uint8Array(/** @type{!ArrayBuffer} */ xhr.response);
            };
            readAsync = (url, onload, onerror)=>{
                var xhr = new XMLHttpRequest();
                xhr.open("GET", url, true);
                xhr.responseType = "arraybuffer";
                xhr.onload = ()=>{
                    if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
                        onload(xhr.response);
                        return;
                    }
                    onerror();
                };
                xhr.onerror = onerror;
                xhr.send(null);
            };
        } else throw new Error("environment detection error");
        var out = Module["print"] || console.log.bind(console);
        var err = Module["printErr"] || console.error.bind(console);
        // Merge back in the overrides
        Object.assign(Module, moduleOverrides);
        // Free the object hierarchy contained in the overrides, this lets the GC
        // reclaim data used e.g. in memoryInitializerRequest, which is a large typed array.
        moduleOverrides = null;
        checkIncomingModuleAPI();
        // Emit code to handle expected values on the Module object. This applies Module.x
        // to the proper local x. This has two benefits: first, we only emit it if it is
        // expected to arrive, and second, by using a local everywhere else that can be
        // minified.
        if (Module["arguments"]) Module["arguments"];
        legacyModuleProp("arguments", "arguments_");
        if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
        legacyModuleProp("thisProgram", "thisProgram");
        if (Module["quit"]) quit_ = Module["quit"];
        legacyModuleProp("quit", "quit_");
        // perform assertions in shell.js after we set up out() and err(), as otherwise if an assertion fails it cannot print the message
        // Assertions on removed incoming Module JS APIs.
        assert(typeof Module["memoryInitializerPrefixURL"] == "undefined", "Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead");
        assert(typeof Module["pthreadMainPrefixURL"] == "undefined", "Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead");
        assert(typeof Module["cdInitializerPrefixURL"] == "undefined", "Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead");
        assert(typeof Module["filePackagePrefixURL"] == "undefined", "Module.filePackagePrefixURL option was removed, use Module.locateFile instead");
        assert(typeof Module["read"] == "undefined", "Module.read option was removed (modify read_ in JS)");
        assert(typeof Module["readAsync"] == "undefined", "Module.readAsync option was removed (modify readAsync in JS)");
        assert(typeof Module["readBinary"] == "undefined", "Module.readBinary option was removed (modify readBinary in JS)");
        assert(typeof Module["setWindowTitle"] == "undefined", "Module.setWindowTitle option was removed (modify emscripten_set_window_title in JS)");
        assert(typeof Module["TOTAL_MEMORY"] == "undefined", "Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY");
        legacyModuleProp("asm", "wasmExports");
        legacyModuleProp("read", "read_");
        legacyModuleProp("readAsync", "readAsync");
        legacyModuleProp("readBinary", "readBinary");
        legacyModuleProp("setWindowTitle", "setWindowTitle");
        assert(!ENVIRONMENT_IS_SHELL, "shell environment detected but not enabled at build time.  Add 'shell' to `-sENVIRONMENT` to enable.");
        // end include: shell.js
        // include: preamble.js
        // === Preamble library stuff ===
        // Documentation for the public APIs defined in this file must be updated in:
        //    site/source/docs/api_reference/preamble.js.rst
        // A prebuilt local version of the documentation is available at:
        //    site/build/text/docs/api_reference/preamble.js.txt
        // You can also build docs locally as HTML or other formats in site/
        // An online HTML version (which may be of a different version of Emscripten)
        //    is up at http://kripken.github.io/emscripten-site/docs/api_reference/preamble.js.html
        var wasmBinary;
        if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
        legacyModuleProp("wasmBinary", "wasmBinary");
        if (typeof WebAssembly != "object") abort("no native wasm support detected");
        // Wasm globals
        var wasmMemory;
        //========================================
        // Runtime essentials
        //========================================
        // whether we are quitting the application. no code should run after this.
        // set in exit() and abort()
        var ABORT = false;
        // set by exit() and abort().  Passed to 'onExit' handler.
        // NOTE: This is also used as the process return code code in shell environments
        // but only when noExitRuntime is false.
        var EXITSTATUS;
        /** @type {function(*, string=)} */ function assert(condition, text) {
            if (!condition) abort("Assertion failed" + (text ? ": " + text : ""));
        }
        // We used to include malloc/free by default in the past. Show a helpful error in
        // builds with assertions.
        // Memory management
        var /** @type {!Int8Array} */ HEAP8, /** @type {!Uint8Array} */ HEAPU8, /** @type {!Int16Array} */ HEAP16, /** @type {!Uint16Array} */ HEAPU16, /** @type {!Int32Array} */ HEAP32, /** @type {!Uint32Array} */ HEAPU32, /** @type {!Float32Array} */ HEAPF32, /** @type {!Float64Array} */ HEAPF64;
        function updateMemoryViews() {
            var b = wasmMemory.buffer;
            Module["HEAP8"] = HEAP8 = new Int8Array(b);
            Module["HEAP16"] = HEAP16 = new Int16Array(b);
            Module["HEAPU8"] = HEAPU8 = new Uint8Array(b);
            Module["HEAPU16"] = HEAPU16 = new Uint16Array(b);
            Module["HEAP32"] = HEAP32 = new Int32Array(b);
            Module["HEAPU32"] = HEAPU32 = new Uint32Array(b);
            Module["HEAPF32"] = HEAPF32 = new Float32Array(b);
            Module["HEAPF64"] = HEAPF64 = new Float64Array(b);
        }
        assert(!Module["STACK_SIZE"], "STACK_SIZE can no longer be set at runtime.  Use -sSTACK_SIZE at link time");
        assert(typeof Int32Array != "undefined" && typeof Float64Array !== "undefined" && Int32Array.prototype.subarray != undefined && Int32Array.prototype.set != undefined, "JS engine does not provide full typed array support");
        // If memory is defined in wasm, the user can't provide it, or set INITIAL_MEMORY
        assert(!Module["wasmMemory"], "Use of `wasmMemory` detected.  Use -sIMPORTED_MEMORY to define wasmMemory externally");
        assert(!Module["INITIAL_MEMORY"], "Detected runtime INITIAL_MEMORY setting.  Use -sIMPORTED_MEMORY to define wasmMemory dynamically");
        // include: runtime_stack_check.js
        // Initializes the stack cookie. Called at the startup of main and at the startup of each thread in pthreads mode.
        function writeStackCookie() {
            var max = _emscripten_stack_get_end();
            assert((max & 3) == 0);
            // If the stack ends at address zero we write our cookies 4 bytes into the
            // stack.  This prevents interference with SAFE_HEAP and ASAN which also
            // monitor writes to address zero.
            if (max == 0) max += 4;
            // The stack grow downwards towards _emscripten_stack_get_end.
            // We write cookies to the final two words in the stack and detect if they are
            // ever overwritten.
            HEAPU32[max >> 2] = 0x02135467;
            HEAPU32[max + 4 >> 2] = 0x89BACDFE;
            // Also test the global address 0 for integrity.
            HEAPU32[0] = 1668509029;
        }
        function checkStackCookie() {
            if (ABORT) return;
            var max = _emscripten_stack_get_end();
            // See writeStackCookie().
            if (max == 0) max += 4;
            var cookie1 = HEAPU32[max >> 2];
            var cookie2 = HEAPU32[max + 4 >> 2];
            if (cookie1 != 0x02135467 || cookie2 != 0x89BACDFE) abort(`Stack overflow! Stack cookie has been overwritten at ${ptrToString(max)}, expected hex dwords 0x89BACDFE and 0x2135467, but received ${ptrToString(cookie2)} ${ptrToString(cookie1)}`);
            // Also test the global address 0 for integrity.
            if (HEAPU32[0] != 0x63736d65 /* 'emsc' */ ) abort("Runtime error: The application has corrupted its heap memory area (address zero)!");
        }
        // end include: runtime_stack_check.js
        // include: runtime_assertions.js
        // Endianness check
        (function() {
            var h16 = new Int16Array(1);
            var h8 = new Int8Array(h16.buffer);
            h16[0] = 0x6373;
            if (h8[0] !== 0x73 || h8[1] !== 0x63) throw "Runtime error: expected the system to be little-endian! (Run with -sSUPPORT_BIG_ENDIAN to bypass)";
        })();
        // end include: runtime_assertions.js
        var __ATPRERUN__ = []; // functions called before the runtime is initialized
        var __ATINIT__ = []; // functions called during startup
        var __ATMAIN__ = []; // functions called when main() is to be run
        var __ATPOSTRUN__ = []; // functions called after the main() is called
        var runtimeInitialized = false;
        function preRun() {
            if (Module["preRun"]) {
                if (typeof Module["preRun"] == "function") Module["preRun"] = [
                    Module["preRun"]
                ];
                while(Module["preRun"].length)addOnPreRun(Module["preRun"].shift());
            }
            callRuntimeCallbacks(__ATPRERUN__);
        }
        function initRuntime() {
            assert(!runtimeInitialized);
            runtimeInitialized = true;
            checkStackCookie();
            if (!Module["noFSInit"] && !FS.init.initialized) FS.init();
            FS.ignorePermissions = false;
            callRuntimeCallbacks(__ATINIT__);
        }
        function preMain() {
            checkStackCookie();
            callRuntimeCallbacks(__ATMAIN__);
        }
        function postRun() {
            checkStackCookie();
            if (Module["postRun"]) {
                if (typeof Module["postRun"] == "function") Module["postRun"] = [
                    Module["postRun"]
                ];
                while(Module["postRun"].length)addOnPostRun(Module["postRun"].shift());
            }
            callRuntimeCallbacks(__ATPOSTRUN__);
        }
        function addOnPreRun(cb) {
            __ATPRERUN__.unshift(cb);
        }
        function addOnInit(cb) {
            __ATINIT__.unshift(cb);
        }
        function addOnPostRun(cb) {
            __ATPOSTRUN__.unshift(cb);
        }
        // include: runtime_math.js
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/fround
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/clz32
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc
        assert(Math.imul, "This browser does not support Math.imul(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
        assert(Math.fround, "This browser does not support Math.fround(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
        assert(Math.clz32, "This browser does not support Math.clz32(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
        assert(Math.trunc, "This browser does not support Math.trunc(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
        // end include: runtime_math.js
        // A counter of dependencies for calling run(). If we need to
        // do asynchronous work before running, increment this and
        // decrement it. Incrementing must happen in a place like
        // Module.preRun (used by emcc to add file preloading).
        // Note that you can add dependencies in preRun, even though
        // it happens right before run - run will be postponed until
        // the dependencies are met.
        var runDependencies = 0;
        var runDependencyWatcher = null;
        var dependenciesFulfilled = null; // overridden to take different actions when all run dependencies are fulfilled
        var runDependencyTracking = {};
        function getUniqueRunDependency(id) {
            var orig = id;
            while(true){
                if (!runDependencyTracking[id]) return id;
                id = orig + Math.random();
            }
        }
        function addRunDependency(id) {
            runDependencies++;
            if (Module["monitorRunDependencies"]) Module["monitorRunDependencies"](runDependencies);
            if (id) {
                assert(!runDependencyTracking[id]);
                runDependencyTracking[id] = 1;
                if (runDependencyWatcher === null && typeof setInterval != "undefined") // Check for missing dependencies every few seconds
                runDependencyWatcher = setInterval(()=>{
                    if (ABORT) {
                        clearInterval(runDependencyWatcher);
                        runDependencyWatcher = null;
                        return;
                    }
                    var shown = false;
                    for(var dep in runDependencyTracking){
                        if (!shown) {
                            shown = true;
                            err("still waiting on run dependencies:");
                        }
                        err(`dependency: ${dep}`);
                    }
                    if (shown) err("(end of list)");
                }, 10000);
            } else err("warning: run dependency added without ID");
        }
        function removeRunDependency(id) {
            runDependencies--;
            if (Module["monitorRunDependencies"]) Module["monitorRunDependencies"](runDependencies);
            if (id) {
                assert(runDependencyTracking[id]);
                delete runDependencyTracking[id];
            } else err("warning: run dependency removed without ID");
            if (runDependencies == 0) {
                if (runDependencyWatcher !== null) {
                    clearInterval(runDependencyWatcher);
                    runDependencyWatcher = null;
                }
                if (dependenciesFulfilled) {
                    var callback = dependenciesFulfilled;
                    dependenciesFulfilled = null;
                    callback(); // can add another dependenciesFulfilled
                }
            }
        }
        /** @param {string|number=} what */ function abort(what) {
            if (Module["onAbort"]) Module["onAbort"](what);
            what = "Aborted(" + what + ")";
            // TODO(sbc): Should we remove printing and leave it up to whoever
            // catches the exception?
            err(what);
            ABORT = true;
            EXITSTATUS = 1;
            // Use a wasm runtime error, because a JS error might be seen as a foreign
            // exception, which means we'd run destructors on it. We need the error to
            // simply make the program stop.
            // FIXME This approach does not work in Wasm EH because it currently does not assume
            // all RuntimeErrors are from traps; it decides whether a RuntimeError is from
            // a trap or not based on a hidden field within the object. So at the moment
            // we don't have a way of throwing a wasm trap from JS. TODO Make a JS API that
            // allows this in the wasm spec.
            // Suppress closure compiler warning here. Closure compiler's builtin extern
            // defintion for WebAssembly.RuntimeError claims it takes no arguments even
            // though it can.
            // TODO(https://github.com/google/closure-compiler/pull/3913): Remove if/when upstream closure gets fixed.
            /** @suppress {checkTypes} */ var e = new WebAssembly.RuntimeError(what);
            readyPromiseReject(e);
            // Throw the error whether or not MODULARIZE is set because abort is used
            // in code paths apart from instantiation where an exception is expected
            // to be thrown when abort is called.
            throw e;
        }
        // include: memoryprofiler.js
        // end include: memoryprofiler.js
        // include: URIUtils.js
        // Prefix of data URIs emitted by SINGLE_FILE and related options.
        var dataURIPrefix = "data:application/octet-stream;base64,";
        /**
   * Indicates whether filename is a base64 data URI.
   * @noinline
   */ var isDataURI = (filename)=>filename.startsWith(dataURIPrefix);
        /**
   * Indicates whether filename is delivered via file protocol (as opposed to http/https)
   * @noinline
   */ var isFileURI = (filename)=>filename.startsWith("file://");
        // end include: URIUtils.js
        function createExportWrapper(name) {
            return function() {
                assert(runtimeInitialized, `native function \`${name}\` called before runtime initialization`);
                var f = wasmExports[name];
                assert(f, `exported native function \`${name}\` not found`);
                return f.apply(null, arguments);
            };
        }
        // include: runtime_exceptions.js
        // end include: runtime_exceptions.js
        var wasmBinaryFile;
        if (Module["locateFile"]) {
            wasmBinaryFile = "libultrahdr-esm.wasm";
            if (!isDataURI(wasmBinaryFile)) wasmBinaryFile = locateFile(wasmBinaryFile);
        } else // Use bundler-friendly `new URL(..., import.meta.url)` pattern; works in browsers too.
        wasmBinaryFile = new URL(require("383f4ebaf771ea4a")).href;
        function getBinarySync(file) {
            if (file == wasmBinaryFile && wasmBinary) return new Uint8Array(wasmBinary);
            if (readBinary) return readBinary(file);
            throw "both async and sync fetching of the wasm failed";
        }
        function getBinaryPromise(binaryFile) {
            // If we don't have the binary yet, try to load it asynchronously.
            // Fetch has some additional restrictions over XHR, like it can't be used on a file:// url.
            // See https://github.com/github/fetch/pull/92#issuecomment-140665932
            // Cordova or Electron apps are typically loaded from a file:// url.
            // So use fetch if it is available and the url is not a file, otherwise fall back to XHR.
            if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
                if (typeof fetch == "function" && !isFileURI(binaryFile)) return fetch(binaryFile, {
                    credentials: "same-origin"
                }).then((response)=>{
                    if (!response["ok"]) throw "failed to load wasm binary file at '" + binaryFile + "'";
                    return response["arrayBuffer"]();
                }).catch(()=>getBinarySync(binaryFile));
                else if (readAsync) // fetch is not available or url is file => try XHR (readAsync uses XHR internally)
                return new Promise((resolve, reject)=>{
                    readAsync(binaryFile, (response)=>resolve(new Uint8Array(/** @type{!ArrayBuffer} */ response)), reject);
                });
            }
            // Otherwise, getBinarySync should be able to get it synchronously
            return Promise.resolve().then(function() {
                return require("e052745b6c1d5788");
            }).then((res)=>getBinarySync(binaryFile));
        }
        function instantiateArrayBuffer(binaryFile, imports, receiver) {
            return getBinaryPromise(binaryFile).then((binary)=>{
                return WebAssembly.instantiate(binary, imports);
            }).then((instance)=>{
                return instance;
            }).then(receiver, (reason)=>{
                err(`failed to asynchronously prepare wasm: ${reason}`);
                // Warn on some common problems.
                if (isFileURI(wasmBinaryFile)) err(`warning: Loading from a file URI (${wasmBinaryFile}) is not supported in most browsers. See https://emscripten.org/docs/getting_started/FAQ.html#how-do-i-run-a-local-webserver-for-testing-why-does-my-program-stall-in-downloading-or-preparing`);
                abort(reason);
            });
        }
        function instantiateAsync(binary, binaryFile, imports, callback) {
            if (!binary && typeof WebAssembly.instantiateStreaming == "function" && !isDataURI(binaryFile) && // Don't use streaming for file:// delivered objects in a webview, fetch them synchronously.
            !isFileURI(binaryFile) && // Avoid instantiateStreaming() on Node.js environment for now, as while
            // Node.js v18.1.0 implements it, it does not have a full fetch()
            // implementation yet.
            //
            // Reference:
            //   https://github.com/emscripten-core/emscripten/pull/16917
            !ENVIRONMENT_IS_NODE && typeof fetch == "function") return fetch(binaryFile, {
                credentials: "same-origin"
            }).then((response)=>{
                // Suppress closure warning here since the upstream definition for
                // instantiateStreaming only allows Promise<Repsponse> rather than
                // an actual Response.
                // TODO(https://github.com/google/closure-compiler/pull/3913): Remove if/when upstream closure is fixed.
                /** @suppress {checkTypes} */ var result = WebAssembly.instantiateStreaming(response, imports);
                return result.then(callback, function(reason) {
                    // We expect the most common failure cause to be a bad MIME type for the binary,
                    // in which case falling back to ArrayBuffer instantiation should work.
                    err(`wasm streaming compile failed: ${reason}`);
                    err("falling back to ArrayBuffer instantiation");
                    return instantiateArrayBuffer(binaryFile, imports, callback);
                });
            });
            return instantiateArrayBuffer(binaryFile, imports, callback);
        }
        // Create the wasm instance.
        // Receives the wasm imports, returns the exports.
        function createWasm() {
            // prepare imports
            var info = {
                "env": wasmImports,
                "wasi_snapshot_preview1": wasmImports
            };
            // Load the wasm module and create an instance of using native support in the JS engine.
            // handle a generated wasm instance, receiving its exports and
            // performing other necessary setup
            /** @param {WebAssembly.Module=} module*/ function receiveInstance(instance, module) {
                wasmExports = instance.exports;
                wasmMemory = wasmExports["memory"];
                assert(wasmMemory, "memory not found in wasm exports");
                // This assertion doesn't hold when emscripten is run in --post-link
                // mode.
                // TODO(sbc): Read INITIAL_MEMORY out of the wasm file in post-link mode.
                //assert(wasmMemory.buffer.byteLength === 16777216);
                updateMemoryViews();
                wasmTable = wasmExports["__indirect_function_table"];
                assert(wasmTable, "table not found in wasm exports");
                addOnInit(wasmExports["__wasm_call_ctors"]);
                removeRunDependency("wasm-instantiate");
                return wasmExports;
            }
            // wait for the pthread pool (if any)
            addRunDependency("wasm-instantiate");
            // Prefer streaming instantiation if available.
            // Async compilation can be confusing when an error on the page overwrites Module
            // (for example, if the order of elements is wrong, and the one defining Module is
            // later), so we save Module and check it later.
            var trueModule = Module;
            function receiveInstantiationResult(result) {
                // 'result' is a ResultObject object which has both the module and instance.
                // receiveInstance() will swap in the exports (to Module.asm) so they can be called
                assert(Module === trueModule, "the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?");
                trueModule = null;
                // TODO: Due to Closure regression https://github.com/google/closure-compiler/issues/3193, the above line no longer optimizes out down to the following line.
                // When the regression is fixed, can restore the above PTHREADS-enabled path.
                receiveInstance(result["instance"]);
            }
            // User shell pages can write their own Module.instantiateWasm = function(imports, successCallback) callback
            // to manually instantiate the Wasm module themselves. This allows pages to
            // run the instantiation parallel to any other async startup actions they are
            // performing.
            // Also pthreads and wasm workers initialize the wasm instance through this
            // path.
            if (Module["instantiateWasm"]) try {
                return Module["instantiateWasm"](info, receiveInstance);
            } catch (e) {
                err(`Module.instantiateWasm callback failed with error: ${e}`);
                // If instantiation fails, reject the module ready promise.
                readyPromiseReject(e);
            }
            // If instantiation fails, reject the module ready promise.
            instantiateAsync(wasmBinary, wasmBinaryFile, info, receiveInstantiationResult).catch(readyPromiseReject);
            return {}; // no exports yet; we'll fill them in later
        }
        // Globals used by JS i64 conversions (see makeSetValue)
        var tempDouble;
        var tempI64;
        // include: runtime_debug.js
        function legacyModuleProp(prop, newName, incomming = true) {
            if (!Object.getOwnPropertyDescriptor(Module, prop)) Object.defineProperty(Module, prop, {
                configurable: true,
                get () {
                    let extra = incomming ? " (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)" : "";
                    abort(`\`Module.${prop}\` has been replaced by \`${newName}\`` + extra);
                }
            });
        }
        function ignoredModuleProp(prop) {
            if (Object.getOwnPropertyDescriptor(Module, prop)) abort(`\`Module.${prop}\` was supplied but \`${prop}\` not included in INCOMING_MODULE_JS_API`);
        }
        // forcing the filesystem exports a few things by default
        function isExportedByForceFilesystem(name) {
            return name === "FS_createPath" || name === "FS_createDataFile" || name === "FS_createPreloadedFile" || name === "FS_unlink" || name === "addRunDependency" || // The old FS has some functionality that WasmFS lacks.
            name === "FS_createLazyFile" || name === "FS_createDevice" || name === "removeRunDependency";
        }
        function missingGlobal(sym, msg) {
            if (typeof globalThis !== "undefined") Object.defineProperty(globalThis, sym, {
                configurable: true,
                get () {
                    warnOnce("`" + sym + "` is not longer defined by emscripten. " + msg);
                    return undefined;
                }
            });
        }
        missingGlobal("buffer", "Please use HEAP8.buffer or wasmMemory.buffer");
        missingGlobal("asm", "Please use wasmExports instead");
        function missingLibrarySymbol(sym) {
            if (typeof globalThis !== "undefined" && !Object.getOwnPropertyDescriptor(globalThis, sym)) Object.defineProperty(globalThis, sym, {
                configurable: true,
                get () {
                    // Can't `abort()` here because it would break code that does runtime
                    // checks.  e.g. `if (typeof SDL === 'undefined')`.
                    var msg = "`" + sym + "` is a library symbol and not included by default; add it to your library.js __deps or to DEFAULT_LIBRARY_FUNCS_TO_INCLUDE on the command line";
                    // DEFAULT_LIBRARY_FUNCS_TO_INCLUDE requires the name as it appears in
                    // library.js, which means $name for a JS name with no prefix, or name
                    // for a JS name like _name.
                    var librarySymbol = sym;
                    if (!librarySymbol.startsWith("_")) librarySymbol = "$" + sym;
                    msg += " (e.g. -sDEFAULT_LIBRARY_FUNCS_TO_INCLUDE='" + librarySymbol + "')";
                    if (isExportedByForceFilesystem(sym)) msg += ". Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you";
                    warnOnce(msg);
                    return undefined;
                }
            });
            // Any symbol that is not included from the JS libary is also (by definition)
            // not exported on the Module object.
            unexportedRuntimeSymbol(sym);
        }
        function unexportedRuntimeSymbol(sym) {
            if (!Object.getOwnPropertyDescriptor(Module, sym)) Object.defineProperty(Module, sym, {
                configurable: true,
                get () {
                    var msg = "'" + sym + "' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the Emscripten FAQ)";
                    if (isExportedByForceFilesystem(sym)) msg += ". Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you";
                    abort(msg);
                }
            });
        }
        // end include: runtime_debug.js
        // === Body ===
        // end include: preamble.js
        /** @constructor */ function ExitStatus(status) {
            this.name = "ExitStatus";
            this.message = `Program terminated with exit(${status})`;
            this.status = status;
        }
        var callRuntimeCallbacks = (callbacks)=>{
            while(callbacks.length > 0)// Pass the module as the first argument.
            callbacks.shift()(Module);
        };
        var noExitRuntime = Module["noExitRuntime"] || true;
        var ptrToString = (ptr)=>{
            assert(typeof ptr === "number");
            // With CAN_ADDRESS_2GB or MEMORY64, pointers are already unsigned.
            ptr >>>= 0;
            return "0x" + ptr.toString(16).padStart(8, "0");
        };
        var warnOnce = (text)=>{
            if (!warnOnce.shown) warnOnce.shown = {};
            if (!warnOnce.shown[text]) {
                warnOnce.shown[text] = 1;
                if (ENVIRONMENT_IS_NODE) text = "warning: " + text;
                err(text);
            }
        };
        /** @constructor */ function ExceptionInfo(excPtr) {
            this.excPtr = excPtr;
            this.ptr = excPtr - 24;
            this.set_type = function(type) {
                HEAPU32[this.ptr + 4 >> 2] = type;
            };
            this.get_type = function() {
                return HEAPU32[this.ptr + 4 >> 2];
            };
            this.set_destructor = function(destructor) {
                HEAPU32[this.ptr + 8 >> 2] = destructor;
            };
            this.get_destructor = function() {
                return HEAPU32[this.ptr + 8 >> 2];
            };
            this.set_caught = function(caught) {
                caught = caught ? 1 : 0;
                HEAP8[this.ptr + 12 >> 0] = caught;
            };
            this.get_caught = function() {
                return HEAP8[this.ptr + 12 >> 0] != 0;
            };
            this.set_rethrown = function(rethrown) {
                rethrown = rethrown ? 1 : 0;
                HEAP8[this.ptr + 13 >> 0] = rethrown;
            };
            this.get_rethrown = function() {
                return HEAP8[this.ptr + 13 >> 0] != 0;
            };
            // Initialize native structure fields. Should be called once after allocated.
            this.init = function(type, destructor) {
                this.set_adjusted_ptr(0);
                this.set_type(type);
                this.set_destructor(destructor);
            };
            this.set_adjusted_ptr = function(adjustedPtr) {
                HEAPU32[this.ptr + 16 >> 2] = adjustedPtr;
            };
            this.get_adjusted_ptr = function() {
                return HEAPU32[this.ptr + 16 >> 2];
            };
            // Get pointer which is expected to be received by catch clause in C++ code. It may be adjusted
            // when the pointer is casted to some of the exception object base classes (e.g. when virtual
            // inheritance is used). When a pointer is thrown this method should return the thrown pointer
            // itself.
            this.get_exception_ptr = function() {
                // Work around a fastcomp bug, this code is still included for some reason in a build without
                // exceptions support.
                var isPointer = ___cxa_is_pointer_type(this.get_type());
                if (isPointer) return HEAPU32[this.excPtr >> 2];
                var adjusted = this.get_adjusted_ptr();
                if (adjusted !== 0) return adjusted;
                return this.excPtr;
            };
        }
        var ___cxa_throw = (ptr, type, destructor)=>{
            var info = new ExceptionInfo(ptr);
            // Initialize ExceptionInfo content after it was allocated in __cxa_allocate_exception.
            info.init(type, destructor);
            assert(false, "Exception thrown, but exception catching is not enabled. Compile with -sNO_DISABLE_EXCEPTION_CATCHING or -sEXCEPTION_CATCHING_ALLOWED=[..] to catch.");
        };
        var structRegistrations = {};
        var runDestructors = (destructors)=>{
            while(destructors.length){
                var ptr = destructors.pop();
                var del = destructors.pop();
                del(ptr);
            }
        };
        /** @suppress {globalThis} */ function simpleReadValueFromPointer(pointer) {
            return this["fromWireType"](HEAP32[pointer >> 2]);
        }
        var awaitingDependencies = {};
        var registeredTypes = {};
        var typeDependencies = {};
        var InternalError;
        var throwInternalError = (message)=>{
            throw new InternalError(message);
        };
        var whenDependentTypesAreResolved = (myTypes, dependentTypes, getTypeConverters)=>{
            myTypes.forEach(function(type) {
                typeDependencies[type] = dependentTypes;
            });
            function onComplete(typeConverters) {
                var myTypeConverters = getTypeConverters(typeConverters);
                if (myTypeConverters.length !== myTypes.length) throwInternalError("Mismatched type converter count");
                for(var i = 0; i < myTypes.length; ++i)registerType(myTypes[i], myTypeConverters[i]);
            }
            var typeConverters = new Array(dependentTypes.length);
            var unregisteredTypes = [];
            var registered = 0;
            dependentTypes.forEach((dt, i)=>{
                if (registeredTypes.hasOwnProperty(dt)) typeConverters[i] = registeredTypes[dt];
                else {
                    unregisteredTypes.push(dt);
                    if (!awaitingDependencies.hasOwnProperty(dt)) awaitingDependencies[dt] = [];
                    awaitingDependencies[dt].push(()=>{
                        typeConverters[i] = registeredTypes[dt];
                        ++registered;
                        if (registered === unregisteredTypes.length) onComplete(typeConverters);
                    });
                }
            });
            if (0 === unregisteredTypes.length) onComplete(typeConverters);
        };
        var __embind_finalize_value_object = (structType)=>{
            var reg = structRegistrations[structType];
            delete structRegistrations[structType];
            var rawConstructor = reg.rawConstructor;
            var rawDestructor = reg.rawDestructor;
            var fieldRecords = reg.fields;
            var fieldTypes = fieldRecords.map((field)=>field.getterReturnType).concat(fieldRecords.map((field)=>field.setterArgumentType));
            whenDependentTypesAreResolved([
                structType
            ], fieldTypes, (fieldTypes)=>{
                var fields = {};
                fieldRecords.forEach((field, i)=>{
                    var fieldName = field.fieldName;
                    var getterReturnType = fieldTypes[i];
                    var getter = field.getter;
                    var getterContext = field.getterContext;
                    var setterArgumentType = fieldTypes[i + fieldRecords.length];
                    var setter = field.setter;
                    var setterContext = field.setterContext;
                    fields[fieldName] = {
                        read: (ptr)=>{
                            return getterReturnType["fromWireType"](getter(getterContext, ptr));
                        },
                        write: (ptr, o)=>{
                            var destructors = [];
                            setter(setterContext, ptr, setterArgumentType["toWireType"](destructors, o));
                            runDestructors(destructors);
                        }
                    };
                });
                return [
                    {
                        name: reg.name,
                        "fromWireType": (ptr)=>{
                            var rv = {};
                            for(var i in fields)rv[i] = fields[i].read(ptr);
                            rawDestructor(ptr);
                            return rv;
                        },
                        "toWireType": (destructors, o)=>{
                            // todo: Here we have an opportunity for -O3 level "unsafe" optimizations:
                            // assume all fields are present without checking.
                            for(var fieldName in fields){
                                if (!(fieldName in o)) throw new TypeError(`Missing field: "${fieldName}"`);
                            }
                            var ptr = rawConstructor();
                            for(fieldName in fields)fields[fieldName].write(ptr, o[fieldName]);
                            if (destructors !== null) destructors.push(rawDestructor, ptr);
                            return ptr;
                        },
                        "argPackAdvance": GenericWireTypeSize,
                        "readValueFromPointer": simpleReadValueFromPointer,
                        destructorFunction: rawDestructor
                    }
                ];
            });
        };
        var __embind_register_bigint = (primitiveType, name, size, minRange, maxRange)=>{};
        var embind_init_charCodes = ()=>{
            var codes = new Array(256);
            for(var i = 0; i < 256; ++i)codes[i] = String.fromCharCode(i);
            embind_charCodes = codes;
        };
        var embind_charCodes;
        var readLatin1String = (ptr)=>{
            var ret = "";
            var c = ptr;
            while(HEAPU8[c])ret += embind_charCodes[HEAPU8[c++]];
            return ret;
        };
        var BindingError;
        var throwBindingError = (message)=>{
            throw new BindingError(message);
        };
        /** @param {Object=} options */ function sharedRegisterType(rawType, registeredInstance, options = {}) {
            var name = registeredInstance.name;
            if (!rawType) throwBindingError(`type "${name}" must have a positive integer typeid pointer`);
            if (registeredTypes.hasOwnProperty(rawType)) {
                if (options.ignoreDuplicateRegistrations) return;
                else throwBindingError(`Cannot register type '${name}' twice`);
            }
            registeredTypes[rawType] = registeredInstance;
            delete typeDependencies[rawType];
            if (awaitingDependencies.hasOwnProperty(rawType)) {
                var callbacks = awaitingDependencies[rawType];
                delete awaitingDependencies[rawType];
                callbacks.forEach((cb)=>cb());
            }
        }
        /** @param {Object=} options */ function registerType(rawType, registeredInstance, options = {}) {
            if (!("argPackAdvance" in registeredInstance)) throw new TypeError("registerType registeredInstance requires argPackAdvance");
            return sharedRegisterType(rawType, registeredInstance, options);
        }
        var GenericWireTypeSize = 8;
        /** @suppress {globalThis} */ var __embind_register_bool = (rawType, name, trueValue, falseValue)=>{
            name = readLatin1String(name);
            registerType(rawType, {
                name,
                "fromWireType": function(wt) {
                    // ambiguous emscripten ABI: sometimes return values are
                    // true or false, and sometimes integers (0 or 1)
                    return !!wt;
                },
                "toWireType": function(destructors, o) {
                    return o ? trueValue : falseValue;
                },
                "argPackAdvance": GenericWireTypeSize,
                "readValueFromPointer": function(pointer) {
                    return this["fromWireType"](HEAPU8[pointer]);
                },
                destructorFunction: null
            });
        };
        function handleAllocatorInit() {
            Object.assign(HandleAllocator.prototype, /** @lends {HandleAllocator.prototype} */ {
                get (id) {
                    assert(this.allocated[id] !== undefined, `invalid handle: ${id}`);
                    return this.allocated[id];
                },
                has (id) {
                    return this.allocated[id] !== undefined;
                },
                allocate (handle) {
                    var id = this.freelist.pop() || this.allocated.length;
                    this.allocated[id] = handle;
                    return id;
                },
                free (id) {
                    assert(this.allocated[id] !== undefined);
                    // Set the slot to `undefined` rather than using `delete` here since
                    // apparently arrays with holes in them can be less efficient.
                    this.allocated[id] = undefined;
                    this.freelist.push(id);
                }
            });
        }
        /** @constructor */ function HandleAllocator() {
            // Reserve slot 0 so that 0 is always an invalid handle
            this.allocated = [
                undefined
            ];
            this.freelist = [];
        }
        var emval_handles = new HandleAllocator();
        var __emval_decref = (handle)=>{
            if (handle >= emval_handles.reserved && 0 === --emval_handles.get(handle).refcount) emval_handles.free(handle);
        };
        var count_emval_handles = ()=>{
            var count = 0;
            for(var i = emval_handles.reserved; i < emval_handles.allocated.length; ++i)if (emval_handles.allocated[i] !== undefined) ++count;
            return count;
        };
        var init_emval = ()=>{
            // reserve some special values. These never get de-allocated.
            // The HandleAllocator takes care of reserving zero.
            emval_handles.allocated.push({
                value: undefined
            }, {
                value: null
            }, {
                value: true
            }, {
                value: false
            });
            emval_handles.reserved = emval_handles.allocated.length;
            Module["count_emval_handles"] = count_emval_handles;
        };
        var Emval = {
            toValue: (handle)=>{
                if (!handle) throwBindingError("Cannot use deleted val. handle = " + handle);
                return emval_handles.get(handle).value;
            },
            toHandle: (value)=>{
                switch(value){
                    case undefined:
                        return 1;
                    case null:
                        return 2;
                    case true:
                        return 3;
                    case false:
                        return 4;
                    default:
                        return emval_handles.allocate({
                            refcount: 1,
                            value: value
                        });
                }
            }
        };
        var __embind_register_emval = (rawType, name)=>{
            name = readLatin1String(name);
            registerType(rawType, {
                name,
                "fromWireType": (handle)=>{
                    var rv = Emval.toValue(handle);
                    __emval_decref(handle);
                    return rv;
                },
                "toWireType": (destructors, value)=>Emval.toHandle(value),
                "argPackAdvance": GenericWireTypeSize,
                "readValueFromPointer": simpleReadValueFromPointer,
                destructorFunction: null
            });
        };
        var embindRepr = (v)=>{
            if (v === null) return "null";
            var t = typeof v;
            if (t === "object" || t === "array" || t === "function") return v.toString();
            else return "" + v;
        };
        var floatReadValueFromPointer = (name, width)=>{
            switch(width){
                case 4:
                    return function(pointer) {
                        return this["fromWireType"](HEAPF32[pointer >> 2]);
                    };
                case 8:
                    return function(pointer) {
                        return this["fromWireType"](HEAPF64[pointer >> 3]);
                    };
                default:
                    throw new TypeError(`invalid float width (${width}): ${name}`);
            }
        };
        var __embind_register_float = (rawType, name, size)=>{
            name = readLatin1String(name);
            registerType(rawType, {
                name,
                "fromWireType": (value)=>value,
                "toWireType": (destructors, value)=>{
                    if (typeof value != "number" && typeof value != "boolean") throw new TypeError(`Cannot convert ${embindRepr(value)} to ${this.name}`);
                    // The VM will perform JS to Wasm value conversion, according to the spec:
                    // https://www.w3.org/TR/wasm-js-api-1/#towebassemblyvalue
                    return value;
                },
                "argPackAdvance": GenericWireTypeSize,
                "readValueFromPointer": floatReadValueFromPointer(name, size),
                destructorFunction: null
            });
        };
        var char_0 = 48;
        var char_9 = 57;
        var makeLegalFunctionName = (name)=>{
            if (undefined === name) return "_unknown";
            name = name.replace(/[^a-zA-Z0-9_]/g, "$");
            var f = name.charCodeAt(0);
            if (f >= char_0 && f <= char_9) return `_${name}`;
            return name;
        };
        function createNamedFunction(name, body) {
            name = makeLegalFunctionName(name);
            // Use an abject with a computed property name to create a new function with
            // a name specified at runtime, but without using `new Function` or `eval`.
            return ({
                [name]: function() {
                    return body.apply(this, arguments);
                }
            })[name];
        }
        function newFunc(constructor, argumentList) {
            if (!(constructor instanceof Function)) throw new TypeError(`new_ called with constructor type ${typeof constructor} which is not a function`);
            /*
		 * Previously, the following line was just:
		 *   function dummy() {};
		 * Unfortunately, Chrome was preserving 'dummy' as the object's name, even
		 * though at creation, the 'dummy' has the correct constructor name.  Thus,
		 * objects created with IMVU.new would show up in the debugger as 'dummy',
		 * which isn't very helpful.  Using IMVU.createNamedFunction addresses the
		 * issue.  Doublely-unfortunately, there's no way to write a test for this
		 * behavior.  -NRD 2013.02.22
		 */ var dummy = createNamedFunction(constructor.name || "unknownFunctionName", function() {});
            dummy.prototype = constructor.prototype;
            var obj = new dummy;
            var r = constructor.apply(obj, argumentList);
            return r instanceof Object ? r : obj;
        }
        function craftInvokerFunction(humanName, argTypes, classType, cppInvokerFunc, cppTargetFunc, /** boolean= */ isAsync) {
            // humanName: a human-readable string name for the function to be generated.
            // argTypes: An array that contains the embind type objects for all types in the function signature.
            //    argTypes[0] is the type object for the function return value.
            //    argTypes[1] is the type object for function this object/class type, or null if not crafting an invoker for a class method.
            //    argTypes[2...] are the actual function parameters.
            // classType: The embind type object for the class to be bound, or null if this is not a method of a class.
            // cppInvokerFunc: JS Function object to the C++-side function that interops into C++ code.
            // cppTargetFunc: Function pointer (an integer to FUNCTION_TABLE) to the target C++ function the cppInvokerFunc will end up calling.
            // isAsync: Optional. If true, returns an async function. Async bindings are only supported with JSPI.
            var argCount = argTypes.length;
            if (argCount < 2) throwBindingError("argTypes array size mismatch! Must at least get return value and 'this' types!");
            assert(!isAsync, "Async bindings are only supported with JSPI.");
            var isClassMethodFunc = argTypes[1] !== null && classType !== null;
            // Free functions with signature "void function()" do not need an invoker that marshalls between wire types.
            // TODO: This omits argument count check - enable only at -O3 or similar.
            //    if (ENABLE_UNSAFE_OPTS && argCount == 2 && argTypes[0].name == "void" && !isClassMethodFunc) {
            //       return FUNCTION_TABLE[fn];
            //    }
            // Determine if we need to use a dynamic stack to store the destructors for the function parameters.
            // TODO: Remove this completely once all function invokers are being dynamically generated.
            var needsDestructorStack = false;
            for(var i = 1; i < argTypes.length; ++i)if (argTypes[i] !== null && argTypes[i].destructorFunction === undefined) {
                needsDestructorStack = true;
                break;
            }
            var returns = argTypes[0].name !== "void";
            var argsList = "";
            var argsListWired = "";
            for(var i = 0; i < argCount - 2; ++i){
                argsList += (i !== 0 ? ", " : "") + "arg" + i;
                argsListWired += (i !== 0 ? ", " : "") + "arg" + i + "Wired";
            }
            var invokerFnBody = `
		  return function ${makeLegalFunctionName(humanName)}(${argsList}) {
		  if (arguments.length !== ${argCount - 2}) {
			throwBindingError('function ${humanName} called with ' + arguments.length + ' arguments, expected ${argCount - 2}');
		  }`;
            if (needsDestructorStack) invokerFnBody += "var destructors = [];\n";
            var dtorStack = needsDestructorStack ? "destructors" : "null";
            var args1 = [
                "throwBindingError",
                "invoker",
                "fn",
                "runDestructors",
                "retType",
                "classParam"
            ];
            var args2 = [
                throwBindingError,
                cppInvokerFunc,
                cppTargetFunc,
                runDestructors,
                argTypes[0],
                argTypes[1]
            ];
            if (isClassMethodFunc) invokerFnBody += "var thisWired = classParam.toWireType(" + dtorStack + ", this);\n";
            for(var i = 0; i < argCount - 2; ++i){
                invokerFnBody += "var arg" + i + "Wired = argType" + i + ".toWireType(" + dtorStack + ", arg" + i + "); // " + argTypes[i + 2].name + "\n";
                args1.push("argType" + i);
                args2.push(argTypes[i + 2]);
            }
            if (isClassMethodFunc) argsListWired = "thisWired" + (argsListWired.length > 0 ? ", " : "") + argsListWired;
            invokerFnBody += (returns || isAsync ? "var rv = " : "") + "invoker(fn" + (argsListWired.length > 0 ? ", " : "") + argsListWired + ");\n";
            if (needsDestructorStack) invokerFnBody += "runDestructors(destructors);\n";
            else for(var i = isClassMethodFunc ? 1 : 2; i < argTypes.length; ++i){
                var paramName = i === 1 ? "thisWired" : "arg" + (i - 2) + "Wired";
                if (argTypes[i].destructorFunction !== null) {
                    invokerFnBody += paramName + "_dtor(" + paramName + "); // " + argTypes[i].name + "\n";
                    args1.push(paramName + "_dtor");
                    args2.push(argTypes[i].destructorFunction);
                }
            }
            if (returns) invokerFnBody += "var ret = retType.fromWireType(rv);\nreturn ret;\n";
            invokerFnBody += "}\n";
            args1.push(invokerFnBody);
            return newFunc(Function, args1).apply(null, args2);
        }
        var ensureOverloadTable = (proto, methodName, humanName)=>{
            if (undefined === proto[methodName].overloadTable) {
                var prevFunc = proto[methodName];
                // Inject an overload resolver function that routes to the appropriate overload based on the number of arguments.
                proto[methodName] = function() {
                    // TODO This check can be removed in -O3 level "unsafe" optimizations.
                    if (!proto[methodName].overloadTable.hasOwnProperty(arguments.length)) throwBindingError(`Function '${humanName}' called with an invalid number of arguments (${arguments.length}) - expects one of (${proto[methodName].overloadTable})!`);
                    return proto[methodName].overloadTable[arguments.length].apply(this, arguments);
                };
                // Move the previous function into the overload table.
                proto[methodName].overloadTable = [];
                proto[methodName].overloadTable[prevFunc.argCount] = prevFunc;
            }
        };
        /** @param {number=} numArguments */ var exposePublicSymbol = (name, value, numArguments)=>{
            if (Module.hasOwnProperty(name)) {
                if (undefined === numArguments || undefined !== Module[name].overloadTable && undefined !== Module[name].overloadTable[numArguments]) throwBindingError(`Cannot register public name '${name}' twice`);
                // We are exposing a function with the same name as an existing function. Create an overload table and a function selector
                // that routes between the two.
                ensureOverloadTable(Module, name, name);
                if (Module.hasOwnProperty(numArguments)) throwBindingError(`Cannot register multiple overloads of a function with the same number of arguments (${numArguments})!`);
                // Add the new function into the overload table.
                Module[name].overloadTable[numArguments] = value;
            } else {
                Module[name] = value;
                if (undefined !== numArguments) Module[name].numArguments = numArguments;
            }
        };
        var heap32VectorToArray = (count, firstElement)=>{
            var array = [];
            for(var i = 0; i < count; i++)// TODO(https://github.com/emscripten-core/emscripten/issues/17310):
            // Find a way to hoist the `>> 2` or `>> 3` out of this loop.
            array.push(HEAPU32[firstElement + i * 4 >> 2]);
            return array;
        };
        /** @param {number=} numArguments */ var replacePublicSymbol = (name, value, numArguments)=>{
            if (!Module.hasOwnProperty(name)) throwInternalError("Replacing nonexistant public symbol");
            // If there's an overload table for this symbol, replace the symbol in the overload table instead.
            if (undefined !== Module[name].overloadTable && undefined !== numArguments) Module[name].overloadTable[numArguments] = value;
            else {
                Module[name] = value;
                Module[name].argCount = numArguments;
            }
        };
        var dynCallLegacy = (sig, ptr, args)=>{
            assert("dynCall_" + sig in Module, `bad function pointer type - dynCall function not found for sig '${sig}'`);
            if (args && args.length) // j (64-bit integer) must be passed in as two numbers [low 32, high 32].
            assert(args.length === sig.substring(1).replace(/j/g, "--").length);
            else assert(sig.length == 1);
            var f = Module["dynCall_" + sig];
            return args && args.length ? f.apply(null, [
                ptr
            ].concat(args)) : f.call(null, ptr);
        };
        var wasmTableMirror = [];
        var wasmTable;
        var getWasmTableEntry = (funcPtr)=>{
            var func = wasmTableMirror[funcPtr];
            if (!func) {
                if (funcPtr >= wasmTableMirror.length) wasmTableMirror.length = funcPtr + 1;
                wasmTableMirror[funcPtr] = func = wasmTable.get(funcPtr);
            }
            assert(wasmTable.get(funcPtr) == func, "JavaScript-side Wasm function table mirror is out of date!");
            return func;
        };
        /** @param {Object=} args */ var dynCall = (sig, ptr, args)=>{
            // Without WASM_BIGINT support we cannot directly call function with i64 as
            // part of thier signature, so we rely the dynCall functions generated by
            // wasm-emscripten-finalize
            if (sig.includes("j")) return dynCallLegacy(sig, ptr, args);
            assert(getWasmTableEntry(ptr), `missing table entry in dynCall: ${ptr}`);
            var rtn = getWasmTableEntry(ptr).apply(null, args);
            return rtn;
        };
        var getDynCaller = (sig, ptr)=>{
            assert(sig.includes("j") || sig.includes("p"), "getDynCaller should only be called with i64 sigs");
            var argCache = [];
            return function() {
                argCache.length = 0;
                Object.assign(argCache, arguments);
                return dynCall(sig, ptr, argCache);
            };
        };
        var embind__requireFunction = (signature, rawFunction)=>{
            signature = readLatin1String(signature);
            function makeDynCaller() {
                if (signature.includes("j")) return getDynCaller(signature, rawFunction);
                return getWasmTableEntry(rawFunction);
            }
            var fp = makeDynCaller();
            if (typeof fp != "function") throwBindingError(`unknown function pointer with signature ${signature}: ${rawFunction}`);
            return fp;
        };
        var extendError = (baseErrorType, errorName)=>{
            var errorClass = createNamedFunction(errorName, function(message) {
                this.name = errorName;
                this.message = message;
                var stack = new Error(message).stack;
                if (stack !== undefined) this.stack = this.toString() + "\n" + stack.replace(/^Error(:[^\n]*)?\n/, "");
            });
            errorClass.prototype = Object.create(baseErrorType.prototype);
            errorClass.prototype.constructor = errorClass;
            errorClass.prototype.toString = function() {
                if (this.message === undefined) return this.name;
                else return `${this.name}: ${this.message}`;
            };
            return errorClass;
        };
        var UnboundTypeError;
        var getTypeName = (type)=>{
            var ptr = ___getTypeName(type);
            var rv = readLatin1String(ptr);
            _free(ptr);
            return rv;
        };
        var throwUnboundTypeError = (message, types)=>{
            var unboundTypes = [];
            var seen = {};
            function visit(type) {
                if (seen[type]) return;
                if (registeredTypes[type]) return;
                if (typeDependencies[type]) {
                    typeDependencies[type].forEach(visit);
                    return;
                }
                unboundTypes.push(type);
                seen[type] = true;
            }
            types.forEach(visit);
            throw new UnboundTypeError(`${message}: ` + unboundTypes.map(getTypeName).join([
                ", "
            ]));
        };
        var getFunctionName = (signature)=>{
            signature = signature.trim();
            const argsIndex = signature.indexOf("(");
            if (argsIndex !== -1) {
                assert(signature[signature.length - 1] == ")", "Parentheses for argument names should match.");
                return signature.substr(0, argsIndex);
            } else return signature;
        };
        var __embind_register_function = (name, argCount, rawArgTypesAddr, signature, rawInvoker, fn, isAsync)=>{
            var argTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
            name = readLatin1String(name);
            name = getFunctionName(name);
            rawInvoker = embind__requireFunction(signature, rawInvoker);
            exposePublicSymbol(name, function() {
                throwUnboundTypeError(`Cannot call ${name} due to unbound types`, argTypes);
            }, argCount - 1);
            whenDependentTypesAreResolved([], argTypes, function(argTypes) {
                var invokerArgsArray = [
                    argTypes[0],
                    null
                ].concat(argTypes.slice(1));
                replacePublicSymbol(name, craftInvokerFunction(name, invokerArgsArray, null, rawInvoker, fn, isAsync), argCount - 1);
                return [];
            });
        };
        var integerReadValueFromPointer = (name, width, signed)=>{
            // integers are quite common, so generate very specialized functions
            switch(width){
                case 1:
                    return signed ? (pointer)=>HEAP8[pointer >> 0] : (pointer)=>HEAPU8[pointer >> 0];
                case 2:
                    return signed ? (pointer)=>HEAP16[pointer >> 1] : (pointer)=>HEAPU16[pointer >> 1];
                case 4:
                    return signed ? (pointer)=>HEAP32[pointer >> 2] : (pointer)=>HEAPU32[pointer >> 2];
                default:
                    throw new TypeError(`invalid integer width (${width}): ${name}`);
            }
        };
        /** @suppress {globalThis} */ var __embind_register_integer = (primitiveType, name, size, minRange, maxRange)=>{
            name = readLatin1String(name);
            // LLVM doesn't have signed and unsigned 32-bit types, so u32 literals come
            // out as 'i32 -1'. Always treat those as max u32.
            if (maxRange === -1) maxRange = 4294967295;
            var fromWireType = (value)=>value;
            if (minRange === 0) {
                var bitshift = 32 - 8 * size;
                fromWireType = (value)=>value << bitshift >>> bitshift;
            }
            var isUnsignedType = name.includes("unsigned");
            var checkAssertions = (value, toTypeName)=>{
                if (typeof value != "number" && typeof value != "boolean") throw new TypeError(`Cannot convert "${embindRepr(value)}" to ${toTypeName}`);
                if (value < minRange || value > maxRange) throw new TypeError(`Passing a number "${embindRepr(value)}" from JS side to C/C++ side to an argument of type "${name}", which is outside the valid range [${minRange}, ${maxRange}]!`);
            };
            var toWireType;
            if (isUnsignedType) toWireType = function(destructors, value) {
                checkAssertions(value, this.name);
                return value >>> 0;
            };
            else toWireType = function(destructors, value) {
                checkAssertions(value, this.name);
                // The VM will perform JS to Wasm value conversion, according to the spec:
                // https://www.w3.org/TR/wasm-js-api-1/#towebassemblyvalue
                return value;
            };
            registerType(primitiveType, {
                name,
                "fromWireType": fromWireType,
                "toWireType": toWireType,
                "argPackAdvance": GenericWireTypeSize,
                "readValueFromPointer": integerReadValueFromPointer(name, size, minRange !== 0),
                destructorFunction: null
            });
        };
        var __embind_register_memory_view = (rawType, dataTypeIndex, name)=>{
            var typeMapping = [
                Int8Array,
                Uint8Array,
                Int16Array,
                Uint16Array,
                Int32Array,
                Uint32Array,
                Float32Array,
                Float64Array
            ];
            var TA = typeMapping[dataTypeIndex];
            function decodeMemoryView(handle) {
                var size = HEAPU32[handle >> 2];
                var data = HEAPU32[handle + 4 >> 2];
                return new TA(HEAP8.buffer, data, size);
            }
            name = readLatin1String(name);
            registerType(rawType, {
                name,
                "fromWireType": decodeMemoryView,
                "argPackAdvance": GenericWireTypeSize,
                "readValueFromPointer": decodeMemoryView
            }, {
                ignoreDuplicateRegistrations: true
            });
        };
        /** @suppress {globalThis} */ function readPointer(pointer) {
            return this["fromWireType"](HEAPU32[pointer >> 2]);
        }
        var stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite)=>{
            assert(typeof str === "string");
            // Parameter maxBytesToWrite is not optional. Negative values, 0, null,
            // undefined and false each don't write out any bytes.
            if (!(maxBytesToWrite > 0)) return 0;
            var startIdx = outIdx;
            var endIdx = outIdx + maxBytesToWrite - 1; // -1 for string null terminator.
            for(var i = 0; i < str.length; ++i){
                // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code
                // unit, not a Unicode code point of the character! So decode
                // UTF16->UTF32->UTF8.
                // See http://unicode.org/faq/utf_bom.html#utf16-3
                // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description
                // and https://www.ietf.org/rfc/rfc2279.txt
                // and https://tools.ietf.org/html/rfc3629
                var u = str.charCodeAt(i); // possibly a lead surrogate
                if (u >= 0xD800 && u <= 0xDFFF) {
                    var u1 = str.charCodeAt(++i);
                    u = 0x10000 + ((u & 0x3FF) << 10) | u1 & 0x3FF;
                }
                if (u <= 0x7F) {
                    if (outIdx >= endIdx) break;
                    heap[outIdx++] = u;
                } else if (u <= 0x7FF) {
                    if (outIdx + 1 >= endIdx) break;
                    heap[outIdx++] = 0xC0 | u >> 6;
                    heap[outIdx++] = 0x80 | u & 63;
                } else if (u <= 0xFFFF) {
                    if (outIdx + 2 >= endIdx) break;
                    heap[outIdx++] = 0xE0 | u >> 12;
                    heap[outIdx++] = 0x80 | u >> 6 & 63;
                    heap[outIdx++] = 0x80 | u & 63;
                } else {
                    if (outIdx + 3 >= endIdx) break;
                    if (u > 0x10FFFF) warnOnce("Invalid Unicode code point " + ptrToString(u) + " encountered when serializing a JS string to a UTF-8 string in wasm memory! (Valid unicode code points should be in range 0-0x10FFFF).");
                    heap[outIdx++] = 0xF0 | u >> 18;
                    heap[outIdx++] = 0x80 | u >> 12 & 63;
                    heap[outIdx++] = 0x80 | u >> 6 & 63;
                    heap[outIdx++] = 0x80 | u & 63;
                }
            }
            // Null-terminate the pointer to the buffer.
            heap[outIdx] = 0;
            return outIdx - startIdx;
        };
        var stringToUTF8 = (str, outPtr, maxBytesToWrite)=>{
            assert(typeof maxBytesToWrite == "number", "stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!");
            return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
        };
        var lengthBytesUTF8 = (str)=>{
            var len = 0;
            for(var i = 0; i < str.length; ++i){
                // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code
                // unit, not a Unicode code point of the character! So decode
                // UTF16->UTF32->UTF8.
                // See http://unicode.org/faq/utf_bom.html#utf16-3
                var c = str.charCodeAt(i); // possibly a lead surrogate
                if (c <= 0x7F) len++;
                else if (c <= 0x7FF) len += 2;
                else if (c >= 0xD800 && c <= 0xDFFF) {
                    len += 4;
                    ++i;
                } else len += 3;
            }
            return len;
        };
        var UTF8Decoder = typeof TextDecoder != "undefined" ? new TextDecoder("utf8") : undefined;
        /**
	   * Given a pointer 'idx' to a null-terminated UTF8-encoded string in the given
	   * array that contains uint8 values, returns a copy of that string as a
	   * Javascript String object.
	   * heapOrArray is either a regular array, or a JavaScript typed array view.
	   * @param {number} idx
	   * @param {number=} maxBytesToRead
	   * @return {string}
	   */ var UTF8ArrayToString = (heapOrArray, idx, maxBytesToRead)=>{
            var endIdx = idx + maxBytesToRead;
            var endPtr = idx;
            // TextDecoder needs to know the byte length in advance, it doesn't stop on
            // null terminator by itself.  Also, use the length info to avoid running tiny
            // strings through TextDecoder, since .subarray() allocates garbage.
            // (As a tiny code save trick, compare endPtr against endIdx using a negation,
            // so that undefined means Infinity)
            while(heapOrArray[endPtr] && !(endPtr >= endIdx))++endPtr;
            if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
            var str = "";
            // If building with TextDecoder, we have already computed the string length
            // above, so test loop end condition against that
            while(idx < endPtr){
                // For UTF8 byte structure, see:
                // http://en.wikipedia.org/wiki/UTF-8#Description
                // https://www.ietf.org/rfc/rfc2279.txt
                // https://tools.ietf.org/html/rfc3629
                var u0 = heapOrArray[idx++];
                if (!(u0 & 0x80)) {
                    str += String.fromCharCode(u0);
                    continue;
                }
                var u1 = heapOrArray[idx++] & 63;
                if ((u0 & 0xE0) == 0xC0) {
                    str += String.fromCharCode((u0 & 31) << 6 | u1);
                    continue;
                }
                var u2 = heapOrArray[idx++] & 63;
                if ((u0 & 0xF0) == 0xE0) u0 = (u0 & 15) << 12 | u1 << 6 | u2;
                else {
                    if ((u0 & 0xF8) != 0xF0) warnOnce("Invalid UTF-8 leading byte " + ptrToString(u0) + " encountered when deserializing a UTF-8 string in wasm memory to a JS string!");
                    u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heapOrArray[idx++] & 63;
                }
                if (u0 < 0x10000) str += String.fromCharCode(u0);
                else {
                    var ch = u0 - 0x10000;
                    str += String.fromCharCode(0xD800 | ch >> 10, 0xDC00 | ch & 0x3FF);
                }
            }
            return str;
        };
        /**
	   * Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the
	   * emscripten HEAP, returns a copy of that string as a Javascript String object.
	   *
	   * @param {number} ptr
	   * @param {number=} maxBytesToRead - An optional length that specifies the
	   *   maximum number of bytes to read. You can omit this parameter to scan the
	   *   string until the first 0 byte. If maxBytesToRead is passed, and the string
	   *   at [ptr, ptr+maxBytesToReadr[ contains a null byte in the middle, then the
	   *   string will cut short at that byte index (i.e. maxBytesToRead will not
	   *   produce a string of exact length [ptr, ptr+maxBytesToRead[) N.B. mixing
	   *   frequent uses of UTF8ToString() with and without maxBytesToRead may throw
	   *   JS JIT optimizations off, so it is worth to consider consistently using one
	   * @return {string}
	   */ var UTF8ToString = (ptr, maxBytesToRead)=>{
            assert(typeof ptr == "number");
            return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
        };
        var __embind_register_std_string = (rawType, name)=>{
            name = readLatin1String(name);
            var stdStringIsUTF8 = name === "std::string";
            registerType(rawType, {
                name,
                // For some method names we use string keys here since they are part of
                // the public/external API and/or used by the runtime-generated code.
                "fromWireType" (value) {
                    var length = HEAPU32[value >> 2];
                    var payload = value + 4;
                    var str;
                    if (stdStringIsUTF8) {
                        var decodeStartPtr = payload;
                        // Looping here to support possible embedded '0' bytes
                        for(var i = 0; i <= length; ++i){
                            var currentBytePtr = payload + i;
                            if (i == length || HEAPU8[currentBytePtr] == 0) {
                                var maxRead = currentBytePtr - decodeStartPtr;
                                var stringSegment = UTF8ToString(decodeStartPtr, maxRead);
                                if (str === undefined) str = stringSegment;
                                else {
                                    str += String.fromCharCode(0);
                                    str += stringSegment;
                                }
                                decodeStartPtr = currentBytePtr + 1;
                            }
                        }
                    } else {
                        var a = new Array(length);
                        for(var i = 0; i < length; ++i)a[i] = String.fromCharCode(HEAPU8[payload + i]);
                        str = a.join("");
                    }
                    _free(value);
                    return str;
                },
                "toWireType" (destructors, value) {
                    if (value instanceof ArrayBuffer) value = new Uint8Array(value);
                    var length;
                    var valueIsOfTypeString = typeof value == "string";
                    if (!(valueIsOfTypeString || value instanceof Uint8Array || value instanceof Uint8ClampedArray || value instanceof Int8Array)) throwBindingError("Cannot pass non-string to std::string");
                    if (stdStringIsUTF8 && valueIsOfTypeString) length = lengthBytesUTF8(value);
                    else length = value.length;
                    // assumes 4-byte alignment
                    var base = _malloc(4 + length + 1);
                    var ptr = base + 4;
                    HEAPU32[base >> 2] = length;
                    if (stdStringIsUTF8 && valueIsOfTypeString) stringToUTF8(value, ptr, length + 1);
                    else {
                        if (valueIsOfTypeString) for(var i = 0; i < length; ++i){
                            var charCode = value.charCodeAt(i);
                            if (charCode > 255) {
                                _free(ptr);
                                throwBindingError("String has UTF-16 code units that do not fit in 8 bits");
                            }
                            HEAPU8[ptr + i] = charCode;
                        }
                        else for(var i = 0; i < length; ++i)HEAPU8[ptr + i] = value[i];
                    }
                    if (destructors !== null) destructors.push(_free, base);
                    return base;
                },
                "argPackAdvance": GenericWireTypeSize,
                "readValueFromPointer": readPointer,
                destructorFunction (ptr) {
                    _free(ptr);
                }
            });
        };
        var UTF16Decoder = typeof TextDecoder != "undefined" ? new TextDecoder("utf-16le") : undefined;
        var UTF16ToString = (ptr, maxBytesToRead)=>{
            assert(ptr % 2 == 0, "Pointer passed to UTF16ToString must be aligned to two bytes!");
            var endPtr = ptr;
            // TextDecoder needs to know the byte length in advance, it doesn't stop on
            // null terminator by itself.
            // Also, use the length info to avoid running tiny strings through
            // TextDecoder, since .subarray() allocates garbage.
            var idx = endPtr >> 1;
            var maxIdx = idx + maxBytesToRead / 2;
            // If maxBytesToRead is not passed explicitly, it will be undefined, and this
            // will always evaluate to true. This saves on code size.
            while(!(idx >= maxIdx) && HEAPU16[idx])++idx;
            endPtr = idx << 1;
            if (endPtr - ptr > 32 && UTF16Decoder) return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr));
            // Fallback: decode without UTF16Decoder
            var str = "";
            // If maxBytesToRead is not passed explicitly, it will be undefined, and the
            // for-loop's condition will always evaluate to true. The loop is then
            // terminated on the first null char.
            for(var i = 0; !(i >= maxBytesToRead / 2); ++i){
                var codeUnit = HEAP16[ptr + i * 2 >> 1];
                if (codeUnit == 0) break;
                // fromCharCode constructs a character from a UTF-16 code unit, so we can
                // pass the UTF16 string right through.
                str += String.fromCharCode(codeUnit);
            }
            return str;
        };
        var stringToUTF16 = (str, outPtr, maxBytesToWrite)=>{
            assert(outPtr % 2 == 0, "Pointer passed to stringToUTF16 must be aligned to two bytes!");
            assert(typeof maxBytesToWrite == "number", "stringToUTF16(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!");
            // Backwards compatibility: if max bytes is not specified, assume unsafe unbounded write is allowed.
            if (maxBytesToWrite === undefined) maxBytesToWrite = 0x7FFFFFFF;
            if (maxBytesToWrite < 2) return 0;
            maxBytesToWrite -= 2; // Null terminator.
            var startPtr = outPtr;
            var numCharsToWrite = maxBytesToWrite < str.length * 2 ? maxBytesToWrite / 2 : str.length;
            for(var i = 0; i < numCharsToWrite; ++i){
                // charCodeAt returns a UTF-16 encoded code unit, so it can be directly written to the HEAP.
                var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
                HEAP16[outPtr >> 1] = codeUnit;
                outPtr += 2;
            }
            // Null-terminate the pointer to the HEAP.
            HEAP16[outPtr >> 1] = 0;
            return outPtr - startPtr;
        };
        var lengthBytesUTF16 = (str)=>{
            return str.length * 2;
        };
        var UTF32ToString = (ptr, maxBytesToRead)=>{
            assert(ptr % 4 == 0, "Pointer passed to UTF32ToString must be aligned to four bytes!");
            var i = 0;
            var str = "";
            // If maxBytesToRead is not passed explicitly, it will be undefined, and this
            // will always evaluate to true. This saves on code size.
            while(!(i >= maxBytesToRead / 4)){
                var utf32 = HEAP32[ptr + i * 4 >> 2];
                if (utf32 == 0) break;
                ++i;
                // Gotcha: fromCharCode constructs a character from a UTF-16 encoded code (pair), not from a Unicode code point! So encode the code point to UTF-16 for constructing.
                // See http://unicode.org/faq/utf_bom.html#utf16-3
                if (utf32 >= 0x10000) {
                    var ch = utf32 - 0x10000;
                    str += String.fromCharCode(0xD800 | ch >> 10, 0xDC00 | ch & 0x3FF);
                } else str += String.fromCharCode(utf32);
            }
            return str;
        };
        var stringToUTF32 = (str, outPtr, maxBytesToWrite)=>{
            assert(outPtr % 4 == 0, "Pointer passed to stringToUTF32 must be aligned to four bytes!");
            assert(typeof maxBytesToWrite == "number", "stringToUTF32(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!");
            // Backwards compatibility: if max bytes is not specified, assume unsafe unbounded write is allowed.
            if (maxBytesToWrite === undefined) maxBytesToWrite = 0x7FFFFFFF;
            if (maxBytesToWrite < 4) return 0;
            var startPtr = outPtr;
            var endPtr = startPtr + maxBytesToWrite - 4;
            for(var i = 0; i < str.length; ++i){
                // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
                // See http://unicode.org/faq/utf_bom.html#utf16-3
                var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
                if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) {
                    var trailSurrogate = str.charCodeAt(++i);
                    codeUnit = 0x10000 + ((codeUnit & 0x3FF) << 10) | trailSurrogate & 0x3FF;
                }
                HEAP32[outPtr >> 2] = codeUnit;
                outPtr += 4;
                if (outPtr + 4 > endPtr) break;
            }
            // Null-terminate the pointer to the HEAP.
            HEAP32[outPtr >> 2] = 0;
            return outPtr - startPtr;
        };
        var lengthBytesUTF32 = (str)=>{
            var len = 0;
            for(var i = 0; i < str.length; ++i){
                // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
                // See http://unicode.org/faq/utf_bom.html#utf16-3
                var codeUnit = str.charCodeAt(i);
                if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) ++i; // possibly a lead surrogate, so skip over the tail surrogate.
                len += 4;
            }
            return len;
        };
        var __embind_register_std_wstring = (rawType, charSize, name)=>{
            name = readLatin1String(name);
            var decodeString, encodeString, getHeap, lengthBytesUTF, shift;
            if (charSize === 2) {
                decodeString = UTF16ToString;
                encodeString = stringToUTF16;
                lengthBytesUTF = lengthBytesUTF16;
                getHeap = ()=>HEAPU16;
                shift = 1;
            } else if (charSize === 4) {
                decodeString = UTF32ToString;
                encodeString = stringToUTF32;
                lengthBytesUTF = lengthBytesUTF32;
                getHeap = ()=>HEAPU32;
                shift = 2;
            }
            registerType(rawType, {
                name,
                "fromWireType": (value)=>{
                    // Code mostly taken from _embind_register_std_string fromWireType
                    var length = HEAPU32[value >> 2];
                    var HEAP = getHeap();
                    var str;
                    var decodeStartPtr = value + 4;
                    // Looping here to support possible embedded '0' bytes
                    for(var i = 0; i <= length; ++i){
                        var currentBytePtr = value + 4 + i * charSize;
                        if (i == length || HEAP[currentBytePtr >> shift] == 0) {
                            var maxReadBytes = currentBytePtr - decodeStartPtr;
                            var stringSegment = decodeString(decodeStartPtr, maxReadBytes);
                            if (str === undefined) str = stringSegment;
                            else {
                                str += String.fromCharCode(0);
                                str += stringSegment;
                            }
                            decodeStartPtr = currentBytePtr + charSize;
                        }
                    }
                    _free(value);
                    return str;
                },
                "toWireType": (destructors, value)=>{
                    if (!(typeof value == "string")) throwBindingError(`Cannot pass non-string to C++ string type ${name}`);
                    // assumes 4-byte alignment
                    var length = lengthBytesUTF(value);
                    var ptr = _malloc(4 + length + charSize);
                    HEAPU32[ptr >> 2] = length >> shift;
                    encodeString(value, ptr + 4, length + charSize);
                    if (destructors !== null) destructors.push(_free, ptr);
                    return ptr;
                },
                "argPackAdvance": GenericWireTypeSize,
                "readValueFromPointer": simpleReadValueFromPointer,
                destructorFunction (ptr) {
                    _free(ptr);
                }
            });
        };
        var __embind_register_value_object = (rawType, name, constructorSignature, rawConstructor, destructorSignature, rawDestructor)=>{
            structRegistrations[rawType] = {
                name: readLatin1String(name),
                rawConstructor: embind__requireFunction(constructorSignature, rawConstructor),
                rawDestructor: embind__requireFunction(destructorSignature, rawDestructor),
                fields: []
            };
        };
        var __embind_register_value_object_field = (structType, fieldName, getterReturnType, getterSignature, getter, getterContext, setterArgumentType, setterSignature, setter, setterContext)=>{
            structRegistrations[structType].fields.push({
                fieldName: readLatin1String(fieldName),
                getterReturnType,
                getter: embind__requireFunction(getterSignature, getter),
                getterContext,
                setterArgumentType,
                setter: embind__requireFunction(setterSignature, setter),
                setterContext
            });
        };
        var __embind_register_void = (rawType, name)=>{
            name = readLatin1String(name);
            registerType(rawType, {
                isVoid: true,
                name,
                "argPackAdvance": 0,
                "fromWireType": ()=>undefined,
                // TODO: assert if anything else is given?
                "toWireType": (destructors, o)=>undefined
            });
        };
        var __emscripten_throw_longjmp = ()=>{
            throw Infinity;
        };
        var __emval_incref = (handle)=>{
            if (handle > 4) emval_handles.get(handle).refcount += 1;
        };
        var emval_symbols = {};
        var getStringOrSymbol = (address)=>{
            var symbol = emval_symbols[address];
            if (symbol === undefined) return readLatin1String(address);
            return symbol;
        };
        var __emval_new_cstring = (v)=>{
            return Emval.toHandle(getStringOrSymbol(v));
        };
        var requireRegisteredType = (rawType, humanName)=>{
            var impl = registeredTypes[rawType];
            if (undefined === impl) throwBindingError(humanName + " has unknown type " + getTypeName(rawType));
            return impl;
        };
        var __emval_take_value = (type, arg)=>{
            type = requireRegisteredType(type, "_emval_take_value");
            var v = type["readValueFromPointer"](arg);
            return Emval.toHandle(v);
        };
        var _abort = ()=>{
            abort("native code called abort()");
        };
        var _emscripten_memcpy_js = (dest, src, num)=>HEAPU8.copyWithin(dest, src, src + num);
        var getHeapMax = ()=>// Stay one Wasm page short of 4GB: while e.g. Chrome is able to allocate
            // full 4GB Wasm memories, the size will wrap back to 0 bytes in Wasm side
            // for any code that deals with heap sizes, which would require special
            // casing all heap size related code to treat 0 specially.
            2147483648;
        var growMemory = (size)=>{
            var b = wasmMemory.buffer;
            var pages = (size - b.byteLength + 65535) / 65536;
            try {
                // round size grow request up to wasm page size (fixed 64KB per spec)
                wasmMemory.grow(pages); // .grow() takes a delta compared to the previous size
                updateMemoryViews();
                return 1 /*success*/ ;
            } catch (e) {
                err(`growMemory: Attempted to grow heap from ${b.byteLength} bytes to ${size} bytes, but got error: ${e}`);
            }
        // implicit 0 return to save code size (caller will cast "undefined" into 0
        // anyhow)
        };
        var _emscripten_resize_heap = (requestedSize)=>{
            var oldSize = HEAPU8.length;
            // With CAN_ADDRESS_2GB or MEMORY64, pointers are already unsigned.
            requestedSize >>>= 0;
            // With multithreaded builds, races can happen (another thread might increase the size
            // in between), so return a failure, and let the caller retry.
            assert(requestedSize > oldSize);
            // Memory resize rules:
            // 1.  Always increase heap size to at least the requested size, rounded up
            //     to next page multiple.
            // 2a. If MEMORY_GROWTH_LINEAR_STEP == -1, excessively resize the heap
            //     geometrically: increase the heap size according to
            //     MEMORY_GROWTH_GEOMETRIC_STEP factor (default +20%), At most
            //     overreserve by MEMORY_GROWTH_GEOMETRIC_CAP bytes (default 96MB).
            // 2b. If MEMORY_GROWTH_LINEAR_STEP != -1, excessively resize the heap
            //     linearly: increase the heap size by at least
            //     MEMORY_GROWTH_LINEAR_STEP bytes.
            // 3.  Max size for the heap is capped at 2048MB-WASM_PAGE_SIZE, or by
            //     MAXIMUM_MEMORY, or by ASAN limit, depending on which is smallest
            // 4.  If we were unable to allocate as much memory, it may be due to
            //     over-eager decision to excessively reserve due to (3) above.
            //     Hence if an allocation fails, cut down on the amount of excess
            //     growth, in an attempt to succeed to perform a smaller allocation.
            // A limit is set for how much we can grow. We should not exceed that
            // (the wasm binary specifies it, so if we tried, we'd fail anyhow).
            var maxHeapSize = getHeapMax();
            if (requestedSize > maxHeapSize) {
                err(`Cannot enlarge memory, requested ${requestedSize} bytes, but the limit is ${maxHeapSize} bytes!`);
                return false;
            }
            var alignUp = (x, multiple)=>x + (multiple - x % multiple) % multiple;
            // Loop through potential heap size increases. If we attempt a too eager
            // reservation that fails, cut down on the attempted size and reserve a
            // smaller bump instead. (max 3 times, chosen somewhat arbitrarily)
            for(var cutDown = 1; cutDown <= 4; cutDown *= 2){
                var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown); // ensure geometric growth
                // but limit overreserving (default to capping at +96MB overgrowth at most)
                overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
                var newSize = Math.min(maxHeapSize, alignUp(Math.max(requestedSize, overGrownHeapSize), 65536));
                var replacement = growMemory(newSize);
                if (replacement) return true;
            }
            err(`Failed to grow the heap from ${oldSize} bytes to ${newSize} bytes, not enough memory!`);
            return false;
        };
        var ENV = {};
        var getExecutableName = ()=>{
            return thisProgram || "./this.program";
        };
        var getEnvStrings = ()=>{
            if (!getEnvStrings.strings) {
                // Default values.
                // Browser language detection #8751
                var lang = (typeof navigator == "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8";
                var env = {
                    "USER": "web_user",
                    "LOGNAME": "web_user",
                    "PATH": "/",
                    "PWD": "/",
                    "HOME": "/home/web_user",
                    "LANG": lang,
                    "_": getExecutableName()
                };
                // Apply the user-provided values, if any.
                for(var x in ENV)// x is a key in ENV; if ENV[x] is undefined, that means it was
                // explicitly set to be so. We allow user code to do that to
                // force variables with default values to remain unset.
                if (ENV[x] === undefined) delete env[x];
                else env[x] = ENV[x];
                var strings = [];
                for(var x in env)strings.push(`${x}=${env[x]}`);
                getEnvStrings.strings = strings;
            }
            return getEnvStrings.strings;
        };
        var stringToAscii = (str, buffer)=>{
            for(var i = 0; i < str.length; ++i){
                assert(str.charCodeAt(i) === (str.charCodeAt(i) & 0xff));
                HEAP8[buffer++ >> 0] = str.charCodeAt(i);
            }
            // Null-terminate the string
            HEAP8[buffer >> 0] = 0;
        };
        var PATH = {
            isAbs: (path)=>path.charAt(0) === "/",
            splitPath: (filename)=>{
                var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
                return splitPathRe.exec(filename).slice(1);
            },
            normalizeArray: (parts, allowAboveRoot)=>{
                // if the path tries to go above the root, `up` ends up > 0
                var up = 0;
                for(var i = parts.length - 1; i >= 0; i--){
                    var last = parts[i];
                    if (last === ".") parts.splice(i, 1);
                    else if (last === "..") {
                        parts.splice(i, 1);
                        up++;
                    } else if (up) {
                        parts.splice(i, 1);
                        up--;
                    }
                }
                // if the path is allowed to go above the root, restore leading ..s
                if (allowAboveRoot) for(; up; up--)parts.unshift("..");
                return parts;
            },
            normalize: (path)=>{
                var isAbsolute = PATH.isAbs(path), trailingSlash = path.substr(-1) === "/";
                // Normalize the path
                path = PATH.normalizeArray(path.split("/").filter((p)=>!!p), !isAbsolute).join("/");
                if (!path && !isAbsolute) path = ".";
                if (path && trailingSlash) path += "/";
                return (isAbsolute ? "/" : "") + path;
            },
            dirname: (path)=>{
                var result = PATH.splitPath(path), root = result[0], dir = result[1];
                if (!root && !dir) // No dirname whatsoever
                return ".";
                if (dir) // It has a dirname, strip trailing slash
                dir = dir.substr(0, dir.length - 1);
                return root + dir;
            },
            basename: (path)=>{
                // EMSCRIPTEN return '/'' for '/', not an empty string
                if (path === "/") return "/";
                path = PATH.normalize(path);
                path = path.replace(/\/$/, "");
                var lastSlash = path.lastIndexOf("/");
                if (lastSlash === -1) return path;
                return path.substr(lastSlash + 1);
            },
            join: function() {
                var paths = Array.prototype.slice.call(arguments);
                return PATH.normalize(paths.join("/"));
            },
            join2: (l, r)=>{
                return PATH.normalize(l + "/" + r);
            }
        };
        var initRandomFill = ()=>{
            if (typeof crypto == "object" && typeof crypto["getRandomValues"] == "function") // for modern web browsers
            return (view)=>crypto.getRandomValues(view);
            else if (ENVIRONMENT_IS_NODE) // for nodejs with or without crypto support included
            try {
                var crypto_module = require1("crypto");
                var randomFillSync = crypto_module["randomFillSync"];
                if (randomFillSync) // nodejs with LTS crypto support
                return (view)=>crypto_module["randomFillSync"](view);
                // very old nodejs with the original crypto API
                var randomBytes = crypto_module["randomBytes"];
                return (view)=>(view.set(randomBytes(view.byteLength)), // Return the original view to match modern native implementations.
                    view);
            } catch (e) {
            // nodejs doesn't have crypto support
            }
            // we couldn't find a proper implementation, as Math.random() is not suitable for /dev/random, see emscripten-core/emscripten/pull/7096
            abort("no cryptographic support found for randomDevice. consider polyfilling it if you want to use something insecure like Math.random(), e.g. put this in a --pre-js: var crypto = { getRandomValues: (array) => { for (var i = 0; i < array.length; i++) array[i] = (Math.random()*256)|0 } };");
        };
        var randomFill = (view)=>{
            // Lazily init on the first invocation.
            return (randomFill = initRandomFill())(view);
        };
        var PATH_FS = {
            resolve: function() {
                var resolvedPath = "", resolvedAbsolute = false;
                for(var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--){
                    var path = i >= 0 ? arguments[i] : FS.cwd();
                    // Skip empty and invalid entries
                    if (typeof path != "string") throw new TypeError("Arguments to path.resolve must be strings");
                    else if (!path) return ""; // an invalid portion invalidates the whole thing
                    resolvedPath = path + "/" + resolvedPath;
                    resolvedAbsolute = PATH.isAbs(path);
                }
                // At this point the path should be resolved to a full absolute path, but
                // handle relative paths to be safe (might happen when process.cwd() fails)
                resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter((p)=>!!p), !resolvedAbsolute).join("/");
                return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
            },
            relative: (from, to)=>{
                from = PATH_FS.resolve(from).substr(1);
                to = PATH_FS.resolve(to).substr(1);
                function trim(arr) {
                    var start = 0;
                    for(; start < arr.length; start++){
                        if (arr[start] !== "") break;
                    }
                    var end = arr.length - 1;
                    for(; end >= 0; end--){
                        if (arr[end] !== "") break;
                    }
                    if (start > end) return [];
                    return arr.slice(start, end - start + 1);
                }
                var fromParts = trim(from.split("/"));
                var toParts = trim(to.split("/"));
                var length = Math.min(fromParts.length, toParts.length);
                var samePartsLength = length;
                for(var i = 0; i < length; i++)if (fromParts[i] !== toParts[i]) {
                    samePartsLength = i;
                    break;
                }
                var outputParts = [];
                for(var i = samePartsLength; i < fromParts.length; i++)outputParts.push("..");
                outputParts = outputParts.concat(toParts.slice(samePartsLength));
                return outputParts.join("/");
            }
        };
        var FS_stdin_getChar_buffer = [];
        /** @type {function(string, boolean=, number=)} */ function intArrayFromString(stringy, dontAddNull, length) {
            var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
            var u8array = new Array(len);
            var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
            if (dontAddNull) u8array.length = numBytesWritten;
            return u8array;
        }
        var FS_stdin_getChar = ()=>{
            if (!FS_stdin_getChar_buffer.length) {
                var result = null;
                if (ENVIRONMENT_IS_NODE) {
                    // we will read data by chunks of BUFSIZE
                    var BUFSIZE = 256;
                    var buf = Buffer.alloc(BUFSIZE);
                    var bytesRead = 0;
                    // For some reason we must suppress a closure warning here, even though
                    // fd definitely exists on process.stdin, and is even the proper way to
                    // get the fd of stdin,
                    // https://github.com/nodejs/help/issues/2136#issuecomment-523649904
                    // This started to happen after moving this logic out of library_tty.js,
                    // so it is related to the surrounding code in some unclear manner.
                    /** @suppress {missingProperties} */ var fd = process.stdin.fd;
                    try {
                        bytesRead = fs.readSync(fd, buf);
                    } catch (e) {
                        // Cross-platform differences: on Windows, reading EOF throws an exception, but on other OSes,
                        // reading EOF returns 0. Uniformize behavior by treating the EOF exception to return 0.
                        if (e.toString().includes("EOF")) bytesRead = 0;
                        else throw e;
                    }
                    if (bytesRead > 0) result = buf.slice(0, bytesRead).toString("utf-8");
                    else result = null;
                } else if (typeof window != "undefined" && typeof window.prompt == "function") {
                    // Browser.
                    result = window.prompt("Input: "); // returns null on cancel
                    if (result !== null) result += "\n";
                } else if (typeof readline == "function") {
                    // Command line.
                    result = readline();
                    if (result !== null) result += "\n";
                }
                if (!result) return null;
                FS_stdin_getChar_buffer = intArrayFromString(result, true);
            }
            return FS_stdin_getChar_buffer.shift();
        };
        var TTY = {
            ttys: [],
            init () {
            // https://github.com/emscripten-core/emscripten/pull/1555
            // if (ENVIRONMENT_IS_NODE) {
            //   // currently, FS.init does not distinguish if process.stdin is a file or TTY
            //   // device, it always assumes it's a TTY device. because of this, we're forcing
            //   // process.stdin to UTF8 encoding to at least make stdin reading compatible
            //   // with text files until FS.init can be refactored.
            //   process.stdin.setEncoding('utf8');
            // }
            },
            shutdown () {
            // https://github.com/emscripten-core/emscripten/pull/1555
            // if (ENVIRONMENT_IS_NODE) {
            //   // inolen: any idea as to why node -e 'process.stdin.read()' wouldn't exit immediately (with process.stdin being a tty)?
            //   // isaacs: because now it's reading from the stream, you've expressed interest in it, so that read() kicks off a _read() which creates a ReadReq operation
            //   // inolen: I thought read() in that case was a synchronous operation that just grabbed some amount of buffered data if it exists?
            //   // isaacs: it is. but it also triggers a _read() call, which calls readStart() on the handle
            //   // isaacs: do process.stdin.pause() and i'd think it'd probably close the pending call
            //   process.stdin.pause();
            // }
            },
            register (dev, ops) {
                TTY.ttys[dev] = {
                    input: [],
                    output: [],
                    ops: ops
                };
                FS.registerDevice(dev, TTY.stream_ops);
            },
            stream_ops: {
                open (stream) {
                    var tty = TTY.ttys[stream.node.rdev];
                    if (!tty) throw new FS.ErrnoError(43);
                    stream.tty = tty;
                    stream.seekable = false;
                },
                close (stream) {
                    // flush any pending line data
                    stream.tty.ops.fsync(stream.tty);
                },
                fsync (stream) {
                    stream.tty.ops.fsync(stream.tty);
                },
                read (stream, buffer, offset, length, pos /* ignored */ ) {
                    if (!stream.tty || !stream.tty.ops.get_char) throw new FS.ErrnoError(60);
                    var bytesRead = 0;
                    for(var i = 0; i < length; i++){
                        var result;
                        try {
                            result = stream.tty.ops.get_char(stream.tty);
                        } catch (e) {
                            throw new FS.ErrnoError(29);
                        }
                        if (result === undefined && bytesRead === 0) throw new FS.ErrnoError(6);
                        if (result === null || result === undefined) break;
                        bytesRead++;
                        buffer[offset + i] = result;
                    }
                    if (bytesRead) stream.node.timestamp = Date.now();
                    return bytesRead;
                },
                write (stream, buffer, offset, length, pos) {
                    if (!stream.tty || !stream.tty.ops.put_char) throw new FS.ErrnoError(60);
                    try {
                        for(var i = 0; i < length; i++)stream.tty.ops.put_char(stream.tty, buffer[offset + i]);
                    } catch (e) {
                        throw new FS.ErrnoError(29);
                    }
                    if (length) stream.node.timestamp = Date.now();
                    return i;
                }
            },
            default_tty_ops: {
                get_char (tty) {
                    return FS_stdin_getChar();
                },
                put_char (tty, val) {
                    if (val === null || val === 10) {
                        out(UTF8ArrayToString(tty.output, 0));
                        tty.output = [];
                    } else if (val != 0) tty.output.push(val); // val == 0 would cut text output off in the middle.
                },
                fsync (tty) {
                    if (tty.output && tty.output.length > 0) {
                        out(UTF8ArrayToString(tty.output, 0));
                        tty.output = [];
                    }
                },
                ioctl_tcgets (tty) {
                    // typical setting
                    return {
                        c_iflag: 25856,
                        c_oflag: 5,
                        c_cflag: 191,
                        c_lflag: 35387,
                        c_cc: [
                            0x03,
                            0x1c,
                            0x7f,
                            0x15,
                            0x04,
                            0x00,
                            0x01,
                            0x00,
                            0x11,
                            0x13,
                            0x1a,
                            0x00,
                            0x12,
                            0x0f,
                            0x17,
                            0x16,
                            0x00,
                            0x00,
                            0x00,
                            0x00,
                            0x00,
                            0x00,
                            0x00,
                            0x00,
                            0x00,
                            0x00,
                            0x00,
                            0x00,
                            0x00,
                            0x00,
                            0x00,
                            0x00
                        ]
                    };
                },
                ioctl_tcsets (tty, optional_actions, data) {
                    // currently just ignore
                    return 0;
                },
                ioctl_tiocgwinsz (tty) {
                    return [
                        24,
                        80
                    ];
                }
            },
            default_tty1_ops: {
                put_char (tty, val) {
                    if (val === null || val === 10) {
                        err(UTF8ArrayToString(tty.output, 0));
                        tty.output = [];
                    } else if (val != 0) tty.output.push(val);
                },
                fsync (tty) {
                    if (tty.output && tty.output.length > 0) {
                        err(UTF8ArrayToString(tty.output, 0));
                        tty.output = [];
                    }
                }
            }
        };
        var mmapAlloc = (size)=>{
            abort("internal error: mmapAlloc called but `emscripten_builtin_memalign` native symbol not exported");
        };
        var MEMFS = {
            ops_table: null,
            mount (mount) {
                return MEMFS.createNode(null, "/", 16895 /* 0777 */ , 0);
            },
            createNode (parent, name, mode, dev) {
                if (FS.isBlkdev(mode) || FS.isFIFO(mode)) // no supported
                throw new FS.ErrnoError(63);
                if (!MEMFS.ops_table) MEMFS.ops_table = {
                    dir: {
                        node: {
                            getattr: MEMFS.node_ops.getattr,
                            setattr: MEMFS.node_ops.setattr,
                            lookup: MEMFS.node_ops.lookup,
                            mknod: MEMFS.node_ops.mknod,
                            rename: MEMFS.node_ops.rename,
                            unlink: MEMFS.node_ops.unlink,
                            rmdir: MEMFS.node_ops.rmdir,
                            readdir: MEMFS.node_ops.readdir,
                            symlink: MEMFS.node_ops.symlink
                        },
                        stream: {
                            llseek: MEMFS.stream_ops.llseek
                        }
                    },
                    file: {
                        node: {
                            getattr: MEMFS.node_ops.getattr,
                            setattr: MEMFS.node_ops.setattr
                        },
                        stream: {
                            llseek: MEMFS.stream_ops.llseek,
                            read: MEMFS.stream_ops.read,
                            write: MEMFS.stream_ops.write,
                            allocate: MEMFS.stream_ops.allocate,
                            mmap: MEMFS.stream_ops.mmap,
                            msync: MEMFS.stream_ops.msync
                        }
                    },
                    link: {
                        node: {
                            getattr: MEMFS.node_ops.getattr,
                            setattr: MEMFS.node_ops.setattr,
                            readlink: MEMFS.node_ops.readlink
                        },
                        stream: {}
                    },
                    chrdev: {
                        node: {
                            getattr: MEMFS.node_ops.getattr,
                            setattr: MEMFS.node_ops.setattr
                        },
                        stream: FS.chrdev_stream_ops
                    }
                };
                var node = FS.createNode(parent, name, mode, dev);
                if (FS.isDir(node.mode)) {
                    node.node_ops = MEMFS.ops_table.dir.node;
                    node.stream_ops = MEMFS.ops_table.dir.stream;
                    node.contents = {};
                } else if (FS.isFile(node.mode)) {
                    node.node_ops = MEMFS.ops_table.file.node;
                    node.stream_ops = MEMFS.ops_table.file.stream;
                    node.usedBytes = 0; // The actual number of bytes used in the typed array, as opposed to contents.length which gives the whole capacity.
                    // When the byte data of the file is populated, this will point to either a typed array, or a normal JS array. Typed arrays are preferred
                    // for performance, and used by default. However, typed arrays are not resizable like normal JS arrays are, so there is a small disk size
                    // penalty involved for appending file writes that continuously grow a file similar to std::vector capacity vs used -scheme.
                    node.contents = null;
                } else if (FS.isLink(node.mode)) {
                    node.node_ops = MEMFS.ops_table.link.node;
                    node.stream_ops = MEMFS.ops_table.link.stream;
                } else if (FS.isChrdev(node.mode)) {
                    node.node_ops = MEMFS.ops_table.chrdev.node;
                    node.stream_ops = MEMFS.ops_table.chrdev.stream;
                }
                node.timestamp = Date.now();
                // add the new node to the parent
                if (parent) {
                    parent.contents[name] = node;
                    parent.timestamp = node.timestamp;
                }
                return node;
            },
            getFileDataAsTypedArray (node) {
                if (!node.contents) return new Uint8Array(0);
                if (node.contents.subarray) return node.contents.subarray(0, node.usedBytes); // Make sure to not return excess unused bytes.
                return new Uint8Array(node.contents);
            },
            expandFileStorage (node, newCapacity) {
                var prevCapacity = node.contents ? node.contents.length : 0;
                if (prevCapacity >= newCapacity) return; // No need to expand, the storage was already large enough.
                // Don't expand strictly to the given requested limit if it's only a very small increase, but instead geometrically grow capacity.
                // For small filesizes (<1MB), perform size*2 geometric increase, but for large sizes, do a much more conservative size*1.125 increase to
                // avoid overshooting the allocation cap by a very large margin.
                var CAPACITY_DOUBLING_MAX = 1048576;
                newCapacity = Math.max(newCapacity, prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2.0 : 1.125) >>> 0);
                if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256); // At minimum allocate 256b for each file when expanding.
                var oldContents = node.contents;
                node.contents = new Uint8Array(newCapacity); // Allocate new storage.
                if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0); // Copy old data over to the new storage.
            },
            resizeFileStorage (node, newSize) {
                if (node.usedBytes == newSize) return;
                if (newSize == 0) {
                    node.contents = null; // Fully decommit when requesting a resize to zero.
                    node.usedBytes = 0;
                } else {
                    var oldContents = node.contents;
                    node.contents = new Uint8Array(newSize); // Allocate new storage.
                    if (oldContents) node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes))); // Copy old data over to the new storage.
                    node.usedBytes = newSize;
                }
            },
            node_ops: {
                getattr (node) {
                    var attr = {};
                    // device numbers reuse inode numbers.
                    attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
                    attr.ino = node.id;
                    attr.mode = node.mode;
                    attr.nlink = 1;
                    attr.uid = 0;
                    attr.gid = 0;
                    attr.rdev = node.rdev;
                    if (FS.isDir(node.mode)) attr.size = 4096;
                    else if (FS.isFile(node.mode)) attr.size = node.usedBytes;
                    else if (FS.isLink(node.mode)) attr.size = node.link.length;
                    else attr.size = 0;
                    attr.atime = new Date(node.timestamp);
                    attr.mtime = new Date(node.timestamp);
                    attr.ctime = new Date(node.timestamp);
                    // NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),
                    //       but this is not required by the standard.
                    attr.blksize = 4096;
                    attr.blocks = Math.ceil(attr.size / attr.blksize);
                    return attr;
                },
                setattr (node, attr) {
                    if (attr.mode !== undefined) node.mode = attr.mode;
                    if (attr.timestamp !== undefined) node.timestamp = attr.timestamp;
                    if (attr.size !== undefined) MEMFS.resizeFileStorage(node, attr.size);
                },
                lookup (parent, name) {
                    throw FS.genericErrors[44];
                },
                mknod (parent, name, mode, dev) {
                    return MEMFS.createNode(parent, name, mode, dev);
                },
                rename (old_node, new_dir, new_name) {
                    // if we're overwriting a directory at new_name, make sure it's empty.
                    if (FS.isDir(old_node.mode)) {
                        var new_node;
                        try {
                            new_node = FS.lookupNode(new_dir, new_name);
                        } catch (e) {}
                        if (new_node) {
                            for(var i in new_node.contents)throw new FS.ErrnoError(55);
                        }
                    }
                    // do the internal rewiring
                    delete old_node.parent.contents[old_node.name];
                    old_node.parent.timestamp = Date.now();
                    old_node.name = new_name;
                    new_dir.contents[new_name] = old_node;
                    new_dir.timestamp = old_node.parent.timestamp;
                    old_node.parent = new_dir;
                },
                unlink (parent, name) {
                    delete parent.contents[name];
                    parent.timestamp = Date.now();
                },
                rmdir (parent, name) {
                    var node = FS.lookupNode(parent, name);
                    for(var i in node.contents)throw new FS.ErrnoError(55);
                    delete parent.contents[name];
                    parent.timestamp = Date.now();
                },
                readdir (node) {
                    var entries = [
                        ".",
                        ".."
                    ];
                    for(var key in node.contents){
                        if (!node.contents.hasOwnProperty(key)) continue;
                        entries.push(key);
                    }
                    return entries;
                },
                symlink (parent, newname, oldpath) {
                    var node = MEMFS.createNode(parent, newname, 41471, 0);
                    node.link = oldpath;
                    return node;
                },
                readlink (node) {
                    if (!FS.isLink(node.mode)) throw new FS.ErrnoError(28);
                    return node.link;
                }
            },
            stream_ops: {
                read (stream, buffer, offset, length, position) {
                    var contents = stream.node.contents;
                    if (position >= stream.node.usedBytes) return 0;
                    var size = Math.min(stream.node.usedBytes - position, length);
                    assert(size >= 0);
                    if (size > 8 && contents.subarray) buffer.set(contents.subarray(position, position + size), offset);
                    else for(var i = 0; i < size; i++)buffer[offset + i] = contents[position + i];
                    return size;
                },
                write (stream, buffer, offset, length, position, canOwn) {
                    // The data buffer should be a typed array view
                    assert(!(buffer instanceof ArrayBuffer));
                    // If the buffer is located in main memory (HEAP), and if
                    // memory can grow, we can't hold on to references of the
                    // memory buffer, as they may get invalidated. That means we
                    // need to do copy its contents.
                    if (buffer.buffer === HEAP8.buffer) canOwn = false;
                    if (!length) return 0;
                    var node = stream.node;
                    node.timestamp = Date.now();
                    if (buffer.subarray && (!node.contents || node.contents.subarray)) {
                        if (canOwn) {
                            assert(position === 0, "canOwn must imply no weird position inside the file");
                            node.contents = buffer.subarray(offset, offset + length);
                            node.usedBytes = length;
                            return length;
                        } else if (node.usedBytes === 0 && position === 0) {
                            node.contents = buffer.slice(offset, offset + length);
                            node.usedBytes = length;
                            return length;
                        } else if (position + length <= node.usedBytes) {
                            node.contents.set(buffer.subarray(offset, offset + length), position);
                            return length;
                        }
                    }
                    // Appending to an existing file and we need to reallocate, or source data did not come as a typed array.
                    MEMFS.expandFileStorage(node, position + length);
                    if (node.contents.subarray && buffer.subarray) // Use typed array write which is available.
                    node.contents.set(buffer.subarray(offset, offset + length), position);
                    else for(var i = 0; i < length; i++)node.contents[position + i] = buffer[offset + i]; // Or fall back to manual write if not.
                    node.usedBytes = Math.max(node.usedBytes, position + length);
                    return length;
                },
                llseek (stream, offset, whence) {
                    var position = offset;
                    if (whence === 1) position += stream.position;
                    else if (whence === 2) {
                        if (FS.isFile(stream.node.mode)) position += stream.node.usedBytes;
                    }
                    if (position < 0) throw new FS.ErrnoError(28);
                    return position;
                },
                allocate (stream, offset, length) {
                    MEMFS.expandFileStorage(stream.node, offset + length);
                    stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length);
                },
                mmap (stream, length, position, prot, flags) {
                    if (!FS.isFile(stream.node.mode)) throw new FS.ErrnoError(43);
                    var ptr;
                    var allocated;
                    var contents = stream.node.contents;
                    // Only make a new copy when MAP_PRIVATE is specified.
                    if (!(flags & 2) && contents.buffer === HEAP8.buffer) {
                        // We can't emulate MAP_SHARED when the file is not backed by the
                        // buffer we're mapping to (e.g. the HEAP buffer).
                        allocated = false;
                        ptr = contents.byteOffset;
                    } else {
                        // Try to avoid unnecessary slices.
                        if (position > 0 || position + length < contents.length) {
                            if (contents.subarray) contents = contents.subarray(position, position + length);
                            else contents = Array.prototype.slice.call(contents, position, position + length);
                        }
                        allocated = true;
                        ptr = mmapAlloc();
                        if (!ptr) throw new FS.ErrnoError(48);
                        HEAP8.set(contents, ptr);
                    }
                    return {
                        ptr,
                        allocated
                    };
                },
                msync (stream, buffer, offset, length, mmapFlags) {
                    MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
                    // should we check if bytesWritten and length are the same?
                    return 0;
                }
            }
        };
        /** @param {boolean=} noRunDep */ var asyncLoad = (url, onload, onerror, noRunDep)=>{
            var dep = !noRunDep ? getUniqueRunDependency(`al ${url}`) : "";
            readAsync(url, (arrayBuffer)=>{
                assert(arrayBuffer, `Loading data file "${url}" failed (no arrayBuffer).`);
                onload(new Uint8Array(arrayBuffer));
                if (dep) removeRunDependency(dep);
            }, (event)=>{
                if (onerror) onerror();
                else throw `Loading data file "${url}" failed.`;
            });
            if (dep) addRunDependency(dep);
        };
        var FS_createDataFile = (parent, name, fileData, canRead, canWrite, canOwn)=>{
            return FS.createDataFile(parent, name, fileData, canRead, canWrite, canOwn);
        };
        var preloadPlugins = Module["preloadPlugins"] || [];
        var FS_handledByPreloadPlugin = (byteArray, fullname, finish, onerror)=>{
            // Ensure plugins are ready.
            if (typeof Browser != "undefined") Browser.init();
            var handled = false;
            preloadPlugins.forEach((plugin)=>{
                if (handled) return;
                if (plugin["canHandle"](fullname)) {
                    plugin["handle"](byteArray, fullname, finish, onerror);
                    handled = true;
                }
            });
            return handled;
        };
        var FS_createPreloadedFile = (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish)=>{
            // TODO we should allow people to just pass in a complete filename instead
            // of parent and name being that we just join them anyways
            var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
            var dep = getUniqueRunDependency(`cp ${fullname}`); // might have several active requests for the same fullname
            function processData(byteArray) {
                function finish(byteArray) {
                    if (preFinish) preFinish();
                    if (!dontCreateFile) FS_createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
                    if (onload) onload();
                    removeRunDependency(dep);
                }
                if (FS_handledByPreloadPlugin(byteArray, fullname, finish, ()=>{
                    if (onerror) onerror();
                    removeRunDependency(dep);
                })) return;
                finish(byteArray);
            }
            addRunDependency(dep);
            if (typeof url == "string") asyncLoad(url, (byteArray)=>processData(byteArray), onerror);
            else processData(url);
        };
        var FS_modeStringToFlags = (str)=>{
            var flagModes = {
                "r": 0,
                "r+": 2,
                "w": 577,
                "w+": 578,
                "a": 1089,
                "a+": 1090
            };
            var flags = flagModes[str];
            if (typeof flags == "undefined") throw new Error(`Unknown file open mode: ${str}`);
            return flags;
        };
        var FS_getMode = (canRead, canWrite)=>{
            var mode = 0;
            if (canRead) mode |= 365;
            if (canWrite) mode |= 146;
            return mode;
        };
        var ERRNO_MESSAGES = {
            0: "Success",
            1: "Arg list too long",
            2: "Permission denied",
            3: "Address already in use",
            4: "Address not available",
            5: "Address family not supported by protocol family",
            6: "No more processes",
            7: "Socket already connected",
            8: "Bad file number",
            9: "Trying to read unreadable message",
            10: "Mount device busy",
            11: "Operation canceled",
            12: "No children",
            13: "Connection aborted",
            14: "Connection refused",
            15: "Connection reset by peer",
            16: "File locking deadlock error",
            17: "Destination address required",
            18: "Math arg out of domain of func",
            19: "Quota exceeded",
            20: "File exists",
            21: "Bad address",
            22: "File too large",
            23: "Host is unreachable",
            24: "Identifier removed",
            25: "Illegal byte sequence",
            26: "Connection already in progress",
            27: "Interrupted system call",
            28: "Invalid argument",
            29: "I/O error",
            30: "Socket is already connected",
            31: "Is a directory",
            32: "Too many symbolic links",
            33: "Too many open files",
            34: "Too many links",
            35: "Message too long",
            36: "Multihop attempted",
            37: "File or path name too long",
            38: "Network interface is not configured",
            39: "Connection reset by network",
            40: "Network is unreachable",
            41: "Too many open files in system",
            42: "No buffer space available",
            43: "No such device",
            44: "No such file or directory",
            45: "Exec format error",
            46: "No record locks available",
            47: "The link has been severed",
            48: "Not enough core",
            49: "No message of desired type",
            50: "Protocol not available",
            51: "No space left on device",
            52: "Function not implemented",
            53: "Socket is not connected",
            54: "Not a directory",
            55: "Directory not empty",
            56: "State not recoverable",
            57: "Socket operation on non-socket",
            59: "Not a typewriter",
            60: "No such device or address",
            61: "Value too large for defined data type",
            62: "Previous owner died",
            63: "Not super-user",
            64: "Broken pipe",
            65: "Protocol error",
            66: "Unknown protocol",
            67: "Protocol wrong type for socket",
            68: "Math result not representable",
            69: "Read only file system",
            70: "Illegal seek",
            71: "No such process",
            72: "Stale file handle",
            73: "Connection timed out",
            74: "Text file busy",
            75: "Cross-device link",
            100: "Device not a stream",
            101: "Bad font file fmt",
            102: "Invalid slot",
            103: "Invalid request code",
            104: "No anode",
            105: "Block device required",
            106: "Channel number out of range",
            107: "Level 3 halted",
            108: "Level 3 reset",
            109: "Link number out of range",
            110: "Protocol driver not attached",
            111: "No CSI structure available",
            112: "Level 2 halted",
            113: "Invalid exchange",
            114: "Invalid request descriptor",
            115: "Exchange full",
            116: "No data (for no delay io)",
            117: "Timer expired",
            118: "Out of streams resources",
            119: "Machine is not on the network",
            120: "Package not installed",
            121: "The object is remote",
            122: "Advertise error",
            123: "Srmount error",
            124: "Communication error on send",
            125: "Cross mount point (not really error)",
            126: "Given log. name not unique",
            127: "f.d. invalid for this operation",
            128: "Remote address changed",
            129: "Can   access a needed shared lib",
            130: "Accessing a corrupted shared lib",
            131: ".lib section in a.out corrupted",
            132: "Attempting to link in too many libs",
            133: "Attempting to exec a shared library",
            135: "Streams pipe error",
            136: "Too many users",
            137: "Socket type not supported",
            138: "Not supported",
            139: "Protocol family not supported",
            140: "Can't send after socket shutdown",
            141: "Too many references",
            142: "Host is down",
            148: "No medium (in tape drive)",
            156: "Level 2 not synchronized"
        };
        var ERRNO_CODES = {};
        var demangle = (func)=>{
            warnOnce("warning: build with -sDEMANGLE_SUPPORT to link in libcxxabi demangling");
            return func;
        };
        var demangleAll = (text)=>{
            var regex = /\b_Z[\w\d_]+/g;
            return text.replace(regex, function(x) {
                var y = demangle(x);
                return x === y ? x : y + " [" + x + "]";
            });
        };
        var FS = {
            root: null,
            mounts: [],
            devices: {},
            streams: [],
            nextInode: 1,
            nameTable: null,
            currentPath: "/",
            initialized: false,
            ignorePermissions: true,
            ErrnoError: null,
            genericErrors: {},
            filesystems: null,
            syncFSRequests: 0,
            lookupPath (path, opts = {}) {
                path = PATH_FS.resolve(path);
                if (!path) return {
                    path: "",
                    node: null
                };
                var defaults = {
                    follow_mount: true,
                    recurse_count: 0
                };
                opts = Object.assign(defaults, opts);
                if (opts.recurse_count > 8) throw new FS.ErrnoError(32);
                // split the absolute path
                var parts = path.split("/").filter((p)=>!!p);
                // start at the root
                var current = FS.root;
                var current_path = "/";
                for(var i = 0; i < parts.length; i++){
                    var islast = i === parts.length - 1;
                    if (islast && opts.parent) break;
                    current = FS.lookupNode(current, parts[i]);
                    current_path = PATH.join2(current_path, parts[i]);
                    // jump to the mount's root node if this is a mountpoint
                    if (FS.isMountpoint(current)) {
                        if (!islast || islast && opts.follow_mount) current = current.mounted.root;
                    }
                    // by default, lookupPath will not follow a symlink if it is the final path component.
                    // setting opts.follow = true will override this behavior.
                    if (!islast || opts.follow) {
                        var count = 0;
                        while(FS.isLink(current.mode)){
                            var link = FS.readlink(current_path);
                            current_path = PATH_FS.resolve(PATH.dirname(current_path), link);
                            var lookup = FS.lookupPath(current_path, {
                                recurse_count: opts.recurse_count + 1
                            });
                            current = lookup.node;
                            if (count++ > 40) throw new FS.ErrnoError(32);
                        }
                    }
                }
                return {
                    path: current_path,
                    node: current
                };
            },
            getPath (node) {
                var path;
                while(true){
                    if (FS.isRoot(node)) {
                        var mount = node.mount.mountpoint;
                        if (!path) return mount;
                        return mount[mount.length - 1] !== "/" ? `${mount}/${path}` : mount + path;
                    }
                    path = path ? `${node.name}/${path}` : node.name;
                    node = node.parent;
                }
            },
            hashName (parentid, name) {
                var hash = 0;
                for(var i = 0; i < name.length; i++)hash = (hash << 5) - hash + name.charCodeAt(i) | 0;
                return (parentid + hash >>> 0) % FS.nameTable.length;
            },
            hashAddNode (node) {
                var hash = FS.hashName(node.parent.id, node.name);
                node.name_next = FS.nameTable[hash];
                FS.nameTable[hash] = node;
            },
            hashRemoveNode (node) {
                var hash = FS.hashName(node.parent.id, node.name);
                if (FS.nameTable[hash] === node) FS.nameTable[hash] = node.name_next;
                else {
                    var current = FS.nameTable[hash];
                    while(current){
                        if (current.name_next === node) {
                            current.name_next = node.name_next;
                            break;
                        }
                        current = current.name_next;
                    }
                }
            },
            lookupNode (parent, name) {
                var errCode = FS.mayLookup(parent);
                if (errCode) throw new FS.ErrnoError(errCode, parent);
                var hash = FS.hashName(parent.id, name);
                for(var node = FS.nameTable[hash]; node; node = node.name_next){
                    var nodeName = node.name;
                    if (node.parent.id === parent.id && nodeName === name) return node;
                }
                // if we failed to find it in the cache, call into the VFS
                return FS.lookup(parent, name);
            },
            createNode (parent, name, mode, rdev) {
                assert(typeof parent == "object");
                var node = new FS.FSNode(parent, name, mode, rdev);
                FS.hashAddNode(node);
                return node;
            },
            destroyNode (node) {
                FS.hashRemoveNode(node);
            },
            isRoot (node) {
                return node === node.parent;
            },
            isMountpoint (node) {
                return !!node.mounted;
            },
            isFile (mode) {
                return (mode & 61440) === 32768;
            },
            isDir (mode) {
                return (mode & 61440) === 16384;
            },
            isLink (mode) {
                return (mode & 61440) === 40960;
            },
            isChrdev (mode) {
                return (mode & 61440) === 8192;
            },
            isBlkdev (mode) {
                return (mode & 61440) === 24576;
            },
            isFIFO (mode) {
                return (mode & 61440) === 4096;
            },
            isSocket (mode) {
                return (mode & 49152) === 49152;
            },
            flagsToPermissionString (flag) {
                var perms = [
                    "r",
                    "w",
                    "rw"
                ][flag & 3];
                if (flag & 512) perms += "w";
                return perms;
            },
            nodePermissions (node, perms) {
                if (FS.ignorePermissions) return 0;
                // return 0 if any user, group or owner bits are set.
                if (perms.includes("r") && !(node.mode & 292)) return 2;
                else if (perms.includes("w") && !(node.mode & 146)) return 2;
                else if (perms.includes("x") && !(node.mode & 73)) return 2;
                return 0;
            },
            mayLookup (dir) {
                var errCode = FS.nodePermissions(dir, "x");
                if (errCode) return errCode;
                if (!dir.node_ops.lookup) return 2;
                return 0;
            },
            mayCreate (dir, name) {
                try {
                    var node = FS.lookupNode(dir, name);
                    return 20;
                } catch (e) {}
                return FS.nodePermissions(dir, "wx");
            },
            mayDelete (dir, name, isdir) {
                var node;
                try {
                    node = FS.lookupNode(dir, name);
                } catch (e) {
                    return e.errno;
                }
                var errCode = FS.nodePermissions(dir, "wx");
                if (errCode) return errCode;
                if (isdir) {
                    if (!FS.isDir(node.mode)) return 54;
                    if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) return 10;
                } else {
                    if (FS.isDir(node.mode)) return 31;
                }
                return 0;
            },
            mayOpen (node, flags) {
                if (!node) return 44;
                if (FS.isLink(node.mode)) return 32;
                else if (FS.isDir(node.mode)) {
                    if (FS.flagsToPermissionString(flags) !== "r" || // opening for write
                    flags & 512) return 31;
                }
                return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
            },
            MAX_OPEN_FDS: 4096,
            nextfd () {
                for(var fd = 0; fd <= FS.MAX_OPEN_FDS; fd++){
                    if (!FS.streams[fd]) return fd;
                }
                throw new FS.ErrnoError(33);
            },
            getStreamChecked (fd) {
                var stream = FS.getStream(fd);
                if (!stream) throw new FS.ErrnoError(8);
                return stream;
            },
            getStream: (fd)=>FS.streams[fd],
            createStream (stream, fd = -1) {
                if (!FS.FSStream) {
                    FS.FSStream = /** @constructor */ function() {
                        this.shared = {};
                    };
                    FS.FSStream.prototype = {};
                    Object.defineProperties(FS.FSStream.prototype, {
                        object: {
                            /** @this {FS.FSStream} */ get () {
                                return this.node;
                            },
                            /** @this {FS.FSStream} */ set (val) {
                                this.node = val;
                            }
                        },
                        isRead: {
                            /** @this {FS.FSStream} */ get () {
                                return (this.flags & 2097155) !== 1;
                            }
                        },
                        isWrite: {
                            /** @this {FS.FSStream} */ get () {
                                return (this.flags & 2097155) !== 0;
                            }
                        },
                        isAppend: {
                            /** @this {FS.FSStream} */ get () {
                                return this.flags & 1024;
                            }
                        },
                        flags: {
                            /** @this {FS.FSStream} */ get () {
                                return this.shared.flags;
                            },
                            /** @this {FS.FSStream} */ set (val) {
                                this.shared.flags = val;
                            }
                        },
                        position: {
                            /** @this {FS.FSStream} */ get () {
                                return this.shared.position;
                            },
                            /** @this {FS.FSStream} */ set (val) {
                                this.shared.position = val;
                            }
                        }
                    });
                }
                // clone it, so we can return an instance of FSStream
                stream = Object.assign(new FS.FSStream(), stream);
                if (fd == -1) fd = FS.nextfd();
                stream.fd = fd;
                FS.streams[fd] = stream;
                return stream;
            },
            closeStream (fd) {
                FS.streams[fd] = null;
            },
            chrdev_stream_ops: {
                open (stream) {
                    var device = FS.getDevice(stream.node.rdev);
                    // override node's stream ops with the device's
                    stream.stream_ops = device.stream_ops;
                    // forward the open call
                    if (stream.stream_ops.open) stream.stream_ops.open(stream);
                },
                llseek () {
                    throw new FS.ErrnoError(70);
                }
            },
            major: (dev)=>dev >> 8,
            minor: (dev)=>dev & 0xff,
            makedev: (ma, mi)=>ma << 8 | mi,
            registerDevice (dev, ops) {
                FS.devices[dev] = {
                    stream_ops: ops
                };
            },
            getDevice: (dev)=>FS.devices[dev],
            getMounts (mount) {
                var mounts = [];
                var check = [
                    mount
                ];
                while(check.length){
                    var m = check.pop();
                    mounts.push(m);
                    check.push.apply(check, m.mounts);
                }
                return mounts;
            },
            syncfs (populate, callback) {
                if (typeof populate == "function") {
                    callback = populate;
                    populate = false;
                }
                FS.syncFSRequests++;
                if (FS.syncFSRequests > 1) err(`warning: ${FS.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);
                var mounts = FS.getMounts(FS.root.mount);
                var completed = 0;
                function doCallback(errCode) {
                    assert(FS.syncFSRequests > 0);
                    FS.syncFSRequests--;
                    return callback(errCode);
                }
                function done(errCode) {
                    if (errCode) {
                        if (!done.errored) {
                            done.errored = true;
                            return doCallback(errCode);
                        }
                        return;
                    }
                    if (++completed >= mounts.length) doCallback(null);
                }
                // sync all mounts
                mounts.forEach((mount)=>{
                    if (!mount.type.syncfs) return done(null);
                    mount.type.syncfs(mount, populate, done);
                });
            },
            mount (type, opts, mountpoint) {
                if (typeof type == "string") // The filesystem was not included, and instead we have an error
                // message stored in the variable.
                throw type;
                var root = mountpoint === "/";
                var pseudo = !mountpoint;
                var node;
                if (root && FS.root) throw new FS.ErrnoError(10);
                else if (!root && !pseudo) {
                    var lookup = FS.lookupPath(mountpoint, {
                        follow_mount: false
                    });
                    mountpoint = lookup.path; // use the absolute path
                    node = lookup.node;
                    if (FS.isMountpoint(node)) throw new FS.ErrnoError(10);
                    if (!FS.isDir(node.mode)) throw new FS.ErrnoError(54);
                }
                var mount = {
                    type,
                    opts,
                    mountpoint,
                    mounts: []
                };
                // create a root node for the fs
                var mountRoot = type.mount(mount);
                mountRoot.mount = mount;
                mount.root = mountRoot;
                if (root) FS.root = mountRoot;
                else if (node) {
                    // set as a mountpoint
                    node.mounted = mount;
                    // add the new mount to the current mount's children
                    if (node.mount) node.mount.mounts.push(mount);
                }
                return mountRoot;
            },
            unmount (mountpoint) {
                var lookup = FS.lookupPath(mountpoint, {
                    follow_mount: false
                });
                if (!FS.isMountpoint(lookup.node)) throw new FS.ErrnoError(28);
                // destroy the nodes for this mount, and all its child mounts
                var node = lookup.node;
                var mount = node.mounted;
                var mounts = FS.getMounts(mount);
                Object.keys(FS.nameTable).forEach((hash)=>{
                    var current = FS.nameTable[hash];
                    while(current){
                        var next = current.name_next;
                        if (mounts.includes(current.mount)) FS.destroyNode(current);
                        current = next;
                    }
                });
                // no longer a mountpoint
                node.mounted = null;
                // remove this mount from the child mounts
                var idx = node.mount.mounts.indexOf(mount);
                assert(idx !== -1);
                node.mount.mounts.splice(idx, 1);
            },
            lookup (parent, name) {
                return parent.node_ops.lookup(parent, name);
            },
            mknod (path, mode, dev) {
                var lookup = FS.lookupPath(path, {
                    parent: true
                });
                var parent = lookup.node;
                var name = PATH.basename(path);
                if (!name || name === "." || name === "..") throw new FS.ErrnoError(28);
                var errCode = FS.mayCreate(parent, name);
                if (errCode) throw new FS.ErrnoError(errCode);
                if (!parent.node_ops.mknod) throw new FS.ErrnoError(63);
                return parent.node_ops.mknod(parent, name, mode, dev);
            },
            create (path, mode) {
                mode = mode !== undefined ? mode : 438 /* 0666 */ ;
                mode &= 4095;
                mode |= 32768;
                return FS.mknod(path, mode, 0);
            },
            mkdir (path, mode) {
                mode = mode !== undefined ? mode : 511 /* 0777 */ ;
                mode &= 1023;
                mode |= 16384;
                return FS.mknod(path, mode, 0);
            },
            mkdirTree (path, mode) {
                var dirs = path.split("/");
                var d = "";
                for(var i = 0; i < dirs.length; ++i){
                    if (!dirs[i]) continue;
                    d += "/" + dirs[i];
                    try {
                        FS.mkdir(d, mode);
                    } catch (e) {
                        if (e.errno != 20) throw e;
                    }
                }
            },
            mkdev (path, mode, dev) {
                if (typeof dev == "undefined") {
                    dev = mode;
                    mode = 438 /* 0666 */ ;
                }
                mode |= 8192;
                return FS.mknod(path, mode, dev);
            },
            symlink (oldpath, newpath) {
                if (!PATH_FS.resolve(oldpath)) throw new FS.ErrnoError(44);
                var lookup = FS.lookupPath(newpath, {
                    parent: true
                });
                var parent = lookup.node;
                if (!parent) throw new FS.ErrnoError(44);
                var newname = PATH.basename(newpath);
                var errCode = FS.mayCreate(parent, newname);
                if (errCode) throw new FS.ErrnoError(errCode);
                if (!parent.node_ops.symlink) throw new FS.ErrnoError(63);
                return parent.node_ops.symlink(parent, newname, oldpath);
            },
            rename (old_path, new_path) {
                var old_dirname = PATH.dirname(old_path);
                var new_dirname = PATH.dirname(new_path);
                var old_name = PATH.basename(old_path);
                var new_name = PATH.basename(new_path);
                // parents must exist
                var lookup, old_dir, new_dir;
                // let the errors from non existant directories percolate up
                lookup = FS.lookupPath(old_path, {
                    parent: true
                });
                old_dir = lookup.node;
                lookup = FS.lookupPath(new_path, {
                    parent: true
                });
                new_dir = lookup.node;
                if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
                // need to be part of the same mount
                if (old_dir.mount !== new_dir.mount) throw new FS.ErrnoError(75);
                // source must exist
                var old_node = FS.lookupNode(old_dir, old_name);
                // old path should not be an ancestor of the new path
                var relative = PATH_FS.relative(old_path, new_dirname);
                if (relative.charAt(0) !== ".") throw new FS.ErrnoError(28);
                // new path should not be an ancestor of the old path
                relative = PATH_FS.relative(new_path, old_dirname);
                if (relative.charAt(0) !== ".") throw new FS.ErrnoError(55);
                // see if the new path already exists
                var new_node;
                try {
                    new_node = FS.lookupNode(new_dir, new_name);
                } catch (e) {
                // not fatal
                }
                // early out if nothing needs to change
                if (old_node === new_node) return;
                // we'll need to delete the old entry
                var isdir = FS.isDir(old_node.mode);
                var errCode = FS.mayDelete(old_dir, old_name, isdir);
                if (errCode) throw new FS.ErrnoError(errCode);
                // need delete permissions if we'll be overwriting.
                // need create permissions if new doesn't already exist.
                errCode = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name);
                if (errCode) throw new FS.ErrnoError(errCode);
                if (!old_dir.node_ops.rename) throw new FS.ErrnoError(63);
                if (FS.isMountpoint(old_node) || new_node && FS.isMountpoint(new_node)) throw new FS.ErrnoError(10);
                // if we are going to change the parent, check write permissions
                if (new_dir !== old_dir) {
                    errCode = FS.nodePermissions(old_dir, "w");
                    if (errCode) throw new FS.ErrnoError(errCode);
                }
                // remove the node from the lookup hash
                FS.hashRemoveNode(old_node);
                // do the underlying fs rename
                try {
                    old_dir.node_ops.rename(old_node, new_dir, new_name);
                } catch (e) {
                    throw e;
                } finally{
                    // add the node back to the hash (in case node_ops.rename
                    // changed its name)
                    FS.hashAddNode(old_node);
                }
            },
            rmdir (path) {
                var lookup = FS.lookupPath(path, {
                    parent: true
                });
                var parent = lookup.node;
                var name = PATH.basename(path);
                var node = FS.lookupNode(parent, name);
                var errCode = FS.mayDelete(parent, name, true);
                if (errCode) throw new FS.ErrnoError(errCode);
                if (!parent.node_ops.rmdir) throw new FS.ErrnoError(63);
                if (FS.isMountpoint(node)) throw new FS.ErrnoError(10);
                parent.node_ops.rmdir(parent, name);
                FS.destroyNode(node);
            },
            readdir (path) {
                var lookup = FS.lookupPath(path, {
                    follow: true
                });
                var node = lookup.node;
                if (!node.node_ops.readdir) throw new FS.ErrnoError(54);
                return node.node_ops.readdir(node);
            },
            unlink (path) {
                var lookup = FS.lookupPath(path, {
                    parent: true
                });
                var parent = lookup.node;
                if (!parent) throw new FS.ErrnoError(44);
                var name = PATH.basename(path);
                var node = FS.lookupNode(parent, name);
                var errCode = FS.mayDelete(parent, name, false);
                if (errCode) // According to POSIX, we should map EISDIR to EPERM, but
                // we instead do what Linux does (and we must, as we use
                // the musl linux libc).
                throw new FS.ErrnoError(errCode);
                if (!parent.node_ops.unlink) throw new FS.ErrnoError(63);
                if (FS.isMountpoint(node)) throw new FS.ErrnoError(10);
                parent.node_ops.unlink(parent, name);
                FS.destroyNode(node);
            },
            readlink (path) {
                var lookup = FS.lookupPath(path);
                var link = lookup.node;
                if (!link) throw new FS.ErrnoError(44);
                if (!link.node_ops.readlink) throw new FS.ErrnoError(28);
                return PATH_FS.resolve(FS.getPath(link.parent), link.node_ops.readlink(link));
            },
            stat (path, dontFollow) {
                var lookup = FS.lookupPath(path, {
                    follow: !dontFollow
                });
                var node = lookup.node;
                if (!node) throw new FS.ErrnoError(44);
                if (!node.node_ops.getattr) throw new FS.ErrnoError(63);
                return node.node_ops.getattr(node);
            },
            lstat (path) {
                return FS.stat(path, true);
            },
            chmod (path, mode, dontFollow) {
                var node;
                if (typeof path == "string") {
                    var lookup = FS.lookupPath(path, {
                        follow: !dontFollow
                    });
                    node = lookup.node;
                } else node = path;
                if (!node.node_ops.setattr) throw new FS.ErrnoError(63);
                node.node_ops.setattr(node, {
                    mode: mode & 4095 | node.mode & -4096,
                    timestamp: Date.now()
                });
            },
            lchmod (path, mode) {
                FS.chmod(path, mode, true);
            },
            fchmod (fd, mode) {
                var stream = FS.getStreamChecked(fd);
                FS.chmod(stream.node, mode);
            },
            chown (path, uid, gid, dontFollow) {
                var node;
                if (typeof path == "string") {
                    var lookup = FS.lookupPath(path, {
                        follow: !dontFollow
                    });
                    node = lookup.node;
                } else node = path;
                if (!node.node_ops.setattr) throw new FS.ErrnoError(63);
                node.node_ops.setattr(node, {
                    timestamp: Date.now()
                });
            },
            lchown (path, uid, gid) {
                FS.chown(path, uid, gid, true);
            },
            fchown (fd, uid, gid) {
                var stream = FS.getStreamChecked(fd);
                FS.chown(stream.node, uid, gid);
            },
            truncate (path, len) {
                if (len < 0) throw new FS.ErrnoError(28);
                var node;
                if (typeof path == "string") {
                    var lookup = FS.lookupPath(path, {
                        follow: true
                    });
                    node = lookup.node;
                } else node = path;
                if (!node.node_ops.setattr) throw new FS.ErrnoError(63);
                if (FS.isDir(node.mode)) throw new FS.ErrnoError(31);
                if (!FS.isFile(node.mode)) throw new FS.ErrnoError(28);
                var errCode = FS.nodePermissions(node, "w");
                if (errCode) throw new FS.ErrnoError(errCode);
                node.node_ops.setattr(node, {
                    size: len,
                    timestamp: Date.now()
                });
            },
            ftruncate (fd, len) {
                var stream = FS.getStreamChecked(fd);
                if ((stream.flags & 2097155) === 0) throw new FS.ErrnoError(28);
                FS.truncate(stream.node, len);
            },
            utime (path, atime, mtime) {
                var lookup = FS.lookupPath(path, {
                    follow: true
                });
                var node = lookup.node;
                node.node_ops.setattr(node, {
                    timestamp: Math.max(atime, mtime)
                });
            },
            open (path, flags, mode) {
                if (path === "") throw new FS.ErrnoError(44);
                flags = typeof flags == "string" ? FS_modeStringToFlags(flags) : flags;
                mode = typeof mode == "undefined" ? 438 /* 0666 */  : mode;
                if (flags & 64) mode = mode & 4095 | 32768;
                else mode = 0;
                var node;
                if (typeof path == "object") node = path;
                else {
                    path = PATH.normalize(path);
                    try {
                        var lookup = FS.lookupPath(path, {
                            follow: !(flags & 131072)
                        });
                        node = lookup.node;
                    } catch (e) {
                    // ignore
                    }
                }
                // perhaps we need to create the node
                var created = false;
                if (flags & 64) {
                    if (node) {
                        // if O_CREAT and O_EXCL are set, error out if the node already exists
                        if (flags & 128) throw new FS.ErrnoError(20);
                    } else {
                        // node doesn't exist, try to create it
                        node = FS.mknod(path, mode, 0);
                        created = true;
                    }
                }
                if (!node) throw new FS.ErrnoError(44);
                // can't truncate a device
                if (FS.isChrdev(node.mode)) flags &= -513;
                // if asked only for a directory, then this must be one
                if (flags & 65536 && !FS.isDir(node.mode)) throw new FS.ErrnoError(54);
                // check permissions, if this is not a file we just created now (it is ok to
                // create and write to a file with read-only permissions; it is read-only
                // for later use)
                if (!created) {
                    var errCode = FS.mayOpen(node, flags);
                    if (errCode) throw new FS.ErrnoError(errCode);
                }
                // do truncation if necessary
                if (flags & 512 && !created) FS.truncate(node, 0);
                // we've already handled these, don't pass down to the underlying vfs
                flags &= -131713;
                // register the stream with the filesystem
                var stream = FS.createStream({
                    node,
                    path: FS.getPath(node),
                    flags,
                    seekable: true,
                    position: 0,
                    stream_ops: node.stream_ops,
                    // used by the file family libc calls (fopen, fwrite, ferror, etc.)
                    ungotten: [],
                    error: false
                });
                // call the new stream's open function
                if (stream.stream_ops.open) stream.stream_ops.open(stream);
                if (Module["logReadFiles"] && !(flags & 1)) {
                    if (!FS.readFiles) FS.readFiles = {};
                    if (!(path in FS.readFiles)) FS.readFiles[path] = 1;
                }
                return stream;
            },
            close (stream) {
                if (FS.isClosed(stream)) throw new FS.ErrnoError(8);
                if (stream.getdents) stream.getdents = null; // free readdir state
                try {
                    if (stream.stream_ops.close) stream.stream_ops.close(stream);
                } catch (e) {
                    throw e;
                } finally{
                    FS.closeStream(stream.fd);
                }
                stream.fd = null;
            },
            isClosed (stream) {
                return stream.fd === null;
            },
            llseek (stream, offset, whence) {
                if (FS.isClosed(stream)) throw new FS.ErrnoError(8);
                if (!stream.seekable || !stream.stream_ops.llseek) throw new FS.ErrnoError(70);
                if (whence != 0 && whence != 1 && whence != 2) throw new FS.ErrnoError(28);
                stream.position = stream.stream_ops.llseek(stream, offset, whence);
                stream.ungotten = [];
                return stream.position;
            },
            read (stream, buffer, offset, length, position) {
                assert(offset >= 0);
                if (length < 0 || position < 0) throw new FS.ErrnoError(28);
                if (FS.isClosed(stream)) throw new FS.ErrnoError(8);
                if ((stream.flags & 2097155) === 1) throw new FS.ErrnoError(8);
                if (FS.isDir(stream.node.mode)) throw new FS.ErrnoError(31);
                if (!stream.stream_ops.read) throw new FS.ErrnoError(28);
                var seeking = typeof position != "undefined";
                if (!seeking) position = stream.position;
                else if (!stream.seekable) throw new FS.ErrnoError(70);
                var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
                if (!seeking) stream.position += bytesRead;
                return bytesRead;
            },
            write (stream, buffer, offset, length, position, canOwn) {
                assert(offset >= 0);
                if (length < 0 || position < 0) throw new FS.ErrnoError(28);
                if (FS.isClosed(stream)) throw new FS.ErrnoError(8);
                if ((stream.flags & 2097155) === 0) throw new FS.ErrnoError(8);
                if (FS.isDir(stream.node.mode)) throw new FS.ErrnoError(31);
                if (!stream.stream_ops.write) throw new FS.ErrnoError(28);
                if (stream.seekable && stream.flags & 1024) // seek to the end before writing in append mode
                FS.llseek(stream, 0, 2);
                var seeking = typeof position != "undefined";
                if (!seeking) position = stream.position;
                else if (!stream.seekable) throw new FS.ErrnoError(70);
                var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
                if (!seeking) stream.position += bytesWritten;
                return bytesWritten;
            },
            allocate (stream, offset, length) {
                if (FS.isClosed(stream)) throw new FS.ErrnoError(8);
                if (offset < 0 || length <= 0) throw new FS.ErrnoError(28);
                if ((stream.flags & 2097155) === 0) throw new FS.ErrnoError(8);
                if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) throw new FS.ErrnoError(43);
                if (!stream.stream_ops.allocate) throw new FS.ErrnoError(138);
                stream.stream_ops.allocate(stream, offset, length);
            },
            mmap (stream, length, position, prot, flags) {
                // User requests writing to file (prot & PROT_WRITE != 0).
                // Checking if we have permissions to write to the file unless
                // MAP_PRIVATE flag is set. According to POSIX spec it is possible
                // to write to file opened in read-only mode with MAP_PRIVATE flag,
                // as all modifications will be visible only in the memory of
                // the current process.
                if ((prot & 2) !== 0 && (flags & 2) === 0 && (stream.flags & 2097155) !== 2) throw new FS.ErrnoError(2);
                if ((stream.flags & 2097155) === 1) throw new FS.ErrnoError(2);
                if (!stream.stream_ops.mmap) throw new FS.ErrnoError(43);
                return stream.stream_ops.mmap(stream, length, position, prot, flags);
            },
            msync (stream, buffer, offset, length, mmapFlags) {
                assert(offset >= 0);
                if (!stream.stream_ops.msync) return 0;
                return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
            },
            munmap: (stream)=>0,
            ioctl (stream, cmd, arg) {
                if (!stream.stream_ops.ioctl) throw new FS.ErrnoError(59);
                return stream.stream_ops.ioctl(stream, cmd, arg);
            },
            readFile (path, opts = {}) {
                opts.flags = opts.flags || 0;
                opts.encoding = opts.encoding || "binary";
                if (opts.encoding !== "utf8" && opts.encoding !== "binary") throw new Error(`Invalid encoding type "${opts.encoding}"`);
                var ret;
                var stream = FS.open(path, opts.flags);
                var stat = FS.stat(path);
                var length = stat.size;
                var buf = new Uint8Array(length);
                FS.read(stream, buf, 0, length, 0);
                if (opts.encoding === "utf8") ret = UTF8ArrayToString(buf, 0);
                else if (opts.encoding === "binary") ret = buf;
                FS.close(stream);
                return ret;
            },
            writeFile (path, data, opts = {}) {
                opts.flags = opts.flags || 577;
                var stream = FS.open(path, opts.flags, opts.mode);
                if (typeof data == "string") {
                    var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
                    var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
                    FS.write(stream, buf, 0, actualNumBytes, undefined, opts.canOwn);
                } else if (ArrayBuffer.isView(data)) FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn);
                else throw new Error("Unsupported data type");
                FS.close(stream);
            },
            cwd: ()=>FS.currentPath,
            chdir (path) {
                var lookup = FS.lookupPath(path, {
                    follow: true
                });
                if (lookup.node === null) throw new FS.ErrnoError(44);
                if (!FS.isDir(lookup.node.mode)) throw new FS.ErrnoError(54);
                var errCode = FS.nodePermissions(lookup.node, "x");
                if (errCode) throw new FS.ErrnoError(errCode);
                FS.currentPath = lookup.path;
            },
            createDefaultDirectories () {
                FS.mkdir("/tmp");
                FS.mkdir("/home");
                FS.mkdir("/home/web_user");
            },
            createDefaultDevices () {
                // create /dev
                FS.mkdir("/dev");
                // setup /dev/null
                FS.registerDevice(FS.makedev(1, 3), {
                    read: ()=>0,
                    write: (stream, buffer, offset, length, pos)=>length
                });
                FS.mkdev("/dev/null", FS.makedev(1, 3));
                // setup /dev/tty and /dev/tty1
                // stderr needs to print output using err() rather than out()
                // so we register a second tty just for it.
                TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
                TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
                FS.mkdev("/dev/tty", FS.makedev(5, 0));
                FS.mkdev("/dev/tty1", FS.makedev(6, 0));
                // setup /dev/[u]random
                // use a buffer to avoid overhead of individual crypto calls per byte
                var randomBuffer = new Uint8Array(1024), randomLeft = 0;
                var randomByte = ()=>{
                    if (randomLeft === 0) randomLeft = randomFill(randomBuffer).byteLength;
                    return randomBuffer[--randomLeft];
                };
                FS.createDevice("/dev", "random", randomByte);
                FS.createDevice("/dev", "urandom", randomByte);
                // we're not going to emulate the actual shm device,
                // just create the tmp dirs that reside in it commonly
                FS.mkdir("/dev/shm");
                FS.mkdir("/dev/shm/tmp");
            },
            createSpecialDirectories () {
                // create /proc/self/fd which allows /proc/self/fd/6 => readlink gives the
                // name of the stream for fd 6 (see test_unistd_ttyname)
                FS.mkdir("/proc");
                var proc_self = FS.mkdir("/proc/self");
                FS.mkdir("/proc/self/fd");
                FS.mount({
                    mount () {
                        var node = FS.createNode(proc_self, "fd", 16895 /* 0777 */ , 73);
                        node.node_ops = {
                            lookup (parent, name) {
                                var fd = +name;
                                var stream = FS.getStreamChecked(fd);
                                var ret = {
                                    parent: null,
                                    mount: {
                                        mountpoint: "fake"
                                    },
                                    node_ops: {
                                        readlink: ()=>stream.path
                                    }
                                };
                                ret.parent = ret; // make it look like a simple root node
                                return ret;
                            }
                        };
                        return node;
                    }
                }, {}, "/proc/self/fd");
            },
            createStandardStreams () {
                // TODO deprecate the old functionality of a single
                // input / output callback and that utilizes FS.createDevice
                // and instead require a unique set of stream ops
                // by default, we symlink the standard streams to the
                // default tty devices. however, if the standard streams
                // have been overwritten we create a unique device for
                // them instead.
                if (Module["stdin"]) FS.createDevice("/dev", "stdin", Module["stdin"]);
                else FS.symlink("/dev/tty", "/dev/stdin");
                if (Module["stdout"]) FS.createDevice("/dev", "stdout", null, Module["stdout"]);
                else FS.symlink("/dev/tty", "/dev/stdout");
                if (Module["stderr"]) FS.createDevice("/dev", "stderr", null, Module["stderr"]);
                else FS.symlink("/dev/tty1", "/dev/stderr");
                // open default streams for the stdin, stdout and stderr devices
                var stdin = FS.open("/dev/stdin", 0);
                var stdout = FS.open("/dev/stdout", 1);
                var stderr = FS.open("/dev/stderr", 1);
                assert(stdin.fd === 0, `invalid handle for stdin (${stdin.fd})`);
                assert(stdout.fd === 1, `invalid handle for stdout (${stdout.fd})`);
                assert(stderr.fd === 2, `invalid handle for stderr (${stderr.fd})`);
            },
            ensureErrnoError () {
                if (FS.ErrnoError) return;
                FS.ErrnoError = /** @this{Object} */ function ErrnoError(errno, node) {
                    // We set the `name` property to be able to identify `FS.ErrnoError`
                    // - the `name` is a standard ECMA-262 property of error objects. Kind of good to have it anyway.
                    // - when using PROXYFS, an error can come from an underlying FS
                    // as different FS objects have their own FS.ErrnoError each,
                    // the test `err instanceof FS.ErrnoError` won't detect an error coming from another filesystem, causing bugs.
                    // we'll use the reliable test `err.name == "ErrnoError"` instead
                    this.name = "ErrnoError";
                    this.node = node;
                    this.setErrno = /** @this{Object} */ function(errno) {
                        this.errno = errno;
                        for(var key in ERRNO_CODES)if (ERRNO_CODES[key] === errno) {
                            this.code = key;
                            break;
                        }
                    };
                    this.setErrno(errno);
                    this.message = ERRNO_MESSAGES[errno];
                    // Try to get a maximally helpful stack trace. On Node.js, getting Error.stack
                    // now ensures it shows what we want.
                    if (this.stack) {
                        // Define the stack property for Node.js 4, which otherwise errors on the next line.
                        Object.defineProperty(this, "stack", {
                            value: (new Error).stack,
                            writable: true
                        });
                        this.stack = demangleAll(this.stack);
                    }
                };
                FS.ErrnoError.prototype = new Error();
                FS.ErrnoError.prototype.constructor = FS.ErrnoError;
                // Some errors may happen quite a bit, to avoid overhead we reuse them (and suffer a lack of stack info)
                [
                    44
                ].forEach((code)=>{
                    FS.genericErrors[code] = new FS.ErrnoError(code);
                    FS.genericErrors[code].stack = "<generic error, no stack>";
                });
            },
            staticInit () {
                FS.ensureErrnoError();
                FS.nameTable = new Array(4096);
                FS.mount(MEMFS, {}, "/");
                FS.createDefaultDirectories();
                FS.createDefaultDevices();
                FS.createSpecialDirectories();
                FS.filesystems = {
                    "MEMFS": MEMFS
                };
            },
            init (input, output, error) {
                assert(!FS.init.initialized, "FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)");
                FS.init.initialized = true;
                FS.ensureErrnoError();
                // Allow Module.stdin etc. to provide defaults, if none explicitly passed to us here
                Module["stdin"] = input || Module["stdin"];
                Module["stdout"] = output || Module["stdout"];
                Module["stderr"] = error || Module["stderr"];
                FS.createStandardStreams();
            },
            quit () {
                FS.init.initialized = false;
                // force-flush all streams, so we get musl std streams printed out
                _fflush(0);
                // close all of our streams
                for(var i = 0; i < FS.streams.length; i++){
                    var stream = FS.streams[i];
                    if (!stream) continue;
                    FS.close(stream);
                }
            },
            findObject (path, dontResolveLastLink) {
                var ret = FS.analyzePath(path, dontResolveLastLink);
                if (!ret.exists) return null;
                return ret.object;
            },
            analyzePath (path, dontResolveLastLink) {
                // operate from within the context of the symlink's target
                try {
                    var lookup = FS.lookupPath(path, {
                        follow: !dontResolveLastLink
                    });
                    path = lookup.path;
                } catch (e) {}
                var ret = {
                    isRoot: false,
                    exists: false,
                    error: 0,
                    name: null,
                    path: null,
                    object: null,
                    parentExists: false,
                    parentPath: null,
                    parentObject: null
                };
                try {
                    var lookup = FS.lookupPath(path, {
                        parent: true
                    });
                    ret.parentExists = true;
                    ret.parentPath = lookup.path;
                    ret.parentObject = lookup.node;
                    ret.name = PATH.basename(path);
                    lookup = FS.lookupPath(path, {
                        follow: !dontResolveLastLink
                    });
                    ret.exists = true;
                    ret.path = lookup.path;
                    ret.object = lookup.node;
                    ret.name = lookup.node.name;
                    ret.isRoot = lookup.path === "/";
                } catch (e) {
                    ret.error = e.errno;
                }
                return ret;
            },
            createPath (parent, path, canRead, canWrite) {
                parent = typeof parent == "string" ? parent : FS.getPath(parent);
                var parts = path.split("/").reverse();
                while(parts.length){
                    var part = parts.pop();
                    if (!part) continue;
                    var current = PATH.join2(parent, part);
                    try {
                        FS.mkdir(current);
                    } catch (e) {
                    // ignore EEXIST
                    }
                    parent = current;
                }
                return current;
            },
            createFile (parent, name, properties, canRead, canWrite) {
                var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
                var mode = FS_getMode(canRead, canWrite);
                return FS.create(path, mode);
            },
            createDataFile (parent, name, data, canRead, canWrite, canOwn) {
                var path = name;
                if (parent) {
                    parent = typeof parent == "string" ? parent : FS.getPath(parent);
                    path = name ? PATH.join2(parent, name) : parent;
                }
                var mode = FS_getMode(canRead, canWrite);
                var node = FS.create(path, mode);
                if (data) {
                    if (typeof data == "string") {
                        var arr = new Array(data.length);
                        for(var i = 0, len = data.length; i < len; ++i)arr[i] = data.charCodeAt(i);
                        data = arr;
                    }
                    // make sure we can write to the file
                    FS.chmod(node, mode | 146);
                    var stream = FS.open(node, 577);
                    FS.write(stream, data, 0, data.length, 0, canOwn);
                    FS.close(stream);
                    FS.chmod(node, mode);
                }
                return node;
            },
            createDevice (parent, name, input, output) {
                var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
                var mode = FS_getMode(!!input, !!output);
                if (!FS.createDevice.major) FS.createDevice.major = 64;
                var dev = FS.makedev(FS.createDevice.major++, 0);
                // Create a fake device that a set of stream ops to emulate
                // the old behavior.
                FS.registerDevice(dev, {
                    open (stream) {
                        stream.seekable = false;
                    },
                    close (stream) {
                        // flush any pending line data
                        if (output && output.buffer && output.buffer.length) output(10);
                    },
                    read (stream, buffer, offset, length, pos /* ignored */ ) {
                        var bytesRead = 0;
                        for(var i = 0; i < length; i++){
                            var result;
                            try {
                                result = input();
                            } catch (e) {
                                throw new FS.ErrnoError(29);
                            }
                            if (result === undefined && bytesRead === 0) throw new FS.ErrnoError(6);
                            if (result === null || result === undefined) break;
                            bytesRead++;
                            buffer[offset + i] = result;
                        }
                        if (bytesRead) stream.node.timestamp = Date.now();
                        return bytesRead;
                    },
                    write (stream, buffer, offset, length, pos) {
                        for(var i = 0; i < length; i++)try {
                            output(buffer[offset + i]);
                        } catch (e) {
                            throw new FS.ErrnoError(29);
                        }
                        if (length) stream.node.timestamp = Date.now();
                        return i;
                    }
                });
                return FS.mkdev(path, mode, dev);
            },
            forceLoadFile (obj) {
                if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
                if (typeof XMLHttpRequest != "undefined") throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
                else if (read_) // Command-line.
                try {
                    // WARNING: Can't read binary files in V8's d8 or tracemonkey's js, as
                    //          read() will try to parse UTF8.
                    obj.contents = intArrayFromString(read_(obj.url), true);
                    obj.usedBytes = obj.contents.length;
                } catch (e) {
                    throw new FS.ErrnoError(29);
                }
                else throw new Error("Cannot load without read() or XMLHttpRequest.");
            },
            createLazyFile (parent, name, url, canRead, canWrite) {
                // Lazy chunked Uint8Array (implements get and length from Uint8Array). Actual getting is abstracted away for eventual reuse.
                /** @constructor */ function LazyUint8Array() {
                    this.lengthKnown = false;
                    this.chunks = []; // Loaded chunks. Index is the chunk number
                }
                LazyUint8Array.prototype.get = /** @this{Object} */ function LazyUint8Array_get(idx) {
                    if (idx > this.length - 1 || idx < 0) return undefined;
                    var chunkOffset = idx % this.chunkSize;
                    var chunkNum = idx / this.chunkSize | 0;
                    return this.getter(chunkNum)[chunkOffset];
                };
                LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
                    this.getter = getter;
                };
                LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
                    // Find length
                    var xhr = new XMLHttpRequest();
                    xhr.open("HEAD", url, false);
                    xhr.send(null);
                    if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
                    var datalength = Number(xhr.getResponseHeader("Content-length"));
                    var header;
                    var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
                    var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
                    var chunkSize = 1048576; // Chunk size in bytes
                    if (!hasByteServing) chunkSize = datalength;
                    // Function to get a range from the remote URL.
                    var doXHR = (from, to)=>{
                        if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
                        if (to > datalength - 1) throw new Error("only " + datalength + " bytes available! programmer error!");
                        // TODO: Use mozResponseArrayBuffer, responseStream, etc. if available.
                        var xhr = new XMLHttpRequest();
                        xhr.open("GET", url, false);
                        if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
                        // Some hints to the browser that we want binary data.
                        xhr.responseType = "arraybuffer";
                        if (xhr.overrideMimeType) xhr.overrideMimeType("text/plain; charset=x-user-defined");
                        xhr.send(null);
                        if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
                        if (xhr.response !== undefined) return new Uint8Array(/** @type{Array<number>} */ xhr.response || []);
                        return intArrayFromString(xhr.responseText || "", true);
                    };
                    var lazyArray = this;
                    lazyArray.setDataGetter((chunkNum)=>{
                        var start = chunkNum * chunkSize;
                        var end = (chunkNum + 1) * chunkSize - 1; // including this byte
                        end = Math.min(end, datalength - 1); // if datalength-1 is selected, this is the last block
                        if (typeof lazyArray.chunks[chunkNum] == "undefined") lazyArray.chunks[chunkNum] = doXHR(start, end);
                        if (typeof lazyArray.chunks[chunkNum] == "undefined") throw new Error("doXHR failed!");
                        return lazyArray.chunks[chunkNum];
                    });
                    if (usesGzip || !datalength) {
                        // if the server uses gzip or doesn't supply the length, we have to download the whole file to get the (uncompressed) length
                        chunkSize = datalength = 1; // this will force getter(0)/doXHR do download the whole file
                        datalength = this.getter(0).length;
                        chunkSize = datalength;
                        out("LazyFiles on gzip forces download of the whole file when length is accessed");
                    }
                    this._length = datalength;
                    this._chunkSize = chunkSize;
                    this.lengthKnown = true;
                };
                if (typeof XMLHttpRequest != "undefined") {
                    if (!ENVIRONMENT_IS_WORKER) throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
                    var lazyArray = new LazyUint8Array();
                    Object.defineProperties(lazyArray, {
                        length: {
                            get: /** @this{Object} */ function() {
                                if (!this.lengthKnown) this.cacheLength();
                                return this._length;
                            }
                        },
                        chunkSize: {
                            get: /** @this{Object} */ function() {
                                if (!this.lengthKnown) this.cacheLength();
                                return this._chunkSize;
                            }
                        }
                    });
                    var properties = {
                        isDevice: false,
                        contents: lazyArray
                    };
                } else var properties = {
                    isDevice: false,
                    url: url
                };
                var node = FS.createFile(parent, name, properties, canRead, canWrite);
                // This is a total hack, but I want to get this lazy file code out of the
                // core of MEMFS. If we want to keep this lazy file concept I feel it should
                // be its own thin LAZYFS proxying calls to MEMFS.
                if (properties.contents) node.contents = properties.contents;
                else if (properties.url) {
                    node.contents = null;
                    node.url = properties.url;
                }
                // Add a function that defers querying the file size until it is asked the first time.
                Object.defineProperties(node, {
                    usedBytes: {
                        get: /** @this {FSNode} */ function() {
                            return this.contents.length;
                        }
                    }
                });
                // override each stream op with one that tries to force load the lazy file first
                var stream_ops = {};
                var keys = Object.keys(node.stream_ops);
                keys.forEach((key)=>{
                    var fn = node.stream_ops[key];
                    stream_ops[key] = function forceLoadLazyFile() {
                        FS.forceLoadFile(node);
                        return fn.apply(null, arguments);
                    };
                });
                function writeChunks(stream, buffer, offset, length, position) {
                    var contents = stream.node.contents;
                    if (position >= contents.length) return 0;
                    var size = Math.min(contents.length - position, length);
                    assert(size >= 0);
                    if (contents.slice) for(var i = 0; i < size; i++)buffer[offset + i] = contents[position + i];
                    else for(var i = 0; i < size; i++)buffer[offset + i] = contents.get(position + i);
                    return size;
                }
                // use a custom read function
                stream_ops.read = (stream, buffer, offset, length, position)=>{
                    FS.forceLoadFile(node);
                    return writeChunks(stream, buffer, offset, length, position);
                };
                // use a custom mmap function
                stream_ops.mmap = (stream, length, position, prot, flags)=>{
                    FS.forceLoadFile(node);
                    var ptr = mmapAlloc();
                    if (!ptr) throw new FS.ErrnoError(48);
                    writeChunks(stream, HEAP8, ptr, length, position);
                    return {
                        ptr,
                        allocated: true
                    };
                };
                node.stream_ops = stream_ops;
                return node;
            },
            absolutePath () {
                abort("FS.absolutePath has been removed; use PATH_FS.resolve instead");
            },
            createFolder () {
                abort("FS.createFolder has been removed; use FS.mkdir instead");
            },
            createLink () {
                abort("FS.createLink has been removed; use FS.symlink instead");
            },
            joinPath () {
                abort("FS.joinPath has been removed; use PATH.join instead");
            },
            mmapAlloc () {
                abort("FS.mmapAlloc has been replaced by the top level function mmapAlloc");
            },
            standardizePath () {
                abort("FS.standardizePath has been removed; use PATH.normalize instead");
            }
        };
        var SYSCALLS = {
            DEFAULT_POLLMASK: 5,
            calculateAt (dirfd, path, allowEmpty) {
                if (PATH.isAbs(path)) return path;
                // relative path
                var dir;
                if (dirfd === -100) dir = FS.cwd();
                else {
                    var dirstream = SYSCALLS.getStreamFromFD(dirfd);
                    dir = dirstream.path;
                }
                if (path.length == 0) {
                    if (!allowEmpty) throw new FS.ErrnoError(44);
                    return dir;
                }
                return PATH.join2(dir, path);
            },
            doStat (func, path, buf) {
                try {
                    var stat = func(path);
                } catch (e) {
                    if (e && e.node && PATH.normalize(path) !== PATH.normalize(FS.getPath(e.node))) // an error occurred while trying to look up the path; we should just report ENOTDIR
                    return -54;
                    throw e;
                }
                HEAP32[buf >> 2] = stat.dev;
                HEAP32[buf + 4 >> 2] = stat.mode;
                HEAPU32[buf + 8 >> 2] = stat.nlink;
                HEAP32[buf + 12 >> 2] = stat.uid;
                HEAP32[buf + 16 >> 2] = stat.gid;
                HEAP32[buf + 20 >> 2] = stat.rdev;
                tempI64 = [
                    stat.size >>> 0,
                    (tempDouble = stat.size, +Math.abs(tempDouble) >= 1.0 ? tempDouble > 0.0 ? +Math.floor(tempDouble / 4294967296.0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296.0) >>> 0 : 0)
                ], HEAP32[buf + 24 >> 2] = tempI64[0], HEAP32[buf + 28 >> 2] = tempI64[1];
                HEAP32[buf + 32 >> 2] = 4096;
                HEAP32[buf + 36 >> 2] = stat.blocks;
                var atime = stat.atime.getTime();
                var mtime = stat.mtime.getTime();
                var ctime = stat.ctime.getTime();
                tempI64 = [
                    Math.floor(atime / 1000) >>> 0,
                    (tempDouble = Math.floor(atime / 1000), +Math.abs(tempDouble) >= 1.0 ? tempDouble > 0.0 ? +Math.floor(tempDouble / 4294967296.0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296.0) >>> 0 : 0)
                ], HEAP32[buf + 40 >> 2] = tempI64[0], HEAP32[buf + 44 >> 2] = tempI64[1];
                HEAPU32[buf + 48 >> 2] = atime % 1000 * 1000;
                tempI64 = [
                    Math.floor(mtime / 1000) >>> 0,
                    (tempDouble = Math.floor(mtime / 1000), +Math.abs(tempDouble) >= 1.0 ? tempDouble > 0.0 ? +Math.floor(tempDouble / 4294967296.0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296.0) >>> 0 : 0)
                ], HEAP32[buf + 56 >> 2] = tempI64[0], HEAP32[buf + 60 >> 2] = tempI64[1];
                HEAPU32[buf + 64 >> 2] = mtime % 1000 * 1000;
                tempI64 = [
                    Math.floor(ctime / 1000) >>> 0,
                    (tempDouble = Math.floor(ctime / 1000), +Math.abs(tempDouble) >= 1.0 ? tempDouble > 0.0 ? +Math.floor(tempDouble / 4294967296.0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296.0) >>> 0 : 0)
                ], HEAP32[buf + 72 >> 2] = tempI64[0], HEAP32[buf + 76 >> 2] = tempI64[1];
                HEAPU32[buf + 80 >> 2] = ctime % 1000 * 1000;
                tempI64 = [
                    stat.ino >>> 0,
                    (tempDouble = stat.ino, +Math.abs(tempDouble) >= 1.0 ? tempDouble > 0.0 ? +Math.floor(tempDouble / 4294967296.0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296.0) >>> 0 : 0)
                ], HEAP32[buf + 88 >> 2] = tempI64[0], HEAP32[buf + 92 >> 2] = tempI64[1];
                return 0;
            },
            doMsync (addr, stream, len, flags, offset) {
                if (!FS.isFile(stream.node.mode)) throw new FS.ErrnoError(43);
                if (flags & 2) // MAP_PRIVATE calls need not to be synced back to underlying fs
                return 0;
                var buffer = HEAPU8.slice(addr, addr + len);
                FS.msync(stream, buffer, offset, len, flags);
            },
            varargs: undefined,
            get () {
                assert(SYSCALLS.varargs != undefined);
                // the `+` prepended here is necessary to convince the JSCompiler that varargs is indeed a number.
                var ret = HEAP32[+SYSCALLS.varargs >> 2];
                SYSCALLS.varargs += 4;
                return ret;
            },
            getp () {
                return SYSCALLS.get();
            },
            getStr (ptr) {
                var ret = UTF8ToString(ptr);
                return ret;
            },
            getStreamFromFD (fd) {
                var stream = FS.getStreamChecked(fd);
                return stream;
            }
        };
        var _environ_get = (__environ, environ_buf)=>{
            var bufSize = 0;
            getEnvStrings().forEach((string, i)=>{
                var ptr = environ_buf + bufSize;
                HEAPU32[__environ + i * 4 >> 2] = ptr;
                stringToAscii(string, ptr);
                bufSize += string.length + 1;
            });
            return 0;
        };
        var _environ_sizes_get = (penviron_count, penviron_buf_size)=>{
            var strings = getEnvStrings();
            HEAPU32[penviron_count >> 2] = strings.length;
            var bufSize = 0;
            strings.forEach((string)=>bufSize += string.length + 1);
            HEAPU32[penviron_buf_size >> 2] = bufSize;
            return 0;
        };
        var runtimeKeepaliveCounter = 0;
        var keepRuntimeAlive = ()=>noExitRuntime || runtimeKeepaliveCounter > 0;
        var _proc_exit = (code)=>{
            EXITSTATUS = code;
            if (!keepRuntimeAlive()) {
                if (Module["onExit"]) Module["onExit"](code);
                ABORT = true;
            }
            quit_(code, new ExitStatus(code));
        };
        /** @suppress {duplicate } */ /** @param {boolean|number=} implicit */ var exitJS = (status, implicit)=>{
            EXITSTATUS = status;
            checkUnflushedContent();
            // if exit() was called explicitly, warn the user if the runtime isn't actually being shut down
            if (keepRuntimeAlive() && !implicit) {
                var msg = `program exited (with status: ${status}), but keepRuntimeAlive() is set (counter=${runtimeKeepaliveCounter}) due to an async operation, so halting execution but not exiting the runtime or preventing further async execution (you can use emscripten_force_exit, if you want to force a true shutdown)`;
                readyPromiseReject(msg);
                err(msg);
            }
            _proc_exit(status);
        };
        var _exit = exitJS;
        function _fd_close(fd) {
            try {
                var stream = SYSCALLS.getStreamFromFD(fd);
                FS.close(stream);
                return 0;
            } catch (e) {
                if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                return e.errno;
            }
        }
        /** @param {number=} offset */ var doReadv = (stream, iov, iovcnt, offset)=>{
            var ret = 0;
            for(var i = 0; i < iovcnt; i++){
                var ptr = HEAPU32[iov >> 2];
                var len = HEAPU32[iov + 4 >> 2];
                iov += 8;
                var curr = FS.read(stream, HEAP8, ptr, len, offset);
                if (curr < 0) return -1;
                ret += curr;
                if (curr < len) break; // nothing more to read
                if (typeof offset !== "undefined") offset += curr;
            }
            return ret;
        };
        function _fd_read(fd, iov, iovcnt, pnum) {
            try {
                var stream = SYSCALLS.getStreamFromFD(fd);
                var num = doReadv(stream, iov, iovcnt);
                HEAPU32[pnum >> 2] = num;
                return 0;
            } catch (e) {
                if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                return e.errno;
            }
        }
        var convertI32PairToI53Checked = (lo, hi)=>{
            assert(lo == lo >>> 0 || lo == (lo | 0)); // lo should either be a i32 or a u32
            assert(hi === (hi | 0)); // hi should be a i32
            return hi + 0x200000 >>> 0 < 0x400001 - !!lo ? (lo >>> 0) + hi * 4294967296 : NaN;
        };
        function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
            var offset = convertI32PairToI53Checked(offset_low, offset_high);
            try {
                if (isNaN(offset)) return 61;
                var stream = SYSCALLS.getStreamFromFD(fd);
                FS.llseek(stream, offset, whence);
                tempI64 = [
                    stream.position >>> 0,
                    (tempDouble = stream.position, +Math.abs(tempDouble) >= 1.0 ? tempDouble > 0.0 ? +Math.floor(tempDouble / 4294967296.0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296.0) >>> 0 : 0)
                ], HEAP32[newOffset >> 2] = tempI64[0], HEAP32[newOffset + 4 >> 2] = tempI64[1];
                if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null; // reset readdir state
                return 0;
            } catch (e) {
                if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                return e.errno;
            }
        }
        /** @param {number=} offset */ var doWritev = (stream, iov, iovcnt, offset)=>{
            var ret = 0;
            for(var i = 0; i < iovcnt; i++){
                var ptr = HEAPU32[iov >> 2];
                var len = HEAPU32[iov + 4 >> 2];
                iov += 8;
                var curr = FS.write(stream, HEAP8, ptr, len, offset);
                if (curr < 0) return -1;
                ret += curr;
                if (typeof offset !== "undefined") offset += curr;
            }
            return ret;
        };
        function _fd_write(fd, iov, iovcnt, pnum) {
            try {
                var stream = SYSCALLS.getStreamFromFD(fd);
                var num = doWritev(stream, iov, iovcnt);
                HEAPU32[pnum >> 2] = num;
                return 0;
            } catch (e) {
                if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
                return e.errno;
            }
        }
        var isLeapYear = (year)=>{
            return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
        };
        var arraySum = (array, index)=>{
            var sum = 0;
            for(var i = 0; i <= index; sum += array[i++]);
            return sum;
        };
        var MONTH_DAYS_LEAP = [
            31,
            29,
            31,
            30,
            31,
            30,
            31,
            31,
            30,
            31,
            30,
            31
        ];
        var MONTH_DAYS_REGULAR = [
            31,
            28,
            31,
            30,
            31,
            30,
            31,
            31,
            30,
            31,
            30,
            31
        ];
        var addDays = (date, days)=>{
            var newDate = new Date(date.getTime());
            while(days > 0){
                var leap = isLeapYear(newDate.getFullYear());
                var currentMonth = newDate.getMonth();
                var daysInCurrentMonth = (leap ? MONTH_DAYS_LEAP : MONTH_DAYS_REGULAR)[currentMonth];
                if (days > daysInCurrentMonth - newDate.getDate()) {
                    // we spill over to next month
                    days -= daysInCurrentMonth - newDate.getDate() + 1;
                    newDate.setDate(1);
                    if (currentMonth < 11) newDate.setMonth(currentMonth + 1);
                    else {
                        newDate.setMonth(0);
                        newDate.setFullYear(newDate.getFullYear() + 1);
                    }
                } else {
                    // we stay in current month
                    newDate.setDate(newDate.getDate() + days);
                    return newDate;
                }
            }
            return newDate;
        };
        var writeArrayToMemory = (array, buffer)=>{
            assert(array.length >= 0, "writeArrayToMemory array must have a length (should be an array or typed array)");
            HEAP8.set(array, buffer);
        };
        var _strftime = (s, maxsize, format, tm)=>{
            // size_t strftime(char *restrict s, size_t maxsize, const char *restrict format, const struct tm *restrict timeptr);
            // http://pubs.opengroup.org/onlinepubs/009695399/functions/strftime.html
            var tm_zone = HEAPU32[tm + 40 >> 2];
            var date = {
                tm_sec: HEAP32[tm >> 2],
                tm_min: HEAP32[tm + 4 >> 2],
                tm_hour: HEAP32[tm + 8 >> 2],
                tm_mday: HEAP32[tm + 12 >> 2],
                tm_mon: HEAP32[tm + 16 >> 2],
                tm_year: HEAP32[tm + 20 >> 2],
                tm_wday: HEAP32[tm + 24 >> 2],
                tm_yday: HEAP32[tm + 28 >> 2],
                tm_isdst: HEAP32[tm + 32 >> 2],
                tm_gmtoff: HEAP32[tm + 36 >> 2],
                tm_zone: tm_zone ? UTF8ToString(tm_zone) : ""
            };
            var pattern = UTF8ToString(format);
            // expand format
            var EXPANSION_RULES_1 = {
                "%c": "%a %b %d %H:%M:%S %Y",
                "%D": "%m/%d/%y",
                "%F": "%Y-%m-%d",
                "%h": "%b",
                "%r": "%I:%M:%S %p",
                "%R": "%H:%M",
                "%T": "%H:%M:%S",
                "%x": "%m/%d/%y",
                "%X": "%H:%M:%S",
                // Modified Conversion Specifiers
                "%Ec": "%c",
                "%EC": "%C",
                "%Ex": "%m/%d/%y",
                "%EX": "%H:%M:%S",
                "%Ey": "%y",
                "%EY": "%Y",
                "%Od": "%d",
                "%Oe": "%e",
                "%OH": "%H",
                "%OI": "%I",
                "%Om": "%m",
                "%OM": "%M",
                "%OS": "%S",
                "%Ou": "%u",
                "%OU": "%U",
                "%OV": "%V",
                "%Ow": "%w",
                "%OW": "%W",
                "%Oy": "%y"
            };
            for(var rule in EXPANSION_RULES_1)pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_1[rule]);
            var WEEKDAYS = [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
            ];
            var MONTHS = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December"
            ];
            function leadingSomething(value, digits, character) {
                var str = typeof value == "number" ? value.toString() : value || "";
                while(str.length < digits)str = character[0] + str;
                return str;
            }
            function leadingNulls(value, digits) {
                return leadingSomething(value, digits, "0");
            }
            function compareByDay(date1, date2) {
                function sgn(value) {
                    return value < 0 ? -1 : value > 0 ? 1 : 0;
                }
                var compare;
                if ((compare = sgn(date1.getFullYear() - date2.getFullYear())) === 0) {
                    if ((compare = sgn(date1.getMonth() - date2.getMonth())) === 0) compare = sgn(date1.getDate() - date2.getDate());
                }
                return compare;
            }
            function getFirstWeekStartDate(janFourth) {
                switch(janFourth.getDay()){
                    case 0:
                        return new Date(janFourth.getFullYear() - 1, 11, 29);
                    case 1:
                        return janFourth;
                    case 2:
                        return new Date(janFourth.getFullYear(), 0, 3);
                    case 3:
                        return new Date(janFourth.getFullYear(), 0, 2);
                    case 4:
                        return new Date(janFourth.getFullYear(), 0, 1);
                    case 5:
                        return new Date(janFourth.getFullYear() - 1, 11, 31);
                    case 6:
                        return new Date(janFourth.getFullYear() - 1, 11, 30);
                }
            }
            function getWeekBasedYear(date) {
                var thisDate = addDays(new Date(date.tm_year + 1900, 0, 1), date.tm_yday);
                var janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4);
                var janFourthNextYear = new Date(thisDate.getFullYear() + 1, 0, 4);
                var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
                var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
                if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
                    // this date is after the start of the first week of this year
                    if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) return thisDate.getFullYear() + 1;
                    return thisDate.getFullYear();
                }
                return thisDate.getFullYear() - 1;
            }
            var EXPANSION_RULES_2 = {
                "%a": (date)=>WEEKDAYS[date.tm_wday].substring(0, 3),
                "%A": (date)=>WEEKDAYS[date.tm_wday],
                "%b": (date)=>MONTHS[date.tm_mon].substring(0, 3),
                "%B": (date)=>MONTHS[date.tm_mon],
                "%C": (date)=>{
                    var year = date.tm_year + 1900;
                    return leadingNulls(year / 100 | 0, 2);
                },
                "%d": (date)=>leadingNulls(date.tm_mday, 2),
                "%e": (date)=>leadingSomething(date.tm_mday, 2, " "),
                "%g": (date)=>{
                    // %g, %G, and %V give values according to the ISO 8601:2000 standard week-based year.
                    // In this system, weeks begin on a Monday and week 1 of the year is the week that includes
                    // January 4th, which is also the week that includes the first Thursday of the year, and
                    // is also the first week that contains at least four days in the year.
                    // If the first Monday of January is the 2nd, 3rd, or 4th, the preceding days are part of
                    // the last week of the preceding year; thus, for Saturday 2nd January 1999,
                    // %G is replaced by 1998 and %V is replaced by 53. If December 29th, 30th,
                    // or 31st is a Monday, it and any following days are part of week 1 of the following year.
                    // Thus, for Tuesday 30th December 1997, %G is replaced by 1998 and %V is replaced by 01.
                    return getWeekBasedYear(date).toString().substring(2);
                },
                "%G": (date)=>getWeekBasedYear(date),
                "%H": (date)=>leadingNulls(date.tm_hour, 2),
                "%I": (date)=>{
                    var twelveHour = date.tm_hour;
                    if (twelveHour == 0) twelveHour = 12;
                    else if (twelveHour > 12) twelveHour -= 12;
                    return leadingNulls(twelveHour, 2);
                },
                "%j": (date)=>{
                    // Day of the year (001-366)
                    return leadingNulls(date.tm_mday + arraySum(isLeapYear(date.tm_year + 1900) ? MONTH_DAYS_LEAP : MONTH_DAYS_REGULAR, date.tm_mon - 1), 3);
                },
                "%m": (date)=>leadingNulls(date.tm_mon + 1, 2),
                "%M": (date)=>leadingNulls(date.tm_min, 2),
                "%n": ()=>"\n",
                "%p": (date)=>{
                    if (date.tm_hour >= 0 && date.tm_hour < 12) return "AM";
                    return "PM";
                },
                "%S": (date)=>leadingNulls(date.tm_sec, 2),
                "%t": ()=>"	",
                "%u": (date)=>date.tm_wday || 7,
                "%U": (date)=>{
                    var days = date.tm_yday + 7 - date.tm_wday;
                    return leadingNulls(Math.floor(days / 7), 2);
                },
                "%V": (date)=>{
                    // Replaced by the week number of the year (Monday as the first day of the week)
                    // as a decimal number [01,53]. If the week containing 1 January has four
                    // or more days in the new year, then it is considered week 1.
                    // Otherwise, it is the last week of the previous year, and the next week is week 1.
                    // Both January 4th and the first Thursday of January are always in week 1. [ tm_year, tm_wday, tm_yday]
                    var val = Math.floor((date.tm_yday + 7 - (date.tm_wday + 6) % 7) / 7);
                    // If 1 Jan is just 1-3 days past Monday, the previous week
                    // is also in this year.
                    if ((date.tm_wday + 371 - date.tm_yday - 2) % 7 <= 2) val++;
                    if (!val) {
                        val = 52;
                        // If 31 December of prev year a Thursday, or Friday of a
                        // leap year, then the prev year has 53 weeks.
                        var dec31 = (date.tm_wday + 7 - date.tm_yday - 1) % 7;
                        if (dec31 == 4 || dec31 == 5 && isLeapYear(date.tm_year % 400 - 1)) val++;
                    } else if (val == 53) {
                        // If 1 January is not a Thursday, and not a Wednesday of a
                        // leap year, then this year has only 52 weeks.
                        var jan1 = (date.tm_wday + 371 - date.tm_yday) % 7;
                        if (jan1 != 4 && (jan1 != 3 || !isLeapYear(date.tm_year))) val = 1;
                    }
                    return leadingNulls(val, 2);
                },
                "%w": (date)=>date.tm_wday,
                "%W": (date)=>{
                    var days = date.tm_yday + 7 - (date.tm_wday + 6) % 7;
                    return leadingNulls(Math.floor(days / 7), 2);
                },
                "%y": (date)=>{
                    // Replaced by the last two digits of the year as a decimal number [00,99]. [ tm_year]
                    return (date.tm_year + 1900).toString().substring(2);
                },
                // Replaced by the year as a decimal number (for example, 1997). [ tm_year]
                "%Y": (date)=>date.tm_year + 1900,
                "%z": (date)=>{
                    // Replaced by the offset from UTC in the ISO 8601:2000 standard format ( +hhmm or -hhmm ).
                    // For example, "-0430" means 4 hours 30 minutes behind UTC (west of Greenwich).
                    var off = date.tm_gmtoff;
                    var ahead = off >= 0;
                    off = Math.abs(off) / 60;
                    // convert from minutes into hhmm format (which means 60 minutes = 100 units)
                    off = off / 60 * 100 + off % 60;
                    return (ahead ? "+" : "-") + String("0000" + off).slice(-4);
                },
                "%Z": (date)=>date.tm_zone,
                "%%": ()=>"%"
            };
            // Replace %% with a pair of NULLs (which cannot occur in a C string), then
            // re-inject them after processing.
            pattern = pattern.replace(/%%/g, "\0\0");
            for(var rule in EXPANSION_RULES_2)if (pattern.includes(rule)) pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_2[rule](date));
            pattern = pattern.replace(/\0\0/g, "%");
            var bytes = intArrayFromString(pattern, false);
            if (bytes.length > maxsize) return 0;
            writeArrayToMemory(bytes, s);
            return bytes.length - 1;
        };
        var _strftime_l = (s, maxsize, format, tm, loc)=>{
            return _strftime(s, maxsize, format, tm); // no locale support yet
        };
        var handleException = (e)=>{
            // Certain exception types we do not treat as errors since they are used for
            // internal control flow.
            // 1. ExitStatus, which is thrown by exit()
            // 2. "unwind", which is thrown by emscripten_unwind_to_js_event_loop() and others
            //    that wish to return to JS event loop.
            if (e instanceof ExitStatus || e == "unwind") return EXITSTATUS;
            checkStackCookie();
            if (e instanceof WebAssembly.RuntimeError) {
                if (_emscripten_stack_get_current() <= 0) err("Stack overflow detected.  You can try increasing -sSTACK_SIZE (currently set to 65536)");
            }
            quit_(1, e);
        };
        InternalError = Module["InternalError"] = class InternalError extends Error {
            constructor(message){
                super(message);
                this.name = "InternalError";
            }
        };
        embind_init_charCodes();
        BindingError = Module["BindingError"] = class BindingError extends Error {
            constructor(message){
                super(message);
                this.name = "BindingError";
            }
        };
        handleAllocatorInit();
        init_emval();
        UnboundTypeError = Module["UnboundTypeError"] = extendError(Error, "UnboundTypeError");
        var FSNode = /** @constructor */ function(parent, name, mode, rdev) {
            if (!parent) parent = this; // root node sets parent to itself
            this.parent = parent;
            this.mount = parent.mount;
            this.mounted = null;
            this.id = FS.nextInode++;
            this.name = name;
            this.mode = mode;
            this.node_ops = {};
            this.stream_ops = {};
            this.rdev = rdev;
        };
        var readMode = 365 /*73*/ ;
        var writeMode = 146 /*146*/ ;
        Object.defineProperties(FSNode.prototype, {
            read: {
                get: /** @this{FSNode} */ function() {
                    return (this.mode & readMode) === readMode;
                },
                set: /** @this{FSNode} */ function(val) {
                    val ? this.mode |= readMode : this.mode &= ~readMode;
                }
            },
            write: {
                get: /** @this{FSNode} */ function() {
                    return (this.mode & writeMode) === writeMode;
                },
                set: /** @this{FSNode} */ function(val) {
                    val ? this.mode |= writeMode : this.mode &= ~writeMode;
                }
            },
            isFolder: {
                get: /** @this{FSNode} */ function() {
                    return FS.isDir(this.mode);
                }
            },
            isDevice: {
                get: /** @this{FSNode} */ function() {
                    return FS.isChrdev(this.mode);
                }
            }
        });
        FS.FSNode = FSNode;
        FS.createPreloadedFile = FS_createPreloadedFile;
        FS.staticInit();
        ERRNO_CODES = {
            "EPERM": 63,
            "ENOENT": 44,
            "ESRCH": 71,
            "EINTR": 27,
            "EIO": 29,
            "ENXIO": 60,
            "E2BIG": 1,
            "ENOEXEC": 45,
            "EBADF": 8,
            "ECHILD": 12,
            "EAGAIN": 6,
            "EWOULDBLOCK": 6,
            "ENOMEM": 48,
            "EACCES": 2,
            "EFAULT": 21,
            "ENOTBLK": 105,
            "EBUSY": 10,
            "EEXIST": 20,
            "EXDEV": 75,
            "ENODEV": 43,
            "ENOTDIR": 54,
            "EISDIR": 31,
            "EINVAL": 28,
            "ENFILE": 41,
            "EMFILE": 33,
            "ENOTTY": 59,
            "ETXTBSY": 74,
            "EFBIG": 22,
            "ENOSPC": 51,
            "ESPIPE": 70,
            "EROFS": 69,
            "EMLINK": 34,
            "EPIPE": 64,
            "EDOM": 18,
            "ERANGE": 68,
            "ENOMSG": 49,
            "EIDRM": 24,
            "ECHRNG": 106,
            "EL2NSYNC": 156,
            "EL3HLT": 107,
            "EL3RST": 108,
            "ELNRNG": 109,
            "EUNATCH": 110,
            "ENOCSI": 111,
            "EL2HLT": 112,
            "EDEADLK": 16,
            "ENOLCK": 46,
            "EBADE": 113,
            "EBADR": 114,
            "EXFULL": 115,
            "ENOANO": 104,
            "EBADRQC": 103,
            "EBADSLT": 102,
            "EDEADLOCK": 16,
            "EBFONT": 101,
            "ENOSTR": 100,
            "ENODATA": 116,
            "ETIME": 117,
            "ENOSR": 118,
            "ENONET": 119,
            "ENOPKG": 120,
            "EREMOTE": 121,
            "ENOLINK": 47,
            "EADV": 122,
            "ESRMNT": 123,
            "ECOMM": 124,
            "EPROTO": 65,
            "EMULTIHOP": 36,
            "EDOTDOT": 125,
            "EBADMSG": 9,
            "ENOTUNIQ": 126,
            "EBADFD": 127,
            "EREMCHG": 128,
            "ELIBACC": 129,
            "ELIBBAD": 130,
            "ELIBSCN": 131,
            "ELIBMAX": 132,
            "ELIBEXEC": 133,
            "ENOSYS": 52,
            "ENOTEMPTY": 55,
            "ENAMETOOLONG": 37,
            "ELOOP": 32,
            "EOPNOTSUPP": 138,
            "EPFNOSUPPORT": 139,
            "ECONNRESET": 15,
            "ENOBUFS": 42,
            "EAFNOSUPPORT": 5,
            "EPROTOTYPE": 67,
            "ENOTSOCK": 57,
            "ENOPROTOOPT": 50,
            "ESHUTDOWN": 140,
            "ECONNREFUSED": 14,
            "EADDRINUSE": 3,
            "ECONNABORTED": 13,
            "ENETUNREACH": 40,
            "ENETDOWN": 38,
            "ETIMEDOUT": 73,
            "EHOSTDOWN": 142,
            "EHOSTUNREACH": 23,
            "EINPROGRESS": 26,
            "EALREADY": 7,
            "EDESTADDRREQ": 17,
            "EMSGSIZE": 35,
            "EPROTONOSUPPORT": 66,
            "ESOCKTNOSUPPORT": 137,
            "EADDRNOTAVAIL": 4,
            "ENETRESET": 39,
            "EISCONN": 30,
            "ENOTCONN": 53,
            "ETOOMANYREFS": 141,
            "EUSERS": 136,
            "EDQUOT": 19,
            "ESTALE": 72,
            "ENOTSUP": 138,
            "ENOMEDIUM": 148,
            "EILSEQ": 25,
            "EOVERFLOW": 61,
            "ECANCELED": 11,
            "ENOTRECOVERABLE": 56,
            "EOWNERDEAD": 62,
            "ESTRPIPE": 135
        };
        function checkIncomingModuleAPI() {
            ignoredModuleProp("fetchSettings");
        }
        var wasmImports = {
            /** @export */ __cxa_throw: ___cxa_throw,
            /** @export */ _embind_finalize_value_object: __embind_finalize_value_object,
            /** @export */ _embind_register_bigint: __embind_register_bigint,
            /** @export */ _embind_register_bool: __embind_register_bool,
            /** @export */ _embind_register_emval: __embind_register_emval,
            /** @export */ _embind_register_float: __embind_register_float,
            /** @export */ _embind_register_function: __embind_register_function,
            /** @export */ _embind_register_integer: __embind_register_integer,
            /** @export */ _embind_register_memory_view: __embind_register_memory_view,
            /** @export */ _embind_register_std_string: __embind_register_std_string,
            /** @export */ _embind_register_std_wstring: __embind_register_std_wstring,
            /** @export */ _embind_register_value_object: __embind_register_value_object,
            /** @export */ _embind_register_value_object_field: __embind_register_value_object_field,
            /** @export */ _embind_register_void: __embind_register_void,
            /** @export */ _emscripten_throw_longjmp: __emscripten_throw_longjmp,
            /** @export */ _emval_decref: __emval_decref,
            /** @export */ _emval_incref: __emval_incref,
            /** @export */ _emval_new_cstring: __emval_new_cstring,
            /** @export */ _emval_take_value: __emval_take_value,
            /** @export */ abort: _abort,
            /** @export */ emscripten_memcpy_js: _emscripten_memcpy_js,
            /** @export */ emscripten_resize_heap: _emscripten_resize_heap,
            /** @export */ environ_get: _environ_get,
            /** @export */ environ_sizes_get: _environ_sizes_get,
            /** @export */ exit: _exit,
            /** @export */ fd_close: _fd_close,
            /** @export */ fd_read: _fd_read,
            /** @export */ fd_seek: _fd_seek,
            /** @export */ fd_write: _fd_write,
            /** @export */ invoke_ii: invoke_ii,
            /** @export */ invoke_iii: invoke_iii,
            /** @export */ invoke_iiii: invoke_iiii,
            /** @export */ invoke_iiiii: invoke_iiiii,
            /** @export */ invoke_vi: invoke_vi,
            /** @export */ invoke_viii: invoke_viii,
            /** @export */ strftime_l: _strftime_l
        };
        var wasmExports = createWasm();
        var _malloc = createExportWrapper("malloc");
        var _main = Module["_main"] = createExportWrapper("main");
        var _free = createExportWrapper("free");
        var ___getTypeName = createExportWrapper("__getTypeName");
        Module["__embind_initialize_bindings"] = createExportWrapper("_embind_initialize_bindings");
        var _fflush = Module["_fflush"] = createExportWrapper("fflush");
        var _setThrew = createExportWrapper("setThrew");
        var _emscripten_stack_init = ()=>(_emscripten_stack_init = wasmExports["emscripten_stack_init"])();
        var _emscripten_stack_get_end = ()=>(_emscripten_stack_get_end = wasmExports["emscripten_stack_get_end"])();
        var stackSave = createExportWrapper("stackSave");
        var stackRestore = createExportWrapper("stackRestore");
        var _emscripten_stack_get_current = ()=>(_emscripten_stack_get_current = wasmExports["emscripten_stack_get_current"])();
        var ___cxa_is_pointer_type = createExportWrapper("__cxa_is_pointer_type");
        Module["dynCall_jiji"] = createExportWrapper("dynCall_jiji");
        Module["dynCall_viijii"] = createExportWrapper("dynCall_viijii");
        Module["dynCall_iiiiij"] = createExportWrapper("dynCall_iiiiij");
        Module["dynCall_iiiiijj"] = createExportWrapper("dynCall_iiiiijj");
        Module["dynCall_iiiiiijj"] = createExportWrapper("dynCall_iiiiiijj");
        function invoke_ii(index, a1) {
            var sp = stackSave();
            try {
                return getWasmTableEntry(index)(a1);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_vi(index, a1) {
            var sp = stackSave();
            try {
                getWasmTableEntry(index)(a1);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viii(index, a1, a2, a3) {
            var sp = stackSave();
            try {
                getWasmTableEntry(index)(a1, a2, a3);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iiii(index, a1, a2, a3) {
            var sp = stackSave();
            try {
                return getWasmTableEntry(index)(a1, a2, a3);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iii(index, a1, a2) {
            var sp = stackSave();
            try {
                return getWasmTableEntry(index)(a1, a2);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iiiii(index, a1, a2, a3, a4) {
            var sp = stackSave();
            try {
                return getWasmTableEntry(index)(a1, a2, a3, a4);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        // include: postamble.js
        // === Auto-generated postamble setup entry stuff ===
        var missingLibrarySymbols = [
            "writeI53ToI64",
            "writeI53ToI64Clamped",
            "writeI53ToI64Signaling",
            "writeI53ToU64Clamped",
            "writeI53ToU64Signaling",
            "readI53FromI64",
            "readI53FromU64",
            "convertI32PairToI53",
            "convertU32PairToI53",
            "ydayFromDate",
            "setErrNo",
            "inetPton4",
            "inetNtop4",
            "inetPton6",
            "inetNtop6",
            "readSockaddr",
            "writeSockaddr",
            "getHostByName",
            "getCallstack",
            "emscriptenLog",
            "convertPCtoSourceLocation",
            "readEmAsmArgs",
            "jstoi_q",
            "jstoi_s",
            "listenOnce",
            "autoResumeAudioContext",
            "runtimeKeepalivePush",
            "runtimeKeepalivePop",
            "callUserCallback",
            "maybeExit",
            "asmjsMangle",
            "getNativeTypeSize",
            "STACK_SIZE",
            "STACK_ALIGN",
            "POINTER_SIZE",
            "ASSERTIONS",
            "getCFunc",
            "ccall",
            "cwrap",
            "uleb128Encode",
            "sigToWasmTypes",
            "generateFuncType",
            "convertJsFunctionToWasm",
            "getEmptyTableSlot",
            "updateTableMap",
            "getFunctionAddress",
            "addFunction",
            "removeFunction",
            "reallyNegative",
            "unSign",
            "strLen",
            "reSign",
            "formatString",
            "intArrayToString",
            "AsciiToString",
            "stringToNewUTF8",
            "stringToUTF8OnStack",
            "registerKeyEventCallback",
            "maybeCStringToJsString",
            "findEventTarget",
            "findCanvasEventTarget",
            "getBoundingClientRect",
            "fillMouseEventData",
            "registerMouseEventCallback",
            "registerWheelEventCallback",
            "registerUiEventCallback",
            "registerFocusEventCallback",
            "fillDeviceOrientationEventData",
            "registerDeviceOrientationEventCallback",
            "fillDeviceMotionEventData",
            "registerDeviceMotionEventCallback",
            "screenOrientation",
            "fillOrientationChangeEventData",
            "registerOrientationChangeEventCallback",
            "fillFullscreenChangeEventData",
            "registerFullscreenChangeEventCallback",
            "JSEvents_requestFullscreen",
            "JSEvents_resizeCanvasForFullscreen",
            "registerRestoreOldStyle",
            "hideEverythingExceptGivenElement",
            "restoreHiddenElements",
            "setLetterbox",
            "softFullscreenResizeWebGLRenderTarget",
            "doRequestFullscreen",
            "fillPointerlockChangeEventData",
            "registerPointerlockChangeEventCallback",
            "registerPointerlockErrorEventCallback",
            "requestPointerLock",
            "fillVisibilityChangeEventData",
            "registerVisibilityChangeEventCallback",
            "registerTouchEventCallback",
            "fillGamepadEventData",
            "registerGamepadEventCallback",
            "registerBeforeUnloadEventCallback",
            "fillBatteryEventData",
            "battery",
            "registerBatteryEventCallback",
            "setCanvasElementSize",
            "getCanvasElementSize",
            "jsStackTrace",
            "stackTrace",
            "checkWasiClock",
            "wasiRightsToMuslOFlags",
            "wasiOFlagsToMuslOFlags",
            "createDyncallWrapper",
            "safeSetTimeout",
            "setImmediateWrapped",
            "clearImmediateWrapped",
            "polyfillSetImmediate",
            "getPromise",
            "makePromise",
            "idsToPromises",
            "makePromiseCallback",
            "findMatchingCatch",
            "setMainLoop",
            "getSocketFromFD",
            "getSocketAddress",
            "FS_unlink",
            "FS_mkdirTree",
            "_setNetworkCallback",
            "heapObjectForWebGLType",
            "heapAccessShiftForWebGLHeap",
            "webgl_enable_ANGLE_instanced_arrays",
            "webgl_enable_OES_vertex_array_object",
            "webgl_enable_WEBGL_draw_buffers",
            "webgl_enable_WEBGL_multi_draw",
            "emscriptenWebGLGet",
            "computeUnpackAlignedImageSize",
            "colorChannelsInGlTextureFormat",
            "emscriptenWebGLGetTexPixelData",
            "__glGenObject",
            "emscriptenWebGLGetUniform",
            "webglGetUniformLocation",
            "webglPrepareUniformLocationsBeforeFirstUse",
            "webglGetLeftBracePos",
            "emscriptenWebGLGetVertexAttrib",
            "__glGetActiveAttribOrUniform",
            "writeGLArray",
            "registerWebGlEventCallback",
            "runAndAbortIfError",
            "SDL_unicode",
            "SDL_ttfContext",
            "SDL_audio",
            "ALLOC_NORMAL",
            "ALLOC_STACK",
            "allocate",
            "writeStringToMemory",
            "writeAsciiToMemory",
            "getFunctionArgsName",
            "init_embind",
            "getBasestPointer",
            "registerInheritedInstance",
            "unregisterInheritedInstance",
            "getInheritedInstance",
            "getInheritedInstanceCount",
            "getLiveInheritedInstances",
            "enumReadValueFromPointer",
            "genericPointerToWireType",
            "constNoSmartPtrRawPointerToWireType",
            "nonConstNoSmartPtrRawPointerToWireType",
            "init_RegisteredPointer",
            "RegisteredPointer",
            "RegisteredPointer_fromWireType",
            "runDestructor",
            "releaseClassHandle",
            "detachFinalizer",
            "attachFinalizer",
            "makeClassHandle",
            "init_ClassHandle",
            "ClassHandle",
            "throwInstanceAlreadyDeleted",
            "flushPendingDeletes",
            "setDelayFunction",
            "RegisteredClass",
            "shallowCopyInternalPointer",
            "downcastPointer",
            "upcastPointer",
            "validateThis",
            "craftEmvalAllocator",
            "emval_get_global",
            "emval_lookupTypes",
            "emval_addMethodCaller"
        ];
        missingLibrarySymbols.forEach(missingLibrarySymbol);
        var unexportedSymbols = [
            "run",
            "addOnPreRun",
            "addOnInit",
            "addOnPreMain",
            "addOnExit",
            "addOnPostRun",
            "addRunDependency",
            "removeRunDependency",
            "FS_createFolder",
            "FS_createPath",
            "FS_createLazyFile",
            "FS_createLink",
            "FS_createDevice",
            "FS_readFile",
            "out",
            "err",
            "callMain",
            "abort",
            "wasmMemory",
            "wasmExports",
            "stackAlloc",
            "stackSave",
            "stackRestore",
            "getTempRet0",
            "setTempRet0",
            "writeStackCookie",
            "checkStackCookie",
            "convertI32PairToI53Checked",
            "ptrToString",
            "zeroMemory",
            "exitJS",
            "getHeapMax",
            "growMemory",
            "ENV",
            "MONTH_DAYS_REGULAR",
            "MONTH_DAYS_LEAP",
            "MONTH_DAYS_REGULAR_CUMULATIVE",
            "MONTH_DAYS_LEAP_CUMULATIVE",
            "isLeapYear",
            "arraySum",
            "addDays",
            "ERRNO_CODES",
            "ERRNO_MESSAGES",
            "DNS",
            "Protocols",
            "Sockets",
            "initRandomFill",
            "randomFill",
            "timers",
            "warnOnce",
            "UNWIND_CACHE",
            "readEmAsmArgsArray",
            "getExecutableName",
            "dynCallLegacy",
            "getDynCaller",
            "dynCall",
            "handleException",
            "keepRuntimeAlive",
            "asyncLoad",
            "alignMemory",
            "mmapAlloc",
            "handleAllocatorInit",
            "HandleAllocator",
            "wasmTable",
            "noExitRuntime",
            "freeTableIndexes",
            "functionsInTableMap",
            "setValue",
            "getValue",
            "PATH",
            "PATH_FS",
            "UTF8Decoder",
            "UTF8ArrayToString",
            "UTF8ToString",
            "stringToUTF8Array",
            "stringToUTF8",
            "lengthBytesUTF8",
            "intArrayFromString",
            "stringToAscii",
            "UTF16Decoder",
            "UTF16ToString",
            "stringToUTF16",
            "lengthBytesUTF16",
            "UTF32ToString",
            "stringToUTF32",
            "lengthBytesUTF32",
            "writeArrayToMemory",
            "JSEvents",
            "specialHTMLTargets",
            "currentFullscreenStrategy",
            "restoreOldWindowedStyle",
            "demangle",
            "demangleAll",
            "ExitStatus",
            "getEnvStrings",
            "doReadv",
            "doWritev",
            "promiseMap",
            "uncaughtExceptionCount",
            "exceptionLast",
            "exceptionCaught",
            "ExceptionInfo",
            "Browser",
            "wget",
            "SYSCALLS",
            "preloadPlugins",
            "FS_createPreloadedFile",
            "FS_modeStringToFlags",
            "FS_getMode",
            "FS_stdin_getChar_buffer",
            "FS_stdin_getChar",
            "FS",
            "FS_createDataFile",
            "MEMFS",
            "TTY",
            "PIPEFS",
            "SOCKFS",
            "tempFixedLengthArray",
            "miniTempWebGLFloatBuffers",
            "miniTempWebGLIntBuffers",
            "GL",
            "emscripten_webgl_power_preferences",
            "AL",
            "GLUT",
            "EGL",
            "GLEW",
            "IDBStore",
            "SDL",
            "SDL_gfx",
            "allocateUTF8",
            "allocateUTF8OnStack",
            "InternalError",
            "BindingError",
            "throwInternalError",
            "throwBindingError",
            "registeredTypes",
            "awaitingDependencies",
            "typeDependencies",
            "tupleRegistrations",
            "structRegistrations",
            "sharedRegisterType",
            "whenDependentTypesAreResolved",
            "embind_charCodes",
            "embind_init_charCodes",
            "readLatin1String",
            "getTypeName",
            "getFunctionName",
            "heap32VectorToArray",
            "requireRegisteredType",
            "UnboundTypeError",
            "PureVirtualError",
            "GenericWireTypeSize",
            "throwUnboundTypeError",
            "ensureOverloadTable",
            "exposePublicSymbol",
            "replacePublicSymbol",
            "extendError",
            "createNamedFunction",
            "embindRepr",
            "registeredInstances",
            "registeredPointers",
            "registerType",
            "integerReadValueFromPointer",
            "floatReadValueFromPointer",
            "simpleReadValueFromPointer",
            "readPointer",
            "runDestructors",
            "newFunc",
            "craftInvokerFunction",
            "embind__requireFunction",
            "finalizationRegistry",
            "detachFinalizer_deps",
            "deletionQueue",
            "delayFunction",
            "char_0",
            "char_9",
            "makeLegalFunctionName",
            "emval_handles",
            "emval_symbols",
            "init_emval",
            "count_emval_handles",
            "getStringOrSymbol",
            "Emval",
            "emval_newers",
            "emval_methodCallers"
        ];
        unexportedSymbols.forEach(unexportedRuntimeSymbol);
        var calledRun;
        dependenciesFulfilled = function runCaller() {
            // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
            if (!calledRun) run();
            if (!calledRun) dependenciesFulfilled = runCaller; // try this again later, after new deps are fulfilled
        };
        function callMain() {
            assert(runDependencies == 0, 'cannot call main when async dependencies remain! (listen on Module["onRuntimeInitialized"])');
            assert(__ATPRERUN__.length == 0, "cannot call main when preRun functions remain to be called");
            var entryFunction = _main;
            var argc = 0;
            var argv = 0;
            try {
                var ret = entryFunction(argc, argv);
                // if we're not running an evented main loop, it's time to exit
                exitJS(ret, /* implicit = */ true);
                return ret;
            } catch (e) {
                return handleException(e);
            }
        }
        function stackCheckInit() {
            // This is normally called automatically during __wasm_call_ctors but need to
            // get these values before even running any of the ctors so we call it redundantly
            // here.
            _emscripten_stack_init();
            // TODO(sbc): Move writeStackCookie to native to to avoid this.
            writeStackCookie();
        }
        function run() {
            if (runDependencies > 0) return;
            stackCheckInit();
            preRun();
            // a preRun added a dependency, run will be called later
            if (runDependencies > 0) return;
            function doRun() {
                // run may have just been called through dependencies being fulfilled just in this very frame,
                // or while the async setStatus time below was happening
                if (calledRun) return;
                calledRun = true;
                Module["calledRun"] = true;
                if (ABORT) return;
                initRuntime();
                preMain();
                readyPromiseResolve(Module);
                if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
                if (shouldRunNow) callMain();
                postRun();
            }
            if (Module["setStatus"]) {
                Module["setStatus"]("Running...");
                setTimeout(function() {
                    setTimeout(function() {
                        Module["setStatus"]("");
                    }, 1);
                    doRun();
                }, 1);
            } else doRun();
            checkStackCookie();
        }
        function checkUnflushedContent() {
            // Compiler settings do not allow exiting the runtime, so flushing
            // the streams is not possible. but in ASSERTIONS mode we check
            // if there was something to flush, and if so tell the user they
            // should request that the runtime be exitable.
            // Normally we would not even include flush() at all, but in ASSERTIONS
            // builds we do so just for this check, and here we see if there is any
            // content to flush, that is, we check if there would have been
            // something a non-ASSERTIONS build would have not seen.
            // How we flush the streams depends on whether we are in SYSCALLS_REQUIRE_FILESYSTEM=0
            // mode (which has its own special function for this; otherwise, all
            // the code is inside libc)
            var oldOut = out;
            var oldErr = err;
            var has = false;
            out = err = (x)=>{
                has = true;
            };
            try {
                _fflush(0);
                // also flush in the JS FS layer
                [
                    "stdout",
                    "stderr"
                ].forEach(function(name) {
                    var info = FS.analyzePath("/dev/" + name);
                    if (!info) return;
                    var stream = info.object;
                    var rdev = stream.rdev;
                    var tty = TTY.ttys[rdev];
                    if (tty && tty.output && tty.output.length) has = true;
                });
            } catch (e) {}
            out = oldOut;
            err = oldErr;
            if (has) warnOnce("stdio streams had content in them that was not flushed. you should set EXIT_RUNTIME to 1 (see the Emscripten FAQ), or make sure to emit a newline when you printf etc.");
        }
        if (Module["preInit"]) {
            if (typeof Module["preInit"] == "function") Module["preInit"] = [
                Module["preInit"]
            ];
            while(Module["preInit"].length > 0)Module["preInit"].pop()();
        }
        // shouldRunNow refers to calling main(), not run().
        var shouldRunNow = true;
        if (Module["noInitialRun"]) shouldRunNow = false;
        run();
        // end include: postamble.js
        return moduleArg.ready;
    };
})();
// @ts-expect-error untyped
let library;
/**
   * Instances the WASM module and returns it, only one module will be created upon multiple calls.
   * @category WASM
   * @group WASM
   *
   * @returns
   */ const getLibrary = async ()=>{
    if (!library) library = await Module();
    return library;
};
/**
   * @deprecated
   * @param description
   * @param name
   * @param defaultValue
   * @returns
   */ /* istanbul ignore next */ const getAttribute = (description, name, defaultValue)=>{
    var _a;
    let returnValue;
    const parsedValue = (_a = description.attributes.getNamedItem(name)) === null || _a === void 0 ? void 0 : _a.nodeValue;
    if (!parsedValue) {
        const node = description.getElementsByTagName(name)[0];
        if (node) {
            const values = node.getElementsByTagName("rdf:li");
            if (values.length === 3) returnValue = Array.from(values).map((v)=>v.innerHTML);
            else throw new Error(`Gainmap metadata contains an array of items for ${name} but its length is not 3`);
        } else {
            if (defaultValue) return defaultValue;
            else throw new Error(`Can't find ${name} in gainmap metadata`);
        }
    } else returnValue = parsedValue;
    return returnValue;
};
/**
   * Decodes a JPEG file with an embedded Gainmap and XMP Metadata (aka JPEG-R)
   *
   * @category Decoding
   * @group Decoding
   * @deprecated
   * @example
   * import { decodeJPEGMetadata } from '@monogrid/gainmap-js/libultrahdr'
   *
   * // fetch a JPEG image containing a gainmap as ArrayBuffer
   * const gainmap = new Uint8Array(await (await fetch('gainmap.jpeg')).arrayBuffer())
   *
   * // extract data from the JPEG
   * const { gainMap, sdr, parsedMetadata } = await decodeJPEGMetadata(gainmap)
   *
   * @param file A Jpeg file Uint8Array.
   * @returns The decoded data
   * @throws {Error} if the provided file cannot be parsed or does not contain a valid Gainmap
   */ /* istanbul ignore next */ const decodeJPEGMetadata = async (file)=>{
    var _a, _b;
    const lib = await getLibrary();
    const result = lib.extractJpegR(file, file.length);
    if (!result.success) throw new Error(`${result.errorMessage}`);
    const parser = new DOMParser();
    const xmlDocument = parser.parseFromString(result.metadata, "text/xml");
    const description = xmlDocument.getElementsByTagName("rdf:Description")[0];
    const gainMapMin = getAttribute(description, "hdrgm:GainMapMin", "0");
    const gainMapMax = getAttribute(description, "hdrgm:GainMapMax");
    const gamma = getAttribute(description, "hdrgm:Gamma", "1");
    const offsetSDR = getAttribute(description, "hdrgm:OffsetSDR", "0.015625");
    const offsetHDR = getAttribute(description, "hdrgm:OffsetHDR", "0.015625");
    let hdrCapacityMin = (_a = description.attributes.getNamedItem("hdrgm:HDRCapacityMin")) === null || _a === void 0 ? void 0 : _a.nodeValue;
    if (!hdrCapacityMin) hdrCapacityMin = "0";
    const hdrCapacityMax = (_b = description.attributes.getNamedItem("hdrgm:HDRCapacityMax")) === null || _b === void 0 ? void 0 : _b.nodeValue;
    if (!hdrCapacityMax) throw new Error("Incomplete gainmap metadata");
    const parsedMetadata = {
        gainMapMin: Array.isArray(gainMapMin) ? gainMapMin.map((v)=>parseFloat(v)) : [
            parseFloat(gainMapMin),
            parseFloat(gainMapMin),
            parseFloat(gainMapMin)
        ],
        gainMapMax: Array.isArray(gainMapMax) ? gainMapMax.map((v)=>parseFloat(v)) : [
            parseFloat(gainMapMax),
            parseFloat(gainMapMax),
            parseFloat(gainMapMax)
        ],
        gamma: Array.isArray(gamma) ? gamma.map((v)=>parseFloat(v)) : [
            parseFloat(gamma),
            parseFloat(gamma),
            parseFloat(gamma)
        ],
        offsetSdr: Array.isArray(offsetSDR) ? offsetSDR.map((v)=>parseFloat(v)) : [
            parseFloat(offsetSDR),
            parseFloat(offsetSDR),
            parseFloat(offsetSDR)
        ],
        offsetHdr: Array.isArray(offsetHDR) ? offsetHDR.map((v)=>parseFloat(v)) : [
            parseFloat(offsetHDR),
            parseFloat(offsetHDR),
            parseFloat(offsetHDR)
        ],
        hdrCapacityMin: parseFloat(hdrCapacityMin),
        hdrCapacityMax: parseFloat(hdrCapacityMax)
    };
    return {
        ...result,
        /**
		   * Parsed metadata
		   */ parsedMetadata
    };
};
/**
   * Encapsulates a Gainmap into a single JPEG file (aka: JPEG-R) with the base map
   * as the sdr visualization and the gainMap encoded into a MPF (Multi-Picture Format) tag.
   *
   * @category Encoding
   * @group Encoding
   *
   * @example
   * import { compress, encode, findTextureMinMax } from '@monogrid/gainmap-js'
   * import { encodeJPEGMetadata } from '@monogrid/gainmap-js/libultrahdr'
   * import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js'
   *
   * // load an HDR file
   * const loader = new EXRLoader()
   * const image = await loader.loadAsync('image.exr')
   *
   * // find RAW RGB Max value of a texture
   * const textureMax = await findTextureMinMax(image)
   *
   * // Encode the gainmap
   * const encodingResult = encode({
   *   image,
   *   maxContentBoost: Math.max.apply(this, textureMax)
   * })
   *
   * // obtain the RAW RGBA SDR buffer and create an ImageData
   * const sdrImageData = new ImageData(
   *   encodingResult.sdr.toArray(),
   *   encodingResult.sdr.width,
   *   encodingResult.sdr.height
   * )
   * // obtain the RAW RGBA Gain map buffer and create an ImageData
   * const gainMapImageData = new ImageData(
   *   encodingResult.gainMap.toArray(),
   *   encodingResult.gainMap.width,
   *   encodingResult.gainMap.height
   * )
   *
   * // parallel compress the RAW buffers into the specified mimeType
   * const mimeType = 'image/jpeg'
   * const quality = 0.9
   *
   * const [sdr, gainMap] = await Promise.all([
   *   compress({
   *     source: sdrImageData,
   *     mimeType,
   *     quality,
   *     flipY: true // output needs to be flipped
   *   }),
   *   compress({
   *     source: gainMapImageData,
   *     mimeType,
   *     quality,
   *     flipY: true // output needs to be flipped
   *   })
   * ])
   *
   * // obtain the metadata which will be embedded into
   * // and XMP tag inside the final JPEG file
   * const metadata = encodingResult.getMetadata()
   *
   * // embed the compressed images + metadata into a single
   * // JPEG file
   * const jpeg = await encodeJPEGMetadata({
   *   ...encodingResult,
   *   ...metadata,
   *   sdr,
   *   gainMap
   * })
   *
   * // `jpeg` will be an `Uint8Array` which can be saved somewhere
   *
   *
   * @param encodingResult
   * @returns an Uint8Array representing a JPEG-R file
   * @throws {Error} If `encodingResult.sdr.mimeType !== 'image/jpeg'`
   * @throws {Error} If `encodingResult.gainMap.mimeType !== 'image/jpeg'`
   */ const encodeJPEGMetadata = async (encodingResult)=>{
    const lib = await getLibrary();
    if (encodingResult.sdr.mimeType !== "image/jpeg") throw new Error("This function expects an SDR image compressed in jpeg");
    if (encodingResult.gainMap.mimeType !== "image/jpeg") throw new Error("This function expects a GainMap image compressed in jpeg");
    return lib.appendGainMap(encodingResult.sdr.width, encodingResult.sdr.height, encodingResult.sdr.data, encodingResult.sdr.data.length, encodingResult.gainMap.data, encodingResult.gainMap.data.length, encodingResult.gainMapMax.reduce((p, n)=>p + n, 0) / encodingResult.gainMapMax.length, encodingResult.gainMapMin.reduce((p, n)=>p + n, 0) / encodingResult.gainMapMin.length, encodingResult.gamma.reduce((p, n)=>p + n, 0) / encodingResult.gamma.length, encodingResult.offsetSdr.reduce((p, n)=>p + n, 0) / encodingResult.offsetSdr.length, encodingResult.offsetHdr.reduce((p, n)=>p + n, 0) / encodingResult.offsetHdr.length, encodingResult.hdrCapacityMin, encodingResult.hdrCapacityMax);
};

},{"316d73eca7447f1":"d5jf4","f7cf485ba21328dc":"fCgem","e052745b6c1d5788":"3ETBl","383f4ebaf771ea4a":"kLCsq","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"d5jf4":[function(require,module,exports) {
// shim for using process in browser
var process = module.exports = {};
// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.
var cachedSetTimeout;
var cachedClearTimeout;
function defaultSetTimout() {
    throw new Error("setTimeout has not been defined");
}
function defaultClearTimeout() {
    throw new Error("clearTimeout has not been defined");
}
(function() {
    try {
        if (typeof setTimeout === "function") cachedSetTimeout = setTimeout;
        else cachedSetTimeout = defaultSetTimout;
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === "function") cachedClearTimeout = clearTimeout;
        else cachedClearTimeout = defaultClearTimeout;
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
})();
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) //normal enviroments in sane situations
    return setTimeout(fun, 0);
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) //normal enviroments in sane situations
    return clearTimeout(marker);
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;
function cleanUpNextTick() {
    if (!draining || !currentQueue) return;
    draining = false;
    if (currentQueue.length) queue = currentQueue.concat(queue);
    else queueIndex = -1;
    if (queue.length) drainQueue();
}
function drainQueue() {
    if (draining) return;
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;
    var len = queue.length;
    while(len){
        currentQueue = queue;
        queue = [];
        while(++queueIndex < len)if (currentQueue) currentQueue[queueIndex].run();
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}
process.nextTick = function(fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) for(var i = 1; i < arguments.length; i++)args[i - 1] = arguments[i];
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) runTimeout(drainQueue);
};
// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function() {
    this.fun.apply(null, this.array);
};
process.title = "browser";
process.browser = true;
process.env = {};
process.argv = [];
process.version = ""; // empty string to avoid regexp issues
process.versions = {};
function noop() {}
process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;
process.listeners = function(name) {
    return [];
};
process.binding = function(name) {
    throw new Error("process.binding is not supported");
};
process.cwd = function() {
    return "/";
};
process.chdir = function(dir) {
    throw new Error("process.chdir is not supported");
};
process.umask = function() {
    return 0;
};

},{}],"3ETBl":[function(require,module,exports) {
module.exports = require("42c4cda895454ee6")(require("93d6240ac5424be8").getBundleURL("b7Rhu") + "_empty.3744e336.js").catch((err)=>{
    delete module.bundle.cache[module.id];
    throw err;
}).then(()=>module.bundle.root("jhUEF"));

},{"42c4cda895454ee6":"61B45","93d6240ac5424be8":"lgJ39"}],"61B45":[function(require,module,exports) {
"use strict";
var cacheLoader = require("ca2a84f7fa4a3bb0");
module.exports = cacheLoader(function(bundle) {
    return new Promise(function(resolve, reject) {
        // Don't insert the same script twice (e.g. if it was already in the HTML)
        var existingScripts = document.getElementsByTagName("script");
        if ([].concat(existingScripts).some(function isCurrentBundle(script) {
            return script.src === bundle;
        })) {
            resolve();
            return;
        }
        var preloadLink = document.createElement("link");
        preloadLink.href = bundle;
        preloadLink.rel = "preload";
        preloadLink.as = "script";
        document.head.appendChild(preloadLink);
        var script = document.createElement("script");
        script.async = true;
        script.type = "text/javascript";
        script.src = bundle;
        script.onerror = function(e) {
            var error = new TypeError("Failed to fetch dynamically imported module: ".concat(bundle, ". Error: ").concat(e.message));
            script.onerror = script.onload = null;
            script.remove();
            reject(error);
        };
        script.onload = function() {
            script.onerror = script.onload = null;
            resolve();
        };
        document.getElementsByTagName("head")[0].appendChild(script);
    });
});

},{"ca2a84f7fa4a3bb0":"j49pS"}],"j49pS":[function(require,module,exports) {
"use strict";
var cachedBundles = {};
var cachedPreloads = {};
var cachedPrefetches = {};
function getCache(type) {
    switch(type){
        case "preload":
            return cachedPreloads;
        case "prefetch":
            return cachedPrefetches;
        default:
            return cachedBundles;
    }
}
module.exports = function(loader, type) {
    return function(bundle) {
        var cache = getCache(type);
        if (cache[bundle]) return cache[bundle];
        return cache[bundle] = loader.apply(null, arguments).catch(function(e) {
            delete cache[bundle];
            throw e;
        });
    };
};

},{}],"kLCsq":[function(require,module,exports) {
module.exports = require("e02189691561f32a").getBundleURL("b7Rhu") + "libultrahdr-esm.79313af0.wasm";

},{"e02189691561f32a":"lgJ39"}],"lfwhv":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "getScaledSettings", ()=>getScaledSettings);
function getScaledSettings() {
    let tiles = 3;
    let renderScale = Math.max(1 / window.devicePixelRatio, 0.5);
    // adjust performance parameters for mobile
    const aspectRatio = window.innerWidth / window.innerHeight;
    if (aspectRatio < 0.65) {
        tiles = 4;
        renderScale = 0.5 / window.devicePixelRatio;
    }
    return {
        tiles,
        renderScale
    };
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}]},["V9FSb"], "V9FSb", "parcelRequire5b70")

//# sourceMappingURL=hdr.df30414d.js.map
