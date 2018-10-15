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

    public EntityManagerFactory getFactory(DBModule dBModule, String database) {

        EntityManagerFactory factory = null;

        try {
//            if (factories.containsKey(database)) {
//                LOG.log(Level.INFO, "Re Using Existing Database ");
//                factory = factories.get(database);
//            } else {
//                LOG.log(Level.INFO, " ====   LIKE REALLY  == {0} ", database);
//
//                factory = createFactory(dBModule, database);
//            }

            factory = createFactory(dBModule, database);
        } catch (Exception er) {
            throw er;
        }

        return factory;

    }

    public EntityManagerFactory createFactory(DBModule dBModule, String database) {

        LOG.log(Level.INFO, " ====   {0} ====  ", database);

        EntityManagerFactory emf = null;
        Map<String, String> properties = new HashMap<>();

        //properties.put("hibernate.connection.url", "jdbc:mysql://" + getHost(dBModule) + "/" + database);
        properties.put("hibernate.connection.url", "jdbc:mysql://" + getHost(dBModule) + ":3306/" + database + "?useSSL=false");

        properties.put("hibernate.connection.username", getUsername(dBModule));
        properties.put("hibernate.connection.password", getPassword(dBModule));
        properties.put("hibernate.ejb.entitymanager_factory_name", database);
        try {

            LOG.log(Level.SEVERE, "     PASS THREE ");

            // properties
            switch (dBModule.toString()) {
                case "SC_BACK":
                    emf = Persistence.createEntityManagerFactory("scholar", properties);
                    break;
                case "SC_ENGINE":
                    emf = Persistence.createEntityManagerFactory("engine", properties);
                    break;
                default:
                    emf = Persistence.createEntityManagerFactory("scholar", properties);
                    break;
            }

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
