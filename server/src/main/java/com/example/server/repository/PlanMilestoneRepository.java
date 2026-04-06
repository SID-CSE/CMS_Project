package com.example.server.repository;

import com.example.server.entity.PlanMilestone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PlanMilestoneRepository extends JpaRepository<PlanMilestone, String> {
    List<PlanMilestone> findByPlanIdOrderByOrderIndex(String planId);
}
