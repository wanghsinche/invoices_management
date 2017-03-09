#-*- coding:utf-8 -*-
import web

db = web.database(dbn='sqlite', db='./database.db')

#user

def new_user(name, pswd, rank):
	return db.insert('user', name=name, pswd=pswd, rank=rank)

def get_user(name, pswd):
	result = db.select('user', where='name=$name', what='pswd, id, name, rank', vars=locals())
	account = {'login':False, 'name':name, 'id':-1, 'rank':-1}
	temp = [i for i in result]
	if len(temp) > 0:
		if temp[0]['pswd'] == pswd:
			account['login'] = True
			account['id'] = temp[0].id
			account['rank'] = temp[0].rank
	return account

def del_user(id):
	return db.delete('user', where='id=$id', vars=locals())

def get_all_user():
	return db.select('user', what='id, name, rank', vars=locals())


#link

def new_link(userid, goodid, invsid=0):
	return db.insert('link', userid=userid, goodid=goodid, invsid=invsid)

def get_link(id):
	result1 = db.query('''
		select link.id, link.userid, link.invsid, link.goodid, 
		good.name, good.price, good.priceAll, good.num, good.buyDate
		from link join good on link.goodid = good.id and link.id = $id
		''', vars=locals())[0]
	print result1
	result2 = db.select('invs', where='id=$invsid', vars={'invsid':result1.invsid})[0]
	return {'good':result1, 'invs':result2}

#good

def search_good_by_user_date(userid, f_date, t_date, page):
	limit = 10
	offset = page * limit
	result = db.query('''
		select 
		good.name, good.priceAll, good.buyDate, link.invsid, link.id
		from good join link 
		on good.id = link.goodid and $f_date <= good.buyDate and good.buyDate < $t_date and link.userid = $userid
		order by good.buyDate
		limit $limit offset $offset
		''', vars=locals())
	return result
	
def get_good_num(userid, f_date, t_date):
	result = db.query('''
		select 
		count(*)
		from good join link 
		on good.id = link.goodid and $f_date <= good.buyDate and good.buyDate < $t_date and link.userid = $userid
		order by good.buyDate
		''', vars=locals())
	return int(result[0]['count(*)'])