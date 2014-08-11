## FIS 路径检查插件

检查js，css，html，tpl文件中路径。无效路径报warning。

### 使用

```shell
$ npm install -g fis-preprocessor-pathcheck
$ vi path/to/project/fis-conf.js
```

```javascript
//configure plugin
fis.config.get('modules.preprocessor.js').unshift('pathcheck');
fis.config.get('modules.preprocessor.css').unshift('pathcheck');
fis.config.get('modules.preprocessor.html').unshift('pathcheck');
fis.config.get('modules.preprocessor.tpl').unshift('pathcheck');

//configure plugin settings
fis.cofnig.set('settings.preprocessor.pathcheck', {
    //ignored some files
    //ignored : 'static/libs/**.js',
    ignored : [ 'static/libs/**.js', /jquery\.js$/i ]
});
```
