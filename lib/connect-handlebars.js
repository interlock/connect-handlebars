var handlebars = require('handlebars');
var fs = require('fs');
module.exports = function(source,options) {
    if ( options == undefined) {
        options = {};
    }
    if (!source) throw new Error('connect-handlebars requires file path');

    function processTemplate(template, root, output) {
        var path = template,
            stat = fs.statSync(path);
        if (stat.isDirectory()) {
            fs.readdirSync(template).map(function(file) {
                var path = template + '/' + file;

                if (/\.handlebars$/.test(path) || fs.statSync(path).isDirectory()) {
                    processTemplate(path, root || template, output);
                }
            });
        } else {
            var data = fs.readFileSync(path, 'utf8');

            /*
            var options = {
                knownHelpers: known,
                knownHelpersOnly: argv.o
            };
            */

            // Clean the template name
            if (!root) {
                template = basename(template);
            } else if (template.indexOf(root) === 0) {
                template = template.substring(root.length+1);
            }
            template = template.replace(/\.handlebars$/, '');

            output.push('templates[\'' + template + '\'] = template(' + handlebars.precompile(data, options) + ');\n');
        }
    }

    return function(req,res,next) {
        var output = [];
        output.push('(function() {\n  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};\n');
        processTemplate(source, source, output);
        output.push('})();');
        output = output.join('');
        res.writeHead(200,{
            'Content-Type': 'text/javascript',
            'Content-Length': output.length
        });
        return res.end(output);
    };
};
