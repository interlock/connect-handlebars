var handlebars = require('handlebars');
var fs = require('fs');

module.exports = function(source,options) {
    if ( options == undefined) {
        options = {};
    }
    var exts = options.exts || ['handlebars'];

    var exts_re = undefined;
    if ( typeof exts == 'string' ) {
      var exts_re = new RegExp("\\." + exts + "$");
    } else {

      for(var i = 0; i < exts.length; i++) {
        exts[i] = "." + exts[i];
      }
      exts_re = new RegExp("\\" + exts.join("|") + "$");
    }

    if (!source) throw new Error('connect-handlebars requires file path');

    function processTemplate(template, root, output) {
        var path = template,
            stat = fs.statSync(path);
        if (stat.isDirectory()) {
            fs.readdirSync(template).map(function(file) {
                var path = template + '/' + file;

                if (exts_re.test(path) || fs.statSync(path).isDirectory()) {
                    processTemplate(path, root || template, output);
                }
            });
        } else {
            var data = fs.readFileSync(path, 'utf8');

            
            // TODO implement and test helper stub optimization in precompile
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
            template = template.replace(exts_re, '');

            output.push('templates[\'' + template + '\'] = template(' + handlebars.precompile(data, options) + ');\n');
        }
    }

    return function(req,res,next) {
        var output = [];
        output.push('(function() {;\n  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};\n');
        processTemplate(source, source, output);
        output.push('})();');
        output = output.join('');
        res.writeHead(200,{
            'Content-Type': 'text/javascript; chartset=utf-8'
        });
        return res.end(output,'utf8');
    };
};
