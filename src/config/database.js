import pkg from 'pg';
const { Pool } = pkg; 

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const createUserTable = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS "User" (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        isAdmin BOOLEAN DEFAULT FALSE,
        phone_number VARCHAR(20) NOT NULL,
        delivery_address TEXT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_logout TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Функция для обновления столбца updatedAt
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updatedAt = CURRENT_TIMESTAMP;
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    -- Триггер для обновления updatedAt при изменении записи
    CREATE TRIGGER update_user_updated_at
    BEFORE UPDATE ON "User"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);
};

const addUser = async (userData) => {
    const { email, name, password, isAdmin, phone_number, delivery_address } = userData;
    const result = await pool.query(
        'INSERT INTO "User" (email, name, password, isAdmin, phone_number, delivery_address) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [email, name, password, isAdmin, phone_number, delivery_address]
    );
    return result.rows[0];
};

const getAllUsers = async () => {
    try {
        const result = await pool.query('SELECT * FROM "User"');
        return result.rows;
    } catch (error) {
        console.error('Ошибка при получении всех пользователей:', error);
        throw error; 
    }
};

const updateAdminTrue = async (id) =>{
    try {
        const result = await pool.query('UPDATE "User" SET isAdmin = TRUE WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

const updateAdminFalse = async (id) =>{
    try {
        const result = await pool.query('UPDATE "User" SET isAdmin = FALSE WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

const deleteUserById = async (id) => {
    try {
        const result = await pool.query('DELETE FROM "User" WHERE id = $1 RETURNING *', [id]);
        
        if (result.rows.length === 0) {
            throw new Error("User not found");
        }

        return result.rows[0]; 
    } catch (error) {
        throw new Error(`Error deleting user: ${error.message}`);
    }
};


const findUserByEmail = async (email) => {
    const result = await pool.query(
        'SELECT * FROM "User" WHERE email = $1',
        [email]
    );
    return result.rows[0];
};

const updateUserInfo = async (id, name, email, phone_number, delivery_address) =>{
    const result = await pool.query(`
        UPDATE "User"
        SET name = $1, email = $2, phone_number = $3, delivery_address = $4, updatedAt = CURRENT_TIMESTAMP
        WHERE id = $5
        RETURNING *;
    `, [name, email, phone_number, delivery_address, id]
    );
    return result.rows[0];
}

const createProductTable = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS "Product" (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL,
            image_url VARCHAR(255) NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            quantity INT NOT NULL,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE OR REPLACE FUNCTION update_product_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updatedAt = CURRENT_TIMESTAMP;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        CREATE TRIGGER update_product_updated_at
        BEFORE UPDATE ON "Product"
        FOR EACH ROW EXECUTE FUNCTION update_product_updated_at_column();
    `);
};

const addProduct = async (productData) => {
    const { name, image_url, price, quantity } = productData;
    const result = await pool.query(
        'INSERT INTO "Product" (name, image_url, price, quantity, createdAt, updatedAt) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *',
        [name, image_url, price, quantity]
    );
    return result.rows[0];
};

const deleteProduct = async (productId) => {
        const result = await pool.query(
            'DELETE FROM "Product" WHERE id = $1 RETURNING *',
            [productId]
        );
        return result.rows[0];
};

const getAllProducts = async () => {
    const result = await pool.query('SELECT * FROM "Product"');
    return result.rows;
};

const getProductById = async (id) => {
    const result = await pool.query(
        'SELECT * FROM "Product" WHERE email = $1',
        [id]
    );
    return result.rows[0];
};

const minusQuantity = async (id, orderQuantity) =>{
    const result = await pool.query(
        `UPDATE "Product" 
        SET quantity = quantity - $2, updatedAt = CURRENT_TIMESTAMP
        WHERE id = $1 AND quantity >= $2
        RETURNING *;
        `,
        [id, orderQuantity]
    );
    return result.rows[0];
}

const changeProduct = async (id, name, image_url, price, quantity) => {
    const result = await pool.query(`
        UPDATE "Product"
        SET 
            name = COALESCE(NULLIF($2, ''), name),
            image_url = COALESCE(NULLIF($3, ''), image_url),
            price = COALESCE(NULLIF($4, '')::DECIMAL, price),
            quantity = COALESCE(NULLIF($5, '')::INT, quantity),
            updatedAt = CURRENT_TIMESTAMP  -- Обновляем это поле всегда
        WHERE id = $1
        RETURNING *;
    `, [id, name, image_url, price, quantity]);

    return result.rows[0];
};

const createOrdersTable = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS "Orders" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    delivery_address TEXT NOT NULL,
    product_id INTEGER[] NOT NULL, -- Массив ID продуктов
    quantity INTEGER[] NOT NULL, -- Количество каждого продукта
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_orders_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updatedAt = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON "Orders"
FOR EACH ROW EXECUTE FUNCTION update_orders_updated_at_column();
    `);
};

const addOrder = async ({ name, email, phone_number, delivery_address, product_id, quantity }) => {
    try {
        const result = await pool.query(`
            INSERT INTO "Orders" (name, email, phone_number, delivery_address, product_id, quantity)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `, [name, email, phone_number, delivery_address, product_id, quantity]);

        return result.rows[0];
    } catch (error) {
        console.error("Ошибка при добавлении заказа:", error);
        throw error;
    }
};

const getAllOrders = async() => {
    const result = await pool.query('SELECT * FROM "Orders"');
    return result.rows;
};

const deleteOrder = async (id) => {
    try {
        const result = await pool.query(
            'DELETE FROM "Orders" WHERE id = $1 RETURNING *',
            [id]
        );
        return result.rows[0]; 
    } catch (error) {
        console.error('Ошибка при удалении заказа:', error);
        throw error;
    }
};

const createAllOrdersTable = async() =>{
    await pool.query(`
        CREATE TABLE IF NOT EXISTS "AllOrders" (
            id INTEGER PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone_number VARCHAR(20) NOT NULL,
            delivery_address TEXT NOT NULL,
            product_id INTEGER[] NOT NULL, -- Массив ID продуктов
            quantity INTEGER[] NOT NULL, -- Количество каждого продукта
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            order_status VARCHAR(50) NOT NULL DEFAULT 'В процессе' -- Состояние заказа
        );

        CREATE OR REPLACE FUNCTION copy_to_all_orders()
        RETURNS TRIGGER AS $$
        BEGIN
            INSERT INTO "AllOrders" (id, name, email, phone_number, delivery_address, product_id, quantity, createdAt, order_status)
            VALUES (NEW.id, NEW.name, NEW.email, NEW.phone_number, NEW.delivery_address, NEW.product_id, NEW.quantity, NEW.createdAt, 'В процессе');
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        CREATE TRIGGER trigger_copy_to_all_orders
        AFTER INSERT ON "Orders"
        FOR EACH ROW EXECUTE FUNCTION copy_to_all_orders();
        `);
};

const getToAllOrdersTable = async() =>{
    const result = await pool.query('SELECT * FROM "AllOrders"');
    return result.rows;
}

const updateOrderStatus = async (orderId) => {
    const result = await pool.query('UPDATE "AllOrders" SET order_status = $1 WHERE id = $2 RETURNING *', 
                    ['Выполнен', orderId]);
    return result.rowCount;
};

const cancelOrderStatus = async (orderId) => {
    await pool.query('UPDATE "AllOrders" SET order_status = $1 WHERE id = $2 RETURNING *', 
                    ['Отменен', orderId]);
};

const getUsersOrders = async (userName) => {
    try {
        const result = await pool.query('SELECT * FROM "AllOrders" WHERE name = $1', [userName]);
        return result.rows;
    } catch (error) {
        console.error("Ошибка при получении заказов из БД:", error);
        throw error;
    }
};


export { createUserTable, addUser, findUserByEmail, getAllUsers, deleteUserById, updateAdminFalse, updateAdminTrue, updateUserInfo,
        createProductTable, addProduct, deleteProduct, getAllProducts, changeProduct, getProductById, minusQuantity,
        createOrdersTable, addOrder, getAllOrders, deleteOrder,
        createAllOrdersTable, getToAllOrdersTable, updateOrderStatus, cancelOrderStatus, getUsersOrders};