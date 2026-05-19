package com.vas.vas_platform.dto;

public class SubscriberLoginRequest {

    private String msisdn;
    private String password;

    public String getMsisdn() {
        return msisdn;
    }

    public void setMsisdn(String msisdn) {
        this.msisdn = msisdn;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}