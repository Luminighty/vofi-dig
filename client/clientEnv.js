module.exports = function(prefix) {
	const clientEnv = (() => {
	const env = {};
		for (const key in process.env)
			if (key.startsWith(prefix))
				env[key] = process.env[key];
		return `const process = {}; process.env = ${JSON.stringify(env)};`
	})();
	return (req, res) => res.send(clientEnv);
}
