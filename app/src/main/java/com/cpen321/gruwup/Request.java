package com.cpen321.gruwup;

public class Request {
    private String requesterName, requesterId, requestId, status;

    public Request(String requesterName, String requesterId, String requestId, String status) {
        this.requesterName = requesterName;
        this.requesterId = requesterId;
        this.requestId = requestId;
        this.status = status;
    }

    public String getRequesterName() {
        return requesterName;
    }

    public void setRequesterName(String requesterName) {
        this.requesterName = requesterName;
    }

    public String getRequesterId() {
        return requesterId;
    }

    public void setRequesterId(String requesterId) {
        this.requesterId = requesterId;
    }

    public String getRequestId() {
        return requestId;
    }

    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
