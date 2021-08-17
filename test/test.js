const { test } = require("uvu");
const assert = require("uvu/assert");
const isPlainObj = require("is-plain-obj");
const eslint = require("eslint");

const hasRule = (errors, ruleId) => errors.some((x) => x.ruleId === ruleId);

async function runEslint(str, conf) {
  const linter = new eslint.ESLint({
    useEslintrc: false,
    baseConfig: conf,
  });

  const report = await linter.lintText(str);

  return report[0].messages;
}

test("main", async () => {
  const conf = require("../");

  assert.ok(isPlainObj(conf));

  const errors = await runEslint(
    "'use strict';\nconsole.log(\"unicorn\")\n",
    conf
  );
  assert.ok(hasRule(errors, "quotes"));
});

test("browser", async () => {
  const conf = require("../browser");

  assert.ok(isPlainObj(conf));

  const errors = await runEslint("'use strict';\nprocess.exit();\n", conf);
  assert.ok(hasRule(errors, "no-undef"));
});

test.run();
