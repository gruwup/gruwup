package com.cpen321.gruwup;

public class Message {

    String userId;
    String name;
    String message;
    String dateTime;
    String messageStatus;

    // messageStatus can be "sent" or "received"
    public String getMessageStatus() {
        return messageStatus;
    }

    public void setMessageStatus(String messageStatus) {
        this.messageStatus = messageStatus;
    }

    public Message(String userId, String name, String message, String dateTime,  String messageStatus) {
        this.userId = userId;
        this.name = name;
        this.message = message;
        this.dateTime = dateTime;
        this.messageStatus = messageStatus;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getDateTime() {
        return dateTime;
    }

    public void setDateTime(String dateTime) {
        this.dateTime = dateTime;
    }
}
