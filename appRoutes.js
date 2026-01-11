
/**
 * appRoutes.js
 * 
 * 功能：主路由集成文件
 * 说明：负责统一分发各独立功能模块的 API 请求。
 * 遵循“高内聚低耦合”原则，通过模块化路由配置实现系统的无损集成。
 */

const express = require('express');
const app = express();

// 1. 按顺序导入各独立功能模块路由
const customerRoutes = require('./routes/customerRoutes');
const financialRoutes = require('./routes/financialRoutes');
const productReviewRoutes = require('./routes/productReviewRoutes');
const productRoutes = require('./routes/productRoutes');

/**
 * 2. 统一注册路由前缀
 * 所有 API 接口均挂载于 /api 路径下，保持结构清晰
 */

// 客户管理模块（保持现有系统完整）
app.use('/api/customers', customerRoutes);

// 财务审核模块（独立新增：包含逐项确认与审批逻辑）
app.use('/api/financial', financialRoutes);

// 货品审核模块（独立新增：包含货品规格、供应商核验逻辑）
app.use('/api/product-reviews', productReviewRoutes);

// 货品管理模块（独立新增：包含开盘/征集模式切换及货品发布）
app.use('/api/products', productRoutes);

// 导出配置好的路由集成对象
module.exports = app;
