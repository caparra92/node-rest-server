//=====================
//    Puerto
//=====================
process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//=====================
//    Expiracion Token
//=====================
process.env.EXPIRACION = 60 * 60 * 24 * 30;

//=====================
//    SEED
//=====================
process.env.SEED = process.env.SEED || 'este-es-el-seed-de-desarrollo';
//=====================
//    Base de datos
//=====================
let urlDB;

if(process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//=====================
//    Google CLIENT
//=====================
process.env.CLIENT_ID = process.env.CLIENT_ID || '998834891345-m93dt6qrea6h8dav195m9anfqu3lv79u.apps.googleusercontent.com'

