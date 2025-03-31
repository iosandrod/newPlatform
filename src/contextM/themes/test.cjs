const fs = require('fs');
const path = require('path');

function copyLessToScss(dir) {
    // 读取当前目录内容
    fs.readdir(dir, (err, files) => {
        if (err) {
            console.error(`读取目录出错: ${dir}`, err);
            return;
        }
        
        files.forEach(file => {
            const filePath = path.join(dir, file);
            
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.error(`获取文件信息出错: ${filePath}`, err);
                    return;
                }
                if (stats.isDirectory()) {
                    // 如果是文件夹，递归处理
                    copyLessToScss(filePath);
                } else if (path.extname(file) === '.less') {
                    // 如果是 .less 文件，复制并重命名为 .scss
                    const newFilePath = path.join(dir, path.basename(file, '.less') + '.scss');
                    
                    fs.copyFile(filePath, newFilePath, (err) => {
                        if (err) {
                            console.error(`复制文件失败: ${filePath} -> ${newFilePath}`, err);
                        } else {
                            console.log(`复制成功: ${filePath} -> ${newFilePath}`);
                        }
                    });
                }
            });
        });
    });
}
function deleteLessFiles(dir) {
    if (!fs.existsSync(dir)) {
        console.log(`目录不存在: ${dir}`);
        return;
    }

    const files = fs.readdirSync(dir);
    files.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // 递归删除子目录中的 .less 文件
            deleteLessFiles(filePath);
        } else if (file.endsWith(".less")) {
            // 删除 .less 文件
            fs.unlinkSync(filePath);
            console.log(`Deleted: ${filePath}`);
        }
    });
}
// 使用示例，替换成你的目标文件夹路径
const targetFolder = __dirname;
// copyLessToScss(targetFolder);
// deleteLessFiles(targetFolder);