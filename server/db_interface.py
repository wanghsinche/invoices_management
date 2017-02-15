#-*- coding:utf-8 -*-
import sqlite3
import datetime
from string import Template
import json

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

class DbOpener(object):
	"""docstring for DbOpener"""	
	def __init__(self, path):
		super(DbOpener, self).__init__()
		self.path = path
		try:
			self.__conn = sqlite3.connect(path)
			self.__conn.row_factory = dict_factory
			self.curr = self.__conn.cursor()

		except Exception, e:
			raise e
	def __del__(self):
		self.__conn.close()

	def insert(self, formName, item):
		values = []
		for val in item.values():
			if type(val) is str or type(val) is unicode:
				values.append("'" + val + "'")
			elif type(val) is datetime.date:
				values.append("'" + str(val) + "'")
			elif type(val) is int or type(val) is float:
				values.append(str(val))
			else:
				msg = {"state":"wrong_input"}
				return json.dumps(msg, ensure_ascii=False).encode('utf8')

		frag1 = ", ".join(item.keys())
		frag2 = ", ".join(values)
		script = "insert into {} ({}) values ({})".format(formName, frag1, frag2)
		try:
			self.curr.execute(script)
			self.__conn.commit()
			if self.curr.rowcount == 1:
				msg = {"state":"ok", "data":self.curr.lastrowid}
			else:
				msg = {"state":"fail"}
		except Exception, e:
			print e
			msg = {"state":str(e)}

		return json.dumps(msg, ensure_ascii=False).encode('utf8')

	def show_and(self, formName, want, constraint):
		if want != "*":
			frag1 = ", ".join(want)
		else:
			frag1 = "*"

		frag2 = []
		for key, val in constraint.iteritems():
			if type(val) is str or type(val) is unicode:
				frag2.append(key + "='" + val + "'")
			elif type(val) is datetime.date:
				frag2.append(key + "='" + str(val) + "'")
			elif type(val) is int or type(val) is float:
				frag2.append(key + "=" + str(val))
			else:
				msg = {"state":"wrong_input"}
				return json.dumps(msg, ensure_ascii=False).encode('utf8')
		
		frag2 = " and ".join(frag2)
		script = "select {} from {} where {}".format(frag1, formName, frag2)
		try:
			self.curr.execute(script)
			data = self.curr.fetchall()
			msg = {"state":"ok", "data":data}
		except Exception, e:
			print e
			msg = {"state":str(e)}

		return json.dumps(msg, ensure_ascii=False).encode('utf8')

	def update_and(self, formName, values, constraint):

		frag1 = []
		for key, val in values.iteritems():
			if type(val) is str or type(val) is unicode:
				frag1.append(key + "='" + val + "'")
			elif type(val) is datetime.date:
				frag1.append(key + "='" + str(val) + "'")
			elif type(val) is int or type(val) is float:
				frag1.append(key + "=" + str(val))
			else:
				msg = {"state":"wrong_input"}
				return json.dumps(msg, ensure_ascii=False).encode('utf8')


		frag2 = []
		for key, val in constraint.iteritems():
			if type(val) is str or type(val) is unicode:
				frag2.append(key + "='" + val + "'")
			elif type(val) is datetime.date:
				frag2.append(key + "='" + str(val) + "'")
			elif type(val) is int or type(val) is float:
				frag2.append(key + "=" + str(val))
			else:
				msg = {"state":"wrong_input"}
				return json.dumps(msg, ensure_ascii=False).encode('utf8')
		frag1 = ", ".join(frag1)
		frag2 = " and ".join(frag2)
		script = "update {} set {} where {}".format(formName, frag1, frag2)
		try:
			self.curr.execute(script)
			self.__conn.commit()
			if self.curr.rowcount >= 1:
				msg = {"state":"ok", "data":{"rowcount":self.curr.rowcount}}
			else:
				msg = {"state":"fail"}
		except Exception, e:
			print e
			msg = {"state":str(e)}

		return json.dumps(msg, ensure_ascii=False).encode('utf8')
