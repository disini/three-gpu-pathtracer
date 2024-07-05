let e,t,a,r,o,n,i,s;function l(e,t,a,r){Object.defineProperty(e,t,{get:a,set:r,enumerable:!0,configurable:!0})}var c=globalThis,d={},h={},p=c.parcelRequire5b70;null==p&&((p=function(e){if(e in d)return d[e].exports;if(e in h){var t=h[e];delete h[e];var a={id:e,exports:{}};return d[e]=a,t.call(a.exports,a,a.exports),a.exports}var r=Error("Cannot find module '"+e+"'");throw r.code="MODULE_NOT_FOUND",r}).register=function(e,t){h[e]=t},c.parcelRequire5b70=p);var m=p.register;m("891vQ",function(e,t){l(e.exports,"RGBELoader",()=>r);var a=p("ilwiq");class r extends a.DataTextureLoader{constructor(e){super(e),this.type=a.HalfFloatType}parse(e){let t,r,o;let n=function(e,t){switch(e){case 1:throw Error("THREE.RGBELoader: Read Error: "+(t||""));case 2:throw Error("THREE.RGBELoader: Write Error: "+(t||""));case 3:throw Error("THREE.RGBELoader: Bad File Format: "+(t||""));default:throw Error("THREE.RGBELoader: Memory Error: "+(t||""))}},i=function(e,t,a){t=t||1024;let r=e.pos,o=-1,n=0,i="",s=String.fromCharCode.apply(null,new Uint16Array(e.subarray(r,r+128)));for(;0>(o=s.indexOf("\n"))&&n<t&&r<e.byteLength;)i+=s,n+=s.length,r+=128,s+=String.fromCharCode.apply(null,new Uint16Array(e.subarray(r,r+128)));return -1<o&&(!1!==a&&(e.pos+=n+o+1),i+s.slice(0,o))},s=new Uint8Array(e);s.pos=0;let l=function(e){let t,a;let r=/^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,o=/^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,s=/^\s*FORMAT=(\S+)\s*$/,l=/^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,c={valid:0,string:"",comments:"",programtype:"RGBE",format:"",gamma:1,exposure:1,width:0,height:0};for(!(e.pos>=e.byteLength)&&(t=i(e))||n(1,"no header found"),(a=t.match(/^#\?(\S+)/))||n(3,"bad initial token"),c.valid|=1,c.programtype=a[1],c.string+=t+"\n";!1!==(t=i(e));){if(c.string+=t+"\n","#"===t.charAt(0)){c.comments+=t+"\n";continue}if((a=t.match(r))&&(c.gamma=parseFloat(a[1])),(a=t.match(o))&&(c.exposure=parseFloat(a[1])),(a=t.match(s))&&(c.valid|=2,c.format=a[1]),(a=t.match(l))&&(c.valid|=4,c.height=parseInt(a[1],10),c.width=parseInt(a[2],10)),2&c.valid&&4&c.valid)break}return 2&c.valid||n(3,"missing format specifier"),4&c.valid||n(3,"missing image size specifier"),c}(s),c=l.width,d=l.height,h=function(e,t,a){if(t<8||t>32767||2!==e[0]||2!==e[1]||128&e[2])return new Uint8Array(e);t!==(e[2]<<8|e[3])&&n(3,"wrong scanline width");let r=new Uint8Array(4*t*a);r.length||n(4,"unable to allocate buffer space");let o=0,i=0,s=4*t,l=new Uint8Array(4),c=new Uint8Array(s),d=a;for(;d>0&&i<e.byteLength;){i+4>e.byteLength&&n(1),l[0]=e[i++],l[1]=e[i++],l[2]=e[i++],l[3]=e[i++],(2!=l[0]||2!=l[1]||(l[2]<<8|l[3])!=t)&&n(3,"bad rgbe scanline format");let a=0,h;for(;a<s&&i<e.byteLength;){let t=(h=e[i++])>128;if(t&&(h-=128),(0===h||a+h>s)&&n(3,"bad scanline data"),t){let t=e[i++];for(let e=0;e<h;e++)c[a++]=t}else c.set(e.subarray(i,i+h),a),a+=h,i+=h}for(let e=0;e<t;e++){let a=0;r[o]=c[e+a],a+=t,r[o+1]=c[e+a],a+=t,r[o+2]=c[e+a],a+=t,r[o+3]=c[e+a],o+=4}d--}return r}(s.subarray(s.pos),c,d);switch(this.type){case a.FloatType:let p=new Float32Array(4*(o=h.length/4));for(let e=0;e<o;e++)!function(e,t,a,r){let o=Math.pow(2,e[t+3]-128)/255;a[r+0]=e[t+0]*o,a[r+1]=e[t+1]*o,a[r+2]=e[t+2]*o,a[r+3]=1}(h,4*e,p,4*e);t=p,r=a.FloatType;break;case a.HalfFloatType:let m=new Uint16Array(4*(o=h.length/4));for(let e=0;e<o;e++)!function(e,t,r,o){let n=Math.pow(2,e[t+3]-128)/255;r[o+0]=(0,a.DataUtils).toHalfFloat(Math.min(e[t+0]*n,65504)),r[o+1]=(0,a.DataUtils).toHalfFloat(Math.min(e[t+1]*n,65504)),r[o+2]=(0,a.DataUtils).toHalfFloat(Math.min(e[t+2]*n,65504)),r[o+3]=(0,a.DataUtils).toHalfFloat(1)}(h,4*e,m,4*e);t=m,r=a.HalfFloatType;break;default:throw Error("THREE.RGBELoader: Unsupported type: "+this.type)}return{width:c,height:d,data:t,header:l.string,gamma:l.gamma,exposure:l.exposure,type:r}}setDataType(e){return this.type=e,this}load(e,t,r,o){return super.load(e,function(e,r){switch(e.type){case a.FloatType:case a.HalfFloatType:e.colorSpace=a.LinearSRGBColorSpace,e.minFilter=a.LinearFilter,e.magFilter=a.LinearFilter,e.generateMipmaps=!1,e.flipY=!0}t&&t(e,r)},r,o)}}}),m("e2Pv4",function(e,t){let a;l(e.exports,"LoaderElement",()=>r);class r{constructor(){a||((a=document.createElement("style")).textContent=`

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
	`,document.head.appendChild(a));let e=document.createElement("div");e.classList.add("loader-container");let t=document.createElement("div");t.classList.add("percentage"),e.appendChild(t);let r=document.createElement("div");r.classList.add("samples"),e.appendChild(r);let o=document.createElement("div");o.classList.add("credits"),e.appendChild(o);let n=document.createElement("div");n.classList.add("bar"),e.appendChild(n);let i=document.createElement("div");i.classList.add("description"),e.appendChild(i),this._description=i,this._loaderBar=n,this._percentage=t,this._credits=o,this._samples=r,this._container=e,this.setPercentage(0)}attach(e){e.appendChild(this._container),e.appendChild(this._description)}setPercentage(e){this._loaderBar.style.width=`${100*e}%`,0===e?this._percentage.innerText="Loading...":this._percentage.innerText=`${(100*e).toFixed(0)}%`,e>=1?this._container.classList.remove("loading"):this._container.classList.add("loading")}setSamples(e,t=!1){t?this._samples.innerText="compiling shader...":this._samples.innerText=`${Math.floor(e)} samples`}setCredits(e){this._credits.innerHTML=e}setDescription(e){this._description.innerHTML=e}}}),m("cE5k3",function(e,t){l(e.exports,"getScaledSettings",()=>a);function a(){let e=3,t=Math.max(1/window.devicePixelRatio,.5);return window.innerWidth/window.innerHeight<.65&&(e=4,t=.5/window.devicePixelRatio),{tiles:e,renderScale:t}}}),m("9fZ6X",function(e,t){l(e.exports,"MaterialBase",()=>r);var a=p("ilwiq");class r extends a.ShaderMaterial{set needsUpdate(e){super.needsUpdate=!0,this.dispatchEvent({type:"recompilation"})}constructor(e){for(let t in super(e),this.uniforms)Object.defineProperty(this,t,{get(){return this.uniforms[t].value},set(e){this.uniforms[t].value=e}})}setDefine(e,t){if(null==t){if(e in this.defines)return delete this.defines[e],this.needsUpdate=!0,!0}else if(this.defines[e]!==t)return this.defines[e]=t,this.needsUpdate=!0,!0;return!1}}}),m("fYvb1",function(e,t){l(e.exports,"math_functions",()=>a);let a=`

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

`}),m("dUUQZ",function(e,t){l(e.exports,"util_functions",()=>a);let a=`

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
`}),m("8keuf",function(e,t){l(e.exports,"ggx_functions",()=>a);let a=`

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

`});var u=p("ilwiq"),f=p("7lx9d"),g=p("5Rd1x"),v=p("8mHfG"),w=p("891vQ"),y=p("kp7Te"),b=p("jiuw3"),x=p("e2Pv4"),T=p("cE5k3");const E={material:null,tiles:2,bounces:5,multipleImportanceSampling:!0,renderScale:1/window.devicePixelRatio,...(0,T.getScaledSettings)()};function S(){t.setSize(window.innerWidth,window.innerHeight),t.setPixelRatio(window.devicePixelRatio),r.aspect=window.innerWidth/window.innerHeight,r.updateProjectionMatrix(),e.updateCamera()}function P(){!function(e,t){t.color.set(16777215),t.transmission=0,t.attenuationDistance=1/0,t.attenuationColor.set(16777215),t.specularColor.set(16777215),t.metalness=0,t.roughness=1,t.ior=1.5,t.thickness=1,e.specularColor&&t.specularColor.setRGB(...e.specularColor),"metalness"in e&&(t.metalness=e.metalness),"roughness"in e&&(t.roughness=e.roughness),"ior"in e&&(t.ior=e.ior),"transmission"in e&&(t.transmission=e.transmission),t.transmission?(e.color&&t.attenuationColor.setRGB(...e.color),t.attenuationDistance=200/e.density):e.color&&t.color.setRGB(...e.color);let a=e.name.replace(/\s+/g,"-").replace(/[()]+/g,"");s.src=`https://physicallybased.info/reference/render/${a}-cycles.png`}(o[E.material],a),e.multipleImportanceSampling=E.multipleImportanceSampling,e.renderScale=E.renderScale,e.bounces=E.bounces,e.updateMaterials()}!async function(){(i=new x.LoaderElement).attach(document.body),s=document.getElementById("materialImage"),(t=new u.WebGLRenderer({antialias:!0})).toneMapping=u.ACESFilmicToneMapping,document.body.appendChild(t.domElement),(e=new v.WebGLPathTracer(t)).multipleImportanceSampling=E.multipleImportanceSampling,e.tiles.set(E.tiles,E.tiles),e.filterGlossyFactor=.5;let l=window.innerWidth/window.innerHeight;(r=new u.PerspectiveCamera(75,l,.025,500)).position.set(-4,2,3),new g.OrbitControls(r,t.domElement).addEventListener("change",()=>e.updateCamera()),n=new u.Scene;let[c,d,h]=await Promise.all([new(0,w.RGBELoader)().loadAsync("https://raw.githubusercontent.com/disini/3d-demo-data/master/hdri/autoshop_01_1k.hdr"),new(0,f.GLTFLoader)().setMeshoptDecoder(y.MeshoptDecoder).loadAsync("https://raw.githubusercontent.com/disini/3d-demo-data/main/models/material-balls/material_ball_v2.glb"),fetch("https://api.physicallybased.info/materials").then(e=>e.json())]);c.mapping=u.EquirectangularReflectionMapping,n.background=c,n.environment=c,d.scene.scale.setScalar(.01),d.scene.updateMatrixWorld(),n.add(d.scene);let p=new u.Box3;p.setFromObject(d.scene);let m=new u.Mesh(new u.CylinderGeometry(3,3,.05,200),new u.MeshPhysicalMaterial({color:16777215,roughness:0,metalness:.25}));m.geometry=m.geometry.toNonIndexed(),m.geometry.clearGroups(),m.position.y=p.min.y-.03,n.add(m),a=new u.MeshPhysicalMaterial;let T=new u.MeshPhysicalMaterial({color:new u.Color(.5,.5,.5)});d.scene.traverse(e=>{e.geometry&&e.geometry.computeVertexNormals(),"Sphere_1"===e.name?e.material=T:e.material=a,"subsphere_1"===e.name&&(e.material=T)}),o={},h.forEach(e=>o[e.name]=e),E.material=Object.keys(o)[0],e.setScene(n,r),i.setPercentage(1),i.setCredits('Materials courtesy of "physicallybased.info"'),P(),S(),window.addEventListener("resize",S);let F=new b.GUI;F.add(E,"material",Object.keys(o)).onChange(P);let C=F.addFolder("Path Tracing");C.add(E,"multipleImportanceSampling").onChange(P),C.add(E,"tiles",1,4,1).onChange(t=>{e.tiles.set(t,t)}),C.add(E,"bounces",1,30,1).onChange(P),C.add(E,"renderScale",.1,1).onChange(P),function t(){requestAnimationFrame(t),e.renderSample(),i.setSamples(e.samples,e.isCompiling)}()}();
//# sourceMappingURL=materialDatabase.9c81f2f8.js.map
