package com.cpen321.gruwup;

public class Message {
    String userId, name, message, dateTime, prevTime, messageStatus;

    // "sent" or "received"
    public String getMessageStatus() {
        return messageStatus;
    }

    public void setMessageStatus(String messageStatus) {
        this.messageStatus = messageStatus;
    }

    public Message(String userId, String name, String message, String dateTime, String prevTime, String messageStatus) {
        this.userId = userId;
        this.name = name;
        this.message = message;
        this.dateTime = dateTime;
        this.prevTime = prevTime;
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

    public String getPrevTime() {
        return prevTime;
    }

    public void setPrevTime(String prevTime) {
        this.prevTime = prevTime;
    }
}
