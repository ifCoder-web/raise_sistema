if(process.env.NODE_ENV == "production"){
	module.exports = {mongoURI: "mongodb+srv://ifcoderweb:92558164@cluster0.lcvh8.mongodb.net/sistema1?retryWrites=true&w=majority"}
}else{
	module.exports = {mongoURI: "mongodb://localhost:27017/sistema1"}
}