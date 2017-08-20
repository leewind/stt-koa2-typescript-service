# STT-KOA2-TYPESCRIPT-SERVICE

## HOWTO

1. 安装`nodejs`开发环境，参考[nodejs](https://nodejs.org/zh-cn/)，推荐使用7.1.0以上版本参考[这里](https://nodejs.org/dist/v7.1.0/)
2. 安装`typescript`的编译环境

    ```javascript
    npm install -g typescript
    ```

    安装完成之后查看版本

    ```shell
    ➜  stt-koa2-typescript-service git:(master) ✗ tsc -v
    Version 2.2.2
    ```

    安装typings作为TypeScript Definition Manager

    ```shell
    npm install typings --global
    ```
3. `git clone`项目，进入目录，安装依赖

     ```shell
     npm install
     typings install
     ```

4. 安装完成之后，进行typescript的编译

    ```shell
    tsc
    ```

5. 编译完成启动项目

    ```shell
    npm start
    ```

    或者采用nohup方式

    ```shell
    nohup node ./lib/index.js &
    ```

## TODO

1. 进去example的访问页面，访问`localhost:30001/example`
2. 选择一个wav文件，点击upload进行上传
3. 如果顺利20-30秒之后会返回结果，例如
    ```
    {"code":0,"msg":"解析成功","result":[{"RecognitionStatus":"Success","DisplayText":"My dream job is to be come see you in a company.","Offset":2900000,"Duration":37600000},{"RecognitionStatus":"Success","DisplayText":"Bring some money to me.","Offset":55700000,"Duration":25400000},{"RecognitionStatus":"Success","DisplayText":"Scales and I think I will be come see yo finally.","Offset":92800000,"Duration":34900000},{"RecognitionStatus":"EndOfDictation","Offset":142700000,"Duration":0}]}
    ```

## API

### /recognize
+ 接口: /recognize
+ METHOD: POST
+ REQUEST: 文件上传格式multipart/form-data
    - 参数 file: File
+ RESPONSE: json对象
    - 案例: {"code":0,"msg":"解析成功","result":[{"RecognitionStatus":"Success","DisplayText":"My dream job is to be come see you in a company.","Offset":2900000,"Duration":37600000},{"RecognitionStatus":"Success","DisplayText":"Bring some money to me.","Offset":55700000,"Duration":25400000},{"RecognitionStatus":"Success","DisplayText":"Scales and I think I will be come see yo finally.","Offset":92800000,"Duration":34900000},{"RecognitionStatus":"EndOfDictation","Offset":142700000,"Duration":0}]}