package com.tieto.cs.stock.model;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.Digits;
import javax.validation.constraints.Size;
import java.io.Serializable;


/**
 * JPA entity class for R_STOCK_TERMINALS
 */
@Data
@Entity
@Table(name = "R_STOCK_TERMINALS")
public class Terminal implements Serializable {

    @Id
    @Digits(integer = 16, fraction = 0)
    @Column(name = "ID")
    private Long id;

    @Column(name = "TYPE")
    @Size(max = 32)
    private String type;

    @Column(name = "STATE")
    @Size(max = 32)
    private String state;

    @Column(name = "TYPE_GROUP")
    @Size(max = 32)
    private String group;

    @Column(name = "TYPECLASS")
    @Size(max = 32)
    private String typeclass;

    @Column(name = "INSTITUTION")
    @Size(max = 16)
    private String institution;

    @Column(name = "TLMS_STATUS")
    @Size(max = 512)
    private String tlms_status;

    @Column(name = "TLMS_INVENTORY_NO")
    @Size(max = 512)
    private String tlms_inventory_no;

    @Column(name = "TLMS_TERMINAL_MODEL")
    @Size(max = 512)
    private String tlms_terminal_model;

    @Column(name = "TLMS_LOCATION")
    @Size(max = 512)
    private String tlms_location;

    @Column(name = "TLMS_TERMINAL_ID")
    @Size(max = 512)
    private String tlms_terminal_id;

    @Column(name = "TLMS_ACCEPTOR_ID")
    @Size(max = 512)
    private String tlms_acceptor_id;

    @Column(name = "TLMS_NAME")
    @Size(max = 512)
    private String tlms_name;

    @Column(name = "TLMS_POINT_CODE")
    @Size(max = 512)
    private String tlms_point_code;

    @Column(name = "TLMS_SERIAL_NO")
    @Size(max = 512)
    private String tlms_serial_no;

    @Column(name = "TLMS_PURCHASE_DATE")
    @Size(max = 512)
    private String tlms_purchase_date;

    @Column(name = "TLMS_ADD_INFO")
    @Size(max = 512)
    private String tlms_add_info;
}