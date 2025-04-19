const express = require('express');
const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const postalCodeFile = path.join(__dirname, '../data/codigos_postais.csv');
const POSTAL_CODE_DATA = new Map();
let isDataLoaded = false;

// 加载 CSV 数据并缓存到内存中
function loadData() {
  if (isDataLoaded) return;  // 如果数据已经加载过，就不再加载

  fs.createReadStream(postalCodeFile)
    .pipe(parse({
      delimiter: ',', // 分隔符
      columns: true,  // 使用 CSV 的第一行作为列名
      trim: true,     // 去除每个字段的前后空格
      skip_empty_lines: true  // 跳过空行
    }))
    .on('data', (row) => {
      const fullPostalCode = `${row.num_cod_postal}-${row.ext_cod_postal}`;
      const city = row.desig_postal && typeof row.desig_postal === 'string' ? row.desig_postal.trim() : 'Unknown City';
      POSTAL_CODE_DATA.set(fullPostalCode, city);
    })
    .on('end', () => {
      console.log(`✅ Data loaded: ${POSTAL_CODE_DATA.size} postal codes.`);
      isDataLoaded = true;  // 标记数据已加载
    })
    .on('error', (err) => {
      console.error('Error reading CSV file:', err);
    });
}

// 查询邮政编码对应城市的 API
router.get('/getCityByPostalCode/:postalCode', (req, res) => {
  loadData();  // 在查询时加载数据

  const postalCode = req.params.postalCode;  // 获取路径参数
  console.log('Received postal code:', postalCode);  // 调试打印

  // 查找邮政编码对应的城市
  const city = POSTAL_CODE_DATA.get(postalCode);

  if (city) {
    return res.json({ city });
  } else {
    return res.status(404).json({ message: 'Postal code not found' });
  }
});

module.exports = router;
