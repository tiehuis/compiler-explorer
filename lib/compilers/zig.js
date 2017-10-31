var Compile = require('../base-compiler');

function compileZig(info, env) {
    var compiler = new Compile(info, env);

    compiler.optionsForFilter = function (filters, outputFilename, userOptions) {
        var options = ['build-exe', '--output', this.filename(outputFilename)];
        return options;
    }

    return compiler.initialise();
}

module.exports = compileZig;
