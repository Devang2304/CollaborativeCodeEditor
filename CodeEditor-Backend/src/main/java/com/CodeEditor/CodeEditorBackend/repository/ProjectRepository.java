package com.CodeEditor.CodeEditorBackend.repository;

import com.CodeEditor.CodeEditorBackend.model.Project;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProjectRepository extends MongoRepository<Project,String> {

    Optional<Project> findByRoom(String room);

}
