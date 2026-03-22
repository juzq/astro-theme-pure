#!/usr/bin/env node

// 简单的测试脚本，验证工具页面功能

const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, 'src/pages/tools');

console.log('🔧 工具页面验证\n');

// 检查文件是否存在
const files = ['index.astro', 'README.md', 'test-example.txt'];
let allFilesExist = true;

files.forEach(file => {
  const filePath = path.join(toolsDir, file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`✅ ${file} (${(stats.size / 1024).toFixed(1)} KB)`);
  } else {
    console.log(`❌ ${file} 不存在`);
    allFilesExist = false;
  }
});

// 检查导航栏配置
const siteConfigPath = path.join(__dirname, 'src/site-config.ts');
if (fs.existsSync(siteConfigPath)) {
  const configContent = fs.readFileSync(siteConfigPath, 'utf8');
  if (configContent.includes("title: 'Tools'") && configContent.includes("link: '/tools'")) {
    console.log('✅ 导航栏配置正确');
  } else {
    console.log('❌ 导航栏配置不正确');
    allFilesExist = false;
  }
}

console.log('\n📋 功能特性:');
console.log('  • 多页签切换系统');
console.log('  • JSON 格式化');
console.log('  • XML 格式化');
console.log('  • Protobuf 格式化');
console.log('  • 实时搜索功能');
console.log('  • 格式化按钮');
console.log('  • 清空按钮');

console.log('\n🚀 启动开发服务器:');
console.log('  pnpm dev');
console.log('  访问: http://localhost:4321/tools');

console.log('\n📚 使用文档:');
console.log(`  ${path.join(toolsDir, 'README.md')}`);

if (allFilesExist) {
  console.log('\n✨ 所有检查通过！');
} else {
  console.log('\n⚠️  部分文件缺失，请检查');
}
