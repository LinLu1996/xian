### 前端目录结构

    ├── dist//输出
    │   └── ...
    ├── src//前端代码
    │   └── app
    │       └── ...
    │   └── component
    │       └── ...
    │   └── pages
    │       └── ...
    ├── mock//前端模拟接口
    │   └── ...
    package.json        前端引用资源配置文件
    webpack.config.js   webpack配置文件
    .babelrc            babel配置
    ...

### 打包静态资源到dist目录

```
   npm start //本地开发命令，不需要打包到dist目录
   npm run daily //发布前需要执行打包文件到dist目录——日常环境
   npm run prepub //发布前需要执行打包文件到dist目录——预发环境
   npm run publish //发布前需要执行打包文件到dist目录——线上环境
   （没有环境变量区分的时候用publish打包）
```

### 1、日常发布
* push 一个形如 daily/x.y.z 的分支。如

```
   git push -u origin daily/1.0.0
```

* 日常发布验证
  dist 目录中的文件将发布到 //g-assets.daily.taobao.net/{group}/{app}/{tag}/。如

```
   http(s)://g-assets.daily.taobao.net/platform/nw/1.0.0/
```

可重复 push 此分支，每 push 一次则发布 daily 一次，路径不变。

### 2、线上发布
* push 一个形如 publish/x.y.z 的 tag。如

```
   git tag publish/1.0.0
   git push -u origin publish/1.0.0
```

* 线上验证，build 目录中的文件将发布到 alinw.alicdn.com/{group}/{app}/{tag}/。如

```
   http(s)://alinw.alicdn.com/platform/nw/1.0.0/
```