const { DateTime } = require("luxon");
const CleanCSS = require("clean-css");
const UglifyJS = require("uglify-js");
const htmlmin = require("html-minifier");
const { EleventyServerlessBundlerPlugin } = require("@11ty/eleventy");
// const lodashChunk = require("lodash.chunk");
const fs = require("fs");
const fg = require('fast-glob');


module.exports = function(eleventyConfig) {

    eleventyConfig.addPlugin(EleventyServerlessBundlerPlugin, {
        name: "serverless", // The serverless function name from your permalink object
        functionsDir: "./netlify/functions",
    });

    // eleventyConfig.addPlugin(EleventyServerlessBundlerPlugin, {
    //   name: "shipping", // The serverless function name from your permalink object
    //   functionsDir: "./netlify/functions",
    // });
    eleventyConfig.addFilter("priceFormatter", function(value) { return `€ ${value.toFixed(2)}` });

    // Configuration API: use eleventyConfig.addLayoutAlias(from, to) to add
    // layout aliases! Say you have a bunch of existing content using
    // layout: post. If you don’t want to rewrite all of those values, just map
    // post to a new file like this:
    // eleventyConfig.addLayoutAlias("post", "layouts/my_new_post_layout.njk");

    // Merge data instead of overriding
    // https://www.11ty.dev/docs/data-deep-merge/
    eleventyConfig.setDataDeepMerge(true);

    // Add support for maintenance-free post authors
    // Adds an authors collection using the author key in our post frontmatter
    // Thanks to @pdehaan: https://github.com/pdehaan
    eleventyConfig.addCollection("authors", collection => {
        const blogs = collection.getFilteredByGlob("posts/*.md");
        return blogs.reduce((coll, post) => {
            const author = post.data.author;
            if (!author) {
                return coll;
            }
            if (!coll.hasOwnProperty(author)) {
                coll[author] = [];
            }
            coll[author].push(post.data);
            return coll;
        }, {});
    });





    // eleventyConfig.addCollection("speciminas", collectionApi => {

    //   console.log('!!@@');
    //   console.log('addCollection speciminas');
    //   console.log(collectionApi.getAll());
    //   console.log('@@@###');
    //   const posts = collectionApi.getAll().filter(item => {
    //     return "specimina" in item;
    //   })

    //   console.log(posts);

    //   const tags = posts
    //     .map(item => item.tags)
    //   const uniqueTags = [...new Set(tags)]
    //   const pageSize = 5

    //   console.log(uniqueTags);

    //   return uniqueTags.map(tag => {
    //     const postsWithTag = posts.filter(post => post.tags.includes(tag))

    //     return lodashChunk(postsWithTag, pageSize)
    //       .map((item, index) => ({
    //         tagName: tag,
    //         pageNumber: index,
    //         pageData: item
    //       }))
    //   }).flat()
    // })

    // Date formatting (human readable)
    eleventyConfig.addFilter("readableDate", dateObj => {
        return DateTime.fromJSDate(dateObj).toFormat("dd LLL yyyy");
    });

    // Date formatting (machine readable)
    eleventyConfig.addFilter("machineDate", dateObj => {
        return DateTime.fromJSDate(dateObj).toFormat("yyyy-MM-dd");
    });

    // Minify CSS
    eleventyConfig.addFilter("cssmin", function(code) {
        return new CleanCSS({}).minify(code).styles;
    });

    // Minify JS
    eleventyConfig.addFilter("jsmin", function(code) {
        let minified = UglifyJS.minify(code);
        if (minified.error) {
            console.log("UglifyJS error: ", minified.error);
            return code;
        }
        return minified.code;
    });

    // @TODO: refactor this.
    // @FIXME: ugly
    eleventyConfig.addNunjucksFilter("where", function(obj, key, value) {
        obj.pages = obj.pages.filter(item => item[key] === value);
        obj.items = obj.items.filter(item => item[key] === value);
        return obj;
    });

    // find obj by key containting value
    eleventyConfig.addNunjucksFilter("findBy", (arr, key, value) => arr.filter(item => item[key] === value)[0]);

    // find obj by key containting value
    eleventyConfig.addNunjucksFilter("renderContent", (snippets, snippetName) => {
        return snippets.filter(item => item["name"] === snippetName)[0]["content"];
    });


    // Minify HTML output
    eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
        if (outputPath && outputPath.indexOf(".html") > -1) {
            let minified = htmlmin.minify(content, {
                useShortDoctype: true,
                removeComments: true,
                collapseWhitespace: true
            });
            return minified;
        }
        return content;
    });

    eleventyConfig.addShortcode("includeAll", function(path) {
        const entries = fg.sync(path, { dot: true });
        let output = '';
        entries.forEach(entry => { output += fs.readFileSync(entry, 'utf8').toString() });
        return output;
    });


    if (!process.env.ELEVENTY_SERVERLESS) {
        eleventyConfig.on('afterBuild', () => {
            fs.copyFileSync('./netlify-override.toml', './netlify.toml');
            console.log('afterBuild hook done. netlify toml overwritten.');
            // Run me after the build ends
        });
    }

    eleventyConfig.addPassthroughCopy("favicon.ico");
    eleventyConfig.addPassthroughCopy("static/img");
    eleventyConfig.addPassthroughCopy("robots.txt");
    // eleventyConfig.addPassthroughCopy("admin");
    // eleventyConfig.addPassthroughCopy("_includes/assets/css/inline.css");
    eleventyConfig.addPassthroughCopy("netlify-tryout.toml");

    /* Markdown Plugins */
    let markdownIt = require("markdown-it");
    let markdownItAnchor = require("markdown-it-anchor");
    let options = {
        html: true,
        breaks: true,
        linkify: true
    };
    let opts = {
        permalink: false
    };

    eleventyConfig.setLibrary("md", markdownIt(options)
        .use(markdownItAnchor, opts)
    );

    eleventyConfig.setBrowserSyncConfig({
        notify: true,
        ghostMode: {
            clicks: true,
            forms: true,
            scroll: true
        },
        ui: {
            port: 8081
        }
    });

    return {
        templateFormats: ["md", "njk", "html", "liquid"],

        // If your site lives in a different subdirectory, change this.
        // Leading or trailing slashes are all normalized away, so don’t worry about it.
        // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
        // This is only used for URLs (it does not affect your file structure)
        pathPrefix: "/",

        markdownTemplateEngine: "liquid",
        htmlTemplateEngine: "njk",
        dataTemplateEngine: "njk",
        dir: {
            input: ".",
            includes: "_includes",
            data: "_data",
            output: "_site"
        }
    };
};