let e,t,r,a,o,n,i,s,l,c,d,h;function u(e,t,r,a){Object.defineProperty(e,t,{get:r,set:a,enumerable:!0,configurable:!0})}var p=globalThis,f={},m={},g=p.parcelRequire5b70;null==g&&((g=function(e){if(e in f)return f[e].exports;if(e in m){var t=m[e];delete m[e];var r={id:e,exports:{}};return f[e]=r,t.call(r.exports,r,r.exports),r.exports}var a=Error("Cannot find module '"+e+"'");throw a.code="MODULE_NOT_FOUND",a}).register=function(e,t){m[e]=t},p.parcelRequire5b70=g);var v=g.register;v("27Lyk",function(e,t){u(e.exports,"register",()=>r,e=>r=e),u(e.exports,"resolve",()=>a,e=>a=e);var r,a,o=new Map;r=function(e,t){for(var r=0;r<t.length-1;r+=2)o.set(t[r],{baseUrl:e,path:t[r+1]})},a=function(e){var t=o.get(e);if(null==t)throw Error("Could not resolve bundle with id "+e);return new URL(t.path,t.baseUrl).toString()}}),v("891vQ",function(e,t){u(e.exports,"RGBELoader",()=>a);var r=g("ilwiq");class a extends r.DataTextureLoader{constructor(e){super(e),this.type=r.HalfFloatType}parse(e){let t,a,o;let n=function(e,t){switch(e){case 1:throw Error("THREE.RGBELoader: Read Error: "+(t||""));case 2:throw Error("THREE.RGBELoader: Write Error: "+(t||""));case 3:throw Error("THREE.RGBELoader: Bad File Format: "+(t||""));default:throw Error("THREE.RGBELoader: Memory Error: "+(t||""))}},i=function(e,t,r){t=t||1024;let a=e.pos,o=-1,n=0,i="",s=String.fromCharCode.apply(null,new Uint16Array(e.subarray(a,a+128)));for(;0>(o=s.indexOf("\n"))&&n<t&&a<e.byteLength;)i+=s,n+=s.length,a+=128,s+=String.fromCharCode.apply(null,new Uint16Array(e.subarray(a,a+128)));return -1<o&&(!1!==r&&(e.pos+=n+o+1),i+s.slice(0,o))},s=new Uint8Array(e);s.pos=0;let l=function(e){let t,r;let a=/^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,o=/^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,s=/^\s*FORMAT=(\S+)\s*$/,l=/^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,c={valid:0,string:"",comments:"",programtype:"RGBE",format:"",gamma:1,exposure:1,width:0,height:0};for(!(e.pos>=e.byteLength)&&(t=i(e))||n(1,"no header found"),(r=t.match(/^#\?(\S+)/))||n(3,"bad initial token"),c.valid|=1,c.programtype=r[1],c.string+=t+"\n";!1!==(t=i(e));){if(c.string+=t+"\n","#"===t.charAt(0)){c.comments+=t+"\n";continue}if((r=t.match(a))&&(c.gamma=parseFloat(r[1])),(r=t.match(o))&&(c.exposure=parseFloat(r[1])),(r=t.match(s))&&(c.valid|=2,c.format=r[1]),(r=t.match(l))&&(c.valid|=4,c.height=parseInt(r[1],10),c.width=parseInt(r[2],10)),2&c.valid&&4&c.valid)break}return 2&c.valid||n(3,"missing format specifier"),4&c.valid||n(3,"missing image size specifier"),c}(s),c=l.width,d=l.height,h=function(e,t,r){if(t<8||t>32767||2!==e[0]||2!==e[1]||128&e[2])return new Uint8Array(e);t!==(e[2]<<8|e[3])&&n(3,"wrong scanline width");let a=new Uint8Array(4*t*r);a.length||n(4,"unable to allocate buffer space");let o=0,i=0,s=4*t,l=new Uint8Array(4),c=new Uint8Array(s),d=r;for(;d>0&&i<e.byteLength;){i+4>e.byteLength&&n(1),l[0]=e[i++],l[1]=e[i++],l[2]=e[i++],l[3]=e[i++],(2!=l[0]||2!=l[1]||(l[2]<<8|l[3])!=t)&&n(3,"bad rgbe scanline format");let r=0,h;for(;r<s&&i<e.byteLength;){let t=(h=e[i++])>128;if(t&&(h-=128),(0===h||r+h>s)&&n(3,"bad scanline data"),t){let t=e[i++];for(let e=0;e<h;e++)c[r++]=t}else c.set(e.subarray(i,i+h),r),r+=h,i+=h}for(let e=0;e<t;e++){let r=0;a[o]=c[e+r],r+=t,a[o+1]=c[e+r],r+=t,a[o+2]=c[e+r],r+=t,a[o+3]=c[e+r],o+=4}d--}return a}(s.subarray(s.pos),c,d);switch(this.type){case r.FloatType:let u=new Float32Array(4*(o=h.length/4));for(let e=0;e<o;e++)!function(e,t,r,a){let o=Math.pow(2,e[t+3]-128)/255;r[a+0]=e[t+0]*o,r[a+1]=e[t+1]*o,r[a+2]=e[t+2]*o,r[a+3]=1}(h,4*e,u,4*e);t=u,a=r.FloatType;break;case r.HalfFloatType:let p=new Uint16Array(4*(o=h.length/4));for(let e=0;e<o;e++)!function(e,t,a,o){let n=Math.pow(2,e[t+3]-128)/255;a[o+0]=(0,r.DataUtils).toHalfFloat(Math.min(e[t+0]*n,65504)),a[o+1]=(0,r.DataUtils).toHalfFloat(Math.min(e[t+1]*n,65504)),a[o+2]=(0,r.DataUtils).toHalfFloat(Math.min(e[t+2]*n,65504)),a[o+3]=(0,r.DataUtils).toHalfFloat(1)}(h,4*e,p,4*e);t=p,a=r.HalfFloatType;break;default:throw Error("THREE.RGBELoader: Unsupported type: "+this.type)}return{width:c,height:d,data:t,header:l.string,gamma:l.gamma,exposure:l.exposure,type:a}}setDataType(e){return this.type=e,this}load(e,t,a,o){return super.load(e,function(e,a){switch(e.type){case r.FloatType:case r.HalfFloatType:e.colorSpace=r.LinearSRGBColorSpace,e.minFilter=r.LinearFilter,e.magFilter=r.LinearFilter,e.generateMipmaps=!1,e.flipY=!0}t&&t(e,a)},a,o)}}}),v("kqOCM",function(e,t){u(e.exports,"ParallelMeshBVHWorker",()=>d);var r=g("ilwiq"),a=g("6KVZ3"),o=g("3ePKg"),n=g("cSOJe"),i=g("a8VBx"),s=g("5Gkg5");let l="undefined"!=typeof navigator?navigator.hardwareConcurrency:4;class c extends o.WorkerBase{constructor(){if(super(new Worker(g("2tQrc"))),this.name="ParallelMeshBVHWorker",this.maxWorkerCount=Math.max(l,4),!(0,n.isSharedArrayBufferSupported)())throw Error("ParallelMeshBVHWorker: Shared Array Buffers are not supported.")}runTask(e,t,o={}){return new Promise((i,l)=>{if(t.index||o.indirect||(0,s.ensureIndex)(t,o),t.getAttribute("position").isInterleavedBufferAttribute||t.index&&t.index.isInterleavedBufferAttribute)throw Error("ParallelMeshBVHWorker: InterleavedBufferAttribute are not supported for the geometry attributes.");e.onerror=e=>{l(Error(`ParallelMeshBVHWorker: ${e.message}`))},e.onmessage=n=>{let{data:s}=n;if(s.error)l(Error(s.error)),e.onmessage=null;else if(s.serialized){let{serialized:n,position:l}=s,c=(0,a.MeshBVH).deserialize(n,t,{setIndex:!1}),d={setBoundingBox:!0,...o};if(t.attributes.position.array=l,n.index){if(t.index)t.index.array=n.index;else{let e=new r.BufferAttribute(n.index,1,!1);t.setIndex(e)}}d.setBoundingBox&&(t.boundingBox=c.getBoundingBox(new r.Box3)),o.onProgress&&o.onProgress(s.progress),i(c),e.onmessage=null}else o.onProgress&&o.onProgress(s.progress)};let c=t.index?t.index.array:null,d=t.attributes.position.array;e.postMessage({operation:"BUILD_BVH",maxWorkerCount:this.maxWorkerCount,index:(0,n.convertToBufferType)(c,SharedArrayBuffer),position:(0,n.convertToBufferType)(d,SharedArrayBuffer),options:{...o,onProgress:null,includedProgressCallback:!!o.onProgress,groups:[...t.groups]}})})}}class d{constructor(){if((0,n.isSharedArrayBufferSupported)())return new c;{console.warn("ParallelMeshBVHWorker: SharedArrayBuffers not supported. Falling back to single-threaded GenerateMeshBVHWorker.");let e=new i.GenerateMeshBVHWorker;return e.maxWorkerCount=l,e}}}}),v("3ePKg",function(e,t){u(e.exports,"WorkerBase",()=>r);class r{constructor(e){this.name="WorkerBase",this.running=!1,this.worker=e,this.worker.onerror=e=>{if(e.message)throw Error(`${this.name}: Could not create Web Worker with error "${e.message}"`);throw Error(`${this.name}: Could not create Web Worker.`)}}runTask(){}generate(...e){if(this.running)throw Error("GenerateMeshBVHWorker: Already running job.");if(null===this.worker)throw Error("GenerateMeshBVHWorker: Worker has been disposed.");this.running=!0;let t=this.runTask(this.worker,...e);return t.finally(()=>{this.running=!1}),t}dispose(){this.worker.terminate(),this.worker=null}}}),v("a8VBx",function(e,t){u(e.exports,"GenerateMeshBVHWorker",()=>n);var r=g("ilwiq"),a=g("6KVZ3"),o=g("3ePKg");class n extends o.WorkerBase{constructor(){super(new Worker(g("jVRlM"))),this.name="GenerateMeshBVHWorker"}runTask(e,t,o={}){return new Promise((n,i)=>{if(t.getAttribute("position").isInterleavedBufferAttribute||t.index&&t.index.isInterleavedBufferAttribute)throw Error("GenerateMeshBVHWorker: InterleavedBufferAttribute are not supported for the geometry attributes.");e.onerror=e=>{i(Error(`GenerateMeshBVHWorker: ${e.message}`))},e.onmessage=s=>{let{data:l}=s;if(l.error)i(Error(l.error)),e.onmessage=null;else if(l.serialized){let{serialized:i,position:s}=l,c=(0,a.MeshBVH).deserialize(i,t,{setIndex:!1}),d=Object.assign({setBoundingBox:!0},o);if(t.attributes.position.array=s,i.index){if(t.index)t.index.array=i.index;else{let e=new r.BufferAttribute(i.index,1,!1);t.setIndex(e)}}d.setBoundingBox&&(t.boundingBox=c.getBoundingBox(new r.Box3)),o.onProgress&&o.onProgress(l.progress),n(c),e.onmessage=null}else o.onProgress&&o.onProgress(l.progress)};let s=t.index?t.index.array:null,l=t.attributes.position.array,c=[l];s&&c.push(s),e.postMessage({index:s,position:l,options:{...o,onProgress:null,includedProgressCallback:!!o.onProgress,groups:[...t.groups]}},c.map(e=>e.buffer).filter(e=>"undefined"==typeof SharedArrayBuffer||!(e instanceof SharedArrayBuffer)))})}}}),v("jVRlM",function(e,t){var r=g("7ryUf");let a=new URL("generateMeshBVH.worker.373f3c58.js",import.meta.url);e.exports=r(a.toString(),a.origin,!0)}),v("7ryUf",function(e,t){e.exports=function(e,t,r){if(t===self.location.origin)return e;var a=r?"import "+JSON.stringify(e)+";":"importScripts("+JSON.stringify(e)+");";return URL.createObjectURL(new Blob([a],{type:"application/javascript"}))}}),v("2tQrc",function(e,t){var r=g("7ryUf");let a=new URL("parallelMeshBVH.worker.22cf4bb0.js",import.meta.url);e.exports=r(a.toString(),a.origin,!0)}),v("e2Pv4",function(e,t){let r;u(e.exports,"LoaderElement",()=>a);class a{constructor(){r||((r=document.createElement("style")).textContent=`

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
	`,document.head.appendChild(r));let e=document.createElement("div");e.classList.add("loader-container");let t=document.createElement("div");t.classList.add("percentage"),e.appendChild(t);let a=document.createElement("div");a.classList.add("samples"),e.appendChild(a);let o=document.createElement("div");o.classList.add("credits"),e.appendChild(o);let n=document.createElement("div");n.classList.add("bar"),e.appendChild(n);let i=document.createElement("div");i.classList.add("description"),e.appendChild(i),this._description=i,this._loaderBar=n,this._percentage=t,this._credits=o,this._samples=a,this._container=e,this.setPercentage(0)}attach(e){e.appendChild(this._container),e.appendChild(this._description)}setPercentage(e){this._loaderBar.style.width=`${100*e}%`,0===e?this._percentage.innerText="Loading...":this._percentage.innerText=`${(100*e).toFixed(0)}%`,e>=1?this._container.classList.remove("loading"):this._container.classList.add("loading")}setSamples(e,t=!1){t?this._samples.innerText="compiling shader...":this._samples.innerText=`${Math.floor(e)} samples`}setCredits(e){this._credits.innerHTML=e}setDescription(e){this._description.innerHTML=e}}}),v("9fZ6X",function(e,t){u(e.exports,"MaterialBase",()=>a);var r=g("ilwiq");class a extends r.ShaderMaterial{set needsUpdate(e){super.needsUpdate=!0,this.dispatchEvent({type:"recompilation"})}constructor(e){for(let t in super(e),this.uniforms)Object.defineProperty(this,t,{get(){return this.uniforms[t].value},set(e){this.uniforms[t].value=e}})}setDefine(e,t){if(null==t){if(e in this.defines)return delete this.defines[e],this.needsUpdate=!0,!0}else if(this.defines[e]!==t)return this.defines[e]=t,this.needsUpdate=!0,!0;return!1}}}),v("fYvb1",function(e,t){u(e.exports,"math_functions",()=>r);let r=`

	// Fast arccos approximation used to remove banding artifacts caused by numerical errors in acos.
	// This is a cubic Lagrange interpolating polynomial for x = [-1, -1/2, 0, 1/2, 1].
	// For more information see: https://github.com/disini/three-gpu-pathtracer/pull/171#issuecomment-1152275248
	float acosApprox( float x ) {

		x = clamp( x, -1.0, 1.0 );
		return ( - 0.69813170079773212 * x * x - 0.87266462599716477 ) * x + 1.5707963267948966;

	}

	// An acos with input values bound to the range [-1, 1].
	float acosSafe( float x ) {

		return acos( clamp( x, -1.0, 1.0 ) );

	}

	float saturateCos( float val ) {

		return clamp( val, 0.001, 1.0 );

	}

	float square( float t ) {

		return t * t;

	}

	vec2 square( vec2 t ) {

		return t * t;

	}

	vec3 square( vec3 t ) {

		return t * t;

	}

	vec4 square( vec4 t ) {

		return t * t;

	}

	vec2 rotateVector( vec2 v, float t ) {

		float ac = cos( t );
		float as = sin( t );
		return vec2(
			v.x * ac - v.y * as,
			v.x * as + v.y * ac
		);

	}

	// forms a basis with the normal vector as Z
	mat3 getBasisFromNormal( vec3 normal ) {

		vec3 other;
		if ( abs( normal.x ) > 0.5 ) {

			other = vec3( 0.0, 1.0, 0.0 );

		} else {

			other = vec3( 1.0, 0.0, 0.0 );

		}

		vec3 ortho = normalize( cross( normal, other ) );
		vec3 ortho2 = normalize( cross( normal, ortho ) );
		return mat3( ortho2, ortho, normal );

	}

`}),v("dUUQZ",function(e,t){u(e.exports,"util_functions",()=>r);let r=`

	// TODO: possibly this should be renamed something related to material or path tracing logic

	#ifndef RAY_OFFSET
	#define RAY_OFFSET 1e-4
	#endif

	// adjust the hit point by the surface normal by a factor of some offset and the
	// maximum component-wise value of the current point to accommodate floating point
	// error as values increase.
	vec3 stepRayOrigin( vec3 rayOrigin, vec3 rayDirection, vec3 offset, float dist ) {

		vec3 point = rayOrigin + rayDirection * dist;
		vec3 absPoint = abs( point );
		float maxPoint = max( absPoint.x, max( absPoint.y, absPoint.z ) );
		return point + offset * ( maxPoint + 1.0 ) * RAY_OFFSET;

	}

	// https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_materials_volume/README.md#attenuation
	vec3 transmissionAttenuation( float dist, vec3 attColor, float attDist ) {

		vec3 ot = - log( attColor ) / attDist;
		return exp( - ot * dist );

	}

	vec3 getHalfVector( vec3 wi, vec3 wo, float eta ) {

		// get the half vector - assuming if the light incident vector is on the other side
		// of the that it's transmissive.
		vec3 h;
		if ( wi.z > 0.0 ) {

			h = normalize( wi + wo );

		} else {

			// Scale by the ior ratio to retrieve the appropriate half vector
			// From Section 2.2 on computing the transmission half vector:
			// https://blog.selfshadow.com/publications/s2015-shading-course/burley/s2015_pbs_disney_bsdf_notes.pdf
			h = normalize( wi + wo * eta );

		}

		h *= sign( h.z );
		return h;

	}

	vec3 getHalfVector( vec3 a, vec3 b ) {

		return normalize( a + b );

	}

	// The discrepancy between interpolated surface normal and geometry normal can cause issues when a ray
	// is cast that is on the top side of the geometry normal plane but below the surface normal plane. If
	// we find a ray like that we ignore it to avoid artifacts.
	// This function returns if the direction is on the same side of both planes.
	bool isDirectionValid( vec3 direction, vec3 surfaceNormal, vec3 geometryNormal ) {

		bool aboveSurfaceNormal = dot( direction, surfaceNormal ) > 0.0;
		bool aboveGeometryNormal = dot( direction, geometryNormal ) > 0.0;
		return aboveSurfaceNormal == aboveGeometryNormal;

	}

	// ray sampling x and z are swapped to align with expected background view
	vec2 equirectDirectionToUv( vec3 direction ) {

		// from Spherical.setFromCartesianCoords
		vec2 uv = vec2( atan( direction.z, direction.x ), acos( direction.y ) );
		uv /= vec2( 2.0 * PI, PI );

		// apply adjustments to get values in range [0, 1] and y right side up
		uv.x += 0.5;
		uv.y = 1.0 - uv.y;
		return uv;

	}

	vec3 equirectUvToDirection( vec2 uv ) {

		// undo above adjustments
		uv.x -= 0.5;
		uv.y = 1.0 - uv.y;

		// from Vector3.setFromSphericalCoords
		float theta = uv.x * 2.0 * PI;
		float phi = uv.y * PI;

		float sinPhi = sin( phi );

		return vec3( sinPhi * cos( theta ), cos( phi ), sinPhi * sin( theta ) );

	}

	// power heuristic for multiple importance sampling
	float misHeuristic( float a, float b ) {

		float aa = a * a;
		float bb = b * b;
		return aa / ( aa + bb );

	}

	// tentFilter from Peter Shirley's 'Realistic Ray Tracing (2nd Edition)' book, pg. 60
	// erichlof/THREE.js-PathTracing-Renderer/
	float tentFilter( float x ) {

		return x < 0.5 ? sqrt( 2.0 * x ) - 1.0 : 1.0 - sqrt( 2.0 - ( 2.0 * x ) );

	}
`}),v("8keuf",function(e,t){u(e.exports,"ggx_functions",()=>r);let r=`

	// The GGX functions provide sampling and distribution information for normals as output so
	// in order to get probability of scatter direction the half vector must be computed and provided.
	// [0] https://www.cs.cornell.edu/~srm/publications/EGSR07-btdf.pdf
	// [1] https://hal.archives-ouvertes.fr/hal-01509746/document
	// [2] http://jcgt.org/published/0007/04/01/
	// [4] http://jcgt.org/published/0003/02/03/

	// trowbridge-reitz === GGX === GTR

	vec3 ggxDirection( vec3 incidentDir, vec2 roughness, vec2 uv ) {

		// TODO: try GGXVNDF implementation from reference [2], here. Needs to update ggxDistribution
		// function below, as well

		// Implementation from reference [1]
		// stretch view
		vec3 V = normalize( vec3( roughness * incidentDir.xy, incidentDir.z ) );

		// orthonormal basis
		vec3 T1 = ( V.z < 0.9999 ) ? normalize( cross( V, vec3( 0.0, 0.0, 1.0 ) ) ) : vec3( 1.0, 0.0, 0.0 );
		vec3 T2 = cross( T1, V );

		// sample point with polar coordinates (r, phi)
		float a = 1.0 / ( 1.0 + V.z );
		float r = sqrt( uv.x );
		float phi = ( uv.y < a ) ? uv.y / a * PI : PI + ( uv.y - a ) / ( 1.0 - a ) * PI;
		float P1 = r * cos( phi );
		float P2 = r * sin( phi ) * ( ( uv.y < a ) ? 1.0 : V.z );

		// compute normal
		vec3 N = P1 * T1 + P2 * T2 + V * sqrt( max( 0.0, 1.0 - P1 * P1 - P2 * P2 ) );

		// unstretch
		N = normalize( vec3( roughness * N.xy, max( 0.0, N.z ) ) );

		return N;

	}

	// Below are PDF and related functions for use in a Monte Carlo path tracer
	// as specified in Appendix B of the following paper
	// See equation (34) from reference [0]
	float ggxLamda( float theta, float roughness ) {

		float tanTheta = tan( theta );
		float tanTheta2 = tanTheta * tanTheta;
		float alpha2 = roughness * roughness;

		float numerator = - 1.0 + sqrt( 1.0 + alpha2 * tanTheta2 );
		return numerator / 2.0;

	}

	// See equation (34) from reference [0]
	float ggxShadowMaskG1( float theta, float roughness ) {

		return 1.0 / ( 1.0 + ggxLamda( theta, roughness ) );

	}

	// See equation (125) from reference [4]
	float ggxShadowMaskG2( vec3 wi, vec3 wo, float roughness ) {

		float incidentTheta = acos( wi.z );
		float scatterTheta = acos( wo.z );
		return 1.0 / ( 1.0 + ggxLamda( incidentTheta, roughness ) + ggxLamda( scatterTheta, roughness ) );

	}

	// See equation (33) from reference [0]
	float ggxDistribution( vec3 halfVector, float roughness ) {

		float a2 = roughness * roughness;
		a2 = max( EPSILON, a2 );
		float cosTheta = halfVector.z;
		float cosTheta4 = pow( cosTheta, 4.0 );

		if ( cosTheta == 0.0 ) return 0.0;

		float theta = acosSafe( halfVector.z );
		float tanTheta = tan( theta );
		float tanTheta2 = pow( tanTheta, 2.0 );

		float denom = PI * cosTheta4 * pow( a2 + tanTheta2, 2.0 );
		return ( a2 / denom );

	}

	// See equation (3) from reference [2]
	float ggxPDF( vec3 wi, vec3 halfVector, float roughness ) {

		float incidentTheta = acos( wi.z );
		float D = ggxDistribution( halfVector, roughness );
		float G1 = ggxShadowMaskG1( incidentTheta, roughness );

		return D * G1 * max( 0.0, dot( wi, halfVector ) ) / wi.z;

	}

`}),g("27Lyk").register(new URL("",import.meta.url).toString(),JSON.parse('["bTBll","viewerTest.daf0f9c0.js","512E4","parallelMeshBVH.worker.22cf4bb0.js","9P1cE","generateMeshBVH.worker.cd4b9fc6.js","lWWke","generateMeshBVH.worker.373f3c58.js","9P1cE","generateMeshBVH.worker.cd4b9fc6.js","jwbL2","aoRender.e5303912.js","63CMm","aoRender.a1271ff5.js","2tzBs","aoRender.89c1b67b.js","6UuCC","aoRender.5fc59dbe.js","6mMEU","aoRender.fc8349f1.js","i0zVc","aoRender.dcf40b33.js","j19h5","aoRender.e8b1599c.js","5lTJX","areaLight.1c24b9b9.js","eif6c","areaLight.5654e8b2.js"]'));var b=g("ilwiq"),w=g("kp7Te"),y=g("891vQ"),x=g("7lx9d"),T=g("jiuw3"),B=g("8mHfG"),k=g("5Rd1x"),E=g("kqOCM"),P=g("e2Pv4");const M="https://raw.githubusercontent.com/google/model-viewer/master/packages/render-fidelity-tools/test/config/",S=new URLSearchParams(window.location.search),L=parseInt(S.get("samples"))||-1,C="true"===S.get("hideUI"),R={enable:!0,bounces:10,transmissiveBounces:10,pause:!1,multipleImportanceSampling:!0,acesToneMapping:!0,tiles:parseInt(S.get("tiles"))||2,scale:parseInt(S.get("scale"))||1/window.devicePixelRatio,model:"",checkerboardTransparency:!0,displayImage:!1,imageMode:"overlay",imageOpacity:1,imageType:"dspbr-pt"};let F=!1,A=0;function V(){if(R.model=Object.keys(h)[0],window.location.hash){let e=window.location.hash.substring(1).replaceAll("%20"," ");e in h&&(R.model=e)}G()}function H(){1!==i.tiles&&(A=1),R.checkerboardTransparency?e.classList.add("checkerboard"):e.classList.remove("checkerboard"),i.multipleImportanceSampling=R.multipleImportanceSampling,i.bounces=R.bounces,i.transmissiveBounces=R.transmissiveBounces,i.renderScale=R.scale;let t=h[R.model];c.background=t&&t.renderSkybox?c.environment:null,i.updateEnvironment()}async function G(){a&&(e.classList.remove("checkerboard"),a.destroy(),a=null),o&&(o.traverse(e=>{if(e.material){let t=e.material;for(let e in t)t[e]&&t[e].isTexture&&t[e].dispose()}}),c.remove(o)),n&&n.dispose();let t=h[R.model],{verticalFoV:u=45,lighting:p="../../../shared-assets/environments/lightroom_14b.hdr"}=t,{orbit:f={},target:m={},dimensions:g={}}=t;f={theta:0,phi:90,radius:1,...f},m={x:0,y:0,z:0,...m},g={width:768,height:768,...g},f.radius=Math.max(f.radius,1e-5),F=!0,e.style.display="none";let v=new URL(p,M).toString(),B=new URL(t.model,M).toString().replace(/.*?glTF-Sample-Assets/,"https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main"),k=new b.LoadingManager,[E,P]=await Promise.all([new(0,y.RGBELoader)(k).loadAsync(v),new(0,x.GLTFLoader)(k).setMeshoptDecoder(w.MeshoptDecoder).loadAsync(B,e=>{0!==e.total&&e.total>=e.loaded&&r.setPercentage(.5*e.loaded/e.total)}),new Promise(e=>k.onLoad=e)]);(n=E).mapping=b.EquirectangularReflectionMapping,c.environment=n;let S=[];(o=P.scene).traverse(e=>{e.isLight&&e.target&&S.push(e.target)}),S.forEach(e=>e.removeFromParent());let L=new b.Group;L.position.set(-m.x,-m.y,-m.z),L.add(o),(o=L).updateMatrixWorld(!0),c.add(o);let A=new b.Box3,V=new b.Sphere;A.setFromObject(o),A.getBoundingSphere(V);let G=Math.max(f.radius,V.radius);l.near=2*G/1e3,l.far=2*G,l.updateProjectionMatrix(),l.position.setFromSphericalCoords(f.radius,b.MathUtils.DEG2RAD*f.phi,b.MathUtils.DEG2RAD*f.theta);let{width:j,height:D}=g;s.setSize(j,D),s.setPixelRatio(window.devicePixelRatio),l.aspect=j/D,l.fov=u,l.updateProjectionMatrix(),d.update(),await i.setSceneAsync(c,l,{onProgress:e=>{r.setPercentage(.5+.5*e)}}),r.setCredits(t.credit||""),e.style.display="flex",F=!1,H(),function(){if(C)return;a&&a.destroy(),(a=new T.GUI).add(R,"model",Object.keys(h)).onChange(e=>{window.location.hash=e});let e=a.addFolder("Path Tracer");e.add(R,"enable"),e.add(R,"pause"),e.add(R,"scale",.1,1).onChange(H),e.add(R,"multipleImportanceSampling").onChange(H),e.add(R,"acesToneMapping").onChange(e=>{s.toneMapping=e?b.ACESFilmicToneMapping:b.NoToneMapping}),e.add(R,"tiles",1,10,1).onChange(e=>{i.tiles.set(e,e)}),e.add(R,"bounces",1,20,1).onChange(H),e.add(R,"transmissiveBounces",1,20,1).onChange(H);let t=a.addFolder("Comparison");t.add(R,"displayImage"),t.add(R,"imageMode",["overlay","side-by-side"]),t.add(R,"imageType",["dspbr-pt","filament","babylon","gltf-sample-viewer","model-viewer","rhodonite","stellar"]).onChange(U),t.add(R,"imageOpacity",0,1),t.add(R,"checkerboardTransparency").onChange(H)}(),U()}function U(){t.src=`https://raw.githubusercontent.com/google/model-viewer/master/packages/render-fidelity-tools/test/goldens/${R.model}/${R.imageType}-golden.png`}!async function(){e=document.getElementById("container"),t=document.querySelector("img"),C&&(e.style.background="transparent",document.body.style.background="transparent"),r=new P.LoaderElement,C||r.attach(document.body),(s=new b.WebGLRenderer({antialias:!0,preserveDrawingBuffer:!0})).physicallyCorrectLights=!0,s.toneMapping=b.ACESFilmicToneMapping,s.setClearAlpha(0),e.appendChild(s.domElement),(i=new B.WebGLPathTracer(s)).filterGlossyFactor=.5,i.tiles.set(R.tiles),i.setBVHWorker(new E.ParallelMeshBVHWorker),i.multipleImportanceSampling=R.multipleImportanceSampling,c=new b.Scene;let a=window.innerWidth/window.innerHeight;(l=new b.PerspectiveCamera(60,a,.01,500)).position.set(-1,.25,1),(d=new k.OrbitControls(l,e)).addEventListener("change",()=>i.updateCamera());let{scenarios:o}=await fetch("https://raw.githubusercontent.com/google/model-viewer/master/packages/render-fidelity-tools/test/config.json").then(e=>e.json());h={},o.forEach(e=>h[e.name]=e),window.addEventListener("hashchange",V),V(),function e(){requestAnimationFrame(e),(!(i.samples>=L)||-1===L)&&(t.style.display=R.displayImage?"inline-block":"none",t.style.opacity="side-by-side"===R.imageMode?1:R.imageOpacity,t.style.position="side-by-side"===R.imageMode?"initial":"absolute",t.style.width=s.domElement.style.width,t.style.height=s.domElement.style.height,F||(R.enable&&0===A?(i.enablePathTracing=R.enable,i.pausePathTracing=R.pause||i.samples>L&&-1!==L,i.renderSample()):(A>0||!R.enable)&&(A=Math.max(A-1,0),s.render(c,l)),i.samples>=L&&-1!==L&&requestAnimationFrame(()=>window.dispatchEvent(new Event("render-complete"))),r.setSamples(i.samples,i.isCompiling)))}()}();
//# sourceMappingURL=viewerTest.daf0f9c0.js.map
