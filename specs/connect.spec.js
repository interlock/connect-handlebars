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

describe('connect function',function() {
    var functionInstance;
    // mock ServerResponse
    var Res = function() {};
    Res.prototype.writeHead = function(code,head) {};
    Res.prototype.end = function(out,encoding) {};
    var res;
    
    // mock ServerRequest
    var Req = function() {};
    var req;
    
    var next;
    
    beforeEach(function() {
        functionInstance = ConnectHandlebars(
            __dirname + '/templates',
            {
                encoding: 'ascii',
            }
        );
        res = new Res();
        req = new Req();
        
        next = jasmine.createSpy('next');
    });
    
    it('does not call next', function() {
        functionInstance(req,res,next);
        expect(next).not.toHaveBeenCalled();
    });
    
    it('respects encoding in header', function() {
        spyOn(res,'writeHead');
        functionInstance(req,res,next);
        expect(res.writeHead).toHaveBeenCalledWith(200,{ 'Content-Type' : 'text/javascript; chartset=ascii'});
    });
    
    it('respects encoding on end write', function() {
        spyOn(res,'end');
        functionInstance(req,res,next);
        expect(res.end.mostRecentCall.args[1]).toBe('ascii');
    });
    
});