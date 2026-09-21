const { firefox } = require(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
(async () => {
  const root = __dirname;
  const b = await firefox.launch();
  let checks = 0;
  for (const width of [1440, 768, 390, 320]) {
    const p = await b.newPage({ viewport: { width, height: 1000 } });
    const errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    for (const kind of ["edition", "field", "cabinet", "afterhours"]) {
      await p.goto("file://" + root + "/" + kind + ".html");
      await p.evaluate(() => document.fonts.ready);
      assert.equal(await p.locator("h1").count(), 1);
      assert(
        await p.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        kind + " overflow " + width,
      );
      assert(
        await p
          .locator("img")
          .evaluateAll((es) =>
            es.every((e) => e.complete && e.naturalWidth > 0),
          ),
        kind + " missing image",
      );
      if (width === 1440 || width === 390)
        await p.screenshot({
          path:
            root +
            "/" +
            kind +
            (width === 1440 ? "-desktop" : "-mobile") +
            ".png",
          fullPage: width === 390,
        });
      for (const topic of ["life", "making", "ideas"]) {
        await p.locator(`[data-filter="${topic}"]`).click();
        assert.equal(await p.locator("[data-topic]:visible").count(), 1);
        assert.equal(
          await p.locator("[data-topic]:visible").getAttribute("data-topic"),
          topic,
        );
      }
      await p.locator('[data-filter="all"]').click();
      assert.equal(await p.locator("[data-topic]:visible").count(), 3);
      await p.locator('[data-topic="life"] h3 a').click();
      assert(await p.locator(".prose").isVisible());
      assert(
        await p.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        kind + " article overflow " + width,
      );
      await p.getByRole("link", { name: "01 / Attention" }).click();
      assert.equal(await p.evaluate(() => location.hash), "#attention");
      if (width === 1440 || width === 390)
        await p.screenshot({
          path:
            root +
            "/" +
            kind +
            "-reading" +
            (width === 390 ? "-mobile" : "") +
            ".png",
          fullPage: true,
        });
      await p.getByRole("link", { name: "About", exact: true }).click();
      assert(
        await p
          .getByRole("link", { name: "The professional version: my CV ↗" })
          .isVisible(),
      );
      checks += 2;
    }
    assert.deepEqual(errors, []);
    await p.close();
  }
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  await p.goto("file://" + root + "/index.html");
  await p.screenshot({ path: root + "/comparison.png", fullPage: true });
  for (const file of fs.readdirSync(root).filter((x) => x.endsWith(".html"))) {
    await p.goto("file://" + path.join(root, file));
    for (const href of await p
      .locator("a[href],img[src],script[src],link[href]")
      .evaluateAll((es) =>
        es.map((e) => e.getAttribute("href") || e.getAttribute("src")),
      )) {
      if (/^(https?:|mailto:)/.test(href)) continue;
      const [pathname, fragment] = href.split("#");
      const dest = pathname
        ? path.resolve(root, pathname.split("?")[0])
        : path.join(root, file);
      assert(fs.existsSync(dest), file + " missing " + href);
      if (fragment) {
        const text = fs.readFileSync(dest, "utf8");
        assert(
          text.includes(`id="${fragment}"`),
          file + " missing anchor " + href,
        );
      }
    }
  }
  const ctx = await b.newContext({ javaScriptEnabled: false });
  const p2 = await ctx.newPage();
  for (const kind of ["edition", "field", "cabinet", "afterhours"]) {
    await p2.goto("file://" + root + "/" + kind + ".html");
    assert.equal(await p2.locator("[data-topic]:visible").count(), 3);
    assert.equal(await p2.locator("[data-filter]:visible").count(), 0);
    await p2.locator('[data-topic="life"] h3 a').click();
    assert(await p2.locator(".prose").isVisible());
  }
  console.log(
    `PASS: ${checks} home/article viewport checks; all topic filters; images; navigation; local links/anchors; no page errors; all four readable with JS disabled.`,
  );
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
