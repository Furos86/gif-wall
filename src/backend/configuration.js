import {get} from 'env-var'

export default class Configuration {
    static databaseHost = get('DATABASE_HOST').default('localhost').asString();
    static database = get('DATABASE').default('gifWall_db').asString();
    static databasePassword = get('DATABASE_PASSWD').default('password').asString();
    static databaseUser = get('DATABASE_USER').default('root').asString();
    static makeDatabase = get('MAKE_DATABASE').default("false").asBool();
}
