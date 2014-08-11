var expect = require('chai').expect,
    fs = require('fs'),
    file = require('fis').file,
    root = __dirname + '/project',
    pathCheck = require('../../index.js');

describe('compile', function(){
    var tempfiles = [];

    before(function(){
        fis.project.setProjectRoot(root);
        // fis.project.setTempRoot(root+'/target/');
    });

    afterEach(function(){
        tempfiles.forEach(function(f){
            // fis.util.del(root+'/target/');
        });
    });

    it('check css file', function(){
        var f = file(root + '/static/a.css');
        var content = pathCheck(f.getContent(), f, {});
        expect(content).to.equal(f.getContent());

    });

     it('check js file', function(){
        var f = file(root + '/static/a.js');
        var content = pathCheck(f.getContent(), f, {});
        expect(content).to.equal(f.getContent());

    });


    it('check html file', function(){
        var f = file(root + '/page/a.html');
        var content = pathCheck(f.getContent(), f, {});
        expect(content).to.equal(f.getContent());
    });

    it('check html file', function(){
        var f = file(root + '/page/c.html');
        var content = pathCheck(f.getContent(), f, {});
        expect(content).to.equal(f.getContent());
    });

    it('check html file', function(){
        var f = file(root + '/page/d.html');
        var content = pathCheck(f.getContent(), f, {});
        expect(content).to.equal(f.getContent());
    });

    it('check html file', function(){
        var f = file(root + '/page/f.html');
        var content = pathCheck(f.getContent(), f, {});
        expect(content).to.equal(f.getContent());
    });
});
