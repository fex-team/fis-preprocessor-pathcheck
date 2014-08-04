var ignored = {};

function lint_html(content){

}

function lint_css(content){
    
}

function lint_js(content){

}

module.exports = function(content, file, conf){
    if(conf.ignored){
        if(typeof conf.ignored === 'string' || fis.util.is(conf.ignored, 'RegExp')){
            ignored = [ conf.ignored ];
        }else if(fis.util.is(conf.ignored
            , 'Array')){
            ignored = conf.ignored;
        }
        delete conf.ignored;
    }
    if(ignored){
        for(var i=0, len=ignored.length; i<len; i++ ){
            if(fis.util.filter(file.subpath, ignored[i])) return;         
        }  
    }

    if(file.isHtmlLike){
        lint_html(content);
    }else if(file.isJsLike){
        lint_js(content);
    }else if(file.isCssLike){
        lint_css(content);
    }
}