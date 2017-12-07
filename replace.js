var url = "http://localhost:8080/api/book";

url = url.replace(/\/api\/(.+)/,'\/$1\.json');

console.log(url);