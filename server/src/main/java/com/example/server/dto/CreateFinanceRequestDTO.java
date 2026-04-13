package com.example.server.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class CreateFinanceRequestDTO {
    @NotNull
    @DecimalMin(value = "0.01")
    private BigDecimal totalAmount;

    @NotNull
    @DecimalMin(value = "0.00")
    private BigDecimal companyProfitAmount;

    private String note;

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public BigDecimal getCompanyProfitAmount() {
        return companyProfitAmount;
    }

    public void setCompanyProfitAmount(BigDecimal companyProfitAmount) {
        this.companyProfitAmount = companyProfitAmount;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}