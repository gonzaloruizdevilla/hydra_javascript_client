var server_api = require('../server_api'),
	hydra = server_api.hydra;

module.exports = function(req, res){
	try{
		var server = {
			url : req.body.url,
			sibling : req.body.sibling,
			status : req.body.status
		};


		hydra.server.update(server, function(err){
			console.log('updated', item);
			if(err !== null){
				res.send(400,'Bad request');
			} else {
				res.send(200,{});
			}
		});
	} catch (ex){
		console.log(ex);
		res.send(400,'Bad request');
	}

	res.send(400,'Bad request');
};
