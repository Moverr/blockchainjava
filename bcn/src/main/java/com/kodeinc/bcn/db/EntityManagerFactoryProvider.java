package com.kodeinc.bcn.db;

import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Created by Mover on 4/27/2017.
 */
public class EntityManagerFactoryProvider {

    // testing
    public enum DBModule {
        SC_BACK, SC_ENGINE
    };

    private String host = null;
    private String username = null;
    private String password = null;
    private String default_db = null;

    private static EntityManagerFactoryProvider instance;
    private final Map<String, EntityManagerFactory> factories;

    private static final Logger LOG = Logger.getLogger(EntityManagerFactoryProvider.class.getName());

    public EntityManagerFactoryProvider() {
        factories = new HashMap<>();
    }

    public static EntityManagerFactoryProvider getInstance() {
//        if (instance == null) {
//            instance = new EntityManagerFactoryProvider();
//        }
        instance = new EntityManagerFactoryProvider();
        return instance;
    }

    public EntityManagerFactory getFactory() {

        EntityManagerFactory factory = null;

        try { 
            factory = createFactory();
        } catch (Exception er) {
            throw er;
        }

        return factory;

    }

    public EntityManagerFactory createFactory() {

 

        EntityManagerFactory emf = null;
        Map<String, String> properties = new HashMap<>();

        //properties.put("hibernate.connection.url", "jdbc:mysql://" + getHost(dBModule) + "/" + database);
        properties.put("hibernate.connection.url", "jdbc:mysql://bcn:3306/bcn?useSSL=false");

        properties.put("hibernate.connection.username", "root");
        properties.put("hibernate.connection.password", "mysql");
        properties.put("hibernate.ejb.entitymanager_factory_name", "bcn");
        try {

            LOG.log(Level.SEVERE, "     PASS THREE ");

            // properties
              emf = Persistence.createEntityManagerFactory("engine", properties);

        } catch (Exception e) {
            LOG.log(Level.SEVERE, "Un Expected Error {0}", e.getStackTrace());
            e.getStackTrace();
            throw e;
        }

        return emf;
    }

    public static void setInstance(EntityManagerFactoryProvider instance) {
        EntityManagerFactoryProvider.instance = instance;
    }

    public Map<String, EntityManagerFactory> getFactories() {
        return factories;
    }

    public static Logger getLOG() {
        return LOG;
    }

    private String getDatabase(DBModule dBModule) {

        switch (dBModule.toString()) {
            case "SC_BACK":
                return "scholar-tenants";
            case "SC_ENGINE":
                return "scholar-engine";
            default:
                return "scholar-tenants";
        }

    }

    public String getHost(DBModule dBModule) {
        host = System.getProperty("SC_CLIENT_DB_HOST");

        switch (dBModule.toString()) {
            case "SC_BACK":
                return "localhost";
            case "SC_ENGINE":
                return "localhost";
            default:
                return "localhost";
        }

        // return host;
    }

    public String getUsername(DBModule dBModule) {
//        username = System.getProperty("SC_CLIENT_DB_USER");
//        return username;

        switch (dBModule.toString()) {
            case "SC_BACK":
                return "root";
            case "SC_ENGINE":
                return "root";
            default:
                return "root";
        }

    }

    public String getPassword(DBModule dBModule) {
//        password = System.getProperty("SC_CLIENT_DB_PASSWORD");
//        return password;

        switch (dBModule.toString()) {
            case "SC_BACK":
                return "mysql";
            case "SC_ENGINE":
                return "mysql";
            default:
                return "mysql";
        }

    }

    public String getDefault_db() {
        default_db = "scholar-tenants";
        return default_db;
    }

}
