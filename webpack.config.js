let path = require("path");
let webpack = require("webpack");
let DefinePlugin = new webpack.DefinePlugin({
    __DEV__:(process.env.NODE_ENV||"dev").trim()=="dev"
});

let ExtractTextPlugin = require("extract-text-webpack-plugin");
let HtmlWebpackPlugin = require("html-webpack-plugin");
let OpenBrowserWebpackPlugin = require("open-browser-webpack-plugin");

let jqueryPath = path.resolve('node_modules/jquery/dist/jquery.js');
let bootstrapPath = path.resolve('node_modules/bootstrap/dist/css/bootstrap.css');

//进行路径的转换，传入要替换成什么样的路径
function rewriteUrl(replacePath) {
    return function (req, options) {
        req.url = req.path.replace(/\/api\/(.+)/,'\/$1\.json');
        };
    }
//导出一个模块对象，设置入口文件
module.exports = {
    //设置入口文件的绝对路径
    entry:{
        // index:path.resolve("src/index.js"),
        // vendor:['jquery'],
        a:path.resolve("src/a.js"),
        b:path.resolve("src/b.js")
    },
    //设置输出
    output:{
        path:path.resolve("./build"),     //设置输出目录，输出文件的目标目录
        filename:'[name].js'   //设置输出的文件名
    },
    //配置模块
    module:{
        rules:[ //指定不同文件的加载器
            {
                test:/\.js$/,  //指定要加载的文件
                loader:"babel-loader", //指定加载器
                include:path.resolve("./src"),
                exclude:path.resolve("./build")
            },
            {
                test:/\.less$/,  //指定要加载的文件
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader!less-loader"
                })
            },
            {
                test:/\.css$/,  //指定要加载的文件
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                test: /\.(woff|woff2|ttf|svg|eot)$/,  //指定要加载的文件
                loader:"url-loader?limit=8192"
            },
            {
                test: /\.(jpg|png|gif)$/,  //指定要加载的文件
                loader:"url-loader?limit=8192"
            },
            {
                test: /jquery\.js$/,  //指定要加载的文件
                loader:"expose-loader?jQuery"
            }
        ]
    },
    devServer: {
        stats:{colors:true},
        port:8080,
        contentBase:"build",
        inline:true,  //在源代码修改之后重新打包并刷新浏览器
        proxy: {
            "/api": {
                target: "http://localhost:8080",
                bypass: function(req, res, proxyOptions) {
                    req.url = req.path.replace(/\/api\/(.+)/,'\/$1\.json');
                    return req.url;
                }
            }
        }
    },
    //如何解析文件
    resolve:{
        //指定文件扩展名
        extensions: [".js",".css",".json",".less"],
        alias:{
            Jquery:jqueryPath,
            bootstrap:bootstrapPath
        }
    },
    plugins: [
        DefinePlugin,
        new ExtractTextPlugin("bundle.css"),
        //把template里面的文件拷贝到目标目录并且自动插入产出的或者说打包后的文件
        new HtmlWebpackPlugin({
            title:"测试",
            template:"./src/index.html",
            filename:"./index.html"
        }),
        new HtmlWebpackPlugin({
            title:"Webpack",
            template:"./src/index.html",
            filename:"./a.html",
            chunks:['a','common']
        }),
        new HtmlWebpackPlugin({
            title:"Webpack",
            template:"./src/index.html",
            filename:"./b.html",
            chunks:['b','common']
        }),
        new OpenBrowserWebpackPlugin({
            url:"http://localhost:8080"
        }),
        new webpack.optimize.CommonsChunkPlugin('common'),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
            warnings: false
            }
        }),
        new webpack.optimize.MinChunkSizePlugin({
            compress: {
                warnings: false
            }
        }),
        // 查找相等或近似的模块，避免在最终生成的文件中出现重复的模块
        new webpack.optimize.DedupePlugin(),
        // 按引用频度来排序 ID，以便达到减少文件大小的效果
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.AggressiveMergingPlugin({
            minSizeReduce: 1.5,
            moveToParents: true
            })
        ]
};