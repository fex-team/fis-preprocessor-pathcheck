## FIS 路径检查插件

检查js，css，html，tpl文件中绝对路径。无效路径报warning。

### 使用

```shell
$ npm install -g fis-preprocessor-pathcheck
$ vi path/to/project/fis-conf.js
```

```javascript
//configure plugin
fis.config.set('modules.preprocessor.js', 'pathcheck');
fis.config.set('modules.preprocessor.css', 'pathcheck');
fis.config.set('modules.preprocessor.html', 'pathcheck');

//FIS-PLUS
fis.config.set('modules.preprocessor.tpl', 'pathcheck,' + fis.config.get('modules.preprocessor.tpl'));

//configure plugin settings
fis.config.set('settings.preprocessor.pathcheck', {
    //ignored some files
    //ignored : 'static/libs/**.js',
    ignored : [ 'static/libs/**.js', /jquery\.js$/i ]
});
```
