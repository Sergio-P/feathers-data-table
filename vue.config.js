module.exports = {
    css: { 
        extract: false
    },
    configureWebpack: {
        externals: {
            moment: "moment"
        }
    }
};