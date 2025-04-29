/**
 * 📄 Postal Code Routes
 * 
 * 本文件定义邮政编码 (Postal Code) 查询相关的 API 接口，
 * 支持根据邮政编码查找对应的城市名称。
 * 
 * 数据来源: /data/codigos_postais.csv
 * 
 * 路由列表：
 * - GET /getCityByPostalCode/:postalCode ➔ 根据邮政编码查询城市
 */

const express = require('express');
const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// 📄 CSV 文件路径
const postalCodeFile = path.join(__dirname, '../data/codigos_postais.csv');

// 📦 内存缓存
const POSTAL_CODE_DATA = new Map();
let isDataLoaded = false;

/**
 * 🔄 加载 CSV 文件数据到内存 Map
 */
function loadData() {
  if (isDataLoaded) return; // 如果已经加载，直接返回

  fs.createReadStream(postalCodeFile)
    .pipe(parse({
      delimiter: ',',
      columns: true,
      trim: true,
      skip_empty_lines: true
    }))
    .on('data', (row) => {
      const fullPostalCode = `${row.num_cod_postal}-${row.ext_cod_postal}`;
      const city = row.desig_postal && typeof row.desig_postal === 'string'
        ? row.desig_postal.trim()
        : 'Unknown City';
      POSTAL_CODE_DATA.set(fullPostalCode, city);
    })
    .on('end', () => {
      console.log(`✅ Data loaded: ${POSTAL_CODE_DATA.size} postal codes.`);
      isDataLoaded = true;
    })
    .on('error', (err) => {
      console.error('❌ Error reading CSV file:', err);
    });
}

/**
 * 📬 GET /getCityByPostalCode/:postalCode
 * 根据邮政编码返回对应城市
 */
router.get('/getCityByPostalCode/:postalCode', (req, res) => {
  loadData(); // 每次请求时确保数据已加载

  const postalCode = req.params.postalCode;
  console.log('📥 Received postal code:', postalCode);

  const city = POSTAL_CODE_DATA.get(postalCode);

  if (city) {
    return res.json({ city });
  } else {
    return res.status(404).json({ message: 'Postal code not found' });
  }
});

module.exports = router;
