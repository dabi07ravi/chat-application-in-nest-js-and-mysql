import AppConfig from 'src/config/app.config';
import MySql from 'src/config/mysql.config';
import RMQ from 'src/config/rmq.config';
import Auth from 'src/config/auth.config';
import Redis from './redis.config'
export default [AppConfig, MySql, RMQ,Auth,Redis];
