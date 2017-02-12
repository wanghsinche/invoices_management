let auth = {
	name : '',
	login : function(id){
		var tempdate = new Date();
		tempdate.setDate(tempdate.getDate() + 3);
		window.document.cookie = 'id=' + id + ';expires=' + tempdate.toUTCString();
	},
	logout : function(){
		var tempdate = new Date(0);
		window.document.cookie = 'id=0;expires=' + tempdate.toUTCString();
	},
	islogin : function(){
		var result = false;
		var matchls = window.document.cookie.match(/id=(.*)/);
		if (matchls !== null) {
			this.name = matchls[1];
			result = true;
		}
		return result;
	},
	getName : function(){
		return this.name;
	}
}



export default auth;