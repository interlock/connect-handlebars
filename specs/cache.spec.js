var lib = require('../lib/lib');
var fs = require('fs');

describe('cache',function() {
    var templates_dir = __dirname + '/templates';
    var file_template = templates_dir + '/other.hbs';
    var options;
    beforeEach(function() {
        options = {timestamps: {}, exts: ['hbs','handlebars'] };
    });
    
    it('stores the timestamp for templates', function() { 
       var output = [];
       lib.processTemplate(options,templates_dir, undefined, output);
       expect(options.timestamps['other'].ts).toBeDefined();
    });
    
    it('stores multiple template ts', function() {
        var output = [];
       lib.processTemplate(options,templates_dir, undefined, output);
       expect(options.timestamps['basic'].ts).toBeDefined();
    });
    
    it('updates timestamp when file stat differs', function() {
        var output = [];
       lib._processFile(options, file_template, file_template, templates_dir, lib, output, { mtime: new Date(1990,1,1) } );
       var ts = options.timestamps['other.hbs'].ts;
       
       lib._processFile(options, file_template, file_template, templates_dir, lib, output, { mtime: new Date() } );
       expect(options.timestamps['other.hbs'].ts.getTime()).not.toBe(ts.getTime());
    });
    
    it('uses cached template', function() {
        var output = [];
        var date = new Date(1999,1,1);
        options.timestamps['other.hbs'] = { ts: date, _template: 'foo' };
        lib._processFile(options, file_template, file_template, templates_dir, lib, output, { mtime: date } );
        expect(options.timestamps['other.hbs']._template).toBe('foo');       
    });
    
    it('updates cached template when TS differs', function() {
        var output = [];
        options.timestamps['other.hbs'] = { ts: new Date(1999,1,1), _template: 'foo' };
        lib._processFile(options, file_template, file_template, templates_dir, lib, output, { mtime: new Date(2000,1,1) } );       
        expect(options.timestamps['other.hbs']._template).not.toBe('foo');     
    });
    
    it('can turn caching off', function() {
        delete(options.cache);
        var output = [];
        options.cache = false;
        options.timestamps['other.hbs'] = { ts: new Date(1999,1,1), _template: 'foo' };
        lib._processFile(options, file_template, file_template, templates_dir, lib, output, { mtime: new Date(1999,1,1) } );       
        expect(options.timestamps['other.hbs']._template).toBe('foo');
    });
    
});
