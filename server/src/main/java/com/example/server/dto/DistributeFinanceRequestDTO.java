package com.example.server.dto;

import java.math.BigDecimal;
import java.util.List;

public class DistributeFinanceRequestDTO {
    private BigDecimal companyProfitAmount;
    private List<EmployeeShareDTO> employeeShares;

    public BigDecimal getCompanyProfitAmount() {
        return companyProfitAmount;
    }

    public void setCompanyProfitAmount(BigDecimal companyProfitAmount) {
        this.companyProfitAmount = companyProfitAmount;
    }

    public List<EmployeeShareDTO> getEmployeeShares() {
        return employeeShares;
    }

    public void setEmployeeShares(List<EmployeeShareDTO> employeeShares) {
        this.employeeShares = employeeShares;
    }

    public static class EmployeeShareDTO {
        private String recipientUserId;
        private BigDecimal amount;

        public String getRecipientUserId() {
            return recipientUserId;
        }

        public void setRecipientUserId(String recipientUserId) {
            this.recipientUserId = recipientUserId;
        }

        public BigDecimal getAmount() {
            return amount;
        }

        public void setAmount(BigDecimal amount) {
            this.amount = amount;
        }
    }
}
