## FIS 路径检查插件

检查js，css，html，tpl中路径。无效路径报warning。

### 使用

```shell
$ npm install -g fis-preprocessor-pathCheck
$ vi path/to/project/fis-conf.js
```

```javascript
//configure plugin
fis.config.get('modules.preprocessor.js').unshift('pathCheck');
fis.config.get('modules.preprocessor.css').unshift('pathCheck');
fis.config.get('modules.preprocessor.html').unshift('pathCheck');
fis.config.get('modules.preprocessor.tpl').unshift('pathCheck');

//configure plugin settings
fis.cofnig.set('settings.preprocessor.pathCheck', {
    //ignored some files
    //ignored : 'static/libs/**.js',
    ignored : [ 'static/libs/**.js', /jquery\.js$/i ]
});
```