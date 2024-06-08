import EsLintTsConfig from "@fimion/lint-config/eslint-ts";

/**
 * @type {import("eslint").Eslint.Option[]}
 */
export default [
	{
		ignores: [".nitro/", ".output/", "node_modules/"],
	},
	...EsLintTsConfig,
];
