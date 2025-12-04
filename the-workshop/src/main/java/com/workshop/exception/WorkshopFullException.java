package com.workshop.exception;

public class WorkshopFullException extends RuntimeException {

    public WorkshopFullException(String message) {
        super(message);
    }

    public WorkshopFullException(Long workshopId) {
        super("Workshop with ID " + workshopId + " is fully booked");
    }
}