const { ipcRenderer } = require("electron");

export default id => {
	ipcRenderer.send("open-directory-dialog", {
		properties: ["openDirectory"],
		id
	});
};
