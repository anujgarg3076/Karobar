package com.rats.karobar.config;

import java.text.SimpleDateFormat;
import java.time.format.DateTimeFormatter;

/**
 * Common config for date and time.
 * 
 * @author Rohit
 *
 */
public class DateTimeConfig {

	public static final String DATE_FORMAT = "MM-dd-yyyy";
	
	public static final String LOCAL_DATE_FORMAT = "yyyy-MM-dd";
	
	public static final String DATE_TIME_FORMAT = "MM-dd-yyyy HH:mm:ss";

	private static final SimpleDateFormat dateFormat = new SimpleDateFormat(DATE_FORMAT);

	private static final DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern(DateTimeConfig.DATE_FORMAT);

	public static final SimpleDateFormat getDateFormat() {
		return dateFormat;
	}

	public static final DateTimeFormatter getDateTimeFormatter () {
		return dateTimeFormatter;
	}
}
