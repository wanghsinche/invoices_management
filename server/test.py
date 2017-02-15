#-*- coding:utf-8 -*-
import sqlite3

conn = sqlite3.connect("database.db")
cur = conn.cursor()

# 订单表
cur.execute("""
	CREATE TABLE orders
	(order_id VARCHAR(25) PRIMARY KEY NOT NULL,
	 date DATE NOT NULL,
	 name TEXT NOT NULL,
	 detail TEXT,
	 num INT DEFAULT 1,
	 unit TEXT DEFAULT 个,
	 price DECIMAL(18, 2) NOT NULL,
	 real_price DECIMAL (18, 2) NOT NULL,
	 exist INT DEFAULT 1);
	""")

# 人物表
cur.execute("""
	CREATE TABLE users
	(ownner_id INTEGER PRIMARY KEY AUTOINCREMENT,
	 work_num VARCHAR(25) NOT NULL UNIQUE,
	 name TEXT NOT NULL,
	 exist INT DEFAULT 1);
	""")

# 发票表
cur.execute("""
	CREATE TABLE invoices
	(invoice_id INTEGER PRIMARY KEY AUTOINCREMENT,
	 price DECIMAL(18, 2) NOT NULL,
	 created_date DATE NOT NULL,
	 category TEXT NOT NULL,	 
	 exist INT DEFAULT 1);
	""")

# 记录表
cur.execute("""
	CREATE TABLE records
	(ownner_id INTEGER NOT NULL,
	 order_id VARCHAR(25) NOT NULL,
	 invoice_id INTEGER NOT NULL,
	 ps TEXT,
	 exist INT DEFAULT 1,
	 PRIMARY KEY(ownner_id, order_id));
	""")

conn.commit()
result = cur.fetchall()
conn.close()
print result

