var Compile = require('../base-compiler');

function compileZig(info, env) {
    var compiler = new Compile(info, env);

    compiler.optionsForFilter = function (filters, outputFilename, userOptions) {
        var options = ['build-exe', '--output', this.filename(outputFilename)];
        if (!filters.binary) {
            options = options.concat(['--emit', 'asm']);
            if (filters.intel) {
                options = options.concat(['-mllvm', '--x86-asm-syntax=intel'])
            }
        }
        return options;
    }

    return compiler.initialise();
}

module.exports = compileZig;
