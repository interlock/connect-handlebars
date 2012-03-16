var ConnectHandlebars = require('../lib/connect-handlebars');
var lib = require('../lib/lib');

describe('template regex', function() {
    
    beforeEach(function() {
    });
    
    it('accepts string', function() {
        expect(lib.generateTemplateRegExp('hbs')).toBeDefined();
    });
    
    it('has correct regex from string', function() {
        var re = lib.generateTemplateRegExp('hbs');
        expect(re.source).toBe('\\.hbs$');
    });
    
    it('accepts an array', function() {
        expect(lib.generateTemplateRegExp(['hbs'])).toBeDefined();
    });
    
    it('has correct regex from single array',function() {
        var re = lib.generateTemplateRegExp(['hbs']);
        expect(re.source).toBe('\\.hbs$');
    });
    
    it('accepts an array with many entries', function() {
        expect(lib.generateTemplateRegExp(['hbs','tpl'])).toBeDefined();
    });
    
    it('has correct regex from multiple array',function() {
        var re = lib.generateTemplateRegExp(['hbs','tpl']);
        expect(re.source).toBe('\\.hbs|.tpl$');
    });
});

describe('process template', function() {
    var templates_dir = __dirname + '/templates';
    
   it('processes root level', function() {
       var output = [];
       lib.processTemplate({exts:'hbs'},templates_dir, undefined, output);
       expect(output.length).toBe(1);
   });
   
   it('processes multiple template exts', function() {
       var output = [];
       lib.processTemplate({exts:['hbs','handlebars']},templates_dir, undefined, output);
       expect(output.length).toBe(3);
   });
   
   it('processes recursively by default', function() {
       var output = [];
       lib.processTemplate({exts:['handlebars']},templates_dir, undefined, output);
       expect(output.length).toBe(2);
   });
   
   it('respects recursive false', function() {
       var output = [];
       lib.processTemplate({exts:['handlebars'],recursive: false },templates_dir, undefined, output);
       expect(output.length).toBe(1);
   });
});