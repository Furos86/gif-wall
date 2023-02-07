import envVar from 'env-var'
const {get} = envVar;

export default class Configuration {
    static databaseHost = get('DATABASE_HOST').default('localhost').asString();
    static database = get('DATABASE').default('gifWall_db').asString();
    static databasePassword = get('DATABASE_PASSWD').default('pass').asString();
    static databaseUser = get('DATABASE_USER').default('root').asString();
    static makeDatabase = get('MAKE_DATABASE').default("false").asBool();
    static localFileStoreLocation = get('FILE_STORE_LOCATION').default('/file_store').asString();
    static authPassword = get("AUTH_PASS").default('admin').asString();
    static nodeEnv = get("NODE_ENV").asString();
}
