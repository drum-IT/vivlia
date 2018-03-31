const sidebarToggle = document.querySelector(".sidebar__icon");
sidebarToggle.addEventListener("click", ev => {
	const sidebar = document.querySelector(".sidebar");
	const sidebarContent = document.querySelectorAll(".sidebar--content");
	if (sidebar.classList.contains("sidebar--show")) {
		sidebar.classList.remove("sidebar--show");
		sidebarToggle.classList.remove("sidebar__icon--toggle");
		sidebarContent.forEach(content => {
			content.classList.remove("sidebar__content--show");
		});
	} else {
		sidebar.classList.add("sidebar--show");
		sidebarToggle.classList.add("sidebar__icon--toggle");
		sidebarContent.forEach(content => {
			content.classList.add("sidebar__content--show");
		});
	}
});
