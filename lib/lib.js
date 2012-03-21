var fs = require('fs'), 
    handlebars = require('handlebars');

var lib = {
    defaults: {
        exts: ['handlebars'],
        recursive: true,
        encoding: 'utf8',
        cache: true,
        knownHelpers: [] // TODO implement this
    },
    generateTemplateRegExp: function(exts) {
        var exts_re;
        if ( typeof exts == 'string' ) {
          exts_re = new RegExp("\\." + exts + "$");
        } else if ( typeof exts == 'object' && exts.length !== undefined ) {
          for(var i = 0; i < exts.length; i++) {
            exts[i] = "." + exts[i];
          }
          exts_re = new RegExp("\\" + exts.join("|") + "$");
        } else {
            throw new Error('Connect-Handlebars option exts only accepts string or array object');
        }
        return exts_re;
    },
    processTemplate: function(options, template, root, output) {
        var self = this;
        var path = template,
            stat = fs.statSync(path);
        var firstLevel = false;
            
        if ( root === undefined ) {
            root = template;
            firstLevel = true;
        }
        options.timestamps = options.timestamps || {};
            
        // setup our RegExp for reuse
        if ( options.exts_re === undefined ) {
            options.exts_re = lib.generateTemplateRegExp(options.exts || lib.defaults.exts );
        }
        
        if ( stat.isDirectory() && 
         ( ( options.recursive === true || ( options.recursive === undefined && self.defaults.recursive ) ) || firstLevel ) ) {
            fs.readdirSync(template).map(function(file) {
                var path = template + '/' + file;

                if (options.exts_re.test(path) || fs.statSync(path).isDirectory()) {
                    self.processTemplate(options, path, root || template, output);
                }
            });
        } else if (stat.isFile() ) {
            self._processFile(options, path, template, root, self, output, stat);
        }
    },
    _processFile: function(options, path, template, root, self, output, stat) {
        // Clean the template name
        if (template.indexOf(root) === 0) {
            template = template.substring(root.length+1);
        }
        var key = template.replace(options.exts_re, '');
        
        var cache = options.cache || self.defaults.cache;
        if ( cache === false || options.timestamps[key] === undefined || options.timestamps[key] && options.timestamps[key].ts.getTime() != stat.mtime.getTime() ) {
            var data = fs.readFileSync(path, options.encoding || self.defaults.encoding );
            options.timestamps[key] = { ts: stat.mtime, _template: handlebars.precompile(data, options) };
        }
        output.push('templates[\'' + key + '\'] = template(' + options.timestamps[key]._template + ');\n');
    }
};

module.exports = lib;
