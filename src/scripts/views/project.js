function projectView(project) {

	return `
		<div class="box">
			<div class="box-head">	
				<div class="project-name">${project.name}</div>
				
				<span>
					<img class="icon" src="images/icons/person.png"/><span class="label"> ${project.group}</span>
					<img class="icon" src="images/icons/clock.png"/><span class="label"> ${project.year}</span>
					${
						project.repo ? `
							<a target="blank" href="${project.repo}"><img class="icon" src="images/icons/github.png"/></a>` 
						: ''
					}
					${
						project.url ? `
							<a target="blank" href="${project.url}"><img class="icon" src="images/icons/arrow.png"/></a>` 
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