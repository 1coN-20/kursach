import pool from "../config/database.js";
import ExcelJS from "exceljs";

const exportOrdersToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Orders Report");

    const orders = await pool.query(`
        SELECT 
            ao.id,
            ao.name,
            ao.email,
            ao.phone_number,
            ao.delivery_address,
            array_agg(p.name) AS product_names,
            ao.quantity,
            ao.createdAt,
            ao.order_status
        FROM "AllOrders" ao
        JOIN "Product" p ON p.id = ANY(ao.product_id)
        GROUP BY ao.id;
    `);

    const bestSellingProduct = await pool.query(`
        SELECT p.name, SUM(q) as total_sold 
        FROM "AllOrders", unnest(quantity) as q, unnest(product_id) as pid
        JOIN "Product" p ON p.id = pid
        GROUP BY p.name
        ORDER BY total_sold DESC
        LIMIT 1;
    `);
    
    const ordersPerDay = await pool.query(`
        SELECT TO_CHAR(createdAt, 'ID')::INTEGER AS day_index, COUNT(*) as order_count
        FROM "AllOrders"
        WHERE createdAt >= NOW() - INTERVAL '7 days'
        GROUP BY day_index
        ORDER BY day_index;
    `);

    const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    const ordersMap = new Array(7).fill(0); 

    ordersPerDay.rows.forEach(row => {
        ordersMap[row.day_index - 1] = row.order_count; 
    });

    sheet.addRow(['', ...weekDays]);

    sheet.addRow(['Заказы', ...ordersMap]);
    
    const completedOrders = await pool.query(
        `SELECT COUNT(*) AS completed FROM "AllOrders" WHERE order_status = 'Выполнен';`
    );
    const canceledOrders = await pool.query(
       `SELECT COUNT(*) AS completed FROM "AllOrders" WHERE order_status = 'Отменен';`
    );
    const totalOrders = await pool.query(
        `SELECT COUNT(*) AS total FROM "AllOrders";`
    );
    const completionRate = totalOrders.rows[0].total > 0 
        ? (completedOrders.rows[0].completed / totalOrders.rows[0].total * 100).toFixed(2) + '%' 
        : '0%';
    
    const cancelRate = totalOrders.rows[0].total > 0 
        ? (canceledOrders.rows[0].completed / totalOrders.rows[0].total * 100).toFixed(2) + '%' 
        : '0%';
    
    sheet.addRow([]);
    sheet.addRow(['Самый продаваемый товар:', bestSellingProduct.rows[0]?.name || 'Нет данных']);
    sheet.addRow([]);
    sheet.addRow(['Процент завершенных заказов:', completionRate]);
    sheet.addRow([]);
    sheet.addRow(['Процент завершенных заказов:', cancelRate]);

    const filePath = 'Orders_Report.xlsx';
    await workbook.xlsx.writeFile(filePath);

    return filePath;
};

const getOrdersData = async () => {
    const ordersPerDay = await pool.query(`
        SELECT TO_CHAR(createdAt, 'ID')::INTEGER AS day_index, COUNT(*) as order_count
        FROM "AllOrders"
        WHERE createdAt >= NOW() - INTERVAL '7 days'
        GROUP BY day_index
        ORDER BY day_index;
    `);

    const bestSellingProduct = await pool.query(`
        SELECT p.name, SUM(q) as total_sold 
        FROM "AllOrders", unnest(quantity) as q, unnest(product_id) as pid
        JOIN "Product" p ON p.id = pid
        WHERE order_status = 'Выполнен'
        GROUP BY p.name
        ORDER BY total_sold DESC
        LIMIT 1;
    `);

    const completedOrders = await pool.query(
        `SELECT COUNT(*) AS completed FROM "AllOrders" WHERE order_status = 'Выполнен';`
    );
    const canceledOrders = await pool.query(
       `SELECT COUNT(*) AS completed FROM "AllOrders" WHERE order_status = 'Отменен';`
    );
    const totalOrders = await pool.query(
        `SELECT COUNT(*) AS total FROM "AllOrders";`
    );

    const completionRate = totalOrders.rows[0].total > 0 
        ? (completedOrders.rows[0].completed / totalOrders.rows[0].total * 100).toFixed(2) + '%' 
        : '0%';
    
    const cancelRate = totalOrders.rows[0].total > 0 
        ? (canceledOrders.rows[0].completed / totalOrders.rows[0].total * 100).toFixed(2) + '%' 
        : '0%';
    
    const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    const ordersMap = new Array(7).fill(0);

    ordersPerDay.rows.forEach(row => {
        ordersMap[row.day_index - 1] = row.order_count;
    });

    return {
        weekDays,
        ordersMap,
        bestSellingProduct: bestSellingProduct.rows[0]?.name || 'Нет данных',
        completionRate,
        cancelRate
    };
};

export { exportOrdersToExcel, getOrdersData };