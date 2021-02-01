import envVar from 'env-var'
const {get} = envVar;

export default class Configuration {
    static databaseHost = get('DATABASE_HOST').default('localhost').asString();
    static database = get('DATABASE').default('gifWall_db').asString();
    static databasePassword = get('DATABASE_PASSWD').default('password').asString();
    static databaseUser = get('DATABASE_USER').default('root').asString();
    static makeDatabase = get('MAKE_DATABASE').default("false").asBool();
    static localFileStoreLocation = get('FILE_STORE_LOCATION').default('/file_store').asString();
}