/**
 * 
 */
package com.rats.karobar.config;

import java.util.TimeZone;

import javax.annotation.PostConstruct;

import org.springframework.stereotype.Component;

/**
 * @author Maneesh
 *
 */
@Component
public class TimeZoneConfig {

	@PostConstruct
	void started() {
	    TimeZone.setDefault(TimeZone.getTimeZone("CST6CDT"));
	}
}
