package com.manas.flowboard.dto;

public class AuthResponse {

    private String token;

    private String message;

    private String managerCode;


    public AuthResponse(String token, String message) {
        this.token = token;
        this.message = message;
    }

    public AuthResponse(String token, String message, String managerCode) {
        this.token = token;
        this.message = message;
        this.managerCode = managerCode;
    }


    public String getToken() {
        return token;
    }


    public String getMessage() {
        return message;
    }

    public String getManagerCode() {
        return managerCode;
    }
}
