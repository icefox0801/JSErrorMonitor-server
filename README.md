# JSErrorMonitor-server
JSErrorMonitor的API服务  
**该项目未做数据库方面性能优化，适用于demo和访问量不大的网站**

## 环境
**由于项目中使用了部分ES6语法，所以请保证本地的node版本不低于4.3.2**

## 安装
1. 通过`npm install`安装所有依赖
2. 本地开发依赖[nodemon](https://github.com/remy/nodemon)守护进程，可通过`npm install nodemon -g`安装
3. 数据库采用[mongodb](https://www.mongodb.org/)，请安装并启动服务

## 命令
1. 通过`npm start`在`8088`端口启动服务
2. 通过`npm run debug`以`debug`模式启动服务

## 调试
调试可通过[node-inspector](https://github.com/node-inspector/node-inspector)，可通过`npm install node-inspector -g`安装
