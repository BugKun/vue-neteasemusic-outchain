module.exports = {
    plugins: {
        autoprefixer: {
            /* PostCSS plugin to parse CSS and add vendor prefixes to CSS rules */
            /* 配置文档链接：https://github.com/postcss/autoprefixer#options */
            overrideBrowserslist: [
                'last 2 versions'
            ]
        }
    }
}
