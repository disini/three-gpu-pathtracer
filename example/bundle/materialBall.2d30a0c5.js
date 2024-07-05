let e,t,a,r,o,i,n;function s(e,t,a,r){Object.defineProperty(e,t,{get:a,set:r,enumerable:!0,configurable:!0})}var l=globalThis,c={},d={},h=l.parcelRequire5b70;null==h&&((h=function(e){if(e in c)return c[e].exports;if(e in d){var t=d[e];delete d[e];var a={id:e,exports:{}};return c[e]=a,t.call(a.exports,a,a.exports),a.exports}var r=Error("Cannot find module '"+e+"'");throw r.code="MODULE_NOT_FOUND",r}).register=function(e,t){d[e]=t},l.parcelRequire5b70=h);var m=h.register;m("9fZ6X",function(e,t){s(e.exports,"MaterialBase",()=>r);var a=h("ilwiq");class r extends a.ShaderMaterial{set needsUpdate(e){super.needsUpdate=!0,this.dispatchEvent({type:"recompilation"})}constructor(e){for(let t in super(e),this.uniforms)Object.defineProperty(this,t,{get(){return this.uniforms[t].value},set(e){this.uniforms[t].value=e}})}setDefine(e,t){if(null==t){if(e in this.defines)return delete this.defines[e],this.needsUpdate=!0,!0}else if(this.defines[e]!==t)return this.defines[e]=t,this.needsUpdate=!0,!0;return!1}}}),m("891vQ",function(e,t){s(e.exports,"RGBELoader",()=>r);var a=h("ilwiq");class r extends a.DataTextureLoader{constructor(e){super(e),this.type=a.HalfFloatType}parse(e){let t,r,o;let i=function(e,t){switch(e){case 1:throw Error("THREE.RGBELoader: Read Error: "+(t||""));case 2:throw Error("THREE.RGBELoader: Write Error: "+(t||""));case 3:throw Error("THREE.RGBELoader: Bad File Format: "+(t||""));default:throw Error("THREE.RGBELoader: Memory Error: "+(t||""))}},n=function(e,t,a){t=t||1024;let r=e.pos,o=-1,i=0,n="",s=String.fromCharCode.apply(null,new Uint16Array(e.subarray(r,r+128)));for(;0>(o=s.indexOf("\n"))&&i<t&&r<e.byteLength;)n+=s,i+=s.length,r+=128,s+=String.fromCharCode.apply(null,new Uint16Array(e.subarray(r,r+128)));return -1<o&&(!1!==a&&(e.pos+=i+o+1),n+s.slice(0,o))},s=new Uint8Array(e);s.pos=0;let l=function(e){let t,a;let r=/^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,o=/^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,s=/^\s*FORMAT=(\S+)\s*$/,l=/^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,c={valid:0,string:"",comments:"",programtype:"RGBE",format:"",gamma:1,exposure:1,width:0,height:0};for(!(e.pos>=e.byteLength)&&(t=n(e))||i(1,"no header found"),(a=t.match(/^#\?(\S+)/))||i(3,"bad initial token"),c.valid|=1,c.programtype=a[1],c.string+=t+"\n";!1!==(t=n(e));){if(c.string+=t+"\n","#"===t.charAt(0)){c.comments+=t+"\n";continue}if((a=t.match(r))&&(c.gamma=parseFloat(a[1])),(a=t.match(o))&&(c.exposure=parseFloat(a[1])),(a=t.match(s))&&(c.valid|=2,c.format=a[1]),(a=t.match(l))&&(c.valid|=4,c.height=parseInt(a[1],10),c.width=parseInt(a[2],10)),2&c.valid&&4&c.valid)break}return 2&c.valid||i(3,"missing format specifier"),4&c.valid||i(3,"missing image size specifier"),c}(s),c=l.width,d=l.height,h=function(e,t,a){if(t<8||t>32767||2!==e[0]||2!==e[1]||128&e[2])return new Uint8Array(e);t!==(e[2]<<8|e[3])&&i(3,"wrong scanline width");let r=new Uint8Array(4*t*a);r.length||i(4,"unable to allocate buffer space");let o=0,n=0,s=4*t,l=new Uint8Array(4),c=new Uint8Array(s),d=a;for(;d>0&&n<e.byteLength;){n+4>e.byteLength&&i(1),l[0]=e[n++],l[1]=e[n++],l[2]=e[n++],l[3]=e[n++],(2!=l[0]||2!=l[1]||(l[2]<<8|l[3])!=t)&&i(3,"bad rgbe scanline format");let a=0,h;for(;a<s&&n<e.byteLength;){let t=(h=e[n++])>128;if(t&&(h-=128),(0===h||a+h>s)&&i(3,"bad scanline data"),t){let t=e[n++];for(let e=0;e<h;e++)c[a++]=t}else c.set(e.subarray(n,n+h),a),a+=h,n+=h}for(let e=0;e<t;e++){let a=0;r[o]=c[e+a],a+=t,r[o+1]=c[e+a],a+=t,r[o+2]=c[e+a],a+=t,r[o+3]=c[e+a],o+=4}d--}return r}(s.subarray(s.pos),c,d);switch(this.type){case a.FloatType:let m=new Float32Array(4*(o=h.length/4));for(let e=0;e<o;e++)!function(e,t,a,r){let o=Math.pow(2,e[t+3]-128)/255;a[r+0]=e[t+0]*o,a[r+1]=e[t+1]*o,a[r+2]=e[t+2]*o,a[r+3]=1}(h,4*e,m,4*e);t=m,r=a.FloatType;break;case a.HalfFloatType:let u=new Uint16Array(4*(o=h.length/4));for(let e=0;e<o;e++)!function(e,t,r,o){let i=Math.pow(2,e[t+3]-128)/255;r[o+0]=(0,a.DataUtils).toHalfFloat(Math.min(e[t+0]*i,65504)),r[o+1]=(0,a.DataUtils).toHalfFloat(Math.min(e[t+1]*i,65504)),r[o+2]=(0,a.DataUtils).toHalfFloat(Math.min(e[t+2]*i,65504)),r[o+3]=(0,a.DataUtils).toHalfFloat(1)}(h,4*e,u,4*e);t=u,r=a.HalfFloatType;break;default:throw Error("THREE.RGBELoader: Unsupported type: "+this.type)}return{width:c,height:d,data:t,header:l.string,gamma:l.gamma,exposure:l.exposure,type:r}}setDataType(e){return this.type=e,this}load(e,t,r,o){return super.load(e,function(e,r){switch(e.type){case a.FloatType:case a.HalfFloatType:e.colorSpace=a.LinearSRGBColorSpace,e.minFilter=a.LinearFilter,e.magFilter=a.LinearFilter,e.generateMipmaps=!1,e.flipY=!0}t&&t(e,r)},r,o)}}}),m("e2Pv4",function(e,t){let a;s(e.exports,"LoaderElement",()=>r);class r{constructor(){a||((a=document.createElement("style")).textContent=`

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
	`,document.head.appendChild(a));let e=document.createElement("div");e.classList.add("loader-container");let t=document.createElement("div");t.classList.add("percentage"),e.appendChild(t);let r=document.createElement("div");r.classList.add("samples"),e.appendChild(r);let o=document.createElement("div");o.classList.add("credits"),e.appendChild(o);let i=document.createElement("div");i.classList.add("bar"),e.appendChild(i);let n=document.createElement("div");n.classList.add("description"),e.appendChild(n),this._description=n,this._loaderBar=i,this._percentage=t,this._credits=o,this._samples=r,this._container=e,this.setPercentage(0)}attach(e){e.appendChild(this._container),e.appendChild(this._description)}setPercentage(e){this._loaderBar.style.width=`${100*e}%`,0===e?this._percentage.innerText="Loading...":this._percentage.innerText=`${(100*e).toFixed(0)}%`,e>=1?this._container.classList.remove("loading"):this._container.classList.add("loading")}setSamples(e,t=!1){t?this._samples.innerText="compiling shader...":this._samples.innerText=`${Math.floor(e)} samples`}setCredits(e){this._credits.innerHTML=e}setDescription(e){this._description.innerHTML=e}}}),m("fYvb1",function(e,t){s(e.exports,"math_functions",()=>a);let a=`

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

`}),m("dUUQZ",function(e,t){s(e.exports,"util_functions",()=>a);let a=`

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
`}),m("8keuf",function(e,t){s(e.exports,"ggx_functions",()=>a);let a=`

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

`});var u=h("ilwiq"),p=h("RPVlj"),f=h("7lx9d"),g=h("5Rd1x"),u=h("ilwiq"),v=h("9fZ6X");class w extends v.MaterialBase{constructor(e){super({blending:u.NoBlending,transparent:!1,depthWrite:!1,depthTest:!1,defines:{USE_SLIDER:0},uniforms:{sigma:{value:5},threshold:{value:.03},kSigma:{value:1},map:{value:null},opacity:{value:1}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}

			`,fragmentShader:`

				//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
				//  Copyright (c) 2018-2019 Michele Morrone
				//  All rights reserved.
				//
				//  https://michelemorrone.eu - https://BrutPitt.com
				//
				//  me@michelemorrone.eu - brutpitt@gmail.com
				//  twitter: @BrutPitt - github: BrutPitt
				//
				//  https://github.com/BrutPitt/glslSmartDeNoise/
				//
				//  This software is distributed under the terms of the BSD 2-Clause license
				//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

				uniform sampler2D map;

				uniform float sigma;
				uniform float threshold;
				uniform float kSigma;
				uniform float opacity;

				varying vec2 vUv;

				#define INV_SQRT_OF_2PI 0.39894228040143267793994605993439
				#define INV_PI 0.31830988618379067153776752674503

				// Parameters:
				//	 sampler2D tex	 - sampler image / texture
				//	 vec2 uv		   - actual fragment coord
				//	 float sigma  >  0 - sigma Standard Deviation
				//	 float kSigma >= 0 - sigma coefficient
				//		 kSigma * sigma  -->  radius of the circular kernel
				//	 float threshold   - edge sharpening threshold
				vec4 smartDeNoise( sampler2D tex, vec2 uv, float sigma, float kSigma, float threshold ) {

					float radius = round( kSigma * sigma );
					float radQ = radius * radius;

					float invSigmaQx2 = 0.5 / ( sigma * sigma );
					float invSigmaQx2PI = INV_PI * invSigmaQx2;

					float invThresholdSqx2 = 0.5 / ( threshold * threshold );
					float invThresholdSqrt2PI = INV_SQRT_OF_2PI / threshold;

					vec4 centrPx = texture2D( tex, uv );
					centrPx.rgb *= centrPx.a;

					float zBuff = 0.0;
					vec4 aBuff = vec4( 0.0 );
					vec2 size = vec2( textureSize( tex, 0 ) );

					vec2 d;
					for ( d.x = - radius; d.x <= radius; d.x ++ ) {

						float pt = sqrt( radQ - d.x * d.x );

						for ( d.y = - pt; d.y <= pt; d.y ++ ) {

							float blurFactor = exp( - dot( d, d ) * invSigmaQx2 ) * invSigmaQx2PI;

							vec4 walkPx = texture2D( tex, uv + d / size );
							walkPx.rgb *= walkPx.a;

							vec4 dC = walkPx - centrPx;
							float deltaFactor = exp( - dot( dC.rgba, dC.rgba ) * invThresholdSqx2 ) * invThresholdSqrt2PI * blurFactor;

							zBuff += deltaFactor;
							aBuff += deltaFactor * walkPx;

						}

					}

					return aBuff / zBuff;

				}

				void main() {

					gl_FragColor = smartDeNoise( map, vec2( vUv.x, vUv.y ), sigma, kSigma, threshold );
					#include <tonemapping_fragment>
					#include <colorspace_fragment>
					#include <premultiplied_alpha_fragment>

					gl_FragColor.a *= opacity;

				}

			`}),this.setValues(e)}}var b=h("8mHfG"),x=h("891vQ"),y=h("kp7Te"),P=h("jiuw3"),C=h("e2Pv4");const S={materialProperties:{color:"#ffe6bd",emissive:"#000000",emissiveIntensity:1,roughness:0,metalness:1,ior:1.495,transmission:0,thinFilm:!1,attenuationColor:"#ffffff",attenuationDistance:.5,opacity:1,clearcoat:0,clearcoatRoughness:0,sheenColor:"#000000",sheenRoughness:0,iridescence:0,iridescenceIOR:1.5,iridescenceThickness:400,specularColor:"#ffffff",specularIntensity:1,matte:!1,flatShading:!1,castShadow:!0},multipleImportanceSampling:!0,denoiseEnabled:!0,denoiseSigma:2.5,denoiseThreshold:.1,denoiseKSigma:1,bounces:5,renderScale:1/window.devicePixelRatio,transmissiveBounces:20,filterGlossyFactor:.5,tiles:1};async function T(){(n=new C.LoaderElement).attach(document.body),(t=new u.WebGLRenderer({antialias:!0})).toneMapping=u.ACESFilmicToneMapping,document.body.appendChild(t.domElement),(e=new b.WebGLPathTracer(t)).tiles.set(S.tiles,S.tiles),e.renderToCanvasCallback=(e,t,r)=>{a.material.sigma=S.denoiseSigma,a.material.threshold=S.denoiseThreshold,a.material.kSigma=S.denoiseKSigma,a.material.opacity=r.material.opacity;let o=t.autoClear,i=S.denoiseEnabled?a:r;t.autoClear=!1,i.material.map=e.texture,i.render(t),t.autoClear=o},a=new p.FullScreenQuad(new w({map:null,blending:u.CustomBlending,premultipliedAlpha:t.getContextAttributes().premultipliedAlpha}));let s=window.innerWidth/window.innerHeight;(o=new u.PerspectiveCamera(75,s,.025,500)).position.set(-4,2,3),new g.OrbitControls(o,t.domElement).addEventListener("change",()=>e.updateCamera()),(i=new u.Scene).backgroundBlurriness=.05;let[l,c]=await Promise.all([new(0,x.RGBELoader)().loadAsync("https://raw.githubusercontent.com/disini/3d-demo-data/master/hdri/autoshop_01_1k.hdr"),new(0,f.GLTFLoader)().setMeshoptDecoder(y.MeshoptDecoder).loadAsync("https://raw.githubusercontent.com/disini/3d-demo-data/main/models/material-balls/material_ball_v2.glb")]);l.mapping=u.EquirectangularReflectionMapping,i.background=l,i.environment=l,c.scene.scale.setScalar(.01),c.scene.updateMatrixWorld(),i.add(c.scene);let d=new u.Box3;d.setFromObject(c.scene);let h=new u.Mesh(new u.CylinderGeometry(3,3,.05,200),new u.MeshPhysicalMaterial({color:16777215,roughness:.1,metalness:.9}));h.geometry=h.geometry.toNonIndexed(),h.geometry.clearGroups(),h.position.y=d.min.y-.03,i.add(h);let m=new u.MeshPhysicalMaterial({color:new u.Color(.5,.5,.5)});r=new u.MeshPhysicalMaterial,c.scene.traverse(e=>{e.geometry&&e.geometry.computeVertexNormals(),"Sphere_1"===e.name?e.material=m:e.material=r,"subsphere_1"===e.name&&(e.material=m)}),n.setPercentage(1),E(),F(),window.addEventListener("resize",F);let v=new P.GUI,T=v.addFolder("Path Tracer");T.add(S,"multipleImportanceSampling").onChange(E),T.add(S,"tiles",1,4,1).onChange(t=>{e.tiles.set(t,t)}),T.add(S,"filterGlossyFactor",0,1).onChange(E),T.add(S,"bounces",1,30,1).onChange(E),T.add(S,"transmissiveBounces",0,40,1).onChange(E),T.add(S,"renderScale",.1,1).onChange(E);let R=v.addFolder("Denoising");R.add(S,"denoiseEnabled"),R.add(S,"denoiseSigma",.01,12),R.add(S,"denoiseThreshold",.01,1),R.add(S,"denoiseKSigma",0,12),R.close();let _=v.addFolder("Material");_.addColor(S.materialProperties,"color").onChange(E),_.addColor(S.materialProperties,"emissive").onChange(E),_.add(S.materialProperties,"emissiveIntensity",0,50,.01).onChange(E),_.add(S.materialProperties,"roughness",0,1).onChange(E),_.add(S.materialProperties,"metalness",0,1).onChange(E),_.add(S.materialProperties,"opacity",0,1).onChange(E),_.add(S.materialProperties,"transmission",0,1).onChange(E),_.add(S.materialProperties,"thinFilm",0,1).onChange(E),_.add(S.materialProperties,"attenuationDistance",.05,2).onChange(E),_.addColor(S.materialProperties,"attenuationColor").onChange(E),_.add(S.materialProperties,"ior",.9,3).onChange(E),_.add(S.materialProperties,"clearcoat",0,1).onChange(E),_.add(S.materialProperties,"clearcoatRoughness",0,1).onChange(E),_.addColor(S.materialProperties,"sheenColor").onChange(E),_.add(S.materialProperties,"sheenRoughness",0,1).onChange(E),_.add(S.materialProperties,"iridescence",0,1).onChange(E),_.add(S.materialProperties,"iridescenceIOR",.1,3).onChange(E),_.add(S.materialProperties,"iridescenceThickness",0,1200).onChange(E),_.addColor(S.materialProperties,"specularColor").onChange(E),_.add(S.materialProperties,"specularIntensity",0,1).onChange(E),_.add(S.materialProperties,"matte").onChange(E),_.add(S.materialProperties,"flatShading").onChange(E),_.add(S.materialProperties,"castShadow").onChange(E),_.close(),function t(){requestAnimationFrame(t),e.renderSample(),n.setSamples(e.samples,e.isCompiling)}()}function F(){t.setSize(window.innerWidth,window.innerHeight),t.setPixelRatio(window.devicePixelRatio),o.aspect=window.innerWidth/window.innerHeight,o.updateProjectionMatrix(),e.updateCamera()}function E(){let t=S.materialProperties;r.color.set(t.color),r.emissive.set(t.emissive),r.emissiveIntensity=t.emissiveIntensity,r.metalness=t.metalness,r.roughness=t.roughness,r.transmission=t.transmission,r.attenuationDistance=t.thinFilm?1/0:t.attenuationDistance,r.attenuationColor.set(t.attenuationColor),r.ior=t.ior,r.opacity=t.opacity,r.clearcoat=t.clearcoat,r.clearcoatRoughness=t.clearcoatRoughness,r.sheenColor.set(t.sheenColor),r.sheenRoughness=t.sheenRoughness,r.iridescence=t.iridescence,r.iridescenceIOR=t.iridescenceIOR,r.iridescenceThicknessRange=[0,t.iridescenceThickness],r.specularColor.set(t.specularColor),r.specularIntensity=t.specularIntensity,r.transparent=r.opacity<1,r.flatShading=t.flatShading,e.transmissiveBounces=S.transmissiveBounces,e.multipleImportanceSampling=S.multipleImportanceSampling,e.filterGlossyFactor=S.filterGlossyFactor,e.bounces=S.bounces,e.renderScale=S.renderScale,r.matte=t.matte,r.castShadow=t.castShadow,e.updateMaterials(),e.setScene(i,o)}window.location.hash.includes("transmission")?(S.materialProperties.metalness=0,S.materialProperties.roughness=.23,S.materialProperties.transmission=1,S.materialProperties.color="#ffffff",S.bounces=10,S.tiles=2):window.location.hash.includes("iridescent")?(S.materialProperties.color="#474747",S.materialProperties.roughness=.25,S.materialProperties.metalness=1,S.materialProperties.iridescence=1,S.materialProperties.iridescenceIOR=2.2):window.location.hash.includes("acrylic")&&(S.materialProperties.color="#ffffff",S.materialProperties.roughness=0,S.materialProperties.metalness=0,S.materialProperties.transmission=1,S.materialProperties.attenuationDistance=.75,S.materialProperties.attenuationColor="#2a6dc6",S.bounces=20,S.tiles=3),window.innerWidth/window.innerHeight<.65&&(S.bounces=Math.max(S.bounces,6),S.renderScale*=.5,S.tiles=2,S.multipleImportanceSampling=!1),T();
//# sourceMappingURL=materialBall.2d30a0c5.js.map
