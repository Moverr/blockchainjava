/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.kodeinc.bcn.db.helper;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author mover 1/24/2018
 */
public class TimeZoneManager {

    String DATE_FORMAT = "yyyy-MM-dd  HH:mm:ss";

    //convert locateTime to Standard Date Format in UTC 
    public String convertLocatTimeToSDFUTC(long time) {
        SimpleDateFormat sdf = new SimpleDateFormat(DATE_FORMAT);
        sdf.setTimeZone(getUtCTimeZone());
        return sdf.format(new Date(time));
    }

    //todo: convert local Date to Time in UTC 
    public long convertLocatDateToTimeUTC(String dateString) throws ParseException {
        try {
            SimpleDateFormat format = new SimpleDateFormat(DATE_FORMAT);
            format.setTimeZone(TimeZone.getTimeZone("UTC"));

            Date date = format.parse(dateString);
            long millis = date.getTime();

            return millis;
        } catch (ParseException ex) {
            Logger.getLogger(TimeZoneManager.class.getName()).log(Level.SEVERE, null, ex);
            throw ex;
        }

    }

    //todo: convert time to local simple date format
    public String convertUTCTimeToSDFLocal(long time, String zone) {
        SimpleDateFormat sdf = new SimpleDateFormat(DATE_FORMAT);
        sdf.setTimeZone(getLocalTimeZone(zone));
        return sdf.format(new Date(time));
    }

    //todo: convert local Date to Time in UTC
    public long convertUTCtDateToTimeLocal(String dateString, String zone) throws ParseException {
        try {
            SimpleDateFormat format = new SimpleDateFormat(DATE_FORMAT);
            format.setTimeZone(getLocalTimeZone(zone));

            Date date = format.parse(dateString);
            long millis = date.getTime();

            return millis;
        } catch (ParseException ex) {
            Logger.getLogger(TimeZoneManager.class.getName()).log(Level.SEVERE, null, ex);
            throw ex;
        }

    }

    //todo: convert time to local simple date format 
    public TimeZone getUtCTimeZone() {
        TimeZone timeZone = TimeZone.getTimeZone("UTC");
        return timeZone;
    }

    //todo: convert time to local simple date format
    public TimeZone getLocalTimeZone(String zone) {
        TimeZone timeZone = TimeZone.getTimeZone(zone);
        return timeZone;
    }

    public String convertDateToDateUTC(Date date) {
        SimpleDateFormat sdf = new SimpleDateFormat();
        sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
        return sdf.format(date);
    }

//    public Date convert() {
//        long time = 1427723278405L;
//        SimpleDateFormat sdf = new SimpleDateFormat();
//        sdf.setTimeZone(getTimeZone("UTC"));
//        // System.out.println(sdf.format(new Date(time)));
//    }
}
