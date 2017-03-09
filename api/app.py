import web
import model
import json

urls = (
	'/', 'Index',
	'/user','User',
	'/good/(\w+)','Good',
	'/invs/(\w+)','Invs',
	'/link/(\w+)','Link',
	'/history','History'
)
web.config.debug = False
render = web.template.render('template')
app = web.application(urls, locals())
session = web.session.Session(app, web.session.DiskStore('sessions'), initializer={'user': {'login':False}})

class Index:
	"""docstring for Index"""
	def GET(self):
		print session['user']['login']
		return render.index()

class User:
	"""  """

	def GET(self):
		web.header('Content-Type', 'application/json; charset=utf-8')
		out = {'msg':'ok', 'data':{}}
		params = web.input(_method='get')
		action = getattr(params, 'action', False)
		if action == 'logout':
			out['data'] = self.act_logout()
		elif action == 'alluser':
			out['data'] = self.act_alluser()
		return json.dumps(out)

	def POST(self):
		web.header('Content-Type', 'application/json; charset=utf-8')
		out = {'msg':'ok', 'data':{}}
		params = web.input(_method='post')
		action = getattr(params, 'action', False)
		if action == 'login':
			out['data'] = self.act_login(params)
		elif action == 'signup':
			out['data'] = self.act_signup(params)
		return json.dumps(out)

	def act_signup(self, params):
		result = -1
		name = getattr(params, 'name', False)
		pswd = getattr(params, 'pswd', False)
		rank = 1
		if name and pswd:
			result = model.new_user(name, pswd, rank)
		return {'id':result}

	def act_login(self, params):
		name = getattr(params, 'name', False)
		pswd = getattr(params, 'pswd', False)
		account = {'login':False, 'name':name, 'id':-1, 'rank':-1}
		if name and pswd:
			account = model.get_user(name, pswd)
			session['user'] = account
		return {'user':account}

	def act_logout(self):
		session.kill()
		return {'msg':'logout'}

	def act_alluser(self):
		result = []
		if session['user']['rank'] == 2 and session['user']['login']:
			result = model.get_all_user()
			result = [i for i in result]
		return result

class History:

	def GET(self):
		web.header('Content-Type', 'application/json; charset=utf-8')
		params = web.input(_method='get')
		out = {'msg':'fail', 'data':[]}
		fdate = getattr(params, 'fdate', False)
		tdate = getattr(params, 'tdate', False)
		page = getattr(params, 'page', 0)
		userid = -1
		result = []
		if session['user']['login']:
			if session['user']['rank'] == 2:
				userid = getattr(params, 'userid', session['user']['id'])
			else:
				userid = session['user']['id']
			if fdate and tdate:
				result = model.search_good_by_user_date(userid, int(fdate), int(tdate), int(page))
				result = [i for i in result] 
				out['msg'] = 'ok'
				out['data'] = result
				out['num'] = model.get_good_num(userid, int(fdate), int(tdate))
		return json.dumps(out)

class Link:
	def GET(self, linkid):
		web.header('Content-Type', 'application/json; charset=utf-8')
		out = {'msg':'fail', 'data':{}}
		if session['user']['login']:
			if linkid == 'new':
				pass
			else:
				result = model.get_link(linkid)
				if session['user']['id'] == result['good'].userid or session['user']['rank'] == 2:
					out['msg'] = 'ok'
					out['data'] = result
		return json.dumps(out)

if __name__ == '__main__':
	app.run()
