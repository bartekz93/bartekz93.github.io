function projectView(project) {

	return `
		<div class="box">
			<div class="box-head">	
				<div class="project-name">${project.name}</div>
				
				<span>
					👤<span class="label separator"> ${project.group}</span>
					🕑<span class="label separator"> ${project.year}</span>
					${
						project.url ? `
							<a target="blank" href="${project.url}">👁️</a>
							<span class="separator" style="margin-right: 20px"></span>` 
						: ''
					}
				</span>
			</div>
			<div class="box-body">	
				<div>
					${
						project.tech.map((t) => {
							return `<span class="ui label blue" style="margin: 2px">${t}</span>`;
						}).join(' ')
					}
					${
						project.tools.map((t) => {
							return `<span class="ui label green" style="margin: 2px">${t}</span>`;
						}).join(' ')
					}
				</div>
				
				<div class="desc">
					${project.desc}
				</div>
	
				<div>
				${
					Array.apply(null, {length: project.imagesCount} )
						.map(Number.call, Number)
						.map((i) => {
							return `<img 
								src="images/thumbnails/${project.images}/${i+1}.png" 
								data-type="image" 
								data-collection="${project.images}" 
								class="thumbnail" 
							/>`;
					}).join(' ')
				}
				${
					Array.apply(null, {length: project.videosCount} )
						.map(Number.call, Number)
						.map((i) => {
							return `<img 
								src="videos/thumbnails/${project.images}/${i+1}.png" 
								data-type="video" 
								data-url="${project.videos[i]}"
								data-collection="${project.images}" 
								class="thumbnail" 
							/>`;
					}).join(' ')
				}
				</div>
			</div>
		</div>
	`;
}