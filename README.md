Taxi WebApp
这是FCUL 信息工程专业 PSI科目的一个作业，目的是根据老师提供的讲义内容完成一个出租车公司的App。

项目介绍
该项目使用 Angular CLI version 16.1.0-rc.0 生成。

详细版本信息：
Node.js: v20.11.1

MongoDB: v8.0.8

Angular: v16

安装和运行步骤
1. 克隆项目
首先，克隆这个项目到本地：

bash
复制
编辑
git clone <your-repository-url>
2. 安装前端依赖
进入前端文件夹并安装所需的依赖：

bash
复制
编辑
cd frontend/taxi-manager
npm install
3. 安装后端依赖
进入后端文件夹并安装所需的依赖：

bash
复制
编辑
cd backend
npm install
4. 启动前端开发服务器
在前端文件夹，运行 Angular 开发服务器：

bash
复制
编辑
cd frontend/taxi-manager
ng serve
然后在浏览器中访问 http://localhost:4200，你将看到前端应用的界面。

5. 启动后端服务
在后端文件夹，运行后端服务器：

bash
复制
编辑
cd backend
node server.js
6. 构建应用
如果你需要构建生产环境版本，可以使用以下命令：

bash
复制
编辑
ng build --prod
构建的文件会存储在 dist/ 目录下。

7. 运行单元测试
运行单元测试来确保功能正常：

bash
复制
编辑
ng test
这将使用 Karma 来执行单元测试。

8. 运行端到端测试
如果你需要运行端到端测试，可以使用：

bash
复制
编辑
ng e2e
这将使用所选的平台来执行端到端测试。

其他帮助
Angular CLI 帮助：使用 ng help 或访问 Angular CLI 概述和命令参考 页面获取更多帮助。

功能文档：关于软件功能的详细内容，请参考项目内的 PDF 文档。

感谢您的使用，祝您开发愉快！
