/**
 * fis
 * http://fis.baidu.com
 */

'use strict'

var ignored = {};

function checkPath(path, file){
    if(path){
        var info = fis.uri.getId(path, file.dirname);
        if(!info.file || !info.file.isFile()){
            fis.log.warning('Invalid path: File [' + file + '] use invalid path [' +  path + "] ");
        }
    }
}

function analyseComment(comment, file){
    var reg = /(@require\s+)('[^']+'|"[^"]+"|[^\s;!@#%^&*()]+)/g;
    comment.replace(reg, function(m, prefix, value){
        checkPath(value, file);
    });
}

//[@require id] in comment to require resource
//<!--inline[path]--> to embed resource content
//<img|embed|audio|video|link|object ... (data-)?src="path"/> to locate resource
//<img|embed|audio|video|link|object ... (data-)?src="path?__inline"/> to embed resource content
//<script|style ... src="path"></script|style> to locate js|css resource
//<script|style ... src="path?__inline"></script|style> to embed js|css resource
//<script|style ...>...</script|style> to analyse as js|css
function lint_html(content, file){
    var reg = /(<script(?:(?=\s)[\s\S]*?["'\s\w\/\-]>|>))([\s\S]*?)(?=<\/script\s*>|$)|(<style(?:(?=\s)[\s\S]*?["'\s\w\/\-]>|>))([\s\S]*?)(?=<\/style\s*>|$)|<(img|embed|audio|video|link|object|source)\s+[\s\S]*?["'\s\w\/\-](?:>|$)|<!--inline\[([^\]]+)\]-->|<!--(?!\[)([\s\S]*?)(-->|$)/ig;
    var callback = callback || function(m, $1, $2, $3, $4, $5, $6, $7, $8){
        if($1){//<script>
            $1 = $1.replace(/(\s(?:data-)?src\s*=\s*)('[^']+'|"[^"]+"|[^\s\/>]+)/ig, function(m, prefix, value){
               checkPath(value, file);
            });
            if(!/\s+type\s*=/i.test($1) || /\s+type\s*=\s*(['"]?)text\/javascript\1/i.test($1)) {
                //without attrubite [type] or must be [text/javascript]
                lint_js($2, file);
            } else {
                //other type as html
                lint_html($2, file);
            }
        } else if($3){//<style>
            lint_css($4, file);
        } else if($5){//<img|embed|audio|video|link|object|source>
            var tag = $5.toLowerCase();
            if(tag === 'link'){
                m = m.replace(/(\s(?:data-)?href\s*=\s*)('[^']+'|"[^"]+"|[^\s\/>]+)/ig, function(_, prefix, value){
                    checkPath(value, file);
                });
            } else if(tag === 'object'){
                m = m.replace(/(\sdata\s*=\s*)('[^']+'|"[^"]+"|[^\s\/>]+)/ig, function(m, prefix, value){
                    checkPath(value, file);
                });
            } else {
                m = m.replace(/(\s(?:data-)?src\s*=\s*)('[^']+'|"[^"]+"|[^\s\/>]+)/ig, function(m, prefix, value){
                    checkPath(value, file);
                });
            }
        } else if($6){
            checkPath($6, file);
        } else if($7){
            analyseComment($7, file);
        }
    };
    content.replace(reg, callback);
}

//[@require id] in comment to require resource
//[@import url(path?__inline)] to embed resource content
//url(path) to locate resource
//url(path?__inline) to embed resource content or base64 encodings
//src=path to locate resource
function lint_css(content, file){
    var reg = /(\/\*[\s\S]*?(?:\*\/|$))|(?:@import\s+)?\burl\s*\(\s*("(?:[^\\"\r\n\f]|\\[\s\S])*"|'(?:[^\\'\n\r\f]|\\[\s\S])*'|[^)}]+)\s*\)(\s*;?)|\bsrc\s*=\s*("(?:[^\\"\r\n\f]|\\[\s\S])*"|'(?:[^\\'\n\r\f]|\\[\s\S])*'|[^\s}]+)/g;
    var result;
    while((result = reg.exec(content)) !== null){
        var comment = result[1];
        var url = result[2];
        var filter = result[4];
        if(comment){
            analyseComment(comment, file);
        }else if(url){
            checkPath(url, file);
        } else if(filter){
            checkPath(filter, file);
        }
    }
}
//[@require id] in comment to require resource
//__inline(path) to embedd resource content or base64 encodings
//__uri(path) to locate resource
//require(path) to require resource
function lint_js(content, file){
    var reg = /"(?:[^\\"\r\n\f]|\\[\s\S])*"|'(?:[^\\'\n\r\f]|\\[\s\S])*'|(\/\/[^\r\n\f]+|\/\*[\s\S]+?(?:\*\/|$))|\b(__inline|__uri|require)\s*\(\s*("(?:[^\\"\r\n\f]|\\[\s\S])*"|'(?:[^\\'\n\r\f]|\\[\s\S])*')\s*\)/g;
    var result;
    while((result = reg.exec(content)) !== null){
        var comment = result[1];
        var value = result[3];
        if(comment){
            analyseComment(comment, file);
        }else if(value){
            checkPath(value, file);
        }
    }
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
        lint_html(content, file);
    }else if(file.isJsLike){
        lint_js(content, file);
    }else if(file.isCssLike){
        lint_css(content, file);
    }
    return content;
}