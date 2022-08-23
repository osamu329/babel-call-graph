function a() {
	b();
}


const b = function() {
}

const c = () => {
	a = () => {};
	b();
	a();
}

const asyncF = async () => {
};
