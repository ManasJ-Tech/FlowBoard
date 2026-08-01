package com.manas.flowboard.repository;

import com.manas.flowboard.entity.RoomMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomMessageRepository extends JpaRepository<RoomMessage, Long> {

    List<RoomMessage> findByProjectIdOrderByCreatedAtDesc(Long projectId);

}
