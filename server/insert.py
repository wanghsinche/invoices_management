#-*- coding:utf-8 -*-
import db_interface as db_api
import datetime  

mydb = db_api.DbOpener("database.db")


ownner_id = 5
formName = "records"

# for i in range(5):
# 	item = {"ownner_id":ownner_id, "order_id":"45053"+str(i), "invoice_id":0}
# 	print mydb.insert(formName, item)

constraint = {"ownner_id":ownner_id, "invoice_id":0}
value = {"invoice_id":5}
print mydb.show_and(formName, "*", constraint)