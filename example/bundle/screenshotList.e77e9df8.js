(async()=>{let e=document.getElementById("container"),{scenarios:t}=await (await fetch("https://raw.githubusercontent.com/google/model-viewer/master/packages/render-fidelity-tools/test/config.json")).json(),a=await (await fetch("https://api.github.com/repos/disini/three-gpu-pathtracer/commits?sha=screenshots")).json(),s=a[0].sha,i=window.location.hash.replace(/^#/,"")||"model-viewer",n=document.querySelector("select");n.value=i,n.addEventListener("change",()=>{window.location.hash=n.value,i=n.value,o()}),document.body.style.visibility="visible";let r=document.querySelector('input[type="checkbox"]');function o(){e.innerHTML="",t.forEach(t=>{let n;let r=t.name,o=`https://raw.githubusercontent.com/disini/three-gpu-pathtracer/${s}/screenshots/golden/${r}.png`;n="prior-commit"===i?`https://raw.githubusercontent.com/disini/three-gpu-pathtracer/${a[1].sha}/screenshots/golden/${r}.png`:`https://raw.githubusercontent.com/google/model-viewer/master/packages/render-fidelity-tools/test/goldens/${r}/${i}-golden.png`,e.innerHTML+=`
				<div>
					<h1>${t.name}</h1>
					<div class="img-wrapper">
						<a href="${o}" target="_blank"><img src="${o}" /></a>
						<a href="${n}" target="_blank"><img src="${n}" /></a>
					</div>
				</div>
			`})}r.addEventListener("change",()=>{r.checked?e.classList.add("large-images"):e.classList.remove("large-images")}),o()})();
//# sourceMappingURL=screenshotList.e77e9df8.js.map
